"use client";

import { useState, useTransition } from "react";
import { updateLabel, deleteLabel } from "@/lib/actions/labels";
import { useToast } from "@/components/ui/toast";
import { LABEL_COLOR_PRESETS, LABEL_ICON_PRESETS } from "@/components/mail/create-label-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function EditLabelModal({
  label,
  onClose,
}: {
  label: { id: string; name: string; color: string | null; icon: string | null };
  onClose: () => void;
}) {
  const [name, setName] = useState(label.name);
  const [color, setColor] = useState(label.color ?? LABEL_COLOR_PRESETS[5].hex);
  const [icon, setIcon] = useState(label.icon ?? LABEL_ICON_PRESETS[23].id);
  const [showDelete, setShowDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleSave = () => {
    if (!name.trim()) return;
    const updates: { name?: string; color?: string; icon?: string } = {};
    if (name.trim() !== label.name) updates.name = name.trim();
    if (color !== label.color) updates.color = color;
    if (icon !== label.icon) updates.icon = icon;
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
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-sm rounded-[var(--radius-lg)] border-[var(--color-border-default)] bg-[var(--color-bg-primary)] p-6 shadow-[var(--shadow-xl)]"
      >
        <DialogHeader>
          <DialogTitle className="text-[var(--color-text-primary)]">
            Edit label
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="edit-label-name"
              className="mb-1 block text-sm text-[var(--color-text-secondary)]"
            >
              Name
            </label>
            <Input
              id="edit-label-name"
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-[var(--color-border-default)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus-visible:border-[var(--color-accent-primary)] focus-visible:ring-0"
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
                  className={`h-7 w-7 rounded-full transition-[var(--transition-fast)] ${
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

          <div>
            <label className="mb-2 block text-sm text-[var(--color-text-secondary)]">
              Icon
            </label>
            <div className="grid grid-cols-8 gap-1.5">
              {LABEL_ICON_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setIcon(preset.id)}
                  className={`flex size-8 items-center justify-center rounded-full transition-[var(--transition-fast)] ${
                    icon === preset.id
                      ? "ring-2 ring-[var(--color-accent-primary)] ring-offset-2 ring-offset-[var(--color-bg-primary)]"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={preset.name}
                >
                  <preset.icon className="size-4 text-white" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          {!showDelete ? (
            <Button
              variant="link"
              onClick={() => setShowDelete(true)}
              className="h-auto p-0 text-sm text-[var(--color-error)] hover:text-[var(--color-error)]"
            >
              Delete label
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Delete?
              </span>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
              >
                Yes
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowDelete(false)}
                className="text-[var(--color-text-tertiary)]"
              >
                No
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-[var(--color-text-secondary)]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isPending || !name.trim()}
              className="bg-[var(--color-accent-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)]"
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
