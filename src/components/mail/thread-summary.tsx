"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ThreadSummaryProps {
  summary: string;
}

export function ThreadSummary({ summary }: ThreadSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const bullets = summary
    .split("\n")
    .map((line) => line.replace(/^•\s*/, "").trim())
    .filter(Boolean);

  if (bullets.length === 0) return null;

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]">
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left"
      >
        {/* Sparkle icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-accent-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
        </svg>
        <span className="text-xs font-medium text-[var(--color-accent-primary)]">
          AI Summary
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`ml-auto shrink-0 text-[var(--color-text-tertiary)] transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ overflow: "hidden" }}
          >
            <ul className="px-4 pb-3 pl-10 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {bullets.map((bullet, i) => (
                <li key={i} className="flex gap-2">
                  <span className="shrink-0 text-[var(--color-text-tertiary)]">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
