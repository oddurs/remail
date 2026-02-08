import { describe, it, expect } from "vitest";
import { cn, formatRelativeDate, htmlToSnippet, formatFileSize } from "@/lib/utils";

/* ─── cn() ───────────────────────────────────────────────────────────────────── */

describe("cn", () => {
  it("merges basic classes", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("resolves Tailwind conflicts (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("handles conditional classes via clsx", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("handles empty/undefined/null inputs", () => {
    expect(cn("", undefined, null)).toBe("");
    expect(cn()).toBe("");
  });
});

/* ─── formatRelativeDate() ───────────────────────────────────────────────────── */

describe("formatRelativeDate", () => {
  it("formats today at various times as time string", () => {
    const now = new Date();
    // Create a time that's definitely earlier today (not in the future)
    const hour = now.getHours();
    const minute = now.getMinutes();
    // Use the current time (which is always "today")
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);
    const result = formatRelativeDate(today);
    // Should return time format like "12:05 AM" for same day
    expect(result).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/i);
  });

  it("formats earlier today correctly", () => {
    const now = new Date();
    // Use the exact same time (which is still "today")
    const result = formatRelativeDate(now);
    expect(result).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/i);
  });

  it("formats yesterday as 'Yesterday'", () => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    yesterday.setHours(12, 0, 0, 0);
    // Only works if now is not the 1st — but the function checks date diff
    if (now.getDate() > 1) {
      expect(formatRelativeDate(yesterday)).toBe("Yesterday");
    }
  });

  it("formats same year as 'Mon DD'", () => {
    const now = new Date();
    // Go back 10 days to avoid yesterday edge case
    const earlier = new Date(now);
    earlier.setDate(now.getDate() - 10);
    if (earlier.getFullYear() === now.getFullYear()) {
      const result = formatRelativeDate(earlier);
      expect(result).toMatch(/^[A-Z][a-z]{2}\s\d{1,2}$/);
    }
  });

  it("formats different year as 'Mon DD, YYYY'", () => {
    const lastYear = new Date(2023, 11, 3, 12, 0, 0);
    const result = formatRelativeDate(lastYear);
    expect(result).toMatch(/Dec\s3,\s2023/);
  });

  it("handles midnight edge case", () => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 1, 0);
    const result = formatRelativeDate(midnight);
    expect(result).toMatch(/12:01\s?AM/i);
  });

  it("handles start of year boundary", () => {
    const jan1 = new Date(2024, 0, 1, 12, 0, 0);
    const result = formatRelativeDate(jan1);
    expect(result).toMatch(/Jan\s1,\s2024/);
  });

  it("handles same-day but hours ago", () => {
    const now = new Date();
    if (now.getHours() >= 3) {
      const hoursAgo = new Date(now);
      hoursAgo.setHours(now.getHours() - 2, 0, 0, 0);
      const result = formatRelativeDate(hoursAgo);
      // Should still show time format
      expect(result).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/i);
    }
  });
});

/* ─── htmlToSnippet() ────────────────────────────────────────────────────────── */

describe("htmlToSnippet", () => {
  it("strips HTML tags and returns plain text", () => {
    expect(htmlToSnippet("<p>Hello <b>World</b></p>")).toBe("Hello World");
  });

  it("collapses whitespace", () => {
    expect(htmlToSnippet("<p>Hello   \n\n  World</p>")).toBe("Hello World");
  });

  it("truncates at maxLength with ellipsis", () => {
    const long = "<p>" + "a".repeat(200) + "</p>";
    const result = htmlToSnippet(long, 50);
    expect(result).toHaveLength(53); // 50 + "..."
    expect(result).toMatch(/\.\.\.$/);
  });

  it("returns short text as-is without ellipsis", () => {
    expect(htmlToSnippet("<p>Short</p>", 140)).toBe("Short");
  });

  it("returns empty string for whitespace-only HTML", () => {
    expect(htmlToSnippet("<p>   </p>")).toBe("");
  });
});

/* ─── formatFileSize() ───────────────────────────────────────────────────────── */

describe("formatFileSize", () => {
  it("formats 0 bytes", () => {
    expect(formatFileSize(0)).toBe("0 B");
  });

  it("formats 1024 as 1.0 KB", () => {
    expect(formatFileSize(1024)).toBe("1.0 KB");
  });

  it("formats 1536000 as approximately 1.5 MB", () => {
    const result = formatFileSize(1536000);
    expect(result).toMatch(/^1\.\d MB$/);
  });

  it("formats very large number as GB", () => {
    expect(formatFileSize(2147483648)).toBe("2.0 GB");
  });
});
