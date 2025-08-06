'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Plus, Users, Globe } from 'lucide-react'

interface OrganisationEmptyStateProps {
  onCreateOrganisation?: () => void
  variant?: 'no-organisations' | 'not-affiliated'
  className?: string
}

export function OrganisationEmptyState({ 
  onCreateOrganisation, 
  variant = 'no-organisations',
  className 
}: OrganisationEmptyStateProps) {
  const getContent = () => {
    if (variant === 'not-affiliated') {
      return {
        icon: Users,
        title: 'No Organisation Affiliation',
        description: 'You are not currently affiliated with any organisation. Register your organisation or join an existing one to get started.',
        primaryAction: {
          label: 'Register Organisation',
          onClick: onCreateOrganisation
        },
        secondaryAction: {
          label: 'Browse Organisations',
          href: '/organisations'
        }
      }
    }

    return {
      icon: Building2,
      title: 'No Organisations Yet',
      description: 'You haven\'t registered any organisations yet. Create your first organisation to start connecting with other CSOs and showcase your work.',
      primaryAction: {
        label: 'Register Your Organisation',
        onClick: onCreateOrganisation
      },
      secondaryAction: {
        label: 'Learn More',
        href: '/about'
      }
    }
  }

  const content = getContent()
  const Icon = content.icon

  return (
    <Card className={`border-dashed ${className || ''}`}>
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {content.title}
        </h3>
        
        <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
          {content.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          {content.primaryAction.onClick && (
            <Button 
              onClick={content.primaryAction.onClick}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              {content.primaryAction.label}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            asChild
          >
            <a href={content.secondaryAction.href}>
              <Globe className="h-4 w-4 mr-2" />
              {content.secondaryAction.label}
            </a>
          </Button>
        </div>

        {variant === 'no-organisations' && (
          <div className="mt-8 p-4 bg-muted/50 rounded-lg max-w-md">
            <h4 className="font-medium text-sm mb-2">Why register your organisation?</h4>
            <ul className="text-xs text-muted-foreground space-y-1 text-left">
              <li>• Connect with other civil society organisations</li>
              <li>• Showcase your projects and impact</li>
              <li>• Find collaboration opportunities</li>
              <li>• Access funding information</li>
              <li>• Build your organisation&apos;s visibility</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Specific variants for common use cases
export function NoOrganisationsState({ onCreateOrganisation, className }: { 
  onCreateOrganisation?: () => void
  className?: string 
}) {
  return (
    <OrganisationEmptyState 
      variant="no-organisations"
      onCreateOrganisation={onCreateOrganisation}
      className={className}
    />
  )
}

export function NotAffiliatedState({ onCreateOrganisation, className }: { 
  onCreateOrganisation?: () => void
  className?: string 
}) {
  return (
    <OrganisationEmptyState 
      variant="not-affiliated"
      onCreateOrganisation={onCreateOrganisation}
      className={className}
    />
  )
} 