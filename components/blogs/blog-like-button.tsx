'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  toggleBlogPostLike, 
  hasUserLikedPost, 
  getBlogPostLikeCount 
} from '@/lib/data/blog-interactions';

interface BlogLikeButtonProps {
  blogPostId: string;
  initialLikeCount?: number;
  initialLiked?: boolean;
  className?: string;
  showCount?: boolean;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
}

export function BlogLikeButton({ 
  blogPostId, 
  initialLikeCount = 0, 
  initialLiked = false,
  className,
  showCount = true,
  variant = 'outline',
  size = 'default'
}: BlogLikeButtonProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [optimisticLiked, setOptimisticLiked] = useState(initialLiked);
  const [optimisticCount, setOptimisticCount] = useState(initialLikeCount);
  const queryClient = useQueryClient();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  // Query to check if user has liked the post
  const { data: hasLiked } = useQuery({
    queryKey: ['blog-post-liked', blogPostId],
    queryFn: () => hasUserLikedPost(blogPostId),
    enabled: isAuthenticated === true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query to get current like count
  const { data: likeCount } = useQuery({
    queryKey: ['blog-post-like-count', blogPostId],
    queryFn: () => getBlogPostLikeCount(blogPostId),
    staleTime: 30 * 1000, // 30 seconds
  });

  // Mutation to toggle like
  const toggleLikeMutation = useMutation({
    mutationFn: () => toggleBlogPostLike(blogPostId),
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['blog-post-liked', blogPostId] });
      await queryClient.cancelQueries({ queryKey: ['blog-post-like-count', blogPostId] });

      // Snapshot the previous values
      const previousLiked = queryClient.getQueryData(['blog-post-liked', blogPostId]);
      const previousCount = queryClient.getQueryData(['blog-post-like-count', blogPostId]);

      // Optimistically update
      const newLiked = !optimisticLiked;
      const newCount = newLiked ? optimisticCount + 1 : Math.max(0, optimisticCount - 1);
      
      setOptimisticLiked(newLiked);
      setOptimisticCount(newCount);

      // Optimistically update the cache
      queryClient.setQueryData(['blog-post-liked', blogPostId], newLiked);
      queryClient.setQueryData(['blog-post-like-count', blogPostId], newCount);

      return { previousLiked, previousCount };
    },
    onError: (err, variables, context) => {
      // Revert optimistic updates on error
      if (context?.previousLiked !== undefined) {
        setOptimisticLiked(!!context.previousLiked as boolean || false);
        queryClient.setQueryData(['blog-post-liked', blogPostId], context.previousLiked);
      }
      if (context?.previousCount !== undefined) {
        setOptimisticCount(context.previousCount as number || 0);
        queryClient.setQueryData(['blog-post-like-count', blogPostId], context.previousCount);
      }
      console.error('Failed to toggle like:', err);
    },
    onSuccess: (data) => {
      // Update with server response
      setOptimisticLiked(data.liked);
      setOptimisticCount(data.likeCount);
      
      queryClient.setQueryData(['blog-post-liked', blogPostId], data.liked);
      queryClient.setQueryData(['blog-post-like-count', blogPostId], data.likeCount);
    },
  });

  const handleClick = () => {
    if (isAuthenticated === false) {
      // Redirect to login or show login modal
      window.location.href = '/auth/login';
      return;
    }

    if (isAuthenticated && !toggleLikeMutation.isPending) {
      toggleLikeMutation.mutate();
    }
  };

  // Use server data when available, fallback to optimistic/initial values
  const currentLiked = hasLiked !== undefined ? hasLiked : optimisticLiked;
  const currentCount = likeCount !== undefined ? likeCount : optimisticCount;

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={toggleLikeMutation.isPending || isAuthenticated === null}
      className={cn(
        'flex items-center gap-2 transition-colors',
        currentLiked && 'text-primary hover:text-primary/80',
        !currentLiked && 'hover:text-primary/80',
        className
      )}
    >
      {toggleLikeMutation.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart 
          className={cn(
            'h-4 w-4 transition-colors',
            currentLiked && 'fill-current text-primary'
          )} 
        />
      )}
      
      {showCount && (
        <span className={cn(
          'transition-colors',
          currentLiked && 'text-primary'
        )}>
          {formatCount(currentCount)}
        </span>
      )}
      
      {!showCount && (
        <span className="sr-only">
          {currentLiked ? 'Unlike' : 'Like'} this post
        </span>
      )}
    </Button>
  );
}
