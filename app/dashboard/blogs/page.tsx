'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { BlogPostsGrid } from '@/components/blogs/blog-posts-grid';
import { deleteBlogPost, getBlogPostAnalytics } from '@/lib/data/blogs';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Note: AlertDialog components need to be installed if not available
// For now, we'll use a simple confirm dialog
import { 
  FileText, 
  Eye, 
  Heart, 
  TrendingUp
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';

export default function BlogsPage() {
  const t = useTranslations('dashboard.blogs');
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [organisationId, setOrganisationId] = useState<string | null>(null);

  // Get user profile and organisation
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    staleTime: 0,
    queryFn: async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile?.organisation_id) {
        setOrganisationId(profile.organisation_id);
      }
      
      return profile;
    },
  });

  // Get blog analytics
  const { data: analytics, } = useQuery({
    queryKey: ['blog-analytics', organisationId],
    queryFn: () => organisationId ? getBlogPostAnalytics(organisationId) : null,
    enabled: !!organisationId,
  });

  // Delete blog post mutation
  const deleteMutation = useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      toast.success('Blog post deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-analytics'] });
      setDeletePostId(null);
    },
    onError: (error) => {
      console.error('Error deleting blog post:', error);
      toast.error('Failed to delete blog post. Please try again.');
    },
  });

  const handleEditPost = (postId: string) => {
    router.push(`/dashboard/blogs/${postId}/edit`);
  };

  const handleDeletePost = (postId: string) => {
    setDeletePostId(postId);
  };

  const confirmDelete = () => {
    if (deletePostId) {
      deleteMutation.mutate(deletePostId);
    }
  };

  if (!profile || profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!organisationId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">{t('noOrganisation')}</h2>
          <p className="text-gray-600">
            {t('noOrganisationDescription')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-gray-600 mt-2">
          {t('description')}
        </p>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('totalPosts')}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalPosts}</div>
              <p className="text-xs text-muted-foreground">
                {t('publishedDrafts', { drafts: analytics.draftPosts })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('totalViews')}</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {t('acrossAllPublished')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('totalLikes')}</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalLikes.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {t('commentsTotal', { comments: analytics.totalComments })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('thisMonth')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.postsThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                {t('newPostsCreated')}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Blog Posts Grid */}
      <BlogPostsGrid
        organisationId={organisationId}
        onEditPost={handleEditPost}
        onDeletePost={handleDeletePost}
      />

      {/* Delete Confirmation - Simple confirm for now */}
      {deletePostId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">{t('deleteBlogPost')}</h3>
            <p className="text-gray-600 mb-4">
              {t('deleteConfirmation')}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeletePostId(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                {t('cancel')}
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? t('deleting') : t('deletePost')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}