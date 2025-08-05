import React from 'react'
import { TextSlot } from '../ui/text-slot'
import Image from 'next/image'
const features = [
  {
    title: "Find CSOs Easily",
    description: "discover organisations by country, sector, and area of impact, all in one simple search."
  },
  {
    title: "Share & Discover Resources", 
    description: "Post your latest news, grants, events, and partnership calls, while discovering opportunities from other CSOs."
  },
  {
    title: "Connect Across Borders",
    description: "Break geographic barriers and build lasting partnerships that drive real impact across Nigeria, Benin, and Gambia."
  }
]

export const Feature1 = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-3 md:p-20'>
        <div className='flex flex-col gap-4 px-3 md:px-8'>
            <TextSlot title="What Our CSO Collaboration Platform Is For" subtitle="To help civil society organisations across West Africa easily connect, share resources, and build powerful cross-border partnerships that drive social impact." />
            <div className='flex flex-col gap-6'>
            {features.map((feature, index) => (
              <div key={index} className='flex items-start gap-4 p-6 bg-gray-50 rounded-lg'>
                <div className='flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center'>
                  <span className='text-white font-bold text-lg'>1</span>
                </div>
                <div className='flex flex-col gap-2'>
                  <h3 className='text-xl font-semibold text-primary'>{feature.title}</h3>
                  <p className='text-gray-700 leading-relaxed'>{feature.description}</p>
                </div>
              </div>
            ))}
        </div>
        </div>
        <div className='flex flex-col gap-6'>
            <Image src="/landing/image.png" alt="Feature 1" width={580} height={500} />
        </div>
    </div>
  )
}
