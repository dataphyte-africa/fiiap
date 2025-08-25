import { ForumCategoriesSidebar } from '@/components/posts/forum-categories-sidebar';
import { CreatePostButton } from '@/components/posts/create-post-button';
import { TextSlot } from '@/components/ui/text-slot';
import { createClient } from '@/lib/supabase/server';
import React from 'react';

export default async function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient()
   const {data: {user}} = await supabase.auth.getUser()
   
   const {data: profile} = await supabase.from('profiles').select('*').eq('id', user?.id || '').single()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar - Categories */}
      <div className="lg:col-span-1">
        <ForumCategoriesSidebar />
      </div>

      <div className="lg:col-span-3">
        <div className="flex justify-between items-center">
        <TextSlot containerClassName='gap-2 mb-4' title="Community Posts" subtitle="Stay updated with the latest news, events, and initiatives from CSOs across the region." />  
        {profile?.organisation_id && <CreatePostButton profile={profile} />}
        </div>
        {children}
      </div>
      </div>
      </div>
    </div>
  );
}
