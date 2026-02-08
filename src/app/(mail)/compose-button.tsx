"use client";

import { useCompose } from "@/components/mail/compose-provider";

export function ComposeButton() {
  const { openCompose } = useCompose();

  return (
    <button
      onClick={() => openCompose()}
      className="flex w-full items-center gap-3 rounded-[var(--radius-lg)] bg-[var(--color-accent-subtle)] px-6 py-3.5 text-sm font-medium text-[var(--color-accent-primary)] shadow-[var(--shadow-sm)] transition-[var(--transition-normal)] hover:bg-[var(--color-accent-muted)] hover:shadow-[var(--shadow-md)]"
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
        <path d="M12 5v14M5 12h14" />
      </svg>
      Compose
    </button>
  );
}
