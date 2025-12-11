-- ============================================
-- BURS PLATFORM v3.0 DATABASE MIGRATION
-- ============================================
-- Date: 2025-11-10
-- Description: Adds admin panel, analytics, recommendations, and messaging features
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: CREATE NEW TABLES
-- ============================================

-- Admin users table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
    permissions JSONB DEFAULT '{}',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Admin activity log
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50), -- 'organization', 'scholarship', 'user', 'application'
    target_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Approval queue
CREATE TABLE IF NOT EXISTS approval_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('organization', 'scholarship')),
    item_id UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_by UUID REFERENCES admins(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    notes TEXT
);

-- Page views tracking
CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    page_type VARCHAR(50), -- 'scholarship', 'organization', 'profile', 'home'
    page_id UUID,
    referrer TEXT,
    user_agent TEXT,
    ip_address VARCHAR(45),
    session_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    pages_viewed INTEGER DEFAULT 0,
    actions_taken INTEGER DEFAULT 0,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scholarship recommendations
CREATE TABLE IF NOT EXISTS scholarship_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
    score DECIMAL(3, 2) CHECK (score >= 0 AND score <= 1), -- 0.00 to 1.00
    reason JSONB, -- {"education_match": true, "gpa_match": true, ...}
    is_viewed BOOLEAN DEFAULT FALSE,
    is_applied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(student_id, scholarship_id)
);

-- Messages (organization <-> student communication)
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    to_user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    related_type VARCHAR(50), -- 'application', 'scholarship', null
    related_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events (general event tracking)
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    properties JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 2: UPDATE EXISTING TABLES
-- ============================================

-- Add approval status to organizations
ALTER TABLE organizations 
    ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES admins(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Add approval status and view tracking to scholarships
ALTER TABLE scholarships 
    ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES admins(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
    ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS unique_view_count INTEGER DEFAULT 0;

-- Add rating and review to applications
ALTER TABLE applications 
    ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    ADD COLUMN IF NOT EXISTS reviewed_notes TEXT,
    ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;

-- ============================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);

CREATE INDEX IF NOT EXISTS idx_admin_activity_log_admin_id ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON admin_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_target ON admin_activity_log(target_type, target_id);

CREATE INDEX IF NOT EXISTS idx_approval_queue_status ON approval_queue(status);
CREATE INDEX IF NOT EXISTS idx_approval_queue_type_id ON approval_queue(item_type, item_id);

CREATE INDEX IF NOT EXISTS idx_page_views_user_id ON page_views(user_id);
CREATE INDEX IF NOT EXISTS idx_page_views_page ON page_views(page_type, page_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_started_at ON user_sessions(started_at DESC);

CREATE INDEX IF NOT EXISTS idx_recommendations_student ON scholarship_recommendations(student_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_scholarship ON scholarship_recommendations(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_score ON scholarship_recommendations(score DESC);

CREATE INDEX IF NOT EXISTS idx_messages_from_user ON messages(from_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_to_user ON messages(to_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_related ON messages(related_type, related_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_organizations_approval ON organizations(approval_status);
CREATE INDEX IF NOT EXISTS idx_scholarships_approval ON scholarships(approval_status);
CREATE INDEX IF NOT EXISTS idx_scholarships_views ON scholarships(view_count DESC);

-- ============================================
-- STEP 4: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on new tables
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Admins policies
CREATE POLICY "Admins can view all admins"
    ON admins FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.user_id = auth.uid()
        )
    );

CREATE POLICY "Super admins can manage admins"
    ON admins FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.user_id = auth.uid()
            AND admins.role = 'super_admin'
        )
    );

-- Admin activity log policies
CREATE POLICY "Admins can view activity log"
    ON admin_activity_log FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.user_id = auth.uid()
        )
    );

CREATE POLICY "System can insert activity log"
    ON admin_activity_log FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Approval queue policies
CREATE POLICY "Admins can view approval queue"
    ON approval_queue FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can update approval queue"
    ON approval_queue FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.user_id = auth.uid()
        )
    );

-- Page views policies (anyone can insert, only admins can read)
CREATE POLICY "Anyone can insert page views"
    ON page_views FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Admins can view page views"
    ON page_views FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.user_id = auth.uid()
        )
    );

-- User sessions policies
CREATE POLICY "Users can manage own sessions"
    ON user_sessions FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

-- Scholarship recommendations policies
CREATE POLICY "Students can view own recommendations"
    ON scholarship_recommendations FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM students
            WHERE students.id = scholarship_recommendations.student_id
            AND students.user_id = auth.uid()
        )
    );

CREATE POLICY "System can manage recommendations"
    ON scholarship_recommendations FOR ALL
    TO service_role
    USING (true);

-- Messages policies
CREATE POLICY "Users can view own messages"
    ON messages FOR SELECT
    TO authenticated
    USING (
        from_user_id = auth.uid() OR to_user_id = auth.uid()
    );

CREATE POLICY "Users can send messages"
    ON messages FOR INSERT
    TO authenticated
    WITH CHECK (from_user_id = auth.uid());

CREATE POLICY "Users can update messages they received"
    ON messages FOR UPDATE
    TO authenticated
    USING (to_user_id = auth.uid());

-- Analytics events policies
CREATE POLICY "Anyone can insert analytics"
    ON analytics_events FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Admins can view analytics"
    ON analytics_events FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.user_id = auth.uid()
        )
    );

-- Updated policies for organizations (approval status)
DROP POLICY IF EXISTS "Public can view approved organizations" ON organizations;
CREATE POLICY "Public can view approved organizations"
    ON organizations FOR SELECT
    USING (
        approval_status = 'approved' 
        OR user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM admins WHERE admins.user_id = auth.uid()
        )
    );

