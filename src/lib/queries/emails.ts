import { createServiceClient } from "@/lib/supabase/server";
import { requireSessionId } from "@/lib/session";

export type EmailListFilter =
  | { type: "inbox"; category?: string }
  | { type: "starred" }
  | { type: "sent" }
  | { type: "drafts" }
  | { type: "all" }
  | { type: "spam" }
  | { type: "trash" }
  | { type: "important" }
  | { type: "snoozed" }
  | { type: "label"; labelId: string };

export async function getEmailList(filter: EmailListFilter) {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  // Get self contact for "sent" detection
  const { data: selfContact } = await supabase
    .from("gmail_contacts")
    .select("id")
    .eq("session_id", sessionId)
    .eq("is_self", true)
    .single();

  let query = supabase
    .from("gmail_emails")
    .select(
      `
      id,
      thread_id,
      subject,
      snippet,
      sent_at,
      is_read,
      is_starred,
      is_important,
      is_draft,
      is_spam,
      is_trash,
      category,
      priority_score,
      from_contact_id,
      gmail_contacts!gmail_emails_from_contact_id_fkey (
        id, name, email, is_self, avatar_url
      ),
      gmail_email_labels (
        gmail_labels (
          id, name, color, type
        )
      )
    `,
    )
    .eq("session_id", sessionId);

  switch (filter.type) {
    case "inbox":
      query = query
        .eq("is_trash", false)
        .eq("is_spam", false)
        .eq("is_archived", false)
        .eq("category", filter.category ?? "primary");
      break;
    case "starred":
      query = query
        .eq("is_starred", true)
        .eq("is_trash", false)
        .eq("is_spam", false);
      break;
    case "sent":
      if (selfContact) {
        query = query
          .eq("from_contact_id", selfContact.id)
          .eq("is_draft", false)
          .eq("is_trash", false);
      }
      break;
    case "drafts":
      query = query.eq("is_draft", true).eq("is_trash", false);
      break;
    case "all":
      query = query.eq("is_trash", false).eq("is_spam", false);
      break;
    case "spam":
      query = query.eq("is_spam", true).eq("is_trash", false);
      break;
    case "trash":
      query = query.eq("is_trash", true);
      break;
    case "important":
      query = query
        .eq("is_important", true)
        .eq("is_trash", false)
        .eq("is_spam", false);
      break;
    case "snoozed":
      query = query
        .not("snooze_until", "is", null)
        .eq("is_trash", false)
        .eq("is_spam", false);
      break;
    case "label":
      // For label filtering, we need a different approach
      break;
  }

  query = query.order("sent_at", { ascending: false }).limit(50);

  const { data: emails } = await query;

  // For label filter, we need to post-filter
  if (filter.type === "label") {
    const { data: labelEmails } = await supabase
      .from("gmail_email_labels")
      .select("email_id")
      .eq("label_id", filter.labelId);

    const emailIds = new Set((labelEmails ?? []).map((le) => le.email_id));

    const { data: filteredEmails } = await supabase
      .from("gmail_emails")
      .select(
        `
        id,
        thread_id,
        subject,
        snippet,
        sent_at,
        is_read,
        is_starred,
        is_important,
        is_draft,
        is_spam,
        is_trash,
        category,
        priority_score,
        from_contact_id,
        gmail_contacts!gmail_emails_from_contact_id_fkey (
          id, name, email, is_self, avatar_url
        ),
        gmail_email_labels (
          gmail_labels (
            id, name, color, type
          )
        )
      `,
      )
      .eq("session_id", sessionId)
      .eq("is_trash", false)
      .eq("is_spam", false)
      .in("id", Array.from(emailIds))
      .order("sent_at", { ascending: false })
      .limit(50);

    return filteredEmails ?? [];
  }

  return emails ?? [];
}

/**
 * Deduplicate emails by thread_id, keeping the most recent per thread.
 */
export function deduplicateByThread<T extends { thread_id: string }>(
  emails: T[],
): T[] {
  const seen = new Set<string>();
  return emails.filter((email) => {
    if (seen.has(email.thread_id)) return false;
    seen.add(email.thread_id);
    return true;
  });
}
