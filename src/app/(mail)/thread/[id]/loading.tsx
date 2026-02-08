export default function ThreadLoading() {
  return (
    <div className="flex h-full flex-col">
      {/* Toolbar skeleton */}
      <div className="flex shrink-0 items-center gap-1 border-b border-[var(--color-border-subtle)] px-4 py-2">
        <div className="skeleton h-5 w-5 rounded-[var(--radius-full)]" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="skeleton h-5 w-5 rounded-[var(--radius-full)]"
          />
        ))}
      </div>

      {/* Thread header skeleton */}
      <div className="shrink-0 border-b border-[var(--color-border-subtle)] px-6 py-4">
        <div className="skeleton h-6 w-80" />
        <div className="mt-2 flex gap-1.5">
          <div className="skeleton h-5 w-14 rounded-[var(--radius-xs)]" />
          <div className="skeleton h-5 w-16 rounded-[var(--radius-xs)]" />
        </div>
      </div>

      {/* Messages skeleton */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-4 px-6 py-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <MessageSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageSkeleton() {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]">
      {/* Header */}
      <div className="flex items-start gap-3 px-5 py-4">
        <div className="skeleton h-10 w-10 shrink-0 rounded-[var(--radius-full)]" />
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <div className="skeleton h-4 w-28" />
            <div className="skeleton h-3 w-40" />
          </div>
          <div className="skeleton mt-1 h-3 w-24" />
        </div>
        <div className="skeleton h-3 w-16 shrink-0" />
      </div>

      {/* Body */}
      <div className="space-y-2 px-5 pb-5 pl-[4.25rem]">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton mt-4 h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
      </div>
    </div>
  );
}
