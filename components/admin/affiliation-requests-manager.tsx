"use client"

import { useState, useEffect } from "react"
import { Building2, User, Clock, CheckCircle, XCircle, AlertCircle, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { getOrganisationAffiliationRequests, updateAffiliationRequestStatus } from "@/lib/data/organisations"
import type { AffiliationRequest } from "@/lib/data/organisations"
import type { Database } from "@/types/db"

type Profile = Database['public']['Tables']['profiles']['Row']

interface AffiliationRequestsManagerProps {
  organisationId: string
  adminUserId: string
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

export function AffiliationRequestsManager({ organisationId, adminUserId }: AffiliationRequestsManagerProps) {
  const [requests, setRequests] = useState<AffiliationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<AffiliationRequest | null>(null)
  const [adminResponse, setAdminResponse] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchRequests()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organisationId])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getOrganisationAffiliationRequests(organisationId)
      setRequests(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch affiliation requests')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (requestId: string, status: Database['public']['Enums']['organisation_affiliation_status_enum']) => {
    try {
      setIsUpdating(true)
      const result = await updateAffiliationRequestStatus(
        requestId, 
        status, 
        adminUserId,
        adminResponse.trim() || undefined,
      )

      if (result.success) {
        // Refresh the requests list
        await fetchRequests()
        setSelectedRequest(null)
        setAdminResponse("")
      } else {
        setError(result.error || 'Failed to update request status')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Update error:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const pendingRequests = requests.filter(req => req.request_status === 'pending')
  const otherRequests = requests.filter(req => req.request_status !== 'pending')

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Affiliation Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Affiliation Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-sm text-red-600 mb-4">{error}</div>
            <Button variant="outline" onClick={fetchRequests}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Affiliation Requests
          <Badge variant="secondary" className="ml-2">
            {requests.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No affiliation requests for this organisation.
          </div>
        ) : (
          <>
            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground">
                  Pending Requests ({pendingRequests.length})
                </h3>
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {(request.profiles as Profile)?.name || 'Unknown User'}
                            </h4>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(request.request_status || 'pending')}
                          <Badge 
                            variant="secondary" 
                            className={cn("text-xs", getStatusColor(request.request_status || 'pending'))}
                          >
                            {request.request_status?.replace('_', ' ') || 'pending'}
                          </Badge>
                        </div>
                      </div>

                      {request.request_message && (
                        <div className="mb-3 p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Request Message:</span>
                          </div>
                          <p className="text-sm">{request.request_message}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span>
                          Requested: {request.requested_at ? new Date(request.requested_at).toLocaleDateString() : 'Unknown date'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request)
                            setAdminResponse("")
                          }}
                        >
                          Respond
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Requests */}
            {otherRequests.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground">
                  Other Requests ({otherRequests.length})
                </h3>
                <div className="space-y-3">
                  {otherRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {(request.profiles as Profile)?.name || 'Unknown User'}
                            </h4>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(request.request_status || 'pending')}
                          <Badge 
                            variant="secondary" 
                            className={cn("text-xs", getStatusColor(request.request_status || 'pending'))}
                          >
                            {request.request_status?.replace('_', ' ') || 'pending'}
                          </Badge>
                        </div>
                      </div>

                      {request.request_message && (
                        <div className="mb-3 p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Request Message:</span>
                          </div>
                          <p className="text-sm">{request.request_message}</p>
                        </div>
                      )}

                      {request.admin_response && (
                        <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-blue-700">Admin Response:</span>
                          </div>
                          <p className="text-sm text-blue-700">{request.admin_response}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          Requested: {request.requested_at ? new Date(request.requested_at).toLocaleDateString() : 'Unknown date'}
                        </span>
                        {request.responded_at && (
                          <span>
                            Responded: {new Date(request.responded_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Response Dialog */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="font-semibold mb-4">Respond to Affiliation Request</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="admin-response">Response Message (Optional)</Label>
                  <Textarea
                    id="admin-response"
                    placeholder="Add a response message..."
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate(selectedRequest.id, 'approved')}
                    disabled={isUpdating}
                    className="flex-1"
                  >
                    {isUpdating ? 'Updating...' : 'Approve'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected')}
                    disabled={isUpdating}
                    className="flex-1"
                  >
                    {isUpdating ? 'Updating...' : 'Reject'}
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setSelectedRequest(null)}
                  disabled={isUpdating}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
