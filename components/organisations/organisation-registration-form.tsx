'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { OrganisationFormData, FormStep, Organisation, organisationFormSchema } from './types'
import { BasicInfoStep } from './basic-info-step'
import { ContactInfoStep } from './contact-info-step'
import { DetailsStep } from './details-step'
import { LegalFinancialStep } from './legal-financial-step'
import { MediaStep } from './media-step'
import { useTranslations } from 'next-intl'

interface OrganisationRegistrationFormProps {
  onSubmit?: (data: OrganisationFormData) => Promise<void>
  isLoading?: boolean
  existingOrganisation?: Organisation
  mode?: 'create' | 'edit'
}

export function OrganisationRegistrationForm({ 
  onSubmit, 
  isLoading = false,
  existingOrganisation,
  mode = 'create'
}: OrganisationRegistrationFormProps) {
  const t = useTranslations('organisations.registration');
  const [currentStep, setCurrentStep] = useState(1)
  
  const methods = useForm<OrganisationFormData>({
    resolver: zodResolver(organisationFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: existingOrganisation?.name || '',
        type: existingOrganisation?.type || undefined,
        size: existingOrganisation?.size || undefined,
        country: existingOrganisation?.country || undefined,
        registration_number: existingOrganisation?.registration_number || undefined,
        establishment_year: existingOrganisation?.establishment_year || undefined,
        other_countries: existingOrganisation?.other_countries || [],
        contact_email: existingOrganisation?.contact_email || '',
        contact_phone: existingOrganisation?.contact_phone || '',
        website_url: existingOrganisation?.website_url || '',
        address: existingOrganisation?.address || '',
        region: existingOrganisation?.region || '',
        state_province: existingOrganisation?.state_province || '',
        city: existingOrganisation?.city || '',
        social_links: existingOrganisation?.social_links as Record<string, string> || {},
        languages_spoken: existingOrganisation?.languages_spoken || ['English'],
        geographic_coverage: existingOrganisation?.geographic_coverage || '',
        mission: existingOrganisation?.mission || '',
        vision: existingOrganisation?.vision || '',
        thematic_focus: existingOrganisation?.thematic_focus || [],
        staff_count: existingOrganisation?.staff_count || undefined,
        volunteer_count: existingOrganisation?.volunteer_count || undefined,
          partnerships: existingOrganisation?.partnerships || [],
        awards_recognition: existingOrganisation?.awards_recognition || [],
        target_populations: existingOrganisation?.target_populations || [],
        primary_work_methods: existingOrganisation?.primary_work_methods || [],
        operational_levels: existingOrganisation?.operational_levels || [],
        network_memberships: existingOrganisation?.network_memberships || [],
        has_digital_tools: existingOrganisation?.has_digital_tools || false,
        digital_tools: (existingOrganisation?.digital_tools as { name: string; description?: string; category: string; url?: string }[]) || [],
        legal_status: existingOrganisation?.legal_status || '',
        tax_exemption_status: existingOrganisation?.tax_exemption_status || false,
        certifications: existingOrganisation?.certifications || [],
        annual_budget: existingOrganisation?.annual_budget || undefined,
        logo_url: existingOrganisation?.logo_url || '',
        cover_image_url: existingOrganisation?.cover_image_url || '',
        media_platforms: existingOrganisation?.media_platforms || [],
        media_work_types: existingOrganisation?.media_work_types || []
    }
  })

  // Populate form with existin

  const steps: FormStep[] = [
    {
      id: 'basic-info',
      title: t('steps.basicInfo.title'),
      description: t('steps.basicInfo.description'),
      component: BasicInfoStep
    },
    {
      id: 'contact-info',
      title: t('steps.contactInfo.title'),
      description: t('steps.contactInfo.description'),
      component: ContactInfoStep
    },
    {
      id: 'details',
      title: t('steps.details.title'),
      description: t('steps.details.description'),
      component: DetailsStep
    },
    {
      id: 'legal-financial',
      title: t('steps.legalFinancial.title'),
      description: t('steps.legalFinancial.description'),
      component: LegalFinancialStep
    },
    {
      id: 'media',
      title: t('steps.media.title'),
      description: t('steps.media.description'),
      component: MediaStep
    }
  ]

  const totalSteps = steps.length
  const currentStepData = steps[currentStep - 1]
  const CurrentStepComponent = currentStepData.component

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final submission
      handleFinalSubmit()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinalSubmit = async () => {
    const isValid = await methods.trigger()
    if (isValid) {
      const formData = methods.getValues()
      await onSubmit?.(formData)
    }
  }

  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {mode === 'edit' ? t('editTitle') : t('title')}
        </h1>
        <p className="text-muted-foreground">
          {mode === 'edit' 
            ? t('editDescription')
            : t('description')
          }
        </p>
      </div>

      {/* Progress Bar */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t('progress.step')} {currentStep} {t('progress.of')} {totalSteps}</span>
              <span>{Math.round(progressPercentage)}% {t('progress.complete')}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            
            {/* Step indicators */}
            <div className="flex justify-between">
              {steps.map((step, index) => {
                const stepNumber = index + 1
                const isActive = stepNumber === currentStep
                const isCompleted = stepNumber < currentStep
                
                return (
                  <div 
                    key={step.id} 
                    className="flex flex-col items-center space-y-2 flex-1"
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : isCompleted 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted text-muted-foreground'
                      }
                    `}>
                      {stepNumber}
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-medium ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground hidden sm:block">
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleFinalSubmit)}>
          <CurrentStepComponent
            onNext={nextStep}
            onPrev={prevStep}
            isFirstStep={currentStep === 1}
            isLastStep={currentStep === totalSteps}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        </form>
      </FormProvider>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <div>
                <p className="font-medium">{t('loading.title')}</p>
                <p className="text-sm text-muted-foreground">{t('loading.description')}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
} 