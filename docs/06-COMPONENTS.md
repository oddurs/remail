# Components

Component architecture follows these rules:

1. **Server Components by default** — only add `'use client'` when needed
2. **Props are serializable** — no functions passed from server to client
3. **Composition over configuration** — prefer children and slots over complex prop APIs
4. **Design tokens only** — never hardcode colors, use `var(--token)` exclusively

## Directory Structure

```
src/components/
├── ui/                    # Generic, reusable primitives
│   ├── button.tsx
│   ├── icon-button.tsx
│   ├── input.tsx
│   ├── badge.tsx
│   ├── avatar.tsx
│   ├── tooltip.tsx
│   ├── dropdown.tsx
│   ├── modal.tsx
│   ├── drawer.tsx
│   ├── toast.tsx
│   ├── skeleton.tsx
│   └── empty-state.tsx
├── mail/                  # Email-specific components
│   ├── email-row.tsx      # ✅ Built
│   ├── email-list.tsx     # List wrapper with selection state
│   ├── thread-message.tsx # Single message in thread view
│   ├── compose-window.tsx # Floating compose editor
│   ├── attachment-chip.tsx
│   ├── label-badge.tsx
│   └── sender-avatar.tsx
├── layout/                # App shell components
│   ├── topbar.tsx
│   ├── sidebar.tsx
│   ├── search-bar.tsx
│   └── action-bar.tsx
├── showcase/              # Portfolio overlay
│   ├── about-panel.tsx
│   └── about-trigger.tsx
└── theme-toggle.tsx       # ✅ Built
```

---

## Primitive Components

### Button

```tsx
interface ButtonProps {
  variant: "primary" | "secondary" | "ghost" | "danger";
  size: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

| Variant     | Style                                    |
| ----------- | ---------------------------------------- |
| `primary`   | Solid accent background, inverse text    |
| `secondary` | Border, transparent background           |
| `ghost`     | No border, transparent, hover background |
| `danger`    | Error color background                   |

### IconButton

```tsx
interface IconButtonProps {
  icon: React.ReactNode;
  label: string; // Required for accessibility (aria-label)
  size: "sm" | "md";
  active?: boolean;
  onClick?: () => void;
}
```

Always renders as a circle (`rounded-full`) with hover background.

### Badge

```tsx
interface BadgeProps {
  label: string;
  color?: string; // Hex color for custom label badges
  variant: "default" | "outline" | "colored";
}
```

### Avatar

```tsx
interface AvatarProps {
  name: string;
  imageUrl?: string;
  size: "sm" | "md" | "lg"; // 24px, 32px, 40px
}
```

Renders image if `imageUrl` provided, otherwise shows first letter of `name` on a colored background.

### Tooltip

```tsx
interface TooltipProps {
  content: string;
  side?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
}
```

Appears on hover after 500ms delay. Uses `--z-tooltip`.

### Modal

```tsx
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}
```

Centered overlay with backdrop. Traps focus. Closes on Escape and backdrop click.

### Drawer

```tsx
interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side: "left" | "right";
  children: React.ReactNode;
}
```

Slides in from specified side. Used for the About panel and mobile sidebar.

### Toast

```tsx
interface ToastProps {
  message: string;
  action?: { label: string; onClick: () => void }; // e.g., "Undo"
  duration?: number; // ms, default 5000
}
```

Appears at bottom-center. Auto-dismisses. Supports undo action.

### Skeleton

```tsx
interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: boolean;
}
```

Animated placeholder matching the shape of the content it replaces.

### EmptyState

```tsx
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}
```

Centered message for empty views (no emails, no results, etc.).

---

## Email Components

### EmailRow (Built)

Client Component. Renders a single email in the inbox list.

```tsx
interface EmailRowProps {
  threadId: string;
  sender: string;
  subject: string;
  snippet: string;
  time: string;
  unread?: boolean;
  starred?: boolean;
  important?: boolean;
  isDraft?: boolean;
  labels?: Array<{ name: string; color: string }>;
}
```

Location: `src/components/mail/email-row.tsx`

### ComposeWindow (Planned)

Client Component. Floating email editor.

```tsx
interface ComposeWindowProps {
  mode: "new" | "reply" | "forward";
  threadId?: string; // For reply/forward
  initialTo?: string; // Pre-filled recipient
  initialSubject?: string; // Pre-filled subject
  onClose: () => void;
  onSend: (data: ComposeData) => void;
}
```

States: minimized (title bar only), normal (floating bottom-right), maximized (full screen).

### ThreadMessage (Planned)

Extracted from the current inline rendering in `thread/[id]/page.tsx`.

```tsx
interface ThreadMessageProps {
  id: string;
  senderName: string;
  senderEmail: string;
  recipients: Array<{ name: string; type: "to" | "cc" | "bcc" }>;
  bodyHtml: string;
  sentAt: string;
  isStarred: boolean;
  isLast: boolean;
  isDraft: boolean;
}
```

### SenderAvatar

```tsx
interface SenderAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: "sm" | "md";
}
```

Circle with first letter or image. Background color derived from name hash for consistency.

### LabelBadge

```tsx
interface LabelBadgeProps {
  name: string;
  color: string;
  removable?: boolean;
  onRemove?: () => void;
}
```

Small colored chip. Background is the color at 12% opacity, text is the full color.

### AttachmentChip

```tsx
interface AttachmentChipProps {
  filename: string;
  contentType: string;
  sizeBytes: number;
  onClick?: () => void;
}
```

Shows file icon (based on MIME type), filename, and formatted size.

---

## Layout Components

### TopBar

Currently inline in `(mail)/layout.tsx`. Will be extracted to:

```tsx
interface TopBarProps {
  children?: React.ReactNode; // Right-side slot for theme toggle, settings, avatar
}
```

Contains: hamburger menu, logo, search bar, right actions.

### SearchBar

Currently inline in the topbar. Will be extracted as a Client Component for focus state and keyboard shortcut (`/`).

```tsx
interface SearchBarProps {
  defaultValue?: string;
}
```

### ActionBar

Toolbar that appears above the email list or thread. Context-dependent buttons.

```tsx
interface ActionBarProps {
  context: "list" | "thread" | "bulk";
  selectedCount?: number;
}
```

---

## Showcase Components

### AboutPanel

Drawer that slides in from the right. Contains the case study content.

```tsx
interface AboutPanelProps {
  open: boolean;
  onClose: () => void;
}
```

### AboutTrigger

Floating button in the bottom-right corner.

```tsx
// No props — self-contained with internal state
```

Renders a subtle "About this project" pill that opens the AboutPanel.
