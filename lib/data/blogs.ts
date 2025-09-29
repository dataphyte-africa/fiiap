import { createClient } from "@/lib/supabase/client";

import { Database } from "@/types/db";

export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

export interface BlogPostWithAuthor extends BlogPost {
  profiles: {
    id: string;
    name: string;
    avatar_url: string | null;
  } | null;
  organisations: {
    id: string;
    name: string;
    logo_url: string | null;
  } | null;
}

export interface BlogPostFilters {
  organisation_id?: string;
  author_id?: string;
  status?: 'draft' | 'published' | 'archived' | 'flagged';
  moderation_status?: 'approved' | 'flagged' | 'rejected';
  search?: string;
  tags?: string[];
  is_featured?: boolean;
  language?: 'English' | 'French';
  sortBy?: 'title' | 'created_at' | 'updated_at' | 'published_at' | 'view_count' | 'like_count';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export type CreateBlogPostData = Pick<BlogPost, 'title' | 'slug' | 'excerpt' |  'featured_image_url' | 'featured_image_alt' | 'tags' | 'status' | 'language' | 'meta_title' | 'meta_description' | 'organisation_id' | 'author_id' | 'content' |'published_at' | 'created_at'>;

export interface BlogPostsResult {
  data: BlogPostWithAuthor[];
  count: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}



export interface UpdateBlogPostData extends Partial<BlogPost> {
  id: string;
}

// Get blog posts with pagination and filters
export async function getBlogPosts(filters: BlogPostFilters = {}): Promise<BlogPostsResult> {
  const supabase = createClient();
  
  const {
    organisation_id,
    author_id,
    status,
    moderation_status,
    search,
    tags,
    is_featured,
    language,
    sortBy = 'created_at',
    sortOrder = 'desc',
    page = 1,
    limit = 12
  } = filters;

  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      profiles!blog_posts_author_id_fkey (
        id,
        name,
        avatar_url
      ),
      organisations!blog_posts_organisation_id_fkey (
        id,
        name,
        logo_url
      )
    `, { count: 'exact' });

  // Apply filters
  if (organisation_id) {
    query = query.eq('organisation_id', organisation_id);
  }

  if (author_id) {
    query = query.eq('author_id', author_id);
  }

  if (status) {
    query = query.eq('status', status);
  }

  if (moderation_status) {
    query = query.eq('moderation_status', moderation_status);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content_html.ilike.%${search}%`);
  }

  if (tags && tags.length > 0) {
    query = query.overlaps('tags', tags);
  }

  if (is_featured !== undefined) {
    query = query.eq('is_featured', is_featured);
  }

  if (language) {
    query = query.eq('language', language);
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }

  const totalPages = Math.ceil((count || 0) / limit);

  return {
    data: data as BlogPostWithAuthor[],
    count: count || 0,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

// Get a single blog post by ID
export async function getBlogPost(id: string): Promise<BlogPostWithAuthor | null> {
  const supabase = createClient();
 console.log("Hello")
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      organisations!blog_posts_organisation_id_fkey (
        id,
        name,
        logo_url
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }

  return data as BlogPostWithAuthor;
}

// Get blog post by slug and organisation
export async function getBlogPostBySlug(slug: string, organisationId: string): Promise<BlogPostWithAuthor | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      profiles!blog_posts_author_id_fkey (
        id,
        name,
        avatar_url
      ),
      organisations!blog_posts_organisation_id_fkey (
        id,
        name,
        logo_url
      )
    `)
    .eq('slug', slug)
    .eq('organisation_id', organisationId)
    .single();

  if (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }

  return data as BlogPostWithAuthor;
}

// Get published blog post by slug (for public access)
export async function getPublishedBlogPostBySlug(slug: string): Promise<BlogPostWithAuthor | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      profiles!blog_posts_author_id_fkey (
        id,
        name,
        avatar_url
      ),
      organisations!blog_posts_organisation_id_fkey (
        id,
        name,
        logo_url
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('moderation_status', 'approved')
    .single();

  if (error) {
    console.error('Error fetching published blog post by slug:', error);
    return null;
  }

  return data as BlogPostWithAuthor;
}

// Get published blog posts for a specific organisation (for public access)
export async function getOrganisationBlogPosts(
  organisationId: string, 
  filters: Omit<BlogPostFilters, 'organisation_id'> = {}
): Promise<BlogPostsResult> {
  const supabase = createClient();
  
  const {
    author_id,
    search,
    tags,
    is_featured,
    language,
    sortBy = 'published_at',
    sortOrder = 'desc',
    page = 1,
    limit = 12
  } = filters;

  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      profiles!blog_posts_author_id_fkey (
        id,
        name,
        avatar_url
      ),
      organisations!blog_posts_organisation_id_fkey (
        id,
        name,
        logo_url
      )
    `, { count: 'exact' })
    .eq('organisation_id', organisationId)
    .eq('status', 'published')
    .eq('moderation_status', 'approved');

  // Apply additional filters
  if (author_id) {
    query = query.eq('author_id', author_id);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content_html.ilike.%${search}%`);
  }

  if (tags && tags.length > 0) {
    query = query.overlaps('tags', tags);
  }

  if (is_featured !== undefined) {
    query = query.eq('is_featured', is_featured);
  }

  if (language) {
    query = query.eq('language', language);
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching organisation blog posts:', error);
    throw error;
  }

  const totalPages = Math.ceil((count || 0) / limit);

  return {
    data: data as BlogPostWithAuthor[],
    count: count || 0,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

// Create a new blog post
export async function createBlogPost(data: CreateBlogPostData): Promise<BlogPost> {
  const supabase = createClient();

  

  const blogPostData = {
    ...data,
    published_at: null,
    organisation_id: data.organisation_id || '',
    author_id: data.author_id || '',
    content: data.content || {},
  };
  console.log(blogPostData);

  const { data: blogPost, error } = await supabase
    .from('blog_posts')
    .insert(blogPostData)
    .select()
    .single();

  if (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }

  return blogPost;
}

// Update a blog post
export async function updateBlogPost(data: UpdateBlogPostData): Promise<BlogPost> {
  const supabase = createClient();
  const { id, ...updateData } = data;

  // Calculate reading time if content_html is provided
  if (updateData.content_html) {
    (updateData as Record<string, number>).reading_time_minutes = Math.ceil(
      updateData.content_html.replace(/<[^>]*>/g, '').split(/\s+/).length / 200
    );
  }

  // Set published_at if status is being changed to published
  if (updateData.status === 'published' && !updateData.published_at) {
    updateData.published_at = new Date().toISOString();
  }

  const { data: blogPost, error } = await supabase
    .from('blog_posts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }

  return blogPost;
}

// Delete a blog post
export async function deleteBlogPost(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
}

// Generate a unique slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Check if slug is unique for organisation
export async function isSlugUnique(slug: string, organisationId: string, excludeId?: string): Promise<boolean> {
  const supabase = createClient();

  let query = supabase
    .from('blog_posts')
    .select('id')
    .eq('slug', slug)
    .eq('organisation_id', organisationId);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error checking slug uniqueness:', error);
    return false;
  }

  return data.length === 0;
}

// Get blog post tags for an organisation (for autocomplete)
export async function getBlogPostTags(organisationId: string): Promise<string[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('tags')
    .eq('organisation_id', organisationId)
    .not('tags', 'is', null);

  if (error) {
    console.error('Error fetching blog post tags:', error);
    return [];
  }

  // Flatten and deduplicate tags
  const allTags = data.flatMap(post => post.tags || []);
  return Array.from(new Set(allTags)).sort();
}

// Increment view count
export async function incrementViewCount(id: string): Promise<number | null> {
  const supabase = createClient();

  const { error, data } = await supabase.rpc('increment_blog_post_view_count', { blog_post_id_param: id });

  if (error) {
    console.error('Error incrementing view count:', error);
  }

  return data;
}

// Get blog post analytics for organisation
export async function getBlogPostAnalytics(organisationId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('status, view_count, like_count, comment_count, created_at')
    .eq('organisation_id', organisationId);

  if (error) {
    console.error('Error fetching blog post analytics:', error);
    return null;
  }

  const totalPosts = data.length;
  const publishedPosts = data.filter(post => post.status === 'published').length;
  const draftPosts = data.filter(post => post.status === 'draft').length;
  const totalViews = data.reduce((sum, post) => sum + (post.view_count || 0), 0);
  const totalLikes = data.reduce((sum, post) => sum + (post.like_count || 0), 0);
  const totalComments = data.reduce((sum, post) => sum + (post.comment_count || 0), 0);

  // Posts created this month
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  
  const postsThisMonth = data.filter(post => 
    post.created_at && new Date(post.created_at) >= thisMonth
  ).length;

  return {
    totalPosts,
    publishedPosts,
    draftPosts,
    totalViews,
    totalLikes,
    totalComments,
    postsThisMonth,
  };
}
