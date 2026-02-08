"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { MdRefresh } from "react-icons/md";

export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        startTransition(() => {
          router.refresh();
        });
      }}
      disabled={isPending}
      className={`rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] disabled:opacity-50 ${isPending ? "animate-spin" : ""}`}
      title="Refresh"
      aria-label="Refresh"
    >
      <MdRefresh className="size-4" />
    </button>
  );
}
