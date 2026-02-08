# Remail — Email, Reimagined

## Vision

Remail is a portfolio-grade interactive redesign of Gmail that demonstrates what email could be if built for **focus, speed, and delight**. It is a fully functional web application — not a static mockup — with real data, real interactions, and real attention to craft.

Visitors land directly in the working email client. An "About This Project" overlay panel provides the case study, design process, and contact information.

## Goals

1. **Reduce cognitive load** — Strip away Gmail's accumulated clutter. Every pixel earns its place.
2. **Enable inbox zero** — One-click triage actions (archive, snooze, done) make processing email fast.
3. **Beautiful, neutral aesthetic** — A monochromatic zinc palette that feels premium in both light and dark mode. No garish blues.
4. **Demonstrate technical depth** — Server Components, streaming, optimistic updates, proper accessibility, and a clean architecture that shows engineering maturity.
5. **Portfolio impact** — Impress design leaders and hiring managers with both the product thinking and the execution quality.

## Target Audience

- Design and engineering hiring managers
- Recruiters at product companies
- Fellow designers and engineers (peer credibility)
- Anyone who has wished Gmail was better

## What This Is Not

- Not a production email client — no real Gmail API connection
- Not a Chrome extension or Gmail skin
- Not a startup pitch — it's a design exploration backed by working code

## Project Phases

| Phase           | Focus                                                        | Status      |
| --------------- | ------------------------------------------------------------ | ----------- |
| 1. Foundation   | Next.js scaffold, Supabase schema, design tokens, seed data  | Done        |
| 2. Core UI      | Inbox list, thread view, sidebar, topbar, category tabs      | Done        |
| 3. Interactions | Theme toggle, star/select actions, compose window, search    | In Progress |
| 4. Polish       | Animations (Framer Motion), keyboard shortcuts, empty states | Planned     |
| 5. AI Features  | Email summarization, smart categorization (mocked)           | Planned     |
| 6. Showcase     | About overlay, case study content, OG cards, contact CTA     | Planned     |
| 7. Ship         | Domain, final QA, performance audit, launch                  | Planned     |

## Key Design Decisions

- **App-first experience**: No landing page. Visitors see the product immediately.
- **Session-based demo**: Each visitor gets their own seeded mailbox via anonymous session. No login required.
- **Neutral palette**: Zinc-based monochromatic design. Accent colors are black (light mode) and white (dark mode). Color is reserved for semantic meaning (stars, errors, labels).
- **Server-first architecture**: React Server Components for data fetching. Client Components only where interactivity demands it.
- **Mocked AI**: Pre-computed summaries and categories. No API keys required. Always works, zero latency.

## Author

**Oddur Sigurdsson**
Contact via LinkedIn + email (see showcase overlay).
