import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { 
  getAdminForumThreads, 
  getAdminForumThread, 
  getAdminForumThreadReplies,
  moderateForumThread,
  moderateForumReply,
  getForumCategories,
  type AdminForumFilters,
  type AdminForumThread,
  type AdminForumReply
} from '@/lib/data/admin-forum';
import type { Database } from '@/types/db';

type ForumModerationStatus = Database['public']['Enums']['forum_moderation_status_enum'];

// Hook for fetching admin forum threads
export function useAdminForumThreads(filters: AdminForumFilters = {}) {
  return useQuery({
    queryKey: ['admin-forum-threads', filters],
    queryFn: () => getAdminForumThreads(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Hook for fetching a single admin forum thread
export function useAdminForumThread(threadId: string) {
  return useQuery({
    queryKey: ['admin-forum-thread', threadId],
    queryFn: () => getAdminForumThread(threadId),
    enabled: !!threadId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for fetching admin forum thread replies
export function useAdminForumThreadReplies(threadId: string, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['admin-forum-replies', threadId, page, limit],
    queryFn: () => getAdminForumThreadReplies(threadId, page, limit),
    enabled: !!threadId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook for forum categories
export function useForumCategories() {
  return useQuery({
    queryKey: ['forum-categories'],
    queryFn: getForumCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for moderating forum threads
export function useModerateForumThread() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      threadId, 
      moderationStatus, 
      adminNotes 
    }: { 
      threadId: string; 
      moderationStatus: ForumModerationStatus; 
      adminNotes?: string; 
    }) => moderateForumThread(threadId, moderationStatus, adminNotes),
    onSuccess: (data, variables) => {
      if (data.success) {
        // Invalidate and refetch forum threads list
        queryClient.invalidateQueries({ queryKey: ['admin-forum-threads'] });
        
        // Invalidate specific thread
        queryClient.invalidateQueries({ queryKey: ['admin-forum-thread', variables.threadId] });
      }
    },
  });
}

// Hook for moderating forum replies
export function useModerateForumReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      replyId, 
      moderationStatus, 
      adminNotes 
    }: { 
      replyId: string; 
      moderationStatus: ForumModerationStatus; 
      adminNotes?: string; 
    }) => moderateForumReply(replyId, moderationStatus, adminNotes),
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate forum replies
        queryClient.invalidateQueries({ queryKey: ['admin-forum-replies'] });
      }
    },
  });
}

// Hook for searching threads with debounced search
export function useSearchAdminForumThreads(
  searchTerm: string,
  filters: Omit<AdminForumFilters, 'search'> = {},
  debounceMs: number = 300
) {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  return useQuery({
    queryKey: ['admin-forum-threads-search', debouncedSearchTerm, filters],
    queryFn: () => getAdminForumThreads({ ...filters, search: debouncedSearchTerm }),
    enabled: debouncedSearchTerm.length >= 2, // Only search if at least 2 characters
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Re-export types for convenience
export type { AdminForumThread, AdminForumReply, AdminForumFilters };
