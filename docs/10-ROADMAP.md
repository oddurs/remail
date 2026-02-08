# Roadmap

Detailed, sprint-based roadmap grounded in the actual codebase audit. Each release is shippable — the project gets better with every merge, never broken.

---

## Current State (Audit Summary)

**What works:**

- Anonymous session system (middleware cookie → DB → auto-seed)
- Design token system (light/dark/system themes, zinc palette)
- Theme toggle with smooth transitions
- Inbox view with 5 category tabs, real Supabase data
- 9 mailbox views (starred, sent, drafts, all, spam, trash, important, snoozed, label)
- Thread detail view (multi-message, HTML rendering, auto-mark-read)
- Sidebar navigation (active states, badge counts, dynamic user labels)
- Compose modal (recipient autocomplete, formatting toolbar, auto-save drafts, send)
- Loading skeletons for inbox and thread
- Comprehensive seed data (15 contacts, 18 threads, 5 labels, signature)
- Full server action layer for email operations

**What's built but disconnected:**

- `thread-actions.tsx` — 4 client components (ThreadToolbarActions, StarButton, ReplyButton, ForwardButton) exist but are never imported. Thread page renders static HTML buttons instead.
- 7 email server actions (toggleStar, archiveEmails, trashEmails, etc.) are defined but never called from UI.
- EmailRow checkbox and star buttons render but do nothing (e.preventDefault only).

**What's duplicated:**

- `EmailRow` exists in both `src/components/mail/email-row.tsx` (used by inbox) and `src/app/(mail)/email-list.tsx` (used by 8 sub-pages). Nearly identical, minor differences (`<a>` vs `<Link>`).

**What's stub/placeholder:**

- Search page, all 6 settings pages, admin page — all "Coming soon".

**What's missing entirely:**

- Error boundaries, not-found pages
- Keyboard shortcuts
- Multi-select / bulk actions UI
- Snooze picker
- Attachment display
- About/showcase overlay
- OG image and social meta
- Framer Motion (not installed)
- Zod (installed, never imported)

---

## Release Plan

### R1 — Wire Up (3-day sprint)

**Goal:** Connect all existing dead code. Every button that renders should do something. Zero new features — just make what exists actually work.

#### R1.1 — Deduplicate EmailRow

- [ ] Delete the local `EmailRow` function from `src/app/(mail)/email-list.tsx`
- [ ] Import `EmailRow` from `@/components/mail/email-row.tsx` in `email-list.tsx`
- [ ] Standardize on `<Link>` (not `<a>`) for navigation in the shared component
- [ ] Verify all 9 mailbox views still render correctly

#### R1.2 — Wire thread page actions

- [ ] Import `ThreadToolbarActions` from `thread-actions.tsx` into `thread/[id]/page.tsx`
- [ ] Replace the static toolbar HTML with the functional `ThreadToolbarActions` component
- [ ] Import and use `StarButton` for each message's star toggle
- [ ] Import and use `ReplyButton` and `ForwardButton` for the last message
- [ ] Verify archive, trash, mark-unread, star, reply, forward all work end-to-end
- [ ] Test that compose opens correctly for reply/forward with quoted content

#### R1.3 — Wire email row actions

- [ ] Add `toggleStar` server action call to the star button in `EmailRow`
- [ ] Use `useOptimistic` or `useTransition` for instant star toggle feedback
- [ ] Verify star state persists after page reload
- [ ] Checkbox remains decorative for now (bulk actions come in R3)

#### R1.4 — Wire search bar

- [ ] Convert the topbar search input into a form that navigates to `/search?q={query}`
- [ ] Extract as a `SearchBar` client component (needs `onSubmit`, keyboard shortcut `/`)

#### R1.5 — Cleanup

- [ ] Remove unused `getDefaultSignature` server action (layout queries directly)
- [ ] Add `"use client"` audit — confirm every client component actually needs it
- [ ] Verify `zod` is imported nowhere — either add validation or remove from deps (keep it, validation comes in R3)

**Deliverable:** Every visible button in the app does something. Thread actions work. Stars toggle. Search navigates. No dead code.

---

### R2 — Core Interactions (5-day sprint)

**Goal:** The email client feels real. You can process email: read, star, archive, delete, reply, forward, compose. The core loop works.

#### R2.1 — Search page

- [ ] Build `/search` page with full-text search via PostgreSQL `tsvector`
- [ ] Parse structured operators: `from:`, `to:`, `subject:`, `has:attachment`, `is:unread`, `is:starred`
- [ ] Show results using the shared `EmailRow` component
- [ ] Empty state for no results
- [ ] Loading skeleton while searching

#### R2.2 — Inbox toolbar actions

- [ ] Make "Refresh" button trigger `router.refresh()` (revalidates server data)
- [ ] Make pagination display accurate (show actual page range)
- [ ] "Select all" checkbox — defer to R3 (needs bulk selection state)

