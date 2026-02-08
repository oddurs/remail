"use client";

import { useEffect, useState, useCallback, useRef, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCompose } from "./compose-provider";
import { useSelection } from "./selection-provider";
import { useToast } from "@/components/ui/toast";
import {
  toggleStar,
  archiveEmails,
  unarchiveEmails,
  trashEmails,
  untrashEmails,
  markReadStatus,
} from "@/lib/actions/email";

/* ─── Shortcuts Help Dialog ──────────────────────────────────────────────────── */

function ShortcutsDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Focus trap
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKey);

    // Focus first focusable element
    requestAnimationFrame(() => {
      const first = dialogRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      first?.focus();
    });

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
      previousFocus.current?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Dialog */}
      <div
        ref={dialogRef}
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
            aria-label="Close"
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
            <ShortcutRow keys={["j"]} description="Move down" />
            <ShortcutRow keys={["k"]} description="Move up" />
            <ShortcutRow keys={["o"]} description="Open conversation" />
            <ShortcutRow keys={["x"]} description="Select conversation" />
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
  const { selectedIds, toggle, clearSelection } = useSelection();
  const { showToast } = useToast();
  const [showHelp, setShowHelp] = useState(false);
  const [pendingG, setPendingG] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [, startTransition] = useTransition();

  const isInThread = pathname.startsWith("/thread/");

  // Reset focused index on pathname change
  useEffect(() => {
    setFocusedIndex(-1);
  }, [pathname]);

  const getRows = useCallback(() => {
    return document.querySelectorAll<HTMLElement>("[data-email-id]");
  }, []);

  // Update DOM focus highlight
  useEffect(() => {
    const rows = getRows();
    rows.forEach((row, i) => {
      if (i === focusedIndex) {
        row.setAttribute("data-focused", "true");
      } else {
        row.removeAttribute("data-focused");
      }
    });
  }, [focusedIndex, getRows]);

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

        case "j": {
          if (isInThread) return;
          e.preventDefault();
          const rows = getRows();
          if (rows.length === 0) return;
          setFocusedIndex((prev) => Math.min(prev + 1, rows.length - 1));
          return;
        }

        case "k": {
          if (isInThread) return;
          e.preventDefault();
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
          return;
        }

        case "o":
        case "Enter": {
          if (isInThread) return;
          e.preventDefault();
          const rows = getRows();
          const row = rows[focusedIndex];
          if (row) {
            const threadId = row.getAttribute("data-thread-id");
            if (threadId) router.push(`/thread/${threadId}`);
          }
          return;
        }

        case "x": {
          if (isInThread) return;
          e.preventDefault();
          const rows = getRows();
          const row = rows[focusedIndex];
          if (row) {
            const emailId = row.getAttribute("data-email-id");
            if (emailId) toggle(emailId);
          }
          return;
        }

        case "e": {
          e.preventDefault();
          const eFromSelection = selectedIds.size > 0;
          const ids = eFromSelection
            ? Array.from(selectedIds)
            : (() => {
                const rows = getRows();
                const row = rows[focusedIndex];
                const id = row?.getAttribute("data-email-id");
                return id ? [id] : [];
              })();
          if (ids.length === 0) return;
          startTransition(async () => {
            await archiveEmails(ids);
            clearSelection();
            // Clamp focusedIndex after rows are removed
            if (!eFromSelection) {
              const remaining = getRows().length - 1;
              setFocusedIndex((prev) => Math.min(prev, Math.max(remaining, 0)));
            }
            showToast({
              message: `${ids.length === 1 ? "Conversation" : ids.length} archived`,
              action: {
                label: "Undo",
                onClick: () => unarchiveEmails(ids),
              },
            });
          });
          return;
        }

        case "#": {
          e.preventDefault();
          const hashFromSelection = selectedIds.size > 0;
          const ids = hashFromSelection
            ? Array.from(selectedIds)
            : (() => {
                const rows = getRows();
                const row = rows[focusedIndex];
                const id = row?.getAttribute("data-email-id");
                return id ? [id] : [];
              })();
          if (ids.length === 0) return;
          startTransition(async () => {
            await trashEmails(ids);
            clearSelection();
            // Clamp focusedIndex after rows are removed
            if (!hashFromSelection) {
              const remaining = getRows().length - 1;
              setFocusedIndex((prev) => Math.min(prev, Math.max(remaining, 0)));
            }
            showToast({
              message: `${ids.length === 1 ? "Conversation" : ids.length} moved to Trash`,
              action: {
                label: "Undo",
                onClick: () => untrashEmails(ids),
              },
            });
          });
          return;
        }

        case "s": {
          if (isInThread) return;
          e.preventDefault();
          const rows = getRows();
          const row = rows[focusedIndex];
          if (row) {
            const emailId = row.getAttribute("data-email-id");
            const isStarred = row.getAttribute("data-starred") === "true";
            if (emailId) {
              startTransition(async () => {
                await toggleStar(emailId, !isStarred);
              });
            }
          }
          return;
        }

        case "I": {
          e.preventDefault();
          const ids =
            selectedIds.size > 0
              ? Array.from(selectedIds)
              : (() => {
                  const rows = getRows();
                  const row = rows[focusedIndex];
                  const id = row?.getAttribute("data-email-id");
                  return id ? [id] : [];
                })();
          if (ids.length === 0) return;
          startTransition(async () => {
            await markReadStatus(ids, true);
            clearSelection();
          });
          return;
        }

        case "U": {
          e.preventDefault();
          const ids =
            selectedIds.size > 0
              ? Array.from(selectedIds)
              : (() => {
                  const rows = getRows();
                  const row = rows[focusedIndex];
                  const id = row?.getAttribute("data-email-id");
                  return id ? [id] : [];
                })();
          if (ids.length === 0) return;
          startTransition(async () => {
            await markReadStatus(ids, false);
            clearSelection();
          });
          return;
        }

        case "c":
          e.preventDefault();
          openCompose();
          return;

        case "/":
          e.preventDefault();
          {
            const searchInput = document.querySelector<HTMLInputElement>(
              'input[placeholder="Search mail"]',
            );
            searchInput?.focus();
          }
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
  }, [pendingG, isInputFocused, router, pathname, isInThread, openCompose, focusedIndex, selectedIds, toggle, clearSelection, showToast, getRows]);

  if (showHelp) {
    return <ShortcutsDialog onClose={() => setShowHelp(false)} />;
  }

  return null;
}
