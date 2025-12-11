#!/usr/bin/env python3
"""
Admin hesabı oluşturma veya mevcut kullanıcıyı admin yapma scripti
"""
import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

# .env.local dosyasını yükle
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local')
load_dotenv(env_path)

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("HATA: NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY .env.local dosyasında tanımlı olmalı")
    print("SUPABASE_SERVICE_ROLE_KEY Supabase Dashboard > Settings > API > service_role key'den alınabilir")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def create_admin_user(email: str, password: str, full_name: str = None):
    """Yeni bir admin kullanıcı oluştur"""
    print(f"\n{'='*60}")
    print(f"Yeni Admin Kullanıcı Oluşturuluyor: {email}")
    print(f"{'='*60}\n")
    
    try:
        # 1. Auth.users tablosunda kullanıcı oluştur
        print("1. Auth kullanıcısı oluşturuluyor...")
        auth_response = supabase.auth.admin.create_user({
            "email": email,
            "password": password,
            "email_confirm": True,  # Email'i otomatik doğrula
            "user_metadata": {
                "full_name": full_name or email.split('@')[0]
            }
        })
        
        if not auth_response.user:
            print("✗ Auth kullanıcısı oluşturulamadı")
            return False
        
        user_id = auth_response.user.id
        print(f"✓ Auth kullanıcısı oluşturuldu: {user_id}")
        
        # 2. user_profiles tablosunda admin olarak kaydet
        print("2. user_profiles kaydı oluşturuluyor...")
        profile_data = {
            "id": user_id,
            "email": email,
            "full_name": full_name or email.split('@')[0],
            "role": "admin",
            "is_verified": True,
            "is_active": True
        }
        
        profile_result = supabase.table('user_profiles').insert(profile_data).execute()
        
        if profile_result.data:
            print(f"✓ Admin kullanıcı başarıyla oluşturuldu!")
            print(f"\nKullanıcı Bilgileri:")
            print(f"  - Email: {email}")
            print(f"  - Şifre: {password}")
            print(f"  - Role: admin")
            print(f"  - User ID: {user_id}")
            return True
        else:
            print("✗ user_profiles kaydı oluşturulamadı")
            return False
            
    except Exception as e:
        print(f"✗ Hata: {e}")
        if "already registered" in str(e).lower() or "already exists" in str(e).lower():
            print("\nBu e-posta adresi zaten kayıtlı. Mevcut kullanıcıyı admin yapmak için:")
            print(f"  python3 scripts/create_admin.py --make-admin {email}")
        return False

def make_existing_user_admin(email: str):
    """Mevcut bir kullanıcıyı admin yap"""
    print(f"\n{'='*60}")
    print(f"Mevcut Kullanıcıyı Admin Yapılıyor: {email}")
    print(f"{'='*60}\n")
    
    try:
        # 1. user_profiles tablosunda kullanıcıyı bul
        print("1. Kullanıcı aranıyor...")
        profile_result = supabase.table('user_profiles').select('*').eq('email', email).execute()
        
        if not profile_result.data or len(profile_result.data) == 0:
            print("✗ Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı")
            print("\nÖneriler:")
            print("  - Önce kullanıcının kayıt olması gerekiyor")
            print("  - Veya yeni admin kullanıcı oluşturmak için:")
            print(f"    python3 scripts/create_admin.py --create {email}")
            return False
        
        profile = profile_result.data[0]
        user_id = profile['id']
        current_role = profile.get('role', 'student')
        
        print(f"✓ Kullanıcı bulundu:")
        print(f"  - User ID: {user_id}")
        print(f"  - Mevcut Role: {current_role}")
        
        if current_role == 'admin':
            print("\n✓ Bu kullanıcı zaten admin!")
            return True
        
        # 2. Role'ü admin olarak güncelle
        print("\n2. Role admin olarak güncelleniyor...")
        update_result = supabase.table('user_profiles').update({
            "role": "admin",
            "is_verified": True,
            "is_active": True
        }).eq('id', user_id).execute()
        
        if update_result.data:
            print(f"✓ Kullanıcı başarıyla admin yapıldı!")
            print(f"\nGüncellenmiş Bilgiler:")
            print(f"  - Email: {email}")
            print(f"  - Role: admin")
            print(f"  - User ID: {user_id}")
            return True
        else:
            print("✗ Role güncellenemedi")
            return False
            
    except Exception as e:
        print(f"✗ Hata: {e}")
        return False

def list_admins():
    """Tüm admin kullanıcıları listele"""
    print(f"\n{'='*60}")
    print("Admin Kullanıcılar")
    print(f"{'='*60}\n")
    
    try:
        result = supabase.table('user_profiles').select('*').eq('role', 'admin').execute()
        
        if result.data and len(result.data) > 0:
            print(f"Toplam {len(result.data)} admin kullanıcı bulundu:\n")
            for i, admin in enumerate(result.data, 1):
                print(f"{i}. {admin.get('email')}")
                print(f"   - Ad: {admin.get('full_name', 'N/A')}")
                print(f"   - ID: {admin.get('id')}")
                print(f"   - Aktif: {'Evet' if admin.get('is_active') else 'Hayır'}")
                print(f"   - Oluşturulma: {admin.get('created_at', 'N/A')}")
                print()
        else:
            print("Admin kullanıcı bulunamadı")
            
    except Exception as e:
        print(f"✗ Hata: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Kullanım:")
        print("  # Yeni admin kullanıcı oluştur:")
        print("  python3 scripts/create_admin.py --create <email> [password] [full_name]")
        print()
        print("  # Mevcut kullanıcıyı admin yap:")
        print("  python3 scripts/create_admin.py --make-admin <email>")
        print()
        print("  # Tüm adminleri listele:")
        print("  python3 scripts/create_admin.py --list")
        print()
        print("Örnek:")
        print("  python3 scripts/create_admin.py --create admin@example.com MyPassword123 Admin User")
        print("  python3 scripts/create_admin.py --make-admin serdar.ozerman@gmail.com")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "--create":
        if len(sys.argv) < 3:
            print("HATA: E-posta adresi gerekli")
            sys.exit(1)
        
        email = sys.argv[2]
        password = sys.argv[3] if len(sys.argv) > 3 else None
        full_name = sys.argv[4] if len(sys.argv) > 4 else None
        
        if not password:
            import getpass
            password = getpass.getpass("Şifre girin: ")
            password_confirm = getpass.getpass("Şifreyi tekrar girin: ")
            if password != password_confirm:
                print("✗ Şifreler eşleşmiyor!")
                sys.exit(1)
        
        create_admin_user(email, password, full_name)
        
    elif command == "--make-admin":
        if len(sys.argv) < 3:
            print("HATA: E-posta adresi gerekli")
            sys.exit(1)
        
        email = sys.argv[2]
        make_existing_user_admin(email)
        
    elif command == "--list":
        list_admins()
        
    else:
        print(f"Bilinmeyen komut: {command}")
        sys.exit(1)

