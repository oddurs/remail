import Link from "next/link";
import { MdArrowBack } from "react-icons/md";

const settingsNav = [
  { label: "General", href: "/settings" },
  { label: "Labels", href: "/settings/labels" },
  { label: "Inbox", href: "/settings/inbox" },
  { label: "Filters", href: "/settings/filters" },
  { label: "Signatures", href: "/settings/signatures" },
  { label: "Themes", href: "/settings/themes" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-[var(--color-border-subtle)] px-4 py-2">
        <Link
          href="/"
          className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
          aria-label="Back to inbox"
        >
          <MdArrowBack className="size-[18px]" />
        </Link>
        <h1 className="text-lg font-medium text-[var(--color-text-primary)]">
          Settings
        </h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Settings sidebar */}
        <nav className="w-48 shrink-0 border-r border-[var(--color-border-subtle)] px-2 py-3">
          <div className="space-y-0.5">
            {settingsNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-[var(--radius-sm)] px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-[var(--transition-fast)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Settings content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
