import { z } from 'zod';
import type { Database } from '@/types/db';

// Base project form schema (extended from existing)
export const projectFormSchema = z.object({
  title: z.string().min(1, 'Project title is required').max(200, 'Title must be less than 200 characters'),
  summary: z.string().max(500, 'Summary must be less than 500 characters').optional(),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  status: z.enum(['planning', 'ongoing', 'completed', 'cancelled', 'on_hold']),
  location: z.string().max(200, 'Location must be less than 200 characters').optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  budget: z.number().min(0, 'Budget must be a positive number').optional(),
  currency: z.string().max(10, 'Currency code must be less than 10 characters').default('USD'),
  beneficiaries_count: z.number().min(0, 'Beneficiaries count must be a positive number').optional(),
  contact_person: z.string().max(100, 'Contact person name must be less than 100 characters').optional(),
  contact_email: z.string().email('Invalid email address').or(z.literal('')).optional(),
  contact_phone: z.string().max(20, 'Phone number must be less than 20 characters').optional(),
  project_website: z.string().url('Invalid website URL').or(z.literal('')).optional(),
  public_visibility: z.boolean().default(true),
  objectives: z.array(z.string().min(1, 'Objective cannot be empty')).max(10, 'Maximum 10 objectives allowed').optional(),
  outcomes: z.array(z.string().min(1, 'Outcome cannot be empty')).max(10, 'Maximum 10 outcomes allowed').optional(),
  sdg_goals: z.array(z.number().min(1).max(17)).max(17, 'Maximum 17 SDG goals allowed').optional(),
  featured: z.boolean().default(false),
  featured_image_url: z.string().optional(),
  gallery_images: z.array(z.string()).optional(),
  documents_urls: z.array(z.string()).optional(),
});

// Project media form schema
export const projectMediaFormSchema = z.object({
  file_url: z.string().min(1, 'File URL is required').optional(),
  file: z.instanceof(File).optional(),
  file_size: z.number().min(0, 'File size must be positive').optional(),
  file_type: z.enum(['image', 'pdf', 'video', 'audio', 'document', 'other']).optional(),
  mime_type: z.string().optional(),
  caption: z.string().max(500, 'Caption must be less than 500 characters').optional(),
  is_featured: z.boolean().default(false),
}).refine((data) => data.file || data.file_url, {
  path: ['file', 'file_url'],
  message: 'Either file or file URL must be provided',
});

// Project events form schema
export const projectEventFormSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  title: z.string().min(1, 'Event title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  event_type: z.string().max(100, 'Event type must be less than 100 characters').optional(),
  event_date: z.string().min(1, 'Event date is required'),
  event_end_date: z.string().optional(),
  event_location: z.string().max(300, 'Location must be less than 300 characters').optional(),
  is_virtual: z.boolean().default(false),
  meeting_link: z.string().url('Invalid meeting link').or(z.literal('')).optional(),
  registration_link: z.string().url('Invalid registration link').or(z.literal('')).optional(),
  registration_deadline: z.string().optional(),
  max_participants: z.number().min(1, 'Maximum participants must be at least 1').optional(),
  current_participants: z.number().min(0, 'Current participants must be positive').default(0),
  event_status: z.string().default('scheduled'),
  attachments: z.array(z.record(z.string(), z.unknown())).default([]),
  contact_person: z.string().max(100, 'Contact person name must be less than 100 characters').optional(),
  contact_email: z.string().email('Invalid email address').or(z.literal('')).optional(),
  tags: z.array(z.string()).optional(),
});

// Project milestones form schema
export const projectMilestoneFormSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  title: z.string().min(1, 'Milestone title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  due_date: z.string().optional(),
  completion_date: z.string().optional(),
  status: z.enum(['planned', 'in_progress', 'achieved', 'delayed', 'cancelled']).default('planned'),
  progress_percentage: z.number().min(0, 'Progress must be at least 0%').max(100, 'Progress cannot exceed 100%').default(0),
  deliverables: z.array(z.string().min(1, 'Deliverable cannot be empty')).optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  evidence_urls: z.array(z.string().url('Invalid evidence URL')).optional(),
  sort_order: z.number().default(0),
});

// Combined form schema for multi-section forms
export const projectFullFormSchema = z.object({
  project: projectFormSchema,
  media: z.array(projectMediaFormSchema).optional(),
  events: z.array(projectEventFormSchema).optional(),
  milestones: z.array(projectMilestoneFormSchema).optional(),
  cleanup_files: z.array(z.string()).optional(),
});

// Export types
export type ProjectFormData = z.infer<typeof projectFormSchema>;
export type ProjectMediaFormData = z.infer<typeof projectMediaFormSchema>;
export type ProjectEventFormData = z.infer<typeof projectEventFormSchema>;
export type ProjectMilestoneFormData = z.infer<typeof projectMilestoneFormSchema>;
export type ProjectFullFormData = z.infer<typeof projectFullFormSchema>;

