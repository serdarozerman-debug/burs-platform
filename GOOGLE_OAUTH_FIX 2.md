# Google OAuth Kullanıcı Profili Sorunu ve Çözümü

## Sorun
Google OAuth ile giriş yapıldığında kullanıcı `auth.users` tablosuna ekleniyor ancak `user_profiles` tablosuna otomatik olarak eklenmiyor.

## Çözüm 1: Database Trigger (Önerilen - Kalıcı Çözüm)

Supabase SQL Editor'da aşağıdaki SQL'i çalıştırın:

```sql
-- Function: Yeni kullanıcı oluşturulduğunda user_profiles kaydı oluştur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    'student', -- Varsayılan rol
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL)
  )
  ON CONFLICT (id) DO NOTHING; -- Eğer zaten varsa hata verme
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: auth.users tablosuna yeni kayıt eklendiğinde çalışır
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

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
```

### Adımlar:
1. Supabase Dashboard'a gidin
2. Sol menüden **SQL Editor** seçin
3. Yukarıdaki SQL'i yapıştırın
4. **Run** butonuna tıklayın
5. Başarılı mesajını kontrol edin

Bu trigger sayesinde:
- Yeni Google OAuth kullanıcıları otomatik olarak `user_profiles` tablosuna eklenecek
- Mevcut kullanıcılar için de profil kayıtları oluşturulacak

## Çözüm 2: Callback Route Güncellemesi (Zaten Yapıldı)

`app/auth/callback/route.ts` dosyası güncellendi ve artık:
- Google OAuth callback'inde user_profiles kontrolü yapıyor
- Eğer profil yoksa otomatik oluşturuyor

Bu çözüm çalışıyor ancak trigger daha güvenilir ve otomatik.

## Mevcut Kullanıcıları Kontrol Etme

Mevcut Google OAuth kullanıcılarını kontrol etmek için:

```sql
-- auth.users'daki tüm kullanıcıları göster
SELECT id, email, created_at, raw_user_meta_data->>'name' as name
FROM auth.users
ORDER BY created_at DESC;

-- user_profiles'ta olmayan kullanıcıları bul
SELECT id, email, raw_user_meta_data->>'name' as name
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles);
```

## Test Etme

1. Google OAuth ile yeni bir kullanıcı ile giriş yapın
2. Supabase Dashboard > Table Editor > `user_profiles` tablosunu kontrol edin
3. Yeni kullanıcının kaydının oluştuğunu doğrulayın

## Sorun Giderme

### Trigger çalışmıyor
- Supabase Dashboard > Database > Functions bölümünden `handle_new_user` function'ının oluşturulduğunu kontrol edin
- Database > Triggers bölümünden `on_auth_user_created` trigger'ının aktif olduğunu kontrol edin

### RLS Policy Hatası
Eğer "new row violates row-level security policy" hatası alırsanız:

```sql
-- user_profiles için INSERT policy ekle
CREATE POLICY "Enable insert for authenticated users"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (true);
```

Ancak trigger `SECURITY DEFINER` ile çalıştığı için bu genellikle gerekmez.

