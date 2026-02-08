# Design System

## Design Principles

1. **Neutral by default** — The interface is monochromatic. Color is reserved for semantic meaning: stars, errors, labels, success states. The UI itself never competes with content.
2. **Progressive disclosure** — Simple on the surface, powerful underneath. Advanced features reveal themselves through interaction, not clutter.
3. **Focus-first** — Every design decision asks: "Does this help the user process email faster?" If not, it's removed.
4. **Consistent density** — Information density is carefully tuned. Not too sparse (wasted space), not too cramped (cognitive overload).
5. **Motion with purpose** — Animations communicate state changes, not decoration. Every transition has a reason.

## Color Palette

### Light Mode

The light theme uses a **zinc** scale — warm neutral grays with no blue or green tint.

| Token                    | Value              | Usage                            |
| ------------------------ | ------------------ | -------------------------------- |
| `--color-bg-primary`     | `#ffffff`          | Main content background          |
| `--color-bg-secondary`   | `#fafafa`          | Page background, read emails     |
| `--color-bg-tertiary`    | `#f4f4f5`          | Search bar, input backgrounds    |
| `--color-bg-elevated`    | `#ffffff`          | Cards, modals, elevated surfaces |
| `--color-bg-hover`       | `rgba(0,0,0,0.04)` | Hover state                      |
| `--color-bg-active`      | `rgba(0,0,0,0.08)` | Active/pressed state             |
| `--color-text-primary`   | `#09090b`          | Headings, body text              |
| `--color-text-secondary` | `#52525b`          | Secondary text, descriptions     |
| `--color-text-tertiary`  | `#a1a1aa`          | Timestamps, placeholders         |
| `--color-accent-primary` | `#18181b`          | Primary actions, active states   |
| `--color-border-default` | `#e4e4e7`          | Standard borders                 |
| `--color-border-subtle`  | `#f4f4f5`          | Subtle dividers                  |

### Dark Mode

True neutral darks. No navy, no blue tint. Proper dark mode.

| Token                    | Value                    | Usage                      |
| ------------------------ | ------------------------ | -------------------------- |
| `--color-bg-primary`     | `#141414`                | Main content background    |
| `--color-bg-secondary`   | `#0a0a0a`                | Page background            |
| `--color-bg-tertiary`    | `#1e1e1e`                | Elevated surfaces, inputs  |
| `--color-bg-hover`       | `rgba(255,255,255,0.07)` | Hover state                |
| `--color-text-primary`   | `#e4e4e7`                | Headings, body text        |
| `--color-text-secondary` | `#a1a1aa`                | Secondary text             |
| `--color-text-tertiary`  | `#71717a`                | Timestamps, placeholders   |
| `--color-accent-primary` | `#e4e4e7`                | Primary actions (inverted) |
| `--color-border-default` | `#27272a`                | Standard borders           |
| `--color-border-subtle`  | `#1e1e1e`                | Subtle dividers            |

### Semantic Colors

Used sparingly and only for meaning:

| Purpose        | Light     | Dark      |
| -------------- | --------- | --------- |
| Success        | `#16a34a` | `#4ade80` |
| Warning / Star | `#ca8a04` | `#facc15` |
| Error          | `#dc2626` | `#f87171` |
| Info           | `#52525b` | `#a1a1aa` |

## Typography

