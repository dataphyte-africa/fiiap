'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  ExternalLink,
  Flag,
  CheckCircle,
  XCircle,
  Heart,
  MessageSquare,
  Eye,
 
  Tag,
  Image as ImageIcon,
  AlertTriangle
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useAdminForumThread, useAdminForumThreadReplies } from '@/hooks/use-admin-forum';
import { ForumModerationModal } from './forum-moderation-modal';
import { AdminForumReplyCard } from './admin-forum-reply-card';
import type { Database } from '@/types/db';

type ForumModerationStatus = Database['public']['Enums']['forum_moderation_status_enum'];

interface AdminForumPostDetailProps {
  postId: string;
}

const MODERATION_STATUS_CONFIG = {
  approved: {
    label: 'Approved',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-600'
  },
  flagged: {
    label: 'Flagged',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Flag,
    iconColor: 'text-yellow-600'
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    iconColor: 'text-red-600'
  }
};

export function AdminForumPostDetail({ postId }: AdminForumPostDetailProps) {
  const router = useRouter();
  const [moderationModal, setModerationModal] = useState<{
    isOpen: boolean;
    action: ForumModerationStatus | null;
  }>({
    isOpen: false,
    action: null
  });

  // Fetch post data
  const { data: post, isLoading: postLoading, error: postError, refetch: refetchPost } = useAdminForumThread(postId);
  
  // Fetch replies data
  const { data: repliesData, isLoading: repliesLoading, refetch: refetchReplies } = useAdminForumThreadReplies(postId, 1, 50);

  const handleModerationAction = (action: ForumModerationStatus) => {
    setModerationModal({
      isOpen: true,
      action
    });
  };

  const closeModerationModal = () => {
    setModerationModal({
      isOpen: false,
      action: null
    });
  };

  const handleSuccess = () => {
    refetchPost();
    refetchReplies();
  };

  const handleViewOriginal = () => {
    window.open(`/posts/${postId}`, '_blank');
  };

  if (postLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Post Not Found</h3>
            <p className="text-gray-600 mb-4">
              {postError?.message || 'The forum post you are looking for could not be found.'}
            </p>
            <Button onClick={() => router.push('/admin/posts')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const moderationStatus = post.moderation_status;
  const statusConfig = moderationStatus ? MODERATION_STATUS_CONFIG[moderationStatus] : null;

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push('/admin/posts')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Forum Posts</span>
            </Button>

            <div className="flex items-center space-x-2">
              {/* View Original Post */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewOriginal}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Original
              </Button>

              {/* Moderation Actions */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleModerationAction('approved')}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleModerationAction('flagged')}
                className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
              >
                <Flag className="h-4 w-4 mr-2" />
                Flag
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleModerationAction('rejected')}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Post Detail */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={post.organisation_logo_url || '/landing/hfai-logo.png'} />
                <AvatarFallback className="bg-blue-100 text-primary text-lg">
                  {(post.organisation_name || post.author_name).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {post.organisation_name || post.author_name}
                </h3>
                {post.organisation_name && (
                  <p className="text-sm text-gray-600">by {post.author_name}</p>
                )}
                <p className="text-sm text-gray-500">
                  {format(new Date(post.created_at), 'PPP')} • {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>

            {statusConfig && (
              <Badge className={`border ${statusConfig.color}`}>
                <statusConfig.icon className="h-3 w-3 mr-1" />
                {statusConfig.label}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Post Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h1>
          </div>

          {/* Post Content */}
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          </div>

          {/* Media */}
          {post.media && Array.isArray(post.media) && post.media.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <ImageIcon className="h-4 w-4 mr-2" />
                Attached Media ({post.media.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {post.media.map((media: any, index: number) => (
                  <div key={index} className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden">
                    {media.file_type === 'image' ? (
                      <img
                        src={media.file_url}
                        alt={media.alt_text || `Media ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Post Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm">
              <Heart className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{post.like_count}</span>
              <span className="text-gray-600">likes</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <MessageSquare className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{post.reply_count}</span>
              <span className="text-gray-600">replies</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Eye className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{post.view_count}</span>
              <span className="text-gray-600">views</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{post.language}</span>
            </div>
          </div>

          {/* Category and Tags */}
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Category</h4>
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
            </div>

            {post.tags && post.tags.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Moderation History */}
          {post.moderated_at && post.moderated_by_name && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Moderation History</h4>
              <div className="text-sm text-blue-800">
                <p>Moderated by {post.moderated_by_name} on {format(new Date(post.moderated_at), 'PPP')}</p>
                {post.moderation_notes && (
                  <p className="mt-1">
                    <span className="font-medium">Notes:</span> {post.moderation_notes}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Replies Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Replies ({post.reply_count})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {repliesLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse border-l-2 border-gray-200 pl-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : repliesData?.replies.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No replies yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {repliesData?.replies.map((reply) => (
                <AdminForumReplyCard
                  key={reply.id}
                  reply={reply}
                  onSuccess={handleSuccess}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Moderation Modal */}
      {moderationModal.isOpen && moderationModal.action && (
        <ForumModerationModal
          isOpen={moderationModal.isOpen}
          onClose={closeModerationModal}
          onSuccess={handleSuccess}
          forumPost={post}
          action={moderationModal.action}
        />
      )}
    </div>
  );
}
