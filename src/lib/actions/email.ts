"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { requireSessionId } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { htmlToSnippet } from "@/lib/utils";

/* ─── Toggle Star ────────────────────────────────────────────────────────────── */

export async function toggleStar(emailId: string, starred: boolean) {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("gmail_emails")
    .update({ is_starred: starred })
    .eq("id", emailId)
    .eq("session_id", sessionId);

  if (error) throw new Error(`Failed to toggle star: ${error.message}`);
  revalidatePath("/", "layout");
}

/* ─── Toggle Important ───────────────────────────────────────────────────────── */

export async function toggleImportant(emailId: string, important: boolean) {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("gmail_emails")
    .update({ is_important: important })
    .eq("id", emailId)
    .eq("session_id", sessionId);

  if (error) throw new Error(`Failed to toggle important: ${error.message}`);
  revalidatePath("/", "layout");
}

/* ─── Mark Read / Unread ─────────────────────────────────────────────────────── */

export async function markReadStatus(emailIds: string[], isRead: boolean) {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("gmail_emails")
    .update({ is_read: isRead })
    .in("id", emailIds)
    .eq("session_id", sessionId);

  if (error) throw new Error(`Failed to mark read status: ${error.message}`);
  revalidatePath("/", "layout");
}

/* ─── Archive ────────────────────────────────────────────────────────────────── */

export async function archiveEmails(emailIds: string[]) {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("gmail_emails")
    .update({ is_archived: true })
    .in("id", emailIds)
    .eq("session_id", sessionId);

  if (error) throw new Error(`Failed to archive: ${error.message}`);
  revalidatePath("/", "layout");
}

/* ─── Move to Trash ──────────────────────────────────────────────────────────── */

export async function trashEmails(emailIds: string[]) {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("gmail_emails")
    .update({ is_trash: true })
    .in("id", emailIds)
    .eq("session_id", sessionId);

  if (error) throw new Error(`Failed to trash: ${error.message}`);
  revalidatePath("/", "layout");
}

/* ─── Untrash ────────────────────────────────────────────────────────────────── */

export async function untrashEmails(emailIds: string[]) {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("gmail_emails")
    .update({ is_trash: false })
    .in("id", emailIds)
    .eq("session_id", sessionId);

  if (error) throw new Error(`Failed to untrash: ${error.message}`);
  revalidatePath("/", "layout");
}

/* ─── Mark as Spam ───────────────────────────────────────────────────────────── */

export async function markSpam(emailIds: string[], isSpam: boolean) {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("gmail_emails")
    .update({ is_spam: isSpam })
    .in("id", emailIds)
    .eq("session_id", sessionId);

  if (error) throw new Error(`Failed to mark spam: ${error.message}`);
  revalidatePath("/", "layout");
}

/* ─── Delete Permanently ─────────────────────────────────────────────────────── */

export async function deleteEmails(emailIds: string[]) {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("gmail_emails")
    .delete()
    .in("id", emailIds)
    .eq("session_id", sessionId);

  if (error) throw new Error(`Failed to delete: ${error.message}`);
  revalidatePath("/", "layout");
}

/* ─── Archive Thread ─────────────────────────────────────────────────────────── */

export async function archiveThread(threadId: string) {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("gmail_emails")
    .update({ is_archived: true })
    .eq("thread_id", threadId)
    .eq("session_id", sessionId);

  if (error) throw new Error(`Failed to archive thread: ${error.message}`);
  revalidatePath("/", "layout");
}

/* ─── Trash Thread ───────────────────────────────────────────────────────────── */

export async function trashThread(threadId: string) {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("gmail_emails")
    .update({ is_trash: true })
    .eq("thread_id", threadId)
    .eq("session_id", sessionId);

  if (error) throw new Error(`Failed to trash thread: ${error.message}`);
  revalidatePath("/", "layout");
}

/* ─── Mark Thread Read/Unread ────────────────────────────────────────────────── */

export async function markThreadReadStatus(threadId: string, isRead: boolean) {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("gmail_emails")
    .update({ is_read: isRead })
    .eq("thread_id", threadId)
    .eq("session_id", sessionId);

  if (error)
    throw new Error(`Failed to mark thread read status: ${error.message}`);
  revalidatePath("/", "layout");
}

