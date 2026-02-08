"use client";

import { useCallback, useEffect, useState } from "react";

type ThemeMode = "system" | "light" | "dark";

const CYCLE: ThemeMode[] = ["system", "light", "dark"];

function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode !== "system") return mode;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(mode: ThemeMode) {
  const resolved = resolveTheme(mode);
  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.setAttribute("data-theme-transitioning", "");
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.documentElement.removeAttribute("data-theme-transitioning");
    }, 250);
  });
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("system");

  // Hydrate from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("theme") as ThemeMode | null;
    if (stored && CYCLE.includes(stored)) {
      setMode(stored);
    }
  }, []);

  // Listen for OS preference changes when in system mode
  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode]);

  const cycle = useCallback(() => {
    const nextIndex = (CYCLE.indexOf(mode) + 1) % CYCLE.length;
    const next = CYCLE[nextIndex];
    setMode(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  }, [mode]);

  return (
    <button
      onClick={cycle}
      className="relative flex items-center justify-center rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] transition-[var(--transition-fast)] hover:bg-[var(--color-bg-hover)]"
      aria-label={`Theme: ${mode}. Click to switch.`}
      title={`Theme: ${mode}`}
    >
      {/* System */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`absolute transition-all duration-200 ${
          mode === "system" ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>

      {/* Light */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`absolute transition-all duration-200 ${
          mode === "light" ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>

      {/* Dark */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`absolute transition-all duration-200 ${
          mode === "dark" ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>

      {/* Invisible spacer to maintain button size */}
      <span className="invisible">
        <svg width="20" height="20" />
      </span>
    </button>
  );
}