// Transform functions for database inserts
export function transformProjectDataToInsert(
  formData: ProjectFormData,
  organisationId: string,
  userId: string
): Database['public']['Tables']['projects']['Insert'] {
  return {
    title: formData.title,
    summary: formData.summary || null,
    description: formData.description || null,
    status: formData.status as Database['public']['Enums']['project_status_enum'],
    location: formData.location || null,
    start_date: formData.start_date || null,
    end_date: formData.end_date || null,
    budget: formData.budget || null,
    currency: formData.currency,
    beneficiaries_count: formData.beneficiaries_count || null,
    contact_person: formData.contact_person || null,
    contact_email: formData.contact_email || null,
    contact_phone: formData.contact_phone || null,
    project_website: formData.project_website || null,
    public_visibility: formData.public_visibility,
    objectives: formData.objectives || null,
    outcomes: formData.outcomes || null,
    sdg_goals: formData.sdg_goals || null,
    featured: formData.featured,
    featured_image_url: formData.featured_image_url || null,
    gallery_images: formData.gallery_images || null,
    documents_urls: formData.documents_urls || null,
    organisation_id: organisationId,
    created_by: userId,
    language: 'English' as Database['public']['Enums']['language_enum'],
  };
}

export function transformProjectMediaDataToInsert(
  formData: ProjectMediaFormData,
  userId: string,
  projectId: string,
  index: number
): Database['public']['Tables']['project_media']['Insert'] {
  return {
    project_id: projectId,
    file_url: formData.file_url || '',
    file_name: formData.file?.name || '',
    file_size: formData.file_size || null,
    file_type: formData.file_type as Database['public']['Enums']['file_type_enum'],
    mime_type: formData.mime_type || null,
    caption: formData.caption || null,
    alt_text: formData.caption || null,
    is_featured: formData.is_featured,
    sort_order: index,
    uploaded_by: userId,
  };
}

export function transformProjectEventDataToInsert(
  formData: ProjectEventFormData
): Database['public']['Tables']['project_events']['Insert'] {
  return {
    project_id: formData.project_id,
    title: formData.title,
    description: formData.description || null,
    event_type: formData.event_type || null,
    event_date: formData.event_date,
    event_end_date: formData.event_end_date || null,
    event_location: formData.event_location || null,
    is_virtual: formData.is_virtual,
    meeting_link: formData.meeting_link || null,
    registration_link: formData.registration_link || null,
    registration_deadline: formData.registration_deadline || null,
    max_participants: formData.max_participants || null,
    current_participants: formData.current_participants,
    event_status: formData.event_status,
    attachments: (formData.attachments as Database['public']['Tables']['project_events']['Insert']['attachments']),
    contact_person: formData.contact_person || null,
    contact_email: formData.contact_email || null,
    tags: formData.tags || null,
  };
}

export function transformProjectMilestoneDataToInsert(
  formData: ProjectMilestoneFormData,
  userId: string
): Database['public']['Tables']['project_milestones']['Insert'] {
  return {
    project_id: formData.project_id,
    title: formData.title,
    description: formData.description || null,
    due_date: formData.due_date || null,
    completion_date: formData.completion_date || null,
    status: formData.status as Database['public']['Enums']['milestone_status_enum'],
    progress_percentage: formData.progress_percentage,
    deliverables: formData.deliverables || null,
    notes: formData.notes || null,
    evidence_urls: formData.evidence_urls || null,
    sort_order: formData.sort_order,
    created_by: userId,
  };
}

// SDG Goals data
export const SDG_GOALS = [
  { id: 1, title: 'No Poverty' },
  { id: 2, title: 'Zero Hunger' },
  { id: 3, title: 'Good Health and Well-being' },
  { id: 4, title: 'Quality Education' },
  { id: 5, title: 'Gender Equality' },
  { id: 6, title: 'Clean Water and Sanitation' },
  { id: 7, title: 'Affordable and Clean Energy' },
  { id: 8, title: 'Decent Work and Economic Growth' },
  { id: 9, title: 'Industry, Innovation and Infrastructure' },
  { id: 10, title: 'Reduced Inequality' },
  { id: 11, title: 'Sustainable Cities and Communities' },
  { id: 12, title: 'Responsible Consumption and Production' },
  { id: 13, title: 'Climate Action' },
  { id: 14, title: 'Life Below Water' },
  { id: 15, title: 'Life on Land' },
  { id: 16, title: 'Peace and Justice Strong Institutions' },
  { id: 17, title: 'Partnerships to achieve the Goal' },
];

// Event types
export const EVENT_TYPES = [
  'Workshop',
  'Training',
  'Conference',
  'Meeting',
  'Launch',
  'Presentation',
  'Community Outreach',
  'Fundraiser',
  'Celebration',
  'Other',
];

// Event status options
export const EVENT_STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'postponed', label: 'Postponed' },
];

// Milestone status options
export const MILESTONE_STATUS_OPTIONS = [
  { value: 'planned', label: 'Planned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'achieved', label: 'Achieved' },
  { value: 'delayed', label: 'Delayed' },
  { value: 'cancelled', label: 'Cancelled' },
];
