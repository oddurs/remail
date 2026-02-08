import { createServiceClient } from "@/lib/supabase/server";
import { CONTACT_TEMPLATES } from "./contacts";
import { EMAIL_TEMPLATES, DRAFT_TEMPLATE_INDEX } from "./emails";
import { generateThreadTemplates } from "./generated-threads";

const SYSTEM_LABELS = [
  { name: "INBOX", position: 0 },
  { name: "STARRED", position: 1 },
  { name: "SNOOZED", position: 2 },
  { name: "SENT", position: 3 },
  { name: "DRAFTS", position: 4 },
  { name: "ALL_MAIL", position: 5 },
  { name: "SPAM", position: 6 },
  { name: "TRASH", position: 7 },
  { name: "IMPORTANT", position: 8 },
];

const USER_LABELS = [
  { name: "Work", color: "#1E88E5", icon: "work", position: 0 },
  { name: "Personal", color: "#00ACC1", icon: "person", position: 1 },
  { name: "Finance", color: "#FFB300", icon: "payments", position: 2 },
  { name: "Travel", color: "#8E24AA", icon: "flight", position: 3 },
  { name: "Receipts", color: "#E53935", icon: "receipt", position: 4 },
];

/**
 * Seed a session with contacts, labels, threads, and emails.
 * This runs server-side using the service role client.
 */
