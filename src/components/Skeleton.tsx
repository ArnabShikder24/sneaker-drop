interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-lg bg-zinc-800/70 ${className}`} />
  );
}

/** Full drop-card sized skeleton for the loading state */
export function DropCardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-4 w-28 mt-1" />
      <div className="mt-auto pt-4 border-t border-zinc-800 flex gap-2">
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
      <Skeleton className="h-10 w-full mt-2" />
    </div>
  );
}