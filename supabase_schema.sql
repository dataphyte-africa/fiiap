-- =====================================================
-- Regional CSO Collaboration & Resource Database Platform
-- Supabase PostgreSQL Schema
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- =====================================================
-- ENUMS
-- =====================================================

-- Country enum for the three target countries
CREATE TYPE country_enum AS ENUM ('Nigeria', 'Benin', 'Gambia');

-- Language enum for multilingual support
CREATE TYPE language_enum AS ENUM ('English', 'French');

-- Organisation types
CREATE TYPE organisation_type_enum AS ENUM (
    'NGO', 
    'CBO', 
    'Network', 
    'Foundation', 
    'Coalition', 
    'Association',
    'Cooperative',
    'Other'
);

-- Organisation size/reach
CREATE TYPE organisation_size_enum AS ENUM ('Local', 'National', 'Regional', 'International');

-- Organisation status
CREATE TYPE organisation_status_enum AS ENUM ('active', 'pending_approval', 'flagged', 'inactive');

-- User roles
CREATE TYPE user_role_enum AS ENUM ('admin', 'cso_rep', 'donor', 'media', 'policy_maker', 'public');

-- Project status
CREATE TYPE project_status_enum AS ENUM ('planning', 'ongoing', 'completed', 'cancelled', 'on_hold');

-- Media/file types
CREATE TYPE file_type_enum AS ENUM ('image', 'pdf', 'video', 'audio', 'document', 'other');

-- Milestone status
CREATE TYPE milestone_status_enum AS ENUM ('planned', 'in_progress', 'achieved', 'delayed', 'cancelled');

-- Post status
CREATE TYPE post_status_enum AS ENUM ('draft', 'published', 'archived', 'flagged');

-- Export job status
CREATE TYPE export_status_enum AS ENUM ('pending', 'processing', 'completed', 'failed');

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Sectors table (normalized for better referential integrity)
CREATE TABLE sectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en TEXT NOT NULL,
    name_fr TEXT NOT NULL,
    description_en TEXT,
    description_fr TEXT,
    icon_url TEXT,
    color_hex TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organisations table (main CSO entity)
CREATE TABLE organisations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    registration_number TEXT,
    mission TEXT,
    vision TEXT,
    thematic_focus TEXT[],
    country country_enum NOT NULL,
    region TEXT,
    state_province TEXT,
    city TEXT,
    address TEXT,
    type organisation_type_enum NOT NULL,
    size organisation_size_enum NOT NULL,
    contact_email CITEXT UNIQUE,
    contact_phone TEXT,
    website_url TEXT,
    social_links JSONB DEFAULT '{}',
    languages_spoken language_enum[] DEFAULT ARRAY['English']::language_enum[],
    logo_url TEXT,
    cover_image_url TEXT,
    media_uploads JSONB DEFAULT '[]',
    establishment_year INTEGER,
    staff_count INTEGER,
    volunteer_count INTEGER,
    annual_budget NUMERIC,
    legal_status TEXT,
    tax_exemption_status BOOLEAN DEFAULT FALSE,
    certifications TEXT[],
    partnerships TEXT[],
    awards_recognition TEXT[],
    status organisation_status_enum DEFAULT 'pending_approval',
    featured BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    
    -- Search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(name, '') || ' ' || coalesce(mission, '') || ' ' || coalesce(vision, ''))
    ) STORED
);

-- User profiles extending Supabase Auth
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role user_role_enum DEFAULT 'public',
    organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL,
    language_preference language_enum DEFAULT 'English',
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    title TEXT,
    department TEXT,
    social_links JSONB DEFAULT '{}',
    notification_preferences JSONB DEFAULT '{"email": true, "push": false}',
    timezone TEXT DEFAULT 'UTC',
    email_verified BOOLEAN DEFAULT FALSE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    summary TEXT,
    sector_id UUID REFERENCES sectors(id),
    secondary_sectors UUID[],
    start_date DATE,
    end_date DATE,
    status project_status_enum DEFAULT 'planning',
    location TEXT,
    geo_coordinates JSONB, -- {lat: number, lng: number, address: string}
    budget NUMERIC,
    currency TEXT DEFAULT 'USD',
    beneficiaries_count INTEGER,
    beneficiaries_demographics JSONB,
    objectives TEXT[],
    outcomes TEXT[],
    impact_metrics JSONB,
    sdg_goals INTEGER[], -- UN SDG goals (1-17)
    language language_enum DEFAULT 'English',
    featured_image_url TEXT,
    gallery_images TEXT[],
    documents_urls TEXT[],
    project_website TEXT,
    contact_person TEXT,
    contact_email CITEXT,
    contact_phone TEXT,
    featured BOOLEAN DEFAULT FALSE,
    public_visibility BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    
    -- Search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(summary, ''))
    ) STORED
);

