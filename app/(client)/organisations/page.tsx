import React, { Suspense } from 'react'
import { 
  OrganisationFilterBarServer, 
  OrganisationFilterBarSkeleton,
  OrganisationsGrid,
  // OrganisationsGridServer,
  // OrganisationsGridSkeleton
} from '@/components/organisations';
import { getTranslations } from 'next-intl/server';

export default async function OrganisationsPage() {
  const t = await getTranslations('organisations.page');

  return (
    <div className="min-h-screen w-full">
      {/* Hero section with filter */}
      <div className="bg-[url('/landing/feature-3.svg')] bg-cover bg-no-repeat bg-center">
        <div className="bg-white/20 backdrop-blur-[2px]">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('title')}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('description')}
              </p>
            </div>
            
            <div className="max-w-6xl mx-auto">
              <Suspense fallback={<OrganisationFilterBarSkeleton />}>
                <OrganisationFilterBarServer />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Organisations grid */}
      <div className="container mx-auto px-4 py-8">
        
          <OrganisationsGrid />
        
      </div>
    </div>
  )
}
