import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

interface CreateReplyData {
  content: string;
  threadId: string;
  parentReplyId?: string;
}

export function useCreateReply() {
  const queryClient = useQueryClient();

  const createReply = async (replyData: CreateReplyData) => {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .rpc('create_forum_reply', {
        content_param: replyData.content,
        thread_id_param: replyData.threadId,
        parent_reply_id_param: replyData.parentReplyId
      });
    
    if (error) throw error;
    return data;
  };

  return useMutation({
    mutationFn: createReply,
    onSuccess: (data, variables) => {
      // Invalidate and refetch replies
      queryClient.invalidateQueries({ queryKey: ['forum-replies', variables.threadId] });
      if (variables.parentReplyId) {
        queryClient.invalidateQueries({ queryKey: ['forum-reply-children', variables.parentReplyId] });
      }
      
      // Also invalidate thread data to update reply count
      queryClient.invalidateQueries({ queryKey: ['forum-thread', variables.threadId] });
    },
  });
}
