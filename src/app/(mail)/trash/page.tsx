import { getEmailList, deduplicateByThread } from "@/lib/queries/emails";
import { EmailList } from "../email-list";

export default async function TrashPage() {
  const emails = await getEmailList({ type: "trash" });
  const threads = deduplicateByThread(emails);

  return (
    <EmailList
      emails={threads}
      emptyTitle="No messages in Trash"
      emptyDescription="Items in Trash will be permanently deleted after 30 days."
    />
  );
}
