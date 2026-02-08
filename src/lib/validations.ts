import { z } from "zod";

/* ─── Primitives ────────────────────────────────────────────────────────────── */

export const uuidSchema = z.string().uuid();
export const emailSchema = z.string().email();

/* ─── Email Actions ─────────────────────────────────────────────────────────── */

export const toggleStarSchema = z.object({
  emailId: uuidSchema,
  starred: z.boolean(),
});

export const toggleImportantSchema = z.object({
  emailId: uuidSchema,
  important: z.boolean(),
});

export const markReadStatusSchema = z.object({
  emailIds: z.array(uuidSchema).min(1),
  isRead: z.boolean(),
});

export const archiveEmailsSchema = z.object({
  emailIds: z.array(uuidSchema).min(1),
});

export const trashEmailsSchema = z.object({
  emailIds: z.array(uuidSchema).min(1),
});

export const snoozeEmailSchema = z.object({
  emailId: uuidSchema,
  snoozeUntil: z.string().datetime(),
});

export const sendEmailSchema = z.object({
  to: z.array(emailSchema).min(1),
  cc: z.array(emailSchema).optional(),
  bcc: z.array(emailSchema).optional(),
  subject: z.string().min(1),
  bodyHtml: z.string(),
  threadId: uuidSchema.optional(),
  inReplyToEmailId: uuidSchema.optional(),
});

export const saveDraftSchema = z.object({
  to: z.array(emailSchema).optional(),
  cc: z.array(emailSchema).optional(),
  bcc: z.array(emailSchema).optional(),
  subject: z.string(),
  bodyHtml: z.string(),
  draftId: uuidSchema.optional(),
  threadId: uuidSchema.optional(),
});

export const searchQuerySchema = z.object({
  query: z.string().min(1).max(500),
});

export const singleEmailIdSchema = z.object({
  emailId: uuidSchema,
});

export const singleThreadIdSchema = z.object({
  threadId: uuidSchema,
});

export const markSpamSchema = z.object({
  emailIds: z.array(uuidSchema).min(1),
  isSpam: z.boolean(),
});

export const threadReadStatusSchema = z.object({
  threadId: uuidSchema,
  isRead: z.boolean(),
});

/* ─── Label Actions ─────────────────────────────────────────────────────────── */

export const createLabelSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const updateLabelSchema = z.object({
  labelId: uuidSchema,
  name: z.string().min(1).max(100).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export const deleteLabelSchema = z.object({
  labelId: uuidSchema,
});

export const assignLabelsSchema = z.object({
  emailIds: z.array(uuidSchema).min(1),
  addLabelIds: z.array(uuidSchema),
  removeLabelIds: z.array(uuidSchema),
});
