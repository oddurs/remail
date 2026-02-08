import { createServiceClient } from "@/lib/supabase/server";
import { requireSessionId } from "@/lib/session";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import {
  ThreadToolbarActions,
  StarButton,
  ReplyButton,
  ForwardButton,
} from "@/components/mail/thread-actions";

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
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex shrink-0 items-center gap-1 border-b border-[var(--color-border-subtle)] px-4 py-2">
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

        <ThreadToolbarActions threadId={thread.id} />

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
      <div className="shrink-0 border-b border-[var(--color-border-subtle)] px-6 py-4">
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
        <div className="mx-auto max-w-4xl space-y-4 px-6 py-4">
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
                      to {toNames.length > 0 ? toNames.join(", ") : "me"}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <span className="mr-1 text-xs text-[var(--color-text-tertiary)]">
                      {formatRelativeDate(new Date(message.sent_at))}
                    </span>
                    <StarButton
                      emailId={message.id}
                      starred={message.is_starred}
                    />
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
                  className="px-5 pb-5 pl-[4.25rem] text-sm leading-relaxed text-[var(--color-text-primary)] [&_a]:text-[var(--color-accent-primary)] [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-border-default)] [&_blockquote]:pl-3 [&_blockquote]:text-[var(--color-text-secondary)] [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_table]:text-sm [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: message.body_html }}
                />

                {/* Reply/Forward on last message */}
                {isLast && !message.is_draft && (
                  <div className="mx-5 mb-5 ml-[4.25rem] flex gap-2">
                    <ReplyButton
                      threadId={thread.id}
                      subject={thread.subject}
                      senderName={senderName}
                      senderEmail={senderEmail}
                      bodyHtml={message.body_html}
                      sentAt={formatRelativeDate(new Date(message.sent_at))}
                      toNames={toNames}
                    />
                    <ForwardButton
                      threadId={thread.id}
                      subject={thread.subject}
                      senderName={senderName}
                      senderEmail={senderEmail}
                      bodyHtml={message.body_html}
                      sentAt={formatRelativeDate(new Date(message.sent_at))}
                    />
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
