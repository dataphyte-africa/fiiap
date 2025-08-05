import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
const countries = [
  {
    name: "Nigeria",
    flag: "🇳🇬",
    organizations: "1,246 organizations",
    resources: "12,00 resources",
    image: "nigeria.png"
  },
  {
    name: "Benin", 
    flag: "🇧🇯",
    organizations: "1,246 organizations",
    resources: "12,00 resources",
    image: "benin.png"
  },
  {
    name: "Gambia",
    flag: "🇬🇲", 
    organizations: "1,246 organizations",
    resources: "12,00 resources",
    image: "gambia.png"
  }
]

export const Feature2 = () => {
  return (
    <div className='bg-primary py-16 px-4 relative overflow-hidden bg-feature-2-bg bg-cover bg-center w-full'>
      {/* Dotted background pattern */}
      
      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto'>
            Connecting CSO Across Nigeria, Benin, and The Gambia
          </h2>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {countries.map((country, index) => (
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
                    <span>{country.resources}</span>
                  </div>
                </div>
                
                {/* Explore button */}
                <Button 
                  variant="outline" 
                  className='w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors'
                >
                  Explore organizations →
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}