/* ─── Send Email ─────────────────────────────────────────────────────────────── */

interface SendEmailInput {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  bodyHtml: string;
  threadId?: string;
  inReplyToEmailId?: string;
}

export async function sendEmail(input: SendEmailInput) {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  // Get self contact
  const { data: selfContact } = await supabase
    .from("gmail_contacts")
    .select("id")
    .eq("session_id", sessionId)
    .eq("is_self", true)
    .single();

  if (!selfContact) throw new Error("Self contact not found");

  // Resolve or create contacts for recipients
  const resolveContact = async (email: string) => {
    const { data: existing } = await supabase
      .from("gmail_contacts")
      .select("id")
      .eq("session_id", sessionId)
      .eq("email", email)
      .single();

    if (existing) return existing.id;

    // Create new contact from email
    const name = email.split("@")[0].replace(/[._-]/g, " ");
    const { data: created, error } = await supabase
      .from("gmail_contacts")
      .insert({
        session_id: sessionId,
        email,
        name: name.charAt(0).toUpperCase() + name.slice(1),
      })
      .select("id")
      .single();

    if (error) throw new Error(`Failed to create contact: ${error.message}`);
    return created.id;
  };

  // Resolve all recipients
  const toContactIds = await Promise.all(input.to.map(resolveContact));
  const ccContactIds = await Promise.all((input.cc ?? []).map(resolveContact));
  const bccContactIds = await Promise.all(
    (input.bcc ?? []).map(resolveContact),
  );

  const now = new Date().toISOString();
  const bodyText = input.bodyHtml.replace(/<[^>]*>/g, "").trim();
  const snippet = htmlToSnippet(input.bodyHtml);

  // Create or use existing thread
  let threadId = input.threadId;
  if (!threadId) {
    const { data: thread, error: threadError } = await supabase
      .from("gmail_threads")
      .insert({
        session_id: sessionId,
        subject: input.subject,
        last_message_at: now,
        message_count: 1,
      })
      .select("id")
      .single();

    if (threadError)
      throw new Error(`Failed to create thread: ${threadError.message}`);
    threadId = thread.id;
  } else {
    // Update existing thread
    await supabase
      .from("gmail_threads")
      .update({
        last_message_at: now,
        message_count: (await getThreadMessageCount(supabase, threadId)) + 1,
      })
      .eq("id", threadId);
  }

  // Create the email
  const { data: email, error: emailError } = await supabase
    .from("gmail_emails")
    .insert({
      session_id: sessionId,
      thread_id: threadId,
      from_contact_id: selfContact.id,
      subject: input.subject,
      body_html: input.bodyHtml,
      body_text: bodyText,
      snippet,
      sent_at: now,
      is_read: true,
      is_draft: false,
      category: "primary",
    })
    .select("id")
    .single();

  if (emailError)
    throw new Error(`Failed to create email: ${emailError.message}`);

  // Create recipients
  const recipients = [
    ...toContactIds.map((contactId) => ({
      email_id: email.id,
      contact_id: contactId,
      type: "to" as const,
    })),
    ...ccContactIds.map((contactId) => ({
      email_id: email.id,
      contact_id: contactId,
      type: "cc" as const,
    })),
    ...bccContactIds.map((contactId) => ({
      email_id: email.id,
      contact_id: contactId,
      type: "bcc" as const,
    })),
  ];

  if (recipients.length > 0) {
    const { error: recipError } = await supabase
      .from("gmail_email_recipients")
      .insert(recipients);

    if (recipError)
      throw new Error(`Failed to create recipients: ${recipError.message}`);
  }

  revalidatePath("/", "layout");
  return { emailId: email.id, threadId };
}

/* ─── Save Draft ─────────────────────────────────────────────────────────────── */

interface SaveDraftInput {
  to?: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  bodyHtml: string;
  draftId?: string;
  threadId?: string;
}

