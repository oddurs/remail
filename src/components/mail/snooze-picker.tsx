"use client";

import { useState, useTransition } from "react";
import { snoozeEmail } from "@/lib/actions/email";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { MdEvent } from "react-icons/md";

function getSnoozePresets() {
  const now = new Date();
  const hour = now.getHours();

  // Later today: +3 hours, or next morning 8 AM if after 6pm
  const laterToday = new Date(now);
  if (hour >= 18) {
    laterToday.setDate(laterToday.getDate() + 1);
    laterToday.setHours(8, 0, 0, 0);
  } else {
    laterToday.setHours(hour + 3, 0, 0, 0);
  }

  // Tomorrow 8:00 AM
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);

  // This weekend: next Saturday 8:00 AM
  const weekend = new Date(now);
  const dayOfWeek = weekend.getDay();
  const daysUntilSaturday = dayOfWeek === 6 ? 7 : (6 - dayOfWeek);
  weekend.setDate(weekend.getDate() + daysUntilSaturday);
  weekend.setHours(8, 0, 0, 0);

  // Next week: next Monday 8:00 AM
  const nextWeek = new Date(now);
  const daysUntilMonday = dayOfWeek === 1 ? 7 : ((8 - dayOfWeek) % 7);
  nextWeek.setDate(nextWeek.getDate() + daysUntilMonday);
  nextWeek.setHours(8, 0, 0, 0);

  return [
    { label: "Later today", date: laterToday, description: formatPresetTime(laterToday) },
    { label: "Tomorrow", date: tomorrow, description: "Tomorrow, 8:00 AM" },
    { label: "This weekend", date: weekend, description: formatPresetDate(weekend) },
    { label: "Next week", date: nextWeek, description: formatPresetDate(nextWeek) },
  ];
}

function formatPresetTime(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatPresetDate(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) + ", 8:00 AM";
}

export function SnoozePicker({
  emailId,
  onClose,
}: {
  emailId: string;
  onClose: () => void;
}) {
  const [showCustom, setShowCustom] = useState(false);
  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("08:00");
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const presets = getSnoozePresets();

  const handleSnooze = (date: Date) => {
    startTransition(async () => {
      await snoozeEmail(emailId, date.toISOString());
      showToast({
        message: `Snoozed until ${date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`,
      });
      onClose();
    });
  };

  const handleCustomSnooze = () => {
    if (!customDate) return;
    const [year, month, day] = customDate.split("-").map(Number);
    const [hours, minutes] = customTime.split(":").map(Number);
    const date = new Date(year, month - 1, day, hours, minutes);
    if (date <= new Date()) return;
    handleSnooze(date);
  };

  return (
    <div className="py-1" role="menu" aria-label="Snooze options">
      <div className="px-3 py-2 text-xs font-medium text-[var(--color-text-tertiary)]">
        Snooze until...
      </div>

      {presets.map((preset) => (
        <button
          key={preset.label}
          onClick={() => handleSnooze(preset.date)}
          disabled={isPending}
          role="menuitem"
          className="flex w-full items-center justify-between px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] disabled:opacity-50"
        >
          <span>{preset.label}</span>
          <span className="text-xs text-[var(--color-text-tertiary)]">{preset.description}</span>
        </button>
      ))}

      <div className="mx-3 my-1 border-t border-[var(--color-border-subtle)]" />

      {!showCustom ? (
        <button
          onClick={() => setShowCustom(true)}
          role="menuitem"
          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]"
        >
          <MdEvent className="size-3.5" />
          Pick date & time
        </button>
      ) : (
        <div className="space-y-2 px-3 py-2">
          <div>
            <label htmlFor="snooze-date" className="mb-1 block text-xs text-[var(--color-text-tertiary)]">Date</label>
            <input
              id="snooze-date"
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] px-2 py-1.5 text-sm text-[var(--color-text-primary)]"
            />
          </div>
          <div>
            <label htmlFor="snooze-time" className="mb-1 block text-xs text-[var(--color-text-tertiary)]">Time</label>
            <input
              id="snooze-time"
              type="time"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] px-2 py-1.5 text-sm text-[var(--color-text-primary)]"
            />
          </div>
          <button
            onClick={handleCustomSnooze}
            disabled={isPending || !customDate}
            className={cn(
              "w-full rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-[var(--transition-fast)]",
              customDate
                ? "bg-[var(--color-accent-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)]"
                : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]",
            )}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
