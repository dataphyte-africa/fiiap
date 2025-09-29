import React from 'react';
import { TextSlot } from '@/components/ui/text-slot';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LucideMessageSquare, 
  LucideEye, 
  LucideHeart,
  ArrowRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getFeaturedForumPosts } from '@/lib/data/featured-content';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { ForumThread } from '@/lib/data/posts';

interface ForumPostCardProps {
  post: ForumThread;
}

function ForumPostCard({ post }: ForumPostCardProps) {
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="size-12">
              <AvatarImage src={post.organisation_logo_url || post.author_avatar_url || undefined} />
              <AvatarFallback className="bg-blue-100 text-primary">
                {(post.organisation_name || post.author_name).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {post.organisation_name || post.author_name}
              </h3>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
        
        {/* Category Badge */}
        <div className="flex items-center gap-2 mt-2">
          <Badge 
            variant="secondary" 
            className="text-xs"
            style={{ 
              backgroundColor: post.category_color_hex + '20',
              color: post.category_color_hex,
              borderColor: post.category_color_hex + '40'
            }}
          >
            {post.category_icon && (
              <span className="mr-1">{post.category_icon}</span>
            )}
            {post.category_name_en}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-4 flex-1">
        {/* Post Title */}
        <Link href={`/posts/${post.id}`}>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer">
            {post.title}
          </h2>
        </Link>

        {/* Post Content */}
        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
          {truncateContent(post.content)}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <LucideHeart className="h-4 w-4" />
              <span>{post.like_count}</span>
            </div>
            <div className="flex items-center space-x-1">
              <LucideMessageSquare className="h-4 w-4" />
              <span>{post.reply_count}</span>
            </div>
            <div className="flex items-center space-x-1">
              <LucideEye className="h-4 w-4" />
              <span>{post.view_count}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export async function FeaturedForumPosts() {
  const t = await getTranslations('landingPage.featuredPosts');
  const featuredPosts = await getFeaturedForumPosts(3);

  if (featuredPosts.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 px-4 md:px-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Title and Subtitle */}
        <div className="flex flex-col md:flex-row justify-between mb-12">
          <TextSlot 
            title={t('title')}
            subtitle={t('subtitle')}
            containerClassName="gap-4"
            titleClassName="text-4xl font-bold text-gray-900"
            subtitleClassName="text-lg text-gray-600 max-w-2xl"
          />
          <Button asChild variant="outline" size="lg" className="group">
            <Link href="/posts">
              {t('viewAllButton')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Forum Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredPosts.map((post) => (
            <ForumPostCard key={post.id} post={post} />
          ))}
        </div>

      
      </div>
    </section>
  );
}
