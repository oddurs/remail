"use client";

import { useCompose } from "@/components/mail/compose-provider";

export function ComposeButton() {
  const { openCompose } = useCompose();

  return (
    <button
      onClick={() => openCompose()}
      className="flex items-center gap-3 rounded-2xl bg-[var(--color-bg-tertiary)] px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      <svg
        width="20"
        height="20"
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
