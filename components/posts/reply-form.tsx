'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCreateReply } from '@/hooks/use-create-reply';
import { LucideSend, LucideMessageSquare } from 'lucide-react';

interface ReplyFormProps {
  threadId: string;
  parentReplyId?: string;
  onSuccess?: () => void;
  placeholder?: string;
}

export function ReplyForm({ threadId, parentReplyId, onSuccess, placeholder }: ReplyFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mutation = useCreateReply();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    mutation.mutate({
      content: content.trim(),
      threadId,
      parentReplyId
    });
  };

  // Handle mutation state changes
  useEffect(() => {
    if (mutation.isSuccess) {
      setContent('');
      setIsSubmitting(false);
      onSuccess?.();
    } else if (mutation.isError) {
      setIsSubmitting(false);
    }
  }, [mutation.isSuccess, mutation.isError, onSuccess]);

  const defaultPlaceholder = parentReplyId 
    ? 'Write your reply...' 
    : 'Write your reply to this thread...';

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <LucideMessageSquare className="h-5 w-5" />
          <span>{parentReplyId ? 'Reply to Comment' : 'Add Reply'}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start space-x-3">
            
            
            <div className="flex-1 space-y-3">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder || defaultPlaceholder}
                className="min-h-[100px] resize-none"
                disabled={isSubmitting}
              />
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {content.length}/1000 characters
                </div>
                
                <Button 
                  type="submit" 
                  disabled={!content.trim() || isSubmitting}
                  className="flex items-center space-x-2"
                >
                  <LucideSend className="h-4 w-4" />
                  <span>{isSubmitting ? 'Posting...' : 'Post Reply'}</span>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
