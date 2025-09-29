'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Phone, MessageSquare, User, Send, CheckCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { submitContactForm } from '@/lib/services/contact-service'

const contactFormSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactFormSchema>

interface ContactFormProps {
  className?: string
}

export function ContactForm({ className }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const t = useTranslations('contactPage.form')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      await submitContactForm(data)
      setIsSubmitted(true)
      reset()
    } catch (error) {
      console.error('Error submitting contact form:', error)
      // Handle error - you could add error state here
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('success.title')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('success.description')}
          </p>
          <Button 
            onClick={() => setIsSubmitted(false)}
            variant="outline"
          >
            {t('success.sendAnother')}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">
              {t('fullName')}
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="full_name"
                {...register('full_name')}
                placeholder={t('fullNamePlaceholder')}
                className={`pl-10 ${errors.full_name ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.full_name && (
              <p className="text-sm text-red-600">{errors.full_name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              {t('email')}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder={t('emailPlaceholder')}
                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Phone (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              {t('phone')} <span className="text-gray-400">({t('optional')})</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder={t('phonePlaceholder')}
                className="pl-10"
              />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
              {t('subject')}
            </Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="subject"
                {...register('subject')}
                placeholder={t('subjectPlaceholder')}
                className={`pl-10 ${errors.subject ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.subject && (
              <p className="text-sm text-red-600">{errors.subject.message}</p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium text-gray-700">
              {t('message')}
            </Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder={t('messagePlaceholder')}
              rows={6}
              className={errors.message ? 'border-red-500' : ''}
            />
            {errors.message && (
              <p className="text-sm text-red-600">{errors.message.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90  py-3 rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {t('submitting')}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {t('sendMessage')}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
