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
      contact_email: formData.contact_email || null,
      contact_phone: formData.contact_phone || null,
      website_url: formData.website_url || null,
      address: formData.address || null,
      region: formData.region || null,
      state_province: formData.state_province || null,
      city: formData.city || null,
      social_links: formData.social_links || {},
      languages_spoken: formData.languages_spoken || ['English'],
      mission: formData.mission || null,
      vision: formData.vision || null,
      thematic_focus: formData.thematic_focus || [],
      staff_count: formData.staff_count || null,
      volunteer_count: formData.volunteer_count || null,
      partnerships: formData.partnerships?.filter(p => p.trim() !== '') || [],
      awards_recognition: formData.awards_recognition?.filter(a => a.trim() !== '') || [],
      legal_status: formData.legal_status || null,
      tax_exemption_status: formData.tax_exemption_status || false,
      certifications: formData.certifications?.filter(c => c.trim() !== '') || [],
      annual_budget: formData.annual_budget || null,
      logo_url: logoUrl,
      cover_image_url: coverImageUrl,
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
      contact_email: formData.contact_email || null,
      contact_phone: formData.contact_phone || null,
      website_url: formData.website_url || null,
      address: formData.address || null,
      region: formData.region || null,
      state_province: formData.state_province || null,
      city: formData.city || null,
      social_links: formData.social_links || {},
      languages_spoken: formData.languages_spoken || ['English'],
      mission: formData.mission || null,
      vision: formData.vision || null,
      thematic_focus: formData.thematic_focus || [],
      staff_count: formData.staff_count || null,
      volunteer_count: formData.volunteer_count || null,
      partnerships: formData.partnerships?.filter(p => p.trim() !== '') || [],
      awards_recognition: formData.awards_recognition?.filter(a => a.trim() !== '') || [],
      legal_status: formData.legal_status || null,
      tax_exemption_status: formData.tax_exemption_status || false,
      certifications: formData.certifications?.filter(c => c.trim() !== '') || [],
      annual_budget: formData.annual_budget || null,
      logo_url: logoUrl,
      cover_image_url: coverImageUrl,
      media_uploads: formData.media_uploads as Database['public']['Tables']['organisations']['Insert']['media_uploads'] || []
    }

    return this.updateOrganisation(id, updates)
  }

  /**
   * Get all active organisations (for public listing)
   */
  async getActiveOrganisations(filters?: {
    country?: string
    type?: string
    size?: string
    thematic_focus?: string[]
    limit?: number
    offset?: number
  }): Promise<{ data: Organisation[], count: number }> {
    let query = this.supabase
      .from('organisations')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .order('created_at', { ascending: false })

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
    if (filters?.thematic_focus && filters.thematic_focus.length > 0) {
      query = query.overlaps('thematic_focus', filters.thematic_focus)
    }
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error, count } = await query

    if (error) {
      throw new Error(`Failed to fetch organisations: ${error.message}`)
    }

    return {
      data: data || [],
      count: count || 0
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