import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/db";

// Type definitions
type Event = Database['public']['Tables']['events']['Row'];
type ResourceLibrary = Database['public']['Tables']['resource_library']['Row'];
type OnlineCourse = Database['public']['Tables']['online_courses']['Row'];

// Common interfaces
export interface PublicContentFilters {
  search?: string;
  type?: string;
  featured?: boolean;
  is_virtual?: boolean;
  limit?: number;
  page?: number;
}

export interface PaginatedPublicResult<T> {
  data: T[];
  count: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ========== PUBLIC EVENTS ==========

export async function getPublicEvents(filters: PublicContentFilters = {}): Promise<PaginatedPublicResult<Event>> {
  const supabase = await createClient();
  
  const {
    search,
    type,
    featured,
    is_virtual,
    limit = 12,
    page = 1
  } = filters;

  let query = supabase
    .from('events')
    .select('*', { count: 'exact' })
    .eq('is_visible', true)
    .gte('event_date', new Date().toISOString()); // Only upcoming events

  // Apply filters
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tags.ilike.%${search}%`);
  }
  if (type) {
    query = query.eq('event_type', type);
  }
  if (typeof featured === 'boolean') {
    query = query.eq('is_featured', featured);
  }
  if (typeof is_virtual === 'boolean') {
    query = query.eq('is_virtual', is_virtual);
  }

  // Apply sorting and pagination
  query = query.order('event_date', { ascending: true });
  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) throw error;

  const totalPages = Math.ceil((count || 0) / limit);

  return {
    data: data || [],
    count: count || 0,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export async function getFeaturedEvents(): Promise<Event[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_visible', true)
    .eq('is_featured', true)
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true })
    .limit(5);

  if (error) throw error;
  return data || [];
}

export async function getEventById(id: string): Promise<Event | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('is_visible', true)
    .single();

  if (error) return null;
  return data;
}

// ========== PUBLIC RESOURCE LIBRARY ==========

export async function getPublicResources(filters: PublicContentFilters = {}): Promise<PaginatedPublicResult<ResourceLibrary>> {
  const supabase = await createClient();
  
  const {
    search,
    type,
    featured,
    limit = 12,
    page = 1
  } = filters;

  let query = supabase
    .from('resource_library')
    .select('*', { count: 'exact' })
    .eq('is_visible', true);

  // Apply filters
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tags.ilike.%${search}%,author_name.ilike.%${search}%`);
  }
  if (type) {
    query = query.eq('resource_type', type);
  }
  if (typeof featured === 'boolean') {
    query = query.eq('is_featured', featured);
  }

  // Apply sorting and pagination
  query = query.order('created_at', { ascending: false });
  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) throw error;

  const totalPages = Math.ceil((count || 0) / limit);

  return {
    data: data || [],
    count: count || 0,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export async function getFeaturedResources(): Promise<ResourceLibrary[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('resource_library')
    .select('*')
    .eq('is_visible', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) throw error;
  return data || [];
}

export async function getResourceById(id: string): Promise<ResourceLibrary | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('resource_library')
    .select('*')
    .eq('id', id)
    .eq('is_visible', true)
    .single();

  if (error) return null;
  return data;
}

// ========== PUBLIC ONLINE COURSES ==========

export async function getPublicCourses(filters: PublicContentFilters = {}): Promise<PaginatedPublicResult<OnlineCourse>> {
  const supabase = await createClient();
  
  const {
    search,
    type, // difficulty_level
    featured,
    limit = 12,
    page = 1
  } = filters;

  let query = supabase
    .from('online_courses')
    .select('*', { count: 'exact' })
    .eq('is_visible', true);

  // Apply filters
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tags.ilike.%${search}%,instructor_name.ilike.%${search}%`);
  }
  if (type) {
    query = query.eq('difficulty_level', type);
  }
  if (typeof featured === 'boolean') {
    query = query.eq('is_featured', featured);
  }

  // Apply sorting and pagination
  query = query.order('created_at', { ascending: false });
  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) throw error;

  const totalPages = Math.ceil((count || 0) / limit);

  return {
    data: data || [],
    count: count || 0,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export async function getFeaturedCourses(): Promise<OnlineCourse[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('online_courses')
    .select('*')
    .eq('is_visible', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) throw error;
  return data || [];
}

export async function getCourseById(id: string): Promise<OnlineCourse | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('online_courses')
    .select('*')
    .eq('id', id)
    .eq('is_visible', true)
    .single();

  if (error) return null;
  return data;
}

// ========== HELPER FUNCTIONS ==========

export function formatEventDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Invalid date';
  }
}

export function formatEventDateShort(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Invalid date';
  }
}
