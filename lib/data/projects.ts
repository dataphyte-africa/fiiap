import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/db";

type Project = Database['public']['Tables']['projects']['Row'];
type Organisation = Database['public']['Tables']['organisations']['Row'];

export interface ProjectWithOrganisation extends Project {
  organisations: Pick<Organisation, 'id' | 'name' | 'logo_url'> | null;
}

export interface ProjectFilters {
  organisation_id?: string;
  status?: Database["public"]["Enums"]["project_status_enum"];
  search?: string;
  sortBy?: 'title' | 'created_at' | 'updated_at' | 'start_date';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProjectsResult {
  data: ProjectWithOrganisation[];
  count: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export async function getProjects(filters: ProjectFilters = {}): Promise<ProjectsResult> {
  const supabase = createClient();
  
  const {
    organisation_id,
    status,
    search,
    sortBy = 'created_at',
    sortOrder = 'desc',
    page = 1,
    limit = 12
  } = filters;

  let query = supabase
    .from('projects')
    .select(`
      *,
      organisations!projects_organisation_id_fkey (
        id,
        name,
        logo_url
      )
    `, { count: 'exact' });

  // Apply organisation filter
  if (organisation_id) {
    query = query.eq('organisation_id', organisation_id);
  }

  // Apply status filter
  if (status) {
    query = query.eq('status', status);
  }

  // Apply search filter
  if (search && search.trim()) {
    query = query.or(`title.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%,summary.ilike.%${search.trim()}%`);
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching projects:', error);
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

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

export async function getProjectById(id: string): Promise<ProjectWithOrganisation | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      organisations!projects_organisation_id_fkey (
        id,
        name,
        logo_url
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    throw new Error(`Failed to fetch project: ${error.message}`);
  }

  return data;
}

export interface ProjectWithDetails extends Project {
  organisations: Pick<Organisation, 'id' | 'name' | 'logo_url'> | null;
  project_media: Array<{
    id: string;
    file_url: string;
    file_name: string | null;
    file_type: Database['public']['Enums']['file_type_enum'];
    caption: string | null;
    is_featured: boolean | null;
    sort_order: number | null;
  }>;
  project_events: Array<{
    id: string;
    title: string;
    description: string | null;
    event_type: string | null;
    event_date: string;
    event_end_date: string | null;
    event_location: string | null;
    is_virtual: boolean | null;
    event_status: string | null;
  }>;
  project_milestones: Array<{
    id: string;
    title: string;
    description: string | null;
    due_date: string | null;
    completion_date: string | null;
    status: Database['public']['Enums']['milestone_status_enum'] | null;
    progress_percentage: number | null;
    deliverables: string[] | null;
    sort_order: number | null;
  }>;
}

export async function getProjectsByOrganisationId(organisationId: string): Promise<ProjectWithDetails[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      organisations!projects_organisation_id_fkey (
        id,
        name,
        logo_url
      ),
      project_media (
        id,
        file_url,
        file_name,
        file_type,
        caption,
        is_featured,
        sort_order
      ),
      project_events (
        id,
        title,
        description,
        event_type,
        event_date,
        event_end_date,
        event_location,
        is_virtual,
        event_status
      ),
      project_milestones (
        id,
        title,
        description,
        due_date,
        completion_date,
        status,
        progress_percentage,
        deliverables,
        sort_order
      )
    `)
    .eq('organisation_id', organisationId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects by organisation:', error);
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  // Sort nested arrays
  return (data || []).map(project => ({
    ...project,
    project_media: (project.project_media || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
    project_events: (project.project_events || []).sort((a, b) => 
      new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    ),
    project_milestones: (project.project_milestones || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
  }));
}

export async function getProjectsForUserOrganisation(organisationId: string): Promise<ProjectWithOrganisation[]> {
  const supabase = createClient();

  

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      organisations!projects_organisation_id_fkey (
        id,
        name,
        logo_url
      )
    `)
    .eq('organisation_id', organisationId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching organisation projects:', error);
    throw new Error(`Failed to fetch organisation projects: ${error.message}`);
  }

  return data || [];
}

export async function createProject(projectData: Database['public']['Tables']['projects']['Insert']): Promise<ProjectWithOrganisation> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .insert(projectData)
    .select(`
      *,
      organisations!projects_organisation_id_fkey (
        id,
        name,
        logo_url
      )
    `)
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw new Error(`Failed to create project: ${error.message}`);
  }

  return data;
}

export async function updateProject(projectId: string, projectData: Database['public']['Tables']['projects']['Update']) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('projects')
    .update(projectData)
    .eq('id', projectId)

  if (error) {
    console.error('Error updating project:', error);
    throw new Error(`Failed to update project: ${error.message}`);
  }
  return data;
}

export async function updateProjectMedia(projectId: string, mediaData: Database['public']['Tables']['project_media']['Insert'][]) {
  const supabase = createClient();
  const { error } = await supabase
    .from('project_media').delete().eq('project_id', projectId)

  if (error) {
    console.error('Error deleting project media:', error);
    throw new Error(`Failed to delete project media: ${error.message}`);
  }

  const { error: insertError } = await supabase
    .from('project_media')
    .insert(mediaData)
  

  if (insertError) {
    console.error('Error inserting project media:', insertError);
    throw new Error(`Failed to insert project media: ${insertError.message}`);
  }

  return;
}

export async function updateProjectEvents(projectId: string, eventsData: Database['public']['Tables']['project_events']['Insert'][]) {
  const supabase = createClient();
  const { error } = await supabase
    .from('project_events').delete().eq('project_id', projectId)
  
  if (error) {
    console.error('Error deleting project events:', error);
    throw new Error(`Failed to delete project events: ${error.message}`);
  }

  const { error: insertError } = await supabase
    .from('project_events')
    .insert(eventsData)
  

  if (insertError) {
    console.error('Error inserting project events:', insertError);
    throw new Error(`Failed to insert project events: ${insertError.message}`);
  }

  return;
}

export async function updateProjectMilestones(projectId: string, milestonesData: Database['public']['Tables']['project_milestones']['Insert'][]) {
  const supabase = createClient();
  const { error } = await supabase
    .from('project_milestones').delete().eq('project_id', projectId)

  if (error) {
    console.error('Error deleting project milestones:', error);
    throw new Error(`Failed to delete project milestones: ${error.message}`);
  }

  const { error: insertError } = await supabase
    .from('project_milestones')
    .insert(milestonesData)

  if (insertError) {
    console.error('Error inserting project milestones:', insertError);
    throw new Error(`Failed to insert project milestones: ${insertError.message}`);
  }

  return;
}


// Helper function to format project status for display
export function formatProjectStatus(status: Database["public"]["Enums"]["project_status_enum"] | null): string {
  if (!status) return 'Unknown';
  
  const statusMap = {
    planning: 'Planning',
    ongoing: 'Ongoing',
    completed: 'Completed',
    cancelled: 'Cancelled',
    on_hold: 'On Hold',
  };
  
  return statusMap[status] || status;
}

// Helper function to get status color for badges
export function getProjectStatusColor(status: Database["public"]["Enums"]["project_status_enum"] | null): string {
  if (!status) return 'secondary';
  
  const colorMap = {
    planning: 'blue',
    ongoing: 'green',
    completed: 'emerald',
    cancelled: 'red',
    on_hold: 'yellow',
  };
  
  return colorMap[status] || 'secondary';
}