-- Project media table
CREATE TABLE project_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT,
    file_size BIGINT,
    file_type file_type_enum NOT NULL,
    mime_type TEXT,
    caption TEXT,
    alt_text TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    uploaded_by UUID REFERENCES auth.users(id),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project milestones table
CREATE TABLE project_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    completion_date DATE,
    status milestone_status_enum DEFAULT 'planned',
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    deliverables TEXT[],
    notes TEXT,
    evidence_urls TEXT[],
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Project funders table
CREATE TABLE project_funders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    funder_name TEXT NOT NULL,
    funder_type TEXT, -- 'Government', 'Foundation', 'Individual', 'Corporate', etc.
    funder_logo_url TEXT,
    funder_website TEXT,
    funding_amount NUMERIC,
    currency TEXT DEFAULT 'USD',
    funding_type TEXT, -- 'Grant', 'Donation', 'Investment', etc.
    funding_period_start DATE,
    funding_period_end DATE,
    is_primary_funder BOOLEAN DEFAULT FALSE,
    acknowledgment_required BOOLEAN DEFAULT TRUE,
    public_visibility BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project events table
CREATE TABLE project_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT, -- 'Workshop', 'Conference', 'Training', 'Meeting', etc.
    event_date TIMESTAMPTZ NOT NULL,
    event_end_date TIMESTAMPTZ,
    event_location TEXT,
    venue_details JSONB,
    is_virtual BOOLEAN DEFAULT FALSE,
    meeting_link TEXT,
    registration_link TEXT,
    registration_deadline TIMESTAMPTZ,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    event_status TEXT DEFAULT 'scheduled', -- 'scheduled', 'ongoing', 'completed', 'cancelled'
    attachments JSONB DEFAULT '[]',
    contact_person TEXT,
    contact_email CITEXT,
    tags TEXT[],
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- FORUM AND COMMUNICATION
-- =====================================================

-- Forum categories
CREATE TABLE forum_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en TEXT NOT NULL,
    name_fr TEXT NOT NULL,
    description_en TEXT,
    description_fr TEXT,
    icon TEXT,
    color_hex TEXT DEFAULT '#3B82F6',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum threads
CREATE TABLE forum_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES forum_categories(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES auth.users(id),
    language language_enum DEFAULT 'English',
    tags TEXT[],
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    last_reply_at TIMESTAMPTZ,
    last_reply_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, ''))
    ) STORED
);

-- Forum replies
CREATE TABLE forum_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
    parent_reply_id UUID REFERENCES forum_replies(id),
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES auth.users(id),
    is_solution BOOLEAN DEFAULT FALSE,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- POSTS AND UPDATES
-- =====================================================

-- Posts table for news, updates, announcements
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image_url TEXT,
    author_id UUID NOT NULL REFERENCES auth.users(id),
    status post_status_enum DEFAULT 'draft',
    language language_enum DEFAULT 'English',
    category TEXT,
    tags TEXT[],
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '') || ' ' || coalesce(excerpt, ''))
    ) STORED
);

-- =====================================================
-- TRANSLATIONS AND MULTILINGUAL SUPPORT
-- =====================================================

-- Translations table for dynamic content
CREATE TABLE translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    field_name TEXT NOT NULL,
    language language_enum NOT NULL,
    translation TEXT NOT NULL,
    translator_id UUID REFERENCES auth.users(id),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(table_name, record_id, field_name, language)
);

-- =====================================================
-- ANALYTICS AND TRACKING
-- =====================================================

-- Analytics events for tracking user interactions
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    session_id TEXT,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    country TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SYSTEM AND ADMIN
-- =====================================================

-- Export jobs for data exports
CREATE TABLE export_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    export_type TEXT NOT NULL,
    parameters JSONB DEFAULT '{}',
    status export_status_enum DEFAULT 'pending',
    file_url TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Static pages content
CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title_en TEXT NOT NULL,
    title_fr TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_fr TEXT NOT NULL,
    meta_description_en TEXT,
    meta_description_fr TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- AUDIT LOGGING
