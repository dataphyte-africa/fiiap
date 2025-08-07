"use client"

import { FileText, Eye, Heart, MessageCircle, Plus, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface PostData {
  id: string
  title: string
  excerpt?: string
  status: string
  published_at?: string
  view_count?: number
  like_count?: number
  comment_count?: number
  category?: string
}

interface PostActivityCardProps {
  posts?: PostData[]
  totalPosts?: number
  loading?: boolean
  className?: string
 
}
const mockPosts = [
  {
    id: "1",
    title: "Successfully completed first phase of water project",
    excerpt: "We've reached our milestone of providing clean water access to 1,000 families in rural communities.",
    status: "published",
    published_at: "2024-01-20T10:00:00Z",
    view_count: 245,
    like_count: 12,
    comment_count: 5,
    category: "Project Update"
  },
  {
    id: "2",
    title: "Upcoming community workshop on sustainable farming",
    excerpt: "Join us for a hands-on workshop about sustainable farming techniques and climate adaptation.",
    status: "published", 
    published_at: "2024-01-18T14:30:00Z",
    view_count: 89,
    like_count: 8,
    comment_count: 3,
    category: "Event"
  },
  {
    id: "3",
    title: "Draft: Annual impact report 2024",
    excerpt: "Comprehensive overview of our achievements and impact throughout 2024.",
    status: "draft",
    published_at: "2024-01-15T09:00:00Z",
    view_count: 0,
    like_count: 0,
    comment_count: 0,
    category: "Report"
  }
]
export function PostActivityCard({
  posts = mockPosts,
  totalPosts = 0,
  loading = false,
  className,

}: PostActivityCardProps) {
  if (loading) {
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
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-6 w-8" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-6 w-10" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-3 w-full" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 w-24" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (posts.length === 0) {
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
        <CardContent className="text-center py-8">
          <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-sm mb-2">No Posts Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Share updates about your projects and engage with the community.
          </p>
          <Button  size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Create Post
          </Button>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      published: "bg-green-100 text-green-800",
      archived: "bg-yellow-100 text-yellow-800",
      flagged: "bg-red-100 text-red-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const publishedPosts = posts.filter(p => p.status === 'published').length
  const draftPosts = posts.filter(p => p.status === 'draft').length
  const totalViews = posts.reduce((sum, post) => sum + (post.view_count || 0), 0)

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Posts</CardTitle>
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Published</p>
            <p className="text-xl font-bold text-green-600">{publishedPosts}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Drafts</p>
            <p className="text-xl font-bold text-gray-600">{draftPosts}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Views</p>
            <p className="text-xl font-bold text-blue-600">{totalViews.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-3">
          {posts.slice(0, 3).map((post) => (
            <div key={post.id} className="space-y-2 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-sm truncate flex-1 mr-2">{post.title}</h4>
                <Badge variant="secondary" className={cn("text-xs", getStatusColor(post.status))}>
                  {post.status}
                </Badge>
              </div>
              
              {post.excerpt && (
                <p className="text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-3">
                  {post.view_count !== undefined && (
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {post.view_count}
                    </div>
                  )}
                  {post.like_count !== undefined && post.like_count > 0 && (
                    <div className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {post.like_count}
                    </div>
                  )}
                  {post.comment_count !== undefined && post.comment_count > 0 && (
                    <div className="flex items-center">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      {post.comment_count}
                    </div>
                  )}
                </div>
                {post.published_at && (
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTimeAgo(post.published_at)}
                  </div>
                )}
              </div>

              {post.category && (
                <div className="flex items-center">
                  <Badge variant="outline" className="text-xs">
                    {post.category}
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center text-sm text-muted-foreground">
            <FileText className="h-4 w-4 mr-1" />
            {totalPosts} total posts
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              
            >
              <Plus className="h-3 w-3 mr-1" />
              New Post
            </Button>
            <Button
              variant="outline"
              size="sm"
              
            >
              View All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 