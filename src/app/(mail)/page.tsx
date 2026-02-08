import { createServiceClient } from "@/lib/supabase/server";
import { requireSessionId } from "@/lib/session";
import { formatRelativeDate } from "@/lib/utils";
import { EmailRow } from "@/components/mail/email-row";
import { AnimatedList, AnimatedRow } from "@/components/mail/email-list";
import { InboxToolbar } from "@/components/mail/inbox-toolbar";
import Link from "next/link";

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
        is_self,
        avatar_url
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
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
              <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            </svg>
          }
        />
        <CategoryTab
          label="Social"
          value="social"
          active={activeCategory === "social"}
          count={categoryCounts.social}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <CategoryTab
          label="Promotions"
          value="promotions"
          active={activeCategory === "promotions"}
          count={categoryCounts.promotions}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
              <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
            </svg>
          }
        />
        <CategoryTab
          label="Updates"
          value="updates"
          active={activeCategory === "updates"}
          count={categoryCounts.updates}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          }
        />
        <CategoryTab
          label="Forums"
          value="forums"
          active={activeCategory === "forums"}
          count={categoryCounts.forums}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
            </svg>
          }
        />
      </div>

      {/* Toolbar */}
      <InboxToolbar totalCount={totalCount} allEmailIds={threadEmails.map(e => e.id)} />

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
        <AnimatedList>
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
                <AnimatedRow key={email.id}>
                  <EmailRow
                    emailId={email.id}
                    threadId={email.thread_id}
                    sender={senderName}
                    senderAvatar={contact?.avatar_url}
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
                </AnimatedRow>
              );
            })}
          </div>
        </AnimatedList>
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
  icon,
}: {
  label: string;
  value: string;
  active?: boolean;
  count?: number;
  icon?: React.ReactNode;
}) {
  return (
    <Link
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
      {icon}
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
    </Link>
  );
}
