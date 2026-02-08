import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ThemeToggle } from "@/components/theme-toggle";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  value: vi.fn((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders theme toggle button", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("toggles between modes on click", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    // Initial: system
    expect(button).toHaveAttribute("aria-label", "Theme: system. Click to switch.");

    // Click → light
    act(() => button.click());
    expect(button).toHaveAttribute("aria-label", "Theme: light. Click to switch.");

    // Click → dark
    act(() => button.click());
    expect(button).toHaveAttribute("aria-label", "Theme: dark. Click to switch.");

    // Click → back to system
    act(() => button.click());
    expect(button).toHaveAttribute("aria-label", "Theme: system. Click to switch.");
  });

  it("persists preference to localStorage", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    act(() => button.click()); // system → light
    expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "light");
  });
});