-- =====================================================

-- Audit log for tracking changes
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- HELPER TABLES FOR RELATIONSHIPS
-- =====================================================

-- Many-to-many relationship for organisation collaborations
CREATE TABLE organisation_collaborations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation1_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    organisation2_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    collaboration_type TEXT, -- 'partnership', 'network_member', 'coalition', etc.
    description TEXT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(organisation1_id, organisation2_id)
);

-- User favorites/bookmarks
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    favoritable_type TEXT NOT NULL, -- 'organisation', 'project', 'post'
    favoritable_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, favoritable_type, favoritable_id)
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'info', 'success', 'warning', 'error'
    action_url TEXT,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Organisations indexes
CREATE INDEX idx_organisations_country ON organisations(country);
CREATE INDEX idx_organisations_type ON organisations(type);
CREATE INDEX idx_organisations_size ON organisations(size);
CREATE INDEX idx_organisations_status ON organisations(status);
CREATE INDEX idx_organisations_featured ON organisations(featured) WHERE featured = TRUE;
CREATE INDEX idx_organisations_search ON organisations USING GIN(search_vector);
CREATE INDEX idx_organisations_thematic_focus ON organisations USING GIN(thematic_focus);

-- Projects indexes
CREATE INDEX idx_projects_organisation_id ON projects(organisation_id);
CREATE INDEX idx_projects_sector_id ON projects(sector_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_start_date ON projects(start_date);
CREATE INDEX idx_projects_featured ON projects(featured) WHERE featured = TRUE;
CREATE INDEX idx_projects_search ON projects USING GIN(search_vector);
CREATE INDEX idx_projects_sdg_goals ON projects USING GIN(sdg_goals);

-- Forum indexes
CREATE INDEX idx_forum_threads_category_id ON forum_threads(category_id);
CREATE INDEX idx_forum_threads_author_id ON forum_threads(author_id);
CREATE INDEX idx_forum_threads_created_at ON forum_threads(created_at DESC);
CREATE INDEX idx_forum_threads_search ON forum_threads USING GIN(search_vector);
CREATE INDEX idx_forum_replies_thread_id ON forum_replies(thread_id);

-- Posts indexes
CREATE INDEX idx_posts_organisation_id ON posts(organisation_id);
CREATE INDEX idx_posts_project_id ON posts(project_id);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);

-- Analytics indexes
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);

-- Translations indexes
CREATE INDEX idx_translations_lookup ON translations(table_name, record_id, field_name, language);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_organisations_updated_at BEFORE UPDATE ON organisations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_project_milestones_updated_at BEFORE UPDATE ON project_milestones FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_forum_threads_updated_at BEFORE UPDATE ON forum_threads FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_forum_replies_updated_at BEFORE UPDATE ON forum_replies FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_translations_updated_at BEFORE UPDATE ON translations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_project_events_updated_at BEFORE UPDATE ON project_events FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to create audit log entries
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        table_name,
        record_id,
        action,
        old_values,
        new_values,
        changed_fields,
        user_id,
        user_email
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' THEN to_jsonb(NEW) ELSE to_jsonb(NEW) END,
        CASE 
            WHEN TG_OP = 'UPDATE' THEN 
                ARRAY(SELECT key FROM jsonb_each(to_jsonb(NEW)) WHERE to_jsonb(NEW) ->> key IS DISTINCT FROM to_jsonb(OLD) ->> key)
            ELSE NULL 
        END,
        COALESCE(NEW.created_by, NEW.updated_by, auth.uid()),
        auth.email()
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to important tables
CREATE TRIGGER audit_organisations AFTER INSERT OR UPDATE OR DELETE ON organisations FOR EACH ROW EXECUTE FUNCTION create_audit_log();
CREATE TRIGGER audit_projects AFTER INSERT OR UPDATE OR DELETE ON projects FOR EACH ROW EXECUTE FUNCTION create_audit_log();
CREATE TRIGGER audit_project_milestones AFTER INSERT OR UPDATE OR DELETE ON project_milestones FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- Function to update thread reply count and last reply info
CREATE OR REPLACE FUNCTION update_thread_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE forum_threads 
        SET 
            reply_count = reply_count + 1,
            last_reply_at = NEW.created_at,
            last_reply_by = NEW.author_id
        WHERE id = NEW.thread_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE forum_threads 
        SET reply_count = reply_count - 1
        WHERE id = OLD.thread_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_thread_stats_trigger 
    AFTER INSERT OR DELETE ON forum_replies 
    FOR EACH ROW EXECUTE FUNCTION update_thread_stats();

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert default sectors
INSERT INTO sectors (name_en, name_fr, description_en, description_fr, color_hex) VALUES
('Health', 'Santé', 'Healthcare and medical services', 'Services de santé et médicaux', '#EF4444'),
('Education', 'Éducation', 'Educational programs and literacy', 'Programmes éducatifs et alphabétisation', '#3B82F6'),
('Human Rights', 'Droits de l''Homme', 'Human rights advocacy and protection', 'Plaidoyer et protection des droits de l''homme', '#8B5CF6'),
('Environment', 'Environnement', 'Environmental conservation and sustainability', 'Conservation environnementale et durabilité', '#10B981'),
('Agriculture', 'Agriculture', 'Agricultural development and food security', 'Développement agricole et sécurité alimentaire', '#F59E0B'),
('Gender Equality', 'Égalité des Genres', 'Women empowerment and gender equality', 'Autonomisation des femmes et égalité des genres', '#EC4899'),
('Youth Development', 'Développement Jeunesse', 'Youth programs and empowerment', 'Programmes jeunesse et autonomisation', '#06B6D4'),
('Governance', 'Gouvernance', 'Good governance and transparency', 'Bonne gouvernance et transparence', '#6366F1'),
('Economic Development', 'Développement Économique', 'Economic empowerment and development', 'Autonomisation et développement économique', '#F97316'),
('Social Services', 'Services Sociaux', 'Social welfare and community services', 'Protection sociale et services communautaires', '#84CC16');

