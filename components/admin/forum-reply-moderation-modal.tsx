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
import { useModerateForumReply } from '@/hooks/use-admin-forum';
import type { Database } from '@/types/db';
import type { AdminForumReply } from '@/lib/data/admin-forum';

type ForumModerationStatus = Database['public']['Enums']['forum_moderation_status_enum'];

interface ForumReplyModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  reply: AdminForumReply;
  action: ForumModerationStatus;
}

const ACTION_CONFIG = {
  approved: {
    title: 'Approve Reply',
    description: 'This reply will be marked as approved and will be visible to users.',
    icon: CheckCircle,
    color: 'text-green-600',
    buttonText: 'Approve Reply',
    buttonClass: 'bg-green-600 hover:bg-green-700',
    placeholder: 'Optional approval notes...'
  },
  flagged: {
    title: 'Flag Reply',
    description: 'This reply will be flagged for review and may be hidden from public view.',
    icon: Flag,
    color: 'text-yellow-600',
    buttonText: 'Flag Reply',
    buttonClass: 'bg-yellow-600 hover:bg-yellow-700',
    placeholder: 'Reason for flagging (required)...'
  },
  rejected: {
    title: 'Reject Reply',
    description: 'This reply will be rejected and removed from public view.',
    icon: XCircle,
    color: 'text-red-600',
    buttonText: 'Reject Reply',
    buttonClass: 'bg-red-600 hover:bg-red-700',
    placeholder: 'Reason for rejection (required)...'
  }
};

export function ForumReplyModerationModal({
  isOpen,
  onClose,
  onSuccess,
  reply,
  action
}: ForumReplyModerationModalProps) {
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const moderateReplyMutation = useModerateForumReply();

  const config = ACTION_CONFIG[action];
  const Icon = config.icon;
  const requiresNotes = action === 'flagged' || action === 'rejected';

  const handleSubmit = async () => {
    if (requiresNotes && !notes.trim()) {
      setError('Notes are required for this action');
      return;
    }

    setError(null);

    moderateReplyMutation.mutate(
      {
        replyId: reply.id,
        moderationStatus: action,
        adminNotes: notes.trim() || undefined
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            onSuccess();
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
    if (!moderateReplyMutation.isPending) {
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
          {/* Reply Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-sm text-gray-900 mb-2">Reply Preview</h4>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Author:</span> {reply.author_name}
              </div>
              <div className="text-sm">
                <span className="font-medium">Created:</span> {new Date(reply.created_at).toLocaleDateString()}
              </div>
              {reply.is_solution && (
                <div className="text-sm text-green-700">
                  <span className="font-medium">✓ Marked as Solution</span>
                </div>
              )}
              <div className="text-sm text-gray-600 line-clamp-4 bg-white p-2 rounded border">
                {reply.content}
              </div>
            </div>
          </div>

          {/* Current Moderation Status */}
          {reply.moderation_status && (
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-medium text-sm text-blue-900 mb-1">Current Status</h4>
              <div className="text-sm text-blue-800">
                Status: <span className="capitalize">{reply.moderation_status}</span>
              </div>
              {reply.moderated_by_name && (
                <div className="text-sm text-blue-700">
                  Moderated by: {reply.moderated_by_name}
                </div>
              )}
              {reply.moderation_notes && (
                <div className="text-sm text-blue-700 mt-1">
                  Previous notes: {reply.moderation_notes}
                </div>
              )}
            </div>
          )}

          {/* Reply Stats */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-sm text-gray-900 mb-2">Reply Stats</h4>
            <div className="flex space-x-4 text-sm text-gray-600">
              <span>❤️ {reply.like_count} likes</span>
              {reply.child_replies_count > 0 && (
                <span>💬 {reply.child_replies_count} replies</span>
              )}
            </div>
          </div>

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
              rows={3}
              disabled={moderateReplyMutation.isPending}
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
            disabled={moderateReplyMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={moderateReplyMutation.isPending || (requiresNotes && !notes.trim())}
            className={config.buttonClass}
          >
            {moderateReplyMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {config.buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
