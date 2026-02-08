import { formatRelativeDate } from "@/lib/utils";
import { EmailRow } from "@/components/mail/email-row";

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
            emailId={email.id}
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
