/**
 * Remove expired sessions and their data.
 */

import { createSeedClient } from "../db";
import { wipeSeedData } from "../writer";

export async function runClean(options: {
  dryRun: boolean;
  olderThanHours: number;
}): Promise<void> {
  const supabase = createSeedClient();
  const cutoff = new Date(Date.now() - options.olderThanHours * 3600_000).toISOString();

  console.log(`Finding sessions expired before: ${cutoff}`);
  if (options.dryRun) console.log("(dry run — no deletions)\n");

  const { data: sessions, error } = await supabase
    .from("gmail_sessions")
    .select("id, created_at, expires_at, is_seeded")
    .lt("expires_at", cutoff);

  if (error) {
    console.error(`Failed to query sessions: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  if (!sessions || sessions.length === 0) {
    console.log("No expired sessions found.");
    return;
  }

  console.log(`Found ${sessions.length} expired sessions:\n`);

  for (const session of sessions) {
    console.log(`  ${session.id} (created: ${session.created_at}, expired: ${session.expires_at}, seeded: ${session.is_seeded})`);

    if (!options.dryRun) {
      try {
        await wipeSeedData(supabase, session.id);
        // Delete the session itself
        await supabase.from("gmail_sessions").delete().eq("id", session.id);
        console.log(`    → deleted`);
      } catch (err) {
        console.error(`    → error: ${err instanceof Error ? err.message : err}`);
      }
    }
  }

  if (!options.dryRun) {
    console.log(`\nCleaned ${sessions.length} sessions.`);
  } else {
    console.log(`\nWould clean ${sessions.length} sessions. Run without --dry-run to delete.`);
  }
}
