# Organisation Registration Components

This directory contains a comprehensive multi-step form system for CSO (Civil Society Organisation) registration and editing, built with React Hook Form, Zod validation, TypeScript, and Supabase integration with file upload support.

## Overview

The organisation registration form is divided into 5 logical steps:

1. **Basic Information** - Organisation name, type, size, country, registration details
2. **Contact Information** - Email, phone, website, address, social media links
3. **Organizational Details** - Mission, vision, thematic focus areas, team size
4. **Legal & Financial** - Legal status, certifications, tax exemption, budget
5. **Media & Documents** - Logo, cover image, and file upload instructions

## Components

### Form Components

- **`OrganisationRegistrationForm`** - Main form container with step navigation
- **`BasicInfoStep`** - Step 1: Basic organisation information
- **`ContactInfoStep`** - Step 2: Contact details and address
- **`DetailsStep`** - Step 3: Mission, vision, and organizational details
- **`LegalFinancialStep`** - Step 4: Legal status and financial information
- **`MediaStep`** - Step 5: Media uploads and final submission

### View Components

- **`OrganisationView`** - Comprehensive organisation detail view with status display
- **`OrganisationCard`** - Card component for displaying organisation information
- **`OrganisationStatusBadge`** - Status badge component showing approval status

### Dashboard Components

- **`OrganisationDashboard`** - Main dashboard for user's organisations
- **`OrganisationDashboardSkeleton`** - Loading skeleton for dashboard
- **`OrganisationQuickStats`** - Quick statistics component
- **`EnhancedOrganisationDashboard`** - Dashboard with statistics

### Empty State Components

- **`OrganisationEmptyState`** - Configurable empty state component
- **`NoOrganisationsState`** - Specific empty state for users with no organisations
- **`NotAffiliatedState`** - Empty state for users not affiliated with any organisation

### Supporting Files

- **`types.ts`** - TypeScript types and constants
- **`index.ts`** - Export barrel for all components
- **`example-usage.tsx`** - Usage examples and integration patterns

## Usage

### Basic Usage (Create Mode)

```tsx
import { OrganisationRegistrationForm } from '@/components/organisations'
import { organisationService } from '@/client-services/organisations'

function RegisterPage() {
  const handleSubmit = async (formData) => {
    try {
      await organisationService.registerOrganisation(formData)
      // Handle success
    } catch (error) {
      // Handle error
    }
  }

  return (
    <OrganisationRegistrationForm 
      onSubmit={handleSubmit}
      isLoading={false}
      mode="create"
    />
  )
}
```

### Edit Mode Usage

```tsx
import { OrganisationRegistrationForm } from '@/components/organisations'
import { organisationService } from '@/client-services/organisations'

function EditOrganisationPage({ organisationId }) {
  const [organisation, setOrganisation] = useState(null)
  
  useEffect(() => {
    const loadOrg = async () => {
      const org = await organisationService.getOrganisationById(organisationId)
      setOrganisation(org)
    }
    loadOrg()
  }, [organisationId])

  const handleSubmit = async (formData) => {
    try {
      await organisationService.updateOrganisationWithFormData(organisationId, formData)
      // Handle success
    } catch (error) {
      // Handle error
    }
  }

  if (!organisation) return <div>Loading...</div>

  return (
    <OrganisationRegistrationForm 
      onSubmit={handleSubmit}
      isLoading={false}
      existingOrganisation={organisation}
      mode="edit"
    />
  )
}
```

### With Loading State

```tsx
const [isLoading, setIsLoading] = useState(false)

const handleSubmit = async (formData) => {
  setIsLoading(true)
  try {
    await organisationService.registerOrganisation(formData)
  } finally {
    setIsLoading(false)
  }
}

return (
  <OrganisationRegistrationForm 
    onSubmit={handleSubmit}
    isLoading={isLoading}
  />
)
```

### Organisation View Usage

