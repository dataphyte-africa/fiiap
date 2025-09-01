'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function BlogPostCardSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      {/* Featured Image Skeleton */}
      <Skeleton className="h-48 w-full" />
      
      <CardContent className="p-6 flex-1">
        <div className="space-y-3">
          {/* Organization Skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Title Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>

          {/* Excerpt Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Tags Skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-14" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 space-y-4">
        {/* Meta Information Skeleton */}
        <div className="flex gap-4 w-full">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Stats and Action Skeleton */}
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      </CardFooter>
    </Card>
  );
}

export function BlogPostGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <BlogPostCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function BlogPostCarouselSkeleton() {
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
                {/* Featured Badge Skeleton */}
                <Skeleton className="h-6 w-24" />

                {/* Title Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-3/4" />
                </div>

                {/* Excerpt Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                </div>

                {/* Meta Information Skeleton */}
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>

                {/* Tags Skeleton */}
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-14" />
                </div>

                {/* Button Skeleton */}
                <Skeleton className="h-10 w-32 mt-4" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dots Indicator Skeleton */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="w-3 h-3 rounded-full" />
        ))}
      </div>
    </div>
  );
}
