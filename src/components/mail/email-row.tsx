"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  toggleStar,
  archiveEmails,
  unarchiveEmails,
  trashEmails,
  untrashEmails,
  markReadStatus,
} from "@/lib/actions/email";
import { useToast } from "@/components/ui/toast";
import { useSelection } from "@/components/mail/selection-provider";
import { SnoozePicker } from "@/components/mail/snooze-picker";

export function EmailRow({
  emailId,
  threadId,
  sender,
  senderAvatar,
  subject,
  snippet,
  time,
  unread = false,
  starred = false,
  important = false,
  isDraft = false,
  labels = [],
  priorityScore,
}: {
  emailId: string;
  threadId: string;
  sender: string;
  senderAvatar?: string | null;
  subject: string;
  snippet: string;
  time: string;
  unread?: boolean;
  starred?: boolean;
  important?: boolean;
  isDraft?: boolean;
  labels?: Array<{ name: string; color: string }>;
  priorityScore?: number;
}) {
  const [isStarPending, startStarTransition] = useTransition();
  const [isActionPending, startActionTransition] = useTransition();
  const [showSnooze, setShowSnooze] = useState(false);
  const { showToast } = useToast();
  const { isSelected, toggle } = useSelection();
  const selected = isSelected(emailId);

  const handleStarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startStarTransition(async () => {
      await toggleStar(emailId, !starred);
    });
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startActionTransition(async () => {
      await archiveEmails([emailId]);
      showToast({
        message: "Conversation archived",
        action: {
          label: "Undo",
          onClick: () => unarchiveEmails([emailId]),
        },
      });
    });
  };

  const handleTrash = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startActionTransition(async () => {
      await trashEmails([emailId]);
      showToast({
        message: "Conversation moved to Trash",
        action: {
          label: "Undo",
          onClick: () => untrashEmails([emailId]),
        },
      });
    });
  };

  const handleToggleRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startActionTransition(async () => {
      await markReadStatus([emailId], !unread ? false : true);
    });
  };

  return (
    <a
      href={`/thread/${threadId}`}
      data-email-id={emailId}
      data-thread-id={threadId}
      data-starred={starred ? "true" : undefined}
      className={`
        group relative flex cursor-pointer items-center gap-2 px-4 py-2.5 transition-[var(--transition-fast)]
        ${selected ? "bg-[var(--color-accent-subtle)]" : unread ? "bg-[var(--color-unread-bg)]" : "bg-[var(--color-read-bg)]"}
        hover:z-[1] hover:shadow-[var(--shadow-sm)]
        ${isActionPending ? "opacity-50" : ""}
        ${priorityScore != null && priorityScore >= 0.8 ? "border-l-2 border-l-[var(--color-accent-primary)]" : ""}
      `}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle(emailId);
        }}
        className={`shrink-0 rounded-[var(--radius-xs)] p-1 hover:bg-[var(--color-bg-hover)] ${
          selected ? "text-[var(--color-accent-primary)]" : "text-[var(--color-text-tertiary)]"
        }`}
        aria-label={selected ? "Deselect" : "Select"}
      >
        {selected ? (
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
            <rect width="18" height="18" x="3" y="3" rx="2" fill="currentColor" />
            <path d="m9 12 2 2 4-4" stroke="var(--color-bg-primary)" strokeWidth="2" />
          </svg>
        ) : (
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
            <rect width="18" height="18" x="3" y="3" rx="2" />
          </svg>
        )}
      </button>

      {/* Star */}
      <motion.button
        onClick={handleStarClick}
        disabled={isStarPending}
        whileTap={{ scale: 1.3 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
        className={`shrink-0 rounded-[var(--radius-full)] p-1 transition-[var(--transition-fast)] hover:bg-[var(--color-bg-hover)] ${
          starred
            ? "text-[var(--color-star)]"
            : "text-[var(--color-text-tertiary)]"
        }`}
        aria-label={starred ? "Unstar" : "Star"}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={starred ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </motion.button>

      {/* Important marker */}
      {important && (
        <span className="shrink-0 text-[var(--color-important)]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
          >
            <path d="M4 2l8 5 8-5v14l-8 5-8-5z" />
          </svg>
        </span>
      )}

      {/* Content */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* Sender */}
        <span
          className={`flex w-52 shrink-0 items-center gap-2 truncate text-sm ${
            unread
              ? "font-semibold text-[var(--color-text-primary)]"
              : "text-[var(--color-text-secondary)]"
          }`}
        >
          {senderAvatar ? (
            <img src={senderAvatar} alt="" className="h-6 w-6 shrink-0 rounded-[var(--radius-full)] object-cover" />
          ) : (
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-bg-tertiary)] text-xs font-medium text-[var(--color-text-secondary)]">
              {sender.charAt(0).toUpperCase()}
            </span>
          )}
          {isDraft ? (
            <span className="text-[var(--color-error)]">Draft</span>
          ) : (
            <span className="truncate">{sender}</span>
          )}
        </span>

        {/* Subject + snippet */}
        <div className="flex min-w-0 flex-1 items-baseline gap-1">
          <span
            className={`shrink-0 text-sm ${
              unread
                ? "font-semibold text-[var(--color-text-primary)]"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            {subject}
          </span>
          <span className="truncate text-sm text-[var(--color-text-tertiary)]">
            {" "}
            &mdash; {snippet}
          </span>
        </div>

        {/* Labels */}
        {labels.length > 0 && (
          <div className="flex shrink-0 gap-1">
            {labels.map((l) => (
              <span
                key={l.name}
                className="rounded-[var(--radius-xs)] px-1.5 py-0.5 text-[11px] font-medium"
                style={{
                  backgroundColor: l.color + "20",
                  color: l.color,
                }}
              >
                {l.name}
              </span>
            ))}
          </div>
        )}

        {/* Time — visible by default, hidden on hover */}
        <span
          className={`shrink-0 text-xs tabular-nums group-hover:invisible ${
            unread
              ? "font-semibold text-[var(--color-text-primary)]"
              : "text-[var(--color-text-tertiary)]"
          }`}
        >
          {time}
        </span>
      </div>

      {/* Hover actions — appear on hover, positioned over the timestamp */}
      <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] px-1.5 shadow-[var(--shadow-sm)] opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 transition-opacity duration-150">
        {/* Archive */}
        <button
          onClick={handleArchive}
          disabled={isActionPending}
          className="rounded-[var(--radius-full)] p-1.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-secondary)]"
          title="Archive"
          aria-label="Archive"
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
            <rect width="20" height="5" x="2" y="3" rx="1" />
            <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
            <path d="M10 12h4" />
          </svg>
        </button>

        {/* Delete */}
        <button
          onClick={handleTrash}
          disabled={isActionPending}
          className="rounded-[var(--radius-full)] p-1.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-secondary)]"
          title="Delete"
          aria-label="Delete"
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
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>

        {/* Mark read/unread */}
        <button
          onClick={handleToggleRead}
          disabled={isActionPending}
          className="rounded-[var(--radius-full)] p-1.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-secondary)]"
          title={unread ? "Mark as read" : "Mark as unread"}
          aria-label={unread ? "Mark as read" : "Mark as unread"}
        >
          {unread ? (
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
              <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              <path d="m16 19 2 2 4-4" />
            </svg>
          ) : (
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
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          )}
        </button>

        {/* Snooze */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowSnooze((v) => !v);
            }}
            className="rounded-[var(--radius-full)] p-1.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-secondary)]"
            title="Snooze"
            aria-label="Snooze"
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
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>
          <AnimatePresence>
            {showSnooze && (
              <SnoozePicker
                emailId={emailId}
                onClose={() => setShowSnooze(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </a>
  );
}
