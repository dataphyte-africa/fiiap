import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function AdminUsersTableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-20" />
          </div>
        </CardContent>
      </Card>

      {/* Table Skeleton */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="border rounded-lg">
              {/* Table Header */}
              <div className="bg-gray-50 border-b">
                <div className="grid grid-cols-5 gap-4 p-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>

              {/* Table Rows */}
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="border-b last:border-b-0">
                  <div className="grid grid-cols-5 gap-4 p-4">
                    {/* User Column */}
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    
                    {/* Role Column */}
                    <Skeleton className="h-6 w-20" />
                    
                    {/* Organisation Column */}
                    <Skeleton className="h-4 w-28" />
                    
                    {/* Date Column */}
                    <Skeleton className="h-4 w-16" />
                    
                    {/* Actions Column */}
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Skeleton */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
