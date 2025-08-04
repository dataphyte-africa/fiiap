-- =====================================================
-- Row Level Security (RLS) Policies
-- Regional CSO Collaboration & Resource Database Platform
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_funders ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisation_collaborations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- HELPER FUNCTIONS FOR RLS
-- =====================================================

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role_enum AS $$
BEGIN
    RETURN (
        SELECT role 
        FROM profiles 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's organisation
CREATE OR REPLACE FUNCTION get_user_organisation_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT organisation_id 
        FROM profiles 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is CSO rep
CREATE OR REPLACE FUNCTION is_cso_rep()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'cso_rep';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user owns organisation
CREATE OR REPLACE FUNCTION owns_organisation(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_organisation_id() = org_id AND is_cso_rep();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ORGANISATIONS POLICIES
-- =====================================================

-- Public can view active, approved organisations
CREATE POLICY "Public can view active organisations" ON organisations
    FOR SELECT USING (
        status IN ('active', 'flagged') OR 
        is_admin() OR 
        owns_organisation(id)
    );

-- CSO reps can insert their own organisation
CREATE POLICY "CSO reps can create organisations" ON organisations
    FOR INSERT WITH CHECK (
        is_cso_rep() AND auth.uid() = created_by
    );

-- CSO reps can update their own organisation, admins can update any
CREATE POLICY "CSO reps can update own organisation" ON organisations
    FOR UPDATE USING (
        is_admin() OR owns_organisation(id)
    ) WITH CHECK (
        is_admin() OR owns_organisation(id)
    );

-- Only admins can delete organisations
CREATE POLICY "Only admins can delete organisations" ON organisations
    FOR DELETE USING (is_admin());

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

-- Users can view all profiles (for collaboration)
CREATE POLICY "Users can view profiles" ON profiles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Users can insert their own profile (but not as admin)
CREATE POLICY "Users can create own profile" ON profiles
    FOR INSERT WITH CHECK (
        auth.uid() = id AND 
        (role IS NULL OR role != 'admin')
    );

-- Only admins can create profiles with admin role
CREATE POLICY "Only admins can create admin profiles" ON profiles
    FOR INSERT WITH CHECK (
        is_admin() AND role = 'admin'
    );

-- Users can update their own profile (but cannot change role to admin)
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (
        auth.uid() = id AND role != 'admin'
    ) WITH CHECK (
        auth.uid() = id AND 
        (role IS NULL OR role != 'admin')
    );

-- Admins can update any profile including role changes
CREATE POLICY "Admins can update any profile" ON profiles
    FOR UPDATE USING (is_admin()) 
    WITH CHECK (is_admin());

-- Users can delete their own profile, admins can delete any
CREATE POLICY "Users can delete own profile" ON profiles
    FOR DELETE USING (
        auth.uid() = id OR is_admin()
    );

-- =====================================================
-- PROJECTS POLICIES
-- =====================================================

-- Public can view public projects from active organisations
CREATE POLICY "Public can view public projects" ON projects
    FOR SELECT USING (
        public_visibility = true AND 
        EXISTS (
            SELECT 1 FROM organisations 
            WHERE id = projects.organisation_id 
            AND status = 'active'
        ) OR
        is_admin() OR
        owns_organisation(organisation_id)
    );

-- CSO reps can insert projects for their organisation
CREATE POLICY "CSO reps can create projects" ON projects
    FOR INSERT WITH CHECK (
        is_cso_rep() AND 
        owns_organisation(organisation_id) AND
        auth.uid() = created_by
    );

-- CSO reps can update their organisation's projects, admins can update any
CREATE POLICY "CSO reps can update own projects" ON projects
    FOR UPDATE USING (
        is_admin() OR owns_organisation(organisation_id)
    ) WITH CHECK (
        is_admin() OR owns_organisation(organisation_id)
    );

-- CSO reps can delete their organisation's projects, admins can delete any
CREATE POLICY "CSO reps can delete own projects" ON projects
    FOR DELETE USING (
        is_admin() OR owns_organisation(organisation_id)
    );

-- =====================================================
-- PROJECT MEDIA POLICIES
-- =====================================================

-- Public can view media for public projects
CREATE POLICY "Public can view project media" ON project_media
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_media.project_id 
            AND (
                public_visibility = true OR
                is_admin() OR
                owns_organisation(organisation_id)
            )
        )
    );

