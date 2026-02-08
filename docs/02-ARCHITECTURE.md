# Architecture

## Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (html, body, theme script)
│   ├── (mail)/                   # Mail route group (shared sidebar + topbar)
│   │   ├── layout.tsx            # Mail shell: sidebar, topbar, session init
│   │   ├── page.tsx              # Inbox (default: primary category)
│   │   ├── sidebar.tsx           # Sidebar navigation (client component)
│   │   ├── starred/page.tsx      # Starred emails
│   │   ├── sent/page.tsx         # Sent emails
│   │   ├── drafts/page.tsx       # Drafts
│   │   ├── snoozed/page.tsx      # Snoozed emails
│   │   ├── important/page.tsx    # Important emails
│   │   ├── all/page.tsx          # All mail
│   │   ├── spam/page.tsx         # Spam
│   │   ├── trash/page.tsx        # Trash
│   │   ├── search/page.tsx       # Search results
│   │   ├── label/[id]/page.tsx   # Label-filtered view
│   │   └── thread/[id]/page.tsx  # Thread detail view
│   ├── settings/                 # Settings pages
│   │   ├── page.tsx              # General settings
│   │   ├── themes/page.tsx       # Theme settings
│   │   ├── labels/page.tsx       # Label management
│   │   ├── filters/page.tsx      # Filter rules
│   │   ├── inbox/page.tsx        # Inbox preferences
│   │   └── signatures/page.tsx   # Email signatures
│   └── admin/                    # Admin/debug tools
├── components/
│   ├── mail/                     # Email-specific components
│   │   └── email-row.tsx         # Email list row (client component)
│   └── theme-toggle.tsx          # System/light/dark toggle (client component)
├── lib/
│   ├── utils.ts                  # cn(), formatRelativeDate(), htmlToSnippet(), formatFileSize()
│   ├── session.ts                # Cookie-based anonymous session management
│   ├── actions/
│   │   └── session.ts            # Server actions: ensureSession, getPreferences, updatePreferences
│   ├── queries/
│   │   └── emails.ts             # Reusable Supabase query functions
│   ├── seed/
│   │   ├── generator.ts          # Session seeding orchestrator
│   │   ├── contacts.ts           # Mock contact data
│   │   └── emails.ts             # Mock email/thread data
│   └── supabase/
│       ├── server.ts             # Server-side Supabase client (service role)
│       ├── client.ts             # Browser-side Supabase client
│       ├── middleware.ts          # Supabase auth middleware helpers
│       └── types.ts              # Generated database types
└── styles/
    └── globals.css               # Design tokens, theme definitions, base styles
```

## Server vs Client Component Strategy

**Default: Server Components.** Every page and layout is a Server Component unless it needs browser APIs or event handlers.

**Client Components (`'use client'`) are used only for:**

- Event handlers (onClick, onChange) — e.g., `EmailRow`, `ThemeToggle`
- Browser APIs (localStorage, matchMedia) — e.g., `ThemeToggle`
- Hooks that require client state (usePathname, useState) — e.g., `SidebarNav`

**The boundary is always pushed as far down the tree as possible.** The mail layout fetches all data server-side and passes serializable props to client components. Client components never fetch data directly.

## Data Flow

```
[Supabase Postgres]
        ↓
[Server Component (page.tsx)]
  - Calls Supabase via service client
  - Deduplicates, transforms, formats data
  - Passes plain props (strings, numbers, booleans) to client components
        ↓
[Client Component (email-row.tsx)]
  - Receives serializable props only
  - Handles user interactions (click, hover)
  - Calls server actions for mutations
```

## State Management

| State Type      | Approach                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------- |
| **Server data** | React Server Components fetch on every request. No client-side cache.                         |
| **URL state**   | `searchParams` for category tabs, search queries, pagination. Shareable, bookmarkable.        |
| **UI state**    | Minimal `useState` in client components (compose open/closed, dropdown visibility).           |
| **Theme**       | `localStorage` + `data-theme` attribute on `<html>`. Hydrated before paint via inline script. |
| **Session**     | HTTP-only cookie containing anonymous session ID. Server-side only.                           |

No global state store. No Redux. No Zustand. The architecture doesn't need it.

## Session System

Every visitor gets an anonymous session:

1. First visit: middleware checks for session cookie → none found → generates UUID → sets cookie
2. `ensureSession()` server action: checks if session exists in DB → if not, creates row and seeds with mock data
3. All queries filter by `session_id` — visitors only see their own data
4. RLS policies enforce this at the database level

## Performance Strategy

- **Streaming**: Suspense boundaries around slow data fetches. Shell renders immediately.
- **Server Components**: Zero client JS for data-fetching pages. Only interactive components ship JS.
- **Turbopack**: Fast dev rebuilds (< 200ms).
- **Edge-ready**: No Node.js-specific APIs in server components. Could deploy to edge runtime.
- **Minimal client bundle**: No heavy libraries. Tailwind is CSS-only. Zod is tree-shakeable.

## Security

- **RLS on all tables**: Even if the Supabase anon key leaks, users can only access their own session data.
- **Service role client**: Server-side queries use the service role key (never exposed to browser).
- **No user accounts**: No passwords, no OAuth, no PII stored. Anonymous sessions only.
- **Input validation**: Zod schemas validate all user input before database writes.
- **CSP headers**: Configured via Next.js middleware (planned).
