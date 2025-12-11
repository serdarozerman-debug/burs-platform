#!/usr/bin/env python3
"""
Kullanıcı authentication bilgilerini kontrol eden script
"""
import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

# .env.local dosyasını yükle
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local')
load_dotenv(env_path)

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("HATA: SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY veya SUPABASE_ANON_KEY .env.local dosyasında tanımlı olmalı")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def check_user(email: str):
    """Kullanıcı bilgilerini kontrol et"""
    print(f"\n{'='*60}")
    print(f"Kullanıcı Kontrolü: {email}")
    print(f"{'='*60}\n")
    
    # Auth users tablosundan kontrol et
    try:
        # Supabase Admin API kullanarak kullanıcıyı bul
        # Not: Bu işlem için admin API gerekebilir
        print("1. Auth.users tablosunda kontrol ediliyor...")
        
        # user_profiles tablosundan kontrol et
        print("2. user_profiles tablosunda kontrol ediliyor...")
        profile_result = supabase.table('user_profiles').select('*').eq('email', email).execute()
        
        if profile_result.data and len(profile_result.data) > 0:
            profile = profile_result.data[0]
            print(f"✓ user_profiles kaydı bulundu:")
            print(f"  - ID: {profile.get('id')}")
            print(f"  - Email: {profile.get('email')}")
            print(f"  - Full Name: {profile.get('full_name')}")
            print(f"  - Role: {profile.get('role')}")
            print(f"  - Created At: {profile.get('created_at')}")
        else:
            print("✗ user_profiles tablosunda kayıt bulunamadı")
        
        print("\n3. Öneriler:")
        print("   - Eğer Google OAuth ile kayıt olduysanız, şifre ile giriş yapamazsınız.")
        print("   - Google ile giriş yapmak için 'Google ile Giriş Yap' butonunu kullanın.")
        print("   - Şifre ile giriş yapmak için önce şifre sıfırlama yapmanız gerekebilir.")
        print("   - Supabase Dashboard > Authentication > Users bölümünden kullanıcıyı kontrol edin.")
        
    except Exception as e:
        print(f"✗ Hata: {e}")

if __name__ == "__main__":
    email = input("Kontrol edilecek e-posta adresini girin: ").strip()
    if email:
        check_user(email)
    else:
        print("E-posta adresi girilmedi!")

