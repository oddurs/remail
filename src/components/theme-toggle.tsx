"use client";

import { useCallback, useEffect, useState } from "react";
import { Monitor, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={cycle}
            className="relative rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-secondary)]"
            aria-label={`Theme: ${mode}. Click to switch.`}
          >
            <Monitor
              className={cn(
                "!size-5 absolute transition-all duration-200",
                mode === "system" ? "scale-100 opacity-100" : "scale-75 opacity-0"
              )}
            />
            <Sun
              className={cn(
                "!size-5 absolute transition-all duration-200",
                mode === "light" ? "scale-100 opacity-100" : "scale-75 opacity-0"
              )}
            />
            <Moon
              className={cn(
                "!size-5 absolute transition-all duration-200",
                mode === "dark" ? "scale-100 opacity-100" : "scale-75 opacity-0"
              )}
            />
            {/* Invisible spacer to maintain button size */}
            <span className="invisible size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Theme: {mode}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
