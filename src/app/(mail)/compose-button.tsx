"use client";

import { useCompose } from "@/components/mail/compose-provider";
import { Pencil } from "lucide-react";

export function ComposeButton() {
  const { openCompose } = useCompose();

  return (
    <button
      onClick={() => openCompose()}
      className="flex items-center gap-3 rounded-2xl bg-[var(--color-bg-tertiary)] px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      <Pencil className="size-5" />
      Compose
    </button>
  );
}
