import { cn } from '@/utils/cn';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-lg', className)} />;
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <Skeleton className="h-8 w-8 rounded-lg" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-7 w-20" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}
