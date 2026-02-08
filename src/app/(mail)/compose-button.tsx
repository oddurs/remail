"use client";

import { useCompose } from "@/components/mail/compose-provider";

export function ComposeButton() {
  const { openCompose } = useCompose();

  return (
    <button
      onClick={() => openCompose()}
      className="flex w-full items-center gap-3 rounded-[var(--radius-xl)] bg-[var(--color-accent-subtle)] px-6 py-3.5 text-sm font-medium text-[var(--color-accent-primary)] shadow-[var(--shadow-sm)] transition-[var(--transition-normal)] hover:bg-[var(--color-accent-muted)] hover:shadow-[var(--shadow-md)]"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
      </svg>
      Compose
    </button>
  );
}
