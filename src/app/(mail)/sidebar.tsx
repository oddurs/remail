"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

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

  return (
    <nav className="flex-1 overflow-y-auto px-2 py-1">
      {/* System labels */}
      <div className="space-y-0.5">
        <SidebarItem
          label="Inbox"
          href="/"
          pathname={pathname}
          count={inboxCount}
        />
        <SidebarItem label="Starred" href="/starred" pathname={pathname} />
        <SidebarItem label="Snoozed" href="/snoozed" pathname={pathname} />
        <SidebarItem label="Sent" href="/sent" pathname={pathname} />
        <SidebarItem
          label="Drafts"
          href="/drafts"
          pathname={pathname}
          count={draftCount}
        />
      </div>

      {/* Divider */}
      <div className="my-3 border-t border-[var(--color-border-subtle)]" />

      {/* More labels */}
      <div className="space-y-0.5">
        <SidebarItem label="All Mail" href="/all" pathname={pathname} />
        <SidebarItem
          label="Spam"
          href="/spam"
          pathname={pathname}
          count={spamCount}
        />
        <SidebarItem label="Trash" href="/trash" pathname={pathname} />
        <SidebarItem label="Important" href="/important" pathname={pathname} />
      </div>

      {/* Divider */}
      <div className="my-3 border-t border-[var(--color-border-subtle)]" />

      {/* User labels header */}
      <div className="flex items-center justify-between px-3 py-1.5">
        <span className="text-xs font-medium tracking-wide text-[var(--color-text-tertiary)] uppercase">
          Labels
        </span>
        <button className="rounded-[var(--radius-full)] p-1 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)]">
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
          <SidebarItem
            key={label.id}
            label={label.name}
            href={`/label/${label.id}`}
            pathname={pathname}
            color={label.color ?? undefined}
          />
        ))}
      </div>
    </nav>
  );
}

function SidebarItem({
  label,
  href,
  pathname,
  count,
  color,
}: {
  label: string;
  href: string;
  pathname: string;
  count?: number;
  color?: string;
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
            ? "bg-[var(--color-accent-subtle)] text-[var(--color-accent-primary)]"
            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
        }
      `}
    >
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
