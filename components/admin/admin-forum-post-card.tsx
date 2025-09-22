'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  LucideMessageSquare, 
  LucideEye, 
  LucideHeart, 
  LucideImage,
  LucideMoreHorizontal,
  LucideFlag,
  LucideCheckCircle,
  LucideXCircle,
  LucideExternalLink
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import type { AdminForumThread } from '@/lib/data/admin-forum';
import type { Database } from '@/types/db';

type ForumModerationStatus = Database['public']['Enums']['forum_moderation_status_enum'];

interface AdminForumPostCardProps {
  post: AdminForumThread;
  onModerate: (post: AdminForumThread, action: ForumModerationStatus) => void;
}

const MODERATION_STATUS_CONFIG = {
  approved: {
    label: 'Approved',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: LucideCheckCircle
  },
  flagged: {
    label: 'Flagged',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: LucideFlag
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: LucideXCircle
  }
};

export function AdminForumPostCard({ post, onModerate }: AdminForumPostCardProps) {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  const handleCardClick = () => {
    router.push(`/admin/posts/${post.id}`);
  };

  const handleModerationAction = (e: React.MouseEvent, action: ForumModerationStatus) => {
    e.stopPropagation();
    onModerate(post, action);
  };

  const handleViewPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/posts/${post.id}`);
  };

  const moderationStatus = post.moderation_status;
  const statusConfig = moderationStatus ? MODERATION_STATUS_CONFIG[moderationStatus] : null;

  return (
    <Card 
      className="hover:shadow-md transition-all duration-200 border border-gray-200 cursor-pointer relative group" 
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {/* Organisation/Author Avatar */}
            <Avatar className="size-12">
              <AvatarImage src={post.organisation_logo_url || '/landing/hfai-logo.png'} />
              <AvatarFallback className="bg-blue-100 text-primary">
                {(post.organisation_name || post.author_name).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              {/* Organisation/Author Name */}
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 truncate">
                  {post.organisation_name || post.author_name}
                </h3>
                {post.organisation_name && (
                  <span className="text-sm text-gray-500">• {post.author_name}</span>
                )}
              </div>
              
              {/* Timestamp */}
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            {/* View Original Post */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewPost}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <LucideExternalLink className="h-4 w-4" />
            </Button>

            {/* Moderation Actions Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(!showActions);
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <LucideMoreHorizontal className="h-5 w-5 text-gray-500" />
              </Button>

              {/* Actions Menu */}
              {showActions && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                  <div className="py-1">
                    <button
                      onClick={(e) => handleModerationAction(e, 'approved')}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <LucideCheckCircle className="h-4 w-4 text-green-600" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={(e) => handleModerationAction(e, 'flagged')}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <LucideFlag className="h-4 w-4 text-yellow-600" />
                      <span>Flag</span>
                    </button>
                    <button
                      onClick={(e) => handleModerationAction(e, 'rejected')}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <LucideXCircle className="h-4 w-4 text-red-600" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Post Title */}
        <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {post.title}
        </h2>
        
        {/* Post Content */}
        <div>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed line-clamp-3">
            {truncateContent(post.content)}
          </p>
        </div>

        {/* Category and Status Badges */}
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          {/* Category Badge */}
          <Badge 
            variant="secondary" 
            style={{ 
              backgroundColor: post.category_color_hex + '20',
              color: post.category_color_hex,
              borderColor: post.category_color_hex + '40'
            }}
          >
            {post.category_icon && (
              <span className="mr-1">{post.category_icon}</span>
            )}
            {post.language === 'English' ? post.category_name_en : 
             post.language === 'French' ? post.category_name_fr : 
             post.category_name_es}
          </Badge>

          {/* Language Badge */}
          <Badge variant="outline" className="text-xs">
            {post.language}
          </Badge>

          {/* Moderation Status */}
          {statusConfig && (
            <Badge className={`text-xs border ${statusConfig.color}`}>
              <statusConfig.icon className="h-3 w-3 mr-1" />
              {statusConfig.label}
            </Badge>
          )}

          {/* Media Indicator */}
          {post.media && Array.isArray(post.media) && post.media.length > 0 && (
            <Badge variant="outline" className="text-xs">
              <LucideImage className="h-3 w-3 mr-1" />
              {post.media.length} media
            </Badge>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Moderation Info */}
        {post.moderated_at && post.moderated_by_name && (
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            Moderated by {post.moderated_by_name} • {formatDistanceToNow(new Date(post.moderated_at), { addSuffix: true })}
            {post.moderation_notes && (
              <div className="mt-1 text-gray-600">
                Note: {post.moderation_notes}
              </div>
            )}
          </div>
        )}

        {/* Post Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <LucideHeart className="h-4 w-4" />
              <span>{post.like_count}</span>
            </div>
            <div className="flex items-center space-x-2">
              <LucideMessageSquare className="h-4 w-4" />
              <span>{post.reply_count}</span>
            </div>
            <div className="flex items-center space-x-2">
              <LucideEye className="h-4 w-4" />
              <span>{post.view_count}</span>
            </div>
          </div>
          
          {/* Author Info */}
          <div className="text-xs text-gray-500">
            ID: {post.id.substring(0, 8)}...
          </div>
        </div>
      </CardContent>

      {/* Click outside to close actions */}
      {showActions && (
        <div 
          className="fixed inset-0 z-[5]" 
          onClick={(e) => {
            e.stopPropagation();
            setShowActions(false);
          }}
        />
      )}
    </Card>
  );
}
