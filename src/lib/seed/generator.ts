import { createServiceClient } from "@/lib/supabase/server";
import { CONTACT_TEMPLATES } from "./contacts";
import { EMAIL_TEMPLATES, DRAFT_TEMPLATE_INDEX } from "./emails";

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
  { name: "Work", color: "#4285f4", position: 0 },
  { name: "Personal", color: "#0d9488", position: 1 },
  { name: "Finance", color: "#f59e0b", position: 2 },
  { name: "Travel", color: "#8b5cf6", position: 3 },
  { name: "Receipts", color: "#f43f5e", position: 4 },
];

/**
 * Seed a session with contacts, labels, threads, and emails.
 * This runs server-side using the service role client.
 */
export async function seedSession(sessionId: string): Promise<void> {
  const supabase = createServiceClient();

  // 1. Create "self" contact (the session user)
  const { data: selfContact, error: selfError } = await supabase
    .from("gmail_contacts")
    .insert({
      session_id: sessionId,
      name: "Me",
      email: "guest@gmail-redesign.app",
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

  // 5. Create threads and emails
  const now = new Date();

  for (let tIdx = 0; tIdx < EMAIL_TEMPLATES.length; tIdx++) {
    const template = EMAIL_TEMPLATES[tIdx];
    const isDraft = tIdx === DRAFT_TEMPLATE_INDEX;
    const lastMessage = template.messages[template.messages.length - 1];
    const lastMessageTime = new Date(
      now.getTime() - lastMessage.hoursAgo * 60 * 60 * 1000,
    );

    // Create thread
    const { data: thread, error: threadError } = await supabase
      .from("gmail_threads")
      .insert({
        session_id: sessionId,
        subject: template.subject,
        last_message_at: lastMessageTime.toISOString(),
        message_count: template.messages.length,
      })
      .select("id")
      .single();

    if (threadError)
      throw new Error(`Failed to create thread: ${threadError.message}`);

    // Create emails in thread
    for (const msg of template.messages) {
      const sentAt = new Date(now.getTime() - msg.hoursAgo * 60 * 60 * 1000);
      const fromContactId = contactIdMap.get(msg.fromContactIndex);
      if (!fromContactId) continue;

      const snippet =
        msg.bodyText.length > 140
          ? msg.bodyText.slice(0, 140).trimEnd() + "..."
          : msg.bodyText;

      const isLastMessage = msg === lastMessage;

      const { data: email, error: emailError } = await supabase
        .from("gmail_emails")
        .insert({
          session_id: sessionId,
          thread_id: thread.id,
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
          is_spam: false,
          is_trash: false,
          is_archived: false,
          category: template.category,
        })
        .select("id")
        .single();

      if (emailError)
        throw new Error(`Failed to create email: ${emailError.message}`);

      // Create recipients (to = self if from contact, to = contact if from self)
      if (msg.fromContactIndex === -1) {
        // Sent by self -> to the thread's primary contact
        const toContactId = contactIdMap.get(template.contactIndex);
        if (toContactId) {
          await supabase.from("gmail_email_recipients").insert({
            email_id: email.id,
            contact_id: toContactId,
            type: "to",
          });
        }
      } else {
        // Sent by contact -> to self
        await supabase.from("gmail_email_recipients").insert({
          email_id: email.id,
          contact_id: selfContact.id,
          type: "to",
        });
      }

      // Apply labels
      if (isLastMessage && template.labels) {
        const labelInserts = template.labels
          .map((labelName) => {
            const labelId = labelMap.get(labelName);
            if (!labelId) return null;
            return { email_id: email.id, label_id: labelId };
          })
          .filter(
            (x): x is { email_id: string; label_id: string } => x !== null,
          );

        if (labelInserts.length > 0) {
          await supabase.from("gmail_email_labels").insert(labelInserts);
        }
      }
    }
  }

  // 6. Create a default signature
  await supabase.from("gmail_signatures").insert({
    session_id: sessionId,
    name: "Default",
    body_html:
      "<p>Best regards,<br>Guest User</p><p style='color: #666; font-size: 12px;'>Sent from Gmail Redesign</p>",
    is_default: true,
  });

  // 7. Mark session as seeded
  await supabase
    .from("gmail_sessions")
    .update({ is_seeded: true })
    .eq("id", sessionId);
}
