# Features

Each feature includes: purpose, user flow, interaction design, and technical approach.

---

## 1. Inbox with Category Tabs

**Purpose**: Organize email by type without manual labeling. Reduce noise in the primary inbox.

**User Flow**:

1. User lands on inbox → sees Primary tab active by default
2. Unread counts shown on each tab (Social, Promotions, Updates, Forums)
3. Click a tab → URL updates to `/?category=social` → list re-renders with that category's emails
4. Emails are deduplicated by thread — only the latest message per thread is shown

**Interaction Design**:

- Active tab has accent-colored text and a bottom indicator bar
- Inactive tabs show muted text, highlight on hover
- Counts only show when > 0

**Technical Approach**:

- Category tabs use `<a>` tags with `href` (no client JS needed for navigation)
- `searchParams.category` drives the Supabase query filter
- Category counts fetched in parallel with email list via `Promise.all()`
- Server Component — zero client JS for the tab bar

**Status**: Done

---

## 2. Email List (Inbox View)

**Purpose**: Scan and triage emails quickly. The most-used view in any email client.

**User Flow**:

1. Each row shows: checkbox, star, importance marker, sender, subject, snippet, labels, timestamp
2. Unread emails have bold sender/subject and a white background
3. Read emails have normal weight and a subtle gray background
4. Click a row → navigate to thread view
5. Click star → toggle star (without navigating)
6. Click checkbox → select for bulk actions

**Interaction Design**:

- Rows have subtle hover elevation (`shadow-xs`)
- Star toggles between filled gold and outline gray
- Unread vs read distinction via font weight + background color
- Labels appear as small colored chips
- Timestamps use relative formatting (2:34 PM, Yesterday, Jan 15, Dec 3 2024)

**Technical Approach**:

- `EmailRow` is a Client Component (has onClick handlers for star/checkbox)
- Parent page is a Server Component (fetches data, deduplicates threads)
- Supabase query joins emails → contacts → labels in a single request

**Status**: Done

---

## 3. Thread View

**Purpose**: Read a full email conversation with clear visual hierarchy.

**User Flow**:

1. Click an email row → navigate to `/thread/[id]`
2. See thread subject at top with label badges
3. Messages displayed chronologically, each in a card
4. Each message shows: sender avatar (initial), name, email, recipients, timestamp, star, reply, more
5. Last message shows Reply and Forward buttons
6. Unread messages are automatically marked as read on view

**Interaction Design**:

- Messages are cards with subtle borders
- Sender avatar is a circle with the first letter of their name
- Email body supports HTML rendering (links, lists, blockquotes, tables)
- Body is indented to align with the sender name (not the avatar)
- Toolbar at top: back arrow, archive, delete, mark unread, snooze, labels, more

**Technical Approach**:

- Server Component — fetches thread, messages, labels, and recipients in one go
- Auto-marks unread messages as read via Supabase update
- HTML body rendered via `dangerouslySetInnerHTML` with scoped CSS for email content
- Back button is a simple `<Link href="/">`

**Status**: Done

---

## 4. Sidebar Navigation

**Purpose**: Navigate between inbox sections and user labels.

**User Flow**:

1. System sections: Inbox (with unread count), Starred, Snoozed, Sent, Drafts (with count)
2. Divider
3. More sections: All Mail, Spam (with count), Trash, Important
4. Divider
5. User labels section with "LABELS" header and + button
6. Each user label shows a colored dot and name

**Interaction Design**:

- Active item has accent background tint and accent text color
- Inactive items show secondary text, hover background on mouseover
- Items are pill-shaped (full border radius)
- Counts are right-aligned, tabular numbers

**Technical Approach**:

- `SidebarNav` is a Client Component (uses `usePathname()` for active state)
- Data (labels, counts) fetched in the Server Component layout and passed as props
- Uses Next.js `<Link>` for client-side navigation

**Status**: Done

---

## 5. Theme Toggle (System / Light / Dark)

**Purpose**: Let users choose their preferred color scheme.

**User Flow**:

1. Click the theme button in the topbar (between search and settings)
2. Cycles: System → Light → Dark → System
3. Icon changes: Monitor → Sun → Moon
4. Theme applies instantly with a smooth 200ms transition

**Interaction Design**:

- Icons crossfade with scale animation (active: scale-100 opacity-100, inactive: scale-75 opacity-0)
- Tooltip shows current mode name
- Theme transition applies to all background, text, border, and shadow properties

**Technical Approach**:

- Client Component with `useState` for mode, `localStorage` for persistence
- `data-theme` attribute on `<html>` drives CSS custom property values
- Inline `<script>` in `<head>` prevents flash of wrong theme (runs before paint)
- System mode listens to `matchMedia('prefers-color-scheme: dark')` changes

**Status**: Done

---

## 6. Compose Window

**Purpose**: Write and send emails with a clean, distraction-free interface.

**User Flow**:

