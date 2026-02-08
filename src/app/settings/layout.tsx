import Link from "next/link";

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
    <div className="flex h-screen flex-col bg-[var(--color-bg-primary)]">
      {/* Header */}
      <header className="flex h-[var(--topbar-height)] shrink-0 items-center gap-4 border-b border-[var(--color-border-subtle)] px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-[var(--transition-fast)]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <h1 className="text-lg font-medium text-[var(--color-text-primary)]">
          Settings
        </h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Settings sidebar */}
        <nav className="w-52 shrink-0 border-r border-[var(--color-border-subtle)] px-2 py-3">
          <div className="space-y-0.5">
            {settingsNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-[var(--radius-full)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-[var(--transition-fast)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Settings content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
