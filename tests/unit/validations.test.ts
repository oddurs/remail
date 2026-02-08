import { describe, it, expect } from "vitest";
import {
  uuidSchema,
  emailSchema,
  toggleStarSchema,
  toggleImportantSchema,
  markReadStatusSchema,
  archiveEmailsSchema,
  trashEmailsSchema,
  snoozeEmailSchema,
  sendEmailSchema,
  saveDraftSchema,
  searchQuerySchema,
  createLabelSchema,
  updateLabelSchema,
  deleteLabelSchema,
  assignLabelsSchema,
} from "@/lib/validations";
import { VALID_UUID } from "../fixtures/data";

/* ─── Primitives ─────────────────────────────────────────────────────────────── */

describe("uuidSchema", () => {
  it("accepts valid UUID v4", () => {
    expect(() => uuidSchema.parse(VALID_UUID)).not.toThrow();
  });

  it("rejects empty string", () => {
    expect(() => uuidSchema.parse("")).toThrow();
  });

  it("rejects non-UUID string", () => {
    expect(() => uuidSchema.parse("not-a-uuid")).toThrow();
  });

  it("rejects number", () => {
    expect(() => uuidSchema.parse(123)).toThrow();
  });
});

describe("emailSchema", () => {
  it("accepts valid email", () => {
    expect(() => emailSchema.parse("user@example.com")).not.toThrow();
  });

  it("rejects invalid email", () => {
    expect(() => emailSchema.parse("notanemail")).toThrow();
  });

  it("rejects empty string", () => {
    expect(() => emailSchema.parse("")).toThrow();
  });
});

/* ─── Email Actions ──────────────────────────────────────────────────────────── */

describe("toggleStarSchema", () => {
  it("accepts valid input", () => {
    expect(() =>
      toggleStarSchema.parse({ emailId: VALID_UUID, starred: true }),
    ).not.toThrow();
  });

  it("rejects missing starred", () => {
    expect(() =>
      toggleStarSchema.parse({ emailId: VALID_UUID }),
    ).toThrow();
  });

  it("rejects invalid UUID", () => {
    expect(() =>
      toggleStarSchema.parse({ emailId: "bad", starred: true }),
    ).toThrow();
  });
});

describe("toggleImportantSchema", () => {
  it("accepts valid input", () => {
    expect(() =>
      toggleImportantSchema.parse({ emailId: VALID_UUID, important: false }),
    ).not.toThrow();
  });
});

describe("markReadStatusSchema", () => {
  it("accepts valid batch", () => {
    expect(() =>
      markReadStatusSchema.parse({ emailIds: [VALID_UUID], isRead: true }),
    ).not.toThrow();
  });

  it("rejects empty array", () => {
    expect(() =>
      markReadStatusSchema.parse({ emailIds: [], isRead: true }),
    ).toThrow();
  });

  it("rejects non-UUID in array", () => {
    expect(() =>
      markReadStatusSchema.parse({ emailIds: ["bad"], isRead: false }),
    ).toThrow();
  });
});

describe("archiveEmailsSchema", () => {
  it("accepts valid input", () => {
    expect(() =>
      archiveEmailsSchema.parse({ emailIds: [VALID_UUID] }),
    ).not.toThrow();
  });

  it("rejects empty array", () => {
    expect(() => archiveEmailsSchema.parse({ emailIds: [] })).toThrow();
  });
});

describe("trashEmailsSchema", () => {
  it("accepts valid input", () => {
    expect(() =>
      trashEmailsSchema.parse({ emailIds: [VALID_UUID] }),
    ).not.toThrow();
  });
});

describe("snoozeEmailSchema", () => {
  it("accepts valid input", () => {
    expect(() =>
      snoozeEmailSchema.parse({
        emailId: VALID_UUID,
        snoozeUntil: new Date().toISOString(),
      }),
    ).not.toThrow();
  });

  it("rejects invalid datetime", () => {
    expect(() =>
      snoozeEmailSchema.parse({
        emailId: VALID_UUID,
        snoozeUntil: "not-a-date",
      }),
    ).toThrow();
  });
});

