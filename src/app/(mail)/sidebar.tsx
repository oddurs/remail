"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CreateLabelModal } from "@/components/mail/create-label-modal";
import { EditLabelModal } from "@/components/mail/edit-label-modal";

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

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-1">
      {/* System labels */}
      <div className="space-y-0.5">
        <SidebarItem
          label="Inbox"
          href="/"
          pathname={pathname}
          count={inboxCount}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
              <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            </svg>
          }
        />
        <SidebarItem
          label="Starred"
          href="/starred"
          pathname={pathname}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          }
        />
        <SidebarItem
          label="Snoozed"
          href="/snoozed"
          pathname={pathname}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />
        <SidebarItem
          label="Sent"
          href="/sent"
          pathname={pathname}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4z" />
              <path d="M22 2 11 13" />
            </svg>
          }
        />
        <SidebarItem
          label="Drafts"
          href="/drafts"
          pathname={pathname}
          count={draftCount}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          }
        />
      </div>

      {/* Divider */}
      <div className="my-3 border-t border-[var(--color-border-subtle)]" />

      {/* More labels */}
      <div className="space-y-0.5">
        <SidebarItem
          label="All Mail"
          href="/all"
          pathname={pathname}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          }
        />
        <SidebarItem
          label="Spam"
          href="/spam"
          pathname={pathname}
          count={spamCount}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          }
        />
        <SidebarItem
          label="Trash"
          href="/trash"
          pathname={pathname}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          }
        />
        <SidebarItem
          label="Important"
          href="/important"
          pathname={pathname}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
          }
        />
      </div>

      {/* Divider */}
      <div className="my-3 border-t border-[var(--color-border-subtle)]" />

      {/* User labels header */}
      <div className="flex items-center justify-between px-3 py-1.5">
        <span className="text-xs font-medium tracking-wide text-[var(--color-text-tertiary)] uppercase">
          Labels
        </span>
        <button
          onClick={() => setShowCreateLabel(true)}
          className="rounded-[var(--radius-full)] p-1 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)]"
          aria-label="Add label"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {/* User labels from DB */}
      <div className="space-y-0.5">
        {labels.map((label) => (
          <div key={label.id} className="group/label relative">
            <SidebarItem
              label={label.name}
              href={`/label/${label.id}`}
              pathname={pathname}
              color={label.color ?? undefined}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
                  <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
                </svg>
              }
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setEditingLabel(label);
              }}
              className="invisible absolute right-1 top-1/2 -translate-y-1/2 rounded-[var(--radius-full)] p-1 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)] group-hover/label:visible"
              aria-label={`Edit ${label.name}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
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
  );
}

function SidebarItem({
  label,
  href,
  pathname,
  count,
  color,
  icon,
}: {
  label: string;
  href: string;
  pathname: string;
  count?: number;
  color?: string;
  icon?: React.ReactNode;
}) {
  const active =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`
        group flex items-center gap-3 rounded-[var(--radius-full)] px-3 py-1.5 text-sm font-medium transition-[var(--transition-fast)]
        ${
          active
            ? "bg-[var(--color-accent-subtle)] text-[var(--color-accent-primary)] [&_svg]:fill-current"
            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
        }
      `}
    >
      {icon && (
        <span className="shrink-0 [&_svg]:h-5 [&_svg]:w-5">
          {icon}
        </span>
      )}
      {color && (
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-[var(--radius-full)]"
          style={{ backgroundColor: color }}
        />
      )}
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={`text-xs tabular-nums ${active ? "" : "text-[var(--color-text-tertiary)]"}`}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
