-- BURS PLATFORM v2.0 - DATABASE SCHEMA
-- Full-Stack Platform with Multi-User Support

-- =============================================================================
-- 1. USERS & ROLES
-- =============================================================================

-- User roles enum
CREATE TYPE user_role AS ENUM ('student', 'organization', 'admin');

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL,
  full_name TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- 2. ORGANIZATIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT, -- 'vakıf', 'kamu', 'belediye', etc.
  website TEXT,
  logo_url TEXT,
  description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  verified BOOLEAN DEFAULT false, -- Admin onayı gerekli
  verification_document_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_organizations_user ON organizations(user_id);
CREATE INDEX idx_organizations_verified ON organizations(verified);

-- =============================================================================
-- 3. STUDENTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  tc_no TEXT, -- Encrypted
  birth_date DATE,
  gender TEXT,
  phone TEXT,
  city TEXT,
  district TEXT,
  
  -- Eğitim Bilgileri
  education_level TEXT, -- 'lise', 'lisans', 'yükseklisans', 'doktora'
  university TEXT,
  faculty TEXT,
  department TEXT,
  grade_level INTEGER, -- Kaçıncı sınıf
  gpa NUMERIC(3,2),
  start_year INTEGER,
  expected_graduation_year INTEGER,
  
  -- Profil
  profile_photo_url TEXT,
  bio TEXT,
  interests TEXT[],
  
  -- Wallet & Preferences
  preferred_scholarship_types TEXT[],
  min_amount INTEGER,
  preferred_locations TEXT[],
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_students_user ON students(user_id);
CREATE INDEX idx_students_education ON students(education_level);

-- =============================================================================
-- 4. SCHOLARSHIPS (Updated)
-- =============================================================================

-- Scholarship status enum
CREATE TYPE scholarship_status AS ENUM ('draft', 'active', 'closed', 'expired');

ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS created_by_user_id UUID REFERENCES users(id);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS status scholarship_status DEFAULT 'active';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public'; -- 'public', 'private'
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS quota INTEGER;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS filled_quota INTEGER DEFAULT 0;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS application_count INTEGER DEFAULT 0;

CREATE INDEX idx_scholarships_organization ON scholarships(organization_id);
CREATE INDEX idx_scholarships_status ON scholarships(status);
CREATE INDEX idx_scholarships_creator ON scholarships(created_by_user_id);

-- =============================================================================
-- 5. APPLICATIONS (Updated)
-- =============================================================================

CREATE TYPE application_status AS ENUM ('draft', 'submitted', 'under_review', 'shortlisted', 'approved', 'rejected', 'withdrawn');

CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  
  -- Application Data
  status application_status DEFAULT 'draft',
  submitted_at TIMESTAMP,
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),
  reviewer_notes TEXT,
  
  -- Student Submitted Data
  application_data JSONB, -- Form yanıtları
  uploaded_documents JSONB, -- {document_type: file_url}
  
  -- Tracking
  last_updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(scholarship_id, student_id) -- Bir öğrenci bir bursa bir kez başvurabilir
);

CREATE INDEX idx_applications_scholarship ON applications(scholarship_id);
CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_status ON applications(status);

-- =============================================================================
-- 6. STUDENT WALLET
-- =============================================================================

CREATE TYPE wallet_item_status AS ENUM ('favorite', 'applied', 'shortlisted', 'matched', 'won');

CREATE TABLE IF NOT EXISTS public.student_wallet (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
  
  status wallet_item_status DEFAULT 'favorite',
  match_score INTEGER, -- 0-100, AI hesaplanan eşleşme skoru
  notes TEXT, -- Öğrencinin notları
  reminder_date TIMESTAMP,
  
  added_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(student_id, scholarship_id)
);

CREATE INDEX idx_wallet_student ON student_wallet(student_id);
CREATE INDEX idx_wallet_scholarship ON student_wallet(scholarship_id);
CREATE INDEX idx_wallet_status ON student_wallet(status);

