# Deployment

## Hosting

**Vercel** — zero-config Next.js deployment.

- Production branch: `main`
- Preview deployments: every push to a non-main branch gets a unique URL
- Framework preset: Next.js (auto-detected)
- Build command: `next build`
- Output: `.next/` (default)

## Environment Variables

Set in the Vercel dashboard (Settings → Environment Variables):

| Variable                        | Where           | Description                              |
| ------------------------------- | --------------- | ---------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Client + Server | Supabase project URL                     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Supabase publishable anon key            |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server only     | Supabase service role key (bypasses RLS) |

`NEXT_PUBLIC_` prefix exposes the variable to the browser. The service role key is **never** exposed to the client.

### Local Development

Create `.env.local` (gitignored):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Supabase Setup

### Project Creation

1. Create a new Supabase project (region: closest to target audience)
2. Note the project URL and keys from Settings → API
3. Set environment variables in Vercel and `.env.local`

### Database Migrations

Migrations are managed via the Supabase dashboard or CLI. The schema includes:

1. `gmail_sessions` — visitor sessions with preferences
2. `gmail_contacts` — email contacts
3. `gmail_threads` — conversation threads
4. `gmail_emails` — individual messages (with FTS column)
5. `gmail_email_recipients` — join table for recipients
6. `gmail_email_labels` — join table for labels
7. `gmail_labels` — user and system labels
8. `gmail_attachments` — file metadata
9. `gmail_filters` — automation rules
10. `gmail_signatures` — email signatures
11. `gmail_snooze_queue` — snoozed email tracking

### Row Level Security

All tables have RLS enabled. The service role client bypasses RLS for server-side operations. If the anon key is used directly (e.g., from a client component), RLS policies restrict access to the current session's data only.

### Type Generation

After schema changes:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
```

## Domain

- Custom domain configured in Vercel (Settings → Domains)
- SSL auto-provisioned by Vercel
- Recommended: `remail.design` or similar short, memorable domain

## Performance Budget

| Metric                         | Target  | Measurement           |
| ------------------------------ | ------- | --------------------- |
| Largest Contentful Paint (LCP) | < 1.5s  | Vercel Speed Insights |
| First Input Delay (FID)        | < 100ms | Vercel Speed Insights |
| Cumulative Layout Shift (CLS)  | < 0.1   | Vercel Speed Insights |
| Time to First Byte (TTFB)      | < 200ms | Vercel Edge Network   |
| Total JS bundle (first load)   | < 100kB | `next build` output   |

### Performance Strategies

- **Server Components**: Most pages ship zero client JS. Only interactive components (EmailRow, ThemeToggle, SidebarNav) include JS.
- **Streaming**: Suspense boundaries let the shell render while data loads.
- **No heavy dependencies**: No moment.js, no lodash, no large UI libraries.
- **Image optimization**: Next.js `<Image>` for any images (avatars, attachments).
- **Font optimization**: `next/font` for Google Sans / Inter with `display: swap`.

## Social Sharing / OG Cards

Configured in root `layout.tsx` metadata:

```typescript
export const metadata: Metadata = {
  title: "Remail — Email, Reimagined",
  description:
    "A portfolio-grade interactive redesign of Gmail by Oddur Sigurdsson.",
  openGraph: {
    title: "Remail — Email, Reimagined",
    description: "What if Gmail was built for focus, speed, and delight?",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Remail — Email, Reimagined",
    description: "What if Gmail was built for focus, speed, and delight?",
    images: ["/og-image.png"],
  },
};
```

The OG image should be a polished screenshot of the app in both light and dark mode, split down the middle.

## Analytics (Optional)

- **Vercel Analytics**: Built-in, zero-config. Tracks page views and web vitals.
- **Vercel Speed Insights**: Real user performance monitoring.
- No third-party analytics. No cookies beyond the session cookie. Privacy-first.

## CI/CD Pipeline

Vercel handles CI/CD automatically:

1. Push to `main` → production deployment
2. Push to any branch → preview deployment with unique URL
3. Build fails → deployment blocked, error shown in Vercel dashboard
4. PR comments show preview URL automatically

### Pre-deploy Checks (Planned)

Add to `package.json` scripts or GitHub Actions:

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build verification
npm run build
```

## Session Cleanup

Expired sessions (older than 7 days) should be cleaned up periodically:

```sql
-- Run via Supabase scheduled function or cron
DELETE FROM gmail_sessions
WHERE expires_at < now();
```

This cascades to all related data (contacts, emails, threads, etc.) via foreign key `ON DELETE CASCADE`.
