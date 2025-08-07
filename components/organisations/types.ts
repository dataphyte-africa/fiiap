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
  other_countries?: string[]
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
  geographic_coverage?: string
}

export interface OrganisationalDetailsFormData {
  mission?: string
  vision?: string
  thematic_focus?: string[]
  staff_count?: number
  volunteer_count?: number
  partnerships?: string[]
  awards_recognition?: string[]
  target_populations?: Database['public']['Enums']['target_population_enum'][]
  primary_work_methods?: Database['public']['Enums']['work_method_enum'][]
  operational_levels?: string[]
  network_memberships?: string[]
  has_digital_tools?: boolean
  digital_tools?: DigitalTool[]
}

// Digital tools interface
export interface DigitalTool {
  name: string
  description?: string
  category: string
  url?: string
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
  media_platforms?: string[]
  media_work_types?: string[]
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
    .optional(),
  other_countries: z.array(z.string()).optional()
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
  })).optional(),
  geographic_coverage: z.string().max(500, 'Geographic coverage description must be less than 500 characters').optional()
})

export const detailsSchema = z.object({
  mission: z.string().max(500, 'Mission statement must be less than 500 characters').optional(),
  vision: z.string().max(500, 'Vision statement must be less than 500 characters').optional(),
  thematic_focus: z.array(z.string()).optional(),
  staff_count: z.number().min(0, 'Staff count cannot be negative').optional(),
  volunteer_count: z.number().min(0, 'Volunteer count cannot be negative').optional(),
  partnerships: z.array(z.string()).optional(),
  awards_recognition: z.array(z.string()).optional(),
  target_populations: z.array(z.enum([
    'youth', 'women', 'people_living_with_disability', 'children', 'adolescents', 'men', 
    'older_persons', 'students', 'faith_leaders', 'traditional_leaders', 'community_leaders',
    'policy_makers', 'journalists_media', 'researchers', 'civil_society_organizations',
    'minority_groups', 'vulnerable_groups', 'idps_refugees', 'prisoners', 'consumers',
    'general_public', 'voting_population', 'out_of_school_children', 'rural_populations',
    'marginalized_communities', 'other'
  ])).optional(),
  primary_work_methods: z.array(z.enum([
    'production_reports_policies', 'fact_checking', 'data_collection_analysis',
    'advocacy_awareness_campaigns', 'training_capacity_building', 'social_dialogue_community_dialogue',
    'organizing_conferences_seminars', 'election_monitoring_observation', 'networking_partnerships',
    'documentation_needs_assessment', 'consultancy_outreach_support', 'media_content_production',
    'mobile_app_development', 'summer_coaching_camps', 'skill_acquisition_training',
    'deradicalization_empowerment', 'child_protection_services', 'other'
  ])).optional(),
  operational_levels: z.array(z.string()).optional(),
  network_memberships: z.array(z.string()).optional(),
  has_digital_tools: z.boolean().optional(),
  digital_tools: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    category: z.string(),
    url: z.string().optional()
  })).optional()
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
  cover_image_file: z.instanceof(File).optional(),
  media_platforms: z.array(z.string()).optional(),
  media_work_types: z.array(z.string()).optional()
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

// Target populations options
export const TARGET_POPULATIONS: Database['public']['Enums']['target_population_enum'][] = [
  'youth', 'women', 'people_living_with_disability', 'children', 'adolescents', 'men',
  'older_persons', 'students', 'faith_leaders', 'traditional_leaders', 'community_leaders',
  'policy_makers', 'journalists_media', 'researchers', 'civil_society_organizations',
  'minority_groups', 'vulnerable_groups', 'idps_refugees', 'prisoners', 'consumers',
  'general_public', 'voting_population', 'out_of_school_children', 'rural_populations',
  'marginalized_communities', 'other'
]

// Work methods options
export const WORK_METHODS: Database['public']['Enums']['work_method_enum'][] = [
  'production_reports_policies', 'fact_checking', 'data_collection_analysis',
  'advocacy_awareness_campaigns', 'training_capacity_building', 'social_dialogue_community_dialogue',
  'organizing_conferences_seminars', 'election_monitoring_observation', 'networking_partnerships',
  'documentation_needs_assessment', 'consultancy_outreach_support', 'media_content_production',
  'mobile_app_development', 'summer_coaching_camps', 'skill_acquisition_training',
  'deradicalization_empowerment', 'child_protection_services', 'other'
]

// Operational levels options
export const OPERATIONAL_LEVELS = [
  'Community', 'Local', 'District', 'State/Provincial', 'National', 'Regional', 'International'
]

// Media platforms options
export const MEDIA_PLATFORMS = [
  'Facebook', 'Twitter/X', 'Instagram', 'LinkedIn', 'YouTube', 'TikTok', 'WhatsApp',
  'Telegram', 'Website/Blog', 'Newsletter', 'Podcast', 'Radio', 'Television', 'Print Media'
]

// Media work types options
export const MEDIA_WORK_TYPES = [
  'News Reporting', 'Documentary Production', 'Social Media Content', 'Blog Writing',
  'Video Production', 'Photography', 'Podcast Production', 'Radio Shows', 'Print Publications',
  'Digital Campaigns', 'Infographics', 'Animation', 'Live Streaming', 'Community Journalism'
]

// Digital tool categories
export const DIGITAL_TOOL_CATEGORIES = [
  'Communication & Messaging',
  'Project Management',
  'Data Collection & Analysis',
  'Financial Management',
  'Social Media Management',
  'Content Creation',
  'Video Conferencing',
  'Document Management',
  'Survey & Forms',
  'Website & CMS',
  'Email Marketing',
  'Learning Management',
  'Security & Privacy',
  'Other'
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

// Country interface for REST Countries API
export interface Country {
  name: {
    common: string
    official: string
  }
} 