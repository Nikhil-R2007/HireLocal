import React from 'react';

export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

export const WorkerCardSkeleton = () => (
  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex gap-6">
    <Skeleton className="w-20 h-20 rounded-2xl" />
    <div className="flex-1 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  </div>
);
