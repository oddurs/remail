/**
 * Query live DB stats for a session.
 */

import { createSeedClient } from "../db";

export async function runStats(sessionId: string): Promise<void> {
  const supabase = createSeedClient();

  // Check session exists
  const { data: session } = await supabase
    .from("gmail_sessions")
    .select("id, is_seeded, created_at, expires_at")
    .eq("id", sessionId)
    .single();

  if (!session) {
    console.error(`Session ${sessionId} not found.`);
    process.exitCode = 1;
    return;
  }

  console.log(`=== Session Stats: ${sessionId} ===\n`);
  console.log(`Created:  ${session.created_at}`);
  console.log(`Expires:  ${session.expires_at}`);
  console.log(`Seeded:   ${session.is_seeded}`);
  console.log();

  // Count contacts
  const { count: contactCount } = await supabase
    .from("gmail_contacts")
    .select("*", { count: "exact", head: true })
    .eq("session_id", sessionId);

  // Count threads
  const { count: threadCount } = await supabase
    .from("gmail_threads")
    .select("*", { count: "exact", head: true })
    .eq("session_id", sessionId);

  // Count emails
  const { count: emailCount } = await supabase
    .from("gmail_emails")
    .select("*", { count: "exact", head: true })
    .eq("session_id", sessionId);

  // Count labels
  const { count: labelCount } = await supabase
    .from("gmail_labels")
    .select("*", { count: "exact", head: true })
    .eq("session_id", sessionId);

  // Count signatures
  const { count: signatureCount } = await supabase
    .from("gmail_signatures")
    .select("*", { count: "exact", head: true })
    .eq("session_id", sessionId);

  // Count snooze entries
  const { count: snoozeCount } = await supabase
    .from("gmail_snooze_queue")
    .select("*", { count: "exact", head: true })
    .eq("session_id", sessionId);

  console.log("Table counts:");
  console.log(`  Contacts:    ${contactCount ?? 0}`);
  console.log(`  Threads:     ${threadCount ?? 0}`);
  console.log(`  Emails:      ${emailCount ?? 0}`);
  console.log(`  Labels:      ${labelCount ?? 0}`);
  console.log(`  Signatures:  ${signatureCount ?? 0}`);
  console.log(`  Snooze queue: ${snoozeCount ?? 0}`);
  console.log();

  // Category distribution
  const { data: emails } = await supabase
    .from("gmail_emails")
    .select("category")
    .eq("session_id", sessionId);

  if (emails) {
    const catCounts: Record<string, number> = {};
    for (const e of emails) {
      catCounts[e.category] = (catCounts[e.category] || 0) + 1;
    }
    console.log("Email categories:");
    for (const [cat, count] of Object.entries(catCounts).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${cat}: ${count}`);
    }
    console.log();
  }

  // Flag counts
  const { data: flaggedEmails } = await supabase
    .from("gmail_emails")
    .select("is_starred, is_important, is_draft, is_spam, is_trash, is_read")
    .eq("session_id", sessionId);

  if (flaggedEmails) {
    const flags = {
      starred: flaggedEmails.filter((e) => e.is_starred).length,
      important: flaggedEmails.filter((e) => e.is_important).length,
      drafts: flaggedEmails.filter((e) => e.is_draft).length,
      spam: flaggedEmails.filter((e) => e.is_spam).length,
      trash: flaggedEmails.filter((e) => e.is_trash).length,
      unread: flaggedEmails.filter((e) => !e.is_read).length,
      read: flaggedEmails.filter((e) => e.is_read).length,
    };
    console.log("Flags:");
    for (const [flag, count] of Object.entries(flags)) {
      console.log(`  ${flag}: ${count}`);
    }
  }
}
