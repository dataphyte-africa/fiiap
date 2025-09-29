import React from 'react'
import { PostsList } from '@/components/posts/posts-list'
import { CreatePostButton } from '@/components/posts/create-post-button'
import { PageHeader } from '@/components/posts/page-header'
import { redirect } from 'next/navigation'
import { Database } from '@/types/db'
import { getServerUser } from '@/lib/data/server-user'
import { getTranslations } from 'next-intl/server'

export default async function PostsPage() {
  const t = await getTranslations('dashboard.posts')
  const user = await getServerUser()
   
  if (!user?.profile?.organisation_id) {
    redirect('/dashboard')
  }
   
  return (
    <div className="space-y-6">
      <PageHeader organisation_id={user.profile.organisation_id} />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">{t('posts')}</h2>
        <CreatePostButton profile={user.profile as Database['public']['Tables']['profiles']['Row']} />
      </div>
      <PostsList profile={user.profile as Database['public']['Tables']['profiles']['Row']} />
    </div>
  )
}
