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
import { Alert } from '@/components/ui/alert';
import { Loader2, Flag, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { moderateBlogPost } from '@/lib/data/admin-blogs';
import type { Database } from '@/types/db';
import type { AdminBlogPost } from '@/lib/data/admin-blogs';
import { useTranslations } from 'next-intl';

type BlogModerationStatus = Database['public']['Enums']['blog_moderation_status_enum'];

interface BlogModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  blogPost: AdminBlogPost;
  action: BlogModerationStatus;
}

const getActionConfig = (t: (key: string) => string) => ({
  approved: {
    title: t('admin.modals.moderation.title'),
    description: t('admin.modals.moderation.confirmApproval'),
    icon: CheckCircle,
    color: 'text-green-600',
    buttonText: t('admin.modals.moderation.approve'),
    buttonClass: 'bg-green-600 hover:bg-green-700',
    placeholder: t('admin.modals.moderation.reasonPlaceholder')
  },
  flagged: {
    title: t('admin.modals.moderation.title'),
    description: t('admin.modals.moderation.confirmFlagging'),
    icon: Flag,
    color: 'text-yellow-600',
    buttonText: t('admin.modals.moderation.flag'),
    buttonClass: 'bg-yellow-600 hover:bg-yellow-700',
    placeholder: t('admin.modals.moderation.reasonPlaceholder')
  },
  rejected: {
    title: t('admin.modals.moderation.title'),
    description: t('admin.modals.moderation.confirmRejection'),
    icon: XCircle,
    color: 'text-red-600',
    buttonText: t('admin.modals.moderation.reject'),
    buttonClass: 'bg-red-600 hover:bg-red-700',
    placeholder: t('admin.modals.moderation.reasonPlaceholder')
  }
});

export function BlogModerationModal({
  isOpen,
  onClose,
  onSuccess,
  blogPost,
  action
}: BlogModerationModalProps) {
  const t = useTranslations();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = getActionConfig(t)[action];
  const Icon = config.icon;
  const requiresNotes = action === 'flagged' || action === 'rejected';

  const handleSubmit = async () => {
    if (requiresNotes && !notes.trim()) {
      setError(t('admin.forms.validation.required'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await moderateBlogPost(
        blogPost.id,
        action,
        notes.trim() || undefined
      );

      if (result.success) {
        onSuccess();
        onClose();
        setNotes('');
      } else {
        setError(result.error || t('admin.errors.serverError'));
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : t('admin.errors.serverError'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setNotes('');
      setError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${config.color}`} />
            {config.title}
          </DialogTitle>
          <DialogDescription>
            {config.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Blog Post Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">{t('admin.common.title')}</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">{t('admin.common.title')}:</span> {blogPost.title}
              </div>
              <div>
                <span className="font-medium">{t('admin.common.author')}:</span> {blogPost.profiles?.name || t('admin.common.unknown')}
              </div>
              <div>
                <span className="font-medium">{t('admin.common.organisation')}:</span> {blogPost.organisations?.name || t('admin.common.unknown')}
              </div>
              <div>
                <span className="font-medium">{t('admin.common.status')}:</span>{' '}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  blogPost.status === 'published' ? 'bg-green-100 text-green-800' :
                  blogPost.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                  blogPost.status === 'flagged' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {blogPost.status}
                </span>
              </div>
              {blogPost.moderation_status && (
                <div>
                  <span className="font-medium">{t('admin.common.moderation')}:</span>{' '}
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    blogPost.moderation_status === 'approved' ? 'bg-green-100 text-green-800' :
                    blogPost.moderation_status === 'flagged' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {blogPost.moderation_status}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Notes Input */}
          <div className="space-y-2">
            <Label htmlFor="notes">
              {requiresNotes ? `${t('admin.modals.moderation.reason')} (${t('admin.forms.required')})` : `${t('admin.modals.moderation.reason')} (${t('admin.forms.optional')})`}
            </Label>
            <Textarea
              id="notes"
              placeholder={config.placeholder}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={loading}
              rows={4}
              className={requiresNotes && !notes.trim() ? 'border-red-300' : ''}
            />
            {requiresNotes && !notes.trim() && (
              <p className="text-sm text-red-600">
                {t('admin.forms.validation.required')}
              </p>
            )}
          </div>

          {/* Current Moderation Info */}
          {blogPost.moderation_status && blogPost.moderated_by_profile && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">{t('admin.common.previousModeration')}</span>
              </div>
              <div className="text-sm text-blue-800">
                <p>
                  {t('admin.common.status')}: <span className="font-medium">{blogPost.moderation_status}</span>
                </p>
                <p>
                  {t('admin.common.moderatedBy')}: <span className="font-medium">{blogPost.moderated_by_profile.name}</span>
                </p>
                {blogPost.moderated_at && (
                  <p>
                    {t('admin.common.date')}: <span className="font-medium">
                      {new Date(blogPost.moderated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </p>
                )}
                {blogPost.moderation_notes && (
                  <p className="mt-1">
                    <span className="font-medium">{t('admin.modals.moderation.reason')}:</span> {blogPost.moderation_notes}
                  </p>
                )}
              </div>
            </div>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="w-4 h-4 text-red-600" />
              <div className="text-red-800">
                <p className="font-medium">{t('admin.errors.serverError')}</p>
                <p className="text-sm">{error}</p>
              </div>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={loading}
          >
            {t('admin.common.cancel')}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading || (requiresNotes && !notes.trim())}
            className={config.buttonClass}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('admin.common.processing')}
              </>
            ) : (
              <>
                <Icon className="w-4 h-4 mr-2" />
                {config.buttonText}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
