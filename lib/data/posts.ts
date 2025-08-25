import { createClient } from '@/lib/supabase/client';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface ForumCategory {
  id: string;
  name_en: string;
  name_fr: string;
  name_es: string;
  description_en: string | null;
  description_fr: string | null;
  description_es: string | null;
  color_hex: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  organization_count: number;
  post_count: number;
}

export interface ForumMedia {
  id: string;
  file_url: string;
  file_name: string | null;
  file_type: string | null;
  mime_type: string | null;
  alt_text: string | null;
  is_featured: boolean;
  sort_order: number;
}



export interface ForumThread {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  reply_count: number;
  like_count: number;
  category_id: string;
  tags: string[] | null;
  language: 'English' | 'French' | 'Spanish';
  author_id: string;
  organisation_id: string | null;
  author_name: string;
  author_avatar_url: string | null;
  organisation_name: string | null;
  organisation_logo_url: string | null;
  category_name_en: string;
  category_name_fr: string;
  category_name_es: string;
  category_color_hex: string;
  category_icon: string | null;
  user_has_liked: boolean;
  media: ForumMedia[]; // Now included directly in the thread data
}

export interface PaginatedThreadsResponse {
  threads: ForumThread[];
  total: number;
  hasMore: boolean;
}

export interface LikeResponse {
  success: boolean;
  message: string;
  liked: boolean;
  like_count: number;
}

// React Query Keys
export const forumKeys = {
  all: ['forum'] as const,
  categories: () => [...forumKeys.all, 'categories'] as const,
  threads: (categoryId?: string) => [...forumKeys.all, 'threads', categoryId] as const,
  thread: (id: string) => [...forumKeys.all, 'thread', id] as const,
};

// Fetch forum categories
export async function fetchForumCategories(): Promise<ForumCategory[]> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .rpc('get_forum_categories_with_counts');
    
    if (error) {
      console.error('Error fetching forum categories:', error);
      throw new Error('Failed to fetch categories');
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchForumCategories:', error);
    throw error;
  }
}



// After you add the RPC function, you can simplify this to:
export async function fetchForumThread(threadId: string) {
  const supabase = createClient();
  
  try {
    const { data: thread, error } = await supabase
      .rpc('get_forum_thread_with_likes', {
        thread_id_param: threadId
      });
    
    if (error) {
      console.error('Error fetching forum thread:', error);
      throw new Error('Failed to fetch forum thread');
    }
    
    if (!thread || thread.length === 0) {
      throw new Error('Forum thread not found');
    }
    
    const threadData = thread[0];
    
    // Transform the data to match our interface
    const transformedThread: ForumThread = {
      ...threadData,
      language: threadData.language as 'English' | 'French' | 'Spanish',
      organisation_id: threadData.organisation_id,
      user_has_liked: threadData.user_has_liked || false,
      media: threadData.media as unknown as ForumMedia[] || []
    }
    
    return transformedThread;
  } catch (error) {
    console.error('Error in fetchForumThread:', error);
    throw error;
  }
}

