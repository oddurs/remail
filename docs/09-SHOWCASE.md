# Showcase — Portfolio Presentation

The project is **app-first**. Visitors land directly in the working email client. A floating trigger opens a slide-over panel with the case study, design process, and contact information.

## Entry Experience

### First Visit Flow

1. Visitor arrives at the URL
2. Anonymous session is created, mailbox is seeded with mock data (~1-2s)
3. Inbox renders with realistic emails across categories
4. A subtle floating pill in the bottom-right reads **"About this project"**
5. Optional: a one-time toast notification says "This is an interactive demo — explore freely" (dismisses after 5s)

### No Landing Page

There is no marketing page, no hero section, no "Enter Demo" button. The product speaks for itself. The about panel provides all the context a recruiter or hiring manager needs.

## About Panel

A `Drawer` component that slides in from the right edge. Width: ~480px on desktop, full-width on mobile. Scrollable content. Closes on X, Escape, or backdrop click.

### Content Structure

#### 1. Header

```
Remail
Email, Reimagined
A design exploration by Oddur Sigurdsson
```

#### 2. The Problem

> Gmail hasn't had a meaningful redesign in years. It suffers from feature creep without cohesion — Chat, Meet, Spaces, and Tasks bolted on without integration. The core email experience is buried under accumulated UI debt.
>
> Users want simpler triage, better focus tools, and a modern aesthetic. They want to reach inbox zero without fighting the interface.

#### 3. Research & Insights

Key pain points identified through analysis:

- **Cognitive overload**: Too many elements competing for attention
- **Weak visual hierarchy**: Unread emails don't stand out enough, actions aren't prominent
- **Blue everywhere**: Google's blue accent dominates and feels dated
- **No focus mode**: No way to hide noise and see only what matters
- **Bulk actions are tedious**: Multi-step selection process for simple operations
- **Dark mode is an afterthought**: Navy blue tint instead of proper dark

#### 4. Design Decisions

- **Monochromatic palette**: Zinc-based neutrals. Black accent on light, white accent on dark. Color reserved for semantic meaning only.
- **Progressive disclosure**: Simple surface, power underneath. Formatting toolbar hidden by default. Advanced search operators available but not in your face.
- **One-click triage**: Every email action is one click or one keystroke away.
- **Proper dark mode**: True blacks and grays. No blue tint. Shadows replaced by subtle borders for elevation.
- **Session-based demo**: Every visitor gets their own mailbox. No login. No friction.

#### 5. Technical Highlights

- **Next.js 15 App Router** with React Server Components — most pages ship zero client JavaScript
- **Supabase PostgreSQL** with Row Level Security — every session is isolated at the database level
- **Full-text search** via PostgreSQL tsvector — instant search across all emails
- **CSS custom properties** for theming — light/dark/system with zero flash of wrong theme
- **TypeScript strict mode** — no `any` types, Zod validation at boundaries
- **Tailwind CSS 4** — utility-first styling with design token integration

#### 6. What I'd Do Next

- Framer Motion animations for list transitions and compose window
- Keyboard shortcuts (Gmail-compatible)
- Email summarization with AI
- Drag-and-drop label management
- Mobile-responsive layout
- Accessibility audit with screen reader testing

#### 7. About the Designer

```
Oddur Sigurdsson

[Brief 2-3 sentence bio — who you are, what you do,
what kind of role you're looking for]
```

#### 8. Get in Touch

Two clear CTAs:

```
[LinkedIn →]  [Email →]
```

- LinkedIn: link to profile
- Email: `mailto:` link

Clean, no-nonsense. No contact form (reduces friction — people can just click).

## Floating Trigger

A pill-shaped button fixed to the bottom-right corner of the viewport.

```
Position: fixed
Bottom: 24px
Right: 24px
Z-index: var(--z-compose) — same level as compose window
```

**Visual design**:

- Subtle background: `var(--color-bg-elevated)` with `var(--shadow-md)`
- Border: `var(--color-border-default)`
- Text: `var(--color-text-secondary)`
- On hover: slight elevation increase, text darkens
- Small enough to not obstruct the email UI

**Label**: "About this project" (or just an info icon on mobile)

## Social Sharing

### Open Graph Tags

```html
<meta property="og:title" content="Remail — Email, Reimagined" />
<meta
  property="og:description"
  content="What if Gmail was built for focus, speed, and delight? An interactive redesign by Oddur Sigurdsson."
/>
<meta property="og:image" content="/og-image.png" />
<meta property="og:type" content="website" />
```

### OG Image

A 1200x630 image showing:

- Left half: light mode inbox view
- Right half: dark mode inbox view
- Bottom: "Remail — Email, Reimagined" text overlay
- Clean, high-contrast, readable at small sizes (Twitter cards, Slack previews, LinkedIn shares)

### Twitter Card

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Remail — Email, Reimagined" />
<meta
  name="twitter:description"
  content="What if Gmail was built for focus, speed, and delight?"
/>
<meta name="twitter:image" content="/og-image.png" />
```

## GitHub Integration

- Link to the public repo in the About panel
- Clean README with:
  - One-line description
  - Screenshot
  - Live demo link
  - Tech stack badges
  - "Built by Oddur Sigurdsson" with contact links

## Accessibility of the Showcase

- About panel traps focus when open (no tabbing to elements behind it)
- Escape key closes the panel
- Panel content is scrollable with keyboard
- All links have descriptive text (not "click here")
- Trigger button has `aria-label="About this project"`
