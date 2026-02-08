"use client";

import { useState, useTransition } from "react";
import { seedWithRichData, resetToDefaults, cleanExpiredSessions } from "@/lib/actions/admin";

export default function AdminPanel() {
  const [isPending, startTransition] = useTransition();
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleAction = (action: () => Promise<void>, label: string) => {
    startTransition(async () => {
      try {
        await action();
        setLastAction(`${label} completed successfully`);
      } catch (err) {
        setLastAction(`${label} failed: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] p-4">
        <h2 className="text-sm font-medium text-[var(--color-text-primary)]">Seed Data</h2>
        <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
          Replace your current session data with rich seed data or reset to defaults.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => handleAction(seedWithRichData, "Seed with rich data")}
            disabled={isPending}
            className="rounded-[var(--radius-sm)] bg-[var(--color-accent-primary)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
          >
            {isPending ? "Working..." : "Seed Rich Data"}
          </button>
          <button
            onClick={() => handleAction(resetToDefaults, "Reset to defaults")}
            disabled={isPending}
            className="rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] disabled:opacity-50"
          >
            {isPending ? "Working..." : "Reset to Defaults"}
          </button>
        </div>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] p-4">
        <h2 className="text-sm font-medium text-[var(--color-text-primary)]">Maintenance</h2>
        <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
          Clean up expired sessions older than 7 days.
        </p>
        <div className="mt-3">
          <button
            onClick={() => handleAction(cleanExpiredSessions, "Clean expired sessions")}
            disabled={isPending}
            className="rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] disabled:opacity-50"
          >
            {isPending ? "Working..." : "Clean Expired Sessions"}
          </button>
        </div>
      </div>

      {lastAction && (
        <div className="rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-bg-tertiary)] px-3 py-2 text-xs text-[var(--color-text-secondary)]">
          {lastAction}
        </div>
      )}
    </div>
  );
}
