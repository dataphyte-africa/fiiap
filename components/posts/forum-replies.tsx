'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  LucideMessageSquare, 
  LucideHeart, 
  LucideChevronDown, 
  LucideChevronRight,
  LucideCheckCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useForumReplies, useReplyChildren } from '@/hooks/use-forum-replies';

interface ForumReply {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  parent_reply_id: string | null;
  thread_id: string;
  author_id: string;
  author_name: string;
  author_avatar_url: string | null;
  is_solution: boolean;
  user_has_liked: boolean;
  child_replies_count?: number; // Optional for child replies
}

interface ForumRepliesProps {
  threadId: string;
}



// Individual reply component
function ReplyItem({ reply, threadId }: { reply: ForumReply; threadId: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = (reply.child_replies_count || 0) > 0;
  
  const { data: children, isLoading: childrenLoading } = useReplyChildren(reply.id);

  return (
    <div className="space-y-3">
      <Card className="">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="size-10">
              <AvatarImage src={reply.author_avatar_url || undefined} />
              <AvatarFallback className="bg-blue-100 text-primary text-sm">
                {reply?.author_name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900">{reply.author_name}</span>
                  {reply.is_solution && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                      <LucideCheckCircle className="h-3 w-3 mr-1" />
                      Solution
                    </Badge>
                  )}
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-2 hover:text-primary cursor-pointer transition-colors">
                    <LucideHeart className={`h-4 w-4 ${reply.user_has_liked ? 'fill-primary text-primary' : ''}`} />
                    <span>{reply.like_count}</span>
                  </div>
                  
                  {hasChildren && (
                    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-auto p-1">
                          <LucideMessageSquare className="h-4 w-4 mr-1" />
                          <span>{reply.child_replies_count}</span>
                          {isExpanded ? (
                            <LucideChevronDown className="h-4 w-4 ml-1" />
                          ) : (
                            <LucideChevronRight className="h-4 w-4 ml-1" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </Collapsible>
                  )}
                </div>
              </div>
              
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {reply.content}
              </div>
              
              {/* <div className="flex items-center space-x-2 mt-3">
                <Button variant="ghost" size="sm" className="h-auto p-2 text-gray-500 hover:text-primary">
                  <LucideReply className="h-4 w-4 mr-1" />
                  Reply
                </Button>
              </div> */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nested replies */}
      {hasChildren && (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent>
            <div className="ml-8 space-y-3 border-l-2 border-gray-200 pl-4">
              {childrenLoading ? (
                <div className="text-sm text-gray-500">Loading replies...</div>
              ) : children && children.length > 0 ? (
                children.map((childReply) => (
                  <ReplyItem key={childReply.id} reply={childReply} threadId={threadId} />
                ))
              ) : (
                <div className="text-sm text-gray-500">No replies yet</div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

export function ForumReplies({ threadId }: ForumRepliesProps) {
  const { data: replies, isLoading, error } = useForumReplies(threadId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center text-gray-500">Loading replies...</div>
      </div>
    );
  }

  if (error) {
    console.error(error, "error 🌹")
    return (
      <div className="space-y-4">
        <div className="text-center text-red-500">Error loading replies. Please try again.</div>
      </div>
    );
  }

  if (!replies || replies.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center text-gray-500 py-8">
          <LucideMessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-lg font-medium text-gray-900 mb-2">No replies yet</p>
          <p className="text-gray-500">Be the first to reply to this thread!</p>
        </div>
      </div>
    );
  }

  // Filter top-level replies (those without parent_reply_id)
  const topLevelReplies = replies.filter(reply => !reply.parent_reply_id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Replies ({replies.length})
        </h3>
      </div>
      
      <div className="space-y-4">
        {topLevelReplies.map((reply) => (
          <ReplyItem key={reply.id} reply={reply} threadId={threadId} />
        ))}
      </div>
    </div>
  );
}
