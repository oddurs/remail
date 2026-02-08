"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { CreateLabelModal } from "@/components/mail/create-label-modal";
import { EditLabelModal } from "@/components/mail/edit-label-modal";
import {
  Inbox,
  FileText,
  Send,
  Star,
  Clock,
  Bookmark,
  Mail,
  ShieldAlert,
  Trash2,
  FolderOpen,
  FolderClosed,
  ChevronDown,
  Plus,
  MoreVertical,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  } | null>(null);

  // Auto-expand "More" if user is on a route inside it
  const moreRoutes = ["/starred", "/snoozed", "/important", "/all", "/spam"];
  const isOnMoreRoute = moreRoutes.some(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );
  const [showMore, setShowMore] = useState(isOnMoreRoute);

  return (
    <ScrollArea className="flex-1 py-1 pr-2">
      <nav>
        {/* Primary nav */}
        <div className="space-y-0.5">
          <SidebarItem
            label="Inbox"
            href="/"
            pathname={pathname}
            count={inboxCount}
            icon={<Inbox className="size-5" />}
          />
          <SidebarItem
            label="Drafts"
            href="/drafts"
            pathname={pathname}
            count={draftCount}
            icon={<FileText className="size-5" />}
          />
          <SidebarItem
            label="Sent"
            href="/sent"
            pathname={pathname}
            icon={<Send className="size-5" />}
          />
        </div>

        {/* More folder — Collapsible */}
        <Collapsible
          open={showMore || isOnMoreRoute}
          onOpenChange={setShowMore}
          className="mt-0.5"
        >
          <CollapsibleTrigger asChild>
            <button
              className="flex w-full items-center gap-4 rounded-r-full py-1.5 pl-6 pr-3 text-[13px] font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors duration-100"
              aria-label={showMore || isOnMoreRoute ? "Collapse More" : "Expand More"}
            >
              <span className="shrink-0 opacity-70">
                {showMore || isOnMoreRoute ? (
                  <FolderOpen className="size-5" />
                ) : (
                  <FolderClosed className="size-5" />
                )}
              </span>
              <span className="flex-1 truncate text-left">More</span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 opacity-50 transition-transform duration-200",
                  (showMore || isOnMoreRoute) && "rotate-180"
                )}
              />
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-0.5 pl-4">
            <SidebarItem
              label="Starred"
              href="/starred"
              pathname={pathname}
              icon={<Star className="size-5" />}
            />
            <SidebarItem
              label="Snoozed"
              href="/snoozed"
              pathname={pathname}
              icon={<Clock className="size-5" />}
            />
            <SidebarItem
              label="Important"
              href="/important"
              pathname={pathname}
              icon={<Bookmark className="size-5" />}
            />
            <SidebarItem
              label="All Mail"
              href="/all"
              pathname={pathname}
              icon={<Mail className="size-5" />}
            />
            <SidebarItem
              label="Spam"
              href="/spam"
              pathname={pathname}
              count={spamCount}
              icon={<ShieldAlert className="size-5" />}
            />
          </CollapsibleContent>
        </Collapsible>

        {/* Trash — always visible */}
        <div className="mt-0.5 space-y-0.5">
          <SidebarItem
            label="Trash"
            href="/trash"
            pathname={pathname}
            icon={<Trash2 className="size-5" />}
          />
        </div>

        {/* Divider + Labels header */}
        <Separator className="mt-4 mb-2 mx-4" />
        <div className="mb-1 flex items-center justify-between pl-4 pr-3">
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
            Labels
          </span>
          <Button
            variant="ghost"
            size="icon-xs"
            className="rounded-full text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-secondary)]"
            onClick={() => setShowCreateLabel(true)}
            aria-label="Create new label"
          >
            <Plus className="size-4" />
          </Button>
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
                  <Tag
                    className="size-5"
                    style={{ color: label.color ?? undefined }}
                    fill={label.color ?? "currentColor"}
                    strokeWidth={0}
                  />
                }
              />
              <Button
                variant="ghost"
                size="icon-xs"
                className="invisible absolute right-2 top-1/2 -translate-y-1/2 rounded-full text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)] group-hover/label:visible"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setEditingLabel(label);
                }}
                aria-label={`Edit ${label.name}`}
              >
                <MoreVertical className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {showCreateLabel && (
            <CreateLabelModal onClose={() => setShowCreateLabel(false)} />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {editingLabel && (
            <EditLabelModal
              label={editingLabel}
              onClose={() => setEditingLabel(null)}
            />
          )}
        </AnimatePresence>
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
    <Button variant="ghost" size="sm" asChild className={cn(
      "w-full justify-start gap-4 rounded-r-full rounded-l-none py-1.5 pl-6 pr-3 text-[13px] h-auto transition-colors duration-100 hover:bg-[var(--color-bg-hover)]",
      hasCount ? "font-bold" : "font-medium",
      active
        ? "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/30"
        : "text-[var(--color-text-secondary)]"
    )}>
      <Link href={href}>
        {icon && (
          <span className={cn("shrink-0 [&_svg]:size-5", active ? "opacity-100" : "opacity-70")}>
            {icon}
          </span>
        )}
        <span className="flex-1 truncate">{label}</span>
        {hasCount && (
          <Badge variant="secondary" className="ml-auto h-5 min-w-[1.25rem] justify-center bg-transparent px-1 text-xs tabular-nums font-inherit">
            {count.toLocaleString()}
          </Badge>
        )}
      </Link>
    </Button>
  );
}
