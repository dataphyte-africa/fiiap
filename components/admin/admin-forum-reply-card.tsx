'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Flag,
  CheckCircle,
  XCircle,
  Heart,
  MoreHorizontal,
  Shield,
  CheckCircle2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ForumReplyModerationModal } from './forum-reply-moderation-modal';
import type { AdminForumReply } from '@/lib/data/admin-forum';
import type { Database } from '@/types/db';

type ForumModerationStatus = Database['public']['Enums']['forum_moderation_status_enum'];

interface AdminForumReplyCardProps {
  reply: AdminForumReply;
  onSuccess: () => void;
  level?: number;
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

export function AdminForumReplyCard({ reply, onSuccess, level = 0 }: AdminForumReplyCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [moderationModal, setModerationModal] = useState<{
    isOpen: boolean;
    action: ForumModerationStatus | null;
  }>({
    isOpen: false,
    action: null
  });

  const handleModerationAction = (e: React.MouseEvent, action: ForumModerationStatus) => {
    e.stopPropagation();
    setModerationModal({
      isOpen: true,
      action
    });
    setShowActions(false);
  };

  const closeModerationModal = () => {
    setModerationModal({
      isOpen: false,
      action: null
    });
  };

  const moderationStatus = reply.moderation_status;
  const statusConfig = moderationStatus ? MODERATION_STATUS_CONFIG[moderationStatus] : null;

  return (
    <>
      <div className={`${level > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
        <Card className="relative group">
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Reply Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={reply.author_avatar_url || '/landing/hfai-logo.png'} />
                    <AvatarFallback className="bg-blue-100 text-primary">
                      {reply.author_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{reply.author_name}</h4>
                      {reply.is_solution && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Solution
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {/* Actions Dropdown */}
                <div className="flex items-center space-x-2">
                  {statusConfig && (
                    <Badge className={`text-xs border ${statusConfig.color}`}>
                      <statusConfig.icon className="h-3 w-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  )}

                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActions(!showActions);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </Button>

                    {showActions && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                        <div className="py-1">
                          <button
                            onClick={(e) => handleModerationAction(e, 'approved')}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={(e) => handleModerationAction(e, 'flagged')}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <Flag className="h-4 w-4 text-yellow-600" />
                            <span>Flag</span>
                          </button>
                          <button
                            onClick={(e) => handleModerationAction(e, 'rejected')}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reply Content */}
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {reply.content}
              </div>

              {/* Reply Stats */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{reply.like_count}</span>
                  </div>
                  
                  {reply.child_replies_count > 0 && (
                    <div className="text-xs text-gray-500">
                      {reply.child_replies_count} {reply.child_replies_count === 1 ? 'reply' : 'replies'}
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  ID: {reply.id.substring(0, 8)}...
                </div>
              </div>

              {/* Moderation Info */}
              {reply.moderated_at && reply.moderated_by_name && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3" />
                    <span>Moderated by {reply.moderated_by_name} • {formatDistanceToNow(new Date(reply.moderated_at), { addSuffix: true })}</span>
                  </div>
                  {reply.moderation_notes && (
                    <div className="mt-1 text-gray-600">
                      Note: {reply.moderation_notes}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
      </div>

      {/* Moderation Modal */}
      {moderationModal.isOpen && moderationModal.action && (
        <ForumReplyModerationModal
          isOpen={moderationModal.isOpen}
          onClose={closeModerationModal}
          onSuccess={() => {
            onSuccess();
            closeModerationModal();
          }}
          reply={reply}
          action={moderationModal.action}
        />
      )}
    </>
  );
}
