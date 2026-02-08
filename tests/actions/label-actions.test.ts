import { describe, it, expect, vi, beforeEach } from "vitest";
import { VALID_UUID } from "../fixtures/data";

const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockUpsert = vi.fn();
const mockEq = vi.fn();
const mockIn = vi.fn();
const mockOrder = vi.fn();
const mockLimit = vi.fn();
const mockSingle = vi.fn();

let defaultResult = { data: null, error: null };

function makeChain() {
  const chain: Record<string, unknown> = {
    from: mockFrom,
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    upsert: mockUpsert,
    eq: mockEq,
    in: mockIn,
    order: mockOrder,
    limit: mockLimit,
    single: mockSingle,
    then: (resolve: (v: unknown) => void) => resolve(defaultResult),
  };
  for (const fn of [mockFrom, mockSelect, mockInsert, mockUpdate, mockDelete, mockUpsert, mockEq, mockIn, mockOrder, mockLimit]) {
    fn.mockReturnValue(chain);
  }
  return chain;
}

vi.mock("@/lib/supabase/server", () => ({
  createServiceClient: () => {
    makeChain();
    return { from: mockFrom };
  },
}));

vi.mock("@/lib/session", () => ({
  requireSessionId: vi.fn(() => Promise.resolve("test-session-id")),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import {
  getLabels,
  createLabel,
  updateLabel,
  deleteLabel,
  assignLabels,
} from "@/lib/actions/labels";
import { revalidatePath } from "next/cache";

describe("getLabels", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    defaultResult = {
      data: [
        { id: "1", name: "Work", color: "#ff0000", type: "user", position: 0 },
      ],
      error: null,
    };
    makeChain();
  });

  it("returns user labels ordered by position", async () => {
    const result = await getLabels();
    expect(mockFrom).toHaveBeenCalledWith("gmail_labels");
    expect(mockEq).toHaveBeenCalledWith("type", "user");
    expect(mockOrder).toHaveBeenCalledWith("position");
    expect(result).toHaveLength(1);
  });
});

describe("createLabel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    defaultResult = { data: [{ position: 2 }], error: null };
    makeChain();
    mockSingle.mockResolvedValue({ data: { id: "new", name: "Work", color: "#ff0000" }, error: null });
  });

  it("validates color hex", async () => {
    await expect(createLabel("Work", "red")).rejects.toThrow();
  });

  it("validates non-empty name", async () => {
    await expect(createLabel("", "#ff0000")).rejects.toThrow();
  });
});

describe("updateLabel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    defaultResult = { data: null, error: null };
    makeChain();
  });

  it("calls update with partial fields", async () => {
    await updateLabel(VALID_UUID, { name: "New Name" });
    expect(mockUpdate).toHaveBeenCalledWith({ name: "New Name" });
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("validates labelId UUID", async () => {
    await expect(updateLabel("not-uuid", { name: "X" })).rejects.toThrow();
  });
});

describe("deleteLabel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    defaultResult = { data: null, error: null };
    makeChain();
    // single() must return a valid label for the ownership check
    mockSingle.mockResolvedValue({ data: { id: VALID_UUID }, error: null });
  });

  it("cascades email_labels delete first, then label", async () => {
    await deleteLabel(VALID_UUID);
    // First: verify label ownership check
    expect(mockFrom).toHaveBeenCalledWith("gmail_labels");
    // Then: delete email_labels
    expect(mockFrom).toHaveBeenCalledWith("gmail_email_labels");
    expect(mockDelete).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("validates UUID", async () => {
    await expect(deleteLabel("not-uuid")).rejects.toThrow();
  });

  it("throws when label not found", async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: null });
    await expect(deleteLabel(VALID_UUID)).rejects.toThrow("Label not found");
  });
});

describe("assignLabels", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Return owned labels matching the count
    defaultResult = { data: [{ id: VALID_UUID }], error: null };
    makeChain();
  });

  it("handles both add and remove simultaneously", async () => {
    const labelAdd = VALID_UUID;
    const labelRemove = "b1ffcd00-ad1c-4ef9-bb7e-7ccacea91b22";
    // Mock the ownership check to return both labels as owned
    defaultResult = { data: [{ id: labelAdd }, { id: labelRemove }], error: null };
    makeChain();

    await assignLabels([VALID_UUID], [labelAdd], [labelRemove]);
    // Should call delete for remove
    expect(mockDelete).toHaveBeenCalled();
    // Should call upsert for add
    expect(mockUpsert).toHaveBeenCalled();
  });

  it("validates emailIds non-empty", async () => {
    await expect(assignLabels([], [VALID_UUID], [])).rejects.toThrow();
  });

  it("skips ownership check when no label IDs", async () => {
    await assignLabels([VALID_UUID], [], []);
    // Should call revalidatePath even with empty labels
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });
});
