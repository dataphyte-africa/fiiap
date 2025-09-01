'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock, User, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BlogPostWithAuthor } from '@/lib/data/blogs';
import { cn } from '@/lib/utils';

interface BlogPostCarouselProps {
  posts: BlogPostWithAuthor[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function BlogPostCarousel({ 
  posts, 
  autoPlay = true, 
  autoPlayInterval = 5000 
}: BlogPostCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoPlay || posts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % posts.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, posts.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % posts.length);
  };

  if (posts.length === 0) {
    return null;
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="relative w-full">
      {/* Main Carousel */}
      <div className="relative h-[500px] overflow-hidden rounded-lg">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className={cn(
              "absolute inset-0 transition-transform duration-500 ease-in-out",
              index === currentSlide ? "translate-x-0" : 
              index < currentSlide ? "-translate-x-full" : "translate-x-full"
            )}
          >
            <Card className="h-full border-0 shadow-lg">
              <CardContent className="p-0 h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                  {/* Image Section */}
                  <div className="relative h-64 md:h-full">
                    {post.featured_image_url ? (
                      <Image
                        src={post.featured_image_url}
                        alt={post.featured_image_alt || post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <div className="text-6xl text-blue-300">📝</div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                  </div>

                  {/* Content Section */}
                  <div className="p-8 flex flex-col justify-center">
                    <div className="space-y-4">
                      {/* Featured Badge */}
                      <Badge variant="secondary" className="w-fit">
                        Featured Story
                      </Badge>

                      {/* Title */}
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 line-clamp-2">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-gray-600 line-clamp-3 text-lg">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Meta Information */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {post.organisations && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{post.organisations.name}</span>
                          </div>
                        )}
                        {post.published_at && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(post.published_at)}</span>
                          </div>
                        )}
                        {post.reading_time_minutes && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{post.reading_time_minutes} min read</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Read More Button */}
                      <Link 
                        href={`/blogs/${post.slug}`}
                        className="inline-block"
                      >
                        <Button className="mt-4">
                          Read Full Story
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {posts.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg"
            onClick={goToNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {posts.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {posts.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-colors duration-200",
                index === currentSlide 
                  ? "bg-blue-600" 
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
