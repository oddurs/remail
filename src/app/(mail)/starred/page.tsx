import { getEmailList, deduplicateByThread } from "@/lib/queries/emails";
import { EmailList } from "../email-list";

export default async function StarredPage() {
  const emails = await getEmailList({ type: "starred" });
  const threads = deduplicateByThread(emails);

  return (
    <EmailList
      emails={threads}
      emptyTitle="No starred messages"
      emptyDescription="Stars let you give messages a special status to make them easier to find."
    />
  );
}
