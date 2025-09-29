'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { OrganisationRegistrationForm } from './organisation-registration-form'
import { OrganisationView } from './organisation-view'
import { OrganisationDashboard } from './organisation-dashboard'
import { OrganisationFormData, Organisation } from './types'
import { organisationService } from '@/client-services/organisations'
import { useTranslations } from 'next-intl'
// import { toast } from 'sonner' // Uncomment if using sonner for toasts

export function OrganisationRegistrationExample() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData: OrganisationFormData) => {
    setIsLoading(true)
    
    try {
      await organisationService.registerOrganisation(formData)
      
      // toast.success('Organisation registered successfully!', {
      //   description: 'Your organisation has been submitted for review. You will receive a confirmation email shortly.'
      // })
      
      // Redirect to dashboard or success page
      router.push('/dashboard?tab=organisations')
      
    } catch (error) {
      console.error('Registration error:', error)
      // toast.error('Registration failed', {
      //   description: error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      // })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <OrganisationRegistrationForm 
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}

// Edit organisation example
export function OrganisationEditExample({ organisationId }: { organisationId: string }) {
  const t = useTranslations('organisations')
  const [isLoading, setIsLoading] = useState(false)
  const [organisation, setOrganisation] = useState<Organisation | null>(null)
  const [loadingOrg, setLoadingOrg] = useState(true)
  const router = useRouter()

  // Load existing organisation data
  useEffect(() => {
    const loadOrganisation = async () => {
      try {
        const org = await organisationService.getOrganisationById(organisationId)
        setOrganisation(org)
      } catch (error) {
        console.error('Failed to load organisation:', error)
      } finally {
        setLoadingOrg(false)
      }
    }

    loadOrganisation()
  }, [organisationId])

  const handleSubmit = async (formData: OrganisationFormData) => {
    setIsLoading(true)
    
    try {
      await organisationService.updateOrganisationWithFormData(organisationId, formData)
      
      // Redirect to organisation page or dashboard
      router.push(`/organisations/${organisationId}`)
      
    } catch (error) {
      console.error('Update error:', error)
      // toast.error('Update failed', {
      //   description: error instanceof Error ? error.message : 'Something went wrong.'
      // })
    } finally {
      setIsLoading(false)
    }
  }

  if (loadingOrg) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!organisation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">{t('errors.organizationNotFound')}</h2>
          <p className="text-muted-foreground">{t('errors.organizationNotFoundMessage')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <OrganisationRegistrationForm 
        onSubmit={handleSubmit}
        isLoading={isLoading}
        existingOrganisation={organisation}
        mode="edit"
      />
    </div>
  )
}

// Alternative usage with custom success handling
export function OrganisationRegistrationWithCustomSuccess( {existingOrganisation, mode = 'create'}: {existingOrganisation?: Organisation, mode?: 'create' | 'edit'}) {
  const t = useTranslations('organisations')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const handleSubmit = async (formData: OrganisationFormData) => {
    setIsLoading(true)
    
    try {
      if (mode === 'create') {
        await organisationService.registerOrganisation(formData)
      } else {
        if(!existingOrganisation) {
          throw new Error('Organisation not found')
        }
        await organisationService.updateOrganisationWithFormData(existingOrganisation.id, formData)
      }
      setIsSuccess(true)
    } catch (error) {
      console.error('Registration error:', error)
      // toast.error('Registration failed', {
      //   description: error instanceof Error ? error.message : 'Something went wrong.'
      // })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground">{mode === 'edit' ? t('success.updateSuccessful') : t('success.registrationSuccessful')}</h2>
          <p className="text-muted-foreground">
            {mode === 'edit' ? t('success.updateMessage') : t('success.registrationMessage')}
          </p>
          <button 
            onClick={() => router.push('/dashboard/organisation')}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
          >
            {t('success.gotIt')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <OrganisationRegistrationForm 
        onSubmit={handleSubmit}
        isLoading={isLoading}
        existingOrganisation={existingOrganisation}
        mode={mode}
      />
    </div>
  )
} 

// Organisation view example
export function OrganisationViewExample({   organisation  }: { organisation: Organisation }) {
  const t = useTranslations('organisations')
  const router = useRouter()

  

  const handleEdit = () => {
    router.push(`/dashboard/organisation/edit`)
  }

  if (!organisation) {
    return <div>{t('errors.organizationNotFound')}</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <OrganisationView 
          organisation={organisation}
          onEdit={handleEdit}
          canEdit={true} // Set based on user permissions
        />
      </div>
    </div>
  )
}

// Organisation dashboard example
export function OrganisationDashboardExample({ userId }: { userId: string }) {
  const router = useRouter()

  const handleCreateOrganisation = () => {
    router.push('/organisations/register')
  }

  const handleEditOrganisation = () => {
    router.push(`/organisations/edit`)
  }

  const handleViewOrganisation = (organisationId: string) => {
    router.push(`/organisations/${organisationId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <OrganisationDashboard 
          userId={userId}
          onCreateOrganisation={handleCreateOrganisation}
          onEditOrganisation={handleEditOrganisation}
          onViewOrganisation={handleViewOrganisation}
        />
      </div>
    </div>
  )
} 