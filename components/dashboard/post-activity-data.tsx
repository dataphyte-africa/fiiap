import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

interface PostData {
  id: string;
  title: string;
  excerpt?: string;
  status: string;
  published_at?: string;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  category?: string;
}

interface PostsSummary {
  posts: PostData[];
  totalPosts: number;
  totalViews: number;
  totalReplies: number;
}

async function getPostsData(organisationId: string): Promise<PostsSummary> {
  const supabase = await createClient();
  
  // Fetch posts for the organisation with related data
  const { data: posts, error } = await supabase
    .from('forum_threads')
    .select(`
      id,
      title,
      content,
      created_at,
      updated_at,
      view_count,
      reply_count,
      category_id,
      tags
    `)
    .eq('organisation_id', organisationId)
    .order('created_at', { ascending: false })
    .limit(3);

  
  if (error) {
    console.error('Error fetching posts:', error);
    return {
      posts: [],
      totalPosts: 0, 
      totalViews: 0,
      totalReplies: 0
    };
  }

  // fetch aggregate

  const {data, count, error:err} = await supabase.from('forum_threads')
  .select('view_sum:view_count.sum(), reply_sum:reply_count.sum()', {count: 'exact'})
  .eq('organisation_id', organisationId).single()

  if(err){  
   console.log(err, "error fetch aggregates")
  }

  console.log(data, count, "aggreage query")
  


  // Transform the data to match our PostData interface
  const transformedPosts: PostData[] = posts?.map(post => ({
    id: post.id,
    title: post.title,
    excerpt: post.content ? post.content.substring(0, 120) + (post.content.length > 120 ? '...' : '') : undefined,
    status: 'published', // forum_threads are always published when created
    published_at: post.created_at || undefined,
    view_count: post.view_count || 0,
    like_count: post.reply_count || 0, // Using reply_count as like_count for now
    comment_count: post.reply_count || 0,
    category: post.category_id ? 'General' : 'General' // Simplified for now
  })) || [];

  // Calculate summary statistics
  const totalPosts = count || 0;

  const replyCount = data?.reply_sum || 0
  const viewCount = data?.view_sum || 0

  return {
    posts: transformedPosts,
    totalPosts,
   
    totalViews: viewCount,
    totalReplies: replyCount
  };
}

export async function PostActivityData({ organisationId }: { organisationId: string }) {
  const { posts, totalPosts, totalViews, totalReplies } = await getPostsData(organisationId);

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      published: "bg-green-100 text-green-800",
      archived: "bg-yellow-100 text-yellow-800",
      flagged: "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
          <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="font-semibold text-sm mb-2">No Posts Yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Share updates about your projects and engage with the community.
        </p>
        <Link 
          href="/dashboard/posts" 
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
        >
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Post
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Published</p>
          <p className="text-xl font-bold text-green-600">{totalPosts}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Total Replies</p>
          <p className="text-xl font-bold text-gray-600">{totalReplies}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Total Views</p>
          <p className="text-xl font-bold text-blue-600">{totalViews.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-3">
        {posts.slice(0, 3).map((post) => (
          <Link 
            key={post.id} 
            href={`/dashboard/posts`}
            className="block space-y-2 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-sm truncate flex-1 mr-2">{post.title}</h4>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                {post.status}
              </span>
            </div>
            
            {post.excerpt && (
              <p className="text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-3">
                {post.view_count !== undefined && (
                  <div className="flex items-center">
                    <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {post.view_count}
                  </div>
                )}
                {post.like_count !== undefined && post.like_count > 0 && (
                  <div className="flex items-center">
                    <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {post.like_count}
                  </div>
                )}
                {post.comment_count !== undefined && post.comment_count > 0 && (
                  <div className="flex items-center">
                    <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {post.comment_count}
                  </div>
                )}
              </div>
              {post.published_at && (
                <div className="flex items-center">
                  <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatTimeAgo(post.published_at)}
                </div>
              )}
            </div>

            {post.category && (
              <div className="flex items-center">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
                  {post.category}
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center text-sm text-muted-foreground">
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {totalPosts} total posts
        </div>
        <Link 
          href="/dashboard/posts"
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          View All →
        </Link>
      </div>
    </>
  );
}
