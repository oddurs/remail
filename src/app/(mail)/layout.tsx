import { ensureSession } from "@/lib/actions/session";
import { createServiceClient } from "@/lib/supabase/server";
import { requireSessionId } from "@/lib/session";
import { SidebarNav } from "./sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { ComposeProvider } from "@/components/mail/compose-provider";
import { SelectionProvider } from "@/components/mail/selection-provider";
import { ComposeButton } from "./compose-button";
import { ToastProvider } from "@/components/ui/toast";
import { SearchBar } from "@/components/mail/search-bar";
import { KeyboardShortcuts } from "@/components/mail/keyboard-shortcuts";
import Link from "next/link";
import { Suspense } from "react";

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

  // Get default signature
  const { data: signature } = await supabase
    .from("gmail_signatures")
    .select("body_html")
    .eq("session_id", sessionId)
    .eq("is_default", true)
    .single();

  return {
    labels: labels ?? [],
    inboxCount: inboxCount ?? 0,
    draftCount: draftCount ?? 0,
    spamCount: spamCount ?? 0,
    defaultSignature: signature?.body_html ?? undefined,
  };
}

export default async function MailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure session exists and is seeded before rendering
  await ensureSession();
  const { labels, inboxCount, draftCount, spamCount, defaultSignature } =
    await getSidebarData();
  return (
    <ToastProvider>
      <ComposeProvider defaultSignature={defaultSignature}>
        <SelectionProvider>
        <div className="flex h-screen flex-col overflow-hidden">
          {/* Topbar — full width, above sidebar + content */}
          <header className="flex h-[var(--topbar-height)] shrink-0 items-center gap-2 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] px-4">
            {/* Hamburger */}
            <button className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]" aria-label="Main menu">
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
            <Link href="/" className="flex items-center gap-2 mr-4 shrink-0">
              <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Envelope body with rounded corners */}
                <rect x="1" y="1" width="28" height="22" rx="4" fill="#F1F3F4"/>
                {/* Left panel — blue */}
                <path d="M1 5C1 2.79 2.79 1 5 1H8V10L1 5Z" fill="#4285F4"/>
                <path d="M1 5V19C1 21.21 2.79 23 5 23H8V10L1 5Z" fill="#4285F4" opacity="0.8"/>
                {/* Right panel — green */}
                <path d="M29 5C29 2.79 27.21 1 25 1H22V10L29 5Z" fill="#34A853"/>
                <path d="M29 5V19C29 21.21 27.21 23 25 23H22V10L29 5Z" fill="#34A853" opacity="0.8"/>
                {/* Top-left flap — red */}
                <path d="M5 1C2.79 1 1 2.79 1 5L8 10V1H5Z" fill="#EA4335"/>
                {/* Top-right flap — yellow */}
                <path d="M25 1C27.21 1 29 2.79 29 5L22 10V1H25Z" fill="#FBBC04"/>
                {/* Center chevron — red */}
                <path d="M8 1H22V10L15 16L8 10V1Z" fill="#EA4335"/>
                {/* Highlight stroke for depth */}
                <path d="M8 10L15 16L22 10" stroke="white" strokeWidth="0.5" opacity="0.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[22px] text-[var(--color-text-secondary)]">
                ReMail
              </span>
            </Link>

            {/* Search bar */}
            <Suspense>
              <SearchBar />
            </Suspense>

            {/* Right section */}
            <div className="ml-auto flex items-center gap-0.5">
              {/* Help */}
              <button
                className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
                aria-label="Help"
              >
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
              </button>

              {/* Settings */}
              <Link
                href="/settings"
                className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
                aria-label="Settings"
              >
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
              </Link>

              {/* Theme toggle */}
              <ThemeToggle />

              {/* Google Apps grid */}
              <button
                className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
                aria-label="Google apps"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="4" cy="4" r="2" />
                  <circle cx="12" cy="4" r="2" />
                  <circle cx="20" cy="4" r="2" />
                  <circle cx="4" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="20" cy="12" r="2" />
                  <circle cx="4" cy="20" r="2" />
                  <circle cx="12" cy="20" r="2" />
                  <circle cx="20" cy="20" r="2" />
                </svg>
              </button>

              {/* Avatar */}
              <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-accent-primary)] text-xs font-medium text-[var(--color-text-inverse)] cursor-pointer">
                G
              </div>
            </div>
          </header>

          {/* Sidebar + Content below topbar */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <aside className="flex w-[var(--sidebar-width)] shrink-0 flex-col bg-[var(--color-bg-primary)]">
              {/* Compose button */}
              <div className="p-4">
                <ComposeButton />
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
            <main className="flex flex-1 flex-col overflow-y-auto bg-[var(--color-bg-primary)]">
              {children}
            </main>
          </div>
        </div>
        <KeyboardShortcuts />
        </SelectionProvider>
      </ComposeProvider>
    </ToastProvider>
  );
}
