'use client';

import React from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useCountryStatistics } from '@/hooks/use-country-statistics';
import { Feature2Skeleton } from './feature-2-skeleton';

const countryConfig = {
  'Nigeria': {
    flag: "🇳🇬",
    image: "nigeria.png"
  },
  'Benin': {
    flag: "🇧🇯", 
    image: "benin.png"
  },
  'The Gambia': {
    flag: "🇬🇲",
    image: "gambia.png"
  },
  'Gambia': {
    flag: "🇬🇲",
    image: "gambia.png"
  }
} as const;

export const Feature2Client = () => {
  const t = useTranslations('landingPage.feature2');
  const { data: countryStats, isLoading, error } = useCountryStatistics();

  if (isLoading) {
    return <Feature2Skeleton />;
  }

  if (error) {
    console.error('Error loading country statistics:', error);
    // Fallback to static data on error
    return <Feature2Fallback />;
  }

  // Transform the data for display
  const countries = countryStats?.map(stat => ({
    name: t(`countries.${stat.country.toLowerCase().replace(' ', '')}`),
    flag: countryConfig[stat.country]?.flag || "🌍",
    organizations: `${stat.organisation_count.toLocaleString()} ${t('countries.organizations')}`,
    projects: `${stat.project_count.toLocaleString()} ${t('countries.projects')}`,
    image: countryConfig[stat.country]?.image || "nigeria.png"
  })) || [];

  return (
    <div className='bg-primary py-16 px-4 relative overflow-hidden bg-[url("/landing/feature-2.svg")] bg-cover bg-center w-full'>
      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto'>
            {t('title')}
          </h2>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {countries.map((country, index) => (
            <div key={index} className='bg-white rounded-2xl p-8 shadow-lg relative overflow-hidden'>
              {/* Map background silhouette */}
              <div className='absolute right-4 top-4 opacity-5 text-8xl'>
                <Image 
                  src={`/landing/${country.image}`} 
                  alt={`${country.name} map`} 
                  width={170} 
                  height={120} 
                />
              </div>
              
              <div className='relative z-10'>
                {/* Flag */}
                <div className='text-6xl mb-4'>
                  {country.flag}
                </div>
                
                {/* Country name */}
                <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                  {country.name}
                </h3>
                
                {/* Statistics */}
                <div className='space-y-2 mb-8'>
                  <div className='flex items-center text-gray-600'>
                    <span className='mr-2'>👥</span>
                    <span>{country.organizations}</span>
                  </div>
                  <div className='flex items-center text-gray-600'>
                    <span className='mr-2'>📊</span>
                    <span>{country.projects}</span>
                  </div>
                </div>
                
                {/* Explore button */}
                <Button 
                  variant="outline" 
                  className='w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors'
                  asChild
                >
                  <Link href="/organisations">  
                    {t('exploreButton')}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Fallback component with static data
const Feature2Fallback = () => {
  const t = useTranslations('landingPage.feature2');
  
  const fallbackCountries = [
    {
      name: t('countries.nigeria'),
      flag: "🇳🇬",
      organizations: `-- ${t('countries.organizations')}`,
      projects: `-- ${t('countries.projects')}`,
      image: "nigeria.png"
    },
    {
      name: t('countries.benin'), 
      flag: "🇧🇯",
      organizations: `-- ${t('countries.organizations')}`,
      projects: `-- ${t('countries.projects')}`,
      image: "benin.png"
    },
    {
      name: t('countries.gambia'),
      flag: "🇬🇲", 
      organizations: `-- ${t('countries.organizations')}`,
      projects: `-- ${t('countries.projects')}`,
      image: "gambia.png"
    }
  ];

  return (
    <div className='bg-primary py-16 px-4 relative overflow-hidden bg-[url("/landing/feature-2.svg")] bg-cover bg-center w-full'>
      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto'>
            {t('title')}
          </h2>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {fallbackCountries.map((country, index) => (
            <div key={index} className='bg-white rounded-2xl p-8 shadow-lg relative overflow-hidden'>
              {/* Map background silhouette */}
              <div className='absolute right-4 top-4 opacity-5 text-8xl'>
                <Image src={`/landing/${country.image}`} alt="Map" width={170} height={120} />
              </div>
              
              <div className='relative z-10'>
                {/* Flag */}
                <div className='text-6xl mb-4'>
                  {country.flag}
                </div>
                
                {/* Country name */}
                <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                  {country.name}
                </h3>
                
                {/* Statistics */}
                <div className='space-y-2 mb-8'>
                  <div className='flex items-center text-gray-600'>
                    <span className='mr-2'>👥</span>
                    <span>{country.organizations}</span>
                  </div>
                  <div className='flex items-center text-gray-600'>
                    <span className='mr-2'>📊</span>
                    <span>{country.projects}</span>
                  </div>
                </div>
                
                {/* Explore button */}
                <Button 
                  variant="outline" 
                  className='w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors'
                  asChild
                >
                  <Link href="/organisations">  
                    {t('exploreButton')}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
