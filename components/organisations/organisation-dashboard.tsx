'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Building2 } from 'lucide-react'
import { Organisation } from './types'
import { OrganisationCard } from './organisation-card'
import { OrganisationEmptyState } from './organisation-empty-state'
import { organisationService } from '@/client-services/organisations'

interface OrganisationDashboardProps {
  userId?: string
  onCreateOrganisation?: () => void
  onEditOrganisation?: (organisationId: string) => void
  onViewOrganisation?: (organisationId: string) => void
  className?: string
}

export function OrganisationDashboard({
  userId,
  onCreateOrganisation,
  onEditOrganisation,
  onViewOrganisation,
  className
}: OrganisationDashboardProps) {
  const [organisations, setOrganisations] = useState<Organisation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadOrganisations = async () => {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        const userOrgs = await organisationService.getUserOrganisations(userId)
        setOrganisations(userOrgs)
      } catch (err) {
        console.error('Failed to load organisations:', err)
        setError(err instanceof Error ? err.message : 'Failed to load organisations')
      } finally {
        setLoading(false)
      }
    }

    loadOrganisations()
  }, [userId])

  const handleCreateOrganisation = () => {
    if (onCreateOrganisation) {
      onCreateOrganisation()
    } else {
      router.push('/organisations/register')
    }
  }

  const handleEditOrganisation = (organisationId: string) => {
    if (onEditOrganisation) {
      onEditOrganisation(organisationId)
    } else {
      router.push(`/organisations/${organisationId}/edit`)
    }
  }

  const handleViewOrganisation = (organisationId: string) => {
    if (onViewOrganisation) {
      onViewOrganisation(organisationId)
    } else {
      router.push(`/organisations/${organisationId}`)
    }
  }

  if (loading) {
    return <OrganisationDashboardSkeleton className={className} />
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <Building2 className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold">Failed to Load Organisations</h3>
            <p className="text-muted-foreground max-w-md">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Your Organisations</h2>
          <p className="text-muted-foreground">
            {organisations.length === 0 
              ? 'No organisations registered yet' 
              : `${organisations.length} organisation${organisations.length === 1 ? '' : 's'} registered`
            }
          </p>
        </div>
        {organisations.length > 0 && (
          <Button onClick={handleCreateOrganisation}>
            <Plus className="h-4 w-4 mr-2" />
            Add Organisation
          </Button>
        )}
      </div>

      {/* Content */}
      {organisations.length === 0 ? (
        <OrganisationEmptyState 
          onCreateOrganisation={handleCreateOrganisation}
          variant="no-organisations"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {organisations.map((organisation) => (
            <OrganisationCard
              key={organisation.id}
              organisation={organisation}
              onEdit={() => handleEditOrganisation(organisation.id)}
              onView={() => handleViewOrganisation(organisation.id)}
              showActions={true}
              variant="default"
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Loading skeleton component
export function OrganisationDashboardSkeleton({ className }: { className?: string }) {
  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-4">
              <div className="flex items-start space-x-3">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-14" />
                </div>
                <div className="flex gap-2 pt-4">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Quick stats component
export function OrganisationQuickStats({ organisations }: { organisations: Organisation[] }) {
  const statusCounts = organisations.reduce((acc, org) => {
    const status = org.status || 'pending_approval'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const stats = [
    {
      label: 'Total Organisations',
      value: organisations.length,
      className: 'text-primary'
    },
    {
      label: 'Approved',
      value: statusCounts.active || 0,
      className: 'text-green-600'
    },
    {
      label: 'Pending Review',
      value: statusCounts.pending_approval || 0,
      className: 'text-yellow-600'
    },
    {
      label: 'Under Review',
      value: statusCounts.flagged || 0,
      className: 'text-orange-600'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${stat.className}`}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Enhanced dashboard with stats
export function EnhancedOrganisationDashboard(props: OrganisationDashboardProps) {
  const [organisations, setOrganisations] = useState<Organisation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrganisations = async () => {
      if (!props.userId) {
        setLoading(false)
        return
      }

      try {
        const userOrgs = await organisationService.getUserOrganisations(props.userId)
        setOrganisations(userOrgs)
      } catch (err) {
        console.error('Failed to load organisations:', err)
      } finally {
        setLoading(false)
      }
    }

    loadOrganisations()
  }, [props.userId])

  if (loading) {
    return <OrganisationDashboardSkeleton className={props.className} />
  }

  return (
    <div className={`space-y-6 ${props.className || ''}`}>
      {organisations.length > 0 && (
        <OrganisationQuickStats organisations={organisations} />
      )}
      <OrganisationDashboard {...props} />
    </div>
  )
} 