export async function saveDraft(input: SaveDraftInput) {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const { data: selfContact } = await supabase
    .from("gmail_contacts")
    .select("id")
    .eq("session_id", sessionId)
    .eq("is_self", true)
    .single();

  if (!selfContact) throw new Error("Self contact not found");

  const now = new Date().toISOString();
  const bodyText = input.bodyHtml.replace(/<[^>]*>/g, "").trim();
  const snippet = htmlToSnippet(input.bodyHtml);

  if (input.draftId) {
    // Update existing draft
    const { error } = await supabase
      .from("gmail_emails")
      .update({
        subject: input.subject,
        body_html: input.bodyHtml,
        body_text: bodyText,
        snippet,
      })
      .eq("id", input.draftId)
      .eq("session_id", sessionId);

    if (error) throw new Error(`Failed to update draft: ${error.message}`);

    // Update recipients — delete old, insert new
    await supabase
      .from("gmail_email_recipients")
      .delete()
      .eq("email_id", input.draftId);

    if (input.to && input.to.length > 0) {
      const resolveContact = async (email: string) => {
        const { data: existing } = await supabase
          .from("gmail_contacts")
          .select("id")
          .eq("session_id", sessionId)
          .eq("email", email)
          .single();

        if (existing) return existing.id;

        const name = email.split("@")[0].replace(/[._-]/g, " ");
        const { data: created, error: createError } = await supabase
          .from("gmail_contacts")
          .insert({
            session_id: sessionId,
            email,
            name: name.charAt(0).toUpperCase() + name.slice(1),
          })
          .select("id")
          .single();

        if (createError)
          throw new Error(`Failed to create contact: ${createError.message}`);
        return created.id;
      };

      const toContactIds = await Promise.all(input.to.map(resolveContact));
      const recipients = toContactIds.map((contactId) => ({
        email_id: input.draftId!,
        contact_id: contactId,
        type: "to" as const,
      }));

      await supabase.from("gmail_email_recipients").insert(recipients);
    }

    revalidatePath("/", "layout");
    return { draftId: input.draftId };
  }

  // Create new draft
  let threadId = input.threadId;
  if (!threadId) {
    const { data: thread, error: threadError } = await supabase
      .from("gmail_threads")
      .insert({
        session_id: sessionId,
        subject: input.subject || "(no subject)",
        last_message_at: now,
        message_count: 1,
      })
      .select("id")
      .single();

    if (threadError)
      throw new Error(`Failed to create thread: ${threadError.message}`);
    threadId = thread.id;
  }

  const { data: draft, error: draftError } = await supabase
    .from("gmail_emails")
    .insert({
      session_id: sessionId,
      thread_id: threadId,
      from_contact_id: selfContact.id,
      subject: input.subject || "(no subject)",
      body_html: input.bodyHtml,
      body_text: bodyText,
      snippet,
      sent_at: now,
      is_read: true,
      is_draft: true,
      category: "primary",
    })
    .select("id")
    .single();

  if (draftError)
    throw new Error(`Failed to create draft: ${draftError.message}`);

  revalidatePath("/", "layout");
  return { draftId: draft.id, threadId };
}

/* ─── Discard Draft ──────────────────────────────────────────────────────────── */

export async function discardDraft(draftId: string) {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("gmail_emails")
    .delete()
    .eq("id", draftId)
    .eq("session_id", sessionId)
    .eq("is_draft", true);

  if (error) throw new Error(`Failed to discard draft: ${error.message}`);
  revalidatePath("/", "layout");
}

/* ─── Search Contacts ────────────────────────────────────────────────────────── */

export async function searchContacts(query: string) {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const { data: contacts } = await supabase
    .from("gmail_contacts")
    .select("id, name, email, is_self")
    .eq("session_id", sessionId)
    .eq("is_self", false)
    .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
    .order("name")
    .limit(10);

  return contacts ?? [];
}

/* ─── Get Default Signature ──────────────────────────────────────────────────── */

export async function getDefaultSignature() {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const { data } = await supabase
    .from("gmail_signatures")
    .select("id, name, body_html")
    .eq("session_id", sessionId)
    .eq("is_default", true)
    .single();

  return data;
}

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

async function getThreadMessageCount(
  supabase: ReturnType<typeof createServiceClient>,
  threadId: string,
) {
  const { count } = await supabase
    .from("gmail_emails")
    .select("id", { count: "exact", head: true })
    .eq("thread_id", threadId);

  return count ?? 0;
}
