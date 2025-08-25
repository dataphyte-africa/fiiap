import { ProjectsList } from '@/components/projects';
import { ServerDataFetcher } from '@/components/utils/server-data-fetcher';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProjectsPage() {
  const supabase = await createClient()
  const {data: {user}} = await supabase.auth.getUser()
  if(!user) redirect('/login')
  
  
  return (
    <div className="container mx-auto px-4 py-6">
      <ServerDataFetcher fetchFn={async () => {
        const {data: profile} = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if(!profile?.organisation_id) redirect('/dashboard')
        return profile.organisation_id
      }} render={(organisationId) => (
        <ProjectsList organisationId={organisationId} />
      )} />
    </div>
  );
}
