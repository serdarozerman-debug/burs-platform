# Trigger Kurulum Rehberi

## Sorun
Google OAuth ile giriş yapan kullanıcılar `auth.users` tablosuna ekleniyor ancak `user_profiles` tablosuna otomatik olarak eklenmiyor.

## Çözüm: Database Trigger

### Adım 1: SQL Dosyasını Açın
`scripts/create_trigger_complete.sql` dosyasını açın veya aşağıdaki SQL'i kopyalayın.

### Adım 2: Supabase SQL Editor'da Çalıştırın

1. **Supabase Dashboard**'a gidin
2. Sol menüden **SQL Editor** seçin
3. **New query** butonuna tıklayın
4. Aşağıdaki SQL'i yapıştırın:

```sql
-- Function oluştur
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
    'student',
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url', 
      NEW.raw_user_meta_data->>'picture', 
      NULL
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Eski trigger'ı sil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Yeni trigger'ı oluştur
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Mevcut kullanıcılar için profil oluştur
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
```

5. **Run** butonuna tıklayın
6. Başarılı mesajını kontrol edin

### Adım 3: Trigger'ı Kontrol Edin

1. Sol menüden **Database** > **Triggers** seçin
2. `on_auth_user_created` trigger'ının listede olduğunu kontrol edin
3. **TABLE** sütununda `auth.users` yazmalı
4. **FUNCTION** sütununda `handle_new_user` yazmalı
5. **EVENTS** sütununda `AFTER INSERT` yazmalı
6. **ENABLED** sütununda yeşil ✓ işareti olmalı

### Adım 4: Function'ı Kontrol Edin

1. Sol menüden **Database** > **Functions** seçin
2. `handle_new_user` function'ının listede olduğunu kontrol edin

### Adım 5: Mevcut Kullanıcıları Kontrol Edin

SQL Editor'da şu sorguyu çalıştırın:

```sql
-- Mevcut kullanıcıları ve profil durumlarını göster
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
```

Bu sorgu:
- `auth.users` tablosundaki tüm kullanıcıları gösterir
- Her kullanıcının `user_profiles` tablosunda profil olup olmadığını gösterir
- Google'dan gelen isim bilgisini gösterir

### Adım 6: Test Edin

1. Yeni bir Google OAuth girişi yapın
2. Supabase Dashboard > **Table Editor** > `user_profiles` tablosunu kontrol edin
3. Yeni kullanıcının otomatik olarak eklendiğini doğrulayın

## Sorun Giderme

### Trigger görünmüyor
- SQL'i tekrar çalıştırın
- Database > Triggers sayfasını yenileyin (F5)
- Trigger'ın `auth.users` tablosunda olduğundan emin olun

### Function görünmüyor
- SQL'i tekrar çalıştırın
- Database > Functions sayfasını yenileyin
- Function adının `handle_new_user` olduğundan emin olun

### "permission denied" hatası
- Function `SECURITY DEFINER` ile oluşturulmalı (SQL'de var)
- RLS policy sorunu olabilir, şu SQL'i çalıştırın:

```sql
-- user_profiles için INSERT policy (gerekirse)
CREATE POLICY "Enable insert for authenticated users"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (true);
```

Ancak trigger `SECURITY DEFINER` ile çalıştığı için genellikle gerekmez.

### Mevcut kullanıcılar için profil oluşmadı
- SQL'in son kısmını (INSERT INTO ...) tekrar çalıştırın
- `auth.users` tablosunda kullanıcı olduğundan emin olun

## Dosya Konumları

- **SQL Dosyası**: `scripts/create_trigger_complete.sql`
- **Rehber**: `TRIGGER_KURULUM_REHBERI.md`
- **Önceki Rehber**: `GOOGLE_OAUTH_FIX.md`