-- Insert default forum categories
INSERT INTO forum_categories (name_en, name_fr, description_en, description_fr, sort_order) VALUES
('General Discussion', 'Discussion Générale', 'General topics and discussions', 'Sujets et discussions générales', 1),
('Project Collaboration', 'Collaboration de Projets', 'Find partners and collaborate on projects', 'Trouvez des partenaires et collaborez sur des projets', 2),
('Funding Opportunities', 'Opportunités de Financement', 'Share and discuss funding opportunities', 'Partagez et discutez des opportunités de financement', 3),
('Capacity Building', 'Renforcement des Capacités', 'Training and skill development discussions', 'Discussions sur la formation et le développement des compétences', 4),
('Policy & Advocacy', 'Politique et Plaidoyer', 'Policy discussions and advocacy strategies', 'Discussions politiques et stratégies de plaidoyer', 5),
('Technology & Innovation', 'Technologie et Innovation', 'Tech solutions and innovations for CSOs', 'Solutions technologiques et innovations pour les OSC', 6);

-- =====================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON DATABASE current_database() IS 'Regional CSO Collaboration & Resource Database Platform';

COMMENT ON TABLE organisations IS 'Main table storing Civil Society Organisation information';
COMMENT ON TABLE projects IS 'Projects created and managed by CSOs';
COMMENT ON TABLE project_media IS 'Media files associated with projects';
COMMENT ON TABLE project_milestones IS 'Project milestones and deliverables';
COMMENT ON TABLE project_funders IS 'Funding sources for projects';
COMMENT ON TABLE project_events IS 'Events related to projects';
COMMENT ON TABLE profiles IS 'User profiles extending Supabase Auth users';
COMMENT ON TABLE audit_logs IS 'Audit trail for tracking changes to important records';
COMMENT ON TABLE translations IS 'Multi-language translations for dynamic content';

-- End of schema 

-- Create the auth hook function
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
  declare
    claims jsonb;
    user_role public.user_role_enum;
  begin
    -- Fetch the user role from the profiles table
    select role into user_role from public.profiles where id = (event->>'user_id')::uuid;

    claims := event->'claims';

    if user_role is not null then
      -- Set the claim
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    else
      claims := jsonb_set(claims, '{user_role}', 'null');
    end if;

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    return event;
  end;
$$;

grant usage on schema public to supabase_auth_admin;

grant execute
  on function public.custom_access_token_hook
  to supabase_auth_admin;

revoke execute
  on function public.custom_access_token_hook
  from authenticated, anon, public;

grant all
  on table public.profiles
to supabase_auth_admin;

revoke all
  on table public.profiles
  from authenticated, anon, public;

create policy "Allow auth admin to read user profiles" ON public.profiles
as permissive for select
to supabase_auth_admin
using (true); 