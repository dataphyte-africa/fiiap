import { Suspense } from 'react';
import { AdminForumPostsTable } from '@/components/admin/admin-forum-posts-table';
import { Card, CardContent } from '@/components/ui/card';

function AdminForumPostsTableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="w-full lg:w-48">
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="w-full lg:w-48">
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="w-10">
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-12"></div>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Posts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                {/* Header */}
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                
                {/* Title */}
                <div className="h-6 bg-gray-200 rounded w-full"></div>
                
                {/* Content */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                
                {/* Badges */}
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                
                {/* Stats */}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-4">
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AdminForumPostsTableWithSuspense() {
  return (
    <Suspense fallback={<AdminForumPostsTableSkeleton />}>
      <AdminForumPostsTable />
    </Suspense>
  );
}

export default function AdminForumPostsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Forum Posts Management
        </h1>
        <p className="text-gray-600">
          Manage, moderate, and monitor all forum posts across the platform. 
          You can approve, flag, or reject posts, as well as moderate their replies.
        </p>
      </div>

      <AdminForumPostsTableWithSuspense />
    </div>
  );
}

export const metadata = {
  title: 'Forum Posts Management - Admin',
  description: 'Manage and moderate forum posts across the platform',
};
