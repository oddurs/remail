"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCompose } from "./compose-provider";

/* ─── Shortcuts Help Dialog ──────────────────────────────────────────────────── */

function ShortcutsDialog({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Dialog */}
      <div
        className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] p-6 shadow-[var(--shadow-xl)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Keyboard shortcuts
          </h2>
          <button
            onClick={onClose}
            className="rounded-[var(--radius-full)] p-1.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          <ShortcutSection title="Navigation">
            <ShortcutRow keys={["g", "i"]} description="Go to Inbox" />
            <ShortcutRow keys={["g", "s"]} description="Go to Starred" />
            <ShortcutRow keys={["g", "t"]} description="Go to Sent" />
            <ShortcutRow keys={["g", "d"]} description="Go to Drafts" />
            <ShortcutRow keys={["g", "a"]} description="Go to All Mail" />
          </ShortcutSection>

          <ShortcutSection title="Email list">
            <ShortcutRow keys={["c"]} description="Compose" />
            <ShortcutRow keys={["/"]} description="Search" />
            <ShortcutRow keys={["e"]} description="Archive" />
            <ShortcutRow keys={["#"]} description="Delete" />
            <ShortcutRow keys={["s"]} description="Star / unstar" />
            <ShortcutRow keys={["I"]} description="Mark as read" />
            <ShortcutRow keys={["U"]} description="Mark as unread" />
            <ShortcutRow keys={["z"]} description="Undo" />
          </ShortcutSection>

          <ShortcutSection title="Thread view">
            <ShortcutRow keys={["r"]} description="Reply" />
            <ShortcutRow keys={["f"]} description="Forward" />
            <ShortcutRow keys={["u"]} description="Back to list" />
            <ShortcutRow keys={["e"]} description="Archive" />
            <ShortcutRow keys={["#"]} description="Delete" />
          </ShortcutSection>

          <ShortcutSection title="Compose">
            <ShortcutRow keys={["Ctrl", "Enter"]} description="Send" />
            <ShortcutRow keys={["Esc"]} description="Close" />
          </ShortcutSection>

          <ShortcutSection title="Application">
            <ShortcutRow keys={["?"]} description="Show shortcuts" />
          </ShortcutSection>
        </div>
      </div>
    </div>
  );
}

function ShortcutSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function ShortcutRow({
  keys,
  description,
}: {
  keys: string[];
  description: string;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-[var(--color-text-secondary)]">
        {description}
      </span>
      <div className="flex items-center gap-1">
        {keys.map((key, i) => (
          <span key={i}>
            {i > 0 && (
              <span className="mx-0.5 text-xs text-[var(--color-text-tertiary)]">
                then
              </span>
            )}
            <kbd className="inline-flex min-w-[24px] items-center justify-center rounded-[var(--radius-xs)] border border-[var(--color-border-default)] bg-[var(--color-bg-tertiary)] px-1.5 py-0.5 text-xs font-medium text-[var(--color-text-secondary)]">
              {key}
            </kbd>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Keyboard Shortcuts Provider ────────────────────────────────────────────── */

export function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();
  const { openCompose } = useCompose();
  const [showHelp, setShowHelp] = useState(false);
  const [pendingG, setPendingG] = useState(false);

  const isInThread = pathname.startsWith("/thread/");

  const isInputFocused = useCallback(() => {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    if ((el as HTMLElement).isContentEditable) return true;
    return false;
  }, []);

  useEffect(() => {
    let gTimer: ReturnType<typeof setTimeout> | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in inputs
      if (isInputFocused()) return;

      // Don't intercept when modifier keys are held (except Shift for ?, #, etc.)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key;

      // Handle "g then X" navigation sequences
      if (pendingG) {
        setPendingG(false);
        if (gTimer) clearTimeout(gTimer);

        switch (key) {
          case "i":
            e.preventDefault();
            router.push("/");
            return;
          case "s":
            e.preventDefault();
            router.push("/starred");
            return;
          case "t":
            e.preventDefault();
            router.push("/sent");
            return;
          case "d":
            e.preventDefault();
            router.push("/drafts");
            return;
          case "a":
            e.preventDefault();
            router.push("/all");
            return;
          case "b":
            e.preventDefault();
            router.push("/snoozed");
            return;
        }
        return;
      }

      switch (key) {
        case "g":
          e.preventDefault();
          setPendingG(true);
          gTimer = setTimeout(() => setPendingG(false), 1000);
          return;

        case "c":
          e.preventDefault();
          openCompose();
          return;

        case "/":
          e.preventDefault();
          // Focus the search input
          const searchInput = document.querySelector<HTMLInputElement>(
            'input[placeholder="Search mail"]',
          );
          searchInput?.focus();
          return;

        case "?":
          e.preventDefault();
          setShowHelp(true);
          return;

        case "u":
          if (isInThread) {
            e.preventDefault();
            router.push("/");
          }
          return;

        case "Escape":
          setShowHelp(false);
          return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (gTimer) clearTimeout(gTimer);
    };
  }, [pendingG, isInputFocused, router, pathname, isInThread, openCompose]);

  if (showHelp) {
    return <ShortcutsDialog onClose={() => setShowHelp(false)} />;
  }

  return null;
}
