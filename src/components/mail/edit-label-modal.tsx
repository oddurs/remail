"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { motion } from "framer-motion";
import { updateLabel, deleteLabel } from "@/lib/actions/labels";
import { useToast } from "@/components/ui/toast";
import { LABEL_COLOR_PRESETS } from "@/components/mail/create-label-modal";

export function EditLabelModal({
  label,
  onClose,
}: {
  label: { id: string; name: string; color: string | null };
  onClose: () => void;
}) {
  const [name, setName] = useState(label.name);
  const [color, setColor] = useState(label.color ?? LABEL_COLOR_PRESETS[5].hex);
  const [showDelete, setShowDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement;
    inputRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
      previousFocus.current?.focus();
    };
  }, [onClose]);

  const handleSave = () => {
    if (!name.trim()) return;
    const updates: { name?: string; color?: string } = {};
    if (name.trim() !== label.name) updates.name = name.trim();
    if (color !== label.color) updates.color = color;
    if (Object.keys(updates).length === 0) {
      onClose();
      return;
    }
    startTransition(async () => {
      await updateLabel(label.id, updates);
      showToast({ message: "Label updated" });
      onClose();
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteLabel(label.id);
      showToast({ message: `Label "${label.name}" deleted` });
      onClose();
    });
  };

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Edit label"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <motion.div
        ref={dialogRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-sm rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] p-6 shadow-[var(--shadow-xl)]"
      >
        <h2 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
          Edit label
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="edit-label-name"
              className="mb-1 block text-sm text-[var(--color-text-secondary)]"
            >
              Name
            </label>
            <input
              ref={inputRef}
              id="edit-label-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-primary)]"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[var(--color-text-secondary)]">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {LABEL_COLOR_PRESETS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  className={`h-7 w-7 rounded-[var(--radius-full)] transition-[var(--transition-fast)] ${
                    color === c.hex
                      ? "ring-2 ring-[var(--color-accent-primary)] ring-offset-2 ring-offset-[var(--color-bg-primary)]"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          {!showDelete ? (
            <button
              onClick={() => setShowDelete(true)}
              className="text-sm text-[var(--color-error)] hover:underline"
            >
              Delete label
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Delete?
              </span>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-[var(--radius-sm)] bg-[var(--color-error)] px-3 py-1 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDelete(false)}
                className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
              >
                No
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-[var(--radius-sm)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isPending || !name.trim()}
              className="rounded-[var(--radius-sm)] bg-[var(--color-accent-primary)] px-4 py-2 text-sm font-medium text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
