interface FundingOpportunitySkeletonProps {
  count?: number;
}

export function FundingOpportunityGridSkeleton({ count = 6 }: FundingOpportunitySkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <FundingOpportunityCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function FundingOpportunityCarouselSkeleton() {
  return (
    <div className="relative">
      <div className="max-w-md mx-auto">
        <FundingOpportunityCardSkeleton />
      </div>
      
      {/* Navigation buttons skeleton */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
      </div>
      
      {/* Dots skeleton */}
      <div className="flex justify-center space-x-2 mt-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="w-3 h-3 bg-gray-200 rounded-full animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function FundingOpportunityCardSkeleton() {
  return (
    <div className="h-full border border-gray-200 rounded-lg overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-200" />
      
      {/* Content skeleton */}
      <div className="p-6">
        {/* Title skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
        
        {/* Funder skeleton */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gray-200 rounded" />
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
            <div className="h-3 bg-gray-200 rounded w-16" />
          </div>
        </div>
        
        {/* Details skeleton */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-28" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-36" />
          </div>
        </div>
        
        {/* Tags skeleton */}
        <div className="flex gap-1 mb-6">
          <div className="h-6 bg-gray-200 rounded-full w-16" />
          <div className="h-6 bg-gray-200 rounded-full w-20" />
          <div className="h-6 bg-gray-200 rounded-full w-12" />
        </div>
        
        {/* Buttons skeleton */}
        <div className="flex gap-2 mb-4">
          <div className="h-8 bg-gray-200 rounded flex-1" />
          <div className="h-8 bg-gray-200 rounded w-20" />
        </div>
        
        {/* Stats skeleton */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="h-3 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
