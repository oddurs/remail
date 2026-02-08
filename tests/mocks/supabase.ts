import { vi } from "vitest";

interface MockResult {
  data: unknown;
  error: null | { message: string };
  count?: number;
}

/**
 * Creates a chainable mock Supabase client that mimics the query builder pattern.
 * Configure return values with `.mockResult()` and `.mockError()`.
 */
export function createMockSupabase() {
  let currentResult: MockResult = { data: null, error: null };

  const chainable: Record<string, ReturnType<typeof vi.fn>> = {};

  const methods = [
    "from",
    "select",
    "insert",
    "update",
    "delete",
    "upsert",
    "eq",
    "neq",
    "in",
    "not",
    "is",
    "ilike",
    "or",
    "textSearch",
    "order",
    "limit",
    "single",
    "maybeSingle",
  ];

  const builder = {} as Record<string, ReturnType<typeof vi.fn>>;

  for (const method of methods) {
    builder[method] = vi.fn().mockImplementation((..._args: unknown[]) => {
      // Terminal methods return the result directly
      if (method === "single" || method === "maybeSingle") {
        return Promise.resolve(currentResult);
      }
      return builder;
    });
  }

  // Make non-terminal methods also thennable so `await supabase.from().select().eq()` works
  const originalFrom = builder.from;
  for (const method of methods) {
    if (method === "single" || method === "maybeSingle") continue;
    const original = builder[method];
    builder[method] = vi.fn().mockImplementation((...args: unknown[]) => {
      original(...args);
      return {
        ...builder,
        then: (resolve: (value: MockResult) => void) =>
          resolve(currentResult),
      };
    });
  }

  // Restore from to return proper chain
  builder.from = vi.fn().mockImplementation((...args: unknown[]) => {
    originalFrom(...args);
    return builder;
  });

  return {
    ...builder,
    /**
     * Set the data that will be returned by the next query chain.
     */
    mockResult(data: unknown, count?: number) {
      currentResult = { data, error: null, count };
      return this;
    },
    /**
     * Set an error that will be returned by the next query chain.
     */
    mockError(message: string) {
      currentResult = { data: null, error: { message } };
      return this;
    },
    /**
     * Reset all mock functions.
     */
    mockReset() {
      currentResult = { data: null, error: null };
      for (const method of methods) {
        builder[method].mockClear();
      }
      return this;
    },
  };
}

export type MockSupabase = ReturnType<typeof createMockSupabase>;