#### R2.3 — Snooze picker

- [ ] Create a `SnoozePicker` dropdown component (Later today, Tomorrow, Next week, Pick date)
- [ ] Wire to `snoozeEmail` server action
- [ ] Snoozed emails disappear from inbox, appear in `/snoozed`
- [ ] Show snooze time on snoozed email rows

#### R2.4 — Toast notifications

- [ ] Install a lightweight toast library (sonner) or build a minimal one
- [ ] Show toast on: archive ("Conversation archived" + Undo), trash ("Moved to trash" + Undo), send ("Message sent"), star toggle
- [ ] Undo action calls the reverse server action (unarchive, untrash)
- [ ] Toast uses design tokens, respects theme

#### R2.5 — Error boundaries and not-found

- [ ] Add `error.tsx` to `(mail)` route group — friendly error with retry button
- [ ] Add `not-found.tsx` to `(mail)` route group — "Page not found" with back to inbox link
- [ ] Add `error.tsx` to `thread/[id]` — "Something went wrong loading this thread"
- [ ] Handle Supabase query failures gracefully in all server components

#### R2.6 — Settings layout

- [ ] Create `src/app/settings/layout.tsx` that wraps settings pages in the mail layout (sidebar + topbar)
- [ ] Or: render settings as a modal/drawer over the mail UI instead of a separate route
- [ ] Settings gear in topbar should link to `/settings` without losing context

**Deliverable:** Complete email processing loop. Search works. Errors are handled. Snooze works. User gets feedback on every action via toasts.

---

### R3 — Power Features (5-day sprint)

**Goal:** Multi-select, bulk actions, keyboard shortcuts, and label management. The app feels like a power tool.

#### R3.1 — Multi-select and bulk actions

- [ ] Add selection state to `EmailList` (Set of selected email IDs)
- [ ] Checkbox in `EmailRow` toggles selection
- [ ] "Select all" in toolbar selects all visible emails
- [ ] When selection is active, toolbar transforms: shows count + Archive, Trash, Mark Read, Mark Unread, Label buttons
- [ ] Bulk server actions: `bulkArchive`, `bulkTrash`, `bulkMarkRead`, `bulkMarkUnread`
- [ ] Optimistic removal from list on bulk archive/trash
- [ ] Undo toast for bulk destructive actions
- [ ] Clear selection after action completes

#### R3.2 — Keyboard shortcuts

- [ ] Create `KeyboardShortcutProvider` client component (global event listener)
- [ ] Implement Gmail-compatible shortcuts:
  - `j`/`k` — navigate email list (highlight row)
  - `o`/`Enter` — open highlighted email
  - `u` — return to inbox
  - `e` — archive
  - `#` — trash
  - `s` — star/unstar
  - `r` — reply
  - `f` — forward
  - `c` — compose
  - `/` — focus search
  - `?` — show shortcut help modal
  - `Shift+I` / `Shift+U` — mark read/unread
  - `x` — select/deselect current row
- [ ] Respect `keyboard_shortcuts` session preference
- [ ] Disable when focus is in input/textarea/contentEditable
- [ ] Visual indicator on highlighted row (subtle outline or background)

#### R3.3 — Keyboard shortcut help modal

- [ ] `?` opens a modal listing all shortcuts in a clean grid
- [ ] Grouped by context: Navigation, Actions, Compose, Selection
- [ ] Closable via Escape or clicking outside

#### R3.4 — Label management

- [ ] "Add label" button in sidebar opens a create-label modal (name, color picker)
- [ ] `createLabel` server action
- [ ] Right-click or long-press on label → edit/delete options
- [ ] `updateLabel`, `deleteLabel` server actions
- [ ] Label picker dropdown on thread page toolbar (apply/remove labels)
- [ ] Labels dropdown in bulk action toolbar

#### R3.5 — Input validation with Zod

- [ ] Add Zod schemas to all server actions (validate emailId, labelId, compose data, etc.)
- [ ] Validate search query params
- [ ] Validate session preferences on update
- [ ] Type-safe error messages returned to client

**Deliverable:** Power user features. Select 10 emails, archive them all. Navigate entirely by keyboard. Manage labels. All inputs validated.

---

### R4 — Animation and Polish (4-day sprint)

**Goal:** The app feels premium. Every interaction has purposeful motion. Micro-interactions that delight.

#### R4.1 — Install Framer Motion

- [ ] `npm install framer-motion`
- [ ] Create shared animation variants in `src/lib/animations.ts`

#### R4.2 — List animations

- [ ] Email rows animate in on page load (staggered fade + slide up)
- [ ] Archived/trashed emails animate out (slide right + fade)
- [ ] New emails animate in at the top of the list
- [ ] Category tab switch crossfades the list content

