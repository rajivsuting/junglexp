import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Skeleton components for loading states
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export default function StaysLoading() {
  return (
    <div className="min-h-screen">
      {/* Header Section Skeleton */}
      <div className="text-primary py-16">
        <div className="container mx-auto px-4">
          {/* Title skeleton */}
          <div className="flex justify-center mb-4">
            <Skeleton className="h-8 md:h-10 w-80 md:w-96" />
          </div>

          {/* Description skeletons */}
          <div className="max-w-4xl mx-auto space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>

          {/* Additional text skeletons */}
          <div className="flex justify-center mt-4">
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex justify-center mt-2">
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
      </div>

      {/* Hotels Grid Skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Generate 6 skeleton cards */}
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden bg-white pt-0">
              {/* Image Section Skeleton */}
              <div className="relative">
                <Skeleton className="h-64 w-full" />
                {/* Price badge skeleton */}
                <div className="absolute top-4 left-4">
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              </div>

              <CardContent className="p-6">
                {/* Hotel Name Skeleton */}
                <div className="flex justify-center mb-2">
                  <Skeleton className="h-6 w-48" />
                </div>

                {/* Star Rating Skeleton */}
                <div className="flex justify-center mb-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Skeleton key={star} className="w-4 h-4" />
                    ))}
                  </div>
                </div>

                {/* Description Skeleton */}
                <div className="space-y-2 mb-6">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4 mx-auto" />
                </div>

                {/* Divider */}
                <Separator className="mb-4" />

                {/* Pricing Skeleton */}
                <div className="text-center mb-4">
                  <Skeleton className="h-6 w-40 mx-auto mb-1" />
                  <Skeleton className="h-3 w-32 mx-auto" />
                </div>
              </CardContent>

              <CardFooter className="pt-0 justify-center">
                <Skeleton className="h-4 w-28" />
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Contact Section Skeleton */}
        <Card className="mt-16 max-w-4xl mx-auto">
          <div className="text-center p-6">
            <Skeleton className="h-8 w-80 mx-auto mb-4" />
            <div className="space-y-2 mb-6">
              <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
              <Skeleton className="h-4 w-3/4 max-w-xl mx-auto" />
            </div>
          </div>
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>

        {/* Navigation Links Skeleton */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
