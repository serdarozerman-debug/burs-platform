-- RLS POLICY FIX - User Registration
-- Supabase SQL Editor'da çalıştırın

-- user_profiles için INSERT policy (yeni kullanıcı kaydı için)
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

CREATE POLICY "Users can insert their own profile"
ON user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- user_profiles için UPDATE policy
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Users can update own profile"
ON user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- user_profiles için SELECT policy
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;

CREATE POLICY "Users can view own profile"
ON user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- students için INSERT policy
DROP POLICY IF EXISTS "Students can insert own profile" ON students;

CREATE POLICY "Students can insert own profile"
ON students
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- students için UPDATE policy
DROP POLICY IF EXISTS "Students can update own profile" ON students;

CREATE POLICY "Students can update own profile"
ON students
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- students için SELECT policy
DROP POLICY IF EXISTS "Students can view own profile" ON students;

CREATE POLICY "Students can view own profile"
ON students
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- organizations için INSERT policy
DROP POLICY IF EXISTS "Organizations can insert own profile" ON organizations;

CREATE POLICY "Organizations can insert own profile"
ON organizations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- organizations için UPDATE policy
DROP POLICY IF EXISTS "Organizations can update own profile" ON organizations;

CREATE POLICY "Organizations can update own profile"
ON organizations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- organizations için SELECT policy
DROP POLICY IF EXISTS "Organizations can view own profile" ON organizations;

CREATE POLICY "Organizations can view own profile"
ON organizations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename IN ('user_profiles', 'students', 'organizations')
ORDER BY tablename, policyname;

