# Regional CSO Collaboration & Resource Database Platform
## Database Schema Documentation

### Overview

This database schema is designed for a web-based platform serving Civil Society Organisations (CSOs) in **Nigeria, Benin, and The Gambia**, with multilingual support for **English and French**. The platform facilitates collaboration, visibility, and resource sharing among CSOs, policy stakeholders, donors, and media.

### Technology Stack

- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Security**: Row Level Security (RLS) policies
- **Languages**: English & French (with translation support)

---

## Core Architecture

### 1. Entity Relationship Overview

```
auth.users (Supabase Auth)
    ↓ (1:1)
profiles (User profiles & roles)
    ↓ (N:1)
organisations (CSOs)
    ↓ (1:N)
projects (CSO Projects)
    ↓ (1:N)
├── project_media (Images, documents, videos)
├── project_milestones (Project phases/goals)
├── project_funders (Funding sources)
└── project_events (Project-related events)

Additional entities:
- sectors (Project categories)
- forum_threads/replies (Discussion forum)
- posts (News/updates)
- translations (Multi-language support)
- audit_logs (Change tracking)
```

### 2. User Roles & Permissions

| Role | Description | Capabilities |
|------|-------------|--------------|
| `admin` | Platform administrators | Full CRUD access to all data |
| `cso_rep` | CSO representatives | Manage their organisation and projects |
| `donor` | Funding organisations | View projects, create funding opportunities |
| `media` | Media personnel | Access to public content for reporting |
| `policy_maker` | Government/policy stakeholders | View data for policy insights |
| `public` | General public users | Read-only access to public content |

---

## Table Specifications

### Core Tables

#### 1. **organisations**
The main entity representing Civil Society Organisations.

**Key Features:**
- Full CSO profile with mission, vision, thematic focus
- Geographic categorization (country, region, state/province, city)
- Contact information and social media links
- Logo and media storage via Supabase Storage
- Search optimization with `tsvector` for full-text search
- Status workflow: `pending_approval` → `active` → `flagged`/`inactive`

**Important Fields:**
```sql
thematic_focus TEXT[]          -- Array of focus areas
social_links JSONB            -- Flexible social media storage
languages_spoken language_enum[] -- Multi-language support
search_vector tsvector        -- Full-text search optimization
```

#### 2. **projects**
Projects created and managed by CSOs.

**Key Features:**
- Comprehensive project information (title, description, objectives)
- Sector classification with primary and secondary sectors
- Geographic location with optional coordinates
- Budget and beneficiary tracking
- SDG goals alignment (UN Sustainable Development Goals 1-17)
- Project lifecycle management through status enum
- Public/private visibility controls

**Important Fields:**
```sql
secondary_sectors UUID[]       -- Multiple sector support
geo_coordinates JSONB         -- {lat, lng, address}
beneficiaries_demographics JSONB -- Flexible demographic data
impact_metrics JSONB          -- Custom impact measurement
sdg_goals INTEGER[]           -- UN SDG alignment
```

#### 3. **project_media**
Media files associated with projects.

**Features:**
- File type categorization (image, pdf, video, audio, document)
- File metadata (size, MIME type, filename)
- Caption and alt-text for accessibility
- Featured image designation
- Sort ordering for galleries

#### 4. **project_milestones**
Project phases and key deliverables.

**Features:**
- Due date and completion tracking
- Progress percentage (0-100%)
- Status workflow: `planned` → `in_progress` → `achieved`/`delayed`/`cancelled`
- Evidence files for milestone completion
- Sort ordering for timeline display

#### 5. **project_funders**
Funding sources for projects.

**Features:**
- Funder information with logo and website
- Funding amount and currency
- Funding type classification
- Public visibility controls
- Primary funder designation

#### 6. **project_events**
Events related to projects.

**Features:**
- Event type categorization
- Virtual and physical event support
- Registration management
- Participant tracking
- Event status workflow

### Supporting Tables

#### **profiles**
Extended user profiles for Supabase Auth users.

**Key Features:**
- Role-based access control
- Organisation association
- Language preferences
- Notification settings
- Onboarding tracking

#### **sectors**
Standardized project categories with multilingual support.

**Pre-populated sectors:**
- Health/Santé
- Education/Éducation  
- Human Rights/Droits de l'Homme
- Environment/Environnement
- Agriculture/Agriculture
- Gender Equality/Égalité des Genres
- Youth Development/Développement Jeunesse
- Governance/Gouvernance
- Economic Development/Développement Économique
- Social Services/Services Sociaux