1. Click "Compose" button in sidebar → compose window appears (bottom-right, floating)
2. Minimal by default: To, Subject, Body, Send button
3. Click formatting toolbar toggle → reveals rich text options
4. Click expand → full-screen compose mode
5. Click minimize → collapses to title bar only
6. Click X → discard (with confirmation if content exists)

**Interaction Design**:

- Floating window with shadow-xl, rounded corners
- Draggable title bar (planned)
- Minimize/maximize/close buttons in title bar
- Send button is primary accent color
- Formatting toolbar hidden by default (progressive disclosure)

**Technical Approach**:

- Client Component with compose state (open/minimized/maximized)
- Rich text via contentEditable or lightweight editor (TBD)
- Server action for sending (creates email in DB)
- Draft auto-save via debounced server action

**Status**: Planned

---

## 7. Search

**Purpose**: Find any email instantly using natural language or structured queries.

**User Flow**:

1. Click search bar or press `/` → search bar focuses
2. Type query → results appear below (instant, debounced)
3. Results show matching emails with highlighted terms
4. Advanced: `from:`, `to:`, `subject:`, `has:attachment`, `is:unread` operators
5. Press Enter → navigate to `/search?q=query` for full results page

**Interaction Design**:

- Search bar expands on focus with shadow elevation
- Dropdown shows recent searches and suggestions
- Results page uses same email row component as inbox

**Technical Approach**:

- Full-text search via PostgreSQL `tsvector` column on gmail_emails
- `textSearch('fts', query)` for natural language queries
- Structured operators parsed on the server and converted to Supabase filters
- URL-driven: `searchParams.q` on the search page

**Status**: Partial (search bar UI exists, full-text search wired up, results page exists)

---

## 8. Email Actions (Star, Archive, Delete, Snooze)

**Purpose**: One-click triage to process email fast.

**Actions**:

- **Star/Unstar**: Toggle `is_starred` on the email
- **Archive**: Set `is_archived = true` (removes from inbox, still in All Mail)
- **Delete**: Set `is_trash = true` (moves to Trash)
- **Mark read/unread**: Toggle `is_read`
- **Snooze**: Set `snooze_until` to a future time, hide until then
- **Mark important**: Toggle `is_important`
- **Move to spam**: Set `is_spam = true`
- **Apply label**: Insert into `gmail_email_labels`

**Technical Approach**:

- Each action is a server action that updates the Supabase row
- Optimistic updates on the client (update UI immediately, revert on error)
- Undo toast for destructive actions (archive, delete, spam) with configurable delay

**Status**: Partial (star toggle in UI, server actions planned)

---

## 9. Keyboard Shortcuts

**Purpose**: Power users should never need to touch the mouse.

**Shortcuts** (Gmail-compatible):
| Key | Action |
|-----|--------|
| `j` / `k` | Next / previous email in list |
| `o` / `Enter` | Open selected email |
| `u` | Return to inbox |
| `e` | Archive |
| `#` | Delete |
| `s` | Star/unstar |
| `r` | Reply |
| `f` | Forward |
| `c` | Compose new |
| `/` | Focus search |
| `?` | Show keyboard shortcut help |
| `Shift+I` | Mark as read |
| `Shift+U` | Mark as unread |

**Technical Approach**:

- Global keyboard event listener in a Client Component
- Respects `keyboard_shortcuts` session preference
- Disabled when focus is in an input/textarea
- Help modal shows all available shortcuts

**Status**: Planned

---

## 10. Email Summarization (Mocked AI)

**Purpose**: Get the gist of long threads without reading every message.

**User Flow**:

1. Open a thread with 3+ messages
2. See a "Summary" card at the top of the thread
3. Summary shows: key points, action items, and participants

**Technical Approach**:

- Summaries are pre-computed and stored in the seed data
- No API calls — instant, free, always works
- Architecture supports swapping in a real AI provider later

**Status**: Planned

---

## 11. Bulk Actions

**Purpose**: Process multiple emails at once.

**User Flow**:

1. Click checkboxes on multiple email rows
2. Toolbar updates to show bulk action buttons (archive, delete, mark read, label)
3. "Select all" checkbox in toolbar selects all visible emails
4. "Select all conversations that match this search" link for full selection

**Technical Approach**:

- Selection state managed in a Client Component wrapping the email list
- Bulk server action accepts array of email IDs
- Optimistic removal from list on archive/delete

**Status**: Planned

---

## 12. About This Project Overlay

**Purpose**: Tell the story behind the project. Convert visitors into contacts.

**User Flow**:

1. Floating "About" button visible in bottom-right corner
2. Click → slide-over panel opens from the right
3. Content: Problem statement → Research → Design process → Technical highlights → About Oddur Sigurdsson → Contact (LinkedIn + email)
4. Click outside or X to close

**Interaction Design**:

- Panel slides in from right with backdrop overlay
- Smooth spring animation
- Scrollable content within the panel
- Contact section is sticky at the bottom

**Technical Approach**:

- Client Component with open/closed state
- Framer Motion for slide animation
- Content can be MDX or hardcoded JSX
- Contact links: `mailto:` and LinkedIn URL

**Status**: Planned
