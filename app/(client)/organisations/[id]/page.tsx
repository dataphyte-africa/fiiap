import React, { Suspense } from 'react'
import { OrganisationDetailServer, OrganisationDetailSkeleton } from '@/components/organisations'

interface OrganisationPageProps {
  params: Promise<{
    id:  string
  }>
}

export default async function OrganisationPage({ params }: OrganisationPageProps) {
  const {id} = await params; 
  return (
    <Suspense fallback={<OrganisationDetailSkeleton />}>
      <OrganisationDetailServer id={id} />
    </Suspense>
  )
}