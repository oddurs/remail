"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CreateLabelModal, getLabelIcon } from "@/components/mail/create-label-modal";
import { EditLabelModal } from "@/components/mail/edit-label-modal";
import { MdLabel } from "react-icons/md";
import {
  MdOutlineInbox,
  MdOutlineDescription,
  MdOutlineSend,
  MdOutlineStarBorder,
  MdOutlineSchedule,
  MdOutlineBookmarkBorder,
  MdOutlineMail,
  MdOutlineReport,
  MdOutlineDelete,
  MdExpandMore,
  MdAdd,
  MdMoreVert,
} from "react-icons/md";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  inboxCount: number;
  draftCount: number;
  spamCount: number;
  labels: Array<{
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
  }>;
}

export function SidebarNav({
  inboxCount,
  draftCount,
  spamCount,
  labels,
}: SidebarNavProps) {
  const pathname = usePathname();
  const [showCreateLabel, setShowCreateLabel] = useState(false);
  const [editingLabel, setEditingLabel] = useState<{
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
  } | null>(null);

  // Auto-expand "More" if user is on a route inside it
  const moreRoutes = ["/important", "/all", "/spam", "/trash"];
  const isOnMoreRoute = moreRoutes.some(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );
  const [showMore, setShowMore] = useState(isOnMoreRoute);

  return (
    <ScrollArea className="flex-1 px-2 py-2">
      <nav>
        {/* Primary nav */}
        <div className="space-y-0.5">
          <SidebarItem
            label="Inbox"
            href="/"
            pathname={pathname}
            count={inboxCount}
            icon={<MdOutlineInbox className="size-5" />}
          />
          <SidebarItem
            label="Starred"
            href="/starred"
            pathname={pathname}
            icon={<MdOutlineStarBorder className="size-5" />}
          />
          <SidebarItem
            label="Snoozed"
            href="/snoozed"
            pathname={pathname}
            icon={<MdOutlineSchedule className="size-5" />}
          />
          <SidebarItem
            label="Drafts"
            href="/drafts"
            pathname={pathname}
            count={draftCount}
            icon={<MdOutlineDescription className="size-5" />}
          />
          <SidebarItem
            label="Sent"
            href="/sent"
            pathname={pathname}
            icon={<MdOutlineSend className="size-5" />}
          />
        </div>

        {/* More — Collapsible */}
        <Collapsible
          open={showMore || isOnMoreRoute}
          onOpenChange={setShowMore}
          className="mt-0.5"
        >
          <CollapsibleTrigger asChild>
            <button
              className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors duration-100"
              aria-label={showMore || isOnMoreRoute ? "Collapse More" : "Expand More"}
            >
              <span className="flex-1 truncate text-left">More</span>
              <MdExpandMore
                className={cn(
                  "size-4 shrink-0 opacity-50 transition-transform duration-200",
                  (showMore || isOnMoreRoute) && "rotate-180"
                )}
              />
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-0.5">
            <SidebarItem
              label="Important"
              href="/important"
              pathname={pathname}
              icon={<MdOutlineBookmarkBorder className="size-5" />}
            />
            <SidebarItem
              label="All Mail"
              href="/all"
              pathname={pathname}
              icon={<MdOutlineMail className="size-5" />}
            />
            <SidebarItem
              label="Spam"
              href="/spam"
              pathname={pathname}
              count={spamCount}
              icon={<MdOutlineReport className="size-5" />}
            />
            <SidebarItem
              label="Trash"
              href="/trash"
              pathname={pathname}
              icon={<MdOutlineDelete className="size-5" />}
            />
          </CollapsibleContent>
        </Collapsible>

        {/* Divider + Labels header */}
        <div className="mt-4 mb-2 mx-3 border-t border-[var(--color-border-default)]" />
        <div className="mb-1 flex items-center justify-between px-3">
          <span className="text-xs font-medium text-[var(--color-text-tertiary)]">
            Labels
          </span>
          <button
            className="rounded-full p-0.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-secondary)] transition-colors"
            onClick={() => setShowCreateLabel(true)}
            aria-label="Create new label"
          >
            <MdAdd className="size-4" />
          </button>
        </div>

        {/* User labels */}
        <div className="space-y-0.5">
          {labels.map((label) => (
            <div key={label.id} className="group/label relative">
              <SidebarItem
                label={label.name}
                href={`/label/${label.id}`}
                pathname={pathname}
                icon={
                  (() => {
                    const LabelIconComponent = getLabelIcon(label.icon) ?? MdLabel;
                    return (
                      <span
                        className="flex size-5 items-center justify-center rounded-full"
                        style={{ backgroundColor: label.color ?? "var(--color-text-tertiary)" }}
                      >
                        <LabelIconComponent className="size-3 text-white" />
                      </span>
                    );
                  })()
                }
              />
              <button
                className="invisible absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)] group-hover/label:visible transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setEditingLabel(label);
                }}
                aria-label={`Edit ${label.name}`}
              >
                <MdMoreVert className="size-3.5" />
              </button>
            </div>
          ))}
        </div>

        {showCreateLabel && (
          <CreateLabelModal onClose={() => setShowCreateLabel(false)} />
        )}
        {editingLabel && (
          <EditLabelModal
            label={editingLabel}
            onClose={() => setEditingLabel(null)}
          />
        )}
      </nav>
    </ScrollArea>
  );
}

function SidebarItem({
  label,
  href,
  pathname,
  count,
  icon,
}: {
  label: string;
  href: string;
  pathname: string;
  count?: number;
  icon?: React.ReactNode;
}) {
  const active =
    pathname === href || (href !== "/" && pathname.startsWith(href));
  const hasCount = count !== undefined && count > 0;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-1.5 text-sm transition-colors duration-100",
        hasCount ? "font-semibold" : "font-medium",
        active
          ? "bg-[var(--color-bg-active)] text-[var(--color-text-primary)]"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
      )}
    >
      {icon && (
        <span className={cn("shrink-0", active ? "opacity-70" : "opacity-50")}>
          {icon}
        </span>
      )}
      <span className="flex-1 truncate">{label}</span>
      {hasCount && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-bg-tertiary)] px-1.5 text-[11px] font-medium tabular-nums text-[var(--color-text-secondary)]">
          {count.toLocaleString()}
        </span>
      )}
    </Link>
  );
}
