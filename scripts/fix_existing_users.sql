-- Mevcut Google OAuth kullanıcıları için user_profiles oluştur
-- Bu SQL'i Supabase SQL Editor'da çalıştırın

-- Önce mevcut durumu kontrol et
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.raw_user_meta_data->>'name' as name,
  CASE WHEN p.id IS NULL THEN 'Profil YOK' ELSE 'Profil VAR' END as profile_status
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 10;

-- Mevcut kullanıcılar için user_profiles oluştur (eğer yoksa)
INSERT INTO public.user_profiles (id, email, full_name, role, avatar_url)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', ''),
  'student',
  COALESCE(raw_user_meta_data->>'avatar_url', raw_user_meta_data->>'picture', NULL)
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles)
ON CONFLICT (id) DO NOTHING;

-- Sonucu kontrol et
SELECT COUNT(*) as total_profiles FROM public.user_profiles;

