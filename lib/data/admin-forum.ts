'use server';

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/db';

type ForumModerationStatus = Database['public']['Enums']['forum_moderation_status_enum'];

// Base filters interface
export interface BaseFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Admin forum thread filters
export interface AdminForumFilters extends BaseFilters {
  search?: string;
  category_id?: string;
  moderation_status?: ForumModerationStatus;
  author_id?: string;
  organisation_id?: string;
  language?: 'English' | 'French';
  has_media?: boolean;
}

// Admin forum thread interface
export type AdminForumThread = Database['public']['Functions']['admin_get_forum_threads_with_likes']['Returns'][0];
export type AdminForumThreadSingle = Database['public']['Functions']['admin_get_forum_thread_with_likes']['Returns'][0];
// Admin forum reply interface
export interface AdminForumReply {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  is_solution: boolean;
  moderation_status: ForumModerationStatus | null;
  moderated_at: string | null;
  moderated_by: string | null;
  moderated_by_name: string | null;
  moderation_notes: string | null;
  parent_reply_id: string | null;
  thread_id: string;
  author_id: string;
  author_name: string;
  author_avatar_url: string | null;
  child_replies_count: number;
  user_has_liked: boolean;
}

// Paginated response interface
export interface AdminForumResponse {
  threads: Database['public']['Functions']['admin_get_forum_threads_with_likes']['Returns'];
  count: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Get admin forum threads with filters and pagination
export async function getAdminForumThreads(filters: AdminForumFilters = {}) {
  const supabase = await createClient();
  
  const {
    page = 1,
    limit = 20,
    category_id,
    search,
    moderation_status
  } = filters;

  try {
    const offset = (page - 1) * limit;

    // Use the admin RPC function to get threads with likes
    const { data: threads, error } = await supabase
      .rpc('admin_get_forum_threads_with_likes', {
        category_id_param: category_id,
        limit_param: limit,
        offset_param: offset,
        search_param: search,
        status_param: moderation_status,
      });

    if (error) {
      console.error('Error fetching admin forum threads:', error);
      throw new Error('Failed to fetch forum threads');
    }

    
    const sampleThread = threads[0]
    const totalCount = sampleThread.total_count || 0
    const totalPages = sampleThread.total_pages || 0;
    const hasNextPage = sampleThread.has_next_page || false;
    const hasPrevPage = sampleThread.has_previous_page || false;

    return {
      threads: threads || [],
      count: totalCount,
      totalPages,
      currentPage: page,
      hasNextPage,
      hasPrevPage
    };

  } catch (error) {
    console.error('Error in getAdminForumThreads:', error);
    throw error;
  }
}

// Get single admin forum thread with details
export async function getAdminForumThread(threadId: string) {
  const supabase = await createClient();
  
  try {
    const { data: thread, error } = await supabase
      .rpc('admin_get_forum_thread_with_likes', {
        thread_id_param: threadId
      });

    if (error) {
      console.error('Error fetching admin forum thread:', error);
      throw new Error('Failed to fetch forum thread');
    }

    if (!thread || thread.length === 0) {
      return null;
    }

    return thread[0];

  } catch (error) {
    console.error('Error in getAdminForumThread:', error);
    throw error;
  }
}

// Get admin forum thread replies
export async function getAdminForumThreadReplies(
  threadId: string,
  page: number = 1,
  limit: number = 20
): Promise<{ replies: AdminForumReply[]; hasMore: boolean }> {
  const supabase = await createClient();
  
  try {
    const offset = (page - 1) * limit;

    const { data: replies, error } = await supabase
      .rpc('admin_get_forum_thread_replies', {
        thread_id_param: threadId,
        limit_param: limit,
        offset_param: offset
      });

    if (error) {
      console.error('Error fetching admin forum replies:', error);
      throw new Error('Failed to fetch forum replies');
    }

    const hasMore = replies && replies.length === limit;

    return {
      replies: replies || [],
      hasMore: hasMore || false
    };

  } catch (error) {
    console.error('Error in getAdminForumThreadReplies:', error);
    throw error;
  }
}

// Moderate forum thread
export async function moderateForumThread(
  threadId: string,
  moderationStatus: ForumModerationStatus,
  adminNotes?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .rpc('admin_moderate_forum_thread', {
        thread_id_param: threadId,
        new_moderation_status: moderationStatus,
        admin_notes: adminNotes,
      });

    if (error) {
      console.error('Error moderating forum thread:', error);
      return { success: false, error: error.message };
    }

    return { success: data === true };

  } catch (error) {
    console.error('Error in moderateForumThread:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

// Moderate forum reply
export async function moderateForumReply(
  replyId: string,
  moderationStatus: ForumModerationStatus,
  adminNotes?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .rpc('admin_moderate_forum_reply', {
        reply_id_param: replyId,
        new_moderation_status: moderationStatus,
        admin_notes: adminNotes,
      });

    if (error) {
      console.error('Error moderating forum reply:', error);
      return { success: false, error: error.message };
    }

    return { success: data === true };

  } catch (error) {
    console.error('Error in moderateForumReply:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

// Get forum categories for filter dropdown
export async function getForumCategories() {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('forum_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching forum categories:', error);
      throw new Error('Failed to fetch forum categories');
    }

    return data || [];

  } catch (error) {
    console.error('Error in getForumCategories:', error);
    throw error;
  }
}
