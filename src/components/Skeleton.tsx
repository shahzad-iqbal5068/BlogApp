"use client";

export function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-700/60 ${className}`}
      {...props}
    />
  );
}

export function BlogCardSkeleton() {
  return (
    <article className="flex flex-col gap-4">
      <Skeleton className="aspect-video w-full rounded-lg" />
      <Skeleton className="h-6 w-[75%]" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </article>
  );
}

export function BlogListSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      {[1, 2, 3].map((i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PostSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6">
      <Skeleton className="h-12 w-full" />
      <div className="flex gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
      </div>
    </div>
  );
}