describe("sendEmailSchema", () => {
  it("accepts full valid input", () => {
    expect(() =>
      sendEmailSchema.parse({
        to: ["user@example.com"],
        cc: ["cc@example.com"],
        bcc: [],
        subject: "Test",
        bodyHtml: "<p>Hello</p>",
      }),
    ).not.toThrow();
  });

  it("rejects missing to", () => {
    expect(() =>
      sendEmailSchema.parse({
        subject: "Test",
        bodyHtml: "<p>Hello</p>",
      }),
    ).toThrow();
  });

  it("rejects empty to array", () => {
    expect(() =>
      sendEmailSchema.parse({
        to: [],
        subject: "Test",
        bodyHtml: "<p>Hello</p>",
      }),
    ).toThrow();
  });

  it("rejects empty subject", () => {
    expect(() =>
      sendEmailSchema.parse({
        to: ["user@example.com"],
        subject: "",
        bodyHtml: "<p>Hello</p>",
      }),
    ).toThrow();
  });
});

describe("saveDraftSchema", () => {
  it("accepts minimal valid input", () => {
    expect(() =>
      saveDraftSchema.parse({
        subject: "",
        bodyHtml: "",
      }),
    ).not.toThrow();
  });

  it("accepts full input with optional fields", () => {
    expect(() =>
      saveDraftSchema.parse({
        to: ["user@example.com"],
        cc: [],
        bcc: [],
        subject: "Draft",
        bodyHtml: "<p>body</p>",
        draftId: VALID_UUID,
        threadId: VALID_UUID,
      }),
    ).not.toThrow();
  });

  it("rejects invalid optional email", () => {
    expect(() =>
      saveDraftSchema.parse({
        to: ["not-an-email"],
        subject: "",
        bodyHtml: "",
      }),
    ).toThrow();
  });
});

describe("searchQuerySchema", () => {
  it("accepts valid query", () => {
    expect(() => searchQuerySchema.parse({ query: "hello" })).not.toThrow();
  });

  it("rejects empty query", () => {
    expect(() => searchQuerySchema.parse({ query: "" })).toThrow();
  });

  it("rejects query over 500 chars", () => {
    expect(() =>
      searchQuerySchema.parse({ query: "a".repeat(501) }),
    ).toThrow();
  });
});

/* ─── Label Actions ──────────────────────────────────────────────────────────── */

describe("createLabelSchema", () => {
  it("accepts valid label", () => {
    expect(() =>
      createLabelSchema.parse({ name: "Work", color: "#ff0000" }),
    ).not.toThrow();
  });

  it("rejects empty name", () => {
    expect(() =>
      createLabelSchema.parse({ name: "", color: "#ff0000" }),
    ).toThrow();
  });

  it("rejects invalid hex color", () => {
    expect(() =>
      createLabelSchema.parse({ name: "Work", color: "red" }),
    ).toThrow();
  });

  it("rejects short hex color", () => {
    expect(() =>
      createLabelSchema.parse({ name: "Work", color: "#fff" }),
    ).toThrow();
  });
});

describe("updateLabelSchema", () => {
  it("accepts partial update", () => {
    expect(() =>
      updateLabelSchema.parse({ labelId: VALID_UUID, name: "New Name" }),
    ).not.toThrow();
  });

  it("rejects invalid labelId", () => {
    expect(() =>
      updateLabelSchema.parse({ labelId: "not-uuid", name: "X" }),
    ).toThrow();
  });
});

describe("deleteLabelSchema", () => {
  it("accepts valid UUID", () => {
    expect(() =>
      deleteLabelSchema.parse({ labelId: VALID_UUID }),
    ).not.toThrow();
  });

  it("rejects non-UUID", () => {
    expect(() =>
      deleteLabelSchema.parse({ labelId: "not-a-uuid" }),
    ).toThrow();
  });
});

describe("assignLabelsSchema", () => {
  it("accepts valid input", () => {
    expect(() =>
      assignLabelsSchema.parse({
        emailIds: [VALID_UUID],
        addLabelIds: [VALID_UUID],
        removeLabelIds: [],
      }),
    ).not.toThrow();
  });

  it("rejects empty emailIds", () => {
    expect(() =>
      assignLabelsSchema.parse({
        emailIds: [],
        addLabelIds: [],
        removeLabelIds: [],
      }),
    ).toThrow();
  });
});
