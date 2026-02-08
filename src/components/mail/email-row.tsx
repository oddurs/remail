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
import { MdCheckBox, MdCheckBoxOutlineBlank, MdStar, MdStarBorder, MdLabelImportant, MdArchive, MdDelete, MdMarkEmailRead, MdMarkEmailUnread, MdSchedule } from "react-icons/md";
import { getLabelIcon } from "@/components/mail/create-label-modal";

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
  labels?: Array<{ name: string; color: string; icon?: string | null }>;
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
        group relative grid cursor-pointer grid-cols-[1.5rem_1.5rem_1rem_11rem_1fr_5rem] items-center gap-x-2 px-4 py-2.5 transition-[var(--transition-fast)]
        ${selected ? "bg-[var(--color-accent-subtle)]" : unread ? "bg-blue-50/40 dark:bg-blue-950/20" : "bg-transparent"}
        hover:z-[1] hover:bg-[var(--color-bg-hover)] hover:shadow-[var(--shadow-sm)]
        ${isActionPending ? "opacity-50" : ""}
        ${unread ? "border-l-[3px] border-l-blue-600 dark:border-l-blue-400" : "border-l-[3px] border-l-transparent"}
      `}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle(emailId);
        }}
        className={`rounded-[var(--radius-xs)] p-1 hover:bg-[var(--color-bg-hover)] ${
          selected ? "text-[var(--color-accent-primary)]" : "text-[var(--color-text-tertiary)]"
        }`}
        aria-label={selected ? "Deselect" : "Select"}
      >
        {selected ? (
          <MdCheckBox className="size-4" />
        ) : (
          <MdCheckBoxOutlineBlank className="size-4" />
        )}
      </button>

      {/* Star */}
      <motion.button
        onClick={handleStarClick}
        disabled={isStarPending}
        whileTap={{ scale: 1.3 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
        className={`rounded-[var(--radius-full)] p-1 transition-[var(--transition-fast)] hover:bg-[var(--color-bg-hover)] ${
          starred
            ? "text-[var(--color-star)]"
            : "text-[var(--color-text-tertiary)]"
        }`}
        aria-label={starred ? "Unstar" : "Star"}
      >
        {starred ? <MdStar className="size-4" /> : <MdStarBorder className="size-4" />}
      </motion.button>

      {/* Important marker — always rendered to maintain grid alignment */}
      <span className="flex items-center justify-center text-[var(--color-important)]">
        {important && <MdLabelImportant className="size-3.5" />}
      </span>

      {/* Sender */}
      <span
        className={`flex items-center gap-2 truncate text-[13px] ${
          unread
            ? "font-semibold text-[var(--color-text-primary)]"
            : "font-medium text-[var(--color-text-secondary)]"
        }`}
      >
        {senderAvatar ? (
          <img src={senderAvatar} alt="" className="h-6 w-6 shrink-0 rounded-[var(--radius-full)] object-cover ring-1 ring-[var(--color-border-subtle)]" />
        ) : (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-bg-tertiary)] text-xs font-medium text-[var(--color-text-secondary)] ring-1 ring-[var(--color-border-subtle)]">
            {sender.charAt(0).toUpperCase()}
          </span>
        )}
        {isDraft ? (
          <span className="text-[var(--color-error)]">Draft</span>
        ) : (
          <span className="truncate">{sender}</span>
        )}
      </span>

      {/* Subject + labels + snippet */}
      <div className="flex min-w-0 items-baseline gap-1">
        <span
          className={`shrink-0 text-[13px] ${
            unread
              ? "font-semibold text-[var(--color-text-primary)]"
              : "text-[var(--color-text-secondary)]"
          }`}
        >
          {subject}
        </span>
        {labels.length > 0 && (
          <span className="flex shrink-0 items-center gap-1">
            {labels.map((l) => {
              const LIcon = getLabelIcon(l.icon ?? null);
              return (
                <span
                  key={l.name}
                  className="inline-flex items-center gap-0.5 rounded-[var(--radius-xs)] px-1.5 py-0.5 text-[11px] font-medium"
                  style={{
                    backgroundColor: l.color + "20",
                    color: l.color,
                  }}
                >
                  {LIcon && <LIcon className="size-3" />}
                  {l.name}
                </span>
              );
            })}
          </span>
        )}
        <span className="truncate text-[13px] text-[var(--color-text-tertiary)] opacity-75">
          &mdash; {snippet}
        </span>
      </div>

      {/* Time — right-aligned, hidden on hover */}
      <span
        className={`text-right text-xs tabular-nums group-hover:invisible ${
          unread
            ? "font-semibold text-[var(--color-text-primary)]"
            : "text-[var(--color-text-tertiary)]"
        }`}
      >
        {time}
      </span>

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
          <MdArchive className="size-4" />
        </button>

        {/* Delete */}
        <button
          onClick={handleTrash}
          disabled={isActionPending}
          className="rounded-[var(--radius-full)] p-1.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-secondary)]"
          title="Delete"
          aria-label="Delete"
        >
          <MdDelete className="size-4" />
        </button>

        {/* Mark read/unread */}
        <button
          onClick={handleToggleRead}
          disabled={isActionPending}
          className="rounded-[var(--radius-full)] p-1.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-secondary)]"
          title={unread ? "Mark as read" : "Mark as unread"}
          aria-label={unread ? "Mark as read" : "Mark as unread"}
        >
          {unread ? <MdMarkEmailRead className="size-4" /> : <MdMarkEmailUnread className="size-4" />}
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
            <MdSchedule className="size-4" />
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
