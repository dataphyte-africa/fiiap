'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Flag, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useModerateForumThread } from '@/hooks/use-admin-forum';
import type { Database } from '@/types/db';
import type { AdminForumThreadSingle } from '@/lib/data/admin-forum';

type ForumModerationStatus = Database['public']['Enums']['forum_moderation_status_enum'];

interface ForumModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  forumPost: AdminForumThreadSingle;
  action: ForumModerationStatus;
}

const ACTION_CONFIG = {
  approved: {
    title: 'Approve Forum Post',
    description: 'This forum post will be marked as approved and will be visible to users.',
    icon: CheckCircle,
    color: 'text-green-600',
    buttonText: 'Approve Post',
    buttonClass: 'bg-green-600 hover:bg-green-700',
    placeholder: 'Optional approval notes...'
  },
  flagged: {
    title: 'Flag Forum Post',
    description: 'This forum post will be flagged for review and may be hidden from public view.',
    icon: Flag,
    color: 'text-yellow-600',
    buttonText: 'Flag Post',
    buttonClass: 'bg-yellow-600 hover:bg-yellow-700',
    placeholder: 'Reason for flagging (required)...'
  },
  rejected: {
    title: 'Reject Forum Post',
    description: 'This forum post will be rejected and removed from public view.',
    icon: XCircle,
    color: 'text-red-600',
    buttonText: 'Reject Post',
    buttonClass: 'bg-red-600 hover:bg-red-700',
    placeholder: 'Reason for rejection (required)...'
  }
};

export function ForumModerationModal({
  isOpen,
  onClose,
  onSuccess,
  forumPost,
  action
}: ForumModerationModalProps) {
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const moderateThreadMutation = useModerateForumThread();

  const config = ACTION_CONFIG[action];
  const Icon = config.icon;
  const requiresNotes = action === 'flagged' || action === 'rejected';

  const handleSubmit = async () => {
    if (requiresNotes && !notes.trim()) {
      setError('Notes are required for this action');
      return;
    }

    setError(null);

    moderateThreadMutation.mutate(
      {
        threadId: forumPost.id,
        moderationStatus: action,
        adminNotes: notes.trim() || undefined
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            onSuccess();
            onClose();
            setNotes('');
          } else {
            setError(result.error || 'An unexpected error occurred');
          }
        },
        onError: (error) => {
          setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        }
      }
    );
  };

  const handleClose = () => {
    if (!moderateThreadMutation.isPending) {
      onClose();
      setNotes('');
      setError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Icon className={`h-5 w-5 ${config.color}`} />
            <span>{config.title}</span>
          </DialogTitle>
          <DialogDescription>
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Post Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-sm text-gray-900 mb-2">Post Preview</h4>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Title:</span> {forumPost.title}
              </div>
              <div className="text-sm">
                <span className="font-medium">Author:</span> {forumPost.author_name}
              </div>
              {forumPost.organisation_name && (
                <div className="text-sm">
                  <span className="font-medium">Organisation:</span> {forumPost.organisation_name}
                </div>
              )}
              <div className="text-sm">
                <span className="font-medium">Category:</span> {forumPost.category_name_en}
              </div>
              <div className="text-sm text-gray-600 line-clamp-3">
                {forumPost.content.substring(0, 200)}
                {forumPost.content.length > 200 && '...'}
              </div>
            </div>
          </div>

          {/* Current Moderation Status */}
          {forumPost.moderation_status && (
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-medium text-sm text-blue-900 mb-1">Current Status</h4>
              <div className="text-sm text-blue-800">
                Status: <span className="capitalize">{forumPost.moderation_status}</span>
              </div>
              {forumPost.moderated_by_name && (
                <div className="text-sm text-blue-700">
                  Moderated by: {forumPost.moderated_by_name}
                </div>
              )}
              {forumPost.moderation_notes && (
                <div className="text-sm text-blue-700 mt-1">
                  Previous notes: {forumPost.moderation_notes}
                </div>
              )}
            </div>
          )}

          {/* Notes Input */}
          <div className="space-y-2">
            <Label htmlFor="moderation-notes">
              Moderation Notes {requiresNotes && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id="moderation-notes"
              placeholder={config.placeholder}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              disabled={moderateThreadMutation.isPending}
            />
            {requiresNotes && (
              <p className="text-sm text-gray-600">
                Please provide a reason for this moderation action.
              </p>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={moderateThreadMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={moderateThreadMutation.isPending || (requiresNotes && !notes.trim())}
            className={config.buttonClass}
          >
            {moderateThreadMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {config.buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
