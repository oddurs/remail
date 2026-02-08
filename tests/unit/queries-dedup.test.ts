import { describe, it, expect } from "vitest";
import { deduplicateByThread } from "@/lib/queries/emails";

describe("deduplicateByThread", () => {
  it("deduplicates by thread_id keeping first occurrence", () => {
    const emails = [
      { id: "1", thread_id: "t1", subject: "A" },
      { id: "2", thread_id: "t1", subject: "B" },
      { id: "3", thread_id: "t2", subject: "C" },
    ];
    const result = deduplicateByThread(emails);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("1");
    expect(result[1].id).toBe("3");
  });

  it("returns empty array for empty input", () => {
    expect(deduplicateByThread([])).toEqual([]);
  });

  it("returns single item for single input", () => {
    const emails = [{ id: "1", thread_id: "t1" }];
    expect(deduplicateByThread(emails)).toEqual(emails);
  });

  it("returns first only when all same thread_id", () => {
    const emails = [
      { id: "1", thread_id: "same" },
      { id: "2", thread_id: "same" },
      { id: "3", thread_id: "same" },
    ];
    const result = deduplicateByThread(emails);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("preserves order for mixed threads", () => {
    const emails = [
      { id: "1", thread_id: "a" },
      { id: "2", thread_id: "b" },
      { id: "3", thread_id: "c" },
      { id: "4", thread_id: "a" },
      { id: "5", thread_id: "b" },
    ];
    const result = deduplicateByThread(emails);
    expect(result.map((e) => e.id)).toEqual(["1", "2", "3"]);
  });
});
