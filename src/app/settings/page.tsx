import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-[var(--color-border-subtle)] px-6 py-4">
        <Link
          href="/"
          className="rounded-[var(--radius-full)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
          aria-label="Back"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <h1 className="text-xl font-normal text-[var(--color-text-primary)]">
          Settings
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-6">
          {/* General */}
          <SettingsSection title="General">
            <SettingRow label="Language" description="Display language for the interface">
              <SelectPlaceholder value="English" />
            </SettingRow>
            <SettingRow label="Maximum page size" description="Show this many conversations per page">
              <SelectPlaceholder value="50" />
            </SettingRow>
            <SettingRow label="Undo send" description="Time to cancel a sent message">
              <SelectPlaceholder value="5 seconds" />
            </SettingRow>
            <SettingRow label="Default reply behavior" description="Choose default reply action">
              <SelectPlaceholder value="Reply" />
            </SettingRow>
          </SettingsSection>

          {/* Labels */}
          <SettingsSection title="Labels">
            <SettingRow label="Show starred" description="Display starred label in sidebar">
              <TogglePlaceholder checked />
            </SettingRow>
            <SettingRow label="Show important" description="Display important label in sidebar">
              <TogglePlaceholder checked />
            </SettingRow>
            <SettingRow label="Show all mail" description="Display all mail label in sidebar">
              <TogglePlaceholder checked={false} />
            </SettingRow>
          </SettingsSection>

          {/* Inbox */}
          <SettingsSection title="Inbox">
            <SettingRow label="Inbox type" description="Choose how your inbox is organized">
              <SelectPlaceholder value="Default" />
            </SettingRow>
            <SettingRow label="Categories" description="Tabs shown in inbox">
              <SelectPlaceholder value="Primary, Social, Promotions" />
            </SettingRow>
            <SettingRow label="Reading pane" description="Where to show message content">
              <SelectPlaceholder value="No split" />
            </SettingRow>
          </SettingsSection>

          {/* Appearance */}
          <SettingsSection title="Appearance">
            <SettingRow label="Density" description="Spacing between inbox rows">
              <SelectPlaceholder value="Default" />
            </SettingRow>
            <SettingRow label="Theme" description="Light or dark mode">
              <SelectPlaceholder value="System" />
            </SettingRow>
          </SettingsSection>

          {/* Notifications */}
          <SettingsSection title="Notifications">
            <SettingRow label="Desktop notifications" description="Show browser notifications for new mail">
              <TogglePlaceholder checked={false} />
            </SettingRow>
            <SettingRow label="Notification sounds" description="Play a sound for new messages">
              <TogglePlaceholder checked />
            </SettingRow>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
        {title}
      </h2>
      <div className="divide-y divide-[var(--color-border-subtle)] rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]">
        {children}
      </div>
    </div>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div className="min-w-0">
        <div className="text-sm font-medium text-[var(--color-text-primary)]">
          {label}
        </div>
        <div className="text-xs text-[var(--color-text-tertiary)]">
          {description}
        </div>
      </div>
      {children}
    </div>
  );
}

function SelectPlaceholder({ value }: { value: string }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-sm text-[var(--color-text-secondary)]">
      {value}
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}

function TogglePlaceholder({ checked }: { checked: boolean }) {
  return (
    <div
      className={`flex h-5 w-9 shrink-0 items-center rounded-[var(--radius-full)] px-0.5 transition-[var(--transition-fast)] ${
        checked
          ? "bg-[var(--color-accent-primary)]"
          : "bg-[var(--color-bg-sunken)]"
      }`}
    >
      <div
        className={`h-4 w-4 rounded-[var(--radius-full)] bg-white shadow-[var(--shadow-xs)] transition-[var(--transition-fast)] ${
          checked ? "translate-x-3.5" : "translate-x-0"
        }`}
      />
    </div>
  );
}
