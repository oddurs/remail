import { vi } from "vitest";

/**
 * Creates a mock for `revalidatePath` that tracks calls.
 */
export function createMockRevalidatePath() {
  return vi.fn();
}

/**
 * Creates a mock for `cookies()` with configurable cookie values.
 */
export function createMockCookies(values: Record<string, string> = {}) {
  const store = new Map(Object.entries(values));
  return vi.fn(() =>
    Promise.resolve({
      get: vi.fn((name: string) => {
        const value = store.get(name);
        return value ? { value } : undefined;
      }),
      set: vi.fn((name: string, value: string) => {
        store.set(name, value);
      }),
      delete: vi.fn((name: string) => {
        store.delete(name);
      }),
    }),
  );
}

/**
 * Creates a mock `useRouter` with tracked push/replace/back.
 */
export function createMockRouter() {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
    forward: vi.fn(),
  };
}

/**
 * Creates a mock `useSearchParams` with initial values.
 */
export function createMockSearchParams(
  params: Record<string, string> = {},
) {
  return new URLSearchParams(params);
}
