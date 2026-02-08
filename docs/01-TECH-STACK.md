# Tech Stack

Every technology choice is intentional. This section documents what we use and why.

## Frontend

| Technology        | Version                      | Why                                                                                                                                                                |
| ----------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Next.js**       | 15.x (App Router, Turbopack) | Server Components by default, file-based routing, streaming with Suspense, image optimization, and zero-config Vercel deployment. Turbopack for fast dev rebuilds. |
| **React**         | 19.x                         | Latest concurrent features, `use()` hook for promises, improved Server Component support.                                                                          |
| **TypeScript**    | 5.7+ (strict mode)           | Catches bugs at compile time. Strict mode enforced — no `any` types. Self-documenting code.                                                                        |
| **Tailwind CSS**  | 4.x                          | Utility-first CSS co-located with markup. Design tokens defined as CSS custom properties and consumed via `var()`. No CSS modules, no styled-components.           |
| **Framer Motion** | (planned)                    | Production-quality layout animations, enter/exit transitions, spring physics. Added only when animation phase begins.                                              |

## Utilities

| Library                       | Why                                                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **clsx** + **tailwind-merge** | The `cn()` utility for conditional class composition without conflicts.                                        |
| **Zod**                       | Runtime validation at system boundaries (form inputs, API responses, URL params). Type inference from schemas. |

## Backend

| Technology                     | Why                                                                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Supabase** (hosted Postgres) | Full backend without a custom server: auth, database, Row Level Security, real-time subscriptions, storage. Generated TypeScript types from the schema. |
| **@supabase/ssr**              | Server-side Supabase client that works with Next.js App Router and cookies.                                                                             |

## Database

- **PostgreSQL** via Supabase
- **Row Level Security (RLS)** on all tables — sessions can only access their own data
- Schema managed via Supabase migrations
- Types generated with `supabase gen types typescript`

## Deployment

| Service    | Why                                                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Vercel** | Zero-config Next.js hosting. Preview deployments for every branch. Edge functions, analytics, and speed insights built in. |

## AI (Mocked)

- Email summaries, smart categories, and suggested replies are **pre-computed and stored in the seed data**
- No OpenAI API dependency — the demo always works, loads instantly, and costs nothing to run
- Architecture is designed so a real AI provider could be swapped in later via server actions

## Testing (Planned)

| Tool                      | Purpose                                                              |
| ------------------------- | -------------------------------------------------------------------- |
| **Vitest**                | Unit and integration tests. Fast, ESM-native, compatible with React. |
| **React Testing Library** | Component tests. Test behavior, not implementation.                  |

## What We Don't Use (and Why)

| Skipped                         | Reason                                                                                                                             |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Redux / Zustand                 | Server Components handle most state. Minimal client state managed with React context and URL searchParams. No global store needed. |
| CSS Modules / styled-components | Tailwind handles all styling via utility classes and CSS custom properties.                                                        |
| Prisma / Drizzle                | Supabase client provides typed queries directly. An ORM adds unnecessary abstraction for this project.                             |
| NextAuth                        | No user accounts. Anonymous sessions via cookies.                                                                                  |
| Real Gmail API                  | This is a design demo, not a production client. Mock data is more reliable and controllable.                                       |
