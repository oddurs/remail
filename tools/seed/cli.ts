/**
 * Seed toolchain CLI entry point.
 * Usage: tsx --env-file=.env.local tools/seed/cli.ts <command> [options]
 */

const [command, ...args] = process.argv.slice(2);

function parseFlag(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  if (idx === -1) return undefined;
  return args[idx + 1];
}

function hasFlag(flag: string): boolean {
  return args.includes(flag);
}

function printUsage(): void {
  console.log(`
Usage: tsx --env-file=.env.local tools/seed/cli.ts <command> [options]

Commands:
  generate [--session <uuid>]        Create + seed a session
  reset    --session <uuid>          Wipe + re-seed a session
  preview                            Dry-run: print what would be created
  stats    --session <uuid>          Query live DB stats for a session
  clean    [--dry-run] [--older-than <hours>]  Remove expired sessions
`);
}

async function main(): Promise<void> {
  switch (command) {
    case "preview": {
      const { runPreview } = await import("./commands/preview");
      await runPreview();
      break;
    }
    case "generate": {
      const sessionId = parseFlag("--session");
      const { runGenerate } = await import("./commands/generate");
      await runGenerate(sessionId);
      break;
    }
    case "reset": {
      const sessionId = parseFlag("--session");
      if (!sessionId) {
        console.error("Error: --session <uuid> is required for reset.");
        process.exitCode = 1;
        return;
      }
      const { runReset } = await import("./commands/reset");
      await runReset(sessionId);
      break;
    }
    case "stats": {
      const sessionId = parseFlag("--session");
      if (!sessionId) {
        console.error("Error: --session <uuid> is required for stats.");
        process.exitCode = 1;
        return;
      }
      const { runStats } = await import("./commands/stats");
      await runStats(sessionId);
      break;
    }
    case "clean": {
      const dryRun = hasFlag("--dry-run");
      const olderThanStr = parseFlag("--older-than");
      const olderThanHours = olderThanStr ? parseInt(olderThanStr, 10) : 168; // 7 days
      const { runClean } = await import("./commands/clean");
      await runClean({ dryRun, olderThanHours });
      break;
    }
    default:
      if (command) console.error(`Unknown command: ${command}\n`);
      printUsage();
      if (!command) process.exitCode = 1;
      break;
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exitCode = 1;
});
