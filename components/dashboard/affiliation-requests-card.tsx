"use client"

import { Building2, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useUserAffiliationRequest } from "@/hooks/use-affiliation-requests"
import { AffiliationRequestDialog } from "@/components/organisations/affiliation-request-dialog"


interface AffiliationRequestsCardProps {
  userId: string
  className?: string
}

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

export function AffiliationRequestsCard({ userId, className }: AffiliationRequestsCardProps) {
  const { request, loading, error, refreshRequests } = useUserAffiliationRequest(userId)

  if (loading) {
    return (
      <Card className={cn("transition-all duration-200 hover:shadow-lg hover:-translate-y-1", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Affiliation Requests</CardTitle>
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

  if (error) {
    return (
      <Card className={cn("transition-all duration-200 hover:shadow-lg hover:-translate-y-1", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Affiliation Requests</CardTitle>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-sm text-red-600 mb-4">{error}</div>
          <Button variant="outline" size="sm" onClick={refreshRequests}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!request) {
    return (
      <Card className={cn("transition-all duration-200 hover:shadow-lg hover:-translate-y-1", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Affiliation Requests</CardTitle>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-sm mb-2">No Affiliation Requests</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You haven&apos;t requested to join any organisations yet.
          </p>
          <AffiliationRequestDialog 
            userId={userId}
            trigger={
              <Button size="sm">
                <Building2 className="h-4 w-4 mr-2" />
                Join Organisation
              </Button>
            }
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-lg hover:-translate-y-1", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Affiliation Requests</CardTitle>
          <Building2 className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
            <div key={request.id} className="border rounded-lg p-3">
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
                      <strong>Response:</strong> {request.admin_response}
                    </div>
                  )}
                </div>
              </div>
            </div>
        </div>
       
      </CardContent>
    </Card>
  )
}
