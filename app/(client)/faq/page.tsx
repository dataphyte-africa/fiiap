import React from 'react'
import { getTranslations } from 'next-intl/server'
import FAQAccordion from '@/components/faq/faq-accordion'

export default async function FAQPage() {
  const t = await getTranslations('faqPage')
  
  return (
    <main className="min-h-screen flex flex-col items-center w-full">
      {/* Hero Section */}
      <div className="bg-[url('/blog/blog-bg.png')] w-full bg-cover bg-center text-white md:min-h-[50vh] flex flex-col justify-center items-center relative">
        <div className="absolute inset-0 bg-primary/45" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              {t('hero.description')}
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="w-full py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary/10 rounded-full px-6 py-2 mb-4">
              <span className="text-primary font-medium text-sm uppercase tracking-wide">
                Support
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to know
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get answers to the most common questions about our platform and how it can help your organization thrive.
            </p>
          </div>
          
          <FAQAccordion className="mb-12" />
          
          {/* Contact Support Section */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@fiiap.org"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
