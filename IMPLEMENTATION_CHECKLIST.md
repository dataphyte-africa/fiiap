# CSO Platform Implementation Checklist

## 🗃️ Database Schema Summary

### **Core Tables Created:**
- ✅ **organisations** - CSO profiles and information
- ✅ **projects** - CSO projects with full lifecycle management
- ✅ **project_media** - File attachments for projects
- ✅ **project_milestones** - Project phases and deliverables
- ✅ **project_funders** - Funding sources and acknowledgments
- ✅ **project_events** - Events related to projects
- ✅ **profiles** - Extended user profiles with roles
- ✅ **sectors** - Standardized project categories
- ✅ **forum_threads/replies** - Discussion forum
- ✅ **posts** - News and updates
- ✅ **translations** - Multi-language support
- ✅ **audit_logs** - Change tracking
- ✅ **analytics_events** - User interaction tracking

### **Key Features:**
- 🔒 **Row Level Security (RLS)** policies for all tables
- 🌍 **Multi-language support** (English/French)
- 🔍 **Full-text search** with tsvector optimization
- 📊 **Analytics tracking** for user behavior
- 🔄 **Audit logging** for data changes
- 📁 **File storage integration** with Supabase Storage
- 👥 **Role-based access control** (admin, cso_rep, donor, etc.)

---

## 🚀 Quick Setup Guide

### 1. **Supabase Project Setup**
```bash
# Initialize Supabase (if new project)
npx supabase init
npx supabase start

# Or connect to existing project
npx supabase link --project-ref your-project-ref
```

### 2. **Apply Database Schema**
```bash
# Apply main schema
supabase db reset
# Or manually apply:
psql -h db.your-project.supabase.co -U postgres -d postgres -f supabase_schema.sql
psql -h db.your-project.supabase.co -U postgres -d postgres -f rls_policies.sql
```

### 3. **Create Storage Buckets**
In Supabase Dashboard → Storage, create these buckets:
```
organisation-logos     (Public: true)
organisation-media     (Public: false) 
project-media         (Public: true)
project-gallery       (Public: true)
user-avatars          (Public: true)
funder-logos          (Public: true)
event-attachments     (Public: false)
```

### 4. **Environment Configuration**
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Settings
NEXT_PUBLIC_DEFAULT_LANGUAGE=English
NEXT_PUBLIC_SUPPORTED_COUNTRIES=Nigeria,Benin,Gambia
NEXT_PUBLIC_DEFAULT_COUNTRY=Nigeria
```

---

## 🔐 Security Configuration

### **RLS Policies Summary:**
| Table | Public Read | User Create | User Update | Admin Override |
|-------|-------------|-------------|-------------|----------------|
| organisations | ✅ (active only) | CSO reps only | Own org only | ✅ |
| projects | ✅ (public only) | CSO reps only | Own projects | ✅ |
| profiles | ✅ (authenticated) | Own profile | Own profile | ✅ |
| forum_threads | ✅ (authenticated) | ✅ | Own threads | ✅ |
| posts | ✅ (published) | ✅ | Own posts | ✅ |

### **Storage Security:**
```sql
-- Example bucket policy for project media
CREATE POLICY "Public can view project media" ON storage.objects
FOR SELECT USING (bucket_id = 'project-media');

CREATE POLICY "Users can upload project media" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'project-media' AND 
  auth.role() = 'authenticated'
);
```

---

## 📋 User Role Definitions

### **Role Capabilities:**

#### **Admin** (`admin`)
- Full CRUD access to all data
- User management
- Platform configuration
- Analytics access

#### **CSO Representative** (`cso_rep`)
- Manage own organisation profile
- Create/manage projects
- Forum participation
- Create posts/updates

#### **Public User** (`public`)
- View active organisations
- View public projects
- Read-only forum access
- Basic search functionality

#### **Donor** (`donor`)
- View projects for funding
- Contact CSOs
- Forum participation
- Save favorites

---

## 🏗️ Database Relationships

### **Primary Relationships:**
```
User (auth.users) 
  ↓ 1:1
Profile 
  ↓ N:1
Organisation 
  ↓ 1:N
Project 
  ↓ 1:N
├── Media Files
├── Milestones  
├── Funders
└── Events
```

### **Foreign Key Constraints:**
- `profiles.organisation_id` → `organisations.id`
- `projects.organisation_id` → `organisations.id`
- `projects.sector_id` → `sectors.id`
- `project_media.project_id` → `projects.id`
- `project_milestones.project_id` → `projects.id`

---

## 🔍 Search & Performance

### **Full-Text Search Tables:**
- `organisations.search_vector` - Name, mission, vision
- `projects.search_vector` - Title, description, summary
- `forum_threads.search_vector` - Title, content
- `posts.search_vector` - Title, content, excerpt

### **Key Indexes:**
```sql
-- Geographic filtering
idx_organisations_country
idx_organisations_region

-- Project discovery
idx_projects_sector_id
idx_projects_status
idx_projects_start_date

-- Array searches
idx_organisations_thematic_focus (GIN)
idx_projects_sdg_goals (GIN)
```

### **Sample Search Query:**
```sql
-- Find health organisations in Nigeria
SELECT * FROM organisations 
WHERE country = 'Nigeria' 
  AND 'health' = ANY(thematic_focus)
  AND status = 'active'
