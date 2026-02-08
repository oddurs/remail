# Data Models

All data lives in Supabase (PostgreSQL). Types are auto-generated via `supabase gen types typescript` into `src/lib/supabase/types.ts`. This document describes the schema, relationships, and domain logic.

## Entity Relationship Diagram

```
gmail_sessions (1)
  ├── gmail_contacts (many)
  ├── gmail_labels (many)
  ├── gmail_threads (many)
  │     └── gmail_emails (many)
  │           ├── gmail_email_recipients (many) → gmail_contacts
  │           ├── gmail_email_labels (many) → gmail_labels
  │           └── gmail_attachments (many)
  ├── gmail_filters (many)
  ├── gmail_signatures (many)
  └── gmail_snooze_queue (many) → gmail_emails
```

## Tables

### `gmail_sessions`

The root entity. Every visitor gets one. Contains preferences.

| Column               | Type        | Default           | Description                             |
| -------------------- | ----------- | ----------------- | --------------------------------------- |
| `id`                 | uuid        | gen_random_uuid() | Primary key (stored in cookie)          |
| `created_at`         | timestamptz | now()             | Session creation time                   |
| `last_active_at`     | timestamptz | now()             | Last activity timestamp                 |
| `expires_at`         | timestamptz | now() + 7 days    | Auto-cleanup threshold                  |
| `is_seeded`          | boolean     | false             | Whether mock data has been generated    |
| `theme_mode`         | text        | 'system'          | 'system' \| 'light' \| 'dark'           |
| `accent_color`       | text        | 'zinc'            | Color palette name                      |
| `display_density`    | text        | 'default'         | 'default' \| 'comfortable' \| 'compact' |
| `inbox_type`         | text        | 'default'         | Inbox layout preference                 |
| `page_size`          | integer     | 50                | Emails per page                         |
| `undo_send_sec`      | integer     | 5                 | Undo send window in seconds             |
| `conversation_view`  | boolean     | true              | Group emails by thread                  |
| `hover_actions`      | boolean     | true              | Show action buttons on row hover        |
| `keyboard_shortcuts` | boolean     | true              | Enable keyboard shortcuts               |

### `gmail_contacts`

People who send or receive emails.

| Column       | Type        | Default           | Description                       |
| ------------ | ----------- | ----------------- | --------------------------------- |
| `id`         | uuid        | gen_random_uuid() | Primary key                       |
| `session_id` | uuid        |                   | FK → gmail_sessions               |
| `name`       | text        |                   | Display name                      |
| `email`      | text        |                   | Email address                     |
| `avatar_url` | text        | null              | Profile image URL                 |
| `is_self`    | boolean     | false             | Whether this is the session owner |
| `created_at` | timestamptz | now()             |                                   |

### `gmail_threads`

A conversation containing one or more emails.

| Column            | Type        | Default           | Description                        |
| ----------------- | ----------- | ----------------- | ---------------------------------- |
| `id`              | uuid        | gen_random_uuid() | Primary key                        |
| `session_id`      | uuid        |                   | FK → gmail_sessions                |
| `subject`         | text        |                   | Thread subject line                |
| `message_count`   | integer     | 1                 | Number of emails in thread         |
| `last_message_at` | timestamptz | now()             | Timestamp of most recent email     |
| `is_muted`        | boolean     | false             | Mute notifications for this thread |
| `created_at`      | timestamptz | now()             |                                    |

### `gmail_emails`

Individual email messages. The core entity.

| Column            | Type        | Default           | Description                                                       |
| ----------------- | ----------- | ----------------- | ----------------------------------------------------------------- |
| `id`              | uuid        | gen_random_uuid() | Primary key                                                       |
| `session_id`      | uuid        |                   | FK → gmail_sessions                                               |
| `thread_id`       | uuid        |                   | FK → gmail_threads                                                |
| `from_contact_id` | uuid        |                   | FK → gmail_contacts                                               |
| `subject`         | text        |                   | Email subject                                                     |
| `snippet`         | text        | ''                | Plain-text preview (first ~140 chars)                             |
| `body_html`       | text        | ''                | Full HTML body                                                    |
| `body_text`       | text        | ''                | Plain-text body (for search)                                      |
| `sent_at`         | timestamptz | now()             | When the email was sent                                           |
| `category`        | text        | 'primary'         | 'primary' \| 'social' \| 'promotions' \| 'updates' \| 'forums'    |
| `is_read`         | boolean     | false             | Read/unread state                                                 |
| `is_starred`      | boolean     | false             | Starred state                                                     |
| `is_important`    | boolean     | false             | Important marker                                                  |
| `is_draft`        | boolean     | false             | Draft state                                                       |
| `is_archived`     | boolean     | false             | Archived (hidden from inbox)                                      |
| `is_trash`        | boolean     | false             | In trash                                                          |
| `is_spam`         | boolean     | false             | Marked as spam                                                    |
| `snooze_until`    | timestamptz | null              | Snooze return time                                                |
| `fts`             | tsvector    | generated         | Full-text search vector (auto-generated from subject + body_text) |
| `created_at`      | timestamptz | now()             |                                                                   |

