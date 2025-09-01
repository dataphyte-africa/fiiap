'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, User, Calendar, Heart, MessageCircle, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlogPostWithAuthor } from '@/lib/data/blogs';

interface BlogPostCardProps {
  post: BlogPostWithAuthor;
  showStats?: boolean;
}

export function BlogPostCard({ post, showStats = true }: BlogPostCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 group">
      {/* Featured Image */}
      <div className="relative h-48 overflow-hidden">
        {post.featured_image_url ? (
          <img
            src={post.featured_image_url}
            alt={post.featured_image_alt || post.title}
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-4xl text-gray-400">📝</div>
          </div>
        )}
        {post.is_featured && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            Featured
          </Badge>
        )}
      </div>

      <CardContent className="p-6 flex-1">
        <div className="space-y-3">
          {/* Organization */}
          {post.organisations && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 relative">
                {post.organisations.logo_url ? (
                  <Image
                    src={post.organisations.logo_url}
                    alt={post.organisations.name}
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 " />
                  </div>
                )}
              </div>
              <span className="font-medium">{post.organisations.name}</span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-bold text-lg md:text-2xl text-primary line-clamp-2 group-hover:text-primary/80 transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-gray-600 line-clamp-3 text-sm">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{post.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        {/* Meta Information */}
        <div className="flex flex-wrap  items-center  gap-4 text-xs text-muted-foreground w-full">
          {post.published_at && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(post.published_at)}</span>
            </div>
          )}
          {post.reading_time_minutes && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{post.reading_time_minutes} min</span>
            </div>
          )}
        </div>

        {/* Stats and Action */}
        <div className="flex items-center justify-between w-full">
          {showStats && (
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{formatNumber(post.view_count)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{formatNumber(post.like_count)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>{formatNumber(post.comment_count)}</span>
              </div>
            </div>
          )}

          <Link href={`/blogs/${post.slug}`} className="ml-auto">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              Read More
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
