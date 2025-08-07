import { Skeleton } from "@/components/ui/skeleton";

interface OrganisationsGridSkeletonProps {
  count?: number;
}

export function OrganisationsGridSkeleton({ count = 12 }: OrganisationsGridSkeletonProps) {
  return (
    <div className="w-full">
      {/* Results header skeleton */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-40" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
            {/* Header with logo and name */}
            <div className="flex items-start gap-4 mb-4">
              <Skeleton className="h-[60px] w-[60px] rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <Skeleton className="h-5 w-full mb-2" />
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center">
                <Skeleton className="h-4 w-4 mr-1" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center">
                <Skeleton className="h-4 w-4 mr-1" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center items-center space-x-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
} 