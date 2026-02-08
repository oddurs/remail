/**
 * Dry-run: prints what would be created, validates all cross-references.
 */

import { buildSeedConfig } from "../config";
import { validateConfig } from "../writer";
import type { SeedConfig } from "../types";

function countMessages(config: SeedConfig): number {
  return config.threads.reduce((sum, t) => sum + t.messages.length, 0);
}

function countByCategory(config: SeedConfig): Record<string, { threads: number; messages: number }> {
  const counts: Record<string, { threads: number; messages: number }> = {};
  for (const thread of config.threads) {
    const cat = thread.category;
    if (!counts[cat]) counts[cat] = { threads: 0, messages: 0 };
    counts[cat].threads++;
    counts[cat].messages += thread.messages.length;
  }
  return counts;
}

function countContactsByKind(config: SeedConfig): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const contact of config.contacts) {
    counts[contact.kind] = (counts[contact.kind] || 0) + 1;
  }
  return counts;
}

function countSpecialThreads(config: SeedConfig): Record<string, number> {
  const counts: Record<string, number> = {
    starred: 0,
    important: 0,
    drafts: 0,
    snoozed: 0,
    spam: 0,
    trash: 0,
    withLabels: 0,
    withAttachments: 0,
  };
  for (const thread of config.threads) {
    if (thread.flags?.isStarred) counts.starred++;
    if (thread.flags?.isImportant) counts.important++;
    if (thread.flags?.isDraft) counts.drafts++;
    if (thread.flags?.snoozeHours) counts.snoozed++;
    if (thread.flags?.isSpam) counts.spam++;
    if (thread.flags?.isTrash) counts.trash++;
    if (thread.labels && thread.labels.length > 0) counts.withLabels++;
    if (thread.messages.some((m) => m.attachments && m.attachments.length > 0))
      counts.withAttachments++;
  }
  return counts;
}

export async function runPreview(): Promise<void> {
  const config = buildSeedConfig();

  console.log("=== Seed Data Preview ===\n");

  // Contacts
  const contactKinds = countContactsByKind(config);
  console.log(`Contacts: ${config.contacts.length} total`);
  for (const [kind, count] of Object.entries(contactKinds)) {
    console.log(`  ${kind}: ${count}`);
  }
  console.log();

  // Threads by category
  const categories = countByCategory(config);
  const totalMessages = countMessages(config);
  console.log(`Threads: ${config.threads.length} total (${totalMessages} messages)`);
  for (const [cat, { threads, messages }] of Object.entries(categories)) {
    const avgMsgs = (messages / threads).toFixed(1);
    console.log(`  ${cat}: ${threads} threads, ${messages} msgs (avg ${avgMsgs}/thread)`);
  }
  console.log();

  // Special flags
  const special = countSpecialThreads(config);
  console.log("Flags:");
  console.log(`  Starred: ${special.starred}`);
  console.log(`  Important: ${special.important}`);
  console.log(`  Drafts: ${special.drafts}`);
  console.log(`  Snoozed: ${special.snoozed}`);
  console.log(`  Spam: ${special.spam}`);
  console.log(`  Trash: ${special.trash}`);
  console.log(`  With labels: ${special.withLabels}`);
  console.log(`  With attachments: ${special.withAttachments}`);
  console.log();

  // Labels
  const systemLabels = config.labels.filter((l) => l.type === "system");
  const userLabels = config.labels.filter((l) => l.type === "user");
  console.log(`Labels: ${config.labels.length} total (${systemLabels.length} system, ${userLabels.length} user)`);
  for (const label of userLabels) {
    console.log(`  ${label.name} ${label.color ?? ""}`);
  }
  console.log();

  // Signatures
  console.log(`Signatures: ${config.signatures.length}`);
  console.log();

  // Validation
  const errors = validateConfig(config);
  if (errors.length === 0) {
    console.log("Validation: PASS (0 errors)");
  } else {
    console.log(`Validation: FAIL (${errors.length} errors)`);
    for (const err of errors) {
      const prefix = err.threadId ? `[${err.threadId}]` : "[global]";
      console.log(`  ${prefix} ${err.field}: ${err.message}`);
    }
    process.exitCode = 1;
  }
}
