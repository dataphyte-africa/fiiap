'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar, 
  Globe, 
  Edit, 
  Mail,
  Phone,
  FileText,
  Award,
  Handshake,
  DollarSign,
  Languages,
  Target,
  Laptop,
  Radio,
  Video,
  Network,
  Briefcase,
  UserCheck,
  Map
} from 'lucide-react'
import { Organisation } from './types'
import { OrganisationStatusBadge, getStatusDescription } from './organisation-status-badge'
import { useTranslations } from 'next-intl'

interface OrganisationViewProps {
  organisation: Organisation
  onEdit?: () => void
  canEdit?: boolean
  className?: string
}

export function OrganisationView({ 
  organisation, 
  onEdit,
  canEdit = false,
  className 
}: OrganisationViewProps) {
  const t = useTranslations('organisations.view')
  const [coverImageLoaded, setCoverImageLoaded] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatEnumValue = (value: string) => {
    return value
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Cover Image & Header */}
      <Card className="overflow-hidden">
        {/* Cover Image */}
        {organisation.cover_image_url && (
          <div className="relative h-48 sm:h-64 bg-muted">
            <img
              src={organisation.cover_image_url}
              alt={`${organisation.name} cover`}
              className="w-full h-full object-cover"
              onLoad={() => setCoverImageLoaded(true)}
              onError={() => setCoverImageLoaded(false)}
            />
            {!coverImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <Building2 className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>
        )}

        <CardHeader className="relative">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            {/* Logo */}
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={organisation.logo_url || ''} alt={organisation.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                {getInitials(organisation.name)}
              </AvatarFallback>
            </Avatar>

            {/* Header Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    {organisation.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      <span>{organisation.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{organisation.city ? `${organisation.city}, ` : ''}{organisation.country}</span>
                    </div>
                    {organisation.size && (
                      <Badge variant="outline">
                        {organisation.size}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Other Countries */}
                  {organisation.other_countries && organisation.other_countries.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        {t('alsoOperatesIn')} {organisation.other_countries.join(', ')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:items-end gap-3">
                  <OrganisationStatusBadge status={organisation.status || 'pending_approval'} />
                  {canEdit && onEdit && (
                    <Button onClick={onEdit} size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      {t('editOrganisation')}
                    </Button>
                  )}
                </div>
              </div>

              {/* Status Description */}
              {organisation.status && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {getStatusDescription(organisation.status)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mission & Vision */}
          {(organisation.mission || organisation.vision) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  {t('missionVision')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {organisation.mission && (
                  <div>
                    <h4 className="font-semibold mb-2">{t('mission')}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {organisation.mission}
                    </p>
                  </div>
                )}
                {organisation.vision && (
                  <div>
                    <h4 className="font-semibold mb-2">{t('vision')}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {organisation.vision}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Geographic Coverage */}
          {organisation.geographic_coverage && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-primary" />
                  {t('geographicCoverage')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {organisation.geographic_coverage}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Thematic Focus */}
          {organisation.thematic_focus && organisation.thematic_focus.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('focusAreas')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {organisation.thematic_focus.map((focus, index) => (
                    <Badge key={index} variant="secondary">
                      {focus}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Target Populations */}
          {organisation.target_populations && organisation.target_populations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  {t('targetPopulations')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {organisation.target_populations.map((population, index) => (
                    <Badge key={index} variant="outline">
                      {formatEnumValue(population)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Media Platforms & Work Types */}
          {((organisation.media_platforms && organisation.media_platforms.length > 0) || 
            (organisation.media_work_types && organisation.media_work_types.length > 0)) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-primary" />
                  {t('mediaCommunications')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {organisation.media_platforms && organisation.media_platforms.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Radio className="h-4 w-4" />
                      {t('mediaPlatforms')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {organisation.media_platforms.map((platform, index) => (
                        <Badge key={index} variant="secondary">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {organisation.media_work_types && organisation.media_work_types.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      {t('mediaWorkTypes')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {organisation.media_work_types.map((workType, index) => (
                        <Badge key={index} variant="outline">
                          {workType}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Primary Work Methods */}
          {organisation.primary_work_methods && organisation.primary_work_methods.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  {t('primaryWorkMethods')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {organisation.primary_work_methods.map((method, index) => (
                    <Badge key={index} variant="outline">
                      {formatEnumValue(method)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Network Memberships */}
          {organisation.network_memberships && organisation.network_memberships.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-primary" />
                  {t('networkMemberships')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {organisation.network_memberships.map((network, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span className="text-muted-foreground">{network}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Partnerships */}
          {organisation.partnerships && organisation.partnerships.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Handshake className="h-5 w-5 text-primary" />
                  {t('partnerships')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {organisation.partnerships.map((partnership, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span className="text-muted-foreground">{partnership}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Awards & Recognition */}
          {organisation.awards_recognition && organisation.awards_recognition.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  {t('awardsRecognition')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {organisation.awards_recognition.map((award, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-muted-foreground">{award}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('contactInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {organisation.contact_email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${organisation.contact_email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {organisation.contact_email}
                  </a>
                </div>
              )}

              {organisation.contact_phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`tel:${organisation.contact_phone}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {organisation.contact_phone}
                  </a>
                </div>
              )}

              {organisation.website_url && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={organisation.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {t('visitWebsite')}
                  </a>
                </div>
              )}

              {organisation.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p>{organisation.address}</p>
                    {organisation.city && <p>{organisation.city}</p>}
                    {organisation.state_province && <p>{organisation.state_province}</p>}
                    {organisation.region && <p>{organisation.region}</p>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Operational Levels */}
          {organisation.operational_levels && organisation.operational_levels.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {t('operationalLevels')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {organisation.operational_levels.map((level, index) => (
                    <Badge key={index} variant="secondary">
                      {level}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Organisation Details */}
          <Card>
            <CardHeader>
              <CardTitle>{t('organisationDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {organisation.establishment_year && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{t('established')}</span>
                  </div>
                  <span className="text-sm font-medium">{organisation.establishment_year}</span>
                </div>
              )}

              {organisation.registration_number && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{t('registration')}</span>
                  </div>
                  <span className="text-sm font-medium">{organisation.registration_number}</span>
                </div>
              )}

              {(organisation.staff_count || organisation.volunteer_count) && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{t('teamSize')}</span>
                  </div>
                  <div className="ml-6 space-y-1">
                    {organisation.staff_count && (
                      <p className="text-sm">{organisation.staff_count} {t('staff')}</p>
                    )}
                    {organisation.volunteer_count && (
                      <p className="text-sm">{organisation.volunteer_count} {t('volunteers')}</p>
                    )}
                  </div>
                </div>
              )}

              {organisation.annual_budget && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{t('annualBudget')}</span>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(organisation.annual_budget)}</span>
                </div>
              )}

              {organisation.languages_spoken && organisation.languages_spoken.length > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{t('languages')}</span>
                  </div>
                  <span className="text-sm font-medium">{organisation.languages_spoken.join(', ')}</span>
                </div>
              )}

              {organisation.legal_status && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('legalStatus')}</span>
                  <span className="text-sm font-medium">{organisation.legal_status}</span>
                </div>
              )}

              {organisation.tax_exemption_status && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('taxStatus')}</span>
                  <Badge variant="secondary" className="text-xs">{t('taxExempt')}</Badge>
                </div>
              )}

              <Separator />

              <div className="text-xs text-muted-foreground">
                {t('registeredOn')} {formatDate(organisation.created_at || '')}
              </div>
            </CardContent>
          </Card>

          {/* Digital Tools */}
          {organisation.has_digital_tools && organisation.digital_tools && Array.isArray(organisation.digital_tools) && organisation.digital_tools.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Laptop className="h-5 w-5 text-primary" />
                  {t('digitalTools')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(organisation.digital_tools as Array<{name: string; description?: string; category: string; url?: string}>).map((tool, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{tool.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {tool.category}
                        </Badge>
                      </div>
                      {tool.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {tool.description}
                        </p>
                      )}
                      {tool.url && (
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <Globe className="h-3 w-3" />
                          {t('visitTool')}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Certifications */}
          {organisation.certifications && organisation.certifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('certifications')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {organisation.certifications.map((cert, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span className="text-sm text-muted-foreground">{cert}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 