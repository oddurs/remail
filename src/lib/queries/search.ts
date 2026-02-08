import { createServiceClient } from "@/lib/supabase/server";
import { requireSessionId } from "@/lib/session";

export async function searchEmails(query: string) {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  // Convert query to tsquery format — split words and join with &
  const terms = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => `${term}:*`)
    .join(" & ");

  if (!terms) return [];

  const { data: emails } = await supabase
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
      gmail_contacts!gmail_emails_from_contact_id_fkey (
        id,
        name,
        email,
        is_self,
        avatar_url
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
    .textSearch("fts", terms)
    .order("sent_at", { ascending: false })
    .limit(50);

  return emails ?? [];
}
