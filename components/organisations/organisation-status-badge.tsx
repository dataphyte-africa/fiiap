import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react'
import { Database } from '@/types/db'

type OrganisationStatus = Database['public']['Enums']['organisation_status_enum']

interface OrganisationStatusBadgeProps {
  status: OrganisationStatus
  className?: string
}

export function OrganisationStatusBadge({ status, className }: OrganisationStatusBadgeProps) {
  const getStatusConfig = (status: OrganisationStatus) => {
    switch (status) {
      case 'active':
        return {
          label: 'Approved',
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950 dark:text-green-400',
          icon: CheckCircle
        }
      case 'pending_approval':
        return {
          label: 'Pending Review',
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-400',
          icon: Clock
        }
      case 'flagged':
        return {
          label: 'Under Review',
          variant: 'destructive' as const,
          className: 'bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-950 dark:text-orange-400',
          icon: AlertTriangle
        }
      case 'inactive':
        return {
          label: 'Inactive',
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400',
          icon: XCircle
        }
      default:
        return {
          label: 'Unknown',
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400',
          icon: XCircle
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge 
      variant={config.variant}
      className={`inline-flex items-center gap-1.5 ${config.className} ${className || ''}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}

// Helper function to get status description
export function getStatusDescription(status: OrganisationStatus): string {
  switch (status) {
    case 'active':
      return 'Your organisation has been approved and is now publicly visible on the platform.'
    case 'pending_approval':
      return 'Your organisation is under review by our team. This typically takes 2-3 business days.'
    case 'flagged':
      return 'Your organisation requires additional review. Our team will contact you if more information is needed.'
    case 'inactive':
      return 'Your organisation is currently inactive and not visible to the public.'
    default:
      return 'Status information is not available.'
  }
} 