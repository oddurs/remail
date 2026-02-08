"use client";

import { useTransition } from "react";
import { useSelection } from "@/components/mail/selection-provider";
import { useToast } from "@/components/ui/toast";
import {
  archiveEmails,
  unarchiveEmails,
  trashEmails,
  untrashEmails,
  markReadStatus,
} from "@/lib/actions/email";
import { MdArchive, MdDelete, MdMarkEmailRead, MdMarkEmailUnread } from "react-icons/md";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function InboxToolbar({
  totalCount,
  allEmailIds,
}: {
  totalCount: number;
  allEmailIds: string[];
}) {
  const { selectedIds, selectionCount, selectAll, clearSelection } =
    useSelection();
  const allSelected = allEmailIds.length > 0 && allEmailIds.every((id) => selectedIds.has(id));
  const someSelected = selectionCount > 0 && !allSelected;
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleArchive = () => {
    const ids = Array.from(selectedIds);
    startTransition(async () => {
      await archiveEmails(ids);
      clearSelection();
      showToast({
        message: `${ids.length} archived`,
        action: {
          label: "Undo",
          onClick: () => unarchiveEmails(ids),
        },
      });
    });
  };

  const handleTrash = () => {
    const ids = Array.from(selectedIds);
    startTransition(async () => {
      await trashEmails(ids);
      clearSelection();
      showToast({
        message: `${ids.length} moved to Trash`,
        action: {
          label: "Undo",
          onClick: () => untrashEmails(ids),
        },
      });
    });
  };

  const handleMarkRead = () => {
    const ids = Array.from(selectedIds);
    startTransition(async () => {
      await markReadStatus(ids, true);
      clearSelection();
    });
  };

  const handleMarkUnread = () => {
    const ids = Array.from(selectedIds);
    startTransition(async () => {
      await markReadStatus(ids, false);
      clearSelection();
    });
  };

  if (selectionCount > 0) {
    return (
      <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] px-4 py-2">
        <Checkbox
          checked={allSelected ? true : someSelected ? "indeterminate" : false}
          onCheckedChange={() => {
            if (allSelected) clearSelection();
            else selectAll(allEmailIds);
          }}
          aria-label={allSelected ? "Deselect all" : "Select all"}
        />

        <span className="text-sm font-medium text-[var(--color-text-primary)]">
          {selectionCount} selected
        </span>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={handleArchive} disabled={isPending}>
                <MdArchive className="size-4" />
                Archive
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive selected</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={handleTrash} disabled={isPending}>
                <MdDelete className="size-4" />
                Delete
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to trash</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={handleMarkRead} disabled={isPending}>
                <MdMarkEmailRead className="size-4" />
                Mark read
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mark as read</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={handleMarkUnread} disabled={isPending}>
                <MdMarkEmailUnread className="size-4" />
                Mark unread
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mark as unread</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  // Default toolbar (no selection)
  return (
    <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] px-4 py-2">
      <Checkbox
        checked={false}
        onCheckedChange={() => selectAll(allEmailIds)}
        aria-label="Select all"
      />

      <div className="flex-1" />

      <span className="text-xs text-[var(--color-text-tertiary)]">
        {totalCount > 0
          ? `1\u2013${totalCount} of ${totalCount}`
          : "No conversations"}
      </span>
    </div>
  );
}
