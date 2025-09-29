import { createClient } from "@/lib/supabase/server";
import type { BlogPostWithAuthor } from "./blogs";
import type { ForumThread } from "./posts";

// Server-side function to get featured blog posts
export async function getFeaturedBlogPosts(limit: number = 3): Promise<BlogPostWithAuthor[]> {
  const supabase = await createClient();

  try {
    // First try to get featured blog posts
    const { data: featuredPosts, error: featuredError } = await supabase
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
      .eq('status', 'published')
      .eq('moderation_status', 'approved')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (featuredError) {
      console.error('Error fetching featured blog posts:', featuredError);
      throw featuredError;
    }

    const featuredCount = featuredPosts?.length || 0;

    // If we don't have enough featured posts, supplement with latest posts
    if (featuredCount < limit) {
      const remainingCount = limit - featuredCount;
      
      const { data: latestPosts, error: latestError } = await supabase
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
        .eq('status', 'published')
        .eq('moderation_status', 'approved')
        .eq('is_featured', false)
        .order('created_at', { ascending: false })
        .limit(remainingCount);

      if (latestError) {
        console.error('Error fetching latest blog posts:', latestError);
        throw latestError;
      }

      // Combine featured and latest posts
      const combinedPosts = [...(featuredPosts || []), ...(latestPosts || [])];
      return combinedPosts as BlogPostWithAuthor[];
    }

    return featuredPosts as BlogPostWithAuthor[];
  } catch (error) {
    console.error('Error in getFeaturedBlogPosts:', error);
    return [];
  }
}

// Server-side function to get featured forum posts
export async function getFeaturedForumPosts(limit: number = 3): Promise<ForumThread[]> {
  const supabase = await createClient();

  try {
    // Use direct query instead of RPC function for better compatibility
    const { data: featuredThreads, error: featuredError } = await supabase
      .from('forum_threads')
      .select(`
        *,
        organisations!forum_threads_organisation_id_fkey (
          id,
          name,
          logo_url
        ),
        forum_categories!forum_threads_category_id_fkey (
          id,
          name_en,
          name_fr,
          name_es,
          color_hex,
          icon
        )
      `)
      .eq('is_pinned', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (featuredError) {
      console.error('Error fetching featured forum threads:', featuredError);
      throw featuredError;
    }

    const featuredCount = featuredThreads?.length || 0;

    // If we don't have enough featured posts, supplement with latest posts
    if (featuredCount < limit) {
      const remainingCount = limit - featuredCount;
      
      const { data: latestThreads, error: latestError } = await supabase
        .from('forum_threads')
        .select(`
          *,
          organisations!forum_threads_organisation_id_fkey (
            id,
            name,
            logo_url
          ),
          forum_categories!forum_threads_category_id_fkey (
            id,
            name_en,
            name_fr,
            name_es,
            color_hex,
            icon
          )
        `)
        .eq('is_pinned', false)
        .order('created_at', { ascending: false })
        .limit(remainingCount);

      if (latestError) {
        console.error('Error fetching latest forum threads:', latestError);
        throw latestError;
      }

      // Transform data to match ForumThread interface
      const transformedFeatured = (featuredThreads || []).map(thread => ({
        ...thread,
        author_name: thread.organisations?.name || 'Unknown',
        author_avatar_url: thread.organisations?.logo_url || null,
        organisation_name: thread.organisations?.name || null,
        organisation_logo_url: thread.organisations?.logo_url || null,
        category_name_en: thread.forum_categories?.name_en || '',
        category_name_fr: thread.forum_categories?.name_fr || '',
        category_name_es: thread.forum_categories?.name_es || '',
        category_color_hex: thread.forum_categories?.color_hex || '#000000',
        category_icon: thread.forum_categories?.icon || null,
        user_has_liked: false,
        media: []
      }));

      const transformedLatest = (latestThreads || []).map(thread => ({
        ...thread,
        author_name: thread.organisations?.name || 'Unknown',
        author_avatar_url: thread.organisations?.logo_url || null,
        organisation_name: thread.organisations?.name || null,
        organisation_logo_url: thread.organisations?.logo_url || null,
        category_name_en: thread.forum_categories?.name_en || '',
        category_name_fr: thread.forum_categories?.name_fr || '',
        category_name_es: thread.forum_categories?.name_es || '',
        category_color_hex: thread.forum_categories?.color_hex || '#000000',
        category_icon: thread.forum_categories?.icon || null,
        user_has_liked: false,
        media: []
      }));

      const combinedThreads = [...transformedFeatured, ...transformedLatest];
      return combinedThreads as ForumThread[];
    }

    // Transform data for featured posts only
    const transformedFeatured = (featuredThreads || []).map(thread => ({
      ...thread,
      author_name: thread.organisations?.name || 'Unknown',
      author_avatar_url: thread.organisations?.logo_url || null,
      organisation_name: thread.organisations?.name || null,
      organisation_logo_url: thread.organisations?.logo_url || null,
      category_name_en: thread.forum_categories?.name_en || '',
      category_name_fr: thread.forum_categories?.name_fr || '',
      category_name_es: thread.forum_categories?.name_es || '',
      category_color_hex: thread.forum_categories?.color_hex || '#000000',
      category_icon: thread.forum_categories?.icon || null,
      user_has_liked: false,
      media: []
    }));

    return transformedFeatured as ForumThread[];
  } catch (error) {
    console.error('Error in getFeaturedForumPosts:', error);
    return [];
  }
}
