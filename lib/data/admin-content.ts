import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/db";

// Type definitions
type Event = Database['public']['Tables']['events']['Row'];
type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventUpdate = Database['public']['Tables']['events']['Update'];

type ResourceLibrary = Database['public']['Tables']['resource_library']['Row'];
type ResourceLibraryInsert = Database['public']['Tables']['resource_library']['Insert'];
type ResourceLibraryUpdate = Database['public']['Tables']['resource_library']['Update'];

type OnlineCourse = Database['public']['Tables']['online_courses']['Row'];
type OnlineCourseInsert = Database['public']['Tables']['online_courses']['Insert'];
type OnlineCourseUpdate = Database['public']['Tables']['online_courses']['Update'];

// Common filter and result interfaces
export interface BaseFilters {
  search?: string;
  is_visible?: boolean;
  is_featured?: boolean;
  sortBy?: 'title' | 'created_at' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ========== EVENTS ==========

export interface EventFilters extends BaseFilters {
  event_type?: string;
  is_virtual?: boolean;
  upcoming_only?: boolean;
}

export async function getEvents(filters: EventFilters = {}): Promise<PaginatedResult<Event>> {
  const supabase = createClient();
  
  const {
    search,
    event_type,
    is_virtual,
    is_visible,
    is_featured,
    upcoming_only,
    sortBy = 'created_at',
    sortOrder = 'desc',
    page = 1,
    limit = 12
  } = filters;

  let query = supabase.from('events').select('*', { count: 'exact' });

  // Apply filters
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tags.ilike.%${search}%`);
  }
  if (event_type) {
    query = query.eq('event_type', event_type);
  }
  if (typeof is_virtual === 'boolean') {
    query = query.eq('is_virtual', is_virtual);
  }
  if (typeof is_visible === 'boolean') {
    query = query.eq('is_visible', is_visible);
  }
  if (typeof is_featured === 'boolean') {
    query = query.eq('is_featured', is_featured);
  }
  if (upcoming_only) {
    query = query.gte('event_date', new Date().toISOString());
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Apply pagination
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

export async function getEventById(id: string): Promise<Event | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createEvent(eventData: EventInsert): Promise<Event> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEvent(id: string, eventData: EventUpdate): Promise<Event> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('events')
    .update(eventData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ========== RESOURCE LIBRARY ==========

export interface ResourceLibraryFilters extends BaseFilters {
  resource_type?: string;
  author_name?: string;
}

export async function getResourceLibrary(filters: ResourceLibraryFilters = {}): Promise<PaginatedResult<ResourceLibrary>> {
  const supabase = createClient();
  
  const {
    search,
    resource_type,
    author_name,
    is_visible,
    is_featured,
    sortBy = 'created_at',
    sortOrder = 'desc',
    page = 1,
    limit = 12
  } = filters;

  let query = supabase.from('resource_library').select('*', { count: 'exact' });

  // Apply filters
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tags.ilike.%${search}%,author_name.ilike.%${search}%`);
  }
  if (resource_type) {
    query = query.eq('resource_type', resource_type);
  }
  if (author_name) {
    query = query.ilike('author_name', `%${author_name}%`);
  }
  if (typeof is_visible === 'boolean') {
    query = query.eq('is_visible', is_visible);
  }
  if (typeof is_featured === 'boolean') {
    query = query.eq('is_featured', is_featured);
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Apply pagination
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

export async function getResourceById(id: string): Promise<ResourceLibrary | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('resource_library')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createResource(resourceData: ResourceLibraryInsert): Promise<ResourceLibrary> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('resource_library')
    .insert(resourceData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateResource(id: string, resourceData: ResourceLibraryUpdate): Promise<ResourceLibrary> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('resource_library')
    .update(resourceData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteResource(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('resource_library')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ========== ONLINE COURSES ==========

export interface OnlineCourseFilters extends BaseFilters {
  difficulty_level?: string;
  instructor_name?: string;
  platform_name?: string;
}

export async function getOnlineCourses(filters: OnlineCourseFilters = {}): Promise<PaginatedResult<OnlineCourse>> {
  const supabase = createClient();
  
  const {
    search,
    difficulty_level,
    instructor_name,
    platform_name,
    is_visible,
    is_featured,
    sortBy = 'created_at',
    sortOrder = 'desc',
    page = 1,
    limit = 12
  } = filters;

  let query = supabase.from('online_courses').select('*', { count: 'exact' });

  // Apply filters
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tags.ilike.%${search}%,instructor_name.ilike.%${search}%`);
  }
  if (difficulty_level) {
    query = query.eq('difficulty_level', difficulty_level);
  }
  if (instructor_name) {
    query = query.ilike('instructor_name', `%${instructor_name}%`);
  }
  if (platform_name) {
    query = query.ilike('platform_name', `%${platform_name}%`);
  }
  if (typeof is_visible === 'boolean') {
    query = query.eq('is_visible', is_visible);
  }
  if (typeof is_featured === 'boolean') {
    query = query.eq('is_featured', is_featured);
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Apply pagination
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

export async function getCourseById(id: string): Promise<OnlineCourse | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('online_courses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createCourse(courseData: OnlineCourseInsert): Promise<OnlineCourse> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('online_courses')
    .insert(courseData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCourse(id: string, courseData: OnlineCourseUpdate): Promise<OnlineCourse> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('online_courses')
    .update(courseData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCourse(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('online_courses')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