### `gmail_email_recipients`

Join table: which contacts received which emails.

| Column       | Type | Description           |
| ------------ | ---- | --------------------- |
| `id`         | uuid | Primary key           |
| `email_id`   | uuid | FK → gmail_emails     |
| `contact_id` | uuid | FK → gmail_contacts   |
| `type`       | text | 'to' \| 'cc' \| 'bcc' |

### `gmail_email_labels`

Join table: which labels are applied to which emails.

| Column     | Type | Description                      |
| ---------- | ---- | -------------------------------- |
| `email_id` | uuid | FK → gmail_emails (composite PK) |
| `label_id` | uuid | FK → gmail_labels (composite PK) |

### `gmail_labels`

User-created and system labels.

| Column            | Type        | Default           | Description                       |
| ----------------- | ----------- | ----------------- | --------------------------------- |
| `id`              | uuid        | gen_random_uuid() | Primary key                       |
| `session_id`      | uuid        |                   | FK → gmail_sessions               |
| `name`            | text        |                   | Label display name                |
| `color`           | text        | null              | Hex color for the label badge     |
| `type`            | text        | 'user'            | 'system' \| 'user'                |
| `parent_id`       | uuid        | null              | FK → gmail_labels (nested labels) |
| `position`        | integer     | 0                 | Sort order in sidebar             |
| `show_in_list`    | boolean     | true              | Show in sidebar                   |
| `show_in_message` | boolean     | true              | Show badge on emails              |
| `created_at`      | timestamptz | now()             |                                   |

### `gmail_attachments`

Files attached to emails.

| Column         | Type        | Description           |
| -------------- | ----------- | --------------------- |
| `id`           | uuid        | Primary key           |
| `email_id`     | uuid        | FK → gmail_emails     |
| `filename`     | text        | Original filename     |
| `content_type` | text        | MIME type             |
| `size_bytes`   | integer     | File size             |
| `storage_path` | text        | Supabase Storage path |
| `created_at`   | timestamptz |                       |

### `gmail_filters`

Automated rules for incoming email.

| Column       | Type        | Default           | Description                                       |
| ------------ | ----------- | ----------------- | ------------------------------------------------- |
| `id`         | uuid        | gen_random_uuid() | Primary key                                       |
| `session_id` | uuid        |                   | FK → gmail_sessions                               |
| `criteria`   | jsonb       | '{}'              | Match conditions (from, subject, has_words, etc.) |
| `actions`    | jsonb       | '{}'              | Actions to take (label, archive, star, etc.)      |
| `is_enabled` | boolean     | true              | Whether the filter is active                      |
| `created_at` | timestamptz | now()             |                                                   |

### `gmail_signatures`

Email signatures.

| Column       | Type        | Default           | Description                  |
| ------------ | ----------- | ----------------- | ---------------------------- |
| `id`         | uuid        | gen_random_uuid() | Primary key                  |
| `session_id` | uuid        |                   | FK → gmail_sessions          |
| `name`       | text        |                   | Signature name               |
| `body_html`  | text        | ''                | HTML content                 |
| `is_default` | boolean     | false             | Use by default on new emails |
| `created_at` | timestamptz | now()             |                              |

### `gmail_snooze_queue`

Tracks snoozed emails for re-surfacing.

| Column         | Type        | Description             |
| -------------- | ----------- | ----------------------- |
| `id`           | uuid        | Primary key             |
| `session_id`   | uuid        | FK → gmail_sessions     |
| `email_id`     | uuid        | FK → gmail_emails       |
| `snooze_until` | timestamptz | When to return to inbox |
| `created_at`   | timestamptz |                         |

## Row Level Security

All tables have RLS enabled. The policy pattern:

```sql
-- Sessions can only access their own data
CREATE POLICY "session_isolation" ON gmail_emails
  FOR ALL
  USING (session_id = current_setting('app.session_id')::uuid);
```

The service role client bypasses RLS for server-side operations.

## Full-Text Search

The `gmail_emails` table has a generated `fts` column:

```sql
ALTER TABLE gmail_emails
  ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(subject, '') || ' ' || coalesce(body_text, ''))
  ) STORED;

CREATE INDEX gmail_emails_fts_idx ON gmail_emails USING gin(fts);
```

Queried via: `supabase.from('gmail_emails').textSearch('fts', query)`
