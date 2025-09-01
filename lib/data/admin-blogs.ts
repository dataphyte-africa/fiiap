import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/db';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
type BlogModerationStatus = Database['public']['Enums']['blog_moderation_status_enum'];
type PostStatus = Database['public']['Enums']['post_status_enum'];

export interface AdminBlogPost extends BlogPost {
  profiles?: {
    id: string;
    name: string;
    avatar_url: string | null;
  } | null;
  organisations?: {
    id: string;
    name: string;
    logo_url: string | null;
  } | null;
  moderated_by_profile?: {
    id: string;
    name: string;
  } | null;
}

export interface AdminBlogFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: PostStatus | 'all';
  moderation_status?: BlogModerationStatus | 'all';
  organisation_id?: string;
  author_id?: string;
  sortBy?: 'title' | 'created_at' | 'published_at' | 'view_count' | 'like_count' | 'moderated_at';
  sortOrder?: 'asc' | 'desc';
  date_from?: string;
  date_to?: string;
  is_featured?: boolean;
}

export interface AdminBlogResponse {
  data: AdminBlogPost[];
  count: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export async function getAdminBlogs(filters: AdminBlogFilters = {}): Promise<AdminBlogResponse> {
  const supabase = await createClient();

  const {
    page = 1,
    limit = 20,
    search,
    status,
    moderation_status,
    organisation_id,
    author_id,
    sortBy = 'created_at',
    sortOrder = 'desc',
    date_from,
    date_to,
    is_featured
  } = filters;

  // Build the base query
  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      profiles!blog_posts_author_id_fkey(
        id,
        name,
        avatar_url
      ),
      organisations!blog_posts_organisation_id_fkey(
        id,
        name,
        logo_url
      ),
      moderated_by_profile:profiles!blog_posts_moderated_by_fkey(
        id,
        name
      )
    `, { count: 'exact' });

  // Apply filters
  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,tags.cs.{${search}}`);
  }

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  if (moderation_status && moderation_status !== 'all') {
    query = query.eq('moderation_status', moderation_status);
  }

  if (organisation_id) {
    query = query.eq('organisation_id', organisation_id);
  }

  if (author_id) {
    query = query.eq('author_id', author_id);
  }

  if (date_from) {
    query = query.gte('created_at', date_from);
  }

  if (date_to) {
    query = query.lte('created_at', date_to);
  }

  if (typeof is_featured === 'boolean') {
    query = query.eq('is_featured', is_featured);
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching admin blogs:', error);
    throw new Error(`Failed to fetch blog posts: ${error.message}`);
  }

  const totalPages = Math.ceil((count || 0) / limit);

  return {
    data: data as AdminBlogPost[],
    count: count || 0,
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export async function moderateBlogPost(
  blogPostId: string,
  moderationStatus: BlogModerationStatus,
  moderationNotes?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Authentication required' };
    }


    // Update the blog post moderation status
    const { error } = await supabase
      .from('blog_posts')
      .update({
        moderation_status: moderationStatus,
        moderation_notes: moderationNotes || null,
        moderated_by: user.id,
        moderated_at: new Date().toISOString(),
      })
      .eq('id', blogPostId);

    if (error) {
      console.error('Error moderating blog post:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error moderating blog post:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

export async function flagBlogPost(
  blogPostId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  return moderateBlogPost(blogPostId, 'flagged', reason);
}

export async function approveBlogPost(
  blogPostId: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  return moderateBlogPost(blogPostId, 'approved', notes);
}

export async function rejectBlogPost(
  blogPostId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  return moderateBlogPost(blogPostId, 'rejected', reason);
}

export async function toggleFeaturedBlogPost(
  blogPostId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    // Get the current featured status
    const { data: currentPost, error: fetchError } = await supabase
      .from('blog_posts')
      .select('is_featured')
      .eq('id', blogPostId)
      .single();

    if (fetchError) {
      return { success: false, error: fetchError.message };
    }

    // Toggle the featured status
    const { error } = await supabase
      .from('blog_posts')
      .update({
        is_featured: !currentPost.is_featured,
        updated_at: new Date().toISOString(),
      })
      .eq('id', blogPostId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error toggling featured status:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

export async function deleteBlogPost(
  blogPostId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', blogPostId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting blog post:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}
