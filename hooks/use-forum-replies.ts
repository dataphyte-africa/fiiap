import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export function useForumReplies(threadId: string) {
  return useQuery({
    queryKey: ['forum-replies', threadId],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .rpc('get_forum_thread_replies', {
          thread_id_param: threadId,
          limit_param: 50,
          offset_param: 0
        });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!threadId,
  });
}

export function useReplyChildren(parentReplyId: string) {
  return useQuery({
    queryKey: ['forum-reply-children', parentReplyId],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .rpc('get_forum_reply_children', {
          parent_reply_id_param: parentReplyId,
          limit_param: 50,
          offset_param: 0
        });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!parentReplyId,
  });
}
