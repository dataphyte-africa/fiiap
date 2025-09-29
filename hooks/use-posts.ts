/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  reply_count: number;
  category_id: string;
  tags: string[] | null;
  author: {
    name: string;
    avatar_url?: string;
  };
  media: Array<{
    id: string;
    file_url: string;
    file_name: string | null;
    file_type: string | null;
    mime_type: string | null;
    storage_path: string | null;
    file_size: number | null;
  }>;
}

interface CreatePostData {
  content: string;
  hashtags: string[];
  categoryId: string;
  media?: File[];
}

interface EditPostData {
  postId: string;
  content: string;
  hashtags: string[];
  categoryId: string;
  media?: File[];
}

export function usePosts(organisationId: string | undefined) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const {
    data: posts = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['posts', organisationId],
    queryFn: async (): Promise<Post[]> => {
      if (!organisationId) return [];

      // Fetch posts for the organisation
      const { data: threads, error: threadsError } = await supabase
        .from('forum_threads')
        .select(`
          id,
          title,
          content,
          created_at,
          updated_at,
          view_count,
          reply_count,
          category_id,
          tags,
          author_id,
          author:organisation_id(id, name, logo_url)
        `)
        .eq('organisation_id', organisationId)
        .order('created_at', { ascending: false });

      if (threadsError) throw threadsError;

      // Transform the data to match our Post interface
      const transformedPosts = await Promise.all(
        threads.map(async (thread) => {
          // Fetch media for this post
          const { data: media } = await supabase
            .from('forum_media')
            .select('id, file_url, file_name, file_type, mime_type,file_size, storage_path')
            .eq('thread_id', thread.id);


            console.log(media, "media 🌹")

          return {
            id: thread.id,
            title: thread.title,
            content: thread.content,
            category_id: thread.category_id || '',
            created_at: thread.created_at || new Date().toISOString(),
            updated_at: thread.updated_at || new Date().toISOString(),
            view_count: thread.view_count || 0,
            reply_count: thread.reply_count || 0,
            tags: thread.tags,
            author: {
              name: thread.author?.name || 'Unknown User',
              avatar_url: thread.author?.logo_url || ''
            },
            media: media || []
          };
        })
      );

      return transformedPosts;
    },
    enabled: !!organisationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: CreatePostData) => {
      // This is a placeholder - the actual implementation will be in the component
      // where we have access to the storage client and file upload logic
      return Promise.resolve();
    },
    onSuccess: () => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: ['posts', organisationId] });
    },
  });

  const editPostMutation = useMutation({
    mutationFn: async (postData: EditPostData) => {
      // This is a placeholder - the actual implementation will be in the component
      // where we have access to the storage client and file upload logic
      return Promise.resolve();
    },
    onSuccess: () => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: ['posts', organisationId] });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('forum_threads')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      return postId;
    },
    onSuccess: () => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: ['posts', organisationId] });
    },
  });

  return {
    posts,
    isLoading,
    error,
    refetch,
    createPost: createPostMutation.mutate,
    editPost: editPostMutation.mutate,
    deletePost: deletePostMutation.mutate,
    isCreating: createPostMutation.isPending,
    isEditing: editPostMutation.isPending,
    isDeleting: deletePostMutation.isPending,
  };
}
