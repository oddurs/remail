import type { LabelTemplate } from "../types";

export const SYSTEM_LABELS: LabelTemplate[] = [
  { name: "INBOX", type: "system", position: 0 },
  { name: "STARRED", type: "system", position: 1 },
  { name: "SNOOZED", type: "system", position: 2 },
  { name: "SENT", type: "system", position: 3 },
  { name: "DRAFTS", type: "system", position: 4 },
  { name: "ALL_MAIL", type: "system", position: 5 },
  { name: "SPAM", type: "system", position: 6 },
  { name: "TRASH", type: "system", position: 7 },
  { name: "IMPORTANT", type: "system", position: 8 },
];

export const USER_LABELS: LabelTemplate[] = [
  { name: "Work", type: "user", color: "#4285f4", position: 0 },
  { name: "Personal", type: "user", color: "#0d9488", position: 1 },
  { name: "Finance", type: "user", color: "#f59e0b", position: 2 },
  { name: "Travel", type: "user", color: "#8b5cf6", position: 3 },
  { name: "Receipts", type: "user", color: "#f43f5e", position: 4 },
];

export const ALL_LABELS: LabelTemplate[] = [...SYSTEM_LABELS, ...USER_LABELS];
