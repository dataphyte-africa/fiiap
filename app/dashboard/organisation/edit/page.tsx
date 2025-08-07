// import { OrganisationRegistrationForm } from '@/components/organisations'
import { OrganisationRegistrationWithCustomSuccess } from '@/components/organisations/example-usage'
// import { OrganisationEditExample } from '@/components/organisations/example-usage'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import React, { Suspense } from 'react'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }
  const { data: organisation, error } = await supabase.from('organisations').select('*').eq('created_by', user.id).single()
  if (!organisation && error) {
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
