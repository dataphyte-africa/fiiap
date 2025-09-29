// import { OrganisationRegistrationForm } from '@/components/organisations'
import { OrganisationRegistrationWithCustomSuccess } from '@/components/organisations/example-usage'
// import { OrganisationEditExample } from '@/components/organisations/example-usage'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import React, { Suspense } from 'react'
async function fetchUserOrganisationData(){
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
export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }
  const { organisation, hasOrganisation } = await fetchUserOrganisationData()
  if (!hasOrganisation || !organisation) {
    redirect("/dashboard/organisation")
  }
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div>Loading...</div>}>
      <OrganisationRegistrationWithCustomSuccess 
        existingOrganisation={organisation}
        mode="edit"
      />
      </Suspense>
    </div>
  )
}
