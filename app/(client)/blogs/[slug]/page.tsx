import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Calendar, Eye, MessageCircle } from 'lucide-react';
import { getBlogPosts, incrementViewCount } from '@/lib/data/blogs';
import { Badge } from '@/components/ui/badge';
import { EnhancedBlogViewer } from '@/components/blogs/enhanced-blog-viewer';
import { BlogPostGrid } from '@/components/blogs/blog-post-grid';
import { BlogPostGridSkeleton } from '@/components/blogs/blog-post-skeleton';
import { BlogComments } from '@/components/blogs/blog-comments';
import { BlogLikeButton } from '@/components/blogs/blog-like-button';
import { BlogShareModal } from '@/components/blogs/blog-share-modal';
import { createClient } from '@/lib/supabase/server';

interface BlogPostPageProps {
  params: Promise< {
    slug: string;
  }>;
}

// Use the new function from the data layer
async function getBlogPostBySlug(slug: string) {
   const supabase = await createClient();
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
    console.error('Error fetching blog post by slug:', error);
    return null;
  }

  return data;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const {slug} = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found | FIIAP',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | FIIAP`,
    description: post.meta_description || post.excerpt || `Read ${post.title} on FIIAP`,
    keywords: post.tags?.join(', '),
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || '',
      type: 'article',
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
      authors: post.organisations?.name ? [post.organisations.name] : undefined,
      images: post.featured_image_url ? [
        {
          url: post.featured_image_url,
          alt: post.featured_image_alt || post.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || '',
      images: post.featured_image_url ? [post.featured_image_url] : undefined,
    },
  };
}

async function RelatedPosts({ currentPostId, organisationId }: { currentPostId: string; organisationId: string }) {
  try {
    const { data: relatedPosts } = await getBlogPosts({
      status: 'published',
      moderation_status: 'approved',
      organisation_id: organisationId,
      limit: 3,
      sortBy: 'published_at',
      sortOrder: 'desc'
    });

    const filtered = relatedPosts.filter(post => post.id !== currentPostId);

    if (filtered.length === 0) {
      return null;
    }

    return (
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          More from {filtered[0]?.organisations?.name || 'this organization'}
        </h2>
        <BlogPostGrid posts={filtered} showStats={false} />
      </section>
    );
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return null;
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const {slug} = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Increment view count (fire and forget)
  incrementViewCount(post.id).catch(console.error);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number | null) => {
    if (!num) return '0';
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };



  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/blogs" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Stories
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          {/* Organization Info */}
          {post.organisations && (
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 relative">
                {post.organisations.logo_url ? (
                  <Image
                    src={post.organisations.logo_url}
                    alt={post.organisations.name}
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-blue-600">
                  {post.organisations.name}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {post.published_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                  )}
                  {post.reading_time_minutes && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.reading_time_minutes} min read</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Stats and Actions */}
          <div className="flex items-center justify-between py-4 border-y border-gray-200">
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{formatNumber(post.view_count)} views</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{formatNumber(post.comment_count)} comments</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BlogLikeButton 
                blogPostId={post.id}
                initialLikeCount={post.like_count || 0}
                variant="outline"
                size="sm"
              />
              <BlogShareModal
                title={post.title}
                url={`/blogs/${post.slug}`}
                excerpt={post.excerpt || undefined}
              />
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image_url && (
          <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <img
              src={post.featured_image_url}
              alt={post.featured_image_alt || post.title}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
              
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {post.content_html ? (
            <div dangerouslySetInnerHTML={{ __html: post.content_html }} />
          ) : post.content ? (
            <EnhancedBlogViewer content={JSON.stringify(post.content)} />
          ) : (
            <p className="text-gray-500 italic">No content available.</p>
          )}
        </div>

        {/* Article Footer */}
        <footer className="border-t border-gray-200 pt-8 mb-12">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Last updated: {formatDate(post.updated_at)}
            </div>
            <div className="flex items-center gap-4">
              <BlogLikeButton 
                blogPostId={post.id}
                initialLikeCount={post.like_count || 0}
                variant="outline"
                size="sm"
              />
              <BlogShareModal
                title={post.title}
                url={`/blogs/${post.slug}`}
                excerpt={post.excerpt || undefined}
              />
            </div>
          </div>
        </footer>

        {/* Comments Section */}
        <div className="border-t border-gray-200 pt-12">
          <BlogComments 
            blogPostId={post.id} 
            initialCommentCount={post.comment_count || 0}
          />
        </div>
      </article>

      {/* Related Posts */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <Suspense fallback={<BlogPostGridSkeleton count={3} />}>
            <RelatedPosts 
              currentPostId={post.id} 
              organisationId={post.organisation_id} 
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
