'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { BlogPostCard } from '@/components/blogs/blog-post-card';
import { Button } from '@/components/ui/button';

import { 
  getOrganisationBlogPosts, 
  type BlogPostWithAuthor, 
  type BlogPostFilters 
} from '@/lib/data/blogs';

interface OrganisationStoriesGridProps {
  organisationId: string;
  organisationName?: string;
}

export function OrganisationStoriesGrid({ 
  organisationId, 
  organisationName 
}: OrganisationStoriesGridProps) {
  const t = useTranslations('organisations-client.detail.stories');
  
  // State management
  const [posts, setPosts] = useState<BlogPostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<BlogPostFilters['sortBy']>('published_at');
  const [sortOrder, setSortOrder] = useState<BlogPostFilters['sortOrder']>('desc');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  
  // Available tags from current posts

  // Fetch blog posts
  const fetchPosts = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const filters: Omit<BlogPostFilters, 'organisation_id'> = {
        search: searchQuery || undefined,
        language: selectedLanguage === 'all' ? undefined : selectedLanguage as 'English' | 'French',
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        is_featured: showFeaturedOnly || undefined,
        sortBy,
        sortOrder,
        page,
        limit: 9
      };

      const result = await getOrganisationBlogPosts(organisationId, filters);
      
      setPosts(result.data);
      setTotalCount(result.count);
      setCurrentPage(result.currentPage);
      setHasNextPage(result.hasNextPage);
      setHasPrevPage(result.hasPrevPage);

      // Extract unique tags from all posts
    
     
     

    } catch (err) {
      console.error('Error fetching organisation blog posts:', err);
      setError('Failed to load blog posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch posts when filters change
  useEffect(() => {
    fetchPosts(1);
    setCurrentPage(1);
  }, [organisationId, searchQuery, selectedLanguage, selectedTags, sortBy, sortOrder, showFeaturedOnly]);

  // Handle search
 

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    fetchPosts(newPage);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLanguage('all');
    setSelectedTags([]);
    setShowFeaturedOnly(false);
    setSortBy('published_at');
    setSortOrder('desc');
  };

  // Loading state
  if (loading && posts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-48 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('error.title')}
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => fetchPosts(currentPage)} variant="outline">
            {t('error.retry')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
     

      {/* Content */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('empty.title')}
            </h3>
            <p className="text-gray-600">
              {searchQuery || selectedTags.length > 0 || selectedLanguage !== 'all' || showFeaturedOnly
                ? t('empty.noResultsMessage')
                : t('empty.noStoriesMessage', { organisationName: organisationName || 'this organisation' })
              }
            </p>
            {(searchQuery || selectedTags.length > 0 || selectedLanguage !== 'all' || showFeaturedOnly) && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="mt-4"
              >
                {t('filters.clearAll')}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {posts.map((post) => (
              <BlogPostCard 
                key={post.id} 
                post={post} 
                showStats={true}
              />
            ))}
          </div>

          {/* Pagination */}
          {(hasNextPage || hasPrevPage) && (
            <div className="flex justify-center items-center gap-4 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPrevPage || loading}
              >
                {t('pagination.previous')}
              </Button>
              
              <span className="text-sm text-gray-600">
                {t('pagination.pageInfo', { 
                  current: currentPage,
                  total: Math.ceil(totalCount / 9)
                })}
              </span>
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage || loading}
              >
                {t('pagination.next')}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
