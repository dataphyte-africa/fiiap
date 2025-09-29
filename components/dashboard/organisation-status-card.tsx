"use client"

import { Building2, Users, MapPin, ExternalLink, UserPlus, Clock, CheckCircle, XCircle, AlertCircle, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useUserOrganisationState } from "@/hooks/use-user-organisation-state"
import { AffiliationRequestDialog } from "@/components/organisations/affiliation-request-dialog"
import Link from "next/link"
import Image from "next/image"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"


interface OrganisationStatusCardProps {
  userId: string
  className?: string
}



export function OrganisationStatusCard({ userId, className }: OrganisationStatusCardProps) {
  const t = useTranslations('dashboard.organisationStatus')
  const userState = useUserOrganisationState(userId)
  const queryClient = useQueryClient()
  
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['user-profile', userId] })
    queryClient.invalidateQueries({ queryKey: ['user-organisation', userId] })
    queryClient.invalidateQueries({ queryKey: ['user-pending-organisation', userId] })
    queryClient.invalidateQueries({ queryKey: ['affiliation-request', userId] })
  }

  if (userState.loading) {
    return (
      <Card className={cn("transition-all duration-200 hover:shadow-lg hover:-translate-y-1", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{t('title')}</CardTitle>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // State 1: No organization and no pending requests
  if (userState.type === 'none') {
    return (
      <Card className={cn("transition-all duration-200 hover:shadow-lg hover:-translate-y-1", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{t('title')}</CardTitle>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-sm mb-2">{t('noOrganisationLinked')}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('noOrganisationDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button asChild size="sm">
              <Link href="/dashboard/organisation/">{t('registerOrganisation')}</Link>
            </Button>
            <AffiliationRequestDialog 
              userId={userId}
              trigger={
                <Button variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t('joinOrganisation')}
                </Button>
              }
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  // State 2: Pending affiliation request
  if (userState.type === 'pending_affiliation' && userState.affiliationRequest) {
    const request = userState.affiliationRequest
    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'pending':
          return <Clock className="h-4 w-4 text-yellow-500" />
        case 'approved':
          return <CheckCircle className="h-4 w-4 text-green-500" />
        case 'rejected':
          return <XCircle className="h-4 w-4 text-red-500" />
        case 'cancelled':
          return <AlertCircle className="h-4 w-4 text-gray-500" />
        default:
          return <Clock className="h-4 w-4 text-muted-foreground" />
      }
    }

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'pending':
          return "bg-yellow-100 text-yellow-800"
        case 'approved':
          return "bg-green-100 text-green-800"
        case 'rejected':
          return "bg-red-100 text-red-800"
        case 'cancelled':
          return "bg-gray-100 text-gray-800"
        default:
          return "bg-gray-100 text-gray-800"
      }
    }

    return (
      <Card className={cn("transition-all duration-200 hover:shadow-lg hover:-translate-y-1", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{t('affiliationRequest')}</CardTitle>
            <Clock className="h-5 w-5 text-yellow-500" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="border rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(request.request_status || 'pending')}
                    <h4 className="font-medium text-sm">
                      {request.organisation?.name || 'Unknown Organisation'}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge 
                      variant="secondary" 
                      className={cn("text-xs", getStatusColor(request.request_status || 'pending'))}
                    >
                      {request.request_status?.replace('_', ' ') || 'pending'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {request.requested_at ? new Date(request.requested_at).toLocaleDateString() : 'Unknown date'}
                    </span>
                  </div>
                  {request.request_message && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {request.request_message}
                    </p>
                  )}
                  {request.admin_response && (
                    <div className="mt-2 p-2 bg-muted rounded text-xs">
                      <strong>{t('response')}:</strong> {request.admin_response}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              {t('refreshStatus')}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // State 3: Pending organization registration
  if (userState.type === 'pending_registration' && userState.organisation) {
    const org = userState.organisation
    return (
      <Card className={cn("transition-all duration-200 hover:shadow-lg hover:-translate-y-1", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{t('organisationRegistration')}</CardTitle>
            <FileText className="h-5 w-5 text-yellow-500" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            {org.logo_url ? (
              <Image 
                src={org.logo_url} 
                alt={`${org.name} logo`}
                width={48}
                height={48}
                className="h-12 w-12 rounded-lg object-cover bg-muted"
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate mb-1">{org.name}</h3>
              <div className="flex items-center text-xs text-muted-foreground mb-1">
                <MapPin className="h-3 w-3 mr-1" />
                {org.city ? `${org.city}, ${org.country}` : org.country}
              </div>
              <p className="text-xs text-muted-foreground capitalize">{org.type}</p>
            </div>
          </div>

          <div className="text-center">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
              {t('pendingApproval')}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              {t('pendingApprovalDescription')}
            </p>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/organisation">{t('viewDetails')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // State 4 & 5: User is affiliated with or created an organization
  if ((userState.type === 'affiliated' || userState.type === 'created') && userState.organisation) {
    const org = userState.organisation
    const statusMap = {
      active: "bg-green-100 text-green-800",
      pending_approval: "bg-yellow-100 text-yellow-800",
      flagged: "bg-red-100 text-red-800",
      inactive: "bg-gray-100 text-gray-800"
    } as const
    const statusColor = statusMap[org.status as keyof typeof statusMap] || "bg-gray-100 text-gray-800"

    return (
      <Card className={cn(
        "transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        className
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              {userState.type === 'created' ? t('myOrganisation') : t('organisation')}
            </CardTitle>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            {org.logo_url ? (
              <Image 
                src={org.logo_url} 
                alt={`${org.name} logo`}
                width={48}
                height={48}
                className="h-12 w-12 rounded-lg object-cover bg-muted"
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate mb-1">{org.name}</h3>
              <div className="flex items-center text-xs text-muted-foreground mb-1">
                <MapPin className="h-3 w-3 mr-1" />
                {org.city ? `${org.city}, ${org.country}` : org.country}
              </div>
              <p className="text-xs text-muted-foreground capitalize">{org.type}</p>
            </div>
          </div>

          {org.staff_count && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              <span>{org.staff_count} {t('staffMembers')}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Badge variant="secondary" className={cn("text-xs", statusColor)}>
              {org.status?.replace('_', ' ') || 'inactive'}
            </Badge>
            <div className="flex space-x-2">
              {org.website_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    if (!org.website_url) return
                    e.stopPropagation()
                    window.open(org.website_url, '_blank')
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link href="/dashboard/organisation">{t('viewDetails')}</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Fallback state
  return (
    <Card className={cn("transition-all duration-200 hover:shadow-lg hover:-translate-y-1", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{t('title')}</CardTitle>
          <Building2 className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-sm mb-2">{t('unableToLoadStatus')}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('unableToLoadDescription')}
          </p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            {t('refreshPage')}
          </Button>
        </CardContent>
      </Card>
    )
}
