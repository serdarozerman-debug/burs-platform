"""
Google OAuth kullanıcılarını kontrol et ve user_profiles'a ekle
"""
import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv('.env.local')

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
anon_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not service_key:
    print("⚠️  Service role key bulunamadı!")
    print("   .env.local dosyasına SUPABASE_SERVICE_ROLE_KEY ekleyin")
    print("   Supabase Dashboard > Settings > API > service_role key")
    exit(1)

supabase = create_client(url, service_key)

print("🔍 Google OAuth kullanıcıları kontrol ediliyor...\n")

# 1. user_profiles'daki kayıtları kontrol et
profiles = supabase.table('user_profiles').select('id, email, full_name, role').execute()
print(f"📊 user_profiles tablosunda {len(profiles.data)} kayıt var")

if profiles.data:
    print("\nMevcut kayıtlar:")
    for p in profiles.data:
        print(f"  - {p.get('email', 'N/A')} ({p.get('full_name', 'N/A')}) - Role: {p.get('role', 'N/A')}")

# 2. auth.users'daki kullanıcıları kontrol et (service role ile)
# Not: Supabase Python client ile auth.users'a direkt erişim yok
# Ancak Supabase Admin API kullanabiliriz veya SQL sorgusu çalıştırabiliriz

print("\n" + "="*50)
print("📝 ÖNERİLER:")
print("="*50)
print("\n1. Supabase Dashboard > Authentication > Users bölümünden")
print("   Google OAuth ile giriş yapan kullanıcıları kontrol edin")
print("\n2. Eğer auth.users'da kullanıcı varsa ama user_profiles'ta yoksa:")
print("   Aşağıdaki SQL'i Supabase SQL Editor'da çalıştırın:\n")
print("""
-- Mevcut kullanıcılar için user_profiles oluştur
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
""")
print("\n3. Trigger'ın çalışıp çalışmadığını test etmek için:")
print("   Yeni bir Google OAuth girişi yapın ve kontrol edin")

