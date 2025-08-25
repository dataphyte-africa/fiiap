
import { FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from "react"
import { PostActivityData } from "@/components/dashboard/post-activity-data"
import { PostActivitySkeleton } from "@/components/dashboard/post-activity-skeleton"
import { cn } from "@/lib/utils"

interface PostActivityCardProps {
  organisationId: string;
  className?: string;
}

export function PostActivityCard({
  organisationId,
  className,
}: PostActivityCardProps) {
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Posts</CardTitle>
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Suspense fallback={<PostActivitySkeleton />}>
          <PostActivityData organisationId={organisationId} />
        </Suspense>
      </CardContent>
    </Card>
  )
} 