"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { requireSessionId } from "@/lib/session";
import { seedSession } from "@/lib/seed/generator";
import { revalidatePath } from "next/cache";

/* ─── Seed with Rich Data ───────────────────────────────────────────────────── */

export async function seedWithRichData() {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  // Wipe existing data for this session
  await wipeSession(supabase, sessionId);

  // Re-seed with default data (includes avatar URLs)
  await seedSession(sessionId);

  revalidatePath("/", "layout");
}

/* ─── Reset to Defaults ─────────────────────────────────────────────────────── */

export async function resetToDefaults() {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  // Wipe existing data for this session
  await wipeSession(supabase, sessionId);

  // Re-seed with default data
  await seedSession(sessionId);

  revalidatePath("/", "layout");
}

/* ─── Clean Expired Sessions ────────────────────────────────────────────────── */

export async function cleanExpiredSessions() {
  const supabase = createServiceClient();

  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase
    .from("gmail_sessions")
    .delete()
    .lt("created_at", cutoff);

  if (error) throw new Error(`Failed to clean sessions: ${error.message}`);
}

/* ─── Helpers ───────────────────────────────────────────────────────────────── */

async function wipeSession(
  supabase: ReturnType<typeof createServiceClient>,
  sessionId: string,
) {
  // Get all email IDs for this session to delete from child tables
  const { data: emails } = await supabase
    .from("gmail_emails")
    .select("id")
    .eq("session_id", sessionId);

  const emailIds = (emails ?? []).map((e) => e.id);

  // Delete child tables first (FK constraints)
  if (emailIds.length > 0) {
    await supabase.from("gmail_email_labels").delete().in("email_id", emailIds);
    await supabase.from("gmail_email_recipients").delete().in("email_id", emailIds);
  }

  await supabase.from("gmail_emails").delete().eq("session_id", sessionId);
  await supabase.from("gmail_threads").delete().eq("session_id", sessionId);
  await supabase.from("gmail_contacts").delete().eq("session_id", sessionId);
  await supabase.from("gmail_labels").delete().eq("session_id", sessionId);
  await supabase.from("gmail_signatures").delete().eq("session_id", sessionId);

  // Mark session as not seeded so seedSession works
  await supabase
    .from("gmail_sessions")
    .update({ is_seeded: false })
    .eq("id", sessionId);
}
