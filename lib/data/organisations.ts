import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/db";

type Organisation = Database['public']['Tables']['organisations']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export interface OrganisationFilters {
  name?: string;
  countries?: string[];
  thematic_areas?: string[];
  regions?: string[];
  sortBy?: 'name' | 'created_at' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface OrganisationsResult {
  data: Organisation[];
  count: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export async function getOrganisations(filters: OrganisationFilters = {}): Promise<OrganisationsResult> {
  const supabase = createClient();
  
  const {
    name,
    countries,
    thematic_areas,
    regions,
    sortBy = 'created_at',
    sortOrder = 'desc',
    page = 1,
    limit = 12
  } = filters;

  let query = supabase
    .from('organisations')
    .select('*', { count: 'exact' })
    .eq('status', 'active');

  // Apply name search filter
  if (name && name.trim()) {
    query = query.or(`name.ilike.%${name.trim()}%,mission.ilike.%${name.trim()}%,vision.ilike.%${name.trim()}%`);
  }

  // Apply multi-select filters
  if (countries && countries.length > 0) {
    // Convert to enum values and filter
    const countryEnums = countries.map(c => 
      c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()
    ) as Database['public']['Enums']['country_enum'][];
    query = query.in('country', countryEnums);
  }

  if (thematic_areas && thematic_areas.length > 0) {
    // For array fields, use overlaps to match any of the selected themes
    query = query.overlaps('thematic_focus', thematic_areas);
  }

  if (regions && regions.length > 0) {
    // Convert underscore format back to readable format for region matching
    const regionNames = regions.map(r => 
      r.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    );
    query = query.in('region', regionNames);
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Apply pagination
  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching organisations:', error);
    throw new Error(`Failed to fetch organisations: ${error.message}`);
  }

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data: data || [],
    count: totalCount,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
}

// Helper function to get projects count for an organisation
export async function getOrganisationProjectsCount(organisationId: string): Promise<number> {
  const supabase = await createClient();
  
  const { count, error } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('organisation_id', organisationId)
    .eq('status', 'ongoing');

  if (error) {
    console.error('Error fetching projects count:', error);
    return 0;
  }

  return count || 0;
}

// Helper function to get posts count for an organisation


export async function getOrganisationById(id: string): Promise<Organisation | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('organisations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching organisation:', error);
    return null;
  }

  return data;
}

