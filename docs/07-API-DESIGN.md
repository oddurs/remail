# API Design

All data operations use **Server Actions** (Next.js `'use server'` functions). No API routes. No REST endpoints. The client calls server functions directly.

## Server Actions

### Session

Located in `src/lib/actions/session.ts`.

```typescript
// Ensure session exists, seed if new
ensureSession(): Promise<{ sessionId: string; isNew: boolean }>

// Get session preferences
getSessionPreferences(): Promise<SessionPreferences>

// Update session preferences
updateSessionPreferences(prefs: Partial<SessionPreferences>): Promise<void>
```

### Email Actions (Planned)

Located in `src/lib/actions/emails.ts`.

```typescript
// Toggle star on an email
toggleStar(emailId: string): Promise<void>

// Toggle read/unread
toggleRead(emailId: string): Promise<void>

// Toggle important marker
toggleImportant(emailId: string): Promise<void>

// Archive an email (remove from inbox)
archiveEmail(emailId: string): Promise<void>

// Move to trash
trashEmail(emailId: string): Promise<void>

// Move to spam
spamEmail(emailId: string): Promise<void>

// Snooze until a specific time
snoozeEmail(emailId: string, until: Date): Promise<void>

// Unsnooze (return to inbox immediately)
unsnoozeEmail(emailId: string): Promise<void>

// Apply a label to an email
addLabel(emailId: string, labelId: string): Promise<void>

// Remove a label from an email
removeLabel(emailId: string, labelId: string): Promise<void>

// Permanently delete (from trash)
permanentlyDelete(emailId: string): Promise<void>

// Bulk operations
bulkArchive(emailIds: string[]): Promise<void>
bulkTrash(emailIds: string[]): Promise<void>
bulkMarkRead(emailIds: string[]): Promise<void>
bulkMarkUnread(emailIds: string[]): Promise<void>
bulkAddLabel(emailIds: string[], labelId: string): Promise<void>
```

### Compose Actions (Planned)

Located in `src/lib/actions/compose.ts`.

```typescript
// Send a new email
sendEmail(data: {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  bodyHtml: string;
  threadId?: string;      // For replies
  inReplyToId?: string;   // For threading
}): Promise<{ emailId: string }>

// Save draft
saveDraft(data: {
  to?: string[];
  subject?: string;
  bodyHtml?: string;
  threadId?: string;
  draftId?: string;       // Update existing draft
}): Promise<{ draftId: string }>

// Discard draft
discardDraft(draftId: string): Promise<void>
```

### Label Actions (Planned)

Located in `src/lib/actions/labels.ts`.

```typescript
// Create a new user label
createLabel(data: {
  name: string;
  color?: string;
  parentId?: string;
}): Promise<{ labelId: string }>

// Update a label
updateLabel(labelId: string, data: Partial<{
  name: string;
  color: string;
  showInList: boolean;
  showInMessage: boolean;
}>): Promise<void>

// Delete a label (removes from all emails too)
deleteLabel(labelId: string): Promise<void>

// Reorder labels
reorderLabels(labelIds: string[]): Promise<void>
```

### Search Actions

Located in `src/lib/actions/search.ts`.

```typescript
// Full-text search
searchEmails(query: string, filters?: {
  from?: string;
  to?: string;
  subject?: string;
  hasAttachment?: boolean;
  isUnread?: boolean;
  isStarred?: boolean;
  label?: string;
  after?: Date;
  before?: Date;
}): Promise<Email[]>
```

## Reusable Query Functions

Located in `src/lib/queries/emails.ts`. Used by Server Components to fetch data.

```typescript
// Get inbox emails for a category
getInboxEmails(sessionId: string, category: string): Promise<Email[]>

// Get category unread counts
getCategoryCounts(sessionId: string): Promise<Record<string, number>>

// Get a thread with all messages
getThread(sessionId: string, threadId: string): Promise<Thread | null>

// Get emails by view (starred, sent, drafts, etc.)
getEmailsByView(sessionId: string, view: string): Promise<Email[]>

// Get emails by label
getEmailsByLabel(sessionId: string, labelId: string): Promise<Email[]>
```

## Mock Data Layer

### Seed Data

Located in `src/lib/seed/`.

- `contacts.ts` — 15+ realistic contacts with names, emails, and roles
- `emails.ts` — 30+ email threads across all categories with realistic HTML bodies
- `generator.ts` — Orchestrator that creates contacts, threads, emails, labels, and recipients for a new session

### Seed Flow

```
ensureSession()
  → session doesn't exist
  → create session row
  → seedSession(sessionId)
    → create contacts (including "self")
    → create labels (Work, Personal, Travel, Finance, etc.)
    → create threads
    → create emails with HTML bodies
    → create recipients (to, cc)
    → create email-label associations
    → mark session as seeded
```

## Optimistic Updates (Planned)

For actions like star, archive, and delete:

1. **Client**: Update UI immediately (remove from list, toggle icon)
2. **Server**: Execute the server action
3. **On error**: Revert the UI change, show error toast
4. **On success**: Revalidate the page data (Next.js `revalidatePath`)

Pattern using React's `useOptimistic`:

```typescript
const [optimisticEmails, addOptimistic] = useOptimistic(
  emails,
  (state, { id, action }) => {
    switch (action) {
      case "archive":
        return state.filter((e) => e.id !== id);
      case "star":
        return state.map((e) =>
          e.id === id ? { ...e, starred: !e.starred } : e,
        );
    }
  },
);
```

## Error Handling

All server actions follow this pattern:

1. Validate input with Zod
2. Get session ID from cookie
3. Execute Supabase query
4. If error, throw with descriptive message
5. Client catches and shows toast

```typescript
"use server";

import { z } from "zod";

const toggleStarSchema = z.object({
  emailId: z.string().uuid(),
});

export async function toggleStar(emailId: string) {
  const { emailId: validId } = toggleStarSchema.parse({ emailId });
  const sessionId = await requireSessionId();
  const supabase = createServiceClient();

  const { data: email } = await supabase
    .from("gmail_emails")
    .select("is_starred")
    .eq("id", validId)
    .eq("session_id", sessionId)
    .single();

  if (!email) throw new Error("Email not found");

  const { error } = await supabase
    .from("gmail_emails")
    .update({ is_starred: !email.is_starred })
    .eq("id", validId);

  if (error) throw new Error(`Failed to toggle star: ${error.message}`);

  revalidatePath("/");
}
```
