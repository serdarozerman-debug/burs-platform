-- RLS POLICY FIX - SignUp için düzeltme
-- SignUp sırasında kullanıcı henüz authenticated değil!
-- Bu yüzden anon kullanıcılar da kendi user_id ile INSERT yapabilmeli

-- STEP 1: Mevcut RLS policies'i kaldır
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;

-- STEP 2: Yeni policies ekle

-- ==========================================
-- USER_PROFILES POLICIES
-- ==========================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (signup için)
DROP POLICY IF EXISTS "Anyone can insert user profile" ON user_profiles;
CREATE POLICY "Anyone can insert user profile"
ON user_profiles
FOR INSERT
TO anon, authenticated
WITH CHECK (true);  -- Backend validation yapar

-- Users can view own profile
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
ON user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can update own profile
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
ON user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ==========================================
-- STUDENTS POLICIES
-- ==========================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (signup için)
DROP POLICY IF EXISTS "Anyone can insert student" ON students;
CREATE POLICY "Anyone can insert student"
ON students
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Students can view own profile
DROP POLICY IF EXISTS "Students can view own profile" ON students;
CREATE POLICY "Students can view own profile"
ON students
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Students can update own profile
DROP POLICY IF EXISTS "Students can update own profile" ON students;
CREATE POLICY "Students can update own profile"
ON students
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- ORGANIZATIONS POLICIES
-- ==========================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (signup için)
DROP POLICY IF EXISTS "Anyone can insert organization" ON organizations;
CREATE POLICY "Anyone can insert organization"
ON organizations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Organizations can view own profile
DROP POLICY IF EXISTS "Organizations can view own profile" ON organizations;
CREATE POLICY "Organizations can view own profile"
ON organizations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Organizations can update own profile
DROP POLICY IF EXISTS "Organizations can update own profile" ON organizations;
CREATE POLICY "Organizations can update own profile"
ON organizations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Everyone can view verified organizations (for public listing)
DROP POLICY IF EXISTS "Anyone can view verified organizations" ON organizations;
CREATE POLICY "Anyone can view verified organizations"
ON organizations
FOR SELECT
TO anon, authenticated
USING (is_verified = true);

-- ==========================================
-- SCHOLARSHIPS POLICIES
-- ==========================================
-- Everyone can view active scholarships
DROP POLICY IF EXISTS "Anyone can view active scholarships" ON scholarships;

CREATE POLICY "Anyone can view active scholarships"
ON scholarships
FOR SELECT
TO anon, authenticated
USING (is_active = true AND is_published = true);

-- Organizations can insert own scholarships
DROP POLICY IF EXISTS "Organizations can insert own scholarships" ON scholarships;

CREATE POLICY "Organizations can insert own scholarships"
ON scholarships
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM organizations
    WHERE id = organization_id
    AND user_id = auth.uid()
  )
);

-- Organizations can update own scholarships
DROP POLICY IF EXISTS "Organizations can update own scholarships" ON scholarships;

CREATE POLICY "Organizations can update own scholarships"
ON scholarships
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM organizations
    WHERE id = organization_id
    AND user_id = auth.uid()
  )
);

-- Verify
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename IN ('user_profiles', 'students', 'organizations', 'scholarships')
ORDER BY tablename, policyname;