-- CSO reps can manage media for their projects
CREATE POLICY "CSO reps can manage project media" ON project_media
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_media.project_id 
            AND (is_admin() OR owns_organisation(organisation_id))
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_media.project_id 
            AND (is_admin() OR owns_organisation(organisation_id))
        )
    );

-- =====================================================
-- PROJECT MILESTONES POLICIES
-- =====================================================

-- Public can view milestones for public projects
CREATE POLICY "Public can view project milestones" ON project_milestones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_milestones.project_id 
            AND (
                public_visibility = true OR
                is_admin() OR
                owns_organisation(organisation_id)
            )
        )
    );

-- CSO reps can manage milestones for their projects
CREATE POLICY "CSO reps can manage project milestones" ON project_milestones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_milestones.project_id 
            AND (is_admin() OR owns_organisation(organisation_id))
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_milestones.project_id 
            AND (is_admin() OR owns_organisation(organisation_id))
        )
    );

-- =====================================================
-- PROJECT FUNDERS POLICIES
-- =====================================================

-- Public can view funders for public projects (if public_visibility = true)
CREATE POLICY "Public can view project funders" ON project_funders
    FOR SELECT USING (
        public_visibility = true AND
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_funders.project_id 
            AND public_visibility = true
        ) OR
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_funders.project_id 
            AND (is_admin() OR owns_organisation(organisation_id))
        )
    );

-- CSO reps can manage funders for their projects
CREATE POLICY "CSO reps can manage project funders" ON project_funders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_funders.project_id 
            AND (is_admin() OR owns_organisation(organisation_id))
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_funders.project_id 
            AND (is_admin() OR owns_organisation(organisation_id))
        )
    );

-- =====================================================
-- PROJECT EVENTS POLICIES
-- =====================================================

-- Public can view public events
CREATE POLICY "Public can view public project events" ON project_events
    FOR SELECT USING (
        is_public = true OR
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_events.project_id 
            AND (is_admin() OR owns_organisation(organisation_id))
        )
    );

-- CSO reps can manage events for their projects
CREATE POLICY "CSO reps can manage project events" ON project_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_events.project_id 
            AND (is_admin() OR owns_organisation(organisation_id))
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_events.project_id 
            AND (is_admin() OR owns_organisation(organisation_id))
        )
    );

-- =====================================================
-- FORUM POLICIES
-- =====================================================

-- Authenticated users can view forum threads
CREATE POLICY "Authenticated users can view forum threads" ON forum_threads
    FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can create forum threads
CREATE POLICY "Authenticated users can create forum threads" ON forum_threads
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        auth.uid() = author_id
    );

-- Authors and admins can update forum threads
CREATE POLICY "Authors can update own forum threads" ON forum_threads
    FOR UPDATE USING (
        auth.uid() = author_id OR is_admin()
    ) WITH CHECK (
        auth.uid() = author_id OR is_admin()
    );

-- Authors and admins can delete forum threads
CREATE POLICY "Authors can delete own forum threads" ON forum_threads
    FOR DELETE USING (
        auth.uid() = author_id OR is_admin()
    );

-- Forum replies policies (similar to threads)
CREATE POLICY "Authenticated users can view forum replies" ON forum_replies
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create forum replies" ON forum_replies
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        auth.uid() = author_id
    );

CREATE POLICY "Authors can update own forum replies" ON forum_replies
    FOR UPDATE USING (
        auth.uid() = author_id OR is_admin()
    ) WITH CHECK (
        auth.uid() = author_id OR is_admin()
    );

CREATE POLICY "Authors can delete own forum replies" ON forum_replies
    FOR DELETE USING (
        auth.uid() = author_id OR is_admin()
    );