```tsx
import { OrganisationView } from '@/components/organisations'

function OrganisationDetailPage({ organisationId }: { organisationId: string }) {
  const [organisation, setOrganisation] = useState<Organisation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrganisation = async () => {
      try {
        const org = await organisationService.getOrganisationById(organisationId)
        setOrganisation(org)
      } catch (error) {
        console.error('Failed to load organisation:', error)
      } finally {
        setLoading(false)
      }
    }
    loadOrganisation()
  }, [organisationId])

  const handleEdit = () => {
    router.push(`/organisations/${organisationId}/edit`)
  }

  if (loading) return <div>Loading...</div>
  if (!organisation) return <div>Organisation not found</div>

  return (
    <OrganisationView 
      organisation={organisation}
      onEdit={handleEdit}
      canEdit={true} // Set based on user permissions
    />
  )
}
```

### Organisation Dashboard Usage

```tsx
import { OrganisationDashboard, OrganisationEmptyState } from '@/components/organisations'

function UserDashboard({ userId }: { userId: string }) {
  return (
    <OrganisationDashboard 
      userId={userId}
      onCreateOrganisation={() => router.push('/organisations/register')}
      onEditOrganisation={(id) => router.push(`/organisations/${id}/edit`)}
      onViewOrganisation={(id) => router.push(`/organisations/${id}`)}
    />
  )
}
```

### Empty State Usage

```tsx
import { NoOrganisationsState, NotAffiliatedState } from '@/components/organisations'

// For users who haven't created any organisations
function EmptyDashboard() {
  return (
    <NoOrganisationsState 
      onCreateOrganisation={() => router.push('/organisations/register')}
    />
  )
}

// For users not affiliated with any organisation
function NotAffiliated() {
  return (
    <NotAffiliatedState 
      onCreateOrganisation={() => router.push('/organisations/register')}
    />
  )
}
```

### Organisation Card Usage

```tsx
import { OrganisationCard } from '@/components/organisations'

function OrganisationList({ organisations }: { organisations: Organisation[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {organisations.map((org) => (
        <OrganisationCard
          key={org.id}
          organisation={org}
          onEdit={() => handleEdit(org.id)}
          onView={() => handleView(org.id)}
          showActions={true}
          variant="default"
        />
      ))}
    </div>
  )
}
```

## Form Data Structure

The form collects data according to the `OrganisationFormData` interface:

```typescript
interface OrganisationFormData {
  // Basic Info
  name: string
  type: organisation_type_enum
  size: organisation_size_enum
  country: country_enum
  registration_number?: string
  establishment_year?: number
  
  // Contact Info
  contact_email?: string
  contact_phone?: string
  website_url?: string
  address?: string
  region?: string
  state_province?: string
  city?: string
  social_links?: Record<string, string>
  languages_spoken?: language_enum[]
  
  // Organizational Details
  mission?: string
  vision?: string
  thematic_focus?: string[]
  staff_count?: number
  volunteer_count?: number
  partnerships?: string[]
  awards_recognition?: string[]
  
  // Legal & Financial
  legal_status?: string
  tax_exemption_status?: boolean
  certifications?: string[]
  annual_budget?: number
  
  // Media
  logo_url?: string
  cover_image_url?: string
  media_uploads?: Record<string, unknown>[]
  logo_file?: File
  cover_image_file?: File
}
```

## Validation

The form uses **Zod** for comprehensive validation:

- **Required fields**: name, type, size, country (validated via Zod schemas)
- **Email validation**: Proper email format for contact_email
- **URL validation**: Valid URLs for website_url, logo_url, cover_image_url
- **Number validation**: Non-negative values for counts and budget
- **Year validation**: Establishment year between 1900 and current year
- **Text length limits**: Mission and vision statements (500 characters)
- **File validation**: Image files only, size limits (5MB for logo, 10MB for cover)
- **Schema-based validation**: Each step has its own Zod schema for targeted validation

## Features

### Step Navigation
- Progress indicator with percentage completion
- Visual step indicators showing current, completed, and pending steps
- Previous/Next navigation with validation
- Form state persistence across steps

