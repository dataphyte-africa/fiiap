'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar, 
  Globe, 
  Edit, 
  Eye,
  Mail,
  Phone
} from 'lucide-react'
import { Organisation } from './types'
import { OrganisationStatusBadge } from './organisation-status-badge'

interface OrganisationCardProps {
  organisation: Organisation
  onEdit?: () => void
  onView?: () => void
  showActions?: boolean
  variant?: 'default' | 'compact'
  className?: string
}

export function OrganisationCard({ 
  organisation, 
  onEdit, 
  onView,
  showActions = true,
  variant = 'default',
  className 
}: OrganisationCardProps) {
  const isCompact = variant === 'compact'

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
      month: 'short'
    })
  }

  return (
    <Card className={`hover:shadow-md transition-shadow ${className || ''}`}>
      <CardHeader className={`pb-4 ${isCompact ? 'p-4' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Avatar className={isCompact ? 'h-12 w-12' : 'h-16 w-16'}>
              <AvatarImage src={organisation.logo_url || ''} alt={organisation.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(organisation.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`font-semibold text-foreground leading-tight ${
                  isCompact ? 'text-base' : 'text-lg'
                }`}>
                  {organisation.name}
                </h3>
                <OrganisationStatusBadge 
                  status={organisation.status || 'pending_approval'} 
                  className={isCompact ? 'text-xs' : ''}
                />
              </div>
              
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  <span>{organisation.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{organisation.country}</span>
                </div>
                {organisation.size && (
                  <Badge variant="outline" className="text-xs">
                    {organisation.size}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className={`pt-0 ${isCompact ? 'p-4 pt-0' : ''}`}>
        {!isCompact && organisation.mission && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {organisation.mission}
          </p>
        )}

        <div className="space-y-3">
          {/* Key Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {organisation.establishment_year && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Est. {organisation.establishment_year}</span>
              </div>
            )}
            
            {(organisation.staff_count || organisation.volunteer_count) && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>
                  {organisation.staff_count && `${organisation.staff_count} staff`}
                  {organisation.staff_count && organisation.volunteer_count && ', '}
                  {organisation.volunteer_count && `${organisation.volunteer_count} volunteers`}
                </span>
              </div>
            )}

            {organisation.contact_email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span className="truncate">{organisation.contact_email}</span>
              </div>
            )}

            {organisation.contact_phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span>{organisation.contact_phone}</span>
              </div>
            )}
          </div>

          {/* Website */}
          {organisation.website_url && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-3 w-3 text-muted-foreground" />
              <a 
                href={organisation.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate"
              >
                {organisation.website_url.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}

          {/* Thematic Focus */}
          {organisation.thematic_focus && organisation.thematic_focus.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Focus Areas</p>
              <div className="flex flex-wrap gap-1">
                {organisation.thematic_focus.slice(0, isCompact ? 2 : 4).map((focus, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {focus}
                  </Badge>
                ))}
                {organisation.thematic_focus.length > (isCompact ? 2 : 4) && (
                  <Badge variant="outline" className="text-xs">
                    +{organisation.thematic_focus.length - (isCompact ? 2 : 4)} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Languages */}
          {organisation.languages_spoken && organisation.languages_spoken.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-xs font-medium">Languages:</span>
              <span>{organisation.languages_spoken.join(', ')}</span>
            </div>
          )}

          {/* Created Date */}
          {organisation.created_at && (
            <div className="text-xs text-muted-foreground">
              Registered {formatDate(organisation.created_at)}
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 mt-6 pt-4 border-t">
            {onView && (
              <Button variant="outline" size="sm" onClick={onView} className="flex-1">
                <Eye className="h-3 w-3 mr-2" />
                View Details
              </Button>
            )}
            {onEdit && (
              <Button variant="default" size="sm" onClick={onEdit} className="flex-1">
                <Edit className="h-3 w-3 mr-2" />
                Edit
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 