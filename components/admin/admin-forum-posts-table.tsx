'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  RefreshCw,
  FileText,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';
import { useAdminForumThreads, useForumCategories, type AdminForumFilters } from '@/hooks/use-admin-forum';
import { AdminForumPostCard } from './admin-forum-post-card';
import { ForumModerationModal } from './forum-moderation-modal';
import type { AdminForumThread } from '@/lib/data/admin-forum';
import type { Database } from '@/types/db';
import { useTranslations } from 'next-intl';

type ForumModerationStatus = Database['public']['Enums']['forum_moderation_status_enum'];

export function AdminForumPostsTable() {
  const t = useTranslations();
  const [filters, setFilters] = useState<AdminForumFilters>({
    page: 1,
    limit: 12, // Grid layout, so we want multiples of 2
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedModerationStatus, setSelectedModerationStatus] = useState<ForumModerationStatus | 'all'>('all');

  // Modal states
  const [moderationModal, setModerationModal] = useState<{
    isOpen: boolean;
    forumPost: AdminForumThread | null;
    action: ForumModerationStatus | null;
  }>({
    isOpen: false,
    forumPost: null,
    action: null
  });

  // Fetch forum posts with React Query
  const { data, isLoading, error, refetch } = useAdminForumThreads({
    ...filters,
    search: searchTerm || undefined,
    category_id: selectedCategory === 'all' ? undefined : selectedCategory,
    moderation_status: selectedModerationStatus === 'all' ? undefined : selectedModerationStatus,
  });

  // Fetch categories for filter dropdown
  const { data: categories = [] } = useForumCategories();

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleCategoryFilter = useCallback((category: string) => {
    setSelectedCategory(category);
    setFilters(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleModerationStatusFilter = useCallback((status: ForumModerationStatus | 'all') => {
    setSelectedModerationStatus(status);
    setFilters(prev => ({ ...prev, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const handleModerate = useCallback((post: AdminForumThread, action: ForumModerationStatus) => {
    setModerationModal({
      isOpen: true,
      forumPost: post,
      action
    });
  }, []);

  const closeModerationModal = useCallback(() => {
    setModerationModal({
      isOpen: false,
      forumPost: null,
      action: null
    });
  }, []);

  const handleSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  // Calculate stats from current data
  const stats = {
    total: data?.count || 0,
    approved: data?.threads.filter(p => p.moderation_status === 'approved').length || 0,
    flagged: data?.threads.filter(p => p.moderation_status === 'flagged').length || 0,
    rejected: data?.threads.filter(p => p.moderation_status === 'rejected').length || 0,
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{t('admin.errors.loading')}: {error.message}</p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('admin.common.refresh')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>{t('admin.common.search')} & {t('admin.common.filter')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t('admin.common.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="w-full lg:w-48">
              <Select value={selectedCategory} onValueChange={handleCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={`${t('admin.common.all')} ${t('admin.common.category')}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.common.all')} {t('admin.common.category')}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon && <span className="mr-2">{category.icon}</span>}
                      {category.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Moderation Status Filter */}
            <div className="w-full lg:w-48">
              <Select value={selectedModerationStatus} onValueChange={handleModerationStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={`${t('admin.common.all')} ${t('admin.common.status')}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.common.all')} {t('admin.common.status')}</SelectItem>
                  <SelectItem value="approved">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      {t('admin.common.approved')}
                    </div>
                  </SelectItem>
                  <SelectItem value="flagged">
                    <div className="flex items-center">
                      <Flag className="h-4 w-4 mr-2 text-yellow-600" />
                      {t('admin.common.flagged')}
                    </div>
                  </SelectItem>
                  <SelectItem value="rejected">
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 mr-2 text-red-600" />
                      {t('admin.common.rejected')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('admin.stats.totalPosts')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('admin.stats.approvedPosts')}</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('admin.stats.flaggedPosts')}</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.flagged}</p>
              </div>
              <Flag className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('admin.common.rejected')}</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: filters.limit || 12 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data?.threads.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('admin.common.noResults')}</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedCategory !== 'all' || selectedModerationStatus !== 'all'
                  ? t('admin.common.noResults')
                  : t('admin.common.noResults')
                }
              </p>
              {(searchTerm || selectedCategory !== 'all' || selectedModerationStatus !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedModerationStatus('all');
                    setFilters(prev => ({ ...prev, page: 1 }));
                  }}
                >
                  {t('admin.common.clearFilters')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data?.threads.map((post) => (
            <AdminForumPostCard
              key={post.id}
              post={post}
              onModerate={handleModerate}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {((data.currentPage - 1) * (filters.limit || 12)) + 1} to{' '}
                {Math.min(data.currentPage * (filters.limit || 12), data.count)} of {data.count} posts
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(data.currentPage - 1)}
                  disabled={!data.hasPrevPage}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-gray-500">
                  Page {data.currentPage} of {data.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(data.currentPage + 1)}
                  disabled={!data.hasNextPage}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Moderation Modal */}
      {moderationModal.isOpen && moderationModal.forumPost && moderationModal.action && (
        <ForumModerationModal
          isOpen={moderationModal.isOpen}
          onClose={closeModerationModal}
          onSuccess={handleSuccess}
          forumPost={moderationModal.forumPost}
          action={moderationModal.action}
        />
      )}
    </div>
  );
}
