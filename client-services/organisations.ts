import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/db'
import { OrganisationFormData } from '@/components/organisations/types'

type Organisation = Database['public']['Tables']['organisations']['Row']
type OrganisationInsert = Database['public']['Tables']['organisations']['Insert']

export class OrganisationService {
  private supabase = createClient()

  /**
   * Upload file to Supabase Storage
   */
  private async uploadFile(file: File, bucket: string, path: string): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`)
    }

    const { data: { publicUrl } } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return publicUrl
  }

  /**
   * Register a new organisation
   */
  async registerOrganisation(formData: OrganisationFormData): Promise<Organisation> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User must be authenticated to register an organisation')
    }

    // Handle file uploads first
    let logoUrl = formData.logo_url || null
    let coverImageUrl = formData.cover_image_url || null

    if (formData.logo_file) {
      const fileName = `${user.id}/${Date.now()}-logo-${formData.logo_file.name}`
      
      logoUrl = await this.uploadFile(formData.logo_file, 'organisation-media', fileName)
    }

    if (formData.cover_image_file) {
      const fileName = `${user.id}/${Date.now()}-cover-${formData.cover_image_file.name}`
      coverImageUrl = await this.uploadFile(formData.cover_image_file, 'organisation-media', fileName)
    }

    // Transform form data to match database schema
    const organisationData: OrganisationInsert = {
      name: formData.name,
      type: formData.type,
      size: formData.size,
      country: formData.country,
      registration_number: formData.registration_number || null,
      establishment_year: formData.establishment_year || null,
      other_countries: formData.other_countries || [],
      contact_email: formData.contact_email || null,
      contact_phone: formData.contact_phone || null,
      website_url: formData.website_url || null,
      address: formData.address || null,
      region: formData.region || null,
      state_province: formData.state_province || null,
      city: formData.city || null,
      geographic_coverage: formData.geographic_coverage || null,
      social_links: formData.social_links || {},
      languages_spoken: formData.languages_spoken || ['English'],
      mission: formData.mission || null,
      vision: formData.vision || null,
      thematic_focus: formData.thematic_focus || [],
      target_populations: formData.target_populations || [],
      primary_work_methods: formData.primary_work_methods || [],
      operational_levels: formData.operational_levels || [],
      staff_count: formData.staff_count || null,
      volunteer_count: formData.volunteer_count || null,
      partnerships: formData.partnerships?.filter(p => p.trim() !== '') || [],
      network_memberships: formData.network_memberships?.filter(n => n.trim() !== '') || [],
      awards_recognition: formData.awards_recognition?.filter(a => a.trim() !== '') || [],
      legal_status: formData.legal_status || null,
      tax_exemption_status: formData.tax_exemption_status || false,
      certifications: formData.certifications?.filter(c => c.trim() !== '') || [],
      annual_budget: formData.annual_budget || null,
      has_digital_tools: formData.has_digital_tools || false,
      digital_tools: (formData.digital_tools || []) as unknown as Database['public']['Tables']['organisations']['Insert']['digital_tools'],
      logo_url: logoUrl,
      cover_image_url: coverImageUrl,
      media_platforms: formData.media_platforms || [],
      media_work_types: formData.media_work_types || [],
      media_uploads: formData.media_uploads as Database['public']['Tables']['organisations']['Insert']['media_uploads'] || [],
      created_by: user.id,
      status: 'pending_approval' // New organisations need approval
    }

    const { data, error } = await this.supabase
      .from('organisations')
      .insert(organisationData)
      .select()
      .single()

    if (error) {
      console.error('Error registering organisation:', error)
      throw new Error(`Failed to register organisation: ${error.message}`)
    }

    return data
  }

  /**
   * Get organisations by user
   */
  async getUserOrganisations(userId: string): Promise<Organisation[]> {
    const { data, error } = await this.supabase
      .from('organisations')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch user organisations: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get organisation by ID
   */
  async getOrganisationById(id: string): Promise<Organisation | null> {
    const { data, error } = await this.supabase
      .from('organisations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      throw new Error(`Failed to fetch organisation: ${error.message}`)
    }

    return data
  }

  /**
   * Update organisation
   */
  async updateOrganisation(id: string, updates: Partial<OrganisationInsert>): Promise<Organisation> {
    const { data, error } = await this.supabase
      .from('organisations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update organisation: ${error.message}`)
    }

    return data
  }

  /**
   * Update organisation with form data (handles file uploads)
   */
  async updateOrganisationWithFormData(id: string, formData: OrganisationFormData): Promise<Organisation> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User must be authenticated to update an organisation')
    }

    // Handle file uploads first
    let logoUrl = formData.logo_url || null
    let coverImageUrl = formData.cover_image_url || null

    if (formData.logo_file) {
      const fileName = `${user.id}/${Date.now()}-logo-${formData.logo_file.name}`
      logoUrl = await this.uploadFile(formData.logo_file, 'organisation-media', fileName)
    }

    if (formData.cover_image_file) {
      const fileName = `${user.id}/${Date.now()}-cover-${formData.cover_image_file.name}`
      coverImageUrl = await this.uploadFile(formData.cover_image_file, 'organisation-media', fileName)
    }

    // Transform form data to match database schema
    const updates: Partial<OrganisationInsert> = {
      name: formData.name,
      type: formData.type,
      size: formData.size,
      country: formData.country,
      registration_number: formData.registration_number || null,
      establishment_year: formData.establishment_year || null,
      other_countries: formData.other_countries || [],
      contact_email: formData.contact_email || null,
      contact_phone: formData.contact_phone || null,
      website_url: formData.website_url || null,
      address: formData.address || null,
      region: formData.region || null,
      state_province: formData.state_province || null,
      city: formData.city || null,
      geographic_coverage: formData.geographic_coverage || null,
      social_links: formData.social_links || {},
      languages_spoken: formData.languages_spoken || ['English'],
      mission: formData.mission || null,
      vision: formData.vision || null,
      thematic_focus: formData.thematic_focus || [],
      target_populations: formData.target_populations || [],
      primary_work_methods: formData.primary_work_methods || [],
      operational_levels: formData.operational_levels || [],
      staff_count: formData.staff_count || null,
      volunteer_count: formData.volunteer_count || null,
      partnerships: formData.partnerships?.filter(p => p.trim() !== '') || [],
      network_memberships: formData.network_memberships?.filter(n => n.trim() !== '') || [],
      awards_recognition: formData.awards_recognition?.filter(a => a.trim() !== '') || [],
      legal_status: formData.legal_status || null,
      tax_exemption_status: formData.tax_exemption_status || false,
      certifications: formData.certifications?.filter(c => c.trim() !== '') || [],
      annual_budget: formData.annual_budget || null,
      has_digital_tools: formData.has_digital_tools || false,
      digital_tools: (formData.digital_tools || []) as unknown as Database['public']['Tables']['organisations']['Insert']['digital_tools'],
      logo_url: logoUrl,
      cover_image_url: coverImageUrl,
      media_platforms: formData.media_platforms || [],
      media_work_types: formData.media_work_types || [],
      media_uploads: formData.media_uploads as Database['public']['Tables']['organisations']['Insert']['media_uploads'] || []
    }

    return this.updateOrganisation(id, updates)
  }

  /**
   * Get all active organisations (for public listing) with posts and projects counts
   */
  async getActiveOrganisations(filters?: {
    name?: string
    countries?: string[]
    thematic_areas?: string[]
    regions?: string[]
    type?: string
    size?: string
    limit?: number
    offset?: number
    sortBy?: 'name' | 'created_at' | 'updated_at'
    sortOrder?: 'asc' | 'desc'
    page?: number
  }): Promise<{ data: (Organisation & { projects_count: number; posts_count: number })[], count: number; totalPages: number; currentPage: number; hasNextPage: boolean; hasPrevPage: boolean }> {
    const limit = filters?.limit || 12
    const page = filters?.page || 1
    const offset = (page - 1) * limit

    // First, get the total count for pagination
    let countQuery = this.supabase
      .from('organisations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Apply filters to count query
    if (filters?.name && filters.name.trim()) {
      countQuery = countQuery.or(`name.ilike.%${filters.name.trim()}%,mission.ilike.%${filters.name.trim()}%,vision.ilike.%${filters.name.trim()}%`)
    }

    if (filters?.countries && filters.countries.length > 0) {
      const countryEnums = filters.countries.map(c => 
        c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()
      ) as Database['public']['Enums']['country_enum'][]
      countQuery = countQuery.in('country', countryEnums)
    }

    if (filters?.thematic_areas && filters.thematic_areas.length > 0) {
      countQuery = countQuery.overlaps('thematic_focus', filters.thematic_areas)
    }

    if (filters?.regions && filters.regions.length > 0) {
      const regionNames = filters.regions.map(r => 
        r.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      )
      countQuery = countQuery.in('region', regionNames)
    }

    if (filters?.type) {
      countQuery = countQuery.eq('type', filters.type as Database['public']['Enums']['organisation_type_enum'])
    }
    if (filters?.size) {
      countQuery = countQuery.eq('size', filters.size as Database['public']['Enums']['organisation_size_enum'])
    }

    const { count } = await countQuery

    // Now get the actual data with joins
    let query = this.supabase
      .from('organisations')
      .select(`
        *,
        projects:projects!organisation_id(count),
        forum_threads:forum_threads!organisation_id(count)
      `)
      .eq('status', 'active')

    // Apply name search filter
    if (filters?.name && filters.name.trim()) {
      query = query.or(`name.ilike.%${filters.name.trim()}%,mission.ilike.%${filters.name.trim()}%,vision.ilike.%${filters.name.trim()}%`)
    }

    // Apply multi-select filters
    if (filters?.countries && filters.countries.length > 0) {
      const countryEnums = filters.countries.map(c => 
        c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()
      ) as Database['public']['Enums']['country_enum'][]
      query = query.in('country', countryEnums)
    }

    if (filters?.thematic_areas && filters.thematic_areas.length > 0) {
      query = query.overlaps('thematic_focus', filters.thematic_areas)
    }

    if (filters?.regions && filters.regions.length > 0) {
      const regionNames = filters.regions.map(r => 
        r.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      )
      query = query.in('region', regionNames)
    }

    // Apply single-select filters
    if (filters?.type) {
      query = query.eq('type', filters.type as Database['public']['Enums']['organisation_type_enum'])
    }
    if (filters?.size) {
      query = query.eq('size', filters.size as Database['public']['Enums']['organisation_size_enum'])
    }

    // Apply sorting
    const sortBy = filters?.sortBy || 'created_at'
    const sortOrder = filters?.sortOrder || 'desc'
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch organisations: ${error.message}`)
    }

    // Transform the data to include counts
    const transformedData = (data || []).map(org => ({
      ...org,
      projects_count: Array.isArray(org.projects) ? org.projects.length : 0,
      posts_count: Array.isArray(org.forum_threads) ? org.forum_threads.length : 0,
      projects: undefined, // Remove the nested data
      forum_threads: undefined, // Remove the nested data
    }))

    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / limit)

    return {
      data: transformedData as (Organisation & { projects_count: number; posts_count: number })[],
      count: totalCount,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  }

  /**
   * Search organisations
   */
  async searchOrganisations(searchTerm: string, filters?: {
    country?: string
    type?: string
    size?: string
    limit?: number
  }): Promise<Organisation[]> {
    let query = this.supabase
      .from('organisations')
      .select('*')
      .eq('status', 'active')
      .textSearch('search_vector', searchTerm, {
        type: 'websearch',
        config: 'english'
      })

    // Apply filters
    if (filters?.country) {
      query = query.eq('country', filters.country as Database['public']['Enums']['country_enum'])
    }
    if (filters?.type) {
      query = query.eq('type', filters.type as Database['public']['Enums']['organisation_type_enum'])
    }
    if (filters?.size) {
      query = query.eq('size', filters.size as Database['public']['Enums']['organisation_size_enum'])
    }
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to search organisations: ${error.message}`)
    }

    return data || []
  }

  /**
   * Check if user can edit organisation
   */
  async canEditOrganisation(organisationId: string, userId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('organisations')
      .select('created_by')
      .eq('id', organisationId)
      .single()

    if (error || !data) {
      return false
    }

    return data.created_by === userId
  }
}

// Export a singleton instance
export const organisationService = new OrganisationService() 