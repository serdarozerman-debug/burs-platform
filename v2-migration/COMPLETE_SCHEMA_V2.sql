-- ================================================
-- BURS PLATFORM v2.0 - COMPLETE DATABASE SCHEMA
-- ================================================
-- Created: 2025-11-10
-- Purpose: Full platform with auth, wallet, applications
-- ================================================

-- ================================================
-- 1. AUTHENTICATION & USER MANAGEMENT
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Supabase Auth integration)
-- Bu tablo Supabase Auth tarafından otomatik oluşturulur
-- Biz sadece reference ediyoruz: auth.users

-- User roles enum
CREATE TYPE user_role AS ENUM ('student', 'organization', 'admin');

-- User profiles table (extends auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 2. ORGANIZATION (KURUM) TABLES
-- ================================================

-- Organization types
CREATE TYPE organization_type AS ENUM (
    'vakıf',
    'kamu',
    'belediye',
    'üniversite',
    'dernek',
    'uluslararası',
    'özel'
);

-- Organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    type organization_type NOT NULL,
    description TEXT,
    website VARCHAR(255),
    logo_url TEXT,
    
    -- Contact info
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Türkiye',
    
    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verification_document_url TEXT,
    
    -- Stats
    total_scholarships INTEGER DEFAULT 0,
    total_applications INTEGER DEFAULT 0,
    
    -- Meta
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 3. STUDENT TABLES
-- ================================================

-- Education level enum
CREATE TYPE education_level AS ENUM (
    'lise',
    'önlisans',
    'lisans',
    'yükseklisans',
    'doktora'
);

-- Students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Personal info
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    tc_no VARCHAR(11) UNIQUE,
    date_of_birth DATE,
    gender VARCHAR(20),
    
    -- Contact
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    district VARCHAR(100),
    
    -- Education
    current_education_level education_level,
    university VARCHAR(255),
    department VARCHAR(255),
    year_of_study INTEGER,
    gpa DECIMAL(3, 2),
    
    -- Financial
    monthly_income DECIMAL(10, 2),
    family_monthly_income DECIMAL(10, 2),
    
    -- Disabilities/Special status
    has_disability BOOLEAN DEFAULT FALSE,
    disability_type VARCHAR(255),
    disability_percentage INTEGER,
    
    -- Profile completion
    profile_completion_percentage INTEGER DEFAULT 0,
    
    -- Meta
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 4. SCHOLARSHIPS TABLE (UPDATED)
-- ================================================

-- Scholarship type enum
CREATE TYPE scholarship_type AS ENUM (
    'akademik',
    'ihtiyaç',
    'engelli',
    'sporcu',
    'sanatçı',
    'girişimci'
);

-- Amount type enum
CREATE TYPE amount_type AS ENUM ('aylık', 'yıllık', 'tek seferlik');

-- Scholarships table (expanded)
CREATE TABLE scholarships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Organization relationship
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Basic info
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    
    -- Financial
    amount DECIMAL(10, 2) NOT NULL,
    amount_type amount_type DEFAULT 'aylık',
    currency VARCHAR(10) DEFAULT 'TRY',
    
    -- Dates
    deadline DATE,
    start_date DATE,
    end_date DATE,
    application_start_date DATE,
    
    -- Categories
    type scholarship_type DEFAULT 'akademik',
    education_level education_level NOT NULL,
    field VARCHAR(255), -- Alan (Mühendislik, Tıp, vs.)
    
    -- Requirements
    min_gpa DECIMAL(3, 2),
    max_age INTEGER,
    min_age INTEGER,
    required_documents TEXT[], -- Array of document types
    eligibility_criteria TEXT,
    
    -- Application
    application_url TEXT,
    application_method VARCHAR(50), -- 'online', 'email', 'in_person'
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    
    -- Quota
    total_quota INTEGER,
    remaining_quota INTEGER,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_published BOOLEAN DEFAULT FALSE,
    
    -- Stats
    view_count INTEGER DEFAULT 0,
    application_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Meta
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 5. APPLICATIONS SYSTEM
-- ================================================

-- Application status enum
CREATE TYPE application_status AS ENUM (
    'draft',
    'submitted',
    'under_review',
    'approved',
    'rejected',
    'withdrawn'
);

-- Applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relationships
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
    
    -- Status
    status application_status DEFAULT 'draft',
    
    -- Cover letter / motivation
    cover_letter TEXT,
    
    -- Reviewer notes (for organization)
    reviewer_notes TEXT,
    reviewed_by UUID REFERENCES user_profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    -- Important dates
    submitted_at TIMESTAMP WITH TIME ZONE,
    decision_date TIMESTAMP WITH TIME ZONE,
    
    -- Meta
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(student_id, scholarship_id)
);

