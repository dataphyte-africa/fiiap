import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/db";

export type BlogComment = Database['public']['Tables']['blog_post_comments']['Row'];
export type BlogLike = Database['public']['Tables']['blog_post_likes']['Row'];

export interface BlogCommentWithAuthor extends BlogComment {
  profiles: {
    id: string;
    name: string;
    avatar_url: string | null;
  } | null;
}

export interface CommentData {
  content: string;
  blog_post_id: string;
  author_name?: string;
  author_email?: string;
  parent_comment_id?: string;
}

// Get comments for a blog post
export async function getBlogComments(blogPostId: string): Promise<BlogCommentWithAuthor[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('blog_post_comments')
    .select(`
      *,
      profiles!blog_post_comments_author_id_fkey (
        id,
        name,
        avatar_url
      )
    `)
    .eq('blog_post_id', blogPostId)
    .eq('moderation_status', 'approved')
    .is('parent_comment_id', null) // Only get top-level comments for now
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog comments:', error);
    throw error;
  }

  return data as BlogCommentWithAuthor[];
}

// Add a comment to a blog post
export async function addBlogComment(commentData: CommentData): Promise<BlogComment> {
  const supabase = createClient();
  
  // Get current user if authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  const insertData: Database['public']['Tables']['blog_post_comments']['Insert'] = {
    content: commentData.content,
    blog_post_id: commentData.blog_post_id,
    parent_comment_id: commentData.parent_comment_id || null,
    moderation_status: 'approved', // Auto-approve for now, can be changed later
  };

  if (user) {
    // Authenticated user
    insertData.author_id = user.id;
  } else {
    // Anonymous user
    insertData.author_name = commentData.author_name;
    insertData.author_email = commentData.author_email;
    
    // Generate anonymous identifier
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
    const timestamp = Date.now().toString();
    insertData.anonymous_identifier = btoa(`${userAgent}-${timestamp}`).slice(0, 50);
  }

  const { data, error } = await supabase
    .from('blog_post_comments')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('Error adding blog comment:', error);
    throw error;
  }

  // Update comment count on blog post
  const { data: currentPost } = await supabase
    .from('blog_posts')
    .select('comment_count')
    .eq('id', commentData.blog_post_id)
    .single();

  if (currentPost) {
    await supabase
      .from('blog_posts')
      .update({ comment_count: (currentPost.comment_count || 0) + 1 })
      .eq('id', commentData.blog_post_id)
  }

  return data;
}

// Check if user has liked a blog post
export async function hasUserLikedPost(blogPostId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false; // Anonymous users can't like posts
  }

  const { data, error } = await supabase
    .from('blog_post_likes')
    .select('id')
    .eq('blog_post_id', blogPostId)
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking blog post like:', error);
    return false;
  }

  return !!data;
}

// Toggle like on a blog post
export async function toggleBlogPostLike(blogPostId: string): Promise<{ liked: boolean; likeCount: number }> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('You must be logged in to like posts');
  }

  // Check if user already liked the post
  const { data: existingLike } = await supabase
    .from('blog_post_likes')
    .select('id')
    .eq('blog_post_id', blogPostId)
    .eq('user_id', user.id)
    .single();

  let liked = false;

  if (existingLike) {
    // Unlike the post
    await supabase
      .from('blog_post_likes')
      .delete()
      .eq('blog_post_id', blogPostId)
      .eq('user_id', user.id);
    
    liked = false;
  } else {
    // Like the post
    await supabase
      .from('blog_post_likes')
      .insert({
        blog_post_id: blogPostId,
        user_id: user.id,
      });
    
    liked = true;
  }

  // Get updated like count
  const { data: blogPost } = await supabase
    .from('blog_posts')
    .select('like_count')
    .eq('id', blogPostId)
    .single();

  return {
    liked,
    likeCount: blogPost?.like_count || 0
  };
}

// Get blog post like count
export async function getBlogPostLikeCount(blogPostId: string): Promise<number> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('like_count')
    .eq('id', blogPostId)
    .single();

  if (error) {
    console.error('Error fetching blog post like count:', error);
    return 0;
  }

  return data.like_count || 0;
}

// Get comment count for a blog post
export async function getBlogPostCommentCount(blogPostId: string): Promise<number> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('comment_count')
    .eq('id', blogPostId)
    .single();

  if (error) {
    console.error('Error fetching blog post comment count:', error);
    return 0;
  }

  return data.comment_count || 0;
}
