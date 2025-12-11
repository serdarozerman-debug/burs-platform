"""
Organizasyonların favicon'larını bulup güncellemek için script
"""

import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv
from urllib.parse import urljoin, urlparse

load_dotenv('.env.local')

# Supabase connection
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
anon_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
key = service_key if service_key else anon_key

if not key:
    raise Exception("❌ Supabase key bulunamadı!")

supabase: Client = create_client(url, key)

def find_favicon(org_website):
    """Web sitesinden favicon URL'ini bul"""
    if not org_website:
        return None
    
    try:
        print(f"  🔍 Favicon aranıyor: {org_website}")
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(org_website, headers=headers, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Favicon için farklı yerleri kontrol et
        favicon_selectors = [
            ('link', {'rel': 'icon'}),
            ('link', {'rel': 'shortcut icon'}),
            ('link', {'rel': 'apple-touch-icon'}),
            ('link', {'rel': 'apple-touch-icon-precomposed'}),
        ]
        
        for tag, attrs in favicon_selectors:
            favicon = soup.find(tag, attrs=attrs)
            if favicon and favicon.get('href'):
                favicon_url = favicon['href']
                # Relative URL'i absolute yap
                if not favicon_url.startswith('http'):
                    parsed_url = urlparse(org_website)
                    base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
                    favicon_url = urljoin(base_url, favicon_url)
                
                print(f"  ✅ Favicon bulundu: {favicon_url}")
                return favicon_url
        
        # Eğer HTML'de bulunamazsa, /favicon.ico dene
        parsed_url = urlparse(org_website)
        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
        favicon_default = f"{base_url}/favicon.ico"
        
        # Favicon.ico var mı kontrol et
        try:
            favicon_response = requests.head(favicon_default, headers=headers, timeout=5)
            if favicon_response.status_code == 200:
                print(f"  ✅ Favicon bulundu: {favicon_default}")
                return favicon_default
        except:
            pass
        
        print(f"  ⚠️  Favicon bulunamadı")
        return None
        
    except Exception as e:
        print(f"  ⚠️  Favicon arama hatası: {e}")
        return None

def update_organization_favicons():
    """Tüm organizasyonların favicon'larını güncelle"""
    print("🔄 Organizasyon favicon'ları güncelleniyor...\n")
    
    try:
        # Tüm organizasyonları al
        org_result = supabase.table('organizations')\
            .select('id, name, website, logo_url')\
            .execute()
        
        if not org_result.data:
            print("❌ Organizasyon bulunamadı!")
            return
        
        print(f"📋 Toplam {len(org_result.data)} organizasyon bulundu\n")
        
        updated_count = 0
        skipped_count = 0
        error_count = 0
        
        for org in org_result.data:
            org_id = org['id']
            org_name = org['name']
            org_website = org.get('website', '')
            current_logo = org.get('logo_url')
            
            print(f"🔍 {org_name}")
            
            # Mevcut logo'yu kontrol et - erişilebilir mi?
            logo_valid = False
            if current_logo:
                try:
                    response = requests.head(current_logo, timeout=5, allow_redirects=True)
                    if response.status_code == 200:
                        logo_valid = True
                        print(f"  ✅ Mevcut logo geçerli: {current_logo}\n")
                        skipped_count += 1
                        continue
                except:
                    print(f"  ⚠️  Mevcut logo erişilemiyor: {current_logo}")
                    # Devam et, yeni favicon bul
            
            if not org_website:
                print(f"  ⚠️  Website bilgisi yok\n")
                error_count += 1
                continue
            
            # Favicon bul
            favicon_url = find_favicon(org_website)
            
            if favicon_url:
                try:
                    supabase.table('organizations')\
                        .update({'logo_url': favicon_url})\
                        .eq('id', org_id)\
                        .execute()
                    
                    print(f"  ✅ Güncellendi!\n")
                    updated_count += 1
                except Exception as e:
                    print(f"  ❌ Güncelleme hatası: {e}\n")
                    error_count += 1
            else:
                print(f"  ⚠️  Favicon bulunamadı\n")
                error_count += 1
        
        print(f"\n📊 Özet:")
        print(f"  ✅ {updated_count} güncellendi")
        print(f"  ⏭️  {skipped_count} zaten var")
        print(f"  ❌ {error_count} hata/bulunamadı")
        
    except Exception as e:
        print(f"❌ Hata: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    update_organization_favicons()

