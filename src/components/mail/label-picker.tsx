"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { motion } from "framer-motion";
import { assignLabels } from "@/lib/actions/labels";
import { useToast } from "@/components/ui/toast";

interface Label {
  id: string;
  name: string;
  color: string | null;
}

export function LabelPicker({
  emailIds,
  currentLabelIds,
  labels,
  onClose,
}: {
  emailIds: string[];
  currentLabelIds: string[];
  labels: Label[];
  onClose: () => void;
}) {
  const [checked, setChecked] = useState<Set<string>>(
    new Set(currentLabelIds),
  );
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleToggle = (labelId: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(labelId)) {
        next.delete(labelId);
      } else {
        next.add(labelId);
      }
      return next;
    });
  };

  const handleApply = () => {
    const addLabelIds = Array.from(checked).filter(
      (id) => !currentLabelIds.includes(id),
    );
    const removeLabelIds = currentLabelIds.filter((id) => !checked.has(id));

    if (addLabelIds.length === 0 && removeLabelIds.length === 0) {
      onClose();
      return;
    }

    startTransition(async () => {
      await assignLabels(emailIds, addLabelIds, removeLabelIds);
      showToast({ message: "Labels updated" });
      onClose();
    });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="absolute left-0 top-full z-[var(--z-dropdown)] mt-1 w-56 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] py-1 shadow-[var(--shadow-lg)]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3 py-2 text-xs font-medium text-[var(--color-text-tertiary)]">
        Label as:
      </div>

      {labels.length === 0 ? (
        <div className="px-3 py-2 text-sm text-[var(--color-text-tertiary)]">
          No labels yet
        </div>
      ) : (
        <div className="max-h-48 overflow-y-auto">
          {labels.map((label) => (
            <button
              key={label.id}
              onClick={() => handleToggle(label.id)}
              role="checkbox"
              aria-checked={checked.has(label.id)}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]"
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border ${
                  checked.has(label.id)
                    ? "border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]"
                    : "border-[var(--color-border-default)]"
                }`}
              >
                {checked.has(label.id) && (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-text-inverse)"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
              {label.color && (
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-[var(--radius-full)]"
                  style={{ backgroundColor: label.color }}
                />
              )}
              <span className="truncate">{label.name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mx-3 my-1 border-t border-[var(--color-border-subtle)]" />

      <div className="px-3 py-1">
        <button
          onClick={handleApply}
          disabled={isPending}
          className="w-full rounded-[var(--radius-sm)] bg-[var(--color-accent-primary)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
        >
          {isPending ? "Applying..." : "Apply"}
        </button>
      </div>
    </motion.div>
  );
}
