import Link from "next/link";
import { formatRelativeDate } from "@/lib/utils";

interface EmailData {
  id: string;
  thread_id: string;
  subject: string;
  snippet: string;
  sent_at: string;
  is_read: boolean;
  is_starred: boolean;
  is_important: boolean;
  is_draft: boolean;
  gmail_contacts: {
    id: string;
    name: string;
    email: string;
    is_self: boolean;
  } | null;
  gmail_email_labels: Array<{
    gmail_labels: {
      id: string;
      name: string;
      color: string | null;
      type: string;
    } | null;
  }> | null;
}

export function EmailList({
  emails,
  emptyIcon,
  emptyTitle,
  emptyDescription,
}: {
  emails: EmailData[];
  emptyIcon?: React.ReactNode;
  emptyTitle: string;
  emptyDescription: string;
}) {
  if (emails.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <div className="text-center">
          {emptyIcon && (
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-bg-tertiary)]">
              {emptyIcon}
            </div>
          )}
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            {emptyTitle}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
            {emptyDescription}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[var(--color-border-subtle)]">
      {emails.map((email) => {
        const contact = email.gmail_contacts;
        const senderName = contact?.is_self
          ? "Me"
          : (contact?.name ?? "Unknown");
        const userLabels =
          email.gmail_email_labels
            ?.map((el) => el.gmail_labels)
            .filter(
              (l): l is NonNullable<typeof l> =>
                l !== null && l.type === "user",
            ) ?? [];

        return (
          <EmailRow
            key={email.id}
            threadId={email.thread_id}
            sender={senderName}
            subject={email.subject}
            snippet={email.snippet}
            time={formatRelativeDate(new Date(email.sent_at))}
            unread={!email.is_read}
            starred={email.is_starred}
            important={email.is_important}
            isDraft={email.is_draft}
            labels={userLabels.map((l) => ({
              name: l.name,
              color: l.color ?? "#666",
            }))}
          />
        );
      })}
    </div>
  );
}

function EmailRow({
  threadId,
  sender,
  subject,
  snippet,
  time,
  unread = false,
  starred = false,
  important = false,
  isDraft = false,
  labels = [],
}: {
  threadId: string;
  sender: string;
  subject: string;
  snippet: string;
  time: string;
  unread?: boolean;
  starred?: boolean;
  important?: boolean;
  isDraft?: boolean;
  labels?: Array<{ name: string; color: string }>;
}) {
  return (
    <Link
      href={`/thread/${threadId}`}
      className={`
        group flex cursor-pointer items-center gap-2 px-4 py-2 transition-[var(--transition-fast)]
        ${unread ? "bg-[var(--color-unread-bg)]" : "bg-[var(--color-read-bg)]"}
        hover:shadow-[var(--shadow-xs)] hover:z-[1] relative
      `}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => e.preventDefault()}
        className="shrink-0 rounded-[var(--radius-xs)] p-1 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)]"
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
          <rect width="18" height="18" x="3" y="3" rx="2" />
        </svg>
      </button>

      {/* Star */}
      <button
        onClick={(e) => e.preventDefault()}
        className={`shrink-0 rounded-[var(--radius-full)] p-1 transition-[var(--transition-fast)] hover:bg-[var(--color-bg-hover)] ${
          starred
            ? "text-[var(--color-star)]"
            : "text-[var(--color-text-tertiary)]"
        }`}
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
      </button>

      {/* Important */}
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
        <span
          className={`w-44 shrink-0 truncate text-sm ${
            unread
              ? "font-semibold text-[var(--color-text-primary)]"
              : "text-[var(--color-text-secondary)]"
          }`}
        >
          {isDraft ? (
            <span className="text-[var(--color-error)]">Draft</span>
          ) : (
            sender
          )}
        </span>

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

        {labels.length > 0 && (
          <div className="flex shrink-0 gap-1">
            {labels.map((l) => (
              <span
                key={l.name}
                className="rounded-[var(--radius-xs)] px-1.5 py-0.5 text-[11px] font-medium"
                style={{ backgroundColor: l.color + "20", color: l.color }}
              >
                {l.name}
              </span>
            ))}
          </div>
        )}

        <span
          className={`shrink-0 text-xs tabular-nums ${
            unread
              ? "font-semibold text-[var(--color-text-primary)]"
              : "text-[var(--color-text-tertiary)]"
          }`}
        >
          {time}
        </span>
      </div>
    </Link>
  );
}
