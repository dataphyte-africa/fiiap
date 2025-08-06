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
  Target
} from 'lucide-react'
import { Organisation } from './types'
import { OrganisationStatusBadge, getStatusDescription } from './organisation-status-badge'

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
                </div>

                <div className="flex flex-col sm:items-end gap-3">
                  <OrganisationStatusBadge status={organisation.status || 'pending_approval'} />
                  {canEdit && onEdit && (
                    <Button onClick={onEdit} size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Organisation
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
                  Mission & Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {organisation.mission && (
                  <div>
                    <h4 className="font-semibold mb-2">Mission</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {organisation.mission}
                    </p>
                  </div>
                )}
                {organisation.vision && (
                  <div>
                    <h4 className="font-semibold mb-2">Vision</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {organisation.vision}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Thematic Focus */}
          {organisation.thematic_focus && organisation.thematic_focus.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Focus Areas</CardTitle>
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

          {/* Partnerships */}
          {organisation.partnerships && organisation.partnerships.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Handshake className="h-5 w-5 text-primary" />
                  Partnerships
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
                  Awards & Recognition
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
              <CardTitle>Contact Information</CardTitle>
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
                    Visit Website
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

          {/* Organisation Details */}
          <Card>
            <CardHeader>
              <CardTitle>Organisation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {organisation.establishment_year && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Established</span>
                  </div>
                  <span className="text-sm font-medium">{organisation.establishment_year}</span>
                </div>
              )}

              {organisation.registration_number && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Registration</span>
                  </div>
                  <span className="text-sm font-medium">{organisation.registration_number}</span>
                </div>
              )}

              {(organisation.staff_count || organisation.volunteer_count) && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Team Size</span>
                  </div>
                  <div className="ml-6 space-y-1">
                    {organisation.staff_count && (
                      <p className="text-sm">{organisation.staff_count} Staff</p>
                    )}
                    {organisation.volunteer_count && (
                      <p className="text-sm">{organisation.volunteer_count} Volunteers</p>
                    )}
                  </div>
                </div>
              )}

              {organisation.annual_budget && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Annual Budget</span>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(organisation.annual_budget)}</span>
                </div>
              )}

              {organisation.languages_spoken && organisation.languages_spoken.length > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Languages</span>
                  </div>
                  <span className="text-sm font-medium">{organisation.languages_spoken.join(', ')}</span>
                </div>
              )}

              {organisation.legal_status && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Legal Status</span>
                  <span className="text-sm font-medium">{organisation.legal_status}</span>
                </div>
              )}

              {organisation.tax_exemption_status && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tax Status</span>
                  <Badge variant="secondary" className="text-xs">Tax Exempt</Badge>
                </div>
              )}

              <Separator />

              <div className="text-xs text-muted-foreground">
                Registered on {formatDate(organisation.created_at || '')}
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          {organisation.certifications && organisation.certifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
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