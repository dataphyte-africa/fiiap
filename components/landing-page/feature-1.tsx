import React from 'react'
import { TextSlot } from '../ui/text-slot'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

export const Feature1 = async () => {
  const t = await getTranslations('landingPage.feature1')
  
  const features = [
    {
      title: t('features.findCsos.title'),
      description: t('features.findCsos.description')
    },
    {
      title: t('features.shareResources.title'), 
      description: t('features.shareResources.description')
    },
    {
      title: t('features.connectBorders.title'),
      description: t('features.connectBorders.description')
    }
  ]

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-3 md:p-20'>
        <div className='flex flex-col gap-4 px-3 md:px-8'>
            <TextSlot title={t('title')} subtitle={t('subtitle')} />
            <div className='flex flex-col gap-6'>
            {features.map((feature, index) => (
              <div key={index} className='flex items-start gap-4 p-6 bg-gray-50 rounded-lg'>
                <div className='shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center'>
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
