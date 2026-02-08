"use client";

import { useCompose } from "@/components/mail/compose-provider";
import { useRouter } from "next/navigation";
import {
  toggleStar,
  archiveThread,
  unarchiveThread,
  trashThread,
  untrashThread,
  markThreadReadStatus,
} from "@/lib/actions/email";
import { useToast } from "@/components/ui/toast";
import { useState, useTransition } from "react";
import { SnoozePicker } from "@/components/mail/snooze-picker";
import { LabelPicker } from "@/components/mail/label-picker";
import { escapeHtml } from "@/lib/utils";

/* ─── Thread Toolbar Actions ─────────────────────────────────────────────────── */

export function ThreadToolbarActions({ threadId }: { threadId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleArchive = () => {
    startTransition(async () => {
      await archiveThread(threadId);
      router.push("/");
      showToast({
        message: "Conversation archived",
        action: {
          label: "Undo",
          onClick: () => unarchiveThread(threadId),
        },
      });
    });
  };

  const handleTrash = () => {
    startTransition(async () => {
      await trashThread(threadId);
      router.push("/");
      showToast({
        message: "Conversation moved to Trash",
        action: {
          label: "Undo",
          onClick: () => untrashThread(threadId),
        },
      });
    });
  };

  const handleMarkUnread = () => {
    startTransition(async () => {
      await markThreadReadStatus(threadId, false);
      router.push("/");
    });
  };

  return (
    <>
      <button
        onClick={handleArchive}
        disabled={isPending}
        className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] disabled:opacity-50"
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
      <button
        onClick={handleTrash}
        disabled={isPending}
        className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] disabled:opacity-50"
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
      <button
        onClick={handleMarkUnread}
        disabled={isPending}
        className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] disabled:opacity-50"
        title="Mark unread"
        aria-label="Mark unread"
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
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </button>
    </>
  );
}

/* ─── Star Button ────────────────────────────────────────────────────────────── */

export function StarButton({
  emailId,
  starred,
}: {
  emailId: string;
  starred: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await toggleStar(emailId, !starred);
        });
      }}
      disabled={isPending}
      className={`rounded-[var(--radius-full)] p-1 transition-[var(--transition-fast)] hover:bg-[var(--color-bg-hover)] ${
        starred
          ? "text-[var(--color-star)]"
          : "text-[var(--color-text-tertiary)]"
      }`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={starred ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
  );
}

/* ─── Thread Snooze Button ──────────────────────────────────────────────────── */

export function ThreadSnoozeButton({ emailId }: { emailId: string }) {
  const [showSnooze, setShowSnooze] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowSnooze((v) => !v)}
        className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
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
      {showSnooze && (
        <SnoozePicker
          emailId={emailId}
          onClose={() => setShowSnooze(false)}
        />
      )}
    </div>
  );
}

/* ─── Thread Label Button ──────────────────────────────────────────────────── */

export function ThreadLabelButton({
  emailIds,
  currentLabelIds,
  labels,
}: {
  emailIds: string[];
  currentLabelIds: string[];
  labels: Array<{ id: string; name: string; color: string | null }>;
}) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker((v) => !v)}
        className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
        title="Labels"
        aria-label="Labels"
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
          <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
          <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
        </svg>
      </button>
      {showPicker && (
        <LabelPicker
          emailIds={emailIds}
          currentLabelIds={currentLabelIds}
          labels={labels}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

/* ─── Reply / Forward Buttons ────────────────────────────────────────────────── */

interface ReplyForwardProps {
  threadId: string;
  subject: string;
  senderName: string;
  senderEmail: string;
  bodyHtml: string;
  sentAt: string;
}

export function ReplyButton({
  threadId,
  subject,
  senderName,
  senderEmail,
  bodyHtml,
  sentAt,
}: ReplyForwardProps) {
  const { openReply } = useCompose();

  const handleReply = () => {
    const replySubject = subject.startsWith("Re:") ? subject : `Re: ${subject}`;
    const quotedHtml = `
      <br><br>
      <div style="border-left: 2px solid #ccc; padding-left: 12px; color: #666;">
        <p>On ${escapeHtml(sentAt)}, ${escapeHtml(senderName)} &lt;${escapeHtml(senderEmail)}&gt; wrote:</p>
        ${bodyHtml}
      </div>
    `;

    openReply({
      to: [{ id: senderEmail, name: senderName, email: senderEmail }],
      subject: replySubject,
      bodyHtml: quotedHtml,
      threadId,
    });
  };

  return (
    <button
      onClick={handleReply}
      className="rounded-[var(--radius-full)] border border-[var(--color-border-default)] px-5 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-[var(--transition-fast)]"
    >
      <span className="flex items-center gap-2">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 17 4 12 9 7" />
          <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
        </svg>
        Reply
      </span>
    </button>
  );
}

export function ForwardButton({
  threadId,
  subject,
  senderName,
  senderEmail,
  bodyHtml,
  sentAt,
}: ReplyForwardProps) {
  const { openForward } = useCompose();

  const handleForward = () => {
    const fwdSubject = subject.startsWith("Fwd:") ? subject : `Fwd: ${subject}`;
    const forwardedHtml = `
      <br><br>
      <div>
        <p>---------- Forwarded message ----------</p>
        <p>From: ${escapeHtml(senderName)} &lt;${escapeHtml(senderEmail)}&gt;</p>
        <p>Date: ${escapeHtml(sentAt)}</p>
        <p>Subject: ${escapeHtml(subject)}</p>
        <br>
        ${bodyHtml}
      </div>
    `;

    openForward({
      subject: fwdSubject,
      bodyHtml: forwardedHtml,
      threadId,
    });
  };

  return (
    <button
      onClick={handleForward}
      className="rounded-[var(--radius-full)] border border-[var(--color-border-default)] px-5 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-[var(--transition-fast)]"
    >
      <span className="flex items-center gap-2">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 17 20 12 15 7" />
          <path d="M4 18v-2a4 4 0 0 1 4-4h12" />
        </svg>
        Forward
      </span>
    </button>
  );
}
