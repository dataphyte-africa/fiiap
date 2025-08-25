'use client'
import { useParams } from 'next/navigation';
import { ForumThreadDetail } from '@/components/posts/forum-thread-detail';
import { ForumThreadDetailSkeleton } from '@/components/posts/forum-thread-detail-skeleton';
import { useForumThread } from '@/lib/data/posts';



export default  function ForumThreadPage() {
  const {id} = useParams()
  const {data: thread, isLoading} = useForumThread(id as string)
 if(isLoading) return <ForumThreadDetailSkeleton />
 if(!thread) return <div>Thread not found</div>
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ForumThreadDetail thread={thread} />
    
    </div>
  );
}
