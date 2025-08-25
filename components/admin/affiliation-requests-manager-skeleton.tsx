import { Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function AffiliationRequestsManagerSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Affiliation Requests
          <Badge variant="secondary" className="ml-2">
            <div className="h-4 w-6 bg-muted rounded animate-pulse"></div>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pending Requests Section Skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-muted"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-32"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 bg-muted rounded"></div>
                    <div className="h-5 w-16 bg-muted rounded"></div>
                  </div>
                </div>
                
                <div className="mb-3 p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-4 w-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-32"></div>
                  </div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <div className="h-3 bg-muted rounded w-24"></div>
                </div>
                
                <div className="h-8 bg-muted rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Other Requests Section Skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded w-28 animate-pulse"></div>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-muted"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-28"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 bg-muted rounded"></div>
                    <div className="h-5 w-20 bg-muted rounded"></div>
                  </div>
                </div>
                
                <div className="mb-3 p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-4 w-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-28"></div>
                  </div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="h-3 bg-muted rounded w-24"></div>
                  <div className="h-3 bg-muted rounded w-28"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