-- =============================================================================
-- 7. DOCUMENTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  
  document_type TEXT NOT NULL, -- 'identity', 'transcript', 'photo', 'other'
  canonical_type TEXT, -- Normalized type from document_normalizer
  
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL, -- Supabase Storage URL
  file_size INTEGER,
  mime_type TEXT,
  
  verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  
  uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_documents_student ON documents(student_id);
CREATE INDEX idx_documents_application ON documents(application_id);
CREATE INDEX idx_documents_type ON documents(document_type);

-- =============================================================================
-- 8. CHATBOT SESSIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.chatbot_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- nullable for anonymous
  session_id TEXT UNIQUE NOT NULL,
  
  messages JSONB[], -- [{role: 'user'|'assistant', content: '...', timestamp: '...'}]
  context JSONB, -- Student profile, preferences
  
  created_at TIMESTAMP DEFAULT NOW(),
  last_message_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chatbot_user ON chatbot_sessions(user_id);
CREATE INDEX idx_chatbot_session ON chatbot_sessions(session_id);

-- =============================================================================
-- 9. NOTIFICATIONS
-- =============================================================================

CREATE TYPE notification_type AS ENUM ('application_update', 'new_scholarship', 'deadline_reminder', 'message');

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- =============================================================================
-- 10. ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users: Can only see/edit their own data
CREATE POLICY users_own_data ON users
  FOR ALL USING (auth.uid() = id);

-- Organizations: Own data + public view
CREATE POLICY org_own_data ON organizations
  FOR ALL USING (user_id = (SELECT id FROM users WHERE id = auth.uid()));

CREATE POLICY org_public_view ON organizations
  FOR SELECT USING (verified = true);

-- Students: Own data only
CREATE POLICY student_own_data ON students
  FOR ALL USING (user_id = (SELECT id FROM users WHERE id = auth.uid()));

-- Scholarships: Public view, own edit
CREATE POLICY scholarship_public_view ON scholarships
  FOR SELECT USING (visibility = 'public' AND status = 'active');

CREATE POLICY scholarship_org_manage ON scholarships
  FOR ALL USING (
    created_by_user_id = auth.uid() OR
    organization_id IN (SELECT id FROM organizations WHERE user_id = auth.uid())
  );

-- Applications: Student sees own, Org sees their scholarships
CREATE POLICY application_student_view ON applications
  FOR ALL USING (
    student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
  );

CREATE POLICY application_org_view ON applications
  FOR SELECT USING (
    scholarship_id IN (
      SELECT id FROM scholarships WHERE organization_id IN (
        SELECT id FROM organizations WHERE user_id = auth.uid()
      )
    )
  );

-- Wallet: Student only
CREATE POLICY wallet_student_only ON student_wallet
  FOR ALL USING (
    student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
  );

-- Documents: Student only
CREATE POLICY documents_student_only ON documents
  FOR ALL USING (
    student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
  );

-- Notifications: User only
CREATE POLICY notifications_own_data ON notifications
  FOR ALL USING (user_id = auth.uid());

-- Chatbot: User only (or anonymous)
CREATE POLICY chatbot_own_sessions ON chatbot_sessions
  FOR ALL USING (user_id = auth.uid() OR user_id IS NULL);

-- =============================================================================
-- 11. FUNCTIONS & TRIGGERS
-- =============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scholarships_updated_at BEFORE UPDATE ON scholarships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE users IS 'Main users table (extends auth.users)';
COMMENT ON TABLE organizations IS 'Scholarship organizations (foundations, government, etc.)';
COMMENT ON TABLE students IS 'Student profiles with education and personal info';
COMMENT ON TABLE scholarships IS 'Scholarship listings';
COMMENT ON TABLE applications IS 'Student scholarship applications';
COMMENT ON TABLE student_wallet IS 'Student scholarship favorites and matches';
COMMENT ON TABLE documents IS 'Student uploaded documents';
COMMENT ON TABLE chatbot_sessions IS 'AI chatbot conversation history';
COMMENT ON TABLE notifications IS 'User notifications';

