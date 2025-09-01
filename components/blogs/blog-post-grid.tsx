'use client';

import { BlogPostWithAuthor } from '@/lib/data/blogs';
import { BlogPostCard } from './blog-post-card';

interface BlogPostGridProps {
  posts: BlogPostWithAuthor[];
  showStats?: boolean;
}

export function BlogPostGrid({ posts, showStats = true }: BlogPostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No blog posts found
        </h3>
        <p className="text-gray-600">
          Check back later for new stories and insights from our community.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogPostCard 
          key={post.id} 
          post={post} 
          showStats={showStats}
        />
      ))}
    </div>
  );
}
