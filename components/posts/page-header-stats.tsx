import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideMessageSquare, LucideEye, LucideHeart } from 'lucide-react';

interface PostsStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  postsGrowth: number;
  viewsGrowth: number;
  likesGrowth: number;
}

async function getPostsStats(organisationId: string): Promise<PostsStats> {
   
  const supabase = await createClient();
  
  // Get current month stats
  const currentMonth = new Date();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  const lastMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);

  // Fetch all posts for the organisation (not just current month for total counts)
  const { data: allPosts, error: allPostsError } = await supabase
    .from('forum_threads')
    .select('id, view_count, reply_count, created_at')
    .eq('organisation_id', organisationId);

  if (allPostsError) {
    console.error('Error fetching posts:', allPostsError);
    return {
      totalPosts: 0,
      totalViews: 0,
      totalLikes: 0,
      postsGrowth: 0,
      viewsGrowth: 0,
      likesGrowth: 0
    };
  }

  // Calculate total counts from all posts
  const totalPosts = allPosts?.length || 0;
  const totalViews = allPosts?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;
  const totalLikes = allPosts?.reduce((sum, post) => sum + (post.reply_count || 0), 0) || 0;

  // Filter posts for current and last month
  const currentMonthPosts = allPosts?.filter(post => 
    new Date(post.created_at || '') >= firstDayOfMonth
  ) || [];
  
  const lastMonthPosts = allPosts?.filter(post => {
    const postDate = new Date(post.created_at || '');
    return postDate >= lastMonth && postDate <= lastMonthEnd;
  }) || [];

  // Calculate growth percentages
  const currentMonthPostsCount = currentMonthPosts.length;
  const lastMonthPostsCount = lastMonthPosts.length;
  
  const currentMonthViews = currentMonthPosts.reduce((sum, post) => sum + (post.view_count || 0), 0);
  const lastMonthViews = lastMonthPosts.reduce((sum, post) => sum + (post.view_count || 0), 0);
  
  const currentMonthLikes = currentMonthPosts.reduce((sum, post) => sum + (post.reply_count || 0), 0);
  const lastMonthLikes = lastMonthPosts.reduce((sum, post) => sum + (post.reply_count || 0), 0);

  const postsGrowth = lastMonthPostsCount > 0 ? ((currentMonthPostsCount - lastMonthPostsCount) / lastMonthPostsCount) * 100 : 0;
  const viewsGrowth = lastMonthViews > 0 ? ((currentMonthViews - lastMonthViews) / lastMonthViews) * 100 : 0;
  const likesGrowth = lastMonthLikes > 0 ? ((currentMonthLikes - lastMonthLikes) / lastMonthLikes) * 100 : 0;

  return {
    totalPosts,
    totalViews,
    totalLikes,
    postsGrowth,
    viewsGrowth,
    likesGrowth
  };
}

export async function PageHeaderStats({ organisationId }: { organisationId: string }) {
  const stats = await getPostsStats(organisationId);

  const formatGrowthText = (growth: number) => {
    if (growth === 0) return `No change from last month`;
    if (growth > 0) return `+${Math.round(growth)}% from last month`;
    return `${Math.round(growth)}% from last month`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          <LucideMessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPosts}</div>
          <p className="text-xs text-muted-foreground">
            {formatGrowthText(stats.postsGrowth)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <LucideEye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {formatGrowthText(stats.viewsGrowth)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Replies</CardTitle>
          <LucideHeart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalLikes}</div>
          <p className="text-xs text-muted-foreground">
            {formatGrowthText(stats.likesGrowth)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