-- ================================================
-- 6. BURS WALLET (DOCUMENT MANAGEMENT)
-- ================================================

-- Document type enum
CREATE TYPE document_type AS ENUM (
    'kimlik',
    'nufus_cuzdani',
    'ogrenci_belgesi',
    'transkript',
    'diploma',
    'gelir_belgesi',
    'ikamet_belgesi',
    'saglik_raporu',
    'engelli_raporu',
    'foto',
    'cv',
    'referans_mektubu',
    'motivasyon_mektubu',
    'banka_hesap_bilgileri',
    'veli_onay_formu',
    'diger'
);

-- Document verification status
CREATE TYPE verification_status AS ENUM (
    'pending',
    'verified',
    'rejected'
);

-- Wallet documents table
CREATE TABLE wallet_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Owner
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    
    -- Document info
    document_type document_type NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER, -- bytes
    file_type VARCHAR(50), -- PDF, JPG, etc.
    
    -- Verification
    verification_status verification_status DEFAULT 'pending',
    verified_by UUID REFERENCES user_profiles(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    -- Expiration (for time-sensitive documents)
    expires_at DATE,
    
    -- Meta
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Application documents (linking wallet to applications)
CREATE TABLE application_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    wallet_document_id UUID REFERENCES wallet_documents(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(application_id, wallet_document_id)
);

-- ================================================
-- 7. FAVORITES & BOOKMARKS
-- ================================================

CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(student_id, scholarship_id)
);

-- ================================================
-- 8. CHATBOT CONVERSATIONS
-- ================================================

CREATE TABLE chatbot_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    
    -- Conversation metadata
    title VARCHAR(255),
    
    -- Context for matching
    student_context JSONB, -- Student preferences, requirements
    
    -- Meta
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE chatbot_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES chatbot_conversations(id) ON DELETE CASCADE,
    
    -- Message content
    role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    
    -- Scholarships recommended in this message
    recommended_scholarships UUID[],
    
    -- Meta
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 9. NOTIFICATIONS
-- ================================================

