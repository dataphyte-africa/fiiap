import { OrganisationRegistrationWithCustomSuccess, OrganisationViewExample } from '@/components/organisations/example-usage'
import { ServerDataFetcher } from '@/components/utils/server-data-fetcher'
import { createClient } from '@/lib/supabase/server'
import React from 'react'
import { Database } from '@/types/db'

type Profile = Database['public']['Tables']['profiles']['Row']
type Organisation = Database['public']['Tables']['organisations']['Row']

interface UserOrganisationData {
  user: { id: string; email?: string }
  profile: Profile
  organisation: Organisation | null
  hasOrganisation: boolean
}

async function fetchUserOrganisationData(): Promise<UserOrganisationData> {
  const supabase = await createClient()
  
  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (profileError) {
    throw new Error('Failed to fetch user profile')
  }

  let organisation = null
  let hasOrganisation = false

  // First check if user has organisation_id in profile
  if (profile.organisation_id) {
    const { data: org, error: orgError } = await supabase
      .from('organisations')
      .select('*')
      .eq('id', profile.organisation_id)
      .single()
    
    if (!orgError && org) {
      organisation = org
      hasOrganisation = true
    }
  }

  // If no organisation from profile, check if user created one
  if (!hasOrganisation) {
    const { data: createdOrg, error: createdOrgError } = await supabase
      .from('organisations')
      .select('*')
      .eq('created_by', user.id)
      .single()
    
    if (!createdOrgError && createdOrg) {
      organisation = createdOrg
      hasOrganisation = true
    }
  }

  return {
    user,
    profile,
    organisation,
    hasOrganisation
  }
}

export default function Page() {
  return (
    <ServerDataFetcher
      fetchFn={fetchUserOrganisationData}
      render={(data) => {
        if (data.hasOrganisation && data.organisation) {
          return <OrganisationViewExample organisation={data.organisation} />
        }
        return <OrganisationRegistrationWithCustomSuccess />
      }}
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    />
  )
}
