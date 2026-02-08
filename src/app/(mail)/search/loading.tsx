export default function SearchLoading() {
  return (
    <div className="flex flex-col">
      {/* Search header skeleton */}
      <div className="border-b border-[var(--color-border-subtle)] px-4 py-3">
        <div className="skeleton h-4 w-48" />
      </div>

      {/* Results skeleton */}
      <div className="divide-y divide-[var(--color-border-subtle)]">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 px-4 py-2.5">
            <div className="skeleton h-4 w-4 shrink-0 rounded-[var(--radius-xs)]" />
            <div className="skeleton h-4 w-4 shrink-0 rounded-[var(--radius-full)]" />
            <div className="skeleton h-4 w-36 shrink-0" />
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="skeleton h-4 w-40 shrink-0" />
              <div className="skeleton h-4 flex-1" />
            </div>
            <div className="skeleton h-3.5 w-12 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
