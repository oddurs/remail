import { describe, it, expect } from "vitest";

/**
 * The tsquery conversion logic is embedded in searchEmails() in search.ts:
 *   query.trim().split(/\s+/).filter(Boolean).map(t => `${t}:*`).join(" & ")
 *
 * We extract and test this logic directly.
 */
function toTsQuery(query: string): string {
  const terms = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => `${term}:*`)
    .join(" & ");
  return terms;
}

describe("tsquery conversion", () => {
  it("converts single word to prefix search", () => {
    expect(toTsQuery("hello")).toBe("hello:*");
  });

  it("converts multiple words to AND prefix search", () => {
    expect(toTsQuery("hello world")).toBe("hello:* & world:*");
  });

  it("handles leading/trailing whitespace", () => {
    expect(toTsQuery("  hello  ")).toBe("hello:*");
  });

  it("handles multiple spaces between words", () => {
    expect(toTsQuery("hello   world   test")).toBe("hello:* & world:* & test:*");
  });

  it("returns empty string for empty/whitespace query", () => {
    expect(toTsQuery("")).toBe("");
    expect(toTsQuery("   ")).toBe("");
  });
});
