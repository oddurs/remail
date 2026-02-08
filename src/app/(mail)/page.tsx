import { MdInbox, MdGroup, MdLocalOffer, MdInfo, MdForum, MdMailOutline } from "react-icons/md";
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
      priority_score,
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
          icon,
          type
        )
      )
    `,
    )
    .eq("session_id", sessionId)
    .eq("is_trash", false)
    .eq("is_spam", false)
    .eq("is_archived", false)
    .eq("is_draft", false)
    .eq("category", category)
    .order("sent_at", { ascending: false })
    .limit(200);

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

  // Build a map of thread_id -> first non-self contact for sender display
  // When the latest email is from self (a reply), show the other participant instead
  const threadSenderOverride = new Map<string, { name: string; avatar_url: string | null }>();
  for (const email of emails) {
    const contact = email.gmail_contacts;
    if (contact && !contact.is_self && !threadSenderOverride.has(email.thread_id)) {
      threadSenderOverride.set(email.thread_id, { name: contact.name, avatar_url: contact.avatar_url });
    }
  }

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
            <MdInbox className="size-[18px]" />
          }
        />
        <CategoryTab
          label="Social"
          value="social"
          active={activeCategory === "social"}
          count={categoryCounts.social}
          icon={
            <MdGroup className="size-[18px]" />
          }
        />
        <CategoryTab
          label="Promotions"
          value="promotions"
          active={activeCategory === "promotions"}
          count={categoryCounts.promotions}
          icon={
            <MdLocalOffer className="size-[18px]" />
          }
        />
        <CategoryTab
          label="Updates"
          value="updates"
          active={activeCategory === "updates"}
          count={categoryCounts.updates}
          icon={
            <MdInfo className="size-[18px]" />
          }
        />
        <CategoryTab
          label="Forums"
          value="forums"
          active={activeCategory === "forums"}
          count={categoryCounts.forums}
          icon={
            <MdForum className="size-[18px]" />
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
              <MdMailOutline className="size-7 text-[var(--color-text-tertiary)]" />
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
        <AnimatedList className="divide-y divide-[var(--color-border-default)] bg-[var(--color-bg-secondary)]/50 shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)]">
            {threadEmails.map((email) => {
              const contact = email.gmail_contacts;
              const override = contact?.is_self ? threadSenderOverride.get(email.thread_id) : null;
              const senderName = override?.name ?? (contact?.is_self ? "Me" : (contact?.name ?? "Unknown"));
              const senderAvatar = override?.avatar_url ?? contact?.avatar_url;
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
                    senderAvatar={senderAvatar}
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
                      icon: l.icon,
                    }))}
                    priorityScore={email.priority_score}
                  />
                </AnimatedRow>
              );
            })}
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
