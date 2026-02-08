import { describe, it, expect, vi, beforeEach } from "vitest";
import { VALID_UUID, VALID_UUID_2 } from "../fixtures/data";

// We need to mock supabase and session before importing actions
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockUpsert = vi.fn();
const mockEq = vi.fn();
const mockIn = vi.fn();
const mockNot = vi.fn();
const mockOr = vi.fn();
const mockOrder = vi.fn();
const mockLimit = vi.fn();
const mockSingle = vi.fn();

function setupChain(result: { data: unknown; error: unknown; count?: number }) {
  const chain = {
    from: mockFrom,
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    upsert: mockUpsert,
    eq: mockEq,
    in: mockIn,
    not: mockNot,
    or: mockOr,
    order: mockOrder,
    limit: mockLimit,
    single: mockSingle,
    then: (resolve: (v: unknown) => void) => resolve(result),
  };
  for (const fn of [mockFrom, mockSelect, mockInsert, mockUpdate, mockDelete, mockUpsert, mockEq, mockIn, mockNot, mockOr, mockOrder, mockLimit]) {
    fn.mockReturnValue(chain);
  }
  mockSingle.mockResolvedValue(result);
  return chain;
}

vi.mock("@/lib/supabase/server", () => ({
  createServiceClient: () => {
    const chain = {
      from: mockFrom,
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
      upsert: mockUpsert,
      eq: mockEq,
      in: mockIn,
      not: mockNot,
      or: mockOr,
      order: mockOrder,
      limit: mockLimit,
      single: mockSingle,
    };
    return chain;
  },
}));

vi.mock("@/lib/session", () => ({
  requireSessionId: vi.fn(() => Promise.resolve("test-session-id")),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Now import actions
import {
  toggleStar,
  toggleImportant,
  markReadStatus,
  archiveEmails,
  unarchiveEmails,
  trashEmails,
  untrashEmails,
  markSpam,
  deleteEmails,
  archiveThread,
  trashThread,
  snoozeEmail,
  unsnoozeEmail,
  searchContacts,
  discardDraft,
} from "@/lib/actions/email";
import { revalidatePath } from "next/cache";

describe("toggleStar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChain({ data: null, error: null });
  });

  it("calls update with correct params", async () => {
    await toggleStar(VALID_UUID, true);
    expect(mockFrom).toHaveBeenCalledWith("gmail_emails");
    expect(mockUpdate).toHaveBeenCalledWith({ is_starred: true });
    expect(mockEq).toHaveBeenCalledWith("id", VALID_UUID);
    expect(mockEq).toHaveBeenCalledWith("session_id", "test-session-id");
  });

  it("calls revalidatePath after success", async () => {
    await toggleStar(VALID_UUID, false);
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("validates input via Zod and throws on invalid UUID", async () => {
    await expect(toggleStar("bad-uuid", true)).rejects.toThrow();
  });
});

describe("toggleImportant", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChain({ data: null, error: null });
  });

  it("calls update with is_important", async () => {
    await toggleImportant(VALID_UUID, true);
    expect(mockUpdate).toHaveBeenCalledWith({ is_important: true });
  });
});

describe("markReadStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChain({ data: null, error: null });
  });

  it("handles batch of IDs", async () => {
    await markReadStatus([VALID_UUID, VALID_UUID_2], true);
    expect(mockUpdate).toHaveBeenCalledWith({ is_read: true });
    expect(mockIn).toHaveBeenCalledWith("id", [VALID_UUID, VALID_UUID_2]);
  });

  it("validates min(1) constraint", async () => {
    await expect(markReadStatus([], true)).rejects.toThrow();
  });
});

describe("archiveEmails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChain({ data: null, error: null });
  });

  it("sets is_archived=true", async () => {
    await archiveEmails([VALID_UUID]);
    expect(mockUpdate).toHaveBeenCalledWith({ is_archived: true });
  });

  it("validates array", async () => {
    await expect(archiveEmails([])).rejects.toThrow();
  });
});

describe("unarchiveEmails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChain({ data: null, error: null });
  });

  it("sets is_archived=false", async () => {
    await unarchiveEmails([VALID_UUID]);
    expect(mockUpdate).toHaveBeenCalledWith({ is_archived: false });
  });
});

describe("trashEmails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChain({ data: null, error: null });
  });

  it("sets is_trash=true", async () => {
    await trashEmails([VALID_UUID]);
    expect(mockUpdate).toHaveBeenCalledWith({ is_trash: true });
  });
});

describe("untrashEmails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChain({ data: null, error: null });
  });

  it("sets is_trash=false", async () => {
    await untrashEmails([VALID_UUID]);
    expect(mockUpdate).toHaveBeenCalledWith({ is_trash: false });
  });
});

describe("markSpam", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChain({ data: null, error: null });
  });

  it("sets is_spam to value", async () => {
    await markSpam([VALID_UUID], true);
    expect(mockUpdate).toHaveBeenCalledWith({ is_spam: true });
  });
});

describe("deleteEmails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChain({ data: null, error: null });
  });

  it("calls delete not update", async () => {
    await deleteEmails([VALID_UUID]);
    expect(mockDelete).toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});

describe("archiveThread", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChain({ data: null, error: null });
  });

  it("filters by thread_id not email id", async () => {
    await archiveThread(VALID_UUID);
    expect(mockEq).toHaveBeenCalledWith("thread_id", VALID_UUID);
    expect(mockUpdate).toHaveBeenCalledWith({ is_archived: true });
  });
});

describe("trashThread", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChain({ data: null, error: null });
  });

  it("filters by thread_id", async () => {
    await trashThread(VALID_UUID);
    expect(mockEq).toHaveBeenCalledWith("thread_id", VALID_UUID);
    expect(mockUpdate).toHaveBeenCalledWith({ is_trash: true });
  });
});

describe("snoozeEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChain({ data: null, error: null });
  });

  it("sets snooze_until AND is_archived=true", async () => {
    const iso = new Date().toISOString();
    await snoozeEmail(VALID_UUID, iso);
    expect(mockUpdate).toHaveBeenCalledWith({
      snooze_until: iso,
      is_archived: true,
    });
  });
});

describe("unsnoozeEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChain({ data: null, error: null });
  });

  it("clears snooze_until AND sets is_archived=false", async () => {
    await unsnoozeEmail(VALID_UUID);
    expect(mockUpdate).toHaveBeenCalledWith({
      snooze_until: null,
      is_archived: false,
    });
  });
});

describe("discardDraft", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChain({ data: null, error: null });
  });

  it("deletes only drafts (eq is_draft=true)", async () => {
    await discardDraft(VALID_UUID);
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("is_draft", true);
  });
});

describe("searchContacts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChain({
      data: [
        { id: "1", name: "Alice", email: "alice@test.com", is_self: false },
      ],
      error: null,
    });
  });

  it("queries with ILIKE pattern", async () => {
    const result = await searchContacts("alice");
    expect(mockOr).toHaveBeenCalledWith(
      "name.ilike.%alice%,email.ilike.%alice%",
    );
    expect(mockEq).toHaveBeenCalledWith("is_self", false);
    expect(mockLimit).toHaveBeenCalledWith(10);
    expect(result).toHaveLength(1);
  });
});
