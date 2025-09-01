import React from 'react'
import { TextSlot } from '../ui/text-slot'
import { OrgCard } from './org-card'
import { Button } from '../ui/button'
import { getTranslations } from 'next-intl/server'
import { organisationService } from '@/client-services/organisations'
import Link from 'next/link'

export const Feature3 = async () => {
  const t = await getTranslations('landingPage.feature3')
  
  // Fetch featured organisations from the server with counts
  const organisationsResult = await organisationService.getActiveOrganisations({
    limit: 12,
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  
  const organisations = organisationsResult.data;
  
  return (
    <div className='py-16 px-4 bg-gray-50 relative overflow-hidden bg-[url("/landing/feature-3.svg")] bg-cover bg-center w-full'>
      
      
      <div className='max-w-7xl mx-auto relative z-10'>
        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-12'>
          <div className='mb-6 md:mb-0'>
            <TextSlot 
              title={t('title')} 
              subtitle={t('subtitle')} 
            />
          </div>
          <Button variant="outline" className='self-start md:self-center' asChild>
            <Link href="/organisations">
            {t('viewAllButton')}
            </Link>
          </Button>
        </div>

        {/* Organizations Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {organisations.map((org) => (
            <OrgCard
              key={org.id}
              id={org.id || ''}
              logo={org.logo_url || undefined}
              name={org.name || ''}
              location={[org.city || '', org.region || '', org.country || ''].filter(Boolean).join(', ') || org.country || ''}
              projects={org.projects_count || 0}
              blogs={org.blog_posts_count || 0}
              description={org.mission || org.vision || 'No description available'}
              projectsLabel={t('projects')}
              blogsLabel={t('blogs')}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
