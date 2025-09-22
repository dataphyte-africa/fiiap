import { z } from 'zod';

// Events Form Schema
export const eventFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  event_date: z.string().min(1, 'Event date is required'),
  event_end_date: z.string().optional(),
  location: z.string().max(200, 'Location must be less than 200 characters').optional(),
  venue_name: z.string().max(100, 'Venue name must be less than 100 characters').optional(),
  registration_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  meeting_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  event_website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  event_type: z.enum(['conference', 'workshop', 'webinar', 'training', 'seminar', 'networking', 'fundraiser', 'other']).optional(),
  is_virtual: z.boolean().default(false),
  contact_person: z.string().max(100, 'Contact person name must be less than 100 characters').optional(),
  contact_email: z.string().email('Invalid email').optional().or(z.literal('')),
  contact_phone: z.string().max(20, 'Phone number must be less than 20 characters').optional(),
  tags: z.string().max(500, 'Tags must be less than 500 characters').optional(),
  max_participants: z.number().min(1, 'Must be at least 1').max(10000, 'Cannot exceed 10,000').optional(),
  is_visible: z.boolean().default(true),
  is_featured: z.boolean().default(false),
});

// Resource Library Form Schema
export const resourceLibraryFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  resource_type: z.enum(['toolkit', 'research_paper', 'guide', 'template', 'video', 'document', 'report', 'other']),
  file_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  author_name: z.string().max(100, 'Author name must be less than 100 characters').optional(),
  tags: z.string().max(500, 'Tags must be less than 500 characters').optional(),
  is_visible: z.boolean().default(true),
  is_featured: z.boolean().default(false),
});

// Online Course Form Schema
export const onlineCourseFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  instructor_name: z.string().max(100, 'Instructor name must be less than 100 characters').optional(),
  course_url: z.string().url('Course URL is required'),
  platform_name: z.string().max(100, 'Platform name must be less than 100 characters').default('FIAP Learning Platform').optional(),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  duration_hours: z.number().min(0, 'Duration must be positive').max(1000, 'Duration cannot exceed 1000 hours').optional(),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  tags: z.string().max(500, 'Tags must be less than 500 characters').optional(),
  is_visible: z.boolean().default(true),
  is_featured: z.boolean().default(false),
});

// Funding Opportunities Form Schema
export const fundingOpportunityFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  slug: z.string().min(1, 'Slug is required').max(200, 'Slug must be less than 200 characters'),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  summary: z.string().max(500, 'Summary must be less than 500 characters').optional(),
  opportunity_type: z.enum(['grant', 'fellowship', 'donor_call', 'scholarship', 'award', 'loan', 'other']),
  status: z.enum(['open', 'closing_soon', 'closed', 'postponed', 'cancelled']).default('open'),
  funding_amount_min: z.number().min(0, 'Amount must be positive').optional(),
  funding_amount_max: z.number().min(0, 'Amount must be positive').optional(),
  currency: z.string().max(10, 'Currency code must be less than 10 characters').default('USD'),
  funding_duration_months: z.number().min(1, 'Duration must be at least 1 month').max(120, 'Duration cannot exceed 120 months').optional(),
  funding_period_start: z.string().optional().nullable(),
  funding_period_end: z.string().optional().nullable(),
  application_deadline: z.string().optional().nullable(),
  application_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  application_requirements: z.string().max(2000, 'Requirements must be less than 2000 characters').optional().nullable(),
  eligibility_criteria: z.string().max(2000, 'Criteria must be less than 2000 characters').optional().nullable(),
  selection_criteria: z.string().max(2000, 'Selection criteria must be less than 2000 characters').optional().nullable(),
  geographic_focus: z.string().max(500, 'Geographic focus must be less than 500 characters').optional().nullable(),
  target_countries: z.string().max(500, 'Target countries must be less than 500 characters').optional(),
  thematic_areas: z.string().max(500, 'Thematic areas must be less than 500 characters').optional().nullable(),
  target_populations: z.string().max(500, 'Target populations must be less than 500 characters').optional().nullable(),
  funder_name: z.string().min(1, 'Funder name is required').max(200, 'Funder name must be less than 200 characters'),
  funder_type: z.enum(['government', 'foundation', 'ngo', 'international_organization', 'private_corporation', 'multilateral_agency', 'bilateral_agency', 'university', 'research_institute', 'other']).optional(),
  funder_website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  funder_logo_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  funder_contact_email: z.string().email('Invalid email').optional().or(z.literal('')).nullable(),
  funder_contact_person: z.string().max(100, 'Contact person name must be less than 100 characters').optional().nullable(),
  funder_description: z.string().max(1000, 'Funder description must be less than 1000 characters').optional().nullable(),
  featured_image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  tags: z.string().max(500, 'Tags must be less than 500 characters').optional(),
  language: z.enum(['English', 'French']).default('English'),
  is_featured: z.boolean().default(false),
  is_visible: z.boolean().default(true),
  is_verified: z.boolean().default(false),
}).refine((data) => {
  // Validate that min amount is not greater than max amount
  if (data.funding_amount_min && data.funding_amount_max) {
    return data.funding_amount_min <= data.funding_amount_max;
  }
  return true;
}, {
  message: "Minimum amount cannot be greater than maximum amount",
  path: ["funding_amount_max"],
});

// Export types
export type EventFormData = z.infer<typeof eventFormSchema>;
export type ResourceLibraryFormData = z.infer<typeof resourceLibraryFormSchema>;
export type OnlineCourseFormData = z.infer<typeof onlineCourseFormSchema>;
export type FundingOpportunityFormData = z.infer<typeof fundingOpportunityFormSchema>;

