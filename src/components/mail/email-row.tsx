"use client";

export function EmailRow({
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
    <a
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

        {/* Time */}
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
    </a>
  );
}
