import { createServiceClient } from "@/lib/supabase/server";
import { requireSessionId } from "@/lib/session";
import { formatRelativeDate } from "@/lib/utils";
import { EmailRow } from "@/components/mail/email-row";

async function getInboxEmails(category: string = "primary") {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  // Get the latest email per thread for inbox view
  const { data: emails } = await supabase
    .from("gmail_emails")
    .select(
      `
      id,
      thread_id,
      subject,
      snippet,
      sent_at,
      is_read,
      is_starred,
      is_important,
      is_draft,
      category,
      from_contact_id,
      gmail_contacts!gmail_emails_from_contact_id_fkey (
        id,
        name,
        email,
        is_self
      ),
      gmail_email_labels (
        gmail_labels (
          id,
          name,
          color,
          type
        )
      )
    `,
    )
    .eq("session_id", sessionId)
    .eq("is_trash", false)
    .eq("is_spam", false)
    .eq("is_archived", false)
    .eq("category", category)
    .order("sent_at", { ascending: false })
    .limit(50);

  return emails ?? [];
}

async function getCategoryCounts() {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const categories = [
    "primary",
    "social",
    "promotions",
    "updates",
    "forums",
  ] as const;
  const counts: Record<string, number> = {};

  for (const cat of categories) {
    const { count } = await supabase
      .from("gmail_emails")
      .select("id", { count: "exact", head: true })
      .eq("session_id", sessionId)
      .eq("is_trash", false)
      .eq("is_spam", false)
      .eq("is_archived", false)
      .eq("is_draft", false)
      .eq("is_read", false)
      .eq("category", cat);

    counts[cat] = count ?? 0;
  }

  return counts;
}

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: activeCategory = "primary" } = await searchParams;
  const [emails, categoryCounts] = await Promise.all([
    getInboxEmails(activeCategory),
    getCategoryCounts(),
  ]);

  // Deduplicate by thread_id — show only the latest email per thread
  const seenThreads = new Set<string>();
  const threadEmails = emails.filter((email) => {
    if (seenThreads.has(email.thread_id)) return false;
    seenThreads.add(email.thread_id);
    return true;
  });

  const totalCount = threadEmails.length;

  return (
    <div className="flex flex-col">
      {/* Category tabs */}
      <div className="flex border-b border-[var(--color-border-subtle)]">
        <CategoryTab
          label="Primary"
          value="primary"
          active={activeCategory === "primary"}
          count={categoryCounts.primary}
        />
        <CategoryTab
          label="Social"
          value="social"
          active={activeCategory === "social"}
          count={categoryCounts.social}
        />
        <CategoryTab
          label="Promotions"
          value="promotions"
          active={activeCategory === "promotions"}
          count={categoryCounts.promotions}
        />
        <CategoryTab
          label="Updates"
          value="updates"
          active={activeCategory === "updates"}
          count={categoryCounts.updates}
        />
        <CategoryTab
          label="Forums"
          value="forums"
          active={activeCategory === "forums"}
          count={categoryCounts.forums}
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] px-4 py-2">
        {/* Select all checkbox */}
        <button className="rounded-[var(--radius-xs)] p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]">
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

        {/* Refresh */}
        <button className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]">
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
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
        </button>

        {/* More */}
        <button className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]">
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
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>

        <div className="flex-1" />

        {/* Pagination */}
        <span className="text-xs text-[var(--color-text-tertiary)]">
          {totalCount > 0
            ? `1\u2013${totalCount} of ${totalCount}`
            : "No conversations"}
        </span>
        <button className="rounded-[var(--radius-full)] p-1.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)]">
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
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button className="rounded-[var(--radius-full)] p-1.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)]">
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
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Email list */}
      {threadEmails.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-bg-tertiary)]">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[var(--color-text-tertiary)]"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              No conversations
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
              {activeCategory === "primary"
                ? "You\u2019re all caught up!"
                : `No ${activeCategory} emails`}
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-[var(--color-border-subtle)]">
          {threadEmails.map((email) => {
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
      )}
    </div>
  );
}

/* ─── Category Tab ──────────────────────────────────────────────────────────── */

function CategoryTab({
  label,
  value,
  active = false,
  count = 0,
}: {
  label: string;
  value: string;
  active?: boolean;
  count?: number;
}) {
  return (
    <a
      href={value === "primary" ? "/" : `/?category=${value}`}
      className={`
        relative flex items-center gap-2 px-6 py-3.5 text-sm font-medium transition-[var(--transition-fast)]
        ${
          active
            ? "text-[var(--color-accent-primary)]"
            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
        }
      `}
    >
      {label}
      {count > 0 && (
        <span
          className={`text-xs tabular-nums ${active ? "text-[var(--color-accent-primary)]" : "text-[var(--color-text-tertiary)]"}`}
        >
          {count}
        </span>
      )}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-[var(--radius-full)] bg-[var(--color-accent-primary)]" />
      )}
    </a>
  );
}
