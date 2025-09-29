import React from 'react';
import { TextSlot } from '@/components/ui/text-slot';
import { BlogPostGrid } from '@/components/blogs/blog-post-grid';
import { getFeaturedBlogPosts } from '@/lib/data/featured-content';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export async function FeaturedBlogPosts() {
  const t = await getTranslations('landingPage.featuredBlogs');
  const featuredPosts = await getFeaturedBlogPosts(3);

  if (featuredPosts.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 px-4 md:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Title and Subtitle */}
        <div className="flex flex-col md:flex-row md:justify-between mb-12">
          <TextSlot 
            title={t('title')}
            subtitle={t('subtitle')}
            containerClassName="gap-4"
            titleClassName="text-4xl font-bold text-gray-900"
            subtitleClassName="text-lg text-gray-600 max-w-2xl"
          />
          <Button asChild variant="outline" size="lg" className="group">
            <Link href="/blogs">
              {t('viewAllButton')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Blog Posts Grid */}
        <div className="mb-8">
          <BlogPostGrid posts={featuredPosts} showStats={true} />
        </div>

        {/* View All Button */}
        <div className="text-center">
          
        </div>
      </div>
    </section>
  );
}
