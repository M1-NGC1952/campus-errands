import { cn } from '@/lib/utils';

export function TaskCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="h-5 w-14 animate-pulse rounded-full bg-slate-200" />
      </div>
      <div className="mb-3 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-2">
        <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-10 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
}

export function TaskListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="px-4 pt-4">
      <div className="mb-4 rounded-2xl bg-slate-200 p-5">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 animate-pulse rounded-full bg-slate-300" />
          <div className="space-y-2">
            <div className="h-5 w-24 animate-pulse rounded bg-slate-300" />
            <div className="h-3 w-20 animate-pulse rounded bg-slate-300" />
          </div>
        </div>
      </div>
      <div className="mb-4 rounded-xl bg-slate-200 p-4">
        <div className="h-4 w-16 animate-pulse rounded bg-slate-300" />
        <div className="mt-2 h-8 w-20 animate-pulse rounded bg-slate-300" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
