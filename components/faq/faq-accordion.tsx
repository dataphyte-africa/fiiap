'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface FAQItem {
  id: string
  questionKey: string
  answerKey: string
}

interface FAQAccordionProps {
  className?: string
}

export default function FAQAccordion({ className = '' }: FAQAccordionProps) {
  const t = useTranslations('faqPage.faqs')

  const faqItems: FAQItem[] = [
    {
      id: 'what-is-platform',
      questionKey: 'whatIsPlatform.question',
      answerKey: 'whatIsPlatform.answer'
    },
    {
      id: 'who-can-join',
      questionKey: 'whoCanJoin.question',
      answerKey: 'whoCanJoin.answer'
    },
    {
      id: 'how-to-register',
      questionKey: 'howToRegister.question',
      answerKey: 'howToRegister.answer'
    },
    {
      id: 'what-features',
      questionKey: 'whatFeatures.question',
      answerKey: 'whatFeatures.answer'
    },
    {
      id: 'is-free',
      questionKey: 'isFree.question',
      answerKey: 'isFree.answer'
    },
    {
      id: 'how-to-partner',
      questionKey: 'howToPartner.question',
      answerKey: 'howToPartner.answer'
    },
    {
      id: 'data-privacy',
      questionKey: 'dataPrivacy.question',
      answerKey: 'dataPrivacy.answer'
    },
    {
      id: 'languages',
      questionKey: 'languages.question',
      answerKey: 'languages.answer'
    },
    {
      id: 'technical-support',
      questionKey: 'technicalSupport.question',
      answerKey: 'technicalSupport.answer'
    },
    {
      id: 'content-moderation',
      questionKey: 'contentModeration.question',
      answerKey: 'contentModeration.answer'
    }
  ]

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqItems.map((item) => (
          <AccordionItem 
            key={item.id} 
            value={item.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm px-6 py-2 hover:shadow-md transition-shadow"
          >
            <AccordionTrigger className="text-left text-base font-semibold text-primary/90 hover:text-primary">
              {t(item.questionKey)}
            </AccordionTrigger>
            <AccordionContent className="text-primary/80 leading-relaxed pt-2">
              {t(item.answerKey)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
