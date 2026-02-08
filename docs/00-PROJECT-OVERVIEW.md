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

## Roadmap

See **[docs/10-ROADMAP.md](./10-ROADMAP.md)** for the full sprint-based roadmap with task-level detail.

| Release                     | Focus                                                                                            | Days | Status  |
| --------------------------- | ------------------------------------------------------------------------------------------------ | ---- | ------- |
| **R1 — Wire Up**            | Connect dead code, deduplicate EmailRow, wire thread actions + star toggle + search bar          | 3    | Next    |
| **R2 — Core Interactions**  | Search page, snooze picker, toast notifications, error boundaries, settings layout               | 5    | Planned |
| **R3 — Power Features**     | Multi-select, bulk actions, keyboard shortcuts, label management, Zod validation                 | 5    | Planned |
| **R4 — Animation & Polish** | Framer Motion, list/compose/thread animations, micro-interactions, reduced motion, spacing audit | 4    | Planned |
| **R5 — Mocked AI**          | Thread summaries, suggested replies, priority scoring (all pre-computed, no API)                 | 3    | Planned |
| **R6 — Showcase**           | About panel overlay, case study content, OG image, social meta, welcome toast, README            | 4    | Planned |
| **R7 — Ship**               | Performance audit, accessibility audit, cross-browser, custom domain, launch                     | 2    | Planned |

**Priority order if time-constrained:** R1 → R6 → R2 → R4 → R7 → R3 → R5

## Key Design Decisions

- **App-first experience**: No landing page. Visitors see the product immediately.
- **Session-based demo**: Each visitor gets their own seeded mailbox via anonymous session. No login required.
- **Neutral palette**: Zinc-based monochromatic design. Accent colors are black (light mode) and white (dark mode). Color is reserved for semantic meaning (stars, errors, labels).
- **Server-first architecture**: React Server Components for data fetching. Client Components only where interactivity demands it.
- **Mocked AI**: Pre-computed summaries and categories. No API keys required. Always works, zero latency.

## Author

**Oddur Sigurdsson**
Contact via LinkedIn + email (see showcase overlay).
