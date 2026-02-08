import { ensureSession } from "@/lib/actions/session";
import { createServiceClient } from "@/lib/supabase/server";
import { requireSessionId } from "@/lib/session";
import { SidebarNav } from "./sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

async function getSidebarData() {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  // Get user labels
  const { data: labels } = await supabase
    .from("gmail_labels")
    .select("id, name, color, type, position")
    .eq("session_id", sessionId)
    .eq("type", "user")
    .eq("show_in_list", true)
    .order("position");

  // Get unread inbox count
  const { count: inboxCount } = await supabase
    .from("gmail_emails")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId)
    .eq("is_read", false)
    .eq("is_trash", false)
    .eq("is_spam", false)
    .eq("is_draft", false)
    .eq("is_archived", false);

  // Get draft count
  const { count: draftCount } = await supabase
    .from("gmail_emails")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId)
    .eq("is_draft", true)
    .eq("is_trash", false);

  // Get spam count
  const { count: spamCount } = await supabase
    .from("gmail_emails")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId)
    .eq("is_spam", true)
    .eq("is_trash", false);

  return {
    labels: labels ?? [],
    inboxCount: inboxCount ?? 0,
    draftCount: draftCount ?? 0,
    spamCount: spamCount ?? 0,
  };
}

export default async function MailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure session exists and is seeded before rendering
  await ensureSession();
  const { labels, inboxCount, draftCount, spamCount } = await getSidebarData();
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="flex w-[var(--sidebar-width)] shrink-0 flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]">
        {/* Compose button */}
        <div className="p-4">
          <button className="flex w-full items-center gap-3 rounded-[var(--radius-lg)] bg-[var(--color-accent-subtle)] px-6 py-3.5 text-sm font-medium text-[var(--color-accent-primary)] shadow-[var(--shadow-sm)] transition-[var(--transition-normal)] hover:bg-[var(--color-accent-muted)] hover:shadow-[var(--shadow-md)]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Compose
          </button>
        </div>

        {/* Navigation */}
        <SidebarNav
          inboxCount={inboxCount}
          draftCount={draftCount}
          spamCount={spamCount}
          labels={labels}
        />
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-[var(--topbar-height)] shrink-0 items-center gap-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] px-4">
          {/* Hamburger */}
          <button className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>

          {/* Logo */}
          <span className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            Mail
          </span>

          {/* Search bar */}
          <div className="mx-4 flex max-w-2xl flex-1">
            <div className="flex w-full items-center gap-3 rounded-[var(--radius-full)] bg-[var(--color-bg-tertiary)] px-4 py-2.5 transition-[var(--transition-normal)] focus-within:bg-[var(--color-bg-primary)] focus-within:shadow-[var(--shadow-md)]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-[var(--color-text-secondary)]"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Search mail"
                className="w-full bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-1">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Settings */}
            <button className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>

            {/* Avatar */}
            <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-accent-primary)] text-xs font-medium text-[var(--color-text-inverse)]">
              G
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[var(--color-bg-primary)]">
          {children}
        </main>
      </div>
    </div>
  );
}
