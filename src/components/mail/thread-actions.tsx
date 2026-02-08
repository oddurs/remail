"use client";

import { useCompose } from "@/components/mail/compose-provider";
import { useRouter } from "next/navigation";
import {
  toggleStar,
  archiveThread,
  unarchiveThread,
  trashThread,
  untrashThread,
  markThreadReadStatus,
} from "@/lib/actions/email";
import { useToast } from "@/components/ui/toast";
import { useState, useTransition } from "react";
import { SnoozePicker } from "@/components/mail/snooze-picker";
import { LabelPicker } from "@/components/mail/label-picker";
import { escapeHtml } from "@/lib/utils";
import { MdArchive, MdDelete, MdMarkEmailUnread, MdStar, MdStarBorder, MdSchedule, MdLabel, MdReply, MdReplyAll, MdForward, MdMoreVert, MdAccessTime, MdAddTask, MdEvent, MdFilterList, MdVolumeOff, MdChevronRight } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

/* ─── Thread Toolbar Actions ─────────────────────────────────────────────────── */

export function ThreadToolbarActions({ threadId }: { threadId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleArchive = () => {
    startTransition(async () => {
      await archiveThread(threadId);
      router.push("/");
      showToast({
        message: "Conversation archived",
        action: {
          label: "Undo",
          onClick: () => unarchiveThread(threadId),
        },
      });
    });
  };

  const handleTrash = () => {
    startTransition(async () => {
      await trashThread(threadId);
      router.push("/");
      showToast({
        message: "Conversation moved to Trash",
        action: {
          label: "Undo",
          onClick: () => untrashThread(threadId),
        },
      });
    });
  };

  const handleMarkUnread = () => {
    startTransition(async () => {
      await markThreadReadStatus(threadId, false);
      router.push("/");
    });
  };

  return (
    <div className="flex items-center gap-1">
      <Button variant="outline" size="sm" onClick={handleArchive} disabled={isPending}>
        <MdArchive className="size-3.5" />
        Archive
      </Button>
      <Button variant="outline" size="sm" onClick={handleTrash} disabled={isPending}>
        <MdDelete className="size-3.5" />
        Delete
      </Button>
      <Button variant="outline" size="sm" onClick={handleMarkUnread} disabled={isPending}>
        <MdMarkEmailUnread className="size-3.5" />
        Unread
      </Button>
    </div>
  );
}

/* ─── Star Button ────────────────────────────────────────────────────────────── */

export function StarButton({
  emailId,
  starred,
}: {
  emailId: string;
  starred: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={() => {
        startTransition(async () => {
          await toggleStar(emailId, !starred);
        });
      }}
      disabled={isPending}
      className={starred ? "text-[var(--color-star)] hover:text-[var(--color-star)]" : "text-[var(--color-text-tertiary)]"}
      aria-label={starred ? "Unstar" : "Star"}
    >
      {starred ? <MdStar className="size-3.5" /> : <MdStarBorder className="size-3.5" />}
    </Button>
  );
}

/* ─── Thread Snooze Button ──────────────────────────────────────────────────── */

export function ThreadSnoozeButton({ emailId }: { emailId: string }) {
  const [showSnooze, setShowSnooze] = useState(false);

  return (
    <Popover open={showSnooze} onOpenChange={setShowSnooze}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <MdSchedule className="size-3.5" />
          Snooze
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-0 border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-lg)]">
        <SnoozePicker
          emailId={emailId}
          onClose={() => setShowSnooze(false)}
        />
      </PopoverContent>
    </Popover>
  );
}

/* ─── Thread Label Button ──────────────────────────────────────────────────── */

export function ThreadLabelButton({
  emailIds,
  currentLabelIds,
  labels,
}: {
  emailIds: string[];
  currentLabelIds: string[];
  labels: Array<{ id: string; name: string; color: string | null; icon?: string | null }>;
}) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <Popover open={showPicker} onOpenChange={setShowPicker}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <MdLabel className="size-3.5" />
          Label
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-0 border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-lg)]">
        <LabelPicker
          emailIds={emailIds}
          currentLabelIds={currentLabelIds}
          labels={labels}
          onClose={() => setShowPicker(false)}
        />
      </PopoverContent>
    </Popover>
  );
}

/* ─── Reply / Forward Buttons ────────────────────────────────────────────────── */

interface ReplyForwardProps {
  threadId: string;
  subject: string;
  senderName: string;
  senderEmail: string;
  bodyHtml: string;
  sentAt: string;
}

