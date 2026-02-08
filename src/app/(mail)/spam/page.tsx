import { getEmailList, deduplicateByThread } from "@/lib/queries/emails";
import { EmailList } from "../email-list";

export default async function SpamPage() {
  const emails = await getEmailList({ type: "spam" });
  const threads = deduplicateByThread(emails);

  return (
    <EmailList
      emails={threads}
      emptyTitle="No spam"
      emptyDescription="Hooray, no spam here!"
    />
  );
}
