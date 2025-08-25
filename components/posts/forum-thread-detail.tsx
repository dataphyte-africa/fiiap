'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  LucideArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ForumThread } from '@/lib/data/posts';
import { incrementThreadView } from '@/lib/data/posts';
import { ForumReplies } from './forum-replies';
import { ReplyForm } from './reply-form';
import { PublicPostCard } from './public-post-card';



interface ForumThreadDetailProps {
  thread: ForumThread;
}

export function ForumThreadDetail({ thread }: ForumThreadDetailProps) {
  const router = useRouter();

  // Increment view count when component mounts
  useEffect(() => {
    incrementThreadView(thread.id);
  }, [thread.id]);

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={handleBackClick}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <LucideArrowLeft className="h-4 w-4" />
        <span>Back to Posts</span>
      </Button>

      <PublicPostCard
        post={{
          ...thread,
          author: {
            id: thread.author_id,
            name: thread.author_name,
            avatar_url: thread.author_avatar_url || undefined,
          },
          organisation: {
            id: thread.organisation_id || '',
            name: thread.organisation_name || 'Unknown Organisation',
            logo_url: thread.organisation_logo_url || undefined,
          },
          category: {
            id: thread.category_id,
            name_en: thread.category_name_en,
            name_fr: thread.category_name_fr,
            name_es: thread.category_name_es,
            color_hex: thread.category_color_hex,
            icon: thread.category_icon,
          },
        }}
      /> 
      <ForumReplies threadId={thread.id} />

      {/* Reply form */}
      <ReplyForm threadId={thread.id} />

      {/* Replies */}
    </div>
  );
}
