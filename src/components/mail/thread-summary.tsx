"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdAutoAwesome, MdExpandMore } from "react-icons/md";

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
        <MdAutoAwesome className="size-4 shrink-0 text-[var(--color-accent-primary)]" />
        <span className="text-xs font-medium text-[var(--color-accent-primary)]">
          AI Summary
        </span>
        <MdExpandMore className={`size-3.5 ml-auto shrink-0 text-[var(--color-text-tertiary)] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
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