Font stack: `"Google Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

| Level           | Size             | Weight                                        | Usage                         |
| --------------- | ---------------- | --------------------------------------------- | ----------------------------- |
| Page title      | `text-xl` (20px) | `font-normal` (400)                           | Thread subject                |
| Section heading | `text-lg` (18px) | `font-medium` (500)                           | Settings headings             |
| Body            | `text-sm` (14px) | `font-normal` (400)                           | Email body, descriptions      |
| Body emphasis   | `text-sm` (14px) | `font-semibold` (600)                         | Unread sender, unread subject |
| Caption         | `text-xs` (12px) | `font-normal` (400)                           | Timestamps, counts, metadata  |
| Label           | `text-[11px]`    | `font-medium` (500)                           | Label badges                  |
| Sidebar header  | `text-xs`        | `font-medium` + `uppercase` + `tracking-wide` | "LABELS" section header       |

## Spacing

Based on a **4px grid**. Tailwind's default spacing scale:

| Token   | Value | Common usage             |
| ------- | ----- | ------------------------ |
| `p-1`   | 4px   | Icon button padding      |
| `p-2`   | 8px   | Toolbar button padding   |
| `p-3`   | 12px  | Sidebar item padding     |
| `p-4`   | 16px  | Section padding          |
| `p-5`   | 20px  | Message body padding     |
| `p-6`   | 24px  | Thread header padding    |
| `gap-1` | 4px   | Tight element spacing    |
| `gap-2` | 8px   | Standard element spacing |
| `gap-3` | 12px  | Content group spacing    |
| `gap-4` | 16px  | Section spacing          |

## Border Radius

| Token           | Value  | Usage                                       |
| --------------- | ------ | ------------------------------------------- |
| `--radius-xs`   | 4px    | Label badges, checkboxes                    |
| `--radius-sm`   | 8px    | Small cards                                 |
| `--radius-md`   | 12px   | Message cards, modals                       |
| `--radius-lg`   | 16px   | Compose button                              |
| `--radius-xl`   | 24px   | Large cards                                 |
| `--radius-full` | 9999px | Avatars, pills, search bar, toolbar buttons |

## Shadows

Shadows use pure black with varying opacity. In dark mode, shadows are stronger since the background is already dark.

| Token         | Usage                                  |
| ------------- | -------------------------------------- |
| `--shadow-xs` | Subtle lift on hover                   |
| `--shadow-sm` | Compose button resting state           |
| `--shadow-md` | Search bar focus, compose button hover |
| `--shadow-lg` | Dropdowns, popovers                    |
| `--shadow-xl` | Modals, compose window                 |

## Z-Index Scale

| Token          | Value | Usage                    |
| -------------- | ----- | ------------------------ |
| `--z-base`     | 0     | Default                  |
| `--z-sidebar`  | 20    | Sidebar overlay (mobile) |
| `--z-topbar`   | 30    | Fixed topbar             |
| `--z-dropdown` | 40    | Dropdown menus           |
| `--z-compose`  | 45    | Compose window           |
| `--z-modal`    | 50    | Modal dialogs            |
| `--z-toast`    | 60    | Toast notifications      |
| `--z-tooltip`  | 70    | Tooltips                 |

## Animation Principles

1. **Duration**: Fast interactions (hover, toggle) use `100ms`. Standard transitions use `150ms`. Complex animations use `250ms`.
2. **Easing**: `ease` for most transitions. `ease-in-out` for slower, more deliberate animations.
3. **Theme transitions**: When switching themes, a `data-theme-transitioning` attribute triggers `200ms` transitions on background-color, color, border-color, and box-shadow across all elements.
4. **Enter/exit**: Components entering the DOM fade + scale in. Exiting components fade out. No jarring pops.
5. **Layout shifts**: Avoided entirely. Skeletons match final content dimensions.

## Accessibility

- **WCAG 2.1 AA minimum** for all text contrast ratios
- **Focus visible**: 2px solid accent outline with 2px offset on all interactive elements
- **Keyboard navigation**: All actions reachable via keyboard. Tab order follows visual order.
- **Screen reader support**: Semantic HTML (`<nav>`, `<main>`, `<header>`, `<button>`, `<a>`). ARIA labels on icon-only buttons.
- **Reduced motion**: Respect `prefers-reduced-motion` (planned — disable animations when set)
- **Color independence**: No information conveyed by color alone. Stars have shape, errors have icons.

## Theme Switching

Three modes: **System**, **Light**, **Dark**.

- Stored in `localStorage` as `theme` key
- Applied via `data-theme` attribute on `<html>`
- Inline script in `<head>` prevents flash of wrong theme (FOUC)
- System mode listens to `prefers-color-scheme` media query changes
- Toggle cycles: System → Light → Dark → System
- Icons: Monitor (system), Sun (light), Moon (dark)
