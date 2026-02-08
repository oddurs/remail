/**
 * Template types for the seed toolchain.
 * All cross-references use string slugs for readability and safety.
 */

export type Category = "primary" | "social" | "promotions" | "updates" | "forums";

export interface ContactTemplate {
  /** Unique slug, e.g. "sarah-chen" */
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  kind: "person" | "service";
  defaultCategory: Category;
  /** Writing style notes for maintainability */
  voice: string;
}

export interface AttachmentTemplate {
  filename: string;
  contentType: string;
  sizeBytes: number;
  /** Placeholder path — no real file stored */
  storagePath: string;
}

export interface MessageTemplate {
  /** Contact slug or "self" */
  from: string;
  bodyHtml: string;
  bodyText: string;
  /** Hours ago relative to seed time */
  hoursAgo: number;
  isRead: boolean;
  attachments?: AttachmentTemplate[];
}

export interface ThreadFlags {
  isStarred?: boolean;
  isImportant?: boolean;
  isDraft?: boolean;
  isSpam?: boolean;
  isTrash?: boolean;
  isArchived?: boolean;
  /** If set, the last email gets snooze_until = now + snoozeHours */
  snoozeHours?: number;
}

export interface ThreadTemplate {
  /** Unique slug, e.g. "auth-code-review" */
  id: string;
  subject: string;
  category: Category;
  /** Primary contact slug */
  contactId: string;
  ccContactIds?: string[];
  messages: MessageTemplate[];
  flags?: ThreadFlags;
  /** User label names (resolved at write time) */
  labels?: string[];
}

export interface LabelTemplate {
  name: string;
  type: "system" | "user";
  color?: string;
  position: number;
}

export interface SignatureTemplate {
  name: string;
  bodyHtml: string;
  isDefault: boolean;
}

export interface SeedConfig {
  contacts: ContactTemplate[];
  threads: ThreadTemplate[];
  labels: LabelTemplate[];
  signatures: SignatureTemplate[];
}