export function ReplyButton({
  threadId,
  subject,
  senderName,
  senderEmail,
  bodyHtml,
  sentAt,
}: ReplyForwardProps) {
  const { openReply } = useCompose();

  const handleReply = () => {
    const replySubject = subject.startsWith("Re:") ? subject : `Re: ${subject}`;
    const quotedHtml = `
      <br><br>
      <div style="border-left: 2px solid #ccc; padding-left: 12px; color: #666;">
        <p>On ${escapeHtml(sentAt)}, ${escapeHtml(senderName)} &lt;${escapeHtml(senderEmail)}&gt; wrote:</p>
        ${bodyHtml}
      </div>
    `;

    openReply({
      to: [{ id: senderEmail, name: senderName, email: senderEmail }],
      subject: replySubject,
      bodyHtml: quotedHtml,
      threadId,
    });
  };

  return (
    <Button variant="outline" className="rounded-full" onClick={handleReply}>
      <MdReply className="size-3.5" />
      Reply
    </Button>
  );
}

export function ReplyAllButton({
  threadId,
  subject,
  senderName,
  senderEmail,
  bodyHtml,
  sentAt,
  allRecipients,
}: ReplyForwardProps & {
  allRecipients: Array<{ name: string; email: string }>;
}) {
  const { openReply } = useCompose();

  const handleReplyAll = () => {
    const replySubject = subject.startsWith("Re:") ? subject : `Re: ${subject}`;
    const quotedHtml = `
      <br><br>
      <div style="border-left: 2px solid #ccc; padding-left: 12px; color: #666;">
        <p>On ${escapeHtml(sentAt)}, ${escapeHtml(senderName)} &lt;${escapeHtml(senderEmail)}&gt; wrote:</p>
        ${bodyHtml}
      </div>
    `;

    openReply({
      to: allRecipients.map((r) => ({ id: r.email, name: r.name, email: r.email })),
      subject: replySubject,
      bodyHtml: quotedHtml,
      threadId,
    });
  };

  return (
    <Button variant="outline" className="rounded-full" onClick={handleReplyAll}>
      <MdReplyAll className="size-3.5" />
      Reply all
    </Button>
  );
}

export function ForwardButton({
  threadId,
  subject,
  senderName,
  senderEmail,
  bodyHtml,
  sentAt,
}: ReplyForwardProps) {
  const { openForward } = useCompose();

  const handleForward = () => {
    const fwdSubject = subject.startsWith("Fwd:") ? subject : `Fwd: ${subject}`;
    const forwardedHtml = `
      <br><br>
      <div>
        <p>---------- Forwarded message ----------</p>
        <p>From: ${escapeHtml(senderName)} &lt;${escapeHtml(senderEmail)}&gt;</p>
        <p>Date: ${escapeHtml(sentAt)}</p>
        <p>Subject: ${escapeHtml(subject)}</p>
        <br>
        ${bodyHtml}
      </div>
    `;

    openForward({
      subject: fwdSubject,
      bodyHtml: forwardedHtml,
      threadId,
    });
  };

  return (
    <Button variant="outline" className="rounded-full" onClick={handleForward}>
      <MdForward className="size-3.5" />
      Forward
    </Button>
  );
}

/* ─── More Menu Content (shared items) ──────────────────────────────────── */

function MoreMenuContent() {
  return (
    <>
      <DropdownMenuItem>
        <MdAccessTime className="size-3.5" />
        Snooze
      </DropdownMenuItem>
      <DropdownMenuItem>
        <MdAddTask className="size-3.5" />
        Add to Tasks
      </DropdownMenuItem>
      <DropdownMenuItem>
        <MdEvent className="size-3.5" />
        Create event
      </DropdownMenuItem>
      <DropdownMenuItem>
        <MdForward className="size-3.5" />
        Forward all
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <MdLabel className="size-3.5" />
        <span className="flex-1">Label as</span>
        <MdChevronRight className="size-3 text-[var(--color-text-tertiary)]" />
      </DropdownMenuItem>
      <DropdownMenuItem>
        <MdFilterList className="size-3.5" />
        Filter messages like these
      </DropdownMenuItem>
      <DropdownMenuItem>
        <MdVolumeOff className="size-3.5" />
        Mute
      </DropdownMenuItem>
    </>
  );
}

/* ─── Message More Menu (per-email ⋮) ────────────────────────────────────── */

export function MessageMoreMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-xs" onClick={(e) => e.stopPropagation()} aria-label="More">
          <MdMoreVert className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <MoreMenuContent />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ─── Toolbar More Menu (thread toolbar ⋮) ──────────────────────────────── */

export function ToolbarMoreMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MdMoreVert className="size-3.5" />
          More
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <MoreMenuContent />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
