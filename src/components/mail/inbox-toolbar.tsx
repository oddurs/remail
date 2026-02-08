"use client";

import { useTransition } from "react";
import { useSelection } from "@/components/mail/selection-provider";
import { useToast } from "@/components/ui/toast";
import {
  archiveEmails,
  unarchiveEmails,
  trashEmails,
  untrashEmails,
  markReadStatus,
} from "@/lib/actions/email";

export function InboxToolbar({
  totalCount,
  allEmailIds,
}: {
  totalCount: number;
  allEmailIds: string[];
}) {
  const { selectedIds, selectionCount, selectAll, clearSelection } =
    useSelection();
  const allSelected = allEmailIds.length > 0 && allEmailIds.every((id) => selectedIds.has(id));
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleArchive = () => {
    const ids = Array.from(selectedIds);
    startTransition(async () => {
      await archiveEmails(ids);
      clearSelection();
      showToast({
        message: `${ids.length} archived`,
        action: {
          label: "Undo",
          onClick: () => unarchiveEmails(ids),
        },
      });
    });
  };

  const handleTrash = () => {
    const ids = Array.from(selectedIds);
    startTransition(async () => {
      await trashEmails(ids);
      clearSelection();
      showToast({
        message: `${ids.length} moved to Trash`,
        action: {
          label: "Undo",
          onClick: () => untrashEmails(ids),
        },
      });
    });
  };

  const handleMarkRead = () => {
    const ids = Array.from(selectedIds);
    startTransition(async () => {
      await markReadStatus(ids, true);
      clearSelection();
    });
  };

  const handleMarkUnread = () => {
    const ids = Array.from(selectedIds);
    startTransition(async () => {
      await markReadStatus(ids, false);
      clearSelection();
    });
  };

  if (selectionCount > 0) {
    return (
      <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] px-4 py-2">
        {/* Select all checkbox (checked state) */}
        <button
          onClick={() => selectAll(allEmailIds)}
          className="rounded-[var(--radius-xs)] p-1 text-[var(--color-accent-primary)] hover:bg-[var(--color-bg-hover)]"
          aria-label={allSelected ? "Deselect all" : "Select all"}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" fill="currentColor" />
            <path d="m9 12 2 2 4-4" stroke="var(--color-bg-primary)" strokeWidth="2" />
          </svg>
        </button>

        <span className="text-sm font-medium text-[var(--color-text-primary)]">
          {selectionCount} selected
        </span>

        <div className="mx-2 h-5 w-px bg-[var(--color-border-default)]" />

        {/* Archive */}
        <button
          onClick={handleArchive}
          disabled={isPending}
          className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] disabled:opacity-50"
          title="Archive"
          aria-label="Archive"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="5" x="2" y="3" rx="1" />
            <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
            <path d="M10 12h4" />
          </svg>
        </button>

        {/* Trash */}
        <button
          onClick={handleTrash}
          disabled={isPending}
          className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] disabled:opacity-50"
          title="Delete"
          aria-label="Delete"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>

        {/* Mark read */}
        <button
          onClick={handleMarkRead}
          disabled={isPending}
          className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] disabled:opacity-50"
          title="Mark as read"
          aria-label="Mark as read"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            <path d="m16 19 2 2 4-4" />
          </svg>
        </button>

        {/* Mark unread */}
        <button
          onClick={handleMarkUnread}
          disabled={isPending}
          className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] disabled:opacity-50"
          title="Mark as unread"
          aria-label="Mark as unread"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </button>
      </div>
    );
  }

  // Default toolbar (no selection)
  return (
    <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] px-4 py-2">
      {/* Select all checkbox */}
      <button
        onClick={() => selectAll(allEmailIds)}
        className="rounded-[var(--radius-xs)] p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
        aria-label="Select all"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
        </svg>
      </button>

      <div className="flex-1" />

      {/* Email count */}
      <span className="text-xs text-[var(--color-text-tertiary)]">
        {totalCount > 0
          ? `1\u2013${totalCount} of ${totalCount}`
          : "No conversations"}
      </span>
    </div>
  );
}
