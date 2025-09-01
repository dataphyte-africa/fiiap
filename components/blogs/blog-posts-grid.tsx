/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Eye, 
  Heart, 
  MessageCircle, 
  Calendar, 
  Edit, 
  MoreHorizontal,
  Plus,
  Star,
  Clock
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getBlogPosts, type BlogPostFilters, type BlogPostWithAuthor } from '@/lib/data/blogs';
import { format } from 'date-fns';
import Link from 'next/link';

interface BlogPostsGridProps {
  organisationId: string;
  onEditPost?: (postId: string) => void;
  onDeletePost?: (postId: string) => void;
}

export function BlogPostsGrid({ organisationId, onEditPost, onDeletePost }: BlogPostsGridProps) {
  const [filters, setFilters] = useState<BlogPostFilters>({
    organisation_id: organisationId,
    page: 1,
    limit: 12,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: blogPostsResult,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['blog-posts', filters],
    queryFn: () => getBlogPosts(filters),
  });

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm.trim() || undefined,
      page: 1,
    }));
  };

  const handleFilterChange = (key: keyof BlogPostFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

//   const getStatusBadgeVariant = (status: string) => {
//     switch (status) {
//       case 'published':
//         return 'default';
//       case 'draft':
//         return 'secondary';
//       case 'archived':
//         return 'outline';
//       case 'flagged':
//         return 'destructive';
//       default:
//         return 'secondary';
//     }
//   };

//   const getModerationStatusBadgeVariant = (status: string) => {
//     switch (status) {
//       case 'approved':
//         return 'default';
//       case 'flagged':
//         return 'destructive';
//       case 'rejected':
//         return 'destructive';
//       default:
//         return 'secondary';
//     }
//   };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-600 mb-4">Failed to load blog posts</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Blog Posts</h2>
          <p className="text-gray-600">
            {blogPostsResult ? `${blogPostsResult.count} posts total` : 'Loading...'}
          </p>
        </div>
          <Button asChild>
        <Link href={`/dashboard/blogs/new`}>
            <Plus className="h-4 w-4 mr-2" />
            New Post
        </Link>
          </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} variant="outline">
                  Search
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => 
                  handleFilterChange('status', value === 'all' ? undefined : value)
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.is_featured === undefined ? 'all' : filters.is_featured.toString()}
                onValueChange={(value) => 
                  handleFilterChange('is_featured', value === 'all' ? undefined : value === 'true')
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Featured" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts</SelectItem>
                  <SelectItem value="true">Featured</SelectItem>
                  <SelectItem value="false">Regular</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={(value) => {
                  const [sortBy, sortOrder] = value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at-desc">Newest First</SelectItem>
                  <SelectItem value="created_at-asc">Oldest First</SelectItem>
                  <SelectItem value="updated_at-desc">Recently Updated</SelectItem>
                  <SelectItem value="title-asc">Title A-Z</SelectItem>
                  <SelectItem value="title-desc">Title Z-A</SelectItem>
                  <SelectItem value="view_count-desc">Most Viewed</SelectItem>
                  <SelectItem value="like_count-desc">Most Liked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blog Posts Grid */}
      {isLoading ? (
        <BlogPostsGridSkeleton />
      ) : (
        <>
          {blogPostsResult && blogPostsResult.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPostsResult.data.map((post) => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  onEdit={() => onEditPost?.(post.id)}
                  onDelete={() => onDeletePost?.(post.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">No blog posts found</h3>
                <p className="text-gray-600 mb-4">
                  {filters.search || filters.status 
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "Get started by creating your first blog post."
                  }
                </p>
                <Link href="/dashboard/blogs/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Post
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Pagination */}
          {blogPostsResult && blogPostsResult.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(blogPostsResult.currentPage - 1)}
                disabled={!blogPostsResult.hasPrevPage}
              >
                Previous
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: blogPostsResult.totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === blogPostsResult.currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(blogPostsResult.currentPage + 1)}
                disabled={!blogPostsResult.hasNextPage}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Blog Post Card Component
function BlogPostCard({ 
  post, 
  onEdit, 
  onDelete 
}: { 
  post: BlogPostWithAuthor; 
  onEdit: () => void; 
  onDelete: () => void; 
}) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'archived': return 'outline';
      case 'flagged': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={getStatusBadgeVariant(post.status || '')}>
                {post.status}
              </Badge>
              {post.is_featured && (
                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {post.moderation_status === 'flagged' && (
                <Badge variant="destructive">
                  Flagged
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
              {post.title}
            </CardTitle>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Featured Image */}
        {post.featured_image_url && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={post.featured_image_url}
              alt={post.featured_image_alt || post.title}
              className="w-full h-32 object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {post.excerpt}
          </p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.view_count}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {post.like_count}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {post.comment_count}
            </div>
          </div>
          {post.reading_time_minutes && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.reading_time_minutes}m read
            </div>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(new Date(post.created_at || ''), 'MMM d, yyyy')}
          </div>
          {post.profiles && (
            <div className="flex items-center gap-2">
              {post.profiles.avatar_url && (
                <img
                  src={post.profiles.avatar_url}
                  alt={post.profiles.name}
                  className="w-4 h-4 rounded-full"
                />
              )}
              <span>{post.profiles.name}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Loading Skeleton Component
function BlogPostsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-6 w-full mb-1" />
                <Skeleton className="h-6 w-3/4" />
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <Skeleton className="h-32 w-full mb-4 rounded-lg" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            
            <div className="flex gap-1 mb-4">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-10" />
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t">
              <Skeleton className="h-3 w-20" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
