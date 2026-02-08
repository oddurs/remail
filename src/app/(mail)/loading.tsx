export default function InboxLoading() {
  return (
    <div className="flex flex-col">
      {/* Category tabs skeleton */}
      <div className="flex border-b border-[var(--color-border-subtle)]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 px-6 py-3.5">
            <div className="skeleton h-4 w-16" />
          </div>
        ))}
      </div>

      {/* Toolbar skeleton */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] px-4 py-2">
        <div className="skeleton h-5 w-5 rounded-[var(--radius-xs)]" />
        <div className="skeleton h-5 w-5 rounded-[var(--radius-full)]" />
        <div className="skeleton h-5 w-5 rounded-[var(--radius-full)]" />
        <div className="flex-1" />
        <div className="skeleton h-4 w-20" />
      </div>

      {/* Email rows skeleton */}
      <div className="divide-y divide-[var(--color-border-subtle)]">
        {Array.from({ length: 15 }).map((_, i) => (
          <EmailRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function EmailRowSkeleton() {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5">
      {/* Checkbox */}
      <div className="skeleton h-4 w-4 shrink-0 rounded-[var(--radius-xs)]" />
      {/* Star */}
      <div className="skeleton h-4 w-4 shrink-0 rounded-[var(--radius-full)]" />
      {/* Sender */}
      <div className="skeleton h-4 w-36 shrink-0" />
      {/* Subject + snippet */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="skeleton h-4 w-40 shrink-0" />
        <div className="skeleton h-4 flex-1" />
      </div>
      {/* Time */}
      <div className="skeleton h-3.5 w-12 shrink-0" />
    </div>
  );
}
