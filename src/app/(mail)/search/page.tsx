import { searchEmails } from "@/lib/queries/search";
import { EmailList } from "../email-list";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  if (!q || !q.trim()) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
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
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            Search your mail
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
            Enter a search term to find emails
          </p>
        </div>
      </div>
    );
  }

  const results = await searchEmails(q);

  return (
    <div className="flex flex-col">
      {/* Search header */}
      <div className="border-b border-[var(--color-border-subtle)] px-4 py-3">
        <span className="text-sm text-[var(--color-text-secondary)]">
          {results.length === 0
            ? "No results"
            : `${results.length} result${results.length === 1 ? "" : "s"}`}{" "}
          for &ldquo;
          <span className="font-medium text-[var(--color-text-primary)]">
            {q}
          </span>
          &rdquo;
        </span>
      </div>

      <EmailList
        emails={results}
        emptyIcon={
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        }
        emptyTitle="No results found"
        emptyDescription={`Nothing matched "${q}". Try different keywords.`}
      />
    </div>
  );
}
