'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LucideMessageSquare, 
  LucideEye, 
  LucideHeart, 
  LucideImage,
  LucideMoreHorizontal,
  LucideX
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToggleThreadLike } from '@/lib/data/posts';
import { useSearchParams, useRouter } from 'next/navigation';

interface ForumMedia {
  id: string;
  file_url: string;
  file_name: string | null;
  file_type: string | null;
  mime_type: string | null;
  alt_text: string | null;
  is_featured: boolean;
  sort_order: number;
}

interface ForumCategory {
  id: string;
  name_en: string;
  name_fr: string;
  name_es: string;
  color_hex: string;
  icon: string | null;
}

interface PublicPostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    view_count: number;
    reply_count: number;
    like_count: number;
    category_id: string;
    tags: string[] | null;
    language: 'English' | 'French' | 'Spanish';
    author: {
      id: string;
      name: string;
      avatar_url?: string;
    };
    organisation: {
      id:string;
      name: string;
      logo_url?: string;
    }
    media?: ForumMedia[];
    category: ForumCategory;
    user_has_liked?: boolean;
  };
}

// Full-screen media modal component
const MediaModal = ({ 
  media, 
  isOpen, 
  onClose, 
  initialIndex = 0 
}: { 
  media: ForumMedia[]; 
  isOpen: boolean; 
  onClose: () => void; 
  initialIndex: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen) return null;

  const currentMedia = media[currentIndex];
  const hasMultiple = media.length > 1;

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'ArrowLeft') goToPrevious();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-colors"
      >
        <LucideX className="h-6 w-6 text-white" />
      </button>

      {/* Navigation arrows */}
      {hasMultiple && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-colors"
          >
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-colors"
          >
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Media content */}
      <div 
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {currentMedia.file_type === 'image' ? (
          <img
            src={currentMedia.file_url}
            alt={currentMedia.alt_text || currentMedia.file_name || 'Image'}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        ) : currentMedia.file_type === 'video' ? (
          <video
            src={currentMedia.file_url}
            controls
            className="max-w-full max-h-full rounded-lg"
            autoPlay
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <LucideImage className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300">{currentMedia.file_name || 'Unsupported file type'}</p>
          </div>
        )}
      </div>

      {/* Media counter */}
      {hasMultiple && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {media.length}
        </div>
      )}

      {/* Thumbnail navigation */}
      {hasMultiple && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
          {media.map((item, index) => (
            <button
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`w-16 h-16 rounded-lg border-2 transition-all ${
                index === currentIndex 
                  ? 'border-white opacity-100' 
                  : 'border-gray-400 opacity-60 hover:opacity-80'
              }`}
            >
              <img
                src={item.file_url}
                alt={item.alt_text || item.file_name || 'Thumbnail'}
                className="w-full h-full object-cover rounded-lg"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const MediaGrid = ({ 
  media, 
  onMediaClick 
}: { 
  media: ForumMedia[];
  onMediaClick: (index: number) => void;
}) => {
  if (media.length === 0) return null;

  // Sort media by sort_order and featured status
  const sortedMedia = [...media].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return (a.sort_order || 0) - (b.sort_order || 0);
  });

  const getGridLayout = (count: number) => {
    switch (count) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-2';
      case 4:
        return 'grid-cols-2';
      default:
        return 'grid-cols-2';
    }
  };

  const getMediaItemClass = (index: number, count: number) => {
    if (count === 3 && index === 2) {
      return 'col-span-2 row-span-1';
    }
    return 'col-span-1 row-span-1';
  };

  return (
    <div className={`grid ${getGridLayout(media.length)} gap-1 w-full`}>
      {sortedMedia.slice(0, 4).map((mediaItem, index) => (
        <div
          key={mediaItem.id}
          className={`relative ${getMediaItemClass(index, media.length)} cursor-pointer group aspect-video`}
          onClick={(e) => { e.stopPropagation(); onMediaClick(index); }}
        >
          {mediaItem.file_type === 'image' ? (
            <img
              src={mediaItem.file_url}
              alt={mediaItem.alt_text || mediaItem.file_name || 'Image'}
              className="w-full h-full object-cover rounded-lg border border-gray-200 group-hover:opacity-90 transition-opacity"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : mediaItem.file_type === 'video' ? (
            <div className="relative w-full h-full">
              <video
                src={mediaItem.file_url}
                className="w-full h-full object-cover rounded-lg border border-gray-200 group-hover:opacity-90 transition-opacity"
                preload="metadata"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all">
                <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <LucideImage className="h-8 w-8 text-gray-400" />
              <span className="text-xs text-gray-500 ml-2">
                {mediaItem.file_name || 'File'}
              </span>
            </div>
          )}
          
          {/* Fallback placeholder for failed images */}
          {mediaItem.file_type === 'image' && (
            <div className="hidden w-full h-full bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
              <LucideImage className="h-8 w-8 text-gray-400" />
              <span className="text-xs text-gray-500 ml-2">
                {mediaItem.file_name || 'Image'}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export function PublicPostCard({ post }: PublicPostCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryId = searchParams.get('category')
  const {mutate: toggleThreadLike} = useToggleThreadLike(categoryId || undefined)
  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  const handleMediaClick = (index: number) => {
    setModalInitialIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCardClick = () => {
    router.push(`/posts/${post.id}`);
  };

  return (
    <>
      <Card 
        className="hover:shadow-md transition-shadow border border-gray-200 cursor-pointer" 
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {/* Author Avatar */}
              <Avatar className="size-12">
                <AvatarImage src={post.organisation?.logo_url || '/landing/hfai-logo.png'} />
                <AvatarFallback className="bg-blue-100 text-primary">
                  {post.organisation.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                {/* Author Name and Organisation */}
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">{post.organisation.name || post.author.name}</h3>
                </div>
                
                {/* Timestamp */}
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            
            {/* Options Menu */}
            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <LucideMoreHorizontal className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Post Title */}
          {/* {post.title && (
            <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>
          )} */}
          
          {/* Post Content */}
          <div>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {truncateContent(post.content)}
            </p>
          </div>

          {/* Category Badge */}
          <div className="flex items-center space-x-2">
            <Badge 
              variant="secondary" 
              style={{ 
                backgroundColor: post.category.color_hex + '20',
                color: post.category.color_hex,
                borderColor: post.category.color_hex + '40'
              }}
            >
              {post.category.icon && (
                <span className="mr-1">{post.category.icon}</span>
              )}
              {post.language === 'English' ? post.category.name_en : post.language === 'French' ? post.category.name_fr : post.category.name_es}
            </Badge>
          </div>

          {/* Media Grid */}
          {post.media && post.media.length > 0 && (
            <div className="w-full">
              <MediaGrid media={post.media} onMediaClick={handleMediaClick} />
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Post Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div onClick={(e) => { e.stopPropagation(); toggleThreadLike(post.id); }} className="flex items-center space-x-2 hover:text-primary cursor-pointer transition-colors">
                <LucideHeart className={`h-4 w-4 ${post.user_has_liked ? 'fill-primary text-primary' : 'text-gray-500'}`} />
                <span>{post.like_count}</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-primary cursor-pointer transition-colors">
                <LucideMessageSquare className="h-4 w-4" />
                <span>{post.reply_count}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <LucideEye className="h-4 w-4" />
                <span>{post.view_count}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full-screen media modal */}
      {post.media && (
        <MediaModal
          media={post.media}
          isOpen={isModalOpen}
          onClose={closeModal}
          initialIndex={modalInitialIndex}
        />
      )}
    </>
  );
}
