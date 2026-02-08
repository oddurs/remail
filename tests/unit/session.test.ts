import { describe, it, expect, vi, beforeEach } from "vitest";

describe("getSessionId", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it("returns cookie value when present", async () => {
    vi.doMock("next/headers", () => ({
      cookies: vi.fn(() =>
        Promise.resolve({
          get: vi.fn((name: string) =>
            name === "session_id"
              ? { value: "test-session-id-00000000" }
              : undefined,
          ),
        }),
      ),
    }));
    const { getSessionId } = await import("@/lib/session");
    const result = await getSessionId();
    expect(result).toBe("test-session-id-00000000");
  });

  it("returns null when no session cookie", async () => {
    vi.doMock("next/headers", () => ({
      cookies: vi.fn(() =>
        Promise.resolve({
          get: vi.fn(() => undefined),
        }),
      ),
    }));
    const { getSessionId } = await import("@/lib/session");
    const result = await getSessionId();
    expect(result).toBeNull();
  });
});

describe("requireSessionId", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it("returns value when session cookie present", async () => {
    vi.doMock("next/headers", () => ({
      cookies: vi.fn(() =>
        Promise.resolve({
          get: vi.fn((name: string) =>
            name === "session_id"
              ? { value: "test-session-id-00000000" }
              : undefined,
          ),
        }),
      ),
    }));
    const { requireSessionId } = await import("@/lib/session");
    const result = await requireSessionId();
    expect(result).toBe("test-session-id-00000000");
  });

  it("throws when no session cookie", async () => {
    vi.doMock("next/headers", () => ({
      cookies: vi.fn(() =>
        Promise.resolve({
          get: vi.fn(() => undefined),
        }),
      ),
    }));
    const { requireSessionId } = await import("@/lib/session");
    await expect(requireSessionId()).rejects.toThrow("No session found");
  });
});
