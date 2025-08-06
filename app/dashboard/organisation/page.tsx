import { OrganisationRegistrationWithCustomSuccess, OrganisationViewExample } from '@/components/organisations/example-usage'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }
  const {data: organisation, error} = await supabase.from('organisations').select('*').eq('created_by', user.id).single()
  if (organisation && !error) {
    return (
      <OrganisationViewExample organisation={organisation} />
    )
  }
  return (
   <OrganisationRegistrationWithCustomSuccess />
  )
}
