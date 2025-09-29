import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedBlogPostsSkeleton() {
  return (
    <div className="w-full py-16 px-4 md:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Title and Subtitle Skeleton */}
        <div className="text-center mb-12">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
        </div>

        {/* Blog Posts Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="h-full flex flex-col">
              {/* Featured Image Skeleton */}
              <div className="relative h-48 overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>

              <CardContent className="p-6 flex-1">
                {/* Title Skeleton */}
                <Skeleton className="h-6 w-full mb-3" />
                <Skeleton className="h-6 w-3/4 mb-4" />

                {/* Excerpt Skeleton */}
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />

                {/* Author and Date Skeleton */}
                <div className="flex items-center space-x-3 mb-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>

                {/* Tags Skeleton */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </CardContent>

              {/* Footer Skeleton */}
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button Skeleton */}
        <div className="text-center">
          <Skeleton className="h-10 w-32 mx-auto" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedForumPostsSkeleton() {
  return (
    <div className="w-full py-16 px-4 md:px-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Title and Subtitle Skeleton */}
        <div className="text-center mb-12">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
        </div>

        {/* Forum Posts Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-24 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </div>
                
                {/* Category Badge Skeleton */}
                <div className="flex items-center gap-2 mt-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </CardHeader>

              <CardContent className="px-6 pb-4 flex-1">
                {/* Title Skeleton */}
                <Skeleton className="h-6 w-full mb-3" />
                <Skeleton className="h-6 w-2/3 mb-4" />

                {/* Content Skeleton */}
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />

                {/* Tags Skeleton */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Skeleton className="h-5 w-14 rounded-md" />
                  <Skeleton className="h-5 w-18 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                </div>

                {/* Stats Skeleton */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="h-3 w-6" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="h-3 w-6" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="h-3 w-6" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button Skeleton */}
        <div className="text-center">
          <Skeleton className="h-10 w-32 mx-auto" />
        </div>
      </div>
    </div>
  );
}