-- =====================================================
-- POSTS POLICIES
-- =====================================================

-- Public can view published posts
CREATE POLICY "Public can view published posts" ON posts
    FOR SELECT USING (
        status = 'published' OR
        auth.uid() = author_id OR
        is_admin() OR
        (organisation_id IS NOT NULL AND owns_organisation(organisation_id))
    );

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts" ON posts
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        auth.uid() = author_id AND
        (organisation_id IS NULL OR owns_organisation(organisation_id) OR is_admin())
    );

-- Authors, organisation members, and admins can update posts
CREATE POLICY "Authors can update own posts" ON posts
    FOR UPDATE USING (
        auth.uid() = author_id OR
        is_admin() OR
        (organisation_id IS NOT NULL AND owns_organisation(organisation_id))
    ) WITH CHECK (
        auth.uid() = author_id OR
        is_admin() OR
        (organisation_id IS NOT NULL AND owns_organisation(organisation_id))
    );

-- Authors, organisation members, and admins can delete posts
CREATE POLICY "Authors can delete own posts" ON posts
    FOR DELETE USING (
        auth.uid() = author_id OR
        is_admin() OR
        (organisation_id IS NOT NULL AND owns_organisation(organisation_id))
    );

-- =====================================================
-- ANALYTICS POLICIES
-- =====================================================

-- Users can view their own analytics, admins can view all
CREATE POLICY "Users can view own analytics" ON analytics_events
    FOR SELECT USING (
        auth.uid() = user_id OR is_admin()
    );

-- System can insert analytics (no user restriction)
CREATE POLICY "System can insert analytics" ON analytics_events
    FOR INSERT WITH CHECK (true);

-- Only admins can update/delete analytics
CREATE POLICY "Only admins can manage analytics" ON analytics_events
    FOR UPDATE USING (is_admin());

CREATE POLICY "Only admins can delete analytics" ON analytics_events
    FOR DELETE USING (is_admin());

-- =====================================================
-- EXPORT JOBS POLICIES
-- =====================================================

-- Users can view their own export jobs, admins can view all
CREATE POLICY "Users can view own export jobs" ON export_jobs
    FOR SELECT USING (
        auth.uid() = user_id OR is_admin()
    );

-- Authenticated users can create export jobs
CREATE POLICY "Users can create export jobs" ON export_jobs
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        auth.uid() = user_id
    );

-- Users can update their own export jobs, admins can update all
CREATE POLICY "Users can update own export jobs" ON export_jobs
    FOR UPDATE USING (
        auth.uid() = user_id OR is_admin()
    ) WITH CHECK (
        auth.uid() = user_id OR is_admin()
    );

-- =====================================================
-- TRANSLATIONS POLICIES
-- =====================================================

-- Authenticated users can view translations
CREATE POLICY "Authenticated users can view translations" ON translations
    FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can create translations
CREATE POLICY "Authenticated users can create translations" ON translations
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        auth.uid() = translator_id
    );

-- Translators and admins can update translations
CREATE POLICY "Translators can update own translations" ON translations
    FOR UPDATE USING (
        auth.uid() = translator_id OR is_admin()
    ) WITH CHECK (
        auth.uid() = translator_id OR is_admin()
    );

-- Only admins can delete translations
CREATE POLICY "Only admins can delete translations" ON translations
    FOR DELETE USING (is_admin());

-- =====================================================
-- PAGES POLICIES
-- =====================================================

-- Public can view published pages
CREATE POLICY "Public can view published pages" ON pages
    FOR SELECT USING (
        is_published = true OR is_admin()
    );

-- Only admins can manage pages
CREATE POLICY "Only admins can manage pages" ON pages
    FOR ALL USING (is_admin()) 
    WITH CHECK (is_admin());

-- =====================================================
-- AUDIT LOGS POLICIES
-- =====================================================

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" ON audit_logs
    FOR SELECT USING (is_admin());

-- System can insert audit logs (no user restriction)
CREATE POLICY "System can insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (true);

