import Link from "next/link";

export default function ThreadNotFound() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-bg-tertiary)]">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[var(--color-text-tertiary)]"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>
        <h1 className="text-lg font-medium text-[var(--color-text-primary)]">
          Thread not found
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
          This conversation may have been deleted or doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-[var(--radius-full)] bg-[var(--color-accent-primary)] px-5 py-2 text-sm font-medium text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)] transition-[var(--transition-fast)]"
        >
          Back to Inbox
        </Link>
      </div>
    </div>
  );
}
