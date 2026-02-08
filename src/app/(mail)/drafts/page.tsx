import { getEmailList, deduplicateByThread } from "@/lib/queries/emails";
import { EmailList } from "../email-list";

export default async function DraftsPage() {
  const emails = await getEmailList({ type: "drafts" });
  const threads = deduplicateByThread(emails);

  return (
    <EmailList
      emails={threads}
      emptyTitle="No drafts"
      emptyDescription="Messages you start composing will be saved here."
    />
  );
}