export async function seedSession(sessionId: string): Promise<void> {
  const supabase = createServiceClient();

  // 1. Create "self" contact (the session user — Neil Lawner)
  const { data: selfContact, error: selfError } = await supabase
    .from("gmail_contacts")
    .insert({
      session_id: sessionId,
      name: "Neil Lawner",
      email: "neil.lawner@gmail.com",
      avatar_url: "https://i.pravatar.cc/150?u=neil.lawner@gmail.com",
      is_self: true,
    })
    .select("id")
    .single();

  if (selfError)
    throw new Error(`Failed to create self contact: ${selfError.message}`);

  // 2. Create contacts
  const contactInserts = CONTACT_TEMPLATES.map((c) => ({
    session_id: sessionId,
    name: c.name,
    email: c.email,
    avatar_url: c.avatar_url,
    is_self: false,
  }));

  const { data: contacts, error: contactsError } = await supabase
    .from("gmail_contacts")
    .insert(contactInserts)
    .select("id");

  if (contactsError)
    throw new Error(`Failed to create contacts: ${contactsError.message}`);

  // Map: contactIndex -> contact UUID. -1 = self.
  const contactIdMap = new Map<number, string>();
  contactIdMap.set(-1, selfContact.id);
  contacts.forEach((c, i) => contactIdMap.set(i, c.id));

  // 3. Create system labels
  const systemLabelInserts = SYSTEM_LABELS.map((l) => ({
    session_id: sessionId,
    name: l.name,
    type: "system" as const,
    position: l.position,
  }));

  const { data: systemLabels, error: sysLabelError } = await supabase
    .from("gmail_labels")
    .insert(systemLabelInserts)
    .select("id, name");

  if (sysLabelError)
    throw new Error(`Failed to create system labels: ${sysLabelError.message}`);

  // 4. Create user labels
  const userLabelInserts = USER_LABELS.map((l) => ({
    session_id: sessionId,
    name: l.name,
    color: l.color,
    icon: l.icon,
    type: "user" as const,
    position: l.position,
  }));

  const { data: userLabels, error: userLabelError } = await supabase
    .from("gmail_labels")
    .insert(userLabelInserts)
    .select("id, name");

  if (userLabelError)
    throw new Error(`Failed to create user labels: ${userLabelError.message}`);

  // Label name -> UUID map
  const labelMap = new Map<string, string>();
  systemLabels.forEach((l) => labelMap.set(l.name, l.id));
  userLabels.forEach((l) => labelMap.set(l.name, l.id));

  // 5. Create threads and emails (batched for performance)
  const now = new Date();
  const allTemplates = [...EMAIL_TEMPLATES, ...generateThreadTemplates()];
  // Draft index only applies to the original EMAIL_TEMPLATES
  const draftIndex = DRAFT_TEMPLATE_INDEX;

  // Resolve relative snooze strings like "+3d" or "+12h" to absolute ISO dates
  function resolveSnooze(relative: string): string {
    const match = relative.match(/^\+(\d+)([dh])$/);
    if (!match) return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
    const amount = parseInt(match[1], 10);
    const unit = match[2];
    const ms = unit === "d" ? amount * 24 * 60 * 60 * 1000 : amount * 60 * 60 * 1000;
    return new Date(now.getTime() + ms).toISOString();
  }

  // --- Pass 1: Prepare all thread insert objects ---
  const threadInserts = allTemplates.map((template) => {
    const lastMessage = template.messages[template.messages.length - 1];
    const lastMessageTime = new Date(
      now.getTime() - lastMessage.hoursAgo * 60 * 60 * 1000,
    );
    return {
      session_id: sessionId,
      subject: template.subject,
      last_message_at: lastMessageTime.toISOString(),
      message_count: template.messages.length,
      summary: template.summary ?? null,
    };
  });

  // --- Pass 2: Batch insert threads ---
  const { data: threads, error: threadsError } = await supabase
    .from("gmail_threads")
    .insert(threadInserts)
    .select("id");

  if (threadsError)
    throw new Error(`Failed to create threads: ${threadsError.message}`);

  // --- Pass 3: Prepare all email insert objects ---
  type EmailInsert = {
    session_id: string;
    thread_id: string;
    from_contact_id: string;
    subject: string;
    body_html: string;
    body_text: string;
    snippet: string;
    sent_at: string;
    is_draft: boolean;
    is_read: boolean;
    is_starred: boolean;
    is_important: boolean;
    is_spam: boolean;
    is_trash: boolean;
    is_archived: boolean;
    snooze_until: string | null;
    category: string;
    category_confidence: number;
    priority_score: number;
    suggested_replies: string[] | null;
  };

  // Track per-email metadata for recipients and labels
  type EmailMeta = {
    fromContactIndex: number;
    contactIndex: number; // thread's primary contact
    isLastMessage: boolean;
    labels?: string[];
  };

  const emailInserts: EmailInsert[] = [];
  const emailMeta: EmailMeta[] = [];

  for (let tIdx = 0; tIdx < allTemplates.length; tIdx++) {
    const template = allTemplates[tIdx];
    const threadId = threads[tIdx].id;
    const isDraft = tIdx === draftIndex;
    const lastMessage = template.messages[template.messages.length - 1];
    const isSnoozed = !!template.snoozeUntil;

    for (const msg of template.messages) {
      const sentAt = new Date(now.getTime() - msg.hoursAgo * 60 * 60 * 1000);
      const fromContactId = contactIdMap.get(msg.fromContactIndex);
      if (!fromContactId) continue;

      const snippet =
        msg.bodyText.length > 140
          ? msg.bodyText.slice(0, 140).trimEnd() + "..."
          : msg.bodyText;

      const isLastMessage = msg === lastMessage;

      emailInserts.push({
        session_id: sessionId,
        thread_id: threadId,
        from_contact_id: fromContactId,
        subject: template.subject,
        body_html: msg.bodyHtml,
        body_text: msg.bodyText,
        snippet,
        sent_at: sentAt.toISOString(),
        is_draft: isDraft && isLastMessage,
        is_read: msg.isRead,
        is_starred: isLastMessage ? (template.isStarred ?? false) : false,
        is_important: isLastMessage ? (template.isImportant ?? false) : false,
        is_spam: template.isSpam ?? false,
        is_trash: template.isTrash ?? false,
        is_archived: isSnoozed,
        snooze_until: isSnoozed ? resolveSnooze(template.snoozeUntil!) : null,
        category: template.category,
        category_confidence: template.categoryConfidence ?? 0.95,
        priority_score: template.priorityScore ?? 0.5,
        suggested_replies: (isLastMessage && template.suggestedReplies) ? template.suggestedReplies : null,
      });

      emailMeta.push({
        fromContactIndex: msg.fromContactIndex,
        contactIndex: template.contactIndex,
        isLastMessage,
        labels: isLastMessage ? template.labels : undefined,
      });
    }
  }

  // --- Pass 4: Batch insert emails (in chunks to avoid payload limits) ---
  const CHUNK_SIZE = 200;
  const allEmailIds: string[] = [];

  for (let i = 0; i < emailInserts.length; i += CHUNK_SIZE) {
    const chunk = emailInserts.slice(i, i + CHUNK_SIZE);
    const { data: emailRows, error: emailError } = await supabase
      .from("gmail_emails")
      .insert(chunk)
      .select("id");

    if (emailError)
      throw new Error(`Failed to create emails (chunk ${i}): ${emailError.message}`);

    allEmailIds.push(...emailRows.map((e) => e.id));
  }

  // --- Pass 5: Batch insert recipients ---
  const recipientInserts: Array<{ email_id: string; contact_id: string; type: string }> = [];

  for (let i = 0; i < allEmailIds.length; i++) {
    const meta = emailMeta[i];
    const emailId = allEmailIds[i];

    if (meta.fromContactIndex === -1) {
      // Sent by self -> to the thread's primary contact
      const toContactId = contactIdMap.get(meta.contactIndex);
      if (toContactId) {
        recipientInserts.push({ email_id: emailId, contact_id: toContactId, type: "to" });
      }
    } else {
      // Sent by contact -> to self
      recipientInserts.push({ email_id: emailId, contact_id: selfContact.id, type: "to" });
    }
  }

  for (let i = 0; i < recipientInserts.length; i += CHUNK_SIZE) {
    const chunk = recipientInserts.slice(i, i + CHUNK_SIZE);
    const { error: recipError } = await supabase
      .from("gmail_email_recipients")
      .insert(chunk);
    if (recipError)
      throw new Error(`Failed to create recipients (chunk ${i}): ${recipError.message}`);
  }

  // --- Pass 6: Batch insert label assignments ---
  const labelAssignments: Array<{ email_id: string; label_id: string }> = [];

  for (let i = 0; i < allEmailIds.length; i++) {
    const meta = emailMeta[i];
    if (meta.isLastMessage && meta.labels) {
      for (const labelName of meta.labels) {
        const labelId = labelMap.get(labelName);
        if (labelId) {
          labelAssignments.push({ email_id: allEmailIds[i], label_id: labelId });
        }
      }
    }
  }

  if (labelAssignments.length > 0) {
    for (let i = 0; i < labelAssignments.length; i += CHUNK_SIZE) {
      const chunk = labelAssignments.slice(i, i + CHUNK_SIZE);
      const { error: labelError } = await supabase
        .from("gmail_email_labels")
        .insert(chunk);
      if (labelError)
        throw new Error(`Failed to create label assignments (chunk ${i}): ${labelError.message}`);
    }
  }

  // 6. Create a default signature
  await supabase.from("gmail_signatures").insert({
    session_id: sessionId,
    name: "Default",
    body_html:
      "<p>Best regards,<br>Neil Lawner</p><p style='color: #666; font-size: 12px;'>Sent from Gmail Redesign</p>",
    is_default: true,
  });

  // 7. Mark session as seeded
  await supabase
    .from("gmail_sessions")
    .update({ is_seeded: true })
    .eq("id", sessionId);
}
