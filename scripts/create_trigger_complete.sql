-- ================================================
-- Google OAuth Kullanıcıları için Otomatik Profil Oluşturma
-- ================================================
-- Bu SQL'i Supabase SQL Editor'da çalıştırın
-- Adım adım çalıştırın veya tümünü birden çalıştırabilirsiniz

-- 1. Function oluştur: Yeni kullanıcı oluşturulduğunda user_profiles kaydı oluştur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name', 
      NEW.raw_user_meta_data->>'name',
      ''
    ),
    'student', -- Varsayılan rol
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url', 
      NEW.raw_user_meta_data->>'picture', 
      NULL
    )
  )
  ON CONFLICT (id) DO NOTHING; -- Eğer zaten varsa hata verme
  RETURN NEW;
END;
$$;

-- 2. Eski trigger'ı sil (varsa)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Yeni trigger'ı oluştur
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Mevcut kullanıcılar için user_profiles oluştur (eğer yoksa)
INSERT INTO public.user_profiles (id, email, full_name, role, avatar_url)
SELECT 
  id,
  email,
  COALESCE(
    raw_user_meta_data->>'full_name', 
    raw_user_meta_data->>'name',
    ''
  ),
  'student',
  COALESCE(
    raw_user_meta_data->>'avatar_url', 
    raw_user_meta_data->>'picture', 
    NULL
  )
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles)
ON CONFLICT (id) DO NOTHING;

-- 5. Sonucu kontrol et
SELECT 
  'Toplam user_profiles kayıt sayısı: ' || COUNT(*)::text as sonuc
FROM public.user_profiles;

-- 6. Mevcut kullanıcıları göster
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'name' as google_name,
  CASE 
    WHEN p.id IS NULL THEN '❌ Profil YOK' 
    ELSE '✅ Profil VAR' 
  END as profile_status,
  p.role as user_role
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

