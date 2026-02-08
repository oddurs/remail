"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatRelativeDate, formatFullDate, escapeHtml } from "@/lib/utils";
import {
  StarButton,
  ReplyButton,
  ReplyAllButton,
  ForwardButton,
  MessageMoreMenu,
} from "@/components/mail/thread-actions";
import { useCompose } from "@/components/mail/compose-provider";

/* ─── Types ──────────────────────────────────────────────────────────────────── */

interface Recipient {
  type: string;
  gmail_contacts: { name: string; email: string } | null;
}

interface Message {
  id: string;
  subject: string;
  body_html: string;
  snippet: string | null;
  sent_at: string;
  is_read: boolean;
  is_starred: boolean;
  is_draft: boolean;
  suggested_replies: unknown;
  from_contact_id: string;
  gmail_contacts: {
    id: string;
    name: string;
    email: string;
    is_self: boolean;
    avatar_url: string | null;
  } | null;
  gmail_email_recipients: Recipient[] | null;
}

interface ThreadMessagesProps {
  messages: Message[];
  threadId: string;
  threadSubject: string;
}

/* ─── Component ──────────────────────────────────────────────────────────────── */

export function ThreadMessages({
  messages,
  threadId,
  threadSubject,
}: ThreadMessagesProps) {
  const isSingle = messages.length <= 1;
  const lastId = messages[messages.length - 1]?.id;

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    if (isSingle) return new Set(messages.map((m) => m.id));
    return new Set([lastId]);
  });

  const toggleExpand = useCallback(
    (id: string) => {
      if (id === lastId) return;
      setExpandedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [lastId],
  );

  return (
    <div className="mx-auto max-w-4xl space-y-3 px-6 py-4">
      {messages.map((message, index) => {
        const isExpanded = expandedIds.has(message.id);
        const isLast = index === messages.length - 1;
        const contact = message.gmail_contacts;
        const senderName = contact?.is_self
          ? "Me"
          : (contact?.name ?? "Unknown");
        const senderEmail = contact?.email ?? "";
        const recipients = message.gmail_email_recipients ?? [];
        const toNames = recipients
          .filter((r) => r.type === "to")
          .map(
            (r) =>
              r.gmail_contacts?.name ?? r.gmail_contacts?.email ?? "Unknown",
          );
        const allRecipients = recipients
          .filter((r) => r.type === "to" || r.type === "cc")
          .map((r) => ({
            name:
              r.gmail_contacts?.name ?? r.gmail_contacts?.email ?? "Unknown",
            email: r.gmail_contacts?.email ?? "",
          }));

        if (!isExpanded) {
          return (
            <CollapsedRow
              key={message.id}
              message={message}
              senderName={senderName}
              onClick={() => toggleExpand(message.id)}
            />
          );
        }

        return (
          <ExpandedMessage
            key={message.id}
            message={message}
            senderName={senderName}
            senderEmail={senderEmail}
            toNames={toNames}
            allRecipients={allRecipients}
            isLast={isLast}
            isSingle={isSingle}
            threadId={threadId}
            threadSubject={threadSubject}
            onCollapse={() => toggleExpand(message.id)}
          />
        );
      })}
    </div>
  );
}

/* ─── Collapsed Row ──────────────────────────────────────────────────────────── */

function CollapsedRow({
  message,
  senderName,
  onClick,
}: {
  message: Message;
  senderName: string;
  onClick: () => void;
}) {
  const snippet =
    message.snippet ??
    message.body_html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 140);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] px-5 py-3 shadow-[var(--shadow-xs)] transition-colors hover:bg-[var(--color-bg-hover)]"
    >
      {message.gmail_contacts?.avatar_url ? (
        <img
          src={message.gmail_contacts.avatar_url}
          alt=""
          className="h-8 w-8 shrink-0 rounded-[var(--radius-full)] object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-bg-tertiary)] text-xs font-medium text-[var(--color-text-secondary)]">
          {senderName.charAt(0).toUpperCase()}
        </div>
      )}
      <span className="shrink-0 text-sm font-semibold text-[var(--color-text-primary)]">
        {senderName}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm text-[var(--color-text-tertiary)]">
        {snippet}
      </span>
      <span className="shrink-0 text-xs text-[var(--color-text-tertiary)]">
        {formatFullDate(new Date(message.sent_at))}
      </span>
      <div onClick={(e) => e.stopPropagation()}>
        <StarButton emailId={message.id} starred={message.is_starred} />
      </div>
    </div>
  );
}

/* ─── Expanded Message ───────────────────────────────────────────────────────── */

