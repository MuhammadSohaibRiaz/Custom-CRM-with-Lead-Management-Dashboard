'use client';

import { cn } from '@/lib/utils';

export default function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-lg bg-gray-200', className)} />
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="space-y-3">
        <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-1/2 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}
