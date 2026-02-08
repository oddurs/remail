import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock crypto.randomUUID for toast IDs etc.
if (typeof globalThis.crypto === "undefined") {
  Object.defineProperty(globalThis, "crypto", {
    value: { randomUUID: () => "00000000-0000-0000-0000-000000000000" },
  });
}

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(() =>
    Promise.resolve({
      get: vi.fn((name: string) =>
        name === "session_id"
          ? { value: "test-session-id-00000000" }
          : undefined,
      ),
      set: vi.fn(),
      delete: vi.fn(),
    }),
  ),
  headers: vi.fn(() =>
    Promise.resolve(new Map()),
  ),
}));

// Mock requestAnimationFrame for JSDOM
if (typeof globalThis.requestAnimationFrame === "undefined") {
  globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => {
    return setTimeout(() => cb(Date.now()), 0) as unknown as number;
  };
  globalThis.cancelAnimationFrame = (id: number) => clearTimeout(id);
}
