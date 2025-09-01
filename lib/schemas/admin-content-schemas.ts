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

// Export types
export type EventFormData = z.infer<typeof eventFormSchema>;
export type ResourceLibraryFormData = z.infer<typeof resourceLibraryFormSchema>;
export type OnlineCourseFormData = z.infer<typeof onlineCourseFormSchema>;
