'use client';

import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Flag, 
  CheckCircle,
  XCircle,
  Star,
  StarOff,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FileText,
  Eye,
  Heart,
  MessageSquare,
  Calendar,
  Building2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { 
  getAdminBlogs, 
  toggleFeaturedBlogPost,
  deleteBlogPost,
  type AdminBlogFilters, 
  type AdminBlogPost 
} from '@/lib/data/admin-blogs';
import { BlogModerationModal } from './blog-moderation-modal';
import type { Database } from '@/types/db';
import { useTranslations } from 'next-intl';

type BlogModerationStatus = Database['public']['Enums']['blog_moderation_status_enum'];
type PostStatus = Database['public']['Enums']['post_status_enum'];

const getStatusLabels = (t: (key: string) => string): Record<PostStatus, string> => ({
  draft: t('admin.common.draft'),
  published: t('admin.common.published'),
  archived: t('admin.common.archived'),
  flagged: t('admin.common.flagged')
});

const STATUS_COLORS: Record<PostStatus, string> = {
  draft: 'bg-gray-100 text-gray-800 border-gray-200',
  published: 'bg-green-100 text-green-800 border-green-200',
  archived: 'bg-blue-100 text-blue-800 border-blue-200',
  flagged: 'bg-red-100 text-red-800 border-red-200'
};

const getModerationLabels = (t: (key: string) => string): Record<BlogModerationStatus, string> => ({
  approved: t('admin.common.approved'),
  flagged: t('admin.common.flagged'),
  rejected: t('admin.common.rejected')
});

const MODERATION_COLORS: Record<BlogModerationStatus, string> = {
  approved: 'bg-green-100 text-green-800 border-green-200',
  flagged: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  rejected: 'bg-red-100 text-red-800 border-red-200'
};

export function AdminBlogPostsTable() {
  const queryClient = useQueryClient();
  const t = useTranslations();
  const [filters, setFilters] = useState<AdminBlogFilters>({
    page: 1,
    limit: 20,
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PostStatus | 'all'>('all');
  const [selectedModerationStatus, setSelectedModerationStatus] = useState<BlogModerationStatus | 'all'>('all');
  
  const STATUS_LABELS = getStatusLabels(t);
  const MODERATION_LABELS = getModerationLabels(t);

  // Modal states
  const [moderationModal, setModerationModal] = useState<{
    isOpen: boolean;
    blogPost: AdminBlogPost | null;
    action: BlogModerationStatus | null;
  }>({
    isOpen: false,
    blogPost: null,
    action: null
  });

  // Fetch blog posts with React Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-blogs', filters, searchTerm, selectedStatus, selectedModerationStatus],
    queryFn: () => getAdminBlogs({
      ...filters,
      search: searchTerm || undefined,
      status: selectedStatus === 'all' ? undefined : selectedStatus,
      moderation_status: selectedModerationStatus === 'all' ? undefined : selectedModerationStatus,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleStatusFilter = useCallback((status: PostStatus | 'all') => {
    setSelectedStatus(status);
    setFilters(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleModerationStatusFilter = useCallback((status: BlogModerationStatus | 'all') => {
    setSelectedModerationStatus(status);
    setFilters(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleSort = useCallback((sortBy: AdminBlogFilters['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const handleSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
  }, [queryClient]);

  const openModerationModal = (blogPost: AdminBlogPost, action: BlogModerationStatus) => {
    setModerationModal({
      isOpen: true,
      blogPost,
      action
    });
  };

  const closeModerationModal = () => {
    setModerationModal({
      isOpen: false,
      blogPost: null,
      action: null
    });
  };

  const handleToggleFeatured = async (blogPost: AdminBlogPost) => {
    try {
      const result = await toggleFeaturedBlogPost(blogPost.id);
      if (result.success) {
        handleSuccess();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const handleDeletePost = async (blogPost: AdminBlogPost) => {
    if (confirm(`Are you sure you want to delete "${blogPost.title}"? This action cannot be undone.`)) {
      try {
        const result = await deleteBlogPost(blogPost.id);
        if (result.success) {
          handleSuccess();
        }
      } catch (error) {
        console.error('Error deleting blog post:', error);
      }
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

//   const formatDateTime = (dateString: string | null) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>{t('admin.errors.loading')}: {error instanceof Error ? error.message : 'Unknown error'}</p>
            <Button onClick={() => refetch()} className="mt-2">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('admin.common.refresh')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('admin.pages.blogs.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('admin.common.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder={t('admin.common.filter')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.common.all')}</SelectItem>
                {Object.entries(STATUS_LABELS).map(([status, label]) => (
                  <SelectItem key={status} value={status}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Moderation Status Filter */}
            <Select value={selectedModerationStatus} onValueChange={handleModerationStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder={t('admin.common.moderation')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.common.all')}</SelectItem>
                {Object.entries(MODERATION_LABELS).map(([status, label]) => (
                  <SelectItem key={status} value={status}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

        
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('admin.stats.totalBlogs')}</p>
                  <p className="text-2xl font-bold">{data.count}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('admin.stats.publishedBlogs')}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {data.data.filter(post => post.status === 'published').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('admin.stats.flaggedBlogs')}</p>
                  <p className="text-2xl font-bold text-red-600">
                    {data.data.filter(post => post.moderation_status === 'flagged').length}
                  </p>
                </div>
                <Flag className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('admin.stats.featuredBlogs')}</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {data.data.filter(post => post.is_featured).length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Blog Posts Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center gap-1">
                      {t('admin.common.title')}
                      {filters.sortBy === 'title' && (
                        <span className="text-xs text-gray-500">
                          {filters.sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>{t('admin.common.author')} & {t('admin.common.organisation')}</TableHead>
                  <TableHead>{t('admin.common.status')}</TableHead>
                  <TableHead>{t('admin.common.moderation')}</TableHead>
                  <TableHead>{t('admin.common.stats')}</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-1">
                      {t('admin.common.date')}
                      {filters.sortBy === 'created_at' && (
                        <span className="text-xs text-gray-500">
                          {filters.sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>{t('admin.common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                        <span className="ml-2 text-gray-500">{t('admin.common.loading')}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : data?.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-gray-500">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>{t('admin.common.noResults')}</p>
                        {searchTerm && <p className="text-sm">{t('admin.common.noResults')}</p>}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="flex items-start gap-3 max-w-sm">
                          {post.featured_image_url && (
                            <img
                              src={post.featured_image_url}
                              alt={post.featured_image_alt || ''}
                              className="w-12 h-12 object-cover rounded flex-shrink-0"
                            />
                          )}
                          <div className="min-w-0 max-w-[200px]">
                            <div className="font-medium text-sm line-clamp-1 mb-1 truncate">
                              {post.title}
                              {post.is_featured && (
                                <Star className="inline w-4 h-4 text-yellow-500 ml-1" />
                              )}
                            </div>
                            {post.excerpt && (
                              <p className="text-xs text-gray-500 line-clamp-1 truncate">
                                {post.excerpt}
                              </p>
                            )}
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {post.tags.slice(0, 2).map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                                    {tag}
                                  </Badge>
                                ))}
                                {post.tags.length > 2 && (
                                  <span className="text-xs text-gray-400">+{post.tags.length - 2}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={post.profiles?.avatar_url || undefined} />
                              <AvatarFallback className="text-xs">
                                {post.profiles?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{post.profiles?.name}</span>
                          </div>
                          {post.organisations && (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-400" />
                              <span className="text-xs text-gray-600">{post.organisations.name}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {post.status && (
                          <Badge className={STATUS_COLORS[post.status]}>
                            {STATUS_LABELS[post.status]}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {post.moderation_status ? (
                            <Badge className={MODERATION_COLORS[post.moderation_status]}>
                              {MODERATION_LABELS[post.moderation_status]}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-500">
                              Pending
                            </Badge>
                          )}
                          {post.moderated_by_profile && (
                            <div className="text-xs text-gray-500">
                              by {post.moderated_by_profile.name}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.view_count || 0}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {post.like_count || 0}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {post.comment_count || 0}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.created_at)}
                          </div>
                          {post.published_at && (
                            <div className="text-green-600">
                              {t('admin.common.published')}: {formatDate(post.published_at)}
                            </div>
                          )}
                          {post.moderated_at && (
                            <div className="text-blue-600">
                              {t('admin.common.moderated')}: {formatDate(post.moderated_at)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-row min-w-[200px]  gap-1 flex-wrap">
                          {/* View Post */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/blogs/${post.slug}`, '_blank')}
                            title={t('admin.common.view')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>

                          {/* Toggle Featured */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleFeatured(post)}
                            title={post.is_featured ? t('admin.modals.feature.unfeature') : t('admin.modals.feature.feature')}
                          >
                            {post.is_featured ? (
                              <StarOff className="h-3 w-3" />
                            ) : (
                              <Star className="h-3 w-3" />
                            )}
                          </Button>

                          {/* Moderation Actions */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openModerationModal(post, 'approved')}
                            title={t('admin.modals.moderation.approve')}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openModerationModal(post, 'flagged')}
                            title={t('admin.modals.moderation.flag')}
                            className="text-yellow-600 hover:text-yellow-700"
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openModerationModal(post, 'rejected')}
                            title={t('admin.modals.moderation.reject')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>

                          {/* Delete */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePost(post)}
                            title={t('admin.common.delete')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {t('admin.common.showing')} {((data.currentPage - 1) * filters.limit!) + 1} {t('admin.common.of')}{' '}
                {Math.min(data.currentPage * filters.limit!, data.count)} {t('admin.common.of')} {data.count} {t('admin.common.results')}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(data.currentPage - 1)}
                  disabled={!data.hasPrevPage}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t('admin.common.previous')}
                </Button>
                <span className="text-sm text-gray-500">
                  {t('admin.common.page')} {data.currentPage} {t('admin.common.of')} {data.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(data.currentPage + 1)}
                  disabled={!data.hasNextPage}
                >
                  {t('admin.common.next')}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Moderation Modal */}
      {moderationModal.isOpen && moderationModal.blogPost && moderationModal.action && (
        <BlogModerationModal
          isOpen={moderationModal.isOpen}
          onClose={closeModerationModal}
          onSuccess={handleSuccess}
          blogPost={moderationModal.blogPost}
          action={moderationModal.action}
        />
      )}
    </div>
  );
}
