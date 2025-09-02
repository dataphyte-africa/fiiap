import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BlogPostWithAuthor } from '@/lib/data/blogs';
import { BlogPostCarousel } from '@/components/blogs/blog-post-carousel';
import { BlogPostGrid } from '@/components/blogs/blog-post-grid';
import { BlogPostCarouselSkeleton, BlogPostGridSkeleton } from '@/components/blogs/blog-post-skeleton';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Stories from Our Community | FIIAP',
  description: 'Discover inspiring stories, insights, and opportunities shared by CSOs across West Africa.',
  openGraph: {
    title: 'Stories from Our Community | FIIAP',
    description: 'Discover inspiring stories, insights, and opportunities shared by CSOs across West Africa.',
    type: 'website',
  },
};

interface BlogsPageProps {
  searchParams: Promise< {
    page?: string;
    search?: string;
    language?: string;
  }>;
}

async function FeaturedPosts() {
  const t = await getTranslations('blogs.featured');
  
  try {
    const supabase = await createClient();
    const { data: featuredPosts } = await supabase
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
    `, { count: 'exact' }).eq('is_featured', true).eq('status', 'published').eq('moderation_status', 'approved').limit(5).order('published_at', { ascending: false });

    if (featuredPosts && featuredPosts.length === 0) {
      return null;
    }

    return (
      <section className="mb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-gray-600 max-w-2xl">
            {t('description')}
          </p>
        </div>
        <BlogPostCarousel posts={featuredPosts as BlogPostWithAuthor[]} />
      </section>
    );
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return null;
  }
}

async function BlogPostsList({ searchParams }: { searchParams: BlogsPageProps['searchParams'] }) {
  const t = await getTranslations('blogs');
  const {page, search, language} = await searchParams;
  const pageInt = parseInt(page || '1');
  const searchStr = search;
  const languageStr = language as 'English' | 'French' | undefined;
  const supabase = await createClient();

  try {
    const { data: posts, count: totalCount } = await supabase.from('blog_posts').select(`
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
    `, { count: 'exact' }).eq('status', 'published').eq('moderation_status', 'approved').eq('is_featured', false).order('published_at', { ascending: false }).range((pageInt - 1) * 12, pageInt * 12 - 1);
    const totalPages = Math.ceil(( totalCount || 0) / 12);
    const hasPrevPage = pageInt > 1;
    const hasNextPage = pageInt < totalPages;
    const currentPage = pageInt;
    return (
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('latest.title')}
            </h2>
            <p className="text-gray-600">
              {t('latest.description')}
            </p>
          </div>
          
          {/* Search and filters could be added here */}
        </div>

        <BlogPostGrid posts={posts as BlogPostWithAuthor[]} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {hasPrevPage && (
              <a
                href={`?page=${currentPage - 1}${searchStr ? `&search=${searchStr}` : ''}${languageStr ? `&language=${languageStr}` : ''}`}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {t('pagination.previous')}
              </a>
            )}
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <a
                    key={pageNum}
                    href={`?page=${pageNum}${search ? `&search=${search}` : ''}${language ? `&language=${language}` : ''}`}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      pageNum === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </a>
                );
              })}
            </div>

            {hasNextPage && (
              <a
                href={`?page=${currentPage + 1}${search ? `&search=${search}` : ''}${language ? `&language=${language}` : ''}`}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {t('pagination.next')}
              </a>
            )}
          </div>
        )}
      </section>
    );
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t('error.title')}
        </h3>
        <p className="text-gray-600">
          {t('error.description')}
        </p>
      </div>
    );
  }
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const t = await getTranslations('blogs.hero');
  
  return (
    <div className="min-h-screen container ">
      {/* Hero Section */}
      <div className="bg-[url('/blog/blog-bg.png')] bg-cover bg-center  text-white md:min-h-[50vh] flex flex-col justify-center items-center relative">
        <div className="absolute inset-0 bg-primary/45" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              {t('description')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Featured Posts Section */}
        <Suspense fallback={<BlogPostCarouselSkeleton />}>
          <FeaturedPosts />
        </Suspense>

        {/* All Posts Section */}
        <Suspense fallback={<BlogPostGridSkeleton count={12} />}>
          <BlogPostsList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