ORDER BY name;
```

---

## 🌐 Multi-Language Implementation

### **Static Content** (Reference Tables):
```sql
-- Sectors table example
name_en: "Health"
name_fr: "Santé"
description_en: "Healthcare and medical services"
description_fr: "Services de santé et médicaux"
```

### **Dynamic Content** (User-Generated):
```javascript
// Translation helper function
async function getTranslation(tableName, recordId, fieldName, language, fallback) {
  const { data } = await supabase
    .from('translations')
    .select('translation')
    .match({ table_name: tableName, record_id: recordId, field_name: fieldName, language })
    .single();
    
  return data?.translation || fallback;
}

// Usage example
const missionFr = await getTranslation('organisations', orgId, 'mission', 'French', originalMission);
```

---

## 📊 Analytics & Monitoring

### **Event Tracking:**
```javascript
// Track user interactions
const trackEvent = async (eventType, eventData = {}) => {
  await supabase.from('analytics_events').insert({
    user_id: user?.id,
    event_type: eventType,
    event_data: eventData,
    page_url: window.location.pathname
  });
};

// Usage examples
trackEvent('project_view', { project_id: projectId });
trackEvent('organisation_contact', { organisation_id: orgId });
trackEvent('search_performed', { query: searchTerm, results_count: results.length });
```

### **Audit Logging:**
Automatically tracks changes to:
- ✅ Organisations
- ✅ Projects  
- ✅ Project milestones
- ✅ All user-generated content

---

## 🧪 Testing Checklist

### **Database Tests:**
- [ ] All tables created successfully
- [ ] Foreign key constraints working
- [ ] RLS policies prevent unauthorized access
- [ ] Triggers firing correctly (updated_at, audit_logs)
- [ ] Indexes improving query performance

### **Authentication Tests:**
- [ ] User registration/login working
- [ ] Profile creation on signup (default non-admin role)
- [ ] **CRITICAL**: Users cannot self-assign admin roles
- [ ] Only admins can create/modify admin accounts
- [ ] Role assignment functioning correctly
- [ ] RLS respecting user roles

### **CRUD Operations:**
- [ ] Organisations CRUD (with proper permissions)
- [ ] Projects CRUD (organisation-scoped)
- [ ] File uploads to Storage buckets
- [ ] Forum threads/replies
- [ ] Translation system

### **Search & Performance:**
- [ ] Full-text search working
- [ ] Geographic filtering
- [ ] Sector-based filtering
- [ ] Query performance acceptable (<100ms for simple queries)

---

## 🚨 Common Gotchas

### **Critical Security Issues:**
```sql
-- ❌ DANGEROUS: Allows users to self-assign admin roles
CREATE POLICY "bad_profile_policy" ON profiles 
FOR INSERT WITH CHECK (auth.uid() = id);

-- ✅ SECURE: Prevents privilege escalation
CREATE POLICY "secure_profile_policy" ON profiles 
FOR INSERT WITH CHECK (
    auth.uid() = id AND 
    (role IS NULL OR role != 'admin')
);
```

**Always verify:**
- Users cannot self-assign admin roles
- Role changes require appropriate permissions
- Admin accounts can only be created by existing admins

### **RLS Policy Issues:**
```sql
-- ❌ Bad: Will fail due to infinite recursion
CREATE POLICY "test" ON profiles FOR SELECT USING (
  get_user_role() = 'admin'  -- This calls another RLS-protected query
);

-- ✅ Good: Direct auth checks
CREATE POLICY "test" ON profiles FOR SELECT USING (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
```

### **Storage Upload Issues:**
- Ensure bucket policies match database RLS
- Check file size limits (default 50MB)
- Validate file types before upload
- Handle upload progress for large files

### **Performance Considerations:**
- Use `select('*')` sparingly - specify needed columns
- Paginate large result sets
- Cache frequently accessed reference data
- Monitor database connection count

---

## 📚 Quick Reference

### **Important UUIDs to Remember:**
```javascript
// Get current user's organisation
const { data: profile } = await supabase
  .from('profiles')
  .select('organisation_id')
  .eq('id', user.id)
  .single();

// Check if user is admin
const { data: isAdmin } = await supabase
  .rpc('is_admin');
```

### **Common Queries:**
```sql
-- Get organisations with project count
SELECT o.*, COUNT(p.id) as project_count
FROM organisations o
LEFT JOIN projects p ON o.id = p.organisation_id
WHERE o.status = 'active'
GROUP BY o.id;

-- Get projects with sector names
SELECT p.*, s.name_en as sector_name
FROM projects p
JOIN sectors s ON p.sector_id = s.id
WHERE p.public_visibility = true;
```

### **Useful Supabase Functions:**
```javascript
// Get user's role
const { data } = await supabase.rpc('get_user_role');

// Check organisation ownership  
const { data } = await supabase.rpc('owns_organisation', { org_id: 'uuid' });

// Check admin status
const { data } = await supabase.rpc('is_admin');
```

---

## ✅ Deployment Checklist

### **Pre-Production:**
- [ ] All schema files applied
- [ ] RLS policies tested
- [ ] Storage buckets configured
- [ ] Environment variables set
- [ ] SSL certificates configured
- [ ] Database backups enabled

### **Production Monitoring:**
- [ ] Query performance monitoring
- [ ] Error logging configured  
- [ ] User analytics tracking
- [ ] Security audit scheduled
- [ ] Backup restoration tested

---

This schema provides a solid foundation for your Regional CSO Collaboration Platform. The design emphasizes security, scalability, and multi-language support while maintaining flexibility for future enhancements. 