import { createServiceClient } from "@/lib/supabase/server";
import { requireSessionId } from "@/lib/session";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";

async function getThread(threadId: string) {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const { data: thread } = await supabase
    .from("gmail_threads")
    .select("id, subject, is_muted")
    .eq("id", threadId)
    .eq("session_id", sessionId)
    .single();

  if (!thread) return null;

  const { data: messages } = await supabase
    .from("gmail_emails")
    .select(
      `
      id,
      subject,
      body_html,
      sent_at,
      is_read,
      is_starred,
      is_draft,
      from_contact_id,
      gmail_contacts!gmail_emails_from_contact_id_fkey (
        id,
        name,
        email,
        is_self
      ),
      gmail_email_recipients (
        type,
        gmail_contacts (
          name,
          email
        )
      )
    `,
    )
    .eq("thread_id", threadId)
    .eq("session_id", sessionId)
    .order("sent_at", { ascending: true });

  const { data: threadLabels } = await supabase
    .from("gmail_email_labels")
    .select(
      `
      gmail_labels (
        id, name, color, type
      )
    `,
    )
    .in(
      "email_id",
      (messages ?? []).map((m) => m.id),
    );

  // Mark unread messages as read
  if (messages) {
    const unreadIds = messages.filter((m) => !m.is_read).map((m) => m.id);
    if (unreadIds.length > 0) {
      await supabase
        .from("gmail_emails")
        .update({ is_read: true })
        .in("id", unreadIds);
    }
  }

  const uniqueLabels = new Map<
    string,
    { id: string; name: string; color: string | null; type: string }
  >();
  threadLabels?.forEach((tl) => {
    const label = tl.gmail_labels;
    if (label && label.type === "user") {
      uniqueLabels.set(label.id, label);
    }
  });

  return {
    thread,
    messages: messages ?? [],
    labels: Array.from(uniqueLabels.values()),
  };
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getThread(id);

  if (!data) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-lg font-medium text-[var(--color-text-primary)]">
            Thread not found
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
            This conversation may have been deleted.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-[var(--color-accent-primary)] hover:underline"
          >
            Back to Inbox
          </Link>
        </div>
      </div>
    );
  }

  const { thread, messages, labels } = data;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-[var(--color-border-subtle)] px-4 py-2 shrink-0">
        <Link
          href="/"
          className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
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
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>

        <button
          className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
          title="Archive"
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
          className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
          title="Delete"
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
          className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
          title="Mark unread"
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
        <button
          className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
          title="Snooze"
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
        <button
          className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
          title="Labels"
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
        <button
          className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
          title="More"
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
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>

      {/* Thread header */}
      <div className="border-b border-[var(--color-border-subtle)] px-6 py-4 shrink-0">
        <h1 className="text-xl font-normal text-[var(--color-text-primary)]">
          {thread.subject}
        </h1>
        {labels.length > 0 && (
          <div className="mt-2 flex gap-1.5">
            {labels.map((label) => (
              <span
                key={label.id}
                className="rounded-[var(--radius-xs)] px-2 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: (label.color ?? "#666") + "20",
                  color: label.color ?? "#666",
                }}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-6 py-4 space-y-4">
          {messages.map((message, index) => {
            const contact = message.gmail_contacts;
            const senderName = contact?.is_self
              ? "Me"
              : (contact?.name ?? "Unknown");
            const senderEmail = contact?.email ?? "";
            const isLast = index === messages.length - 1;
            const recipients = message.gmail_email_recipients ?? [];
            const toNames = recipients
              .filter((r) => r.type === "to")
              .map(
                (r) =>
                  r.gmail_contacts?.name ??
                  r.gmail_contacts?.email ??
                  "Unknown",
              );

            return (
              <div
                key={message.id}
                className="rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]"
              >
                {/* Header */}
                <div className="flex items-start gap-3 px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-bg-tertiary)] text-sm font-medium text-[var(--color-text-secondary)]">
                    {senderName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {senderName}
                      </span>
                      <span className="text-xs text-[var(--color-text-tertiary)]">
                        &lt;{senderEmail}&gt;
                      </span>
                    </div>
                    <div className="text-xs text-[var(--color-text-tertiary)]">
                      to {toNames.length > 0 ? toNames.join(", ") : "me"}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs text-[var(--color-text-tertiary)] mr-1">
                      {formatRelativeDate(new Date(message.sent_at))}
                    </span>
                    <button
                      className={`rounded-[var(--radius-full)] p-1 transition-[var(--transition-fast)] hover:bg-[var(--color-bg-hover)] ${
                        message.is_starred
                          ? "text-[var(--color-star)]"
                          : "text-[var(--color-text-tertiary)]"
                      }`}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill={message.is_starred ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                    <button
                      className="rounded-[var(--radius-full)] p-1 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)]"
                      title="Reply"
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
                    <button
                      className="rounded-[var(--radius-full)] p-1 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)]"
                      title="More"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div
                  className="px-5 pb-5 pl-[4.25rem] text-sm leading-relaxed text-[var(--color-text-primary)] [&_a]:text-[var(--color-accent-primary)] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-border-default)] [&_blockquote]:pl-3 [&_blockquote]:text-[var(--color-text-secondary)] [&_p]:mb-2 [&_table]:text-sm"
                  dangerouslySetInnerHTML={{ __html: message.body_html }}
                />

                {/* Reply/Forward on last message */}
                {isLast && !message.is_draft && (
                  <div className="mx-5 mb-5 ml-[4.25rem] flex gap-2">
                    <button className="rounded-[var(--radius-full)] border border-[var(--color-border-default)] px-5 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-[var(--transition-fast)]">
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
                    <button className="rounded-[var(--radius-full)] border border-[var(--color-border-default)] px-5 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-[var(--transition-fast)]">
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
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