### Responsive Design
- Mobile-first responsive design
- Semantic tokens for consistent theming
- Accessible form controls and labels
- Loading states and error handling

### Dynamic Fields
- Add/remove partnerships dynamically
- Add/remove awards and recognitions
- Add/remove certifications
- Multi-select for thematic focus areas
- Checkbox selection for languages

### User Experience
- Real-time validation feedback with Zod error messages
- Character counters for text areas
- **File upload with drag & drop support**
- **Image preview for uploaded files and URLs**
- **File size and type validation**
- Helpful placeholder text and descriptions
- Loading overlay during submission
- **Edit mode with pre-populated form data**

### Organisation Status System

The system supports comprehensive status tracking:

- **✅ Active (Approved)**: Organisation is approved and publicly visible
- **⏳ Pending Approval**: Organisation is under review (2-3 business days)
- **⚠️ Flagged (Under Review)**: Requires additional review or information
- **❌ Inactive**: Organisation is not visible to the public

Each status includes:
- Color-coded badges with appropriate icons
- Descriptive messages explaining the current status
- User guidance on next steps and expectations

### View & Dashboard Components

- **Organisation View**: Comprehensive detail view with cover image, logo, and all organisation information
- **Organisation Dashboard**: User dashboard showing all organisations with status tracking
- **Quick Stats**: Visual statistics showing organisation counts by status
- **Empty States**: User-friendly empty states for different scenarios (no organisations, not affiliated)
- **Organisation Cards**: Compact card view for listing multiple organisations
- **Loading Skeletons**: Proper loading states for all components

## Supabase Integration

The form integrates with Supabase through the `organisationService`:

```typescript
// Register organisation (handles file uploads)
const organisation = await organisationService.registerOrganisation(formData)

// Update organisation (handles file uploads)
const updated = await organisationService.updateOrganisationWithFormData(id, formData)

// Get user's organisations
const organisations = await organisationService.getUserOrganisations(userId)

// Get organisation by ID
const org = await organisationService.getOrganisationById(id)

// Search organisations
const results = await organisationService.searchOrganisations(searchTerm, filters)
```

## Database Schema

The form maps to the `organisations` table with the following key fields:

- `status`: Set to 'pending_approval' for new registrations
- `created_by`: Automatically set to current user ID
- `search_vector`: Generated for full-text search
- `updated_at`: Automatically managed by triggers

## Styling

The components use semantic design tokens for consistent theming:

- `bg-primary` / `text-primary-foreground` for primary actions
- `bg-muted` / `text-muted-foreground` for secondary content
- `border-destructive` / `text-destructive` for error states
- `bg-background` / `text-foreground` for main content

## Accessibility

- Proper ARIA labels and descriptions
- Keyboard navigation support
- Screen reader friendly
- High contrast error states
- Focus management between steps

## Error Handling

- Field-level validation errors
- Form-level submission errors
- Network error handling
- User-friendly error messages
- Retry mechanisms

## Future Enhancements

- File upload integration with Supabase Storage
- Draft saving functionality
- Multi-language support
- Advanced image cropping/editing
- Bulk import capabilities
- Template system for common organisation types

## Dependencies

- `react-hook-form` - Form state management
- `zod` - Schema validation
- `@hookform/resolvers` - Zod integration with React Hook Form
- `@radix-ui/react-*` - Accessible UI primitives
- `lucide-react` - Icons
- `@supabase/supabase-js` - Database and storage integration
- `tailwindcss` - Styling

## Contributing

When adding new fields or steps:

1. Update the database schema and types in `types/db.ts`
2. Add field definitions to the appropriate interface in `types.ts`
3. **Update the corresponding Zod schema in `types.ts`**
4. Update the corresponding step component
5. Update the service layer in `client-services/organisations.ts`
6. **Test file upload functionality if adding media fields**
7. **Test both create and edit modes**
8. Test thoroughly across all form steps 