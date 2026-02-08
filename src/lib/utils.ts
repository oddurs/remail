import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date relative to now, Gmail-style:
 * - Today: "2:34 PM"
 * - Yesterday: "Yesterday"
 * - This year: "Jan 15"
 * - Older: "Dec 3, 2024"
 */
export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  if (diffDays <= 1 && now.getDate() - date.getDate() === 1) {
    return "Yesterday";
  }

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a full date with relative suffix, Gmail expanded-header style:
 * "Tue, Feb 3, 7:47 PM (5 days ago)"
 */
export function formatFullDate(date: Date): string {
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const monthDay = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let relative: string;
  if (diffMins < 1) {
    relative = "just now";
  } else if (diffMins < 60) {
    relative = `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  } else if (diffHours < 24) {
    relative = `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  } else if (diffDays < 30) {
    relative = `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  } else {
    const diffMonths = Math.floor(diffDays / 30);
    relative = `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
  }

  return `${weekday}, ${monthDay}, ${time} (${relative})`;
}

/**
 * Generate a snippet from HTML content (strip tags, truncate).
 */
export function htmlToSnippet(html: string, maxLength = 140): string {
  const text = html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

/**
 * Escape HTML special characters to prevent XSS.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Escape special characters in a LIKE/ILIKE pattern.
 */
export function escapeLikePattern(str: string): string {
  return str.replace(/[%_\\]/g, "\\$&");
}

/**
 * Format byte size to human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