function ExpandedMessage({
  message,
  senderName,
  senderEmail,
  toNames,
  allRecipients,
  isLast,
  isSingle,
  threadId,
  threadSubject,
  onCollapse,
}: {
  message: Message;
  senderName: string;
  senderEmail: string;
  toNames: string[];
  allRecipients: Array<{ name: string; email: string }>;
  isLast: boolean;
  isSingle: boolean;
  threadId: string;
  threadSubject: string;
  onCollapse: () => void;
}) {
  const canCollapse = !isLast && !isSingle;

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] shadow-[var(--shadow-xs)]">
      {/* Header */}
      <div
        role={canCollapse ? "button" : undefined}
        tabIndex={canCollapse ? 0 : undefined}
        onClick={canCollapse ? onCollapse : undefined}
        onKeyDown={
          canCollapse
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onCollapse();
                }
              }
            : undefined
        }
        className={`flex items-start gap-3 px-5 py-4 ${canCollapse ? "cursor-pointer" : ""}`}
      >
        {message.gmail_contacts?.avatar_url ? (
          <img
            src={message.gmail_contacts.avatar_url}
            alt=""
            className="h-10 w-10 shrink-0 rounded-[var(--radius-full)] object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-bg-tertiary)] text-sm font-medium text-[var(--color-text-secondary)]">
            {senderName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {senderName}
            </span>
            <span className="text-xs text-[var(--color-text-tertiary)]">
              &lt;{senderEmail}&gt;
            </span>
          </div>
          <div className="text-xs text-[var(--color-text-tertiary)]">
            to {toNames.length > 0 ? toNames.join(", ") : "me"}{" "}
            <span className="cursor-default">&#9660;</span>
          </div>
        </div>
        <div
          className="flex shrink-0 items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="mr-1 text-xs text-[var(--color-text-tertiary)]">
            {formatFullDate(new Date(message.sent_at))}
          </span>
          <StarButton emailId={message.id} starred={message.is_starred} />
          <button
            className="rounded-[var(--radius-full)] p-1 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)]"
            title="Add reaction"
            aria-label="Add reaction"
          >
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
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" x2="9.01" y1="9" y2="9" />
              <line x1="15" x2="15.01" y1="9" y2="9" />
            </svg>
          </button>
          <button
            className="rounded-[var(--radius-full)] p-1 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)]"
            title="Reply"
            aria-label="Reply"
          >
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
          </button>
          <MessageMoreMenu />
        </div>
      </div>

      {/* Body */}
      <AnimatePresence initial={false}>
        <motion.div
          key={`body-${message.id}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ overflow: "hidden" }}
        >
          <div
            className="px-5 pb-5 pl-[4.25rem] text-sm leading-relaxed text-[var(--color-text-primary)] [&_a]:text-[var(--color-accent-primary)] [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-border-default)] [&_blockquote]:pl-3 [&_blockquote]:text-[var(--color-text-secondary)] [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_table]:text-sm [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: message.body_html }}
          />

          {/* Reply/ReplyAll/Forward on last message */}
          {isLast && !message.is_draft && (
            <div className="mx-5 mb-5 ml-[4.25rem] flex items-center gap-2">
              <ReplyButton
                threadId={threadId}
                subject={threadSubject}
                senderName={senderName}
                senderEmail={senderEmail}
                bodyHtml={message.body_html}
                sentAt={formatRelativeDate(new Date(message.sent_at))}
              />
              <ReplyAllButton
                threadId={threadId}
                subject={threadSubject}
                senderName={senderName}
                senderEmail={senderEmail}
                bodyHtml={message.body_html}
                sentAt={formatRelativeDate(new Date(message.sent_at))}
                allRecipients={allRecipients}
              />
              <ForwardButton
                threadId={threadId}
                subject={threadSubject}
                senderName={senderName}
                senderEmail={senderEmail}
                bodyHtml={message.body_html}
                sentAt={formatRelativeDate(new Date(message.sent_at))}
              />
              <button
                className="rounded-[var(--radius-full)] border border-[var(--color-border-default)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-[var(--transition-fast)]"
                title="Add reaction"
                aria-label="Add reaction"
              >
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" x2="9.01" y1="9" y2="9" />
                  <line x1="15" x2="15.01" y1="9" y2="9" />
                </svg>
              </button>
            </div>
          )}

          {/* Suggested reply chips */}
          {isLast && !message.is_draft && <SuggestedReplies
            message={message}
            senderEmail={senderEmail}
            threadId={threadId}
            threadSubject={threadSubject}
          />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── Suggested Reply Chips ──────────────────────────────────────────────────── */

function SuggestedReplies({
  message,
  senderEmail,
  threadId,
  threadSubject,
}: {
  message: Message;
  senderEmail: string;
  threadId: string;
  threadSubject: string;
}) {
  const { openReply } = useCompose();

  const replies = Array.isArray(message.suggested_replies)
    ? (message.suggested_replies as string[])
    : [];

  if (replies.length === 0) return null;

  return (
    <div className="mx-5 mb-4 ml-[4.25rem] flex flex-wrap gap-2">
      {replies.map((reply, i) => (
        <button
          key={i}
          onClick={() =>
            openReply({
              to: [{ id: "", name: "", email: senderEmail }],
              subject: `Re: ${threadSubject}`,
              bodyHtml: `<p>${reply}</p>`,
              threadId,
              inReplyToEmailId: message.id,
            })
          }
          className="rounded-[var(--radius-full)] border border-[var(--color-accent-primary)]/30 px-3 py-1.5 text-sm text-[var(--color-accent-primary)] transition-colors hover:bg-[var(--color-accent-subtle)]"
        >
          {reply}
        </button>
      ))}
    </div>
  );
}
