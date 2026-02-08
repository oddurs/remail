"use client";

import { useState, useTransition } from "react";
import { assignLabels } from "@/lib/actions/labels";
import { useToast } from "@/components/ui/toast";
import { MdCheck, MdLabel } from "react-icons/md";
import { getLabelIcon } from "@/components/mail/create-label-modal";

interface Label {
  id: string;
  name: string;
  color: string | null;
  icon?: string | null;
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
    <div className="py-1">
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
                  <MdCheck className="size-2.5" style={{ color: "var(--color-text-inverse)" }} />
                )}
              </span>
              {(() => {
                const LIcon = getLabelIcon(label.icon ?? null) ?? MdLabel;
                return (
                  <span
                    className="flex size-4 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: label.color ?? "var(--color-text-tertiary)" }}
                  >
                    <LIcon className="size-2.5 text-white" />
                  </span>
                );
              })()}
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
    </div>
  );
}
