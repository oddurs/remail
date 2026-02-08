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
import { AvatarDropdown } from "./avatar-dropdown";
import { IconButton } from "@/components/ui/icon-button";
import { MdMenu, MdHelpOutline, MdSettings, MdApps } from "react-icons/md";
import Link from "next/link";
import { Suspense } from "react";

async function getSidebarData() {
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  // Get user labels
  const { data: labels } = await supabase
    .from("gmail_labels")
    .select("id, name, color, icon, type, position")
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

  // Get self contact avatar
  const { data: selfContact } = await supabase
    .from("gmail_contacts")
    .select("avatar_url, name, email")
    .eq("session_id", sessionId)
    .eq("is_self", true)
    .single();

  return {
    labels: labels ?? [],
    inboxCount: inboxCount ?? 0,
    draftCount: draftCount ?? 0,
    spamCount: spamCount ?? 0,
    defaultSignature: signature?.body_html ?? undefined,
    selfAvatarUrl: selfContact?.avatar_url ?? undefined,
    selfName: selfContact?.name ?? "User",
    selfEmail: selfContact?.email ?? "guest@remail.app",
  };
}

export default async function MailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure session exists and is seeded before rendering
  await ensureSession();
  const { labels, inboxCount, draftCount, spamCount, defaultSignature, selfAvatarUrl, selfName, selfEmail } =
    await getSidebarData();
  return (
    <ToastProvider>
      <ComposeProvider defaultSignature={defaultSignature}>
        <SelectionProvider>
        <div className="flex h-screen flex-col overflow-hidden bg-[var(--color-bg-secondary)]">
          {/* Topbar — floating, no background */}
          <header className="flex h-[var(--topbar-height)] shrink-0 items-center px-4">
            {/* Left section — matches sidebar width, padded to align with nav items */}
            <div className="flex w-[calc(var(--sidebar-width)+16px)] shrink-0 items-center justify-between pl-4 pr-6">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-1.5 shrink-0">
                <svg width="24" height="20" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Envelope body with rounded corners */}
                <rect x="1" y="1" width="28" height="22" rx="4" fill="transparent"/>
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
              <span className="text-[18px] font-medium text-[var(--color-text-secondary)]">
                ReMail
              </span>
            </Link>

              <ComposeButton />
            </div>

            {/* Search bar — left-aligned with main content */}
            <div className="flex flex-1 items-center gap-2">
              <Suspense>
                <SearchBar />
              </Suspense>
            </div>

            {/* Right section */}
            <div className="ml-auto flex items-center gap-0.5">
              {/* Help */}
              <IconButton tooltip="Help" aria-label="Help">
                <MdHelpOutline className="size-5" />
              </IconButton>

              {/* Settings */}
              <IconButton tooltip="Settings" aria-label="Settings" asChild>
                <Link href="/settings">
                  <MdSettings className="size-5" />
                </Link>
              </IconButton>

              {/* Theme toggle */}
              <ThemeToggle />

              {/* Google Apps grid */}
              <IconButton tooltip="Google apps" aria-label="Google apps">
                <MdApps className="size-5" />
              </IconButton>

              {/* Avatar dropdown */}
              <AvatarDropdown
                name={selfName}
                email={selfEmail}
                avatarUrl={selfAvatarUrl}
              />
            </div>
          </header>

          {/* Sidebar + Content below topbar */}
          <div className="flex flex-1 gap-4 overflow-hidden px-4 pb-4">
            {/* Sidebar */}
            <aside className="flex w-[var(--sidebar-width)] shrink-0 flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] shadow-[var(--shadow-xs)]">
              <div className="flex items-center px-3 pt-2">
                <IconButton tooltip="Main menu" aria-label="Main menu">
                  <MdMenu className="size-5" />
                </IconButton>
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
            <main className="flex flex-1 flex-col overflow-hidden">
              <div className="flex flex-1 flex-col overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] shadow-[var(--shadow-xs)]">
                {children}
              </div>
            </main>
          </div>
        </div>
        <KeyboardShortcuts />
        </SelectionProvider>
      </ComposeProvider>
    </ToastProvider>
  );
}
