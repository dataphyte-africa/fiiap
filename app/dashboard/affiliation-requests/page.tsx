import { AffiliationRequestsManager, AffiliationRequestsManagerSkeleton } from '@/components/admin';
import { ServerDataFetcher } from '@/components/utils';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function Page() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims ) {
    redirect('/auth/login');
  }
  if(data.claims.user_role !== 'cso_rep') {
    redirect('/dashboard');
  }
  
  return (
    <ServerDataFetcher
      fetchFn={async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.claims.sub)
          .single();
        
        if (!profile) {
          throw new Error('User profile not found');
        }
        
        return profile;
      }}
      render={(profile) => (
        <AffiliationRequestsManager 
          organisationId={profile.organisation_id || ''} 
          adminUserId={data.claims.user_id} 
        />
      )}
      fallback={<AffiliationRequestsManagerSkeleton />}
    />
  )
}
