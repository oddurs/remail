import { getEmailList, deduplicateByThread } from "@/lib/queries/emails";
import { EmailList } from "../../email-list";
import { createServiceClient } from "@/lib/supabase/server";
import { requireSessionId } from "@/lib/session";

export default async function LabelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  // Get label name
  const { data: label } = await supabase
    .from("gmail_labels")
    .select("id, name, color")
    .eq("id", id)
    .eq("session_id", sessionId)
    .single();

  const emails = await getEmailList({ type: "label", labelId: id });
  const threads = deduplicateByThread(emails);

  return (
    <div className="flex flex-col">
      <div className="border-b border-[var(--color-border-subtle)] px-4 py-3">
        <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
          {label?.name ?? "Label"}
        </h1>
      </div>
      <EmailList
        emails={threads}
        emptyTitle={`No messages with label "${label?.name ?? "Unknown"}"`}
        emptyDescription="Messages with this label will appear here."
      />
    </div>
  );
}