// React Query Hook for a single forum thread
export function useForumThread(threadId: string) {
  return useQuery({
    queryKey: forumKeys.thread(threadId),
    queryFn: () => fetchForumThread(threadId),
    enabled: !!threadId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Fetch forum threads with pagination and optional category filtering
export async function fetchForumThreads(
  categoryId?: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedThreadsResponse> {
  const supabase = createClient();
  
  try {
    const offset = (page - 1) * limit;
    
    // Get threads with like information
    const { data: threads, error: threadsError } = await supabase
      .rpc('get_forum_threads_with_likes', {
        category_id_param: categoryId,
        limit_param: limit,
        offset_param: offset
      });
    
    if (threadsError) {
      console.error('Error fetching threads:', threadsError);
      throw new Error('Failed to fetch threads');
    }
    
    // Get total count for pagination
    let total = 0;
    if (categoryId) {
      const { count, error: countError } = await supabase
        .from('forum_threads')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId);
      
      if (!countError) {
        total = count || 0;
      }
    } else {
      const { count, error: countError } = await supabase
        .from('forum_threads')
        .select('*', { count: 'exact', head: true });
      
      if (!countError) {
        total = count || 0;
      }
    }
    
    const hasMore = offset + limit < total;
    
    // Transform the data to match our interface
    const transformedThreads = (threads || []).map(thread => ({
      ...thread,
      language: thread.language as 'English' | 'French' | 'Spanish',
      organisation_id: thread.organisation_id,
      user_has_liked: thread.user_has_liked || false,
      media: thread.media || [] // Handle the media field from RPC
    }));
    
    return {
      threads: transformedThreads as unknown as ForumThread[],
      total,
      hasMore
    };
  } catch (error) {
    console.error('Error in fetchForumThreads:', error);
    throw error;
  }
}

// React Query Hook for categories
export function useForumCategories() {
  return useQuery({
    queryKey: forumKeys.categories(),
    queryFn: fetchForumCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// React Query Hook for threads with infinite query
export function useForumThreads(categoryId?: string, pageSize: number = 10) {
  return useInfiniteQuery({
    queryKey: forumKeys.threads(categoryId),
    queryFn: ({ pageParam = 1 }) => fetchForumThreads(categoryId, pageParam, pageSize),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Like or unlike a forum thread
export async function toggleThreadLike(threadId: string): Promise<LikeResponse> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .rpc('like_forum_thread', { thread_id_param: threadId });
    
    if (error) {
      console.error('Error toggling thread like:', error);
      throw new Error('Failed to update like');
    }
    
    // Transform the response to match our interface
    if (data && typeof data === 'object' && 'success' in data) {
      return {
        success: data.success as boolean,
        message: data.message as string,
        liked: data.liked as boolean,
        like_count: data.like_count as number
      };
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error in toggleThreadLike:', error);
    throw error;
  }
}

// React Query Hook for toggling thread like
export function useToggleThreadLike(categoryId?: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: toggleThreadLike,
    onSuccess: (data, threadId) => {
      // Invalidate and refetch threads to update like counts
    
      queryClient.invalidateQueries({ queryKey: forumKeys.threads(categoryId) });
      
      // Update the specific thread's like count in cache
      queryClient.setQueryData(forumKeys.thread(threadId), (oldData: ForumThread | undefined) => {
        if (oldData) {
          return {
            ...oldData,
            like_count: data.like_count,
            user_has_liked: data.liked
          };
        }
        return oldData;
      });
    },
  });
}

// Check if current user has liked a specific thread
export async function checkUserLikedThread(threadId: string): Promise<boolean> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .rpc('has_user_liked_thread', { thread_id_param: threadId });
    
    if (error) {
      console.error('Error checking like status:', error);
      throw new Error('Failed to check like status');
    }
    
    return data || false;
  } catch (error) {
    console.error('Error in checkUserLikedThread:', error);
    throw error;
  }
}

// Increment view count for a thread
export async function incrementThreadView(threadId: string): Promise<void> {
  const supabase = createClient();
  
  try {
    // First get the current view count
    const { data: currentThread, error: fetchError } = await supabase
      .from('forum_threads')
      .select('view_count')
      .eq('id', threadId)
      .single();
    
    if (fetchError || !currentThread) {
      console.error('Error fetching current view count:', fetchError);
      throw new Error('Failed to fetch current view count');
    }
    
    // Then increment it
    const { error: updateError } = await supabase
      .from('forum_threads')
      .update({ view_count: (currentThread.view_count || 0) + 1 })
      .eq('id', threadId);
    
    if (updateError) {
      console.error('Error incrementing view count:', updateError);
      throw new Error('Failed to increment view count');
    }
  } catch (error) {
    console.error('Error in incrementThreadView:', error);
    throw error;
  }
}
