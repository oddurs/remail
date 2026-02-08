import { createServiceClient } from "@/lib/supabase/server";
import { requireSessionId } from "@/lib/session";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ThreadToolbarActions,
  ThreadSnoozeButton,
  ThreadLabelButton,
  ToolbarMoreMenu,
} from "@/components/mail/thread-actions";
import { ThreadMessages } from "@/components/mail/thread-messages";

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
      snippet,
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
        is_self,
        avatar_url
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

  // Fetch all user labels for label picker
  const { data: allUserLabels } = await supabase
    .from("gmail_labels")
    .select("id, name, color")
    .eq("session_id", sessionId)
    .eq("type", "user")
    .order("position");

  return {
    thread,
    messages: messages ?? [],
    labels: Array.from(uniqueLabels.values()),
    allLabels: allUserLabels ?? [],
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
    notFound();
  }

  const { thread, messages, labels, allLabels } = data;

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex shrink-0 items-center gap-1 border-b border-[var(--color-border-subtle)] px-4 py-2">
        <Link
          href="/"
          className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
          aria-label="Back to inbox"
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

        <ThreadSnoozeButton emailId={messages[0]?.id ?? thread.id} />
        <ThreadLabelButton
          emailIds={messages.map((m) => m.id)}
          currentLabelIds={labels.map((l) => l.id)}
          labels={allLabels}
        />
        <ToolbarMoreMenu />
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
        <ThreadMessages
          messages={messages}
          threadId={thread.id}
          threadSubject={thread.subject}
        />
      </div>
    </div>
  );
}