// Admin functions for managing organisations
export interface AdminOrganisationFilters {
  name?: string;
  countries?: Database['public']['Enums']['country_enum'];
  status?: Database['public']['Enums']['organisation_status_enum'];
  types?: Database['public']['Enums']['organisation_type_enum'];
  verified?: boolean;
  sortBy?: 'name' | 'created_at' | 'updated_at' | 'status' | 'type' | 'country';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface AdminOrganisationsResult {
  data: Organisation[];
  count: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export async function getAdminOrganisation(organisationId: string): Promise<Organisation | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('organisations')
    .select('*')
    .eq('id', organisationId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching admin organisation:', error);
    throw new Error(`Failed to fetch organisation: ${error.message}`);
  }

  return data;
}

export async function getAdminOrganisations(filters: AdminOrganisationFilters = {}): Promise<AdminOrganisationsResult> {
  const supabase = await createClient();
  
  const {
    name,
    countries,
    status,
    types,
    verified,
    sortBy = 'created_at',
    sortOrder = 'desc',
    page = 1,
    limit = 20
  } = filters;

  let query = supabase
    .from('organisations')
    .select('*', { count: 'exact' });

  // Apply name search filter
  if (name && name.trim()) {
    query = query.or(`name.ilike.%${name.trim()}%,mission.ilike.%${name.trim()}%,vision.ilike.%${name.trim()}%`);
  }

  // Apply status filter
  if (status) {
    query = query.eq('status', status);
  }

  // Apply type filter
  if (types) {
    query = query.eq('type', types);
  }

  // Apply verification filter
  if (verified !== undefined) {
    query = query.eq('verified', verified);
  }

  // Apply multi-select filters
  if (countries) {
    query = query.eq('country', countries);
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Apply pagination
  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching admin organisations:', error);
    throw new Error(`Failed to fetch organisations: ${error.message}`);
  }

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data: data || [],
    count: totalCount,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
}

export async function updateOrganisationStatus(
  organisationId: string, 
  status: Database['public']['Enums']['organisation_status_enum']
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  console.log('Updating organisation status:🌹', organisationId, status);
  const {data, error } = await supabase.rpc('change_organisation_status', {
    org_id: organisationId,
    new_status: status
  })

  console.log('Updated organisation status:🌹', data);

  if (error) {
    console.error('Error updating organisation status:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function toggleOrganisationVerification(
  organisationId: string, 
  verified: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('organisations')
    .update({ 
      verified,
      updated_at: new Date().toISOString()
    })
    .eq('id', organisationId);

  if (error) {
    console.error('Error updating organisation verification:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getOrganisationStats(): Promise<{
  total: number;
  active: number;
  pending: number;
  flagged: number;
  inactive: number;
}> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('organisations')
    .select('status');

  if (error) {
    console.error('Error fetching organisation stats:', error);
    return { total: 0, active: 0, pending: 0, flagged: 0, inactive: 0 };
  }

  const stats = {
    total: data.length,
    active: data.filter(org => org.status === 'active').length,
    pending: data.filter(org => org.status === 'pending_approval').length,
    flagged: data.filter(org => org.status === 'flagged').length,
    inactive: data.filter(org => org.status === 'inactive').length,
  };

  return stats;
}

// Affiliation request functions
export interface AffiliationRequest {
  id: string;
  user_id: string;
  organisation_id: string;
  organisation: Partial<Organisation>;
  profiles?: Partial<Profile>;
  request_message: string | null;
  request_status: Database['public']['Enums']['organisation_affiliation_status_enum'] | null;
  requested_at: string | null;
  responded_at: string | null;
  responded_by: string | null;
  admin_response: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateAffiliationRequestData {
  organisation_id: string;
  request_message?: string;
}

export async function searchOrganisationsForAffiliation(
  searchTerm: string,
  limit: number = 10
): Promise<Partial<Organisation>[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('organisations')
    .select('id, name, type, country, city, mission, logo_url, status')
    .eq('status', 'active')
    .or(`name.ilike.%${searchTerm.trim()}%,mission.ilike.%${searchTerm.trim()}%`)
    .limit(limit);

  if (error) {
    console.error('Error searching organisations:', error);
    throw new Error(`Failed to search organisations: ${error.message}`);
  }

  return data || [];
}

export async function createAffiliationRequest(
  userId: string,
  requestData: CreateAffiliationRequestData
): Promise<{ success: boolean; error?: string; requestId?: string }> {
  const supabase = createClient();
  
  // Check if user already has a pending request for this organisation
  const { data: existingRequest } = await supabase
    .from('organisation_affiliation_requests')
    .select('id, request_status')
    .eq('user_id', userId)
    .eq('organisation_id', requestData.organisation_id)
    .in('request_status', ['pending'])
    .single();

  if (existingRequest) {
    return { 
      success: false, 
      error: 'You already have a pending affiliation request for this organisation' 
    };
  }

  const { data, error } = await supabase
    .from('organisation_affiliation_requests')
    .insert({
      user_id: userId,
      organisation_id: requestData.organisation_id,
      request_message: requestData.request_message || null,
      request_status: 'pending',
      requested_at: new Date().toISOString()
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating affiliation request:', error);
    return { success: false, error: error.message };
  }

  return { success: true, requestId: data.id };
}

export async function getUserAffiliationRequest(
  userId: string
): Promise<AffiliationRequest | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('organisation_affiliation_requests')
    .select(`
      *,
      organisation:organisation_id(id, name, type, country, city, logo_url)
    `)
    .eq('user_id', userId)
    .eq('request_status', 'pending')
    .order('requested_at', { ascending: false })
    .limit(1)
 

  if (error) {
    console.error('Error fetching user affiliation requests:', error);
    throw new Error(`Failed to fetch affiliation requests: ${error.message}`);
  }

  return data[0]
}

export async function getOrganisationAffiliationRequests(
  organisationId: string
): Promise<AffiliationRequest[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('organisation_affiliation_requests')
    .select(`
      *,
      organisation:organisation_id(id, name, type, country, city, logo_url),  
      profiles!user_id(id, name, avatar_url)
    `)
    .eq('organisation_id', organisationId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching organisation affiliation requests:', error);
    throw new Error(`Failed to fetch affiliation requests: ${error.message}`);
  }

  return data || [];
}

export async function updateAffiliationRequestStatus(
  requestId: string,
  status: Database['public']['Enums']['organisation_affiliation_status_enum'],
  respondedBy: string,
  adminResponse?: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  const updateData: {
    request_status: Database['public']['Enums']['organisation_affiliation_status_enum'];
    admin_response?: string;
    responded_by: string;
    responded_at?: string;
  } = {
    request_status: status,
    responded_by: respondedBy,
  };

  if (adminResponse) {
    updateData.admin_response = adminResponse;
  }

 

  // Always set responded_at when status is being changed to approved/rejected
  if (status === 'approved' || status === 'rejected') {
    updateData.responded_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('organisation_affiliation_requests')
    .update(updateData)
    .eq('id', requestId);

  if (error) {
    console.error('Error updating affiliation request status:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}