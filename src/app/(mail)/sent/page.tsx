import { getEmailList, deduplicateByThread } from "@/lib/queries/emails";
import { EmailList } from "../email-list";

export default async function SentPage() {
  const emails = await getEmailList({ type: "sent" });
  const threads = deduplicateByThread(emails);

  return (
    <EmailList
      emails={threads}
      emptyTitle="No sent messages"
      emptyDescription="Messages you send will appear here."
    />
  );
}
