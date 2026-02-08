"use client";

import { useState, useTransition } from "react";
import { createLabel } from "@/lib/actions/labels";
import { useToast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  MdWork,
  MdPerson,
  MdPayments,
  MdFlight,
  MdReceipt,
  MdSchool,
  MdHome,
  MdFavorite,
  MdShoppingCart,
  MdFitnessCenter,
  MdLocalHospital,
  MdRestaurant,
  MdMusicNote,
  MdSportsEsports,
  MdCode,
  MdCampaign,
  MdGroups,
  MdEvent,
  MdAttachMoney,
  MdBuild,
  MdNotifications,
  MdBookmark,
  MdLightbulb,
  MdLabel,
} from "react-icons/md";
import type { IconType } from "react-icons";

export const LABEL_COLOR_PRESETS = [
  { hex: "#ef4444", name: "Red" },
  { hex: "#f97316", name: "Orange" },
  { hex: "#eab308", name: "Yellow" },
  { hex: "#22c55e", name: "Green" },
  { hex: "#14b8a6", name: "Teal" },
  { hex: "#3b82f6", name: "Blue" },
  { hex: "#6366f1", name: "Indigo" },
  { hex: "#a855f7", name: "Purple" },
  { hex: "#ec4899", name: "Pink" },
  { hex: "#78716c", name: "Gray" },
];

export const LABEL_ICON_PRESETS: Array<{ id: string; name: string; icon: IconType }> = [
  { id: "work", name: "Work", icon: MdWork },
  { id: "person", name: "Personal", icon: MdPerson },
  { id: "payments", name: "Finance", icon: MdPayments },
  { id: "flight", name: "Travel", icon: MdFlight },
  { id: "receipt", name: "Receipt", icon: MdReceipt },
  { id: "school", name: "School", icon: MdSchool },
  { id: "home", name: "Home", icon: MdHome },
  { id: "favorite", name: "Favorite", icon: MdFavorite },
  { id: "shopping_cart", name: "Shopping", icon: MdShoppingCart },
  { id: "fitness_center", name: "Fitness", icon: MdFitnessCenter },
  { id: "local_hospital", name: "Health", icon: MdLocalHospital },
  { id: "restaurant", name: "Food", icon: MdRestaurant },
  { id: "music_note", name: "Music", icon: MdMusicNote },
  { id: "sports_esports", name: "Gaming", icon: MdSportsEsports },
  { id: "code", name: "Code", icon: MdCode },
  { id: "campaign", name: "Promo", icon: MdCampaign },
  { id: "groups", name: "Team", icon: MdGroups },
  { id: "event", name: "Event", icon: MdEvent },
  { id: "attach_money", name: "Money", icon: MdAttachMoney },
  { id: "build", name: "Tools", icon: MdBuild },
  { id: "notifications", name: "Alerts", icon: MdNotifications },
  { id: "bookmark", name: "Bookmark", icon: MdBookmark },
  { id: "lightbulb", name: "Ideas", icon: MdLightbulb },
  { id: "label", name: "Label", icon: MdLabel },
];

export function getLabelIcon(iconId: string | null): IconType | null {
  if (!iconId) return null;
  return LABEL_ICON_PRESETS.find((p) => p.id === iconId)?.icon ?? null;
}

export function CreateLabelModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(LABEL_COLOR_PRESETS[5].hex);
  const [icon, setIcon] = useState(LABEL_ICON_PRESETS[23].id); // "label"
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleCreate = () => {
    if (!name.trim()) return;
    startTransition(async () => {
      await createLabel(name.trim(), color, icon);
      showToast({ message: `Label "${name.trim()}" created` });
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
            New label
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="label-name"
              className="mb-1 block text-sm text-[var(--color-text-secondary)]"
            >
              Name
            </label>
            <Input
              id="label-name"
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter label name"
              className="border-[var(--color-border-default)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus-visible:border-[var(--color-accent-primary)] focus-visible:ring-0"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
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

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-[var(--color-text-secondary)]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isPending || !name.trim()}
            className="bg-[var(--color-accent-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)]"
          >
            {isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
