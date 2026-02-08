/**
 * Create a new session and seed it with the full dataset.
 */

import { createSeedClient } from "../db";
import { buildSeedConfig } from "../config";
import { validateConfig, writeSeedData } from "../writer";

export async function runGenerate(sessionIdArg?: string): Promise<void> {
  const supabase = createSeedClient();
  const config = buildSeedConfig();

  // Validate first
  const errors = validateConfig(config);
  if (errors.length > 0) {
    console.error(`Validation failed with ${errors.length} errors:`);
    for (const err of errors) {
      console.error(`  [${err.threadId || "global"}] ${err.field}: ${err.message}`);
    }
    process.exitCode = 1;
    return;
  }

  let sessionId = sessionIdArg;

  if (sessionId) {
    // Check if session exists
    const { data: existing } = await supabase
      .from("gmail_sessions")
      .select("id, is_seeded")
      .eq("id", sessionId)
      .single();

    if (existing?.is_seeded) {
      console.error(`Session ${sessionId} is already seeded. Use 'reset' to re-seed.`);
      process.exitCode = 1;
      return;
    }

    if (!existing) {
      // Create the session
      const expiresAt = new Date(Date.now() + 7 * 24 * 3600_000).toISOString();
      const { error: createErr } = await supabase.from("gmail_sessions").insert({
        id: sessionId,
        expires_at: expiresAt,
      });
      if (createErr) {
        console.error(`Failed to create session: ${createErr.message}`);
        process.exitCode = 1;
        return;
      }
    }
  } else {
    // Create a new session with auto-generated UUID
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600_000).toISOString();
    const { data: session, error: createErr } = await supabase
      .from("gmail_sessions")
      .insert({ expires_at: expiresAt })
      .select("id")
      .single();

    if (createErr || !session) {
      console.error(`Failed to create session: ${createErr?.message ?? "unknown error"}`);
      process.exitCode = 1;
      return;
    }
    sessionId = session.id;
  }

  console.log(`Seeding session: ${sessionId}`);
  const startTime = Date.now();

  const result = await writeSeedData(supabase, sessionId, config);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nDone in ${elapsed}s`);
  console.log(`  Contacts: ${result.contacts}`);
  console.log(`  Threads:  ${result.threads}`);
  console.log(`  Emails:   ${result.emails}`);
  console.log(`  Labels:   ${result.labels}`);
  console.log(`  Attachments: ${result.attachments}`);
  console.log(`  Snooze entries: ${result.snoozeEntries}`);
  console.log(`  Signatures: ${result.signatures}`);
  console.log(`\nSession ID: ${sessionId}`);
  console.log(`Set cookie: session_id=${sessionId}`);
}
