import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 font-sans min-h-screen">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs Skeleton */}
        <div className="mb-8 flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <span className="text-muted-foreground">/</span>
          <Skeleton className="h-4 w-12" />
          <span className="text-muted-foreground">/</span>
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Category Badge Skeleton */}
        <div className="mb-4">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Title Skeleton */}
        <div className="mb-6 space-y-2">
          <Skeleton className="h-8 w-3/4 md:h-10 lg:h-12" />
          <Skeleton className="h-8 w-1/2 md:h-10 lg:h-12" />
        </div>

        {/* Meta Info Skeleton */}
        <div className="mb-12 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-primary/20 pb-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-4 w-4 rounded-full" />
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>

      {/* Featured Image Skeleton */}
      <div className="w-full mx-auto mb-16">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
          <Skeleton className="h-full w-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="mx-auto space-y-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />

        <div className="py-8">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
        </div>

        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </article>
  );
}
