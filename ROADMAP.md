# Gmail Redesign — Roadmap to v1.0.0

> A fantasy Gmail redesign built as a portfolio piece.
> No login. No real email. Every view. Every interaction. World-class design.

---

## Table of Contents

1. [Vision & Principles](#vision--principles)
2. [Architecture Overview](#architecture-overview)
3. [Milestone 0 — Project Bootstrap](#milestone-0--project-bootstrap-v001)
4. [Milestone 1 — The Shell](#milestone-1--the-shell-v010)
5. [Milestone 2 — Reading Mail](#milestone-2--reading-mail-v020)
6. [Milestone 3 — Writing Mail](#milestone-3--writing-mail-v030)
7. [Milestone 4 — Organization](#milestone-4--organization-v040)
8. [Milestone 5 — Search](#milestone-5--search-v050)
9. [Milestone 6 — Settings & Preferences](#milestone-6--settings--preferences-v060)
10. [Milestone 7 — Seed Engine & Admin](#milestone-7--seed-engine--admin-v070)
11. [Milestone 8 — Theming & Visual Identity](#milestone-8--theming--visual-identity-v080)
12. [Milestone 9 — Interactions & Polish](#milestone-9--interactions--polish-v090)
13. [Milestone 10 — Production Readiness](#milestone-10--production-readiness-v0100)
14. [Release — v1.0.0](#release--v100)
15. [Beyond 1.0 — Future Explorations](#beyond-10--future-explorations)
16. [Database Schema Reference](#database-schema-reference)
17. [Feature Parity Checklist](#feature-parity-checklist)

---

## Vision & Principles

**What this is:** A fully interactive, no-auth Gmail replica that serves as a design
portfolio piece. Visitors land directly in a seeded inbox and can explore every view,
compose emails, organize with labels, search, and customize themes — all within an
isolated sandbox session that requires zero signup.

**What this is not:** A real email client. No SMTP. No IMAP. No OAuth. No real
addresses. It is a closed-loop simulation where "sending" an email writes to the
database and the response ecosystem lives entirely within the visitor's session.

### Design Principles

1. **Zero friction** — No login, no onboarding, no modals on first load. You land in
   the inbox. The app speaks for itself.
2. **Full fidelity** — Every Gmail view, every action, every keyboard shortcut. If
   Gmail has it, this has it. But reimagined.
3. **Fantasy design** — This is not a pixel-perfect clone. It is a redesign. Every
   surface should feel like a considered improvement: better typography, better
   spacing, better color, better motion. A love letter to what Gmail could be.
4. **Themable to the core** — Dark mode, light mode, and accent palettes are not
   afterthoughts. The theming system is a first-class architectural decision. Every
   component must look stunning in every theme.
5. **Performance is design** — Instant navigation, optimistic updates, skeleton
   loading states. Perceived performance is part of the visual language.
6. **Accessible by default** — Semantic HTML, ARIA attributes, keyboard navigation,
   focus management, screen reader support. Beautiful and usable by everyone.

### Technical Principles

1. **Server Components first** — Only add `'use client'` when the component genuinely
   needs browser APIs, event handlers, or hooks.
2. **Type safety everywhere** — Strict TypeScript, Zod at boundaries, generated
   Supabase types. No `any`.
3. **Composition over abstraction** — Small, focused components. No premature
   abstractions. Wait for the third occurrence.
4. **Colocate everything** — Components live near their routes. Tests live next to
   source. Styles live in the component.
5. **Optimistic by default** — Mutations update the UI immediately and reconcile with
   the server in the background. Failures revert gracefully.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                        Vercel                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Next.js 15 (App Router)              │  │
│  │                                                   │  │
│  │  middleware.ts ── session cookie (UUID)            │  │
│  │       │                                           │  │
│  │  ┌────┴──────────────────────────────────┐        │  │
│  │  │         Server Components             │        │  │
│  │  │  ┌─────────┐ ┌──────────┐ ┌────────┐ │        │  │
│  │  │  │ Layouts  │ │  Pages   │ │ Server │ │        │  │
│  │  │  │         │ │          │ │Actions │ │        │  │
│  │  │  └─────────┘ └──────────┘ └────────┘ │        │  │
│  │  └───────────────────┬───────────────────┘        │  │
│  │                      │                            │  │
│  │  ┌───────────────────┴───────────────────┐        │  │
│  │  │         Client Components             │        │  │
│  │  │  ┌─────────┐ ┌──────────┐ ┌────────┐ │        │  │
│  │  │  │Compose  │ │ Search   │ │ Theme  │ │        │  │
│  │  │  │Modal    │ │ Bar      │ │Picker  │ │        │  │
│  │  │  └─────────┘ └──────────┘ └────────┘ │        │  │
│  │  └───────────────────────────────────────┘        │  │
│  └───────────────────────┬───────────────────────────┘  │
│                          │                              │
└──────────────────────────┼──────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │  Supabase   │
                    │             │
                    │  Postgres   │
                    │  Storage    │
                    │  Edge Fns   │
                    └─────────────┘
```

### Session Model

```
First Visit:
  1. middleware.ts detects no `session_id` cookie
  2. Generates UUID, sets httpOnly cookie (7-day expiry)
  3. Server action creates session row in DB
  4. DB trigger seeds mailbox with starter data
  5. User lands in inbox — fully populated, zero delay

Return Visit:
  1. middleware.ts reads existing `session_id` cookie
  2. All queries scoped to that session
  3. User picks up where they left off

Session Expiry:
  1. Supabase cron job runs daily
  2. Deletes sessions older than 7 days
  3. Cascading deletes clean up all associated data
```

---

## Milestone 0 — Project Bootstrap `v0.0.1`

The absolute foundation. Nothing visible yet, but everything is wired.

### 0.1 — Repository & Tooling

- [x] Initialize Next.js 15 with App Router, TypeScript strict mode
- [x] Configure Tailwind CSS v4
- [x] Install and configure ESLint (next, typescript, tailwind rules)
- [ ] Install and configure Prettier
- [x] Set up path aliases (`@/` for `src/`)
- [x] Add `.env.local` template with Supabase vars
- [x] Add `.gitignore` (node_modules, .next, .env\*.local)
- [ ] Initialize git repository with initial commit
- [x] Add `cn()` utility (clsx + tailwind-merge)
- [ ] Install Radix UI primitives (dialog, dropdown, tooltip, popover, tabs, etc.)
- [x] Install Zod
- [x] Install `@supabase/ssr` and `@supabase/supabase-js`

### 0.2 — Supabase Project

- [x] ~~Create Supabase project~~ Using existing `forgehq` project
- [x] Configure project settings (region, plan)
- [x] Store connection credentials in `.env.local`
- [x] Create Supabase server client utility (`lib/supabase/server.ts`)
- [x] Create Supabase browser client utility (`lib/supabase/client.ts`)
- [x] Create Supabase middleware utility (`lib/supabase/middleware.ts`)
- [x] Generate initial TypeScript types (placeholder, will regenerate after schema)

### 0.3 — Database Schema (Full)

- [x] `gmail_sessions` table — visitor identity, preferences, timestamps
- [x] `gmail_contacts` table — name, email, avatar_url, session scoped
- [x] `gmail_threads` table — conversation grouping, subject, timestamps, counts
- [x] `gmail_emails` table — the core message entity, all flags, all metadata
- [x] `gmail_email_recipients` table — to/cc/bcc junction
- [x] `gmail_email_labels` table — email-to-label junction
- [x] `gmail_labels` table — system labels + user-created labels, colors, nesting
- [x] `gmail_attachments` table — file metadata, storage paths
- [x] `gmail_filters` table — criteria (jsonb) + actions (jsonb)
- [x] `gmail_signatures` table — name, html body, default flag
- [x] `gmail_snooze_queue` table — email_id, snooze_until timestamp
- [x] Full-text search index on emails (subject, body_text, snippet)
- [x] All foreign keys with `ON DELETE CASCADE`
- [x] All tables have `session_id` column with index
- [x] Row Level Security policies on every table (RLS enabled, service role bypasses)
- [x] Database functions: `seedSession()` implemented in TypeScript (server-side)
- [ ] Cron job for session cleanup (pg_cron)

> **Note:** All tables use `gmail_` prefix to avoid collisions with existing
> forgehq tables on the shared Supabase project (`tvgjrpgdsqvijjdtycuy`).

### 0.4 — Session Middleware

- [x] `middleware.ts` — detect/create session cookie
- [ ] Server action: `ensureSession()` — creates DB row if needed, triggers seed
- [ ] Session context provider for client components
- [x] Session ID available in all server components via cookies

### 0.5 — Base Layout Structure

- [x] Root layout (`app/layout.tsx`) — html, body, font loading, providers
- [x] Theme provider (CSS custom properties, `data-theme` attribute)
- [x] Mail layout (`app/(mail)/layout.tsx`) — sidebar + topbar + main content area
- [x] Empty placeholder pages for all routes
- [ ] Verify: app loads, session created, cookie set, DB row exists

**Exit Criteria:** `npm run dev` shows an empty shell. Session cookie is set. Database
has a session row with seeded data. TypeScript compiles clean. Lint passes.

---

## Milestone 1 — The Shell `v0.1.0`

The app frame. Sidebar, topbar, navigation. No mail content yet, but the spatial
structure is complete and beautiful.

### 1.1 — Design Tokens & Typography

- [x] Define CSS custom property system:
  - `--color-bg-primary`, `--color-bg-secondary`, `--color-bg-tertiary`
  - `--color-bg-elevated`, `--color-bg-sunken`
  - `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`
  - `--color-text-inverse`
  - `--color-border-default`, `--color-border-subtle`
  - `--color-accent-primary`, `--color-accent-hover`, `--color-accent-muted`
  - `--color-success`, `--color-warning`, `--color-error`, `--color-info`
  - `--color-star` (Gmail's gold star)
  - `--color-important` (Gmail's yellow marker)
  - `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`
  - `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`
  - `--spacing-*` scale
  - `--transition-fast`, `--transition-normal`, `--transition-slow`
- [x] Define light theme values
- [x] Define dark theme values
- [ ] Select and load typeface (Google Sans / Inter / custom)
- [ ] Define type scale (12px, 13px, 14px, 16px, 20px, 24px, 32px)
- [ ] Define font weight scale (400, 500, 600, 700)
- [ ] Verify all tokens render correctly in both themes

### 1.2 — Sidebar

- [ ] Compose button (prominent, accent-colored, with icon)
- [ ] Navigation section:
  - Inbox (with unread count badge)
  - Starred
  - Snoozed
  - Sent
  - Drafts (with count badge)
  - More / Less toggle to show:
    - All Mail
    - Spam (with count badge)
    - Trash
    - Important
    - Chats (decorative)
    - Scheduled (decorative)
- [ ] Labels section:
  - Section header with "+" create button
  - List of user labels with color dots
  - Nested label support (indented children)
  - Each label shows message count
  - Hover: shows "..." menu (edit, remove label, add sublabel)
- [ ] Collapse/expand sidebar (hamburger icon in topbar)
  - Collapsed state: icons only, tooltip on hover
  - Smooth width animation
- [ ] Active route highlighting
- [ ] Hover states on all items
- [ ] Keyboard navigation within sidebar

### 1.3 — Topbar

- [ ] Hamburger menu (toggle sidebar)
- [ ] Logo / wordmark ("Gmail" redesigned, or your brand)
- [ ] Search bar:
  - Rounded input with search icon
  - Placeholder text: "Search mail"
  - Focus state: expands, shows advanced search toggle
  - Clear button when text is present
  - (Search functionality comes in Milestone 5)
- [ ] Right section:
  - Help icon (decorative tooltip)
  - Settings gear icon (links to /settings)
  - App grid icon (decorative popover with Google app icons)
  - Session avatar (generated from session, circular, with tooltip)
- [ ] Topbar is sticky, has subtle bottom border or shadow
- [ ] Responsive: search bar collapses to icon on small screens

### 1.4 — Content Area Frame

- [ ] Toolbar row (above email list):
  - Checkbox (select all) with dropdown (All, None, Read, Unread, Starred, Unstarred)
  - Refresh button
  - More actions ("..." menu)
  - Pagination: "1-50 of 127" with prev/next arrows
  - (Action buttons appear contextually when emails are selected — later milestone)
- [ ] Email list area (empty state for now with illustration)
- [ ] Reading pane area (empty state)
- [ ] Category tabs (Inbox only):
  - Primary, Social, Promotions, Updates, Forums
  - Each tab has icon + label
  - Active tab indicator (animated underline)
  - Tabs are toggleable in settings (later)
- [ ] Layout mode support (structure only, wired later):
  - Default (list only, click opens thread)
  - Right-side reading pane
  - Bottom reading pane

### 1.5 — Empty States & Loading States

- [ ] Design skeleton loaders for:
  - Email list rows (shimmer animation)
  - Thread view messages
  - Sidebar label counts
- [ ] Design empty states for:
  - Empty inbox ("You're all caught up" with illustration)
  - Empty trash
  - Empty spam
  - Empty label
  - Empty search results
  - Empty drafts
- [ ] Loading spinner component (subtle, branded)
- [ ] Page transition indicator (top progress bar)

### 1.6 — Responsive Foundation

- [ ] Breakpoint system: sm (640), md (768), lg (1024), xl (1280), 2xl (1536)
- [ ] Mobile: sidebar becomes a drawer (overlay)
- [ ] Mobile: topbar simplifies (search becomes icon)
- [ ] Tablet: sidebar can be collapsed
- [ ] Desktop: full layout
- [ ] Test at all breakpoints

**Exit Criteria:** The app shell is fully navigable. Sidebar links work (even though
pages are empty). Theme toggle switches between light and dark. The layout is
responsive. It looks and feels premium.

---

## Milestone 2 — Reading Mail `v0.2.0`

The core experience. Viewing emails, threads, and conversations.

### 2.1 — Email List View

- [ ] Email row component:
  - Checkbox (select)
  - Star toggle (filled/outline, animated)
  - Important marker toggle (arrow/chevron)
  - Sender name (bold if unread, normal if read)
  - Subject line (bold if unread) + snippet preview (muted)
  - Label chips (colored, small)
  - Attachment icon (paperclip, if has attachments)
  - Relative timestamp ("2:34 PM", "Yesterday", "Jan 15", "Dec 3, 2025")
  - Hover actions row: Archive, Delete, Mark read/unread, Snooze
- [ ] Unread vs read visual distinction (background color, font weight)
- [ ] Row click navigates to thread view
- [ ] Multi-select with checkboxes
- [ ] Shift+click range select
- [ ] Drag to select (optional, stretch)
- [ ] Bulk action toolbar appears when items selected:
  - Archive, Report spam, Delete, Move to, Label, More (Mark as read, star, etc.)
- [ ] Infinite scroll or pagination (50 per page)
- [ ] Pull-to-refresh on mobile

### 2.2 — Category Tabs (Inbox)

- [ ] Primary tab — default personal emails
- [ ] Social tab — social network notifications
- [ ] Promotions tab — marketing, deals
- [ ] Updates tab — bills, receipts, statements
- [ ] Forums tab — mailing lists, groups
- [ ] Tab counts (unread in each category)
- [ ] Drag email between tabs to recategorize
- [ ] Tab content loads independently
- [ ] Seed data distributed across all categories

### 2.3 — Thread View

- [ ] Thread header:
  - Subject line (large)
  - Label chips (removable)
  - Print icon
  - New window icon (decorative)
- [ ] Thread toolbar:
  - Back arrow (return to list)
  - Archive, Report spam, Delete
  - Move to (folder picker)
  - Label (label picker with checkboxes)
  - Snooze (date/time picker)
  - More: Mark unread, Mark important, Filter messages like these, Mute
- [ ] Message list within thread:
  - Messages displayed chronologically
  - Most recent message expanded by default
  - Older messages collapsed (show sender + snippet)
  - Click collapsed message to expand
  - "Show trimmed content" toggle (for quoted replies)
- [ ] Individual message component:
  - Sender avatar (circular)
  - Sender name + email address
  - Recipient line ("to me", "to john@...", expandable)
  - Timestamp (absolute + relative tooltip)
  - Star toggle
  - More menu (Reply, Forward, Filter, Block, Report)
  - Message body (rendered HTML, sanitized)
  - Attachment section:
    - Grid of attachment cards
    - File icon by type (image, pdf, doc, zip, etc.)
    - Filename + size
    - Preview on click (images: lightbox, others: decorative)
    - Download button (decorative)
- [ ] Reply box at bottom of thread:
  - Collapsed state: "Click here to Reply" with sender name
  - Expanded: inline compose (see Milestone 3)
- [ ] Thread navigation: newer/older arrows

### 2.4 — All Mail Views

Each view is a filtered version of the email list. Implement the data fetching and
filtering for each:

- [ ] **Inbox** — not archived, not trash, not spam
- [ ] **Starred** — is_starred = true
- [ ] **Snoozed** — has active snooze, sorted by snooze_until
- [ ] **Sent** — from current session's "self" contact
- [ ] **Drafts** — is_draft = true
- [ ] **All Mail** — everything except spam and trash
- [ ] **Spam** — is_spam = true (with "Delete all spam" banner)
- [ ] **Trash** — is_trash = true (with "Empty trash" banner, 30-day notice)
- [ ] **Important** — is_important = true
- [ ] **Label view** (`/label/[id]`) — emails with specific label

### 2.5 — Email Actions (Single & Bulk)

- [ ] Archive — remove from inbox (remove Inbox label)
- [ ] Move to Trash — set is_trash, show undo snackbar
- [ ] Delete permanently — hard delete (from trash only)
- [ ] Mark as read / unread
- [ ] Star / unstar
- [ ] Mark as important / not important
- [ ] Mark as spam / not spam
- [ ] Snooze — pick date/time, email disappears and reappears
- [ ] Move to — pick label/folder
- [ ] Apply label — multi-select label picker
- [ ] Remove label
- [ ] Mute thread — future messages in thread skip inbox
- [ ] Undo snackbar for destructive actions (archive, delete, spam)
  - Appears at bottom-left
  - "Conversation archived. Undo" with timer
  - Undo reverts the action
  - Auto-dismisses after 5 seconds

### 2.6 — Conversation Density Modes

- [ ] **Default** — standard padding, avatars visible
- [ ] **Comfortable** — slightly reduced padding, avatars visible
- [ ] **Compact** — minimal padding, no avatars, tighter rows
- [ ] Density toggle in topbar settings menu
- [ ] All three modes must look polished (not just "smaller default")
- [ ] Density preference saved to session

**Exit Criteria:** You can browse all mail views, open threads, read messages, see
attachments, perform all actions (archive, delete, star, label, etc.), and undo
destructive actions. Density modes work. Everything is seeded with realistic data.

---

## Milestone 3 — Writing Mail `v0.3.0`

Compose, reply, forward, drafts. The write side of the email experience.

### 3.1 — Compose Modal

- [ ] Trigger: Compose button in sidebar, or keyboard shortcut `c`
- [ ] Modal behavior:
  - Appears in bottom-right corner (Gmail-style)
  - Draggable (grab title bar to reposition)
  - Resizable (drag edges/corners)
  - Minimize to bottom bar (shows subject line)
  - Maximize to full-screen overlay
  - Multiple compose windows (up to 3, stacked in bottom bar)
  - Close with X or Discard
- [ ] Header section:
  - "New Message" title bar (draggable handle)
  - Minimize, maximize/restore, close buttons
  - From field (shows session's email, non-editable)
  - To field (contact autocomplete, chip-based input)
  - Cc toggle (reveals Cc field)
  - Bcc toggle (reveals Bcc field)
  - Subject field
- [ ] Body section:
  - Rich text editor area
  - Auto-growing height
  - Placeholder: "Compose email"
- [ ] Footer section:
  - **Send** button (accent color, prominent)
  - Formatting toolbar toggle (A with underline icon)
  - Attach files button (paperclip)
  - Insert link button
  - Insert emoji button (emoji picker popover)
  - Insert signature button (if signatures exist)
  - Confidential mode toggle (decorative)
  - More options menu:
    - Schedule send (decorative date picker)
    - Add label
    - Plain text mode toggle
    - Print
  - Delete draft (trash icon)

### 3.2 — Rich Text Editor

- [ ] Toolbar (toggleable, appears above body):
  - **Bold** (Ctrl+B)
  - _Italic_ (Ctrl+I)
  - Underline (Ctrl+U)
  - Text color picker
  - Background highlight color picker
  - Font size (small, normal, large, huge)
  - Strikethrough
  - Alignment (left, center, right)
  - Numbered list
  - Bulleted list
  - Indent / outdent
  - Quote block
  - Remove formatting
- [ ] Link insertion (Ctrl+K): URL + display text dialog
- [ ] Emoji picker: searchable grid, recent section, categories
- [ ] Image insertion (inline, from attachment)
- [ ] Paste handling: preserve formatting from clipboard, strip dangerous HTML
- [ ] Undo/Redo (Ctrl+Z / Ctrl+Shift+Z)
- [ ] Use Tiptap or Lexical as the editor engine

### 3.3 — Contact Autocomplete

- [ ] To/Cc/Bcc fields use chip-based input
- [ ] Typing triggers autocomplete dropdown:
  - Searches contacts by name and email
  - Shows avatar, name, email in dropdown
  - Keyboard navigation (up/down/enter/escape)
  - Click or Enter to select
- [ ] Selected contacts appear as removable chips
- [ ] Free-text email entry (type full email + Enter)
- [ ] Paste multiple emails (comma or space separated)
- [ ] Invalid email validation (red chip with tooltip)

### 3.4 — Attachments

- [ ] Attach via button click (file picker)
- [ ] Attach via drag-and-drop onto compose window
- [ ] Attachment list below body:
  - Filename, size, type icon
  - Remove button (X)
  - Upload progress bar (simulated)
- [ ] File stored in Supabase Storage, path saved to `attachments` table
- [ ] Size limit indication (25MB, matching Gmail)
- [ ] Image attachments: option to insert inline

### 3.5 — Send, Draft & Discard

- [ ] **Send:**
  - Validates: at least one recipient, non-empty body (warn if empty subject)
  - Writes email to DB with `is_draft = false`
  - Creates `email_recipients` rows
  - Email appears in Sent view
  - If recipient is a seeded contact, optionally trigger a simulated reply
    (delayed, via Supabase Edge Function or DB trigger)
  - Show "Message sent" snackbar with "Undo" (5-second window)
  - Undo moves email back to draft
- [ ] **Draft auto-save:**
  - Save draft to DB every 3 seconds while composing (debounced)
  - Show "Draft saved" indicator in compose footer
  - Drafts appear in Drafts view
  - Opening a draft reopens the compose modal with content restored
  - Sending a draft removes it from drafts
- [ ] **Discard:**
  - Confirm dialog if body has content: "Discard this message?"
  - Deletes draft from DB
  - Closes compose modal

### 3.6 — Reply & Forward

- [ ] **Reply** (from thread view):
  - Opens inline compose at bottom of thread
  - Pre-fills To with original sender
  - Pre-fills subject with "Re: [original subject]"
  - Includes quoted original message (collapsible)
  - Send adds message to thread
- [ ] **Reply All:**
  - Same as Reply but includes all original recipients in To/Cc
- [ ] **Forward:**
  - Opens inline compose
  - Pre-fills subject with "Fwd: [original subject]"
  - Includes full original message with header block
  - Carries over attachments (with option to remove)
  - To field is empty (user fills in)
- [ ] Reply/Forward can be popped out to full compose modal
- [ ] Quick reply box at bottom of thread (collapsed by default)

### 3.7 — Signatures

- [ ] Insert signature into compose body
- [ ] Default signature auto-inserted on new compose
- [ ] Signature picker if multiple signatures exist
- [ ] Signature separated by `--` divider
- [ ] Signature management in Settings (Milestone 6)

**Exit Criteria:** Full compose flow works — new message, reply, reply all, forward.
Rich text editing. Contact autocomplete. Attachments. Auto-save drafts. Send with undo.
Multiple compose windows. Minimize/maximize. Signatures.

---

## Milestone 4 — Organization `v0.4.0`

Labels, filters, snooze, and all the tools for organizing mail.

### 4.1 — Label System

- [ ] System labels (non-deletable): Inbox, Starred, Snoozed, Sent, Drafts,
      All Mail, Spam, Trash, Important
- [ ] User labels:
  - Create label (name + optional color + optional parent)
  - Edit label (rename, change color, change parent)
  - Delete label (with confirmation)
  - Nest labels (parent/child, up to 3 levels)
- [ ] Label colors: predefined palette (Gmail's 24 colors) + custom
- [ ] Apply labels to emails:
  - From email row hover menu
  - From thread toolbar
  - From bulk action toolbar
  - Label picker: searchable list with checkboxes, "Create new" at bottom
- [ ] Remove labels from emails
- [ ] Label view: clicking a label in sidebar shows all emails with that label
- [ ] Label chips on email rows and thread headers (colored, removable)

### 4.2 — Move To / Folder Behavior

- [ ] "Move to" action opens label picker in "move" mode
- [ ] Moving removes from current location and applies target label
- [ ] Move to Inbox, Trash, Spam as special cases
- [ ] Drag-and-drop emails to sidebar labels (stretch goal)

### 4.3 — Snooze

- [ ] Snooze picker (from email row hover, thread toolbar, or right-click):
  - Later today (calculates based on current time)
  - Tomorrow (8:00 AM)
  - This weekend (Saturday 8:00 AM)
  - Next week (Monday 8:00 AM)
  - Pick date & time (custom date/time picker)
- [ ] Snoozed emails:
  - Disappear from inbox
  - Appear in Snoozed view with snooze time shown
  - Reappear in inbox when snooze time arrives
    (Supabase Edge Function on cron, or client-side check)
  - Snooze indicator on email row
- [ ] Unsnooze: remove from snooze queue, return to inbox immediately

### 4.4 — Filters

- [ ] Create filter:
  - From: (email/name match)
  - To: (email/name match)
  - Subject: (contains text)
  - Has the words: (body search)
  - Doesn't have: (exclusion)
  - Has attachment: (boolean)
  - Size: (greater/less than)
- [ ] Filter actions:
  - Skip the Inbox (Archive it)
  - Mark as read
  - Star it
  - Apply the label: [label picker]
  - Forward to: (decorative)
  - Delete it
  - Never send to Spam
  - Mark as important
  - Categorize as: [category picker]
- [ ] Apply filter to existing matching emails (optional checkbox)
- [ ] Filter list in Settings with edit/delete
- [ ] Filters execute on new email arrival (seed engine respects filters)
- [ ] "Filter messages like these" from email/thread menu
      (pre-fills filter criteria from current email)

### 4.5 — Right-Click Context Menu

- [ ] Right-click on email row shows context menu:
  - Archive
  - Mark as read / unread
  - Star / unstar
  - Mark as important / not important
  - Snooze submenu
  - Move to submenu (Inbox, Trash, Spam, labels)
  - Label submenu
  - Mute
  - Filter messages like these
  - Delete
- [ ] Context menu styled to match app theme
- [ ] Keyboard accessible (Shift+F10 or Menu key)

**Exit Criteria:** Full label CRUD with nesting and colors. Snooze works end-to-end.
Filters can be created and applied. Right-click context menus on email rows. Move-to
works. All organization tools functional.

---

## Milestone 5 — Search `v0.5.0`

Full-text search with advanced filters, matching Gmail's search power.

### 5.1 — Basic Search

- [ ] Search bar in topbar accepts free text
- [ ] Searches across: subject, body_text, sender name, sender email
- [ ] Results displayed in email list format on `/search?q=...`
- [ ] Search results page shows query in search bar
- [ ] Result count: "X results"
- [ ] Highlight matching terms in results (bold in snippet)
- [ ] Clear search returns to previous view
- [ ] Recent searches dropdown (stored in session, last 5)

### 5.2 — Advanced Search

- [ ] Toggle advanced search panel from search bar (filter icon or "Show search options")
- [ ] Advanced search fields:
  - From (contact autocomplete)
  - To (contact autocomplete)
  - Subject (text)
  - Has the words (text)
  - Doesn't have (text)
  - Size: greater than / less than (number + unit)
  - Date within: 1 day / 3 days / 1 week / 2 weeks / 1 month / 2 months /
    6 months / 1 year of [date picker]
  - Search: All Mail / Inbox / Starred / Sent / Drafts / Spam / Trash / [label]
  - Has attachment (checkbox)
- [ ] "Search" button executes query
- [ ] "Create filter" button opens filter creation with criteria pre-filled
- [ ] Advanced search panel is a dropdown/popover below search bar

### 5.3 — Search Operators

- [ ] Support Gmail search operators in the search bar:
  - `from:` — sender
  - `to:` — recipient
  - `subject:` — subject line
  - `label:` — label name
  - `has:attachment` — has attachments
  - `is:unread`, `is:read`, `is:starred`, `is:important`
  - `in:inbox`, `in:sent`, `in:trash`, `in:spam`, `in:drafts`
  - `before:` / `after:` — date (YYYY/MM/DD)
  - `newer_than:` / `older_than:` — relative (2d, 1w, 3m)
  - `larger:` / `smaller:` — size (5M, 100K)
  - Quoted phrases: `"exact match"`
  - OR operator: `from:alice OR from:bob`
  - Negation: `-from:alice`
- [ ] Parse operators into structured query for Supabase
- [ ] Search chips: parsed operators shown as removable chips below search bar

### 5.4 — Search Suggestions

- [ ] As-you-type suggestions dropdown:
  - Matching contacts (avatar + name + email)
  - Matching labels
  - Operator suggestions (type "from:" and see contact list)
  - Recent searches
- [ ] Keyboard navigation in suggestions (up/down/enter)
- [ ] Click suggestion to apply

**Exit Criteria:** Full-text search works. Advanced search panel with all fields.
Search operators parsed and executed. Search suggestions dropdown. Results highlighted.
Search chips for active filters.

---

## Milestone 6 — Settings & Preferences `v0.6.0`

A full settings experience matching Gmail's depth.

### 6.1 — Settings Layout

- [ ] `/settings` route with tabbed navigation
- [ ] Tabs: General, Labels, Inbox, Filters & Blocked Addresses, Signatures, Themes
- [ ] Each tab is its own sub-route (`/settings/labels`, etc.)
- [ ] "Save Changes" button (sticky footer) — only appears when changes are pending
- [ ] "Cancel" to revert unsaved changes
- [ ] Settings changes persist to session in DB

### 6.2 — General Settings

- [ ] **Display density:** Default / Comfortable / Compact (radio)
- [ ] **Theme:** Light / Dark / System (radio) — quick toggle, full theme picker in Themes tab
- [ ] **Stars:** Configure which star types are in rotation
      (1 star, 2 stars, 4 stars, all stars — with colored star icons)
- [ ] **Desktop notifications:** Enable/disable (decorative)
- [ ] **Conversation view:** On/Off (group emails into threads or show individually)
- [ ] **Send and Archive:** Show/Hide "Send & Archive" button in reply
- [ ] **Default reply behavior:** Reply / Reply all
- [ ] **Undo Send:** Cancellation period: 5 / 10 / 20 / 30 seconds
- [ ] **Hover actions:** Enable/Disable (the quick actions on email row hover)
- [ ] **Auto-advance:** Show next conversation / previous / back to list
- [ ] **Page size:** 10 / 15 / 20 / 25 / 50 / 100 conversations per page
- [ ] **Image display:** Always display / Ask before displaying (decorative)

### 6.3 — Labels Settings

- [ ] Table of all labels:
  - Label name (with color dot)
  - "Show in label list" toggle (show / hide / show if unread)
  - "Show in message list" toggle
  - Actions: Edit, Remove
- [ ] System labels section (Inbox, Starred, Snoozed, etc.) — show/hide only
- [ ] User labels section — full CRUD
- [ ] "Create new label" button at top
- [ ] Edit label dialog: name, color picker, nest under (parent picker)

### 6.4 — Inbox Settings

- [ ] **Inbox type:**
  - Default (category tabs)
  - Important first (split: important above, everything else below)
  - Unread first (split: unread above, everything else below)
  - Starred first
  - Priority Inbox (customizable sections)
- [ ] **Category tabs:** Toggle each (Primary, Social, Promotions, Updates, Forums)
- [ ] **Filtered mail notifications:** Include/exclude categories from notifications
- [ ] **Importance markers:** Show/Hide

### 6.5 — Filters & Blocked Addresses

- [ ] List of existing filters:
  - Shows criteria summary ("Matches: from:alice@example.com")
  - Shows actions summary ("Do this: Skip Inbox, Apply label 'Work'")
  - Edit button
  - Delete button
- [ ] "Create a new filter" button
- [ ] Filter creation wizard (2-step):
  1. Define criteria (same fields as advanced search)
  2. Define actions (checkboxes for each action)
- [ ] "Blocked Addresses" section (decorative list)

### 6.6 — Signatures Settings

- [ ] List of signatures with name and preview
- [ ] "Create new" button
- [ ] Signature editor:
  - Name field
  - Rich text editor (same as compose)
  - "Set as default" toggle
- [ ] Delete signature
- [ ] Signature defaults:
  - "For new emails use:" [signature picker / no signature]
  - "On reply/forward use:" [signature picker / no signature]

### 6.7 — Themes Settings

- [ ] Theme mode: Light / Dark / System
- [ ] Accent color palette picker:
  - Google Blue (default)
  - Coral Red
  - Teal Green
  - Lavender Purple
  - Forest Green
  - Amber Gold
  - Rose Pink
  - Slate Gray
  - Ocean Blue
  - Sunset Orange
  - Custom (color picker)
- [ ] Preview panel showing how the theme looks
- [ ] Background image/pattern option (decorative, subtle)
- [ ] Font preference: Default / Monospace / Serif
- [ ] Border radius preference: Sharp / Rounded / Pill

**Exit Criteria:** All settings tabs functional. Changes persist to session. Labels
CRUD works. Filters CRUD works. Signatures CRUD works. Theme/accent picker works.
Density and inbox type settings affect the main app.

---

## Milestone 7 — Seed Engine & Admin `v0.7.0`

The backend machinery that makes the sandbox feel alive.

### 7.1 — Seed Data Templates

- [ ] Contact templates (15-20 personas):
  - Realistic names, email addresses, avatar URLs
  - Mix of personal contacts, work colleagues, businesses, services
  - Each persona has a "voice" (writing style, typical subjects)
  - Examples:
    - "Sarah Chen" (tech lead, sends code reviews and standup updates)
    - "Mom" (family updates, photos, recipes)
    - "GitHub" (notifications, PR reviews)
    - "Spotify" (weekly playlists, new releases)
    - "Alex Rivera" (friend, casual, plans and memes)
    - "Chase Bank" (statements, alerts)
    - "LinkedIn" (connection requests, job alerts)
    - "Jira" (ticket assignments, sprint updates)
    - "Newsletter - The Verge" (tech news digest)
    - "Dr. Patel's Office" (appointment reminders)
- [ ] Email templates (100+ variations):
  - Organized by category (Primary, Social, Promotions, Updates, Forums)
  - Varying thread depths (1-8 messages per thread)
  - Mix of short and long emails
  - Some with attachments (images, PDFs, docs)
  - Some with inline images
  - Realistic HTML formatting (signatures, quoted replies, etc.)
  - Timestamps distributed over last 30 days with realistic patterns
    (more recent = more emails, weekday clustering)
- [ ] Label distribution templates:
  - Pre-created user labels: "Work", "Personal", "Travel", "Finance", "Receipts"
  - Emails pre-labeled appropriately
- [ ] Draft templates (2-3 pre-written drafts)
- [ ] Signature templates (1-2 pre-created signatures)

### 7.2 — Seed Engine

- [ ] `seed_session(session_id)` Supabase function:
  - Creates contacts for the session
  - Creates system labels + starter user labels
  - Generates threads and emails from templates
  - Randomizes: which templates are used, timestamps, read/unread state,
    starred state, label assignments
  - Creates a few drafts
  - Creates default signature
  - Total: ~80-120 emails across ~40-60 threads
  - Execution time target: < 3 seconds
- [ ] Seed data is deterministic per session (seeded PRNG from session UUID)
      so refreshing doesn't regenerate
- [ ] Seed runs automatically on first visit (triggered by session creation)

### 7.3 — Simulated Replies

- [ ] When user sends an email to a seeded contact:
  - After a random delay (30s - 5min), generate a contextual reply
  - Reply uses the contact's "voice" and references the sent email's subject
  - Reply appears in inbox (with notification indicator)
  - Creates a natural back-and-forth feel
- [ ] Implementation: Supabase Edge Function triggered by DB webhook on email insert
  - Or: client-side setTimeout with server action (simpler, less realistic)
- [ ] Reply templates per contact persona
- [ ] Rate limit: max 1 simulated reply per sent email

### 7.4 — Admin Panel (`/admin`)

- [ ] Protected route (simple password or hidden URL token)
- [ ] Dashboard:
  - Total active sessions count
  - Sessions created today
  - Total emails in system
  - Storage usage
- [ ] Session management:
  - List all sessions (paginated)
  - View session details (email count, created_at, last_active)
  - Reset session (re-seed)
  - Delete session
- [ ] Seed controls:
  - "Create test session" button
  - Seed configuration: email count, thread depth, category distribution
  - "Reseed all sessions" (nuclear option)
- [ ] Data management:
  - "Cleanup expired sessions" manual trigger
  - "Export seed templates" (JSON download)
  - "Import seed templates" (JSON upload)
- [ ] System health:
  - Database size
  - Storage bucket size
  - Recent errors (from Supabase logs)

### 7.5 — Session Lifecycle

- [ ] Session creation: middleware + DB trigger
- [ ] Session activity tracking: update `last_active_at` on each request (debounced)
- [ ] Session expiry: pg_cron job deletes sessions older than 7 days
- [ ] Cascading cleanup: all emails, contacts, labels, attachments deleted
- [ ] Storage cleanup: Edge Function to delete orphaned files from Storage bucket
- [ ] Rate limiting: max 10 sessions per IP per hour (prevent abuse)

**Exit Criteria:** New sessions are automatically seeded with rich, realistic data.
Simulated replies work. Admin panel provides full visibility and control. Session
lifecycle is managed automatically.

---

## Milestone 8 — Theming & Visual Identity `v0.8.0`

This is where the portfolio piece earns its "fantasy redesign" title. Every pixel
matters.

### 8.1 — Color System Deep Dive

- [ ] Light theme: carefully tuned warm/cool neutrals (not pure gray)
- [ ] Dark theme: not just inverted — distinct palette with proper contrast ratios
  - Dark backgrounds: rich, not pure black (e.g., #1a1a2e, #16213e)
  - Elevated surfaces: slightly lighter than base
  - Text: off-white, not pure white (reduce eye strain)
  - Accent colors adjusted for dark backgrounds (slightly brighter/more saturated)
- [ ] WCAG AA contrast compliance on all text
- [ ] WCAG AAA on primary content text
- [ ] Color-blind safe: no information conveyed by color alone
      (icons/shapes accompany colored indicators)

### 8.2 — Accent Color Palettes

Each accent generates a full scale (50-950) used throughout the app:

- [ ] Google Blue — `#4285f4` base
- [ ] Coral — `#ea4335` base
- [ ] Teal — `#0d9488` base
- [ ] Lavender — `#8b5cf6` base
- [ ] Forest — `#16a34a` base
- [ ] Amber — `#f59e0b` base
- [ ] Rose — `#f43f5e` base
- [ ] Slate — `#64748b` base
- [ ] Ocean — `#0ea5e9` base
- [ ] Sunset — `#f97316` base
- [ ] Custom — user picks any hue, system generates scale
- [ ] Each palette tested in both light and dark modes
- [ ] Accent used for: compose button, active states, links, selection,
      category tab indicators, toggle switches, progress bars

### 8.3 — Typography Refinement

- [ ] Primary typeface: Google Sans (or Inter as fallback)
- [ ] Monospace: JetBrains Mono (for code blocks in emails)
- [ ] Serif option: Merriweather (for reading-focused mode)
- [ ] Line heights optimized per size:
  - Body (14px): 1.5 line-height
  - Small (12-13px): 1.4 line-height
  - Headings: 1.2-1.3 line-height
- [ ] Letter spacing: slight negative on headings, default on body
- [ ] Font smoothing: antialiased on macOS
- [ ] Tabular numbers for counts and timestamps

### 8.4 — Iconography

- [ ] Consistent icon set (Lucide, Phosphor, or custom subset)
- [ ] Icon sizes: 16px (inline), 20px (default), 24px (prominent)
- [ ] Icons use `currentColor` for automatic theme adaptation
- [ ] Custom icons for:
  - Gmail logo / wordmark (redesigned)
  - Category tab icons (Primary, Social, Promotions, Updates, Forums)
  - Empty state illustrations
  - Star variants (if implementing multi-star)
- [ ] Icon transitions: smooth color/opacity changes on state change

### 8.5 — Elevation & Depth

- [ ] Shadow system (not just box-shadow — consider layered shadows):
  - Level 0: flat (email rows, sidebar items)
  - Level 1: subtle lift (cards, dropdowns)
  - Level 2: medium lift (compose modal, popovers)
  - Level 3: high lift (dialogs, overlays)
- [ ] Dark mode shadows: use darker shadows + subtle light border instead
- [ ] Backdrop blur on overlays (frosted glass effect, subtle)
- [ ] Z-index scale: defined and documented (sidebar, topbar, modals, toasts)

### 8.6 — Motion & Animation

- [ ] Transition defaults:
  - Color/opacity: 150ms ease
  - Transform: 200ms ease-out
  - Layout: 250ms ease-in-out
- [ ] Micro-interactions:
  - Star toggle: scale bounce + color fill
  - Checkbox: check mark draws in
  - Compose button: subtle hover lift
  - Email row hover: background fade
  - Sidebar item hover: background slide
  - Theme toggle: smooth color crossfade (not flash)
  - Snackbar: slide up from bottom
  - Modal: fade + scale in, fade + scale out
  - Dropdown: fade + slide down
  - Tooltip: fade in with slight delay
  - Skeleton shimmer: smooth left-to-right gradient
- [ ] Page transitions: content area crossfade between views
- [ ] Respect `prefers-reduced-motion`: disable all non-essential animation
- [ ] No animation longer than 400ms (keep things snappy)

### 8.7 — Visual Polish Pass

- [ ] Consistent border radius across all components
- [ ] Consistent spacing (4px grid system)
- [ ] Focus rings: visible, themed, consistent
- [ ] Selection color: matches accent
- [ ] Scrollbar styling: thin, themed (webkit + Firefox)
- [ ] Divider lines: subtle, consistent weight
- [ ] Badge styling: unread counts, label chips
- [ ] Avatar system: consistent sizes (24, 32, 40, 48px), fallback initials
- [ ] Hover states on every interactive element
- [ ] Active/pressed states (slight darken/scale)
- [ ] Disabled states (reduced opacity, no pointer events)

**Exit Criteria:** The app is visually stunning in every theme combination (light/dark
x every accent color). Animations are smooth and purposeful. Typography is refined.
The design feels cohesive and intentional — clearly a step beyond Gmail's current UI.

---

## Milestone 9 — Interactions & Polish `v0.9.0`

Keyboard shortcuts, accessibility, responsive refinement, and the details that
separate good from great.

### 9.1 — Keyboard Shortcuts

Gmail keyboard shortcuts (full set):

- [ ] **Navigation:**
  - `g` then `i` — Go to Inbox
  - `g` then `s` — Go to Starred
  - `g` then `t` — Go to Sent
  - `g` then `d` — Go to Drafts
  - `g` then `a` — Go to All Mail
  - `g` then `b` — Go to Snoozed
  - `g` then `k` — Go to Trash
  - `g` then `!` — Go to Spam
- [ ] **Thread list:**
  - `j` / `k` — Move down / up in list
  - `x` — Select conversation
  - `s` — Star/unstar
  - `e` — Archive
  - `#` — Delete
  - `!` — Report spam
  - `Enter` / `o` — Open conversation
  - `u` — Return to list
  - `z` — Undo last action
  - `.` — Open "More" menu
  - `l` — Label
  - `v` — Move to
  - `b` — Snooze
- [ ] **Message view:**
  - `r` — Reply
  - `a` — Reply all
  - `f` — Forward
  - `n` / `p` — Next / previous message in thread
  - `j` / `k` — Next / previous thread
- [ ] **Compose:**
  - `c` — Compose new
  - `d` — Compose in new tab (decorative, same as `c`)
  - `Ctrl+Enter` — Send
  - `Ctrl+Shift+c` — Add Cc
  - `Ctrl+Shift+b` — Add Bcc
  - `Escape` — Close/minimize compose
- [ ] **Application:**
  - `/` — Focus search
  - `?` — Show keyboard shortcuts help dialog
  - `Escape` — Close current dialog/popover
- [ ] Keyboard shortcuts help dialog:
  - Full list organized by category
  - Searchable
  - Toggle shortcuts on/off in settings
- [ ] Visual indicator: show shortcut hints in tooltips

### 9.2 — Accessibility (a11y)

- [ ] Semantic HTML throughout:
  - `<nav>` for sidebar
  - `<main>` for content
  - `<header>` for topbar
  - `<article>` for email messages
  - `<button>` for all clickable actions (not `<div onClick>`)
  - `<ul>/<li>` for lists
- [ ] ARIA attributes:
  - `role="listbox"` for email list
  - `role="option"` for email rows
  - `aria-selected` for selected emails
  - `aria-expanded` for collapsible sections
  - `aria-label` on icon-only buttons
  - `aria-live="polite"` for snackbar notifications
  - `aria-busy` for loading states
  - `aria-describedby` for form field errors
- [ ] Focus management:
  - Logical tab order
  - Focus trap in modals and dialogs
  - Return focus to trigger element on dialog close
  - Skip-to-content link
  - Visible focus indicators (not just outline — styled rings)
- [ ] Screen reader support:
  - Announce page changes
  - Announce action results ("Email archived", "Label applied")
  - Email list: announce sender, subject, snippet, unread state
  - Compose: announce field labels and validation errors
- [ ] Color contrast: verified with automated tools
- [ ] Touch targets: minimum 44x44px on mobile
- [ ] Text resizing: app remains usable at 200% zoom

### 9.3 — Responsive Refinement

- [ ] **Mobile (< 768px):**
  - Sidebar: full-screen drawer overlay with backdrop
  - Topbar: simplified (hamburger, logo, search icon, avatar)
  - Email list: full width, swipe actions (archive left, delete right)
  - Thread view: full screen, back button in topbar
  - Compose: full screen modal
  - Settings: single column, tabs become accordion or dropdown
  - Bottom navigation bar (optional): Inbox, Search, Compose FAB
  - Pull-to-refresh gesture
- [ ] **Tablet (768px - 1024px):**
  - Sidebar: collapsible, starts collapsed
  - Two-column layout possible (list + reading pane)
  - Compose: modal (not full screen)
- [ ] **Desktop (> 1024px):**
  - Full layout as designed
  - Optional reading pane (right or bottom split)
- [ ] **Large screens (> 1536px):**
  - Max-width container or comfortable stretch
  - Larger type scale option
- [ ] Touch vs pointer detection: adjust hover behavior
- [ ] Orientation change handling

### 9.4 — Performance Optimization

- [ ] Server Components for all data-fetching pages
- [ ] Streaming with Suspense boundaries:
  - Sidebar loads independently
  - Email list streams in
  - Thread messages stream in
- [ ] Optimistic updates for all mutations:
  - Star/unstar: instant toggle, reconcile
  - Archive/delete: instant removal with undo, reconcile
  - Label apply/remove: instant, reconcile
  - Send: instant "sent" feedback, write in background
- [ ] Image optimization:
  - Avatars: Next.js Image with blur placeholder
  - Attachment previews: lazy loaded
  - Inline images: lazy loaded with intersection observer
- [ ] Bundle optimization:
  - Dynamic imports for heavy components (rich text editor, emoji picker)
  - Route-based code splitting (automatic with App Router)
  - Tree-shake unused Radix components
- [ ] Database optimization:
  - Indexes on all query patterns (session_id + is_trash + is_spam, etc.)
  - Pagination with cursor-based approach
  - Denormalized counts (unread count on labels, message count on threads)
- [ ] Measure and target:
  - LCP < 1.5s
  - FID < 100ms
  - CLS < 0.1
  - TTI < 3s

### 9.5 — Error Handling

- [ ] Global error boundary (`error.tsx` at root)
- [ ] Route-level error boundaries
- [ ] Network error handling:
  - Offline indicator banner
  - Retry logic for failed mutations
  - Queue actions while offline, sync on reconnect (stretch)
- [ ] Form validation errors: inline, accessible, themed
- [ ] 404 page: custom, branded, helpful
- [ ] Empty database: graceful handling if seed fails
- [ ] Rate limit errors: friendly message
- [ ] Supabase connection errors: retry with backoff

### 9.6 — Notification System

- [ ] Snackbar/toast system:
  - Position: bottom-left (Gmail-style)
  - Stack multiple (max 3 visible)
  - Auto-dismiss (configurable per type)
  - Action button ("Undo", "View", etc.)
  - Types: info, success, warning, error
  - Animated enter/exit
  - Accessible (aria-live region)
- [ ] In-app notification for simulated replies:
  - "New email from [contact]" snackbar
  - Inbox count updates in sidebar
  - Tab title updates: "(3) Inbox - Gmail Redesign"
- [ ] Browser tab title: show unread count

**Exit Criteria:** Full keyboard shortcut support. Screen reader tested. Mobile
experience is polished and touch-friendly. Performance metrics hit targets. Error
states are graceful. Notification system is complete.

---

## Milestone 10 — Production Readiness `v0.10.0`

The final push before v1.0.0. Testing, documentation, deployment, and the last
round of polish.

### 10.1 — Testing

- [ ] Unit tests (Vitest):
  - Utility functions (cn, formatDate, parseSearchQuery, etc.)
  - Seed data generator
  - Search operator parser
  - Filter matching logic
  - Session management logic
- [ ] Component tests (Vitest + React Testing Library):
  - Email row: renders correctly for read/unread/starred states
  - Compose modal: open/close/minimize/maximize
  - Contact autocomplete: search, select, remove
  - Label picker: search, toggle, create
  - Theme toggle: switches theme
  - Search bar: input, suggestions, submit
- [ ] Integration tests:
  - Session creation flow
  - Send email flow (compose -> send -> appears in sent)
  - Archive flow (archive -> undo -> restored)
  - Label flow (create label -> apply to email -> view label)
  - Search flow (search -> results -> open result)
  - Settings flow (change setting -> persists on reload)
- [ ] Accessibility tests:
  - axe-core automated checks on all pages
  - Keyboard navigation walkthrough
  - Screen reader manual testing (VoiceOver)
- [ ] Visual regression tests (optional, stretch):
  - Playwright screenshots of key views in light/dark x 3 accents
- [ ] Test coverage target: 80%+ on business logic, 60%+ on components

### 10.2 — Performance Audit

- [ ] Lighthouse audit: target 90+ on all categories
- [ ] Bundle analysis: identify and eliminate bloat
- [ ] Database query analysis: no N+1 queries, all queries use indexes
- [ ] Image audit: all images optimized, proper formats (WebP/AVIF)
- [ ] Font audit: subset fonts, preload critical fonts
- [ ] Third-party script audit: minimize external dependencies

### 10.3 — Security Hardening

- [ ] RLS policies reviewed and tested:
  - Session A cannot read Session B's data
  - Verify with direct Supabase API calls
- [ ] HTML sanitization: all rendered email HTML is sanitized (DOMPurify)
- [ ] XSS prevention: no dangerouslySetInnerHTML without sanitization
- [ ] CSRF: Next.js Server Actions handle this
- [ ] Rate limiting: session creation, email sending, search queries
- [ ] Input validation: Zod schemas on all server action inputs
- [ ] Storage: files scoped to session, no public bucket access
- [ ] Admin panel: protected by environment variable secret
- [ ] No secrets in client bundle (verify with bundle analysis)
- [ ] Content Security Policy headers

### 10.4 — Deployment & Infrastructure

- [ ] Vercel project setup
- [ ] Environment variables configured:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server only)
  - `ADMIN_SECRET` (for admin panel)
- [ ] Custom domain (if applicable)
- [ ] Vercel Analytics enabled
- [ ] Vercel Speed Insights enabled
- [ ] Preview deployments for PRs
- [ ] Production deployment pipeline:
  - Lint -> Type check -> Test -> Build -> Deploy
- [ ] Database backups: Supabase automatic daily backups
- [ ] Monitoring: Supabase dashboard for DB health
- [ ] Edge Function deployment for simulated replies + session cleanup

### 10.5 — Documentation & Portfolio Presentation

- [ ] README.md:
  - Project overview and motivation
  - Screenshots (light + dark, desktop + mobile)
  - Tech stack
  - Architecture overview
  - Local development setup
  - Deployment instructions
- [ ] Design decisions document:
  - Why each design choice was made
  - Before/after comparisons with real Gmail
  - Color theory and typography rationale
  - Interaction design philosophy
- [ ] Portfolio page / landing page (optional):
  - Hero section with app screenshot
  - Feature highlights
  - Design philosophy
  - Tech stack badges
  - "Try it" CTA button
  - Link to GitHub repo
- [ ] Open Graph / social meta tags for sharing
- [ ] Favicon and app icons (PWA manifest)

### 10.6 — Final Polish

- [ ] Full walkthrough: every view, every action, every theme
- [ ] Cross-browser testing: Chrome, Firefox, Safari, Edge
- [ ] Device testing: iPhone, Android, iPad, various desktop resolutions
- [ ] Fix any visual inconsistencies found
- [ ] Fix any interaction bugs found
- [ ] Performance: verify all targets met
- [ ] Accessibility: final automated + manual audit
- [ ] Seed data review: ensure all emails read naturally, no lorem ipsum
- [ ] Loading states: verify all pages have proper loading UI
- [ ] Error states: verify all error scenarios handled gracefully
- [ ] Empty states: verify all empty views have proper messaging
- [ ] Print stylesheet (basic, for thread view)

**Exit Criteria:** All tests pass. Lighthouse 90+. Cross-browser verified. Accessible.
Secure. Deployed. Documented. Ready to share with the world.

---

## Release — v1.0.0

### Release Checklist

- [ ] All milestones 0-10 complete
- [ ] All tests passing in CI
- [ ] Production deployment stable for 48 hours
- [ ] README and documentation finalized
- [ ] Social sharing meta tags working
- [ ] Performance budgets met
- [ ] Security audit passed
- [ ] Accessibility audit passed
- [ ] Seed data reviewed and polished
- [ ] Admin panel functional
- [ ] Session cleanup cron running
- [ ] Tag `v1.0.0` in git
- [ ] Share it

---

## Beyond 1.0 — Future Explorations

Ideas for post-launch iteration. Not committed, just possibilities.

### v1.1 — Enhanced Interactions

- [ ] Drag-and-drop emails to labels in sidebar
- [ ] Drag-and-drop emails between category tabs
- [ ] Swipe gestures on mobile (configurable actions)
- [ ] Multi-window compose with drag between windows
- [ ] Email scheduling (pick date/time, send later)
- [ ] Reading pane mode (right split or bottom split)

### v1.2 — AI Features (Fantasy)

- [ ] Smart compose suggestions (simulated, pre-written)
- [ ] Email summarization (simulated)
- [ ] Smart reply chips ("Thanks!", "Sounds good!", "I'll look into it")
- [ ] Priority inbox sorting (simulated ML-based importance)
- [ ] Nudge: "Received 3 days ago. Reply?" (simulated)

### v1.3 — Google Workspace Fantasy

- [ ] Google Calendar sidebar widget (decorative, shows fake events)
- [ ] Google Keep sidebar widget (decorative, shows fake notes)
- [ ] Google Tasks sidebar widget (functional within session)
- [ ] Google Chat sidebar (decorative)
- [ ] Meet integration (decorative "Join meeting" buttons in emails)

### v1.4 — Advanced Theming

- [ ] Custom CSS injection (for power users)
- [ ] Theme marketplace (pre-built community themes)
- [ ] Animated backgrounds (subtle, performant)
- [ ] Seasonal themes (holiday variations)
- [ ] High contrast mode
- [ ] Dyslexia-friendly font option

### v1.5 — Offline & PWA

- [ ] Service worker for offline access
- [ ] IndexedDB for local email cache
- [ ] Background sync for pending actions
- [ ] PWA manifest: installable on mobile/desktop
- [ ] Push notifications (simulated, for new replies)

### v1.6 — Internationalization

- [ ] RTL layout support
- [ ] Multiple language UI (i18n framework)
- [ ] Seed data in multiple languages
- [ ] Date/time format localization

### v1.7 — Analytics & Insights

- [ ] Email activity heatmap (when you send/receive most)
- [ ] Response time analytics
- [ ] Label usage breakdown
- [ ] Storage usage visualization
- [ ] "Your Gmail in numbers" dashboard

---

## Database Schema Reference

> **Deployed** on Supabase project `forgehq` (`tvgjrpgdsqvijjdtycuy`).
> All tables use `gmail_` prefix to avoid collisions with existing forgehq tables.
> See migration `create_gmail_schema` for the full DDL as applied.

### Tables

| Table                    | Purpose                                             |
| ------------------------ | --------------------------------------------------- |
| `gmail_sessions`         | Anonymous visitor identity, preferences, timestamps |
| `gmail_contacts`         | People in the session's address book                |
| `gmail_labels`           | System + user-created labels, colors, nesting       |
| `gmail_threads`          | Conversation grouping, subject, timestamps, counts  |
| `gmail_emails`           | Core message entity, all flags, FTS column          |
| `gmail_email_recipients` | To/Cc/Bcc junction table                            |
| `gmail_email_labels`     | Email-to-label many-to-many                         |
| `gmail_attachments`      | File metadata, Supabase Storage paths               |
| `gmail_filters`          | Criteria (jsonb) + actions (jsonb)                  |
| `gmail_signatures`       | Name, HTML body, default flag                       |
| `gmail_snooze_queue`     | Snooze scheduling for cron processing               |

### Key Indexes

- Partial indexes on `gmail_emails` for inbox, sent, draft, starred, snoozed queries
- GIN index on `gmail_emails.fts` for full-text search (weighted: subject A, body B)
- Session-scoped indexes on all tables for fast filtered queries

---

## Feature Parity Checklist

A flat checklist of every Gmail feature, for tracking completeness.

### Navigation

- [ ] Collapsible sidebar
- [ ] Sidebar: Compose button
- [ ] Sidebar: Inbox (with unread count)
- [ ] Sidebar: Starred
- [ ] Sidebar: Snoozed
- [ ] Sidebar: Sent
- [ ] Sidebar: Drafts (with count)
- [ ] Sidebar: More/Less toggle
- [ ] Sidebar: All Mail
- [ ] Sidebar: Spam (with count)
- [ ] Sidebar: Trash
- [ ] Sidebar: Important
- [ ] Sidebar: Categories (decorative)
- [ ] Sidebar: Manage labels link
- [ ] Sidebar: Create new label
- [ ] Sidebar: User labels with colors
- [ ] Sidebar: Nested labels
- [ ] Topbar: Hamburger menu
- [ ] Topbar: Logo
- [ ] Topbar: Search bar
- [ ] Topbar: Help icon
- [ ] Topbar: Settings gear
- [ ] Topbar: App grid
- [ ] Topbar: Profile avatar

### Email List

- [ ] Email row: checkbox
- [ ] Email row: star toggle
- [ ] Email row: important marker
- [ ] Email row: sender name
- [ ] Email row: subject + snippet
- [ ] Email row: label chips
- [ ] Email row: attachment icon
- [ ] Email row: timestamp
- [ ] Email row: hover actions (archive, delete, read/unread, snooze)
- [ ] Email row: unread styling
- [ ] Email row: selected styling
- [ ] Bulk select: all, none, read, unread, starred, unstarred
- [ ] Bulk actions toolbar
- [ ] Pagination
- [ ] Category tabs (Primary, Social, Promotions, Updates, Forums)
- [ ] Right-click context menu
- [ ] Shift+click range select

### Thread View

- [ ] Thread subject header
- [ ] Thread label chips
- [ ] Thread toolbar (back, archive, delete, spam, move, label, snooze, more)
- [ ] Message: sender avatar
- [ ] Message: sender name + email
- [ ] Message: recipient line
- [ ] Message: timestamp
- [ ] Message: star toggle
- [ ] Message: more menu
- [ ] Message: body (HTML rendered)
- [ ] Message: attachments
- [ ] Message: expand/collapse
- [ ] Message: show trimmed content
- [ ] Quick reply box
- [ ] Thread navigation (newer/older)
- [ ] Print thread

### Compose

- [ ] New message modal
- [ ] Reply inline
- [ ] Reply all
- [ ] Forward
- [ ] To/Cc/Bcc fields
- [ ] Contact autocomplete
- [ ] Subject field
- [ ] Rich text editor
- [ ] Formatting toolbar
- [ ] Attach files
- [ ] Insert link
- [ ] Insert emoji
- [ ] Insert signature
- [ ] Send button
- [ ] Send & Archive
- [ ] Schedule send (decorative)
- [ ] Save draft (auto)
- [ ] Discard draft
- [ ] Minimize compose
- [ ] Maximize compose
- [ ] Multiple compose windows
- [ ] Draggable compose
- [ ] Pop-out reply to full compose

### Organization

- [ ] Archive
- [ ] Move to trash
- [ ] Permanent delete
- [ ] Mark read/unread
- [ ] Star/unstar
- [ ] Mark important/not important
- [ ] Mark spam/not spam
- [ ] Snooze (presets + custom)
- [ ] Move to label
- [ ] Apply label
- [ ] Remove label
- [ ] Mute thread
- [ ] Undo (snackbar)
- [ ] Create label
- [ ] Edit label
- [ ] Delete label
- [ ] Nest labels
- [ ] Label colors
- [ ] Create filter
- [ ] Edit filter
- [ ] Delete filter

### Search

- [ ] Basic text search
- [ ] Advanced search panel
- [ ] Search operators
- [ ] Search suggestions
- [ ] Search chips
- [ ] Recent searches
- [ ] Result highlighting

### Settings

- [ ] General tab
- [ ] Labels tab
- [ ] Inbox tab
- [ ] Filters tab
- [ ] Signatures tab
- [ ] Themes tab
- [ ] Display density
- [ ] Conversation view toggle
- [ ] Undo send duration
- [ ] Hover actions toggle
- [ ] Page size
- [ ] Stars configuration
- [ ] Default reply behavior

### Theming

- [ ] Light mode
- [ ] Dark mode
- [ ] System preference detection
- [ ] Accent color palettes (10+)
- [ ] Custom accent color
- [ ] Smooth theme transitions
- [ ] All components themed

### Keyboard Shortcuts

- [ ] Navigation shortcuts (g+i, g+s, etc.)
- [ ] List shortcuts (j, k, x, s, e, #, etc.)
- [ ] Message shortcuts (r, a, f, n, p)
- [ ] Compose shortcuts (c, Ctrl+Enter, Escape)
- [ ] App shortcuts (/, ?)
- [ ] Shortcuts help dialog

### Accessibility

- [ ] Semantic HTML
- [ ] ARIA attributes
- [ ] Focus management
- [ ] Screen reader support
- [ ] Color contrast (WCAG AA)
- [ ] Touch targets (44px)
- [ ] Reduced motion support
- [ ] Keyboard navigable

### Responsive

- [ ] Mobile layout
- [ ] Tablet layout
- [ ] Desktop layout
- [ ] Large screen layout
- [ ] Mobile drawer sidebar
- [ ] Mobile swipe actions
- [ ] Touch-friendly compose

### Infrastructure

- [ ] Anonymous session system
- [ ] Seed data engine
- [ ] Simulated replies
- [ ] Admin panel
- [ ] Session cleanup cron
- [ ] Rate limiting
- [ ] RLS policies
- [ ] Error boundaries
- [ ] Loading states
- [ ] Empty states
- [ ] Snackbar/toast system