CREATE TYPE notification_type AS ENUM (
    'application_status',
    'new_scholarship',
    'deadline_reminder',
    'document_verification',
    'message'
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    
    -- Links
    link_url TEXT,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Meta
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 10. INDEXES FOR PERFORMANCE
-- ================================================

-- User profiles
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- Organizations
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_type ON organizations(type);
CREATE INDEX idx_organizations_verified ON organizations(is_verified);

-- Students
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_education_level ON students(current_education_level);

-- Scholarships
CREATE INDEX idx_scholarships_org_id ON scholarships(organization_id);
CREATE INDEX idx_scholarships_type ON scholarships(type);
CREATE INDEX idx_scholarships_education_level ON scholarships(education_level);
CREATE INDEX idx_scholarships_deadline ON scholarships(deadline);
CREATE INDEX idx_scholarships_active ON scholarships(is_active, is_published);
CREATE INDEX idx_scholarships_slug ON scholarships(slug);

-- Applications
CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_scholarship ON applications(scholarship_id);
CREATE INDEX idx_applications_status ON applications(status);

-- Wallet documents
CREATE INDEX idx_wallet_docs_student ON wallet_documents(student_id);
CREATE INDEX idx_wallet_docs_type ON wallet_documents(document_type);
CREATE INDEX idx_wallet_docs_verification ON wallet_documents(verification_status);

-- Favorites
CREATE INDEX idx_favorites_student ON favorites(student_id);
CREATE INDEX idx_favorites_scholarship ON favorites(scholarship_id);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- ================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Organizations policies
CREATE POLICY "Organizations can manage their own data"
    ON organizations FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view verified organizations"
    ON organizations FOR SELECT
    USING (is_verified = TRUE);

-- Students policies
CREATE POLICY "Students can manage their own data"
    ON students FOR ALL
    USING (auth.uid() = user_id);

-- Scholarships policies
CREATE POLICY "Anyone can view published scholarships"
    ON scholarships FOR SELECT
    USING (is_published = TRUE AND is_active = TRUE);

CREATE POLICY "Organizations can manage their scholarships"
    ON scholarships FOR ALL
    USING (
        organization_id IN (
            SELECT id FROM organizations WHERE user_id = auth.uid()
        )
    );

-- Applications policies
CREATE POLICY "Students can manage their applications"
    ON applications FOR ALL
    USING (
        student_id IN (
            SELECT id FROM students WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Organizations can view applications for their scholarships"
    ON applications FOR SELECT
    USING (
        scholarship_id IN (
            SELECT id FROM scholarships WHERE organization_id IN (
                SELECT id FROM organizations WHERE user_id = auth.uid()
            )
        )
    );

-- Wallet documents policies
CREATE POLICY "Students can manage their wallet documents"
    ON wallet_documents FOR ALL
    USING (
        student_id IN (
            SELECT id FROM students WHERE user_id = auth.uid()
        )
    );

-- Favorites policies
CREATE POLICY "Students can manage their favorites"
    ON favorites FOR ALL
    USING (
        student_id IN (
            SELECT id FROM students WHERE user_id = auth.uid()
        )
    );

-- Chatbot policies
CREATE POLICY "Users can manage their conversations"
    ON chatbot_conversations FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages in their conversations"
    ON chatbot_messages FOR SELECT
    USING (
        conversation_id IN (
            SELECT id FROM chatbot_conversations WHERE user_id = auth.uid()
        )
    );

-- Notifications policies
CREATE POLICY "Users can view their notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- ================================================
-- 12. FUNCTIONS & TRIGGERS
-- ================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scholarships_updated_at BEFORE UPDATE ON scholarships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update scholarship stats when application is created
CREATE OR REPLACE FUNCTION update_scholarship_application_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE scholarships
        SET application_count = application_count + 1
        WHERE id = NEW.scholarship_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE scholarships
        SET application_count = application_count - 1
        WHERE id = OLD.scholarship_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_scholarship_stats_on_application
AFTER INSERT OR DELETE ON applications
FOR EACH ROW EXECUTE FUNCTION update_scholarship_application_count();

-- Update favorite count
CREATE OR REPLACE FUNCTION update_scholarship_favorite_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE scholarships
        SET favorite_count = favorite_count + 1
        WHERE id = NEW.scholarship_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE scholarships
        SET favorite_count = favorite_count - 1
        WHERE id = OLD.scholarship_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_scholarship_stats_on_favorite
AFTER INSERT OR DELETE ON favorites
FOR EACH ROW EXECUTE FUNCTION update_scholarship_favorite_count();

-- Calculate student profile completion
CREATE OR REPLACE FUNCTION calculate_profile_completion(student_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
    total_fields INTEGER := 20;
    filled_fields INTEGER := 0;
    student_row RECORD;
BEGIN
    SELECT * INTO student_row FROM students WHERE id = student_id_param;
    
    IF student_row.first_name IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF student_row.last_name IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF student_row.tc_no IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF student_row.date_of_birth IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF student_row.gender IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF student_row.phone IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF student_row.address IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF student_row.city IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF student_row.district IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF student_row.current_education_level IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF student_row.university IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF student_row.department IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF student_row.year_of_study IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF student_row.gpa IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF student_row.monthly_income IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF student_row.family_monthly_income IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    
    RETURN (filled_fields * 100 / total_fields);
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- 13. INITIAL DATA / SEED
-- ================================================

-- Insert admin user (run after Supabase Auth user is created)
-- This is an example, actual admin should be created via Supabase Auth first

-- ================================================
-- END OF SCHEMA
-- ================================================