-- Updated policies for scholarships (approval status)
DROP POLICY IF EXISTS "Public can view approved scholarships" ON scholarships;
CREATE POLICY "Public can view approved scholarships"
    ON scholarships FOR SELECT
    USING (
        approval_status = 'approved' 
        OR created_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM admins WHERE admins.user_id = auth.uid()
        )
    );

-- ============================================
-- STEP 5: FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update scholarship view count
CREATE OR REPLACE FUNCTION increment_scholarship_views(scholarship_uuid UUID, is_unique BOOLEAN DEFAULT FALSE)
RETURNS void AS $$
BEGIN
    UPDATE scholarships
    SET 
        view_count = view_count + 1,
        unique_view_count = CASE WHEN is_unique THEN unique_view_count + 1 ELSE unique_view_count END
    WHERE id = scholarship_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recommendations_updated_at BEFORE UPDATE ON scholarship_recommendations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create approval queue entry when organization/scholarship created
CREATE OR REPLACE FUNCTION create_approval_queue_entry()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO approval_queue (item_type, item_id, status, submitted_at)
    VALUES (
        CASE 
            WHEN TG_TABLE_NAME = 'organizations' THEN 'organization'
            WHEN TG_TABLE_NAME = 'scholarships' THEN 'scholarship'
        END,
        NEW.id,
        'pending',
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for auto-approval queue
CREATE TRIGGER org_approval_queue_trigger
    AFTER INSERT ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION create_approval_queue_entry();

CREATE TRIGGER scholarship_approval_queue_trigger
    AFTER INSERT ON scholarships
    FOR EACH ROW
    EXECUTE FUNCTION create_approval_queue_entry();

-- ============================================
-- STEP 6: VIEWS FOR ANALYTICS
-- ============================================

-- View: Daily active users
CREATE OR REPLACE VIEW daily_active_users AS
SELECT 
    DATE(created_at) as date,
    COUNT(DISTINCT user_id) as dau
FROM user_sessions
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- View: Monthly active users
CREATE OR REPLACE VIEW monthly_active_users AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(DISTINCT user_id) as mau
FROM user_sessions
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- View: Platform KPIs
CREATE OR REPLACE VIEW platform_kpis AS
SELECT
    (SELECT COUNT(*) FROM user_profiles) as total_users,
    (SELECT COUNT(*) FROM students) as total_students,
    (SELECT COUNT(*) FROM organizations WHERE approval_status = 'approved') as total_organizations,
    (SELECT COUNT(*) FROM scholarships WHERE approval_status = 'approved') as total_scholarships,
    (SELECT COUNT(*) FROM applications) as total_applications,
    (SELECT COUNT(*) FROM applications WHERE status = 'pending') as pending_applications,
    (SELECT COUNT(*) FROM approval_queue WHERE status = 'pending') as pending_approvals,
    (SELECT SUM(view_count) FROM scholarships) as total_views;

-- View: Top scholarships by views
CREATE OR REPLACE VIEW top_scholarships_by_views AS
SELECT 
    s.id,
    s.title,
    s.view_count,
    s.unique_view_count,
    o.name as organization_name,
    (SELECT COUNT(*) FROM applications WHERE scholarship_id = s.id) as application_count
FROM scholarships s
LEFT JOIN organizations o ON s.organization_id = o.id
WHERE s.approval_status = 'approved'
ORDER BY s.view_count DESC
LIMIT 10;

-- View: Organization performance
CREATE OR REPLACE VIEW organization_performance AS
SELECT 
    o.id,
    o.name,
    o.approval_status,
    COUNT(s.id) as scholarship_count,
    SUM(s.view_count) as total_views,
    COUNT(a.id) as total_applications,
    AVG(a.rating) as average_rating
FROM organizations o
LEFT JOIN scholarships s ON s.organization_id = o.id
LEFT JOIN applications a ON a.scholarship_id = s.id
GROUP BY o.id, o.name, o.approval_status;

-- ============================================
-- STEP 7: INSERT DEFAULT DATA
-- ============================================

-- Create first admin (REPLACE user_id with your user's UUID)
-- Get your user_id from: SELECT id FROM auth.users WHERE email = 'your-email@example.com';
-- INSERT INTO admins (user_id, role, permissions)
-- VALUES ('YOUR-USER-UUID-HERE', 'super_admin', '{"all": true}');

-- ============================================
-- MIGRATION COMPLETE!
-- ============================================

-- Verify migration
SELECT 
    'Tables' as category,
    COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN (
        'admins', 'admin_activity_log', 'approval_queue',
        'page_views', 'user_sessions', 'scholarship_recommendations',
        'messages', 'analytics_events'
    )

UNION ALL

SELECT 
    'Indexes' as category,
    COUNT(*) as count
FROM pg_indexes
WHERE schemaname = 'public'
    AND tablename IN (
        'admins', 'admin_activity_log', 'approval_queue',
        'page_views', 'user_sessions', 'scholarship_recommendations',
        'messages', 'analytics_events'
    )

UNION ALL

SELECT 
    'Policies' as category,
    COUNT(*) as count
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename IN (
        'admins', 'admin_activity_log', 'approval_queue',
        'page_views', 'user_sessions', 'scholarship_recommendations',
        'messages', 'analytics_events'
    );

-- Expected results:
-- Tables: 8
-- Indexes: ~20
-- Policies: ~15

-- ============================================
-- NOTES & NEXT STEPS
-- ============================================
-- 1. Don't forget to create your first admin user (Step 7)
-- 2. Update environment variables in your app
-- 3. Deploy frontend with new admin panel
-- 4. Test approval workflows
-- 5. Monitor analytics in admin dashboard
