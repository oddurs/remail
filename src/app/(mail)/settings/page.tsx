"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl px-6 py-6">
        <div className="divide-y divide-[var(--color-border-default)]">
          {/* Language */}
          <SettingRow label="Language">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--color-text-secondary)]">
                  Gmail display language:
                </span>
                <SettingSelect value="English (US)" options={["English (US)", "English (UK)", "Español", "Français", "Deutsch"]} />
                <BlueLink>Change language settings for other Google products</BlueLink>
              </div>
              <SettingCheckbox checked={false} label="Enable input tools" />
              <div className="text-xs text-[var(--color-text-tertiary)]">
                Input tools let you type in the language and keyboard layout of your choice.{" "}
                <BlueLink>Learn more</BlueLink>
              </div>
              <div className="mt-1">
                <SettingRadioGroup
                  defaultValue="Right-to-left editing support off"
                  options={[
                    { value: "Right-to-left editing support off", label: "Right-to-left editing support off" },
                    { value: "Right-to-left editing support on", label: "Right-to-left editing support on" },
                  ]}
                />
              </div>
            </div>
          </SettingRow>

          {/* Maximum page size */}
          <SettingRow label="Maximum page size">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--color-text-secondary)]">Show</span>
              <SettingSelect value="50" options={["25", "50", "100"]} />
              <span className="text-sm text-[var(--color-text-secondary)]">
                conversations per page
              </span>
            </div>
          </SettingRow>

          {/* Undo Send */}
          <SettingRow label="Undo Send">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Send cancellation period:
              </span>
              <SettingSelect value="5" options={["5", "10", "20", "30"]} />
              <span className="text-sm text-[var(--color-text-secondary)]">seconds</span>
            </div>
          </SettingRow>

          {/* Default reply behavior */}
          <SettingRow label="Default reply behavior">
            <SettingRadioGroup
              defaultValue="Reply"
              options={[
                { value: "Reply", label: "Reply" },
                { value: "Reply all", label: "Reply all" },
              ]}
            />
          </SettingRow>

          {/* Hover actions */}
          <SettingRow
            label="Hover actions"
            description="Enable hover actions in the inbox to quickly manage messages."
          >
            <SettingRadioGroup
              defaultValue="Enable hover actions"
              options={[
                { value: "Enable hover actions", label: "Enable hover actions" },
                { value: "Disable hover actions", label: "Disable hover actions" },
              ]}
            />
          </SettingRow>

          {/* Send and Archive */}
          <SettingRow
            label="Send and Archive"
            description={
              <>
                Show a &quot;Send &amp; Archive&quot; button in reply.{" "}
                <BlueLink>Learn more</BlueLink>
              </>
            }
          >
            <SettingRadioGroup
              defaultValue='Hide "Send & Archive" button in reply'
              options={[
                { value: 'Show "Send & Archive" button in reply', label: 'Show "Send & Archive" button in reply' },
                { value: 'Hide "Send & Archive" button in reply', label: 'Hide "Send & Archive" button in reply' },
              ]}
            />
          </SettingRow>

          {/* Default text style */}
          <SettingRow label="Default text style">
            <div className="space-y-2">
              <div className="flex items-center gap-1 rounded-[var(--radius-xs)] border border-[var(--color-border-default)] px-2 py-1">
                <SettingSelect value="Sans Serif" options={["Sans Serif", "Serif", "Fixed Width"]} />
                <Separator orientation="vertical" className="mx-0.5 h-5" />
                <SettingSelect value="Small" options={["Small", "Normal", "Large", "Huge"]} />
                <Separator orientation="vertical" className="mx-0.5 h-5" />
                <ToolbarButton>B</ToolbarButton>
                <ToolbarButton>
                  <span className="italic">I</span>
                </ToolbarButton>
                <ToolbarButton>
                  <span className="underline">U</span>
                </ToolbarButton>
                <ToolbarButton>T</ToolbarButton>
                <ToolbarButton>A</ToolbarButton>
              </div>
              <div className="rounded-[var(--radius-xs)] border border-[var(--color-border-default)] px-3 py-2 text-sm text-[var(--color-text-secondary)]">
                This is what your body text will look like.
              </div>
            </div>
          </SettingRow>

          {/* Images */}
          <SettingRow label="Images">
            <SettingRadioGroup
              defaultValue="Always display external images"
              options={[
                {
                  value: "Always display external images",
                  label: "Always display external images",
                  description: "Use caution with this option. Senders will know when you view their messages.",
                },
                { value: "Ask before displaying external images", label: "Ask before displaying external images" },
              ]}
            />
          </SettingRow>

          {/* Dynamic email */}
          <SettingRow
            label="Dynamic email"
            description={
              <>
                Dynamic email allows you to interact with content directly in
                messages. <BlueLink>Learn more</BlueLink>
              </>
            }
          >
            <div className="space-y-1">
              <SettingCheckbox checked label="Enable dynamic email" />
              <div className="ml-6">
                <BlueLink>Developer settings</BlueLink>
              </div>
            </div>
          </SettingRow>

          {/* Grammar */}
          <SettingRow label="Grammar">
            <SettingRadioGroup
              defaultValue="Grammar suggestions on"
              options={[
                { value: "Grammar suggestions on", label: "Grammar suggestions on" },
                { value: "Grammar suggestions off", label: "Grammar suggestions off" },
              ]}
            />
          </SettingRow>

          {/* Spelling */}
          <SettingRow label="Spelling">
            <SettingRadioGroup
              defaultValue="Spelling suggestions on"
              options={[
                { value: "Spelling suggestions on", label: "Spelling suggestions on" },
                { value: "Spelling suggestions off", label: "Spelling suggestions off" },
              ]}
            />
          </SettingRow>

          {/* Autocorrect */}
          <SettingRow label="Autocorrect">
            <SettingRadioGroup
              defaultValue="Autocorrect on"
              options={[
                { value: "Autocorrect on", label: "Autocorrect on" },
                { value: "Autocorrect off", label: "Autocorrect off" },
              ]}
            />
          </SettingRow>

          {/* Smart Compose */}
          <SettingRow
            label="Smart Compose"
            description={
              <>
                Predictive writing suggestions appear as you compose.{" "}
                <BlueLink>Learn more</BlueLink>
              </>
            }
          >
            <SettingRadioGroup
              defaultValue="Writing suggestions on"
              options={[
                { value: "Writing suggestions on", label: "Writing suggestions on" },
                { value: "Writing suggestions off", label: "Writing suggestions off" },
              ]}
            />
          </SettingRow>

          {/* Smart Compose personalization */}
          <SettingRow
            label="Smart Compose personalization"
            description="Smart Compose learns from your writing style to personalize suggestions."
          >
            <SettingRadioGroup
              defaultValue="Personalization on"
              options={[
                { value: "Personalization on", label: "Personalization on" },
                { value: "Personalization off", label: "Personalization off" },
              ]}
            />
          </SettingRow>

          {/* Conversation View */}
          <SettingRow
            label="Conversation View"
            description="Groups related messages together into conversations. Changes will take effect after reload."
          >
            <SettingRadioGroup
              defaultValue="Conversation view on"
              options={[
                { value: "Conversation view on", label: "Conversation view on" },
                { value: "Conversation view off", label: "Conversation view off" },
              ]}
            />
          </SettingRow>

          {/* Nudges */}
          <SettingRow
            label="Nudges"
            description={
              <>
                Emails that need a follow-up will appear at the top of your
                inbox. <BlueLink>Learn more</BlueLink>
              </>
            }
          >
            <div className="space-y-1">
              <SettingCheckbox
                checked
                label="Suggest emails to reply to"
                description="Emails that you might have forgotten to respond to will appear at the top of your inbox"
              />
              <SettingCheckbox
                checked
                label="Suggest emails to follow up on"
                description="Sent emails that you might need to follow up on will appear at the top of your inbox"
              />
            </div>
          </SettingRow>

          {/* Smart Reply */}
          <SettingRow label="Smart Reply">
            <SettingRadioGroup
              defaultValue="Smart Reply on"
              options={[
                { value: "Smart Reply on", label: "Smart Reply on" },
                { value: "Smart Reply off", label: "Smart Reply off" },
              ]}
            />
          </SettingRow>

          {/* Preview Pane */}
          <SettingRow
            label="Preview Pane"
            description="Mark a conversation as read:"
          >
            <SettingSelect value="After 3 seconds" options={["Immediately", "After 1 second", "After 3 seconds", "After 20 seconds", "Never"]} />
          </SettingRow>

          {/* Smart features and personalization */}
          <SettingRow
            label="Smart features and personalization"
            description={
              <>
                Gmail, Chat, and Meet may use your email, chat, and video
                content to personalize your experience and provide smart
                features. If you turn this off, features will be limited.{" "}
                <BlueLink>Learn more</BlueLink>
              </>
            }
          >
            <SettingCheckbox
              checked
              label="Turn on smart features and personalization"
            />
          </SettingRow>

          {/* Google Workspace smart features */}
          <SettingRow
            label="Smart features and personalization in other Google products"
            description="Let Google use data from Gmail, Chat, and Meet to personalize other Google products."
          >
            <Button variant="outline" size="sm">Manage smart features settings</Button>
          </SettingRow>

          {/* Package tracking */}
          <SettingRow label="Package tracking">
            <SettingCheckbox
              checked
              label="Automatically identify and track your packages in Gmail"
            />
          </SettingRow>

          {/* Desktop notifications */}
          <SettingRow
            label="Desktop notifications"
            description={
              <>
                <BlueLink>Click here to enable desktop notifications</BlueLink>{" "}
                for Gmail.
              </>
            }
          >
            <SettingRadioGroup
              defaultValue="Mail notifications off"
              options={[
                { value: "New mail notifications on", label: "New mail notifications on" },
                { value: "Important mail notifications on", label: "Important mail notifications on" },
                { value: "Mail notifications off", label: "Mail notifications off" },
              ]}
            />
          </SettingRow>

          {/* Stars */}
          <SettingRow
            label="Stars"
            description="Drag the stars between the lists. The stars will rotate in the order shown below when you click successively."
          >
            <div className="space-y-2">
              <div className="flex gap-3 text-xs text-[var(--color-text-tertiary)]">
                <BlueLink>Presets:</BlueLink>
                <BlueLink>1 star</BlueLink>
                <BlueLink>4 stars</BlueLink>
                <BlueLink>all stars</BlueLink>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs text-[var(--color-text-tertiary)]">In use:</div>
                <div className="flex gap-1">
                  <StarIcon color="var(--color-star)" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs text-[var(--color-text-tertiary)]">Not in use:</div>
                <div className="flex gap-1">
                  <StarIcon color="var(--color-text-tertiary)" />
                  <StarIcon color="#3b82f6" />
                  <StarIcon color="#a855f7" />
                  <StarIcon color="#ef4444" />
                  <StarIcon color="#f97316" />
                  <StarIcon color="#22c55e" />
                </div>
              </div>
            </div>
          </SettingRow>

          {/* Keyboard shortcuts */}
          <SettingRow
            label="Keyboard shortcuts"
            description={<BlueLink>Learn more</BlueLink>}
          >
            <SettingRadioGroup
              defaultValue="Keyboard shortcuts off"
              options={[
                { value: "Keyboard shortcuts on", label: "Keyboard shortcuts on" },
                { value: "Keyboard shortcuts off", label: "Keyboard shortcuts off" },
              ]}
            />
          </SettingRow>

          {/* Button labels */}
          <SettingRow label="Button labels">
            <SettingRadioGroup
              defaultValue="Icons"
              options={[
                { value: "Icons", label: "Icons" },
                { value: "Text", label: "Text" },
              ]}
            />
          </SettingRow>

          {/* My picture */}
          <SettingRow
            label="My picture"
            description="Your picture is visible across Google products."
          >
            <div className="flex items-center gap-3">
              <div className="flex size-16 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-bg-tertiary)] text-xl font-medium text-[var(--color-text-secondary)]">
                U
              </div>
              <div className="space-y-1">
                <div className="text-sm text-[var(--color-text-secondary)]">
                  Your picture is visible across Google products.
                </div>
                <BlueLink>Change picture</BlueLink>
              </div>
            </div>
          </SettingRow>

          {/* Create contacts for auto-complete */}
          <SettingRow
            label="Create contacts for auto-complete"
            description="Gmail can automatically add contacts when you reply to messages."
          >
            <SettingRadioGroup
              defaultValue="auto-add"
              options={[
                {
                  value: "auto-add",
                  label: "When I send a message to a new person, add them to Other Contacts so that I can auto-complete to them next time",
                },
                { value: "manual", label: "I'll add contacts myself" },
              ]}
            />
          </SettingRow>

          {/* Importance signals for ads */}
          <SettingRow
            label="Importance signals for ads"
            description={
              <>
                Gmail may use your actions as importance signals to show you
                more relevant ads.{" "}
                <BlueLink>Learn more</BlueLink>
              </>
            }
          >
            <SettingCheckbox
              checked
              label="Use my actions and information from messages I receive to personalize ads"
            />
          </SettingRow>

          {/* Signature */}
          <SettingRow label="Signature">
            <div className="w-full space-y-2">
              <div className="text-xs text-[var(--color-text-tertiary)]">
                No signatures yet.{" "}
                <BlueLink>Create new</BlueLink>
              </div>
              <div className="rounded-[var(--radius-sm)] border border-[var(--color-border-default)]">
                <div className="flex items-center gap-1 border-b border-[var(--color-border-default)] px-2 py-1">
                  <ToolbarButton>B</ToolbarButton>
                  <ToolbarButton>
                    <span className="italic">I</span>
                  </ToolbarButton>
                  <ToolbarButton>
                    <span className="underline">U</span>
                  </ToolbarButton>
                  <Separator orientation="vertical" className="mx-0.5 h-5" />
                  <ToolbarButton>A</ToolbarButton>
                  <ToolbarButton>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10H7" /><path d="M21 6H3" /><path d="M21 14H3" /><path d="M21 18H7" /></svg>
                  </ToolbarButton>
                  <ToolbarButton>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                  </ToolbarButton>
                  <ToolbarButton>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                  </ToolbarButton>
                </div>
                <div className="h-24 px-3 py-2 text-sm text-[var(--color-text-tertiary)]">
                  (No signature)
                </div>
              </div>
            </div>
          </SettingRow>

          {/* Personal level indicators */}
          <SettingRow
            label="Personal level indicators"
            description={
              <>
                Indicators show whether a message was sent to just you or a
                group. <BlueLink>Learn more</BlueLink>
              </>
            }
          >
            <SettingRadioGroup
              defaultValue="No indicators"
              options={[
                { value: "No indicators", label: "No indicators" },
                { value: "Show indicators", label: "Show indicators" },
              ]}
            />
          </SettingRow>

          {/* Snippets */}
          <SettingRow label="Snippets">
            <SettingRadioGroup
              defaultValue="Show snippets"
              options={[
                {
                  value: "Show snippets",
                  label: "Show snippets",
                  description: "Show snippets of the message text in your inbox.",
                },
                { value: "No snippets", label: "No snippets" },
              ]}
            />
          </SettingRow>

          {/* Vacation responder */}
          <SettingRow label="Vacation responder">
            <div className="space-y-3">
              <SettingRadioGroup
                defaultValue="Vacation responder off"
                options={[
                  { value: "Vacation responder off", label: "Vacation responder off" },
                  { value: "Vacation responder on", label: "Vacation responder on" },
                ]}
              />
              <div className="space-y-2 rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--color-text-tertiary)]">
                    First day:
                  </span>
                  <SettingSelect value="Feb 8, 2026" />
                </div>
                <div className="flex items-center gap-2">
                  <SettingCheckbox checked={false} label="Last day:" />
                  <SettingSelect value="Feb 15, 2026" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-[var(--color-text-tertiary)]">
                    Subject:
                  </div>
                  <div className="rounded-[var(--radius-xs)] border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-sm text-[var(--color-text-tertiary)]">
                    Out of office
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-[var(--color-text-tertiary)]">
                    Message:
                  </div>
                  <div className="h-20 rounded-[var(--radius-xs)] border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-sm text-[var(--color-text-tertiary)]" />
                </div>
                <SettingCheckbox
                  checked={false}
                  label="Only send a response to people in my Contacts"
                />
              </div>
            </div>
          </SettingRow>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center gap-3 border-t border-[var(--color-border-default)] bg-[var(--color-bg-primary)] px-4 py-4 mt-0">
          <Button size="sm">Save Changes</Button>
          <Button variant="outline" size="sm">Cancel</Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Reusable Setting Components ─────────────────────────────────────────── */

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-6 px-2 py-3.5">
      <div className="w-44 shrink-0 pt-0.5">
        <div className="text-sm font-medium text-[var(--color-text-primary)]">
          {label}
        </div>
        {description && (
          <div className="mt-0.5 text-xs leading-relaxed text-[var(--color-text-tertiary)]">
            {description}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function SettingRadioGroup({
  defaultValue,
  options,
}: {
  defaultValue: string;
  options: Array<{ value: string; label: string; description?: string }>;
}) {
  return (
    <RadioGroup defaultValue={defaultValue} className="gap-1">
      {options.map((opt) => {
        const id = `radio-${opt.value.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().slice(0, 40)}`;
        return (
          <div key={opt.value} className="flex items-start gap-2 py-0.5">
            <RadioGroupItem value={opt.value} id={id} className="mt-0.5" />
            <div>
              <Label htmlFor={id} className="text-sm font-normal text-[var(--color-text-secondary)] cursor-pointer">
                {opt.label}
              </Label>
              {opt.description && (
                <div className="text-xs text-[var(--color-text-tertiary)]">{opt.description}</div>
              )}
            </div>
          </div>
        );
      })}
    </RadioGroup>
  );
}

function SettingCheckbox({
  checked,
  label,
  description,
}: {
  checked: boolean;
  label: string;
  description?: string;
}) {
  const id = `cb-${label.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().slice(0, 40)}`;
  return (
    <div className="flex items-start gap-2 py-0.5">
      <Checkbox id={id} defaultChecked={checked} className="mt-0.5" />
      <div>
        <Label htmlFor={id} className="text-sm font-normal text-[var(--color-text-secondary)] cursor-pointer">
          {label}
        </Label>
        {description && (
          <div className="text-xs text-[var(--color-text-tertiary)]">{description}</div>
        )}
      </div>
    </div>
  );
}

function SettingSelect({ value, options }: { value: string; options?: string[] }) {
  const items = options ?? [value];
  return (
    <Select defaultValue={value}>
      <SelectTrigger size="sm" className="h-8 w-auto gap-1 text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function BlueLink({ children }: { children: React.ReactNode }) {
  return (
    <span className="cursor-pointer text-xs text-blue-600 underline dark:text-blue-400">
      {children}
    </span>
  );
}

function ToolbarButton({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-7 cursor-pointer items-center justify-center rounded-[var(--radius-xs)] text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]">
      {children}
    </div>
  );
}

function StarIcon({ color }: { color: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={color}
      stroke={color}
      strokeWidth="1"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
