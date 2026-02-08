import { getEmailList, deduplicateByThread } from "@/lib/queries/emails";
import { EmailList } from "../email-list";

export default async function ImportantPage() {
  const emails = await getEmailList({ type: "important" });
  const threads = deduplicateByThread(emails);

  return (
    <EmailList
      emails={threads}
      emptyTitle="No important messages"
      emptyDescription="Messages marked as important will appear here."
    />
  );
}
