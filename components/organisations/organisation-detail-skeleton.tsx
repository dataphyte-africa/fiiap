import { Skeleton } from "@/components/ui/skeleton";

export function OrganisationDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header Section Skeleton */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Logo Skeleton */}
            <div className="flex-shrink-0">
              <Skeleton className="h-20 w-20 rounded-lg bg-white/20" />
            </div>
            
            {/* Organisation Info Skeleton */}
            <div className="flex-1">
              <Skeleton className="h-8 w-64 mb-2 bg-white/20" />
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <Skeleton className="h-4 w-32 bg-white/20" />
                <Skeleton className="h-4 w-40 bg-white/20" />
              </div>
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-4 w-24 bg-white/20" />
                <Skeleton className="h-4 w-20 bg-white/20" />
                <Skeleton className="h-4 w-28 bg-white/20" />
              </div>
            </div>

            {/* Action Button Skeleton */}
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24 bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Side Navigation Skeleton */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="space-y-1">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3 px-3 py-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content Skeleton */}
          <div className="flex-1 space-y-6">
            {/* About Organization Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-5 w-16 mb-2" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-5 w-12 mb-2" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Thematic Focus Areas Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-6 w-20" />
                ))}
              </div>
            </div>

            {/* Languages Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton key={index} className="h-6 w-16" />
                ))}
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 