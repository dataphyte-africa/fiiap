import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ResourceCardSkeleton() {
  return (
    <Card className="h-full">
      <CardContent className="p-0">
        {/* Image Skeleton */}
        <Skeleton className="h-48 w-full rounded-t-lg" />
        
        {/* Content Skeleton */}
        <div className="p-6 space-y-4">
          {/* Title Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Details Skeleton */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          {/* Tags Skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-14" />
          </div>

          {/* Buttons Skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ResourceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ResourceCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ResourceCarouselSkeleton() {
  return (
    <div className="relative w-full">
      <Card className="h-[500px] border-0 shadow-lg">
        <CardContent className="p-0 h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            {/* Image Section Skeleton */}
            <Skeleton className="h-64 md:h-full" />

            {/* Content Section Skeleton */}
            <div className="p-8 flex flex-col justify-center">
              <div className="space-y-4">
                {/* Badge Skeleton */}
                <Skeleton className="h-6 w-24" />

                {/* Title Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-3/4" />
                </div>

                {/* Description Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                </div>

                {/* Details Skeleton */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-5 w-28" />
                  </div>
                </div>

                {/* Tags Skeleton */}
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-14" />
                </div>

                {/* Buttons Skeleton */}
                <div className="flex gap-3 pt-4">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-12 w-28" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dots Indicator Skeleton */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-3 h-3 rounded-full" />
        ))}
      </div>
    </div>
  );
}
