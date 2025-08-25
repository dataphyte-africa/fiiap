'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LucideMessageSquare, 
  LucideEye, 
  LucideHeart, 
  LucideEdit,
  LucideTrash2,
  LucideImage
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Database } from '@/types/db';
import { CreatePostModal } from './create-post-modal';
import { usePosts } from '@/hooks/use-posts';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  reply_count: number;
  category_id: string;
  tags: string[] | null;
  author: {
    name: string;
    avatar_url?: string;
  };
  media: Array<{
    id: string;
    file_url: string;
    file_name: string | null;
    file_type: string | null;
    mime_type: string | null;
    storage_path: string | null;
    file_size: number | null;
  }>;
}

const PostCard = ({post, handleDeletePost, handleEditPost}: {post: Post, handleDeletePost: (postId: string) => void, handleEditPost: ()=>void}) => {
  return (
    <Card key={post.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="size-12">
              <AvatarImage src={post.author.avatar_url} />
              <AvatarFallback>
                {post.author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{post.author.name}</CardTitle>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          {/* Edit and Delete buttons directly on the card */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleEditPost()}
              className="flex items-center space-x-2"
            >
              <LucideEdit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleDeletePost(post.id)}
              className="flex items-center space-x-2"
            >
              <LucideTrash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Post Content */}
        <div>
          <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Media with Carousel for multiple items */}
        {post.media.length > 0 && (
          <div className="w-full">
            {post.media.length === 1 ? (
              // Single media item - no carousel needed
              <div className="relative">
                {post.media[0].file_type === 'image' ? (
                  <img
                    src={post.media[0].file_url}
                    alt={post.media[0].file_name || 'Image'}
                    className="w-full max-h-96 object-cover rounded-lg border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : (
                  <video
                    src={post.media[0].file_url}
                    controls
                    className="w-full max-h-96 rounded-lg border"
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
                
                {/* Fallback placeholder for failed images */}
                {post.media[0].file_type === 'image' && (
                  <div className="hidden w-full h-32 bg-gray-100 rounded-lg border flex items-center justify-center">
                    <LucideImage className="h-8 w-8 text-gray-400" />
                    <span className="text-xs text-gray-500 ml-2">
                      {post.media[0].file_name || 'Image'}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              // Multiple media items - use carousel
              <Carousel className="w-full max-w-full">
                <CarouselContent>
                  {post.media.map((media) => (
                    <CarouselItem key={media.id}>
                      <div className="relative">
                        {media.file_type === 'image' ? (
                          <img
                            src={media.file_url}
                            alt={media.file_name || 'Image'}
                            className="w-full h-64 object-cover rounded-lg border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : (
                          <video
                            src={media.file_url}
                            controls
                            className="w-full h-64 object-cover rounded-lg border"
                            preload="metadata"
                          >
                            Your browser does not support the video tag.
                          </video>
                        )}
                        
                        {/* Fallback placeholder for failed images */}
                        {media.file_type === 'image' && (
                          <div className="hidden w-full h-64 bg-gray-100 rounded-lg border flex items-center justify-center">
                            <LucideImage className="h-8 w-8 text-gray-400" />
                            <span className="text-xs text-gray-500 ml-2">
                              {media.file_name || 'Image'}
                            </span>
                          </div>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className='-left-3'/>
                <CarouselNext className='-right-3'/>
              </Carousel>
            )}
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Post Stats - removed reply button */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <LucideEye className="h-4 w-4" />
              <span>{post.view_count}</span>
            </div>
            <div className="flex items-center space-x-1">
              <LucideMessageSquare className="h-4 w-4" />
              <span>{post.reply_count}</span>
            </div>
            <div className="flex items-center space-x-1">
              <LucideHeart className="h-4 w-4" />
              <span>0</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PostsList({profile}: {profile: Database['public']['Tables']['profiles']['Row']}) {
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  
  const { 
    posts, 
    isLoading: loading, 
    deletePost
  } = usePosts(profile?.organisation_id || undefined);

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    deletePost(postId);
  };

  const handleEditPost = (post: Post) => {
    setPostToEdit(post);
    setOpenEditModal(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <LucideMessageSquare className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-500 text-center mb-4">
            Start sharing updates, announcements, and insights with your organisation.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} handleDeletePost={handleDeletePost} handleEditPost={() => handleEditPost(post)} />
      ))}
    </div>
    {(openEditModal && postToEdit) && <CreatePostModal 
      isOpen={openEditModal}
      onClose={() => setOpenEditModal(false)}
      profile={profile}
      content={postToEdit?.content}
      media={postToEdit?.media}
      hashtags={postToEdit?.tags || []}
      mode="edit"
      postId={postToEdit?.id}
      categoryId={postToEdit.category_id}
    />}
    </>
  );
}
