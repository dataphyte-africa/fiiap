import React from 'react'
import { TextSlot } from '../ui/text-slot'
import { OrgCard } from './org-card'
import { Button } from '../ui/button'

const featuredOrganizations = [
  {
    logo: '/landing/hfai-logo.png',
    name: 'Health for All Initiative (HFAI)',
    location: 'Abuja, Nigeria',
    projects: 56,
    blogs: 32,
    description: 'Community healthcare, maternal health, vaccination campaigns'
  },
  {
    logo: '/landing/hfai-logo.png',
    name: 'Education Access Foundation',
    location: 'Lagos, Nigeria',
    projects: 43,
    blogs: 28,
    description: 'Providing quality education and literacy programs for underserved communities'
  },
  {
    logo: '/landing/hfai-logo.png',
    name: 'Clean Water Initiative',
    location: 'Cotonou, Benin',
    projects: 38,
    blogs: 22,
    description: 'Ensuring access to clean water and sanitation facilities across rural areas'
  },
  {
    logo: '/landing/hfai-logo.png',
    name: 'Women Empowerment Network',
    location: 'Banjul, The Gambia',
    projects: 29,
    blogs: 35,
    description: 'Empowering women through skills development and economic opportunities'
  },
  {
    logo: '/landing/hfai-logo.png',
    name: 'Youth Development Alliance',
    location: 'Kano, Nigeria',
    projects: 67,
    blogs: 41,
    description: 'Supporting youth with leadership training and entrepreneurship programs'
  },
  {
    logo: '/landing/hfai-logo.png',
    name: 'Environmental Conservation Society',
    location: 'Porto-Novo, Benin',
    projects: 52,
    blogs: 19,
    description: 'Protecting ecosystems and promoting sustainable environmental practices'
  },
  {
    logo: '/landing/hfai-logo.png',
    name: 'Agricultural Innovation Hub',
    location: 'Serrekunda, The Gambia',
    projects: 34,
    blogs: 26,
    description: 'Improving food security through modern farming techniques and training'
  },
  {
    logo: '/landing/hfai-logo.png',
    name: 'Community Development Partners',
    location: 'Ibadan, Nigeria',
    projects: 45,
    blogs: 33,
    description: 'Building stronger communities through infrastructure and social programs'
  },
  {
    logo: '/landing/hfai-logo.png',
    name: 'Digital Literacy Foundation',
    location: 'Parakou, Benin',
    projects: 28,
    blogs: 24,
    description: 'Bridging the digital divide through technology education and access'
  },
  {
    logo: '/landing/hfai-logo.png',
    name: 'Peace and Reconciliation Center',
    location: 'Basse, The Gambia',
    projects: 31,
    blogs: 29,
    description: 'Promoting peace, conflict resolution and community harmony'
  },
  {
    logo: '/landing/hfai-logo.png',
    name: 'Maternal Care Foundation',
    location: 'Port Harcourt, Nigeria',
    projects: 39,
    blogs: 27,
    description: 'Improving maternal and child health outcomes across communities'
  },
  {
    logo: '/landing/hfai-logo.png',
    name: 'Financial Inclusion Network',
    location: 'Abomey, Benin',
    projects: 26,
    blogs: 31,
    description: 'Expanding access to financial services for underbanked populations'
  }
]

export const Feature3 = () => {
  return (
    <div className='py-16 px-4 bg-gray-50 relative overflow-hidden bg-feature-3-bg bg-cover bg-center w-full'>
      
      
      <div className='max-w-7xl mx-auto relative z-10'>
        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-12'>
          <div className='mb-6 md:mb-0'>
            <TextSlot 
              title="Featured organizations" 
              subtitle="Discover impactful CSOs making a difference across Nigeria, Benin, and The Gambia." 
            />
          </div>
          <Button variant="outline" className='self-start md:self-center'>
            View all →
          </Button>
        </div>

        {/* Organizations Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {featuredOrganizations.map((org, index) => (
            <OrgCard
              key={index}
              logo={org.logo}
              name={org.name}
              location={org.location}
              projects={org.projects}
              blogs={org.blogs}
              description={org.description}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
