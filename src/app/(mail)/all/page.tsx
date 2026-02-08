import { getEmailList, deduplicateByThread } from "@/lib/queries/emails";
import { EmailList } from "../email-list";

export default async function AllMailPage() {
  const emails = await getEmailList({ type: "all" });
  const threads = deduplicateByThread(emails);

  return (
    <EmailList
      emails={threads}
      emptyTitle="No messages"
      emptyDescription="Your mailbox is empty."
    />
  );
}
