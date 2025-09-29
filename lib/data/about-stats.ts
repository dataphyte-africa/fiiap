import { createClient } from '@/lib/supabase/server';

export interface AboutPageStats {
  organizationsCount: number;
  forumPostsCount: number;
  resourcesCount: number;
  countriesReach: number;
}

export async function getAboutPageStats(): Promise<AboutPageStats> {
  const supabase = await createClient();
  
  try {
    // Get active organizations count
    const { count: organizationsCount } = await supabase
      .from('organisations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get forum posts (threads) count
    const { count: forumPostsCount } = await supabase
      .from('forum_threads')
      .select('*', { count: 'exact', head: true });

    // Get resources count
    const { count: resourcesCount } = await supabase
      .from('resource_library')
      .select('*', { count: 'exact', head: true })
      .eq('is_visible', true);

    // Get unique countries count from active organizations
    const { data: countriesData } = await supabase
      .from('organisations')
      .select('country')
      .eq('status', 'active');

    const uniqueCountries = new Set(countriesData?.map(org => org.country) || []);
    const countriesReach = uniqueCountries.size;

    return {
      organizationsCount: organizationsCount || 0,
      forumPostsCount: forumPostsCount || 0,
      resourcesCount: resourcesCount || 0,
      countriesReach
    };
  } catch (error) {
    console.error('Error fetching about page stats:', error);
    return {
      organizationsCount: 0,
      forumPostsCount: 0,
      resourcesCount: 0,
      countriesReach: 0
    };
  }
}