-- Only admins can delete audit logs (no updates allowed)
CREATE POLICY "Only admins can delete audit logs" ON audit_logs
    FOR DELETE USING (is_admin());

-- =====================================================
-- USER FAVORITES POLICIES
-- =====================================================

-- Users can view their own favorites
CREATE POLICY "Users can view own favorites" ON user_favorites
    FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own favorites
CREATE POLICY "Users can manage own favorites" ON user_favorites
    FOR ALL USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- NOTIFICATIONS POLICIES
-- =====================================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

-- System can create notifications, users can update their own
CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications" ON notifications
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- ORGANISATION COLLABORATIONS POLICIES
-- =====================================================

-- Public can view active collaborations
CREATE POLICY "Public can view active collaborations" ON organisation_collaborations
    FOR SELECT USING (
        is_active = true OR
        owns_organisation(organisation1_id) OR
        owns_organisation(organisation2_id) OR
        is_admin()
    );

-- Organisation reps can create collaborations involving their organisation
CREATE POLICY "Organisation reps can create collaborations" ON organisation_collaborations
    FOR INSERT WITH CHECK (
        is_cso_rep() AND (
            owns_organisation(organisation1_id) OR 
            owns_organisation(organisation2_id)
        )
    );

-- Organisation reps can update collaborations involving their organisation
CREATE POLICY "Organisation reps can update collaborations" ON organisation_collaborations
    FOR UPDATE USING (
        is_admin() OR
        owns_organisation(organisation1_id) OR
        owns_organisation(organisation2_id)
    ) WITH CHECK (
        is_admin() OR
        owns_organisation(organisation1_id) OR
        owns_organisation(organisation2_id)
    );

-- Organisation reps can delete collaborations involving their organisation
CREATE POLICY "Organisation reps can delete collaborations" ON organisation_collaborations
    FOR DELETE USING (
        is_admin() OR
        owns_organisation(organisation1_id) OR
        owns_organisation(organisation2_id)
    );

-- =====================================================
-- READ-ONLY TABLES POLICIES (Reference Data)
-- =====================================================

-- Public can view sectors
CREATE POLICY "Public can view sectors" ON sectors
    FOR SELECT USING (true);

-- Only admins can manage sectors
CREATE POLICY "Only admins can manage sectors" ON sectors
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Public can view forum categories
CREATE POLICY "Public can view forum categories" ON forum_categories
    FOR SELECT USING (is_active = true OR is_admin());

-- Only admins can manage forum categories
CREATE POLICY "Only admins can manage forum categories" ON forum_categories
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- =====================================================
-- SECURITY NOTES
-- =====================================================

/*
IMPORTANT SECURITY CONSIDERATIONS:

1. **Function Security**: All helper functions are marked as SECURITY DEFINER
   to ensure they run with elevated privileges for RLS evaluation.

2. **Data Isolation**: Each policy ensures proper data isolation between
   organisations while allowing appropriate public access.

3. **Admin Override**: Admins have full access to all data for platform
   management while maintaining audit trails.

4. **Role Security**: CRITICAL - Users cannot self-assign admin roles:
   - Regular users can only create/update profiles with non-admin roles
   - Only existing admins can create new admin accounts
   - Separate policies prevent privilege escalation attacks

5. **Public Access**: Public users can view active, approved organisations
   and their public projects/content to facilitate collaboration.

6. **Audit Trail**: All sensitive operations are logged in audit_logs
   table with proper user attribution.

7. **Storage Security**: File URLs in the database should be combined with
   Supabase Storage RLS policies to ensure files are only accessible
   to authorized users.

RECOMMENDED SUPABASE STORAGE POLICIES:

For organisation logos, project media, etc., create Storage policies like:
- Public read access for published content
- Upload/delete access only for organisation members
- Admin override for all operations

Example Storage RLS policy:
```sql
CREATE POLICY "Organisation members can upload files" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'organisation-media' AND 
    (auth.role() = 'authenticated') AND
    -- Additional checks based on folder structure
);
```
*/ 