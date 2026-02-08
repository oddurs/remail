"use client";

import { useCompose } from "@/components/mail/compose-provider";
import { MdOutlineEdit } from "react-icons/md";
import { Button } from "@/components/ui/button";

export function ComposeButton() {
  const { openCompose } = useCompose();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => openCompose()}
      className="rounded-full text-xs bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:text-white hover:shadow-md dark:bg-[var(--color-bg-tertiary)] dark:text-[var(--color-text-primary)] dark:shadow-none dark:border dark:border-[var(--color-border-default)] dark:hover:bg-[var(--color-bg-hover)]"
    >
      <MdOutlineEdit className="size-4" />
      Compose
    </Button>
  );
}
