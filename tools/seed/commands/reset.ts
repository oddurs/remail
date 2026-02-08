/**
 * Wipe all data for a session and re-seed it.
 */

import { createSeedClient } from "../db";
import { buildSeedConfig } from "../config";
import { validateConfig, wipeSeedData, writeSeedData } from "../writer";

export async function runReset(sessionId: string): Promise<void> {
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

  // Check session exists
  const { data: existing } = await supabase
    .from("gmail_sessions")
    .select("id")
    .eq("id", sessionId)
    .single();

  if (!existing) {
    console.error(`Session ${sessionId} not found.`);
    process.exitCode = 1;
    return;
  }

  console.log(`Wiping session: ${sessionId}`);
  await wipeSeedData(supabase, sessionId);
  console.log("Wipe complete.");

  console.log("Re-seeding...");
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
}
