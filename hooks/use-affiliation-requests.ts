import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrganisationAffiliationRequests, getUserAffiliationRequest, createAffiliationRequest } from '@/lib/data/organisations'
import type { CreateAffiliationRequestData } from '@/lib/data/organisations'

export function useUserAffiliationRequest(userId: string) {
  return useQuery({
    queryKey: ['affiliation-request', userId],
    queryFn: () => getUserAffiliationRequest(userId),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

export function useOrganisationAffiliationRequests(organisationId: string) {
  return useQuery({
    queryKey: ['organisation-affiliation-requests', organisationId],
    queryFn: () => getOrganisationAffiliationRequests(organisationId),
    enabled: !!organisationId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

export function useCreateAffiliationRequest() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, requestData }: { userId: string; requestData: CreateAffiliationRequestData }) =>
      createAffiliationRequest(userId, requestData),
    onSuccess: (data, { userId }) => {
      if (data.success) {
        // Invalidate and refetch the user's affiliation request
        queryClient.invalidateQueries({ queryKey: ['affiliation-request', userId] })
        
        // Also invalidate any organisation-specific queries if needed
        if (data.requestId) {
          queryClient.invalidateQueries({ queryKey: ['organisation-affiliation-requests'] })
        }
      }
    },
    onError: (error) => {
      console.error('Error creating affiliation request:', error)
    }
  })
}
