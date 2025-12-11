"""
Üniversite burslarının başvuru linklerini güncellemek için script
Her üniversite için doğru burs başvuru sayfasını bulur ve günceller
"""

import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv
import re
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

# Üniversite bazlı doğru linkler
UNIVERSITY_LINKS = {
    'Koç Üniversitesi': {
        'base': 'https://www.ku.edu.tr',
        'burs_path': '/ogrenci/burslar',
        'full_url': 'https://www.ku.edu.tr/ogrenci/burslar'
    },
    'Anadolu Üniversitesi': {
        'base': 'https://www.anadolu.edu.tr',
        'burs_path': '/tr/burslar',
        'full_url': 'https://www.anadolu.edu.tr/tr/burslar'
    },
    'Boğaziçi Üniversitesi': {
        'base': 'https://www.boun.edu.tr',
        'burs_path': '/tr/burslar',
        'full_url': 'https://www.boun.edu.tr/tr/burslar'
    },
    # Diğer üniversiteler için genel pattern
}

def find_burs_page(org_name, website):
    """Üniversite web sitesinden burs sayfasını bul"""
    if not website:
        return None
    
    # Bilinen üniversiteler için direkt link döndür
    if org_name in UNIVERSITY_LINKS:
        return UNIVERSITY_LINKS[org_name]['full_url']
    
    # Genel pattern'ler dene
    common_paths = [
        '/ogrenci/burslar',
        '/tr/burslar',
        '/burslar',
        '/ogrenci/burs',
        '/burs',
        '/admissions/scholarships',
        '/tr/ogrenci/burslar'
    ]
    
    base_url = website.rstrip('/')
    
    for path in common_paths:
        test_url = base_url + path
        try:
            response = requests.head(test_url, timeout=5, allow_redirects=True)
            if response.status_code == 200:
                return test_url
        except:
            continue
    
    # Bulunamazsa ana sayfa döndür
    return website

def update_university_scholarship_links():
    """Üniversite burslarının linklerini güncelle"""
    print("🔄 Üniversite burslarının linklerini güncelleniyor...\n")
    
    try:
        # Üniversite organizasyonlarını bul
        org_result = supabase.table('organizations')\
            .select('id, name, website, type')\
            .eq('type', 'üniversite')\
            .execute()
        
        if not org_result.data:
            print("❌ Üniversite organizasyonu bulunamadı!")
            return
        
        print(f"📋 Toplam {len(org_result.data)} üniversite bulundu\n")
        
        updated_count = 0
        skipped_count = 0
        
        for org in org_result.data:
            org_id = org['id']
            org_name = org['name']
            org_website = org.get('website', '')
            
            print(f"🔍 {org_name} kontrol ediliyor...")
            
            # Bu üniversitenin burslarını al
            scholarships_result = supabase.table('scholarships')\
                .select('id, title, application_url')\
                .eq('organization_id', org_id)\
                .execute()
            
            if not scholarships_result.data:
                print(f"  ⏭️  Burs bulunamadı\n")
                continue
            
            # Doğru burs sayfasını bul
            correct_url = find_burs_page(org_name, org_website)
            
            if not correct_url:
                print(f"  ⚠️  Burs sayfası bulunamadı\n")
                continue
            
            print(f"  ✅ Burs sayfası: {correct_url}")
            
            # Her burs için linki güncelle
            for scholarship in scholarships_result.data:
                current_url = scholarship['application_url']
                
                # Eğer link ana sayfa ise veya yanlışsa güncelle
                if (current_url == org_website or 
                    current_url == org_website + '/' or
                    current_url in [org_website + '/tr', org_website + '/en']):
                    
                    try:
                        supabase.table('scholarships')\
                            .update({'application_url': correct_url})\
                            .eq('id', scholarship['id'])\
                            .execute()
                        
                        print(f"    ✅ Güncellendi: {scholarship['title'][:50]}")
                        updated_count += 1
                    except Exception as e:
                        print(f"    ❌ Hata: {e}")
                else:
                    skipped_count += 1
            
            print()
        
        print(f"\n📊 Özet: {updated_count} güncellendi, {skipped_count} zaten doğru")
        
    except Exception as e:
        print(f"❌ Hata: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    update_university_scholarship_links()

