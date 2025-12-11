#!/usr/bin/env python3
"""
Login test scripti - Dashboard'a giriş yapıp yapamadığını test eder
"""
import os
import sys
import requests
from dotenv import load_dotenv
from supabase import create_client, Client

# .env.local dosyasını yükle
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local')
load_dotenv(env_path)

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
APP_URL = os.getenv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000')

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    print("HATA: NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local dosyasında tanımlı olmalı")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def test_login(email: str, password: str):
    """Login testi yap"""
    print(f"\n{'='*60}")
    print(f"Login Testi: {email}")
    print(f"{'='*60}\n")
    
    # 1. Supabase'de login dene
    print("1. Supabase Auth ile login deneniyor...")
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password,
        })
        
        if auth_response.user:
            print(f"✓ Login başarılı!")
            print(f"  - User ID: {auth_response.user.id}")
            print(f"  - Email: {auth_response.user.email}")
            
            # 2. Session token'ı al
            session = auth_response.session
            if session:
                print(f"✓ Session oluşturuldu!")
                print(f"  - Access Token: {session.access_token[:50]}...")
                print(f"  - Expires At: {session.expires_at}")
                
                # 3. User profile kontrolü
                print("\n2. User profile kontrol ediliyor...")
                profile_result = supabase.table('user_profiles').select('*').eq('id', auth_response.user.id).single().execute()
                
                if profile_result.data:
                    profile = profile_result.data
                    print(f"✓ Profile bulundu:")
                    print(f"  - Role: {profile.get('role')}")
                    print(f"  - Full Name: {profile.get('full_name')}")
                    print(f"  - Email: {profile.get('email')}")
                    
                    # 4. Dashboard erişim testi
                    print("\n3. Dashboard erişim testi...")
                    if profile.get('role') == 'admin':
                        dashboard_url = f"{APP_URL}/admin/dashboard"
                        print(f"  Admin dashboard URL: {dashboard_url}")
                        print(f"  Bu URL'yi tarayıcıda açıp test edebilirsiniz.")
                    else:
                        print(f"  ⚠ Kullanıcı admin değil (role: {profile.get('role')})")
                else:
                    print("✗ Profile bulunamadı!")
                    
            else:
                print("✗ Session oluşturulamadı!")
        else:
            print("✗ Login başarısız - user bilgisi yok")
            
    except Exception as e:
        print(f"✗ Hata: {e}")
        return False
    
    return True

def test_api_session():
    """API session endpoint'ini test et"""
    print(f"\n{'='*60}")
    print("API Session Debug Testi")
    print(f"{'='*60}\n")
    
    try:
        print(f"Testing: {APP_URL}/api/debug/session")
        response = requests.get(f"{APP_URL}/api/debug/session", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✓ Session debug endpoint çalışıyor:")
            print(f"  - Success: {data.get('success')}")
            print(f"  - Session: {data.get('session')}")
            print(f"  - Profile: {data.get('profile')}")
            print(f"  - Cookie Count: {data.get('cookieCount')}")
            print(f"  - Cookies: {list(data.get('cookies', {}).keys())}")
            if not data.get('session'):
                print("\n⚠ UYARI: Session null - Cookie'ler server-side'da okunamıyor!")
                print("  Bu, login sonrası redirect'in çalışmamasının nedeni olabilir.")
        else:
            print(f"✗ Session debug endpoint hatası: {response.status_code}")
            print(f"  Response: {response.text}")
    except requests.exceptions.ConnectionError:
        print(f"✗ Bağlantı hatası: {APP_URL}")
        print(f"  Development server çalışıyor mu kontrol edin: npm run dev")
    except Exception as e:
        print(f"✗ API test hatası: {e}")
        print(f"  Development server çalışıyor mu kontrol edin: {APP_URL}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Kullanım:")
        print("  python3 scripts/test_login.py <email> <password>")
        print()
        print("Örnek:")
        print("  python3 scripts/test_login.py serdar@siemoapp.com yourpassword")
        print()
        print("API Session Debug Testi:")
        print("  python3 scripts/test_login.py --api-test")
        sys.exit(1)
    
    if sys.argv[1] == "--api-test":
        test_api_session()
    else:
        email = sys.argv[1]
        password = sys.argv[2]
        test_login(email, password)
        print("\n" + "="*60)
        print("Test tamamlandı!")
        print("="*60)

