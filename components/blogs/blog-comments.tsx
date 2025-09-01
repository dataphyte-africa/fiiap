'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { User, MessageCircle, Send, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  getBlogComments, 
  addBlogComment, 
  type BlogCommentWithAuthor, 
  type CommentData 
} from '@/lib/data/blog-interactions';

interface BlogCommentsProps {
  blogPostId: string;
  initialCommentCount?: number;
}

interface CommentFormData {
  content: string;
  author_name: string;
  author_email: string;
}

function CommentSkeleton() {
  return (
    <div className="flex gap-3 p-4">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}

function CommentItem({ comment }: { comment: BlogCommentWithAuthor }) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAuthorName = () => {
    if (comment.profiles?.name) return comment.profiles.name;
    if (comment.author_name) return comment.author_name;
    return 'Anonymous';
  };

  const getAuthorAvatar = () => {
    return comment.profiles?.avatar_url;
  };

  return (
    <div className="flex gap-3 p-4 border-b border-gray-100 last:border-b-0">
      <div className="w-10 h-10 relative flex-shrink-0">
        {getAuthorAvatar() ? (
          <Image
            src={getAuthorAvatar()!}
            alt={getAuthorName()}
            fill
            className="object-cover rounded-full"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-gray-500" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-gray-900">{getAuthorName()}</span>
          <span className="text-sm text-gray-500">
            {formatDate(comment.created_at)}
          </span>
        </div>
        
        <div className="text-gray-700 whitespace-pre-wrap break-words">
          {comment.content}
        </div>
      </div>
    </div>
  );
}

function CommentForm({ 
  blogPostId, 
  onCommentAdded 
}: { 
  blogPostId: string; 
  onCommentAdded: () => void; 
}) {
  const [formData, setFormData] = useState<CommentFormData>({
    content: '',
    author_name: '',
    author_email: ''
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const queryClient = useQueryClient();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  const addCommentMutation = useMutation({
    mutationFn: async (commentData: CommentData) => {
      return await addBlogComment(commentData);
    },
    onSuccess: () => {
      // Reset form
      setFormData({ content: '', author_name: '', author_email: '' });
      
      // Invalidate and refetch comments
      queryClient.invalidateQueries({ queryKey: ['blog-comments', blogPostId] });
      
      // Call the callback
      onCommentAdded();
    },
    onError: (error) => {
      console.error('Failed to add comment:', error);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim()) return;
    
    if (!isAuthenticated && (!formData.author_name.trim() || !formData.author_email.trim())) {
      return;
    }

    const commentData: CommentData = {
      content: formData.content.trim(),
      blog_post_id: blogPostId,
      ...(isAuthenticated ? {} : {
        author_name: formData.author_name.trim(),
        author_email: formData.author_email.trim()
      })
    };

    addCommentMutation.mutate(commentData);
  };

  if (isAuthenticated === null) {
    return <Skeleton className="h-32 w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Add a Comment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isAuthenticated && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author_name">Name *</Label>
                <Input
                  id="author_name"
                  type="text"
                  value={formData.author_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                  placeholder="Your name"
                  required={!isAuthenticated}
                />
              </div>
              <div>
                <Label htmlFor="author_email">Email *</Label>
                <Input
                  id="author_email"
                  type="email"
                  value={formData.author_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, author_email: e.target.value }))}
                  placeholder="your.email@example.com"
                  required={!isAuthenticated}
                />
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="content">Comment *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Share your thoughts..."
              rows={4}
              required
            />
          </div>

          {addCommentMutation.error && (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to add comment. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            disabled={addCommentMutation.isPending}
            className="w-full md:w-auto"
          >
            {addCommentMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Post Comment
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function BlogComments({ blogPostId, initialCommentCount = 0 }: BlogCommentsProps) {
  const [commentCount, setCommentCount] = useState(initialCommentCount);

  const {
    data: comments,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['blog-comments', blogPostId],
    queryFn: () => getBlogComments(blogPostId),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });

  const handleCommentAdded = () => {
    setCommentCount(prev => prev + 1);
    refetch();
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load comments. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-gray-600" />
        <h2 className="text-xl font-semibold">
          Comments ({comments?.length || commentCount})
        </h2>
      </div>

      <CommentForm 
        blogPostId={blogPostId} 
        onCommentAdded={handleCommentAdded}
      />

      <Card>
        {isLoading ? (
          <CardContent className="p-0">
            {Array.from({ length: 3 }).map((_, index) => (
              <CommentSkeleton key={index} />
            ))}
          </CardContent>
        ) : comments && comments.length > 0 ? (
          <CardContent className="p-0">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </CardContent>
        ) : (
          <CardContent className="p-6 text-center text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
