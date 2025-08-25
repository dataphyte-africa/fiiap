import { z } from 'zod';
import type { Database } from '@/types/db';

// Project creation form schema
export const createProjectSchema = z.object({
  title: z.string().min(1, 'Project title is required').max(200, 'Title must be less than 200 characters'),
  summary: z.string().max(500, 'Summary must be less than 500 characters').optional(),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  status: z.enum(['planning', 'ongoing', 'completed', 'cancelled', 'on_hold']),
  location: z.string().max(200, 'Location must be less than 200 characters').optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  budget: z.number().min(0, 'Budget must be a positive number').optional(),
  currency: z.string().max(10, 'Currency code must be less than 10 characters'),
  beneficiaries_count: z.number().min(0, 'Beneficiaries count must be a positive number').optional(),
  contact_person: z.string().max(100, 'Contact person name must be less than 100 characters').optional(),
  contact_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  contact_phone: z.string().max(20, 'Phone number must be less than 20 characters').optional(),
  project_website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  public_visibility: z.boolean(),
  objectives: z.array(z.string().min(1, 'Objective cannot be empty')).max(10, 'Maximum 10 objectives allowed').optional(),
  sdg_goals: z.array(z.number().min(1).max(17)).max(17, 'Maximum 17 SDG goals allowed').optional(),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;

// Transform form data to database insert format
export function transformFormDataToInsert(
  formData: CreateProjectFormData,
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
    sdg_goals: formData.sdg_goals || null,
    organisation_id: organisationId,
    created_by: userId,
    language: 'English' as Database['public']['Enums']['language_enum'],
  };
}
