import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import { Facebook, Twitter, Instagram } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export const Feature4 = async () => {
  const t = await getTranslations('landingPage.feature4')
  
  return (
    <div className='bg-primary py-24 px-24 rounded-tr-[100px] rounded-tl-[100px] w-full'>
      <div className='w-full mx-auto'>
        {/* Call to Action Section */}
        <div className='bg-white rounded-3xl p-8 mb-16'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
            {/* Left side - Illustration */}
            <div className='flex justify-center'>
              <div className='relative'>
                <Image 
                  src="/landing/feature-4.svg" 
                  alt="Africa network connections"
                  width={400}
                  height={400}
                  className='max-w-full h-auto'
                />
              </div>
            </div>
            
            {/* Right side - Content */}
            <div className='space-y-6'>
              {/* Badge */}
              <div className='inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-primary text-sm font-medium'>
                {t('cta.badge')}
              </div>
              
              {/* Heading */}
              <h2 className='text-3xl lg:text-4xl font-bold leading-tight'>
                {t('cta.title')}
              </h2>
              
              {/* Description */}
              <p className='text-primary-foreground/70 text-lg leading-relaxed'>
                {t('cta.description')}
              </p>
              
              {/* Buttons */}
              <div className='flex flex-col sm:flex-row gap-4'>
                <Button className='bg-primary text-white hover:bg-primary/90 px-6 py-3' asChild>
                  <Link href="/auth/sign-up">
                  {t('cta.joinButton')}
                  </Link>
                </Button>
                <Button variant="outline" className='border-primary text-primary hover:bg-primary hover:text-white px-6 py-3' asChild>
                  <Link href="/organisations">
                  {t('cta.searchButton')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className='text-white'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
            {/* Logo and Description */}
            <div className='md:col-span-1 space-y-4'>
              <div className='flex items-center space-x-2'>
                <Image src="/logo-white.png" alt="fiap" width={100} height={100} />
              </div>
              <p className='text-white/70 text-sm leading-relaxed'>
                {t('footer.description')}
              </p>
              <div className='flex space-x-4'>
                <Facebook className='w-5 h-5 text-white/70 hover:text-white cursor-pointer' />
                <Twitter className='w-5 h-5 text-white/70 hover:text-white cursor-pointer' />
                <Instagram className='w-5 h-5 text-white/70 hover:text-white cursor-pointer' />
              </div>
            </div>
            
            {/* Search Column */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-white'>{t('footer.search')}</h3>
              <div className='space-y-2 text-sm text-white/70'>
                <div className='hover:text-white cursor-pointer'>Nigeria</div>
                <div className='hover:text-white cursor-pointer'>Benin</div>
                <div className='hover:text-white cursor-pointer'>Gambia</div>
              </div>
            </div>
            
            {/* Company Column */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-white'>{t('footer.company')}</h3>
              <div className='space-y-2 text-sm text-white/70'>
                <div className='hover:text-white cursor-pointer'>{t('footer.aboutUs')}</div>
                <div className='hover:text-white cursor-pointer'>{t('footer.faq')}</div>
                <div className='hover:text-white cursor-pointer'>{t('footer.contact')}</div>
              </div>
            </div>
            
            {/* Social Column */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-white'>{t('footer.social')}</h3>
              <div className='space-y-2 text-sm text-white/70'>
                <div className='hover:text-white cursor-pointer'>{t('footer.twitter')}</div>
                <div className='hover:text-white cursor-pointer'>{t('footer.linkedin')}</div>
                <div className='hover:text-white cursor-pointer'>{t('footer.facebook')}</div>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className='border-t border-white/20 pt-6 text-center text-white/60 text-sm'>
            {t('footer.copyright')}
          </div>
        </footer>
      </div>
    </div>
  )
}
