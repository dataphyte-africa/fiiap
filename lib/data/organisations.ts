import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/db";

type Organisation = Database['public']['Tables']['organisations']['Row'];

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
  const supabase = await createClient();
  
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
export async function getOrganisationPostsCount(organisationId: string): Promise<number> {
  const supabase = await createClient();
  
  const { count, error } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('organisation_id', organisationId)
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching posts count:', error);
    return 0;
  }

  return count || 0;
} 

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