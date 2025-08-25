import { Skeleton } from "@/components/ui/skeleton"

export function PostActivitySkeleton() {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-6 w-8" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-6 w-10" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-12" />
        </div>
      </div>
      
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2 p-3 rounded-lg bg-muted/50">
            <div className="flex justify-between items-start">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-3 w-full" />
            <div className="flex justify-between items-center">
              <div className="flex space-x-3">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t">
        <Skeleton className="h-4 w-24" />
      </div>
    </>
  )
}
