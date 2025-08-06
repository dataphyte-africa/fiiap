import { Database } from '@/types/db'
import { z } from 'zod'

export type Organisation = Database['public']['Tables']['organisations']['Row']
export type OrganisationInsert = Database['public']['Tables']['organisations']['Insert']

// Form step data types
export interface BasicInfoFormData {
  name: string
  type: Database['public']['Enums']['organisation_type_enum']
  size: Database['public']['Enums']['organisation_size_enum']
  country: Database['public']['Enums']['country_enum']
  registration_number?: string
  establishment_year?: number
}

export interface ContactInfoFormData {
  contact_email?: string
  contact_phone?: string
  website_url?: string
  address?: string
  region?: string
  state_province?: string
  city?: string
  social_links?: Record<string, string>
  languages_spoken?: Database['public']['Enums']['language_enum'][]
}

export interface OrganisationalDetailsFormData {
  mission?: string
  vision?: string
  thematic_focus?: string[]
  staff_count?: number
  volunteer_count?: number
  partnerships?: string[]
  awards_recognition?: string[]
}

export interface LegalFinancialFormData {
  legal_status?: string
  tax_exemption_status?: boolean
  certifications?: string[]
  annual_budget?: number
}

export interface MediaFormData {
  logo_url?: string
  cover_image_url?: string
  media_uploads?: Record<string, unknown>[]
  logo_file?: File
  cover_image_file?: File
}

// Complete form data combining all steps
export interface OrganisationFormData extends 
  BasicInfoFormData,
  ContactInfoFormData,
  OrganisationalDetailsFormData,
  LegalFinancialFormData,
  MediaFormData {}

// Zod validation schemas
export const basicInfoSchema = z.object({
  name: z.string().min(2, 'Organisation name must be at least 2 characters').max(255, 'Name too long'),
  type: z.enum(['NGO', 'CBO', 'Network', 'Foundation', 'Coalition', 'Association', 'Cooperative', 'Other'], {
    message: 'Please select an organisation type'
  }),
  size: z.enum(['Local', 'National', 'Regional', 'International'], {
    message: 'Please select organisation size'
  }),
  country: z.enum(['Nigeria', 'Benin', 'Gambia'], {
    message: 'Please select your country'
  }),
  registration_number: z.string().optional(),
  establishment_year: z.number()
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear(), 'Year cannot be in the future')
    .optional()
})

export const contactInfoSchema = z.object({
  contact_email: z.union([z.string().email('Invalid email address'), z.literal('')]).optional(),
  contact_phone: z.string().optional(),
  website_url: z.union([z.string().url('Invalid URL'), z.literal('')]).optional(),
  address: z.string().optional(),
  region: z.string().optional(),
  state_province: z.string().optional(),
  city: z.string().optional(),
  social_links: z.record(z.string(), z.string()).optional(),
  languages_spoken: z.array(z.enum(['English', 'French'], {
    message: 'Please select valid languages'
  })).optional()
})

export const detailsSchema = z.object({
  mission: z.string().max(500, 'Mission statement must be less than 500 characters').optional(),
  vision: z.string().max(500, 'Vision statement must be less than 500 characters').optional(),
  thematic_focus: z.array(z.string()).optional(),
  staff_count: z.number().min(0, 'Staff count cannot be negative').optional(),
  volunteer_count: z.number().min(0, 'Volunteer count cannot be negative').optional(),
  partnerships: z.array(z.string()).optional(),
  awards_recognition: z.array(z.string()).optional()
})

export const legalFinancialSchema = z.object({
  legal_status: z.string().optional(),
  tax_exemption_status: z.boolean().optional(),
  certifications: z.array(z.string()).optional(),
  annual_budget: z.number().min(0, 'Budget cannot be negative').optional()
})

export const mediaSchema = z.object({
  logo_url: z.union([z.string().url('Invalid URL'), z.literal('')]).optional(),
  cover_image_url: z.union([z.string().url('Invalid URL'), z.literal('')]).optional(),
  media_uploads: z.array(z.record(z.string(), z.unknown())).optional(),
  logo_file: z.instanceof(File).optional(),
  cover_image_file: z.instanceof(File).optional()
})

// Complete form schema
export const organisationFormSchema = basicInfoSchema
  .merge(contactInfoSchema)
  .merge(detailsSchema)
  .merge(legalFinancialSchema)
  .merge(mediaSchema)

// Form step configuration
export interface FormStep {
  id: string
  title: string
  description: string
  component: React.ComponentType<FormStepProps>
}

export interface FormStepProps {
  onNext: () => void
  onPrev: () => void
  isFirstStep: boolean
  isLastStep: boolean
  currentStep: number
  totalSteps: number
}

// Available options for select fields
export const ORGANISATION_TYPES: Database['public']['Enums']['organisation_type_enum'][] = [
  'NGO', 'CBO', 'Network', 'Foundation', 'Coalition', 'Association', 'Cooperative', 'Other'
]

export const ORGANISATION_SIZES: Database['public']['Enums']['organisation_size_enum'][] = [
  'Local', 'National', 'Regional', 'International'
]

export const COUNTRIES: Database['public']['Enums']['country_enum'][] = [
  'Nigeria', 'Benin', 'Gambia'
]

export const LANGUAGES: Database['public']['Enums']['language_enum'][] = [
  'English', 'French'
]

// Common thematic focus areas
export const THEMATIC_AREAS = [
  'Health',
  'Education', 
  'Human Rights',
  'Environment',
  'Agriculture',
  'Gender Equality',
  'Youth Development',
  'Governance',
  'Economic Development',
  'Social Services',
  'Climate Change',
  'Poverty Alleviation',
  'Community Development',
  'Advocacy',
  'Capacity Building'
] 