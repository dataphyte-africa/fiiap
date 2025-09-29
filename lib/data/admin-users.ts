import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/db'

type UserRole = Database['public']['Enums']['user_role_enum']

export interface AdminUser {
  id: string
  name: string
  email: string
  avatar_url: string | null
  title: string | null
  department: string | null
  organisation_id: string | null
  organisation_name: string | null
  role: UserRole | null
  created_at: string | null
  updated_at: string | null
}

export interface AdminUserFilters {
  page: number
  limit: number
  sortBy: 'name' | 'created_at' | 'updated_at'
  sortOrder: 'asc' | 'desc'
  search?: string
  role?: UserRole
  organisation_id?: string
}

export interface AdminUsersResponse {
  data: AdminUser[]
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  count: number
}

export async function getAdminUsers(filters: AdminUserFilters): Promise<AdminUsersResponse> {
  const supabase = createClient()
  
  try {
    let query = supabase
      .from('admin_users_view')  // Use the view instead
      .select('*')
      .order(filters.sortBy, { ascending: filters.sortOrder === 'asc' })
      .range((filters.page - 1) * filters.limit, filters.page * filters.limit - 1)

    // Apply search filter
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,title.ilike.%${filters.search}%`)
    }

    // Apply role filter
    if (filters.role) {
      query = query.eq('role', filters.role)
    }

    // Apply organisation filter
    if (filters.organisation_id) {
      query = query.eq('organisation_id', filters.organisation_id)
    }

    const { data, error, count } = await query

    if (error) {
      throw error
    }

    // Transform the data to match AdminUser interface
    const transformedData: AdminUser[] = (data || []).map(user => ({
      id: user.id || '',
      name: user.name || '',
      email: user.email || '',
      avatar_url: user.avatar_url,
      title: user.title,
      department: user.department,
      organisation_id: user.organisation_id,
      organisation_name: user.organisation_name,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at
    }))

    const totalPages = Math.ceil((count || 0) / filters.limit)
    
    return {
      data: transformedData,
      currentPage: filters.page,
      totalPages,
      hasNextPage: filters.page < totalPages,
      hasPrevPage: filters.page > 1,
      count: count || 0
    }
  } catch (error) {
    console.error('Error fetching admin users:', error)
    throw error
  }
}

export async function getOrganisationsForSearch(search?: string) {
  const supabase = createClient()
  
  try {
    let query = supabase
      .from('organisations')
      .select('id, name, country, type')
      .order('name', { ascending: true })
      .limit(50)

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error fetching organisations:', error)
    throw error
  }
}

export async function setUserOrganisation(userId: string, organisationId: string | null) {
  const supabase = createClient()
  // if (!organisationId) {
  //   throw new Error('Organisation ID is required')
  // }
  try {
    const { data, error } = await supabase.rpc('admin_set_user_organisation', {
      target_user_id: userId,
      new_organisation_id: organisationId as string
    })

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error setting user organisation:', error)
    throw error
  }
}

export async function setUserRole(userId: string, role: UserRole, assignedBy?: string) {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.rpc('admin_set_user_role', {
      target_user_id: userId,
      new_role: role,
      assigned_by_user_id: assignedBy 
    })

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error setting user role:', error)
    throw error
  }
}
