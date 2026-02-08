import { getEmailList, deduplicateByThread } from "@/lib/queries/emails";
import { EmailList } from "../email-list";

export default async function SnoozedPage() {
  const emails = await getEmailList({ type: "snoozed" });
  const threads = deduplicateByThread(emails);

  return (
    <EmailList
      emails={threads}
      emptyTitle="No snoozed messages"
      emptyDescription="Snoozed messages will reappear at the top of your inbox when the snooze time arrives."
    />
  );
}
