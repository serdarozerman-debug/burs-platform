-- ============================================
-- BURS PLATFORM v2.0 - MIGRATION VERIFICATION
-- ============================================
-- Run this script after migration to verify everything is set up correctly

-- 1. Check all tables exist
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'user_profiles',
    'organizations',
    'students',
    'scholarships',
    'applications',
    'wallet_documents',
    'application_documents',
    'favorites',
    'chatbot_conversations',
    'chatbot_messages',
    'notifications'
)
ORDER BY table_name;

-- Expected: 11 rows

-- 2. Check all ENUMs exist
SELECT 
    t.typname as enum_name,
    COUNT(e.enumlabel) as value_count,
    string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) as values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
AND t.typname IN (
    'user_role',
    'organization_type',
    'education_level',
    'scholarship_type',
    'amount_type',
    'application_status',
    'document_type',
    'verification_status',
    'notification_type'
)
GROUP BY t.typname
ORDER BY t.typname;

-- Expected: 9 rows

-- 3. Check RLS is enabled on all tables
SELECT 
    schemaname,
    tablename,
    CASE 
        WHEN rowsecurity THEN '✅ Enabled'
        ELSE '❌ Disabled'
    END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'user_profiles',
    'organizations',
    'students',
    'scholarships',
    'applications',
    'wallet_documents',
    'application_documents',
    'favorites',
    'chatbot_conversations',
    'chatbot_messages',
    'notifications'
)
ORDER BY tablename;

-- Expected: All should show "✅ Enabled"

-- 4. Count policies per table
SELECT 
    schemaname,
    tablename,
    COUNT(*) as policy_count,
    string_agg(policyname, ', ') as policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;

-- Expected: Multiple policies per table

-- 5. Check indexes exist
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN (
    'user_profiles',
    'organizations',
    'students',
    'scholarships',
    'applications',
    'wallet_documents',
    'favorites',
    'notifications'
)
ORDER BY tablename, indexname;

-- Expected: ~20+ indexes

-- 6. Check triggers exist
SELECT 
    trigger_name,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND event_object_table IN (
    'user_profiles',
    'organizations',
    'students',
    'scholarships',
    'applications',
    'favorites'
)
ORDER BY event_object_table, trigger_name;

-- Expected: ~5 triggers

-- 7. Check functions exist
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
    'update_updated_at_column',
    'update_scholarship_application_count',
    'update_scholarship_favorite_count',
    'calculate_profile_completion'
)
ORDER BY routine_name;

-- Expected: 4 functions

-- 8. Check foreign key constraints
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
AND tc.table_name IN (
    'user_profiles',
    'organizations',
    'students',
    'scholarships',
    'applications',
    'wallet_documents',
    'application_documents',
    'favorites',
    'chatbot_conversations',
    'chatbot_messages',
    'notifications'
)
ORDER BY tc.table_name, kcu.column_name;

-- Expected: Multiple foreign keys

-- ============================================
-- SUMMARY
-- ============================================

SELECT 
    'Migration Verification Summary' as check_name,
    '' as status;

SELECT 'Tables' as item, COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'user_profiles', 'organizations', 'students', 'scholarships',
    'applications', 'wallet_documents', 'application_documents',
    'favorites', 'chatbot_conversations', 'chatbot_messages', 'notifications'
)
UNION ALL
SELECT 'ENUMs', COUNT(DISTINCT t.typname)
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
UNION ALL
SELECT 'RLS Enabled', COUNT(*)
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true
UNION ALL
SELECT 'Policies', COUNT(*)
FROM pg_policies
WHERE schemaname = 'public'
UNION ALL
SELECT 'Triggers', COUNT(*)
FROM information_schema.triggers
WHERE trigger_schema = 'public'
UNION ALL
SELECT 'Functions', COUNT(*)
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%scholarship%' OR routine_name LIKE '%profile%';

-- ✅ Expected Results:
-- Tables: 11
-- ENUMs: 9
-- RLS Enabled: 11
-- Policies: ~15
-- Triggers: ~5
-- Functions: ~4