#### **forum_threads & forum_replies**
Discussion forum for CSO collaboration.

**Features:**
- Category-based organization
- Thread pinning and locking
- Reply threading (parent-child relationships)
- View and reply counters
- Multilingual content support

#### **translations**
Dynamic translation system for user-generated content.

**Features:**
- Table/field/record-specific translations
- Translator attribution
- Verification workflow
- Support for English/French translation pairs

---

## Multi-Language Strategy

### 1. **Static Content Translation**
Reference data (sectors, forum categories, pages) have dedicated columns:
```sql
name_en TEXT NOT NULL,
name_fr TEXT NOT NULL,
description_en TEXT,
description_fr TEXT
```

### 2. **Dynamic Content Translation**
User-generated content uses the `translations` table:
```sql
-- Example: Translating an organisation's mission
INSERT INTO translations (table_name, record_id, field_name, language, translation)
VALUES ('organisations', 'org-uuid', 'mission', 'French', 'Mission traduite...');
```

### 3. **Implementation Approach**
```javascript
// Frontend helper function
async function getTranslatedField(tableName, recordId, fieldName, language, fallbackValue) {
  const translation = await supabase
    .from('translations')
    .select('translation')
    .eq('table_name', tableName)
    .eq('record_id', recordId)
    .eq('field_name', fieldName)
    .eq('language', language)
    .single();
    
  return translation?.data?.translation || fallbackValue;
}
```

---

## Security Implementation

### Row Level Security (RLS) Policies

#### **Data Isolation Principles:**
1. **Public Access**: Approved organisations and public projects visible to all
2. **Organisational Boundaries**: CSO reps can only manage their own organisation's data
3. **Admin Override**: Administrators have full access for platform management
4. **Role-based Permissions**: Different user roles have appropriate access levels

#### **Key Policy Examples:**

```sql
-- Public can view active organisations
CREATE POLICY "Public can view active organisations" ON organisations
    FOR SELECT USING (
        status IN ('active', 'flagged') OR 
        is_admin() OR 
        owns_organisation(id)
    );

-- CSO reps can create projects for their organisation
CREATE POLICY "CSO reps can create projects" ON projects
    FOR INSERT WITH CHECK (
        is_cso_rep() AND 
        owns_organisation(organisation_id) AND
        auth.uid() = created_by
    );
```

### **Storage Security**
Supabase Storage policies should complement database RLS:

```sql
-- Example Storage policy for organisation media
CREATE POLICY "Public can view organisation logos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'organisation-media' AND 
       -- Add logic to check if organisation is active/public
);

CREATE POLICY "CSO reps can upload organisation media" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'organisation-media' AND 
    auth.role() = 'authenticated' AND
    -- Add logic to verify user owns the organisation folder
);
```

---

## Performance Optimization

### **Indexes for Common Queries**

#### **Geographic Filtering:**
```sql
CREATE INDEX idx_organisations_country ON organisations(country);
CREATE INDEX idx_organisations_region ON organisations(region);
```

#### **Project Discovery:**
```sql
CREATE INDEX idx_projects_sector_id ON projects(sector_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_start_date ON projects(start_date);
```

#### **Full-Text Search:**
```sql
CREATE INDEX idx_organisations_search ON organisations USING GIN(search_vector);
CREATE INDEX idx_projects_search ON projects USING GIN(search_vector);
```

#### **Array Operations:**
```sql
CREATE INDEX idx_organisations_thematic_focus ON organisations USING GIN(thematic_focus);
CREATE INDEX idx_projects_sdg_goals ON projects USING GIN(sdg_goals);
```

### **Query Optimization Examples**

#### **Find organisations by sector and country:**
```sql
SELECT o.* 
FROM organisations o
JOIN projects p ON o.id = p.organisation_id
WHERE o.country = 'Nigeria' 
  AND p.sector_id = (SELECT id FROM sectors WHERE name_en = 'Health')
  AND o.status = 'active';
```

#### **Full-text search across organisations:**
```sql
SELECT * FROM organisations 
WHERE search_vector @@ plainto_tsquery('english', 'health education community')
  AND status = 'active'
ORDER BY ts_rank(search_vector, plainto_tsquery('english', 'health education community')) DESC;
```

---

## Audit & Monitoring

### **Audit Logging**
All critical operations are automatically logged:

```sql
-- Audit trigger captures changes
CREATE TRIGGER audit_organisations 
    AFTER INSERT OR UPDATE OR DELETE ON organisations 
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();
```

