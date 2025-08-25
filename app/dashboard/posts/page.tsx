import React from 'react'
import { PostsList } from '@/components/posts/posts-list'
import { CreatePostButton } from '@/components/posts/create-post-button'
import { PageHeader } from '@/components/posts/page-header'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Database } from '@/types/db'

export default async function PostsPage() {
   const supabase = await createClient()
   const {data: {user}} = await supabase.auth.getUser()
   console.log(user?.id, "🌹")
   if(!user) {
    redirect('/login')
   }
   const {data: profile} = await supabase.from('profiles').select('*').eq('id', user.id).single()
   console.log(profile, "🌹")
   
   if (!profile?.organisation_id) {
     redirect('/dashboard')
   }
   
  return (
    <div className="space-y-6">
      <PageHeader organisation_id={profile.organisation_id} />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Posts</h2>
        <CreatePostButton profile={profile as Database['public']['Tables']['profiles']['Row']} />
      </div>
      <PostsList profile={profile as Database['public']['Tables']['profiles']['Row']} />
    </div>
  )
}
