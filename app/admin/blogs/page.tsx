import { Suspense } from 'react';
import { AdminBlogPostsTable } from '@/components/admin/admin-blog-posts-table';
import { Card, CardContent } from '@/components/ui/card';

function AdminBlogPostsTableSkeleton() {
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

      {/* Table Skeleton */}
      <Card>
        <CardContent className="p-0">
          <div className="animate-pulse">
            <div className="p-4 border-b">
              <div className="flex space-x-4">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded flex-1"></div>
                ))}
              </div>
            </div>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="p-4 border-b">
                <div className="flex space-x-4">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded flex-1"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminBlogPostsTableWithSuspense() {
  return (
    <Suspense fallback={<AdminBlogPostsTableSkeleton />}>
      <AdminBlogPostsTable />
    </Suspense>
  );
}

export default function AdminBlogPostsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Blog Posts Management
        </h1>
        <p className="text-gray-600">
          Manage, moderate, and monitor all blog posts across the platform. 
          You can approve, flag, or reject posts, as well as feature them on the homepage.
        </p>
      </div>

      <AdminBlogPostsTableWithSuspense />
    </div>
  );
}

export const metadata = {
  title: 'Blog Posts Management - Admin',
  description: 'Manage and moderate blog posts across the platform',
};