**Audit log contains:**
- Table and record information
- Before/after values (for updates)
- Changed field names
- User attribution
- Timestamp and IP address

### **Analytics Tracking**
User interactions tracked for insights:

```sql
-- Example: Track project views
INSERT INTO analytics_events (user_id, event_type, event_data, page_url)
VALUES (auth.uid(), 'project_view', '{"project_id": "uuid"}', '/projects/uuid');
```

---

## Implementation Guide

### **1. Database Setup**

```bash
# Create new Supabase project
npx supabase init
npx supabase start

# Apply schema
psql -h localhost -p 54322 -U postgres -d postgres -f supabase_schema.sql
psql -h localhost -p 54322 -U postgres -d postgres -f rls_policies.sql
```

### **2. Storage Buckets**

Create the following storage buckets in Supabase Dashboard:

```javascript
// Required storage buckets
const buckets = [
  'organisation-logos',      // Organisation logos
  'organisation-media',      // Additional organisation files
  'project-media',          // Project images, documents
  'project-gallery',        // Project photo galleries
  'user-avatars',           // User profile pictures
  'funder-logos',           // Funder organisation logos
  'event-attachments'       // Event-related files
];
```

### **3. Environment Variables**

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Application Settings
NEXT_PUBLIC_DEFAULT_LANGUAGE=English
NEXT_PUBLIC_SUPPORTED_LANGUAGES=English,French
NEXT_PUBLIC_DEFAULT_COUNTRY=Nigeria
```

### **4. Frontend Integration Example**

```typescript
// types/database.ts
export interface Organisation {
  id: string;
  name: string;
  mission?: string;
  country: 'Nigeria' | 'Benin' | 'Gambia';
  type: 'NGO' | 'CBO' | 'Network' | 'Foundation' | 'Coalition' | 'Association' | 'Cooperative' | 'Other';
  status: 'active' | 'pending_approval' | 'flagged' | 'inactive';
  // ... other fields
}

// services/organisations.ts
export async function getOrganisations(filters?: {
  country?: string;
  sector?: string;
  type?: string;
}) {
  let query = supabase
    .from('organisations')
    .select(`
      *,
      projects:projects(count)
    `)
    .eq('status', 'active');

  if (filters?.country) query = query.eq('country', filters.country);
  if (filters?.type) query = query.eq('type', filters.type);
  
  return query;
}
```

---

## Migration Strategy

### **Phase 1: Core Setup**
1. Deploy basic schema (organisations, profiles, sectors)
2. Implement authentication flow
3. Set up basic CRUD operations

### **Phase 2: Projects Module**
1. Add projects and related tables
2. Implement file upload functionality
3. Create project management interface

### **Phase 3: Collaboration Features**
1. Deploy forum system
2. Add translation system
3. Implement notification system

### **Phase 4: Analytics & Advanced Features**
1. Add analytics tracking
2. Implement advanced search
3. Create admin dashboard

---

## Scalability Considerations

### **Database Scaling**
- **Read Replicas**: Use Supabase read replicas for reporting queries
- **Connection Pooling**: Implement connection pooling for high-traffic scenarios
- **Partitioning**: Consider table partitioning for analytics_events table

### **Storage Scaling**
- **CDN Integration**: Use Supabase CDN for global file delivery
- **Image Optimization**: Implement image resizing and optimization
- **File Compression**: Compress documents before storage

### **Performance Monitoring**
- **Query Performance**: Monitor slow queries and optimize indexes
- **Resource Usage**: Track database CPU, memory, and storage usage
- **User Analytics**: Monitor user engagement and feature usage

---

## Best Practices

### **Data Quality**
1. **Validation**: Implement client and server-side validation
2. **Sanitization**: Sanitize user inputs to prevent XSS
3. **Consistency**: Use database constraints and triggers for data integrity

### **Security**
1. **Regular Audits**: Review RLS policies and access patterns
2. **Input Validation**: Validate all user inputs
3. **File Security**: Scan uploaded files for malware
4. **API Security**: Implement rate limiting and authentication

### **Maintenance**
1. **Regular Backups**: Implement automated backup strategies
2. **Schema Migrations**: Use version-controlled schema migrations
3. **Performance Monitoring**: Regular performance reviews and optimizations
4. **Security Updates**: Keep all dependencies updated

---

This schema provides a robust foundation for the Regional CSO Collaboration & Resource Database Platform, with proper relationships, security policies, and scalability considerations built in from the start. 