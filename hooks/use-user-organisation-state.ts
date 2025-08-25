import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useUserAffiliationRequest } from './use-affiliation-requests'
import { Database } from '@/types/db'
import { AffiliationRequest } from '@/lib/data/organisations'

interface UserOrganisationState {
  type: 'none' | 'affiliated' | 'created' | 'pending_affiliation' | 'pending_registration'
  organisation?: Database['public']['Tables']['organisations']['Row']
  affiliationRequest?: AffiliationRequest
  loading: boolean
}

export function useUserOrganisationState(userId: string) {
  // Fetch user profile to get organisation_id
  const { data: profile } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('organisation_id')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!userId,
    staleTime: 60 * 1000, // 1 minute
  })

  // Fetch user's affiliation request
  const { data: affiliationRequest, isLoading: affiliationLoading } = useUserAffiliationRequest(userId)

  // Fetch organization data if user has an organisation_id
  const { data: organisation, isLoading: orgLoading } = useQuery({
    queryKey: ['user-organisation', userId, profile?.organisation_id],
    queryFn: async () => {
      if (!profile?.organisation_id) return null
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from('organisations')
        .select('*')
        .eq('id', profile.organisation_id)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!profile?.organisation_id,
    staleTime: 60 * 1000, // 1 minute
  })

  // Fetch pending organization registration if user created one
  const { data: pendingOrg, isLoading: pendingOrgLoading } = useQuery({
    queryKey: ['user-pending-organisation', userId],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('organisations')
        .select('*')
        .eq('created_by', userId)
        .eq('status', 'pending_approval')
        .single()
      
      if (error && error.code !== 'PGRST116') throw error // PGRST116 is "no rows returned"
      return data || null
    },
    enabled: !!userId,
    staleTime: 60 * 1000, // 1 minute
  })

  // Determine the user's organization state
  let state: UserOrganisationState = {
    type: 'none',
    loading: true
  }

  if (orgLoading || affiliationLoading || pendingOrgLoading) {
    state = { type: 'none', loading: true }
  } else if (organisation) {
    state = {
      type: organisation.created_by === userId ? 'created' : 'affiliated',
      organisation,
      loading: false
    }
  } else if (affiliationRequest) {
    state = {
      type: 'pending_affiliation',
      affiliationRequest,
      loading: false
    }
  } else if (pendingOrg) {
    state = {
      type: 'pending_registration',
      organisation: pendingOrg,
      loading: false
    }
  } else {
    state = {
      type: 'none',
      loading: false
    }
  }

  return state
}
