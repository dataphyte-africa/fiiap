import { Suspense } from 'react';
import { AdminForumPostDetail } from '@/components/admin/admin-forum-post-detail';
import { Card, CardContent } from '@/components/ui/card';

interface AdminForumPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

function AdminForumPostDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-8 bg-gray-200 rounded w-32"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Post Detail Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-6">
            {/* Post Header */}
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>

            {/* Post Title */}
            <div className="h-8 bg-gray-200 rounded w-full"></div>

            {/* Post Content */}
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>

            {/* Post Meta */}
            <div className="flex space-x-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded w-20"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replies Section Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border-l-2 border-gray-200 pl-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminForumPostDetailWithSuspense({ postId }: { postId: string }) {
  return (
    <Suspense fallback={<AdminForumPostDetailSkeleton />}>
      <AdminForumPostDetail postId={postId} />
    </Suspense>
  );
}

export default async function AdminForumPostPage({ params }: AdminForumPostPageProps) {
  const { id } = await params;
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <AdminForumPostDetailWithSuspense postId={id} />
    </div>
  );
}

export async function generateMetadata({ params }: AdminForumPostPageProps) {
  const { id } = await params;
  return {
    title: `Forum Post ${id.substring(0, 8)} - Admin`,
    description: 'View and moderate forum post details and replies',
  };
}
