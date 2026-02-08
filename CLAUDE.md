# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Remail — a portfolio-grade interactive redesign of Gmail. Fully functional Next.js app with real Supabase data where each visitor gets an auto-seeded anonymous session (no login required).

## Commands

```bash
npm run dev          # Next.js dev server with Turbopack on port 1122
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

No test runner is configured.

## Architecture

**Next.js 15 App Router + React 19 Server Components + Supabase (PostgreSQL)**

- **Server-first**: Pages/layouts are RSC by default. Only interactive components use `"use client"`.
- **Server Actions** (`src/lib/actions/`): All mutations go through `"use server"` functions, followed by `revalidatePath("/", "layout")`.
- **Data access**: `createServiceClient()` (service role, bypasses RLS) for all server-side queries. All queries filter by `session_id`.
- **Session model**: Anonymous sessions via `session_id` cookie (set in middleware, 7-day TTL). `ensureSession()` in mail layout seeds demo data on first visit.
- **Seed system** (`src/lib/seed/`): Creates 15 contacts, 18 threads across 5 categories, labels, and a signature per session.

## Routing

`(mail)` route group provides shared layout (sidebar + topbar). Key dynamic routes: `/thread/[id]`, `/label/[id]`, `/search?q=`. Settings and admin pages are outside the mail layout group.

## Styling

- **Tailwind CSS 4.0** — CSS-first config (no tailwind.config file), imported via `@import "tailwindcss"` in `globals.css`.
- **CSS custom properties** for all colors: `var(--color-bg-primary)`, `var(--color-text-secondary)`, etc. Never use raw hex values.
- **Theme**: Light/dark via `[data-theme]` attribute on `<html>`. Zinc-based monochromatic palette.
- **Icons**: Inline SVGs (no icon library).

## Key Conventions

- File naming: kebab-case. Component exports: PascalCase.
- `@/` path alias maps to `src/`.
- `cn()` from `src/lib/utils.ts` for merging Tailwind classes (clsx + tailwind-merge).
- Client state: React Context (`ComposeProvider`, `ToastProvider`) + `useTransition()` for optimistic UI. No external state libraries.
- Supabase types auto-generated via CLI (`src/lib/supabase/types.ts`).

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```
