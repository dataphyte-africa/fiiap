import React from 'react'
import { getTranslations } from 'next-intl/server'
import { ContactForm } from '@/components/contact/contact-form'
import { Mail, Phone, Facebook, Instagram, XIcon } from 'lucide-react'

export default async function ContactPage() {
  const t = await getTranslations('contactPage')
  
  return (
    <main className="min-h-screen flex flex-col items-center w-full">
      {/* Hero Section */}
      <div className="bg-[url('/blog/blog-bg.png')] w-full bg-cover bg-center text-white md:min-h-[60vh] flex flex-col justify-center items-center relative">
        <div className="absolute inset-0 bg-primary/60" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Mail className="h-4 w-4" />
              <span className="text-sm font-medium">{t('hero.badge')}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              {t('hero.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="w-full bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Contact Info */}
              <div className="bg-yellow-50 rounded-2xl p-8 shadow-sm h-full">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {t('info.title')}
                  </h2>
                  <p className="text-2xl font-semibold text-yellow-500">
                    {t('info.subtitle')}
                  </p>
                </div>

                {/* Contact Details */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('info.ourEmail')}</p>
                      <p className="text-lg font-semibold text-gray-900">info@fiiap.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('info.ourPhone')}</p>
                      <p className="text-lg font-semibold text-gray-900">+44123647837</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className='mt-auto'>
                  <p className="text-lg font-medium text-gray-900 mb-4">
                    {t('info.socialMedia')}
                  </p>
                  <div className="flex gap-4">
                    <div className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg transition-colors cursor-pointer">
                      <Facebook className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-blue-400 hover:bg-blue-500 p-3 rounded-lg transition-colors cursor-pointer">
                      <XIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-pink-600 hover:bg-pink-700 p-3 rounded-lg transition-colors cursor-pointer">
                      <Instagram className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}