"use client";

import { ChevronDown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AvatarDropdownProps {
  name: string;
  email: string;
  avatarUrl?: string;
}

export function AvatarDropdown({ name, email, avatarUrl }: AvatarDropdownProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="ml-1 flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 h-auto border-[var(--color-border-default)] hover:bg-[var(--color-bg-hover)] focus-visible:ring-[var(--color-border-default)]"
          aria-label="Account menu"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-accent-primary)] text-xs font-medium text-[var(--color-text-inverse)]">
              {initial}
            </div>
          )}
          <div className="flex flex-col items-start leading-tight">
            <span className="text-xs font-medium text-[var(--color-text-primary)]">{name}</span>
            <span className="text-[11px] text-[var(--color-text-tertiary)]">{email}</span>
          </div>
          <ChevronDown className="size-3.5 shrink-0 text-[var(--color-text-tertiary)]" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72 rounded-2xl border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] p-0 shadow-lg"
      >
        {/* Email header */}
        <DropdownMenuLabel className="px-5 pt-4 pb-2 text-sm font-normal text-[var(--color-text-secondary)]">
          {email}
        </DropdownMenuLabel>

        {/* Avatar + name */}
        <div className="flex flex-col items-center px-5 py-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent-primary)] text-2xl font-medium text-[var(--color-text-inverse)]">
              {initial}
            </div>
          )}
          <p className="mt-3 text-lg font-medium text-[var(--color-text-primary)]">
            Hi, {name.split(" ")[0]}!
          </p>
        </div>

        <DropdownMenuSeparator className="mx-4 bg-[var(--color-border-subtle)]" />

        {/* Actions */}
        <div className="p-2">
          <DropdownMenuItem className="gap-3 rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-secondary)] focus:bg-[var(--color-bg-hover)] cursor-pointer">
            <Settings className="size-[18px]" />
            Manage account
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-[var(--color-border-subtle)]" />

        {/* Footer */}
        <div className="px-5 py-3">
          <p className="text-center text-xs text-[var(--color-text-tertiary)]">
            Demo session &middot; No real data
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
