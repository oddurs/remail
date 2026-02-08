import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();

function setupChain(result: { data: unknown; error: unknown }) {
  const chain = {
    from: mockFrom,
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    eq: mockEq,
    single: mockSingle,
    then: (resolve: (v: unknown) => void) => resolve(result),
  };
  for (const fn of [mockFrom, mockSelect, mockInsert, mockUpdate, mockEq]) {
    fn.mockReturnValue(chain);
  }
  mockSingle.mockResolvedValue(result);
  return chain;
}

vi.mock("@/lib/supabase/server", () => ({
  createServiceClient: () => ({
    from: mockFrom,
  }),
}));

vi.mock("@/lib/session", () => ({
  requireSessionId: vi.fn(() => Promise.resolve("test-session-id")),
}));

vi.mock("@/lib/seed/generator", () => ({
  seedSession: vi.fn(() => Promise.resolve()),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import {
  ensureSession,
  getSessionPreferences,
  updateSessionPreferences,
} from "@/lib/actions/session";

describe("ensureSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns existing session when found and seeded", async () => {
    setupChain({ data: { id: "test-session-id", is_seeded: true }, error: null });
    const result = await ensureSession();
    expect(result.isNew).toBe(false);
    expect(result.sessionId).toBe("test-session-id");
  });

  it("creates and seeds new session when not found", async () => {
    // First call: check existing → not found
    mockSingle.mockResolvedValueOnce({ data: null, error: { code: "PGRST116", message: "not found" } });
    // Second call: insert → success
    setupChain({ data: null, error: null });
    const result = await ensureSession();
    expect(result.isNew).toBe(true);
    expect(mockInsert).toHaveBeenCalled();
  });
});

describe("getSessionPreferences", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChain({
      data: {
        theme_mode: "system",
        accent_color: "#1a73e8",
        display_density: "default",
        inbox_type: "default",
        page_size: 50,
        undo_send_sec: 5,
        conversation_view: true,
        hover_actions: true,
        keyboard_shortcuts: true,
      },
      error: null,
    });
  });

  it("returns preferences object", async () => {
    const prefs = await getSessionPreferences();
    expect(prefs).toHaveProperty("theme_mode", "system");
    expect(prefs).toHaveProperty("page_size", 50);
  });

  it("throws on error", async () => {
    setupChain({ data: null, error: { message: "db error" } });
    // Need mockSingle to return the error
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: "db error" } });
    await expect(getSessionPreferences()).rejects.toThrow("Failed to get session");
  });
});

describe("updateSessionPreferences", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChain({ data: null, error: null });
  });

  it("calls update with partial preferences", async () => {
    await updateSessionPreferences({ theme_mode: "dark" });
    expect(mockUpdate).toHaveBeenCalledWith({ theme_mode: "dark" });
    expect(mockFrom).toHaveBeenCalledWith("gmail_sessions");
  });

  it("throws on error", async () => {
    setupChain({ data: null, error: { message: "update failed" } });
    await expect(
      updateSessionPreferences({ page_size: 100 }),
    ).rejects.toThrow("Failed to update session");
  });
});