#### R4.3 — Compose window animations

- [ ] Compose opens with scale + fade from bottom-right
- [ ] Minimize collapses to title bar with spring animation
- [ ] Maximize expands with layout animation
- [ ] Close fades out + scales down

#### R4.4 — Thread view animations

- [ ] Messages stagger in on thread open
- [ ] Reply/forward compose slides in below the last message
- [ ] Back to inbox — thread slides out, inbox slides in (via page transitions)

#### R4.5 — Micro-interactions

- [ ] Star toggle: brief scale bounce (1.0 → 1.2 → 1.0)
- [ ] Checkbox: check mark draws in with a stroke animation
- [ ] Theme toggle: icon crossfade with rotation
- [ ] Toast: slides up from bottom with spring physics
- [ ] Sidebar active indicator: layout animation on the background pill
- [ ] Hover actions on email row: archive/trash/snooze icons fade in on the right side (Gmail-style)

#### R4.6 — Reduced motion

- [ ] Wrap all Framer Motion in `useReducedMotion()` check
- [ ] When `prefers-reduced-motion` is set: instant transitions, no springs, no stagger
- [ ] Test with macOS accessibility settings

#### R4.7 — Typography and spacing audit

- [ ] Review every page for consistent spacing (4px grid)
- [ ] Ensure font weights are consistent (semibold for emphasis, normal for body)
- [ ] Check truncation behavior on all text (sender, subject, snippet)
- [ ] Verify responsive behavior at common breakpoints (1280, 1440, 1920)

**Deliverable:** The app feels alive. Every action has feedback. Motion is purposeful, never gratuitous. Accessibility is preserved.

---

### R5 — Mocked AI Features (3-day sprint)

**Goal:** Demonstrate AI product thinking without API dependencies. Pre-computed intelligence that feels magical.

#### R5.1 — Thread summarization

- [ ] Add `summary` text column to `gmail_threads` table (migration)
- [ ] Pre-compute summaries in seed data for threads with 2+ messages
- [ ] Summary format: 2-3 bullet points covering key points and action items
- [ ] Display summary card at the top of thread view (collapsible)
- [ ] Visual: subtle background, "AI Summary" label, sparkle icon

#### R5.2 — Smart categorization confidence

