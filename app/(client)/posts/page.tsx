'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { PublicPostCard } from '@/components/posts/public-post-card';
import { useForumThreads } from '@/lib/data/posts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LucideLoader2, LucideRefreshCw } from 'lucide-react';

export default function PostsPage() {
  const t = useTranslations('posts');
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') || undefined;
  console.log(selectedCategory, "🌹")
  const {
    data: threadsData,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useForumThreads(selectedCategory, 10);

  // Flatten all pages of threads
  const threads = threadsData?.pages.flatMap(page => page.threads) || [];
  const total = threadsData?.pages[0]?.total || 0;

  // Loading skeleton for posts
  const PostSkeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start space-x-3 mb-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex space-x-6">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error state
  if (isError) {
    return (
        <div className="lg:col-span-3">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <LucideRefreshCw className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('error.title')}</h3>
            <p className="text-gray-500 mb-4">
              {error?.message || t('error.description')}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              {t('error.tryAgain')}
            </Button>
          </div>
        </div>
    
    );
  }

  return (
    
      <>
        {/* Loading state */}
        {isLoading && <PostSkeleton />}

        {/* Posts List */}
        {!isLoading && threads.length > 0 && (
          <div className="space-y-6">
            {threads.map((thread) => (
              <PublicPostCard 
                key={thread.id} 
                post={{
                  id: thread.id,
                  title: thread.title,
                  content: thread.content,
                  created_at: thread.created_at,
                  updated_at: thread.updated_at,
                  view_count: thread.view_count,
                  reply_count: thread.reply_count,
                  like_count: thread.like_count,
                  category_id: thread.category_id,
                  tags: thread.tags,
                  language: thread.language,
                  author: {
                    id: thread.author_id,
                    name: thread.author_name,
                    avatar_url: thread.author_avatar_url || undefined,
                  },
                  organisation: {
                    id: thread.organisation_id || 'unknown',
                    name: thread.organisation_name || 'Unknown Organisation',
                    logo_url: thread.organisation_logo_url || undefined,
                  },
                  media: thread.media, // Pass the media data from the thread
                  category: {
                    id: thread.category_id,
                    name_en: thread.category_name_en,
                    name_fr: thread.category_name_fr,
                    name_es: thread.category_name_es,
                    color_hex: thread.category_color_hex,
                    icon: thread.category_icon,
                  },
                  user_has_liked: thread.user_has_liked,
                }}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && threads.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <LucideRefreshCw className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('empty.title')}</h3>
            <p className="text-gray-500 mb-4">
              {selectedCategory 
                ? t('empty.descriptionCategory') 
                : t('empty.descriptionAll')
              }
            </p>
            <Button onClick={() => refetch()} variant="outline">
              {t('empty.refresh')}
            </Button>
          </div>
        )}

        {/* Load More Button */}
        {hasNextPage && (
          <div className="text-center pt-6">
            <Button 
              onClick={() => fetchNextPage()} 
              disabled={isFetchingNextPage}
              variant="outline"
              className="min-w-[120px]"
            >
              {isFetchingNextPage ? (
                <>
                  <LucideLoader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('loading')}
                </>
              ) : (
                t('loadMore')
              )}
            </Button>
          </div>
        )}

        {/* Pagination Info */}
        {total > 0 && (
          <div className="text-center text-sm text-gray-500 pt-4">
            {t('pagination.showing', { count: threads.length, total })}
            {selectedCategory && (
              <span className="ml-2">
                {t('pagination.inCategory')}
              </span>
            )}
          </div>
        )}
      </>
  );
}