- [ ] Add `category_confidence` float column to `gmail_emails` (migration)
- [ ] Seed with realistic confidence scores (0.7–0.99)
- [ ] Show subtle confidence indicator on category tabs (optional, don't clutter)

#### R5.3 — Suggested replies

- [ ] Add `suggested_replies` jsonb column to `gmail_emails` (migration)
- [ ] Seed 2-3 suggested reply chips for the latest message in key threads
- [ ] Display as clickable chips below the last message (before Reply/Forward buttons)
- [ ] Clicking a suggestion opens compose with that text pre-filled

#### R5.4 — Email priority scoring

- [ ] Add `priority_score` float column to `gmail_emails` (migration)
- [ ] Seed with scores based on sender importance, recency, and content
- [ ] Optional: "Priority" view that sorts by score instead of date
- [ ] Subtle visual indicator on high-priority emails (e.g., colored left border)

**Deliverable:** AI features that demonstrate product vision. All pre-computed — zero latency, zero cost, always works. Architecture supports swapping in real AI later.

---

### R6 — Showcase and Portfolio (4-day sprint)

**Goal:** The project tells its own story. A recruiter landing on the URL understands what this is, who built it, and how to get in touch — without leaving the app.

#### R6.1 — About panel component

- [ ] Build `AboutPanel` as a `Drawer` sliding in from the right (~480px wide)
- [ ] Framer Motion slide + backdrop animation
- [ ] Focus trap when open
- [ ] Close on Escape, backdrop click, or X button
- [ ] Scrollable content area

#### R6.2 — About panel content

- [ ] Section 1: Header — "Remail" title, "Email, Reimagined" subtitle, "by Oddur Sigurdsson"
- [ ] Section 2: The Problem — Gmail pain points (2-3 paragraphs)
- [ ] Section 3: Design Decisions — Monochromatic palette, progressive disclosure, one-click triage, proper dark mode, session-based demo (bullet points with brief explanations)
- [ ] Section 4: Technical Highlights — Next.js 15 RSC, Supabase RLS, FTS, CSS custom properties, TypeScript strict, Tailwind 4 (brief, impressive, not a resume dump)
- [ ] Section 5: What I'd Do Next — Honest list of future improvements
- [ ] Section 6: About — 2-3 sentence bio
- [ ] Section 7: Get in Touch — LinkedIn button + Email button (sticky at bottom of panel)

#### R6.3 — Floating trigger

- [ ] Fixed pill button in bottom-right corner: "About this project"
- [ ] Subtle styling: elevated background, border, secondary text
- [ ] On mobile: collapse to an info icon
- [ ] Z-index at `--z-compose` level
- [ ] Does not obstruct email content

#### R6.4 — First-visit experience

- [ ] One-time toast on first visit: "This is an interactive demo — explore freely"
- [ ] Store "has seen welcome" flag in localStorage
- [ ] Toast auto-dismisses after 5 seconds, has dismiss button

#### R6.5 — OG image and social meta

- [ ] Create `/og-image.png` (1200x630) — split light/dark screenshot with "Remail" text overlay
- [ ] Update `layout.tsx` metadata: title "Remail — Email, Reimagined", description, OG tags, Twitter card
- [ ] Verify preview renders correctly on: Twitter, LinkedIn, Slack, iMessage

#### R6.6 — GitHub README

- [ ] Write a clean README.md: one-line description, screenshot, live demo link, tech stack, "Built by Oddur Sigurdsson" with links
- [ ] No verbose documentation in README — the docs/ folder handles that

**Deliverable:** The project is portfolio-ready. Anyone who visits understands the what, why, and who. Contact is one click away.

---

### R7 — Ship (2-day sprint)

**Goal:** Production deployment. Performance verified. Everything works on the live URL.

#### R7.1 — Performance audit

- [ ] Run `next build` — verify total JS bundle < 100kB first load
- [ ] Lighthouse audit: target 95+ on Performance, Accessibility, Best Practices, SEO
- [ ] Verify LCP < 1.5s, FID < 100ms, CLS < 0.1
- [ ] Check that Server Components are not accidentally bundled as client
- [ ] Optimize any large imports (tree-shake, dynamic import if needed)

#### R7.2 — Accessibility audit

- [ ] Tab through entire app — verify logical focus order
- [ ] Screen reader test (VoiceOver on macOS): inbox, thread, compose, about panel
- [ ] Verify all icon-only buttons have `aria-label`
- [ ] Verify color contrast meets WCAG 2.1 AA in both themes
- [ ] Verify `prefers-reduced-motion` disables animations

#### R7.3 — Cross-browser testing

- [ ] Chrome, Firefox, Safari (macOS)
- [ ] Safari (iOS), Chrome (Android) — basic responsive check
- [ ] Verify theme toggle works in all browsers
- [ ] Verify compose modal works on mobile viewports

#### R7.4 — Domain and deployment

- [ ] Configure custom domain in Vercel
- [ ] Verify SSL, redirects (www → non-www or vice versa)
- [ ] Enable Vercel Analytics and Speed Insights
- [ ] Final smoke test on production URL

#### R7.5 — Session cleanup

- [ ] Set up Supabase scheduled function or pg_cron to delete expired sessions (> 7 days)
- [ ] Verify cascade deletes work (session deletion removes all related data)

#### R7.6 — Launch checklist

- [ ] All pages load without errors
- [ ] Theme toggle works (system/light/dark)
- [ ] Compose, send, reply, forward all work
- [ ] Search returns results
- [ ] Star, archive, trash, snooze all work with undo
- [ ] Keyboard shortcuts work
- [ ] About panel opens and closes cleanly
- [ ] OG image renders on social platforms
- [ ] Mobile is usable (not perfect, but not broken)
- [ ] Share the URL

**Deliverable:** Live on a custom domain. Fast, accessible, polished. Ready to share with hiring managers.

---

## Timeline Summary

| Release | Sprint             | Focus                                                            | Estimated Days |
| ------- | ------------------ | ---------------------------------------------------------------- | -------------- |
| **R1**  | Wire Up            | Connect dead code, deduplicate, cleanup                          | 3 days         |
| **R2**  | Core Interactions  | Search, snooze, toasts, errors, settings layout                  | 5 days         |
| **R3**  | Power Features     | Multi-select, bulk actions, keyboard shortcuts, labels, Zod      | 5 days         |
| **R4**  | Animation & Polish | Framer Motion, micro-interactions, reduced motion, spacing audit | 4 days         |
| **R5**  | Mocked AI          | Thread summaries, suggested replies, priority scoring            | 3 days         |
| **R6**  | Showcase           | About panel, OG image, social meta, welcome toast, README        | 4 days         |
| **R7**  | Ship               | Performance, accessibility, cross-browser, domain, launch        | 2 days         |
|         |                    | **Total**                                                        | **~26 days**   |

## Priority Order

If time is limited, ship in this order:

1. **R1** (Wire Up) — non-negotiable, fixes broken state
2. **R6** (Showcase) — the portfolio payoff, can ship without R2-R5
3. **R2** (Core Interactions) — makes the demo feel real
4. **R4** (Animation) — the "wow" factor
5. **R7** (Ship) — go live
6. **R3** (Power Features) — impressive but not essential for portfolio
7. **R5** (Mocked AI) — nice-to-have, shows product thinking
