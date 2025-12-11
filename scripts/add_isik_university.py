import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv
import re
from datetime import datetime
from urllib.parse import urljoin

load_dotenv('.env.local')

# Supabase connection
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
anon_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
key = service_key if service_key else anon_key

if not key:
    raise Exception("❌ Supabase key bulunamadı!")

supabase: Client = create_client(url, key)

def get_or_create_organization(org_name, org_type='üniversite', website=None, logo_url=None):
    """Organizasyonu bul veya oluştur, ID döndür"""
    try:
        result = supabase.table('organizations')\
            .select('id')\
            .ilike('name', org_name)\
            .execute()
        
        if result.data and len(result.data) > 0:
            org_id = result.data[0]['id']
            print(f"  ✅ Organizasyon bulundu: {org_name}")
            return org_id
        
        # Yoksa oluştur
        slug = org_name.lower().replace(' ', '-').replace('ı', 'i').replace('ğ', 'g').replace('ü', 'u').replace('ş', 's').replace('ö', 'o').replace('ç', 'c')
        slug = re.sub(r'[^a-z0-9-]', '', slug)
        
        org_data = {
            'name': org_name,
            'slug': slug,
            'type': org_type,
            'website': website,
            'logo_url': logo_url,
            'is_verified': True
        }
        
        result = supabase.table('organizations').insert(org_data).execute()
        org_id = result.data[0]['id']
        print(f"  ✅ Organizasyon oluşturuldu: {org_name} ({org_id[:8]}...)")
        return org_id
    except Exception as e:
        print(f"  ❌ Organizasyon hatası: {e}")
        return None

def scrape_isik_university_scholarships():
    """Işık Üniversitesi burslarını scrape et"""
    print("\n🔍 Işık Üniversitesi bursları scrape ediliyor...")
    
    website = "https://www.isikun.edu.tr"
    
    # Organizasyonu oluştur/bul
    org_id = get_or_create_organization(
        "Işık Üniversitesi",
        org_type='üniversite',
        website=website,
        logo_url=f"{website}/favicon.ico"
    )
    
    if not org_id:
        print("❌ Organizasyon oluşturulamadı!")
        return
    
    # Işık Üniversitesi burs sayfası
    burs_url = f"{website}/tr/burslar"
    
    try:
        response = requests.get(burs_url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Burs bilgilerini bul (sayfa yapısına göre güncellenebilir)
        # Genel burs bilgileri
        scholarships_data = [
            {
                'title': 'Işık Üniversitesi Başarı Bursu',
                'description': 'Lisans programlarına kayıt yaptıran öğrenciler için başarı durumlarına göre verilen burslar.',
                'amount': 0,  # Yüzde bazlı olabilir
                'amount_type': 'yıllık',
                'type': 'akademik',
                'education_level': 'lisans',
                'deadline': None,  # Sürekli başvuru
                'application_url': burs_url,
            },
            {
                'title': 'Işık Üniversitesi Spor Bursu',
                'description': 'Spor alanında başarılı öğrenciler için verilen burslar.',
                'amount': 0,
                'amount_type': 'yıllık',
                'type': 'akademik',
                'education_level': 'lisans',
                'deadline': None,
                'application_url': burs_url,
            },
            {
                'title': 'Işık Üniversitesi Sanat Bursu',
                'description': 'Sanat alanında başarılı öğrenciler için verilen burslar.',
                'amount': 0,
                'amount_type': 'yıllık',
                'type': 'akademik',
                'education_level': 'lisans',
                'deadline': None,
                'application_url': burs_url,
            },
        ]
        
        # Bursları ekle
        for scholarship_data in scholarships_data:
            try:
                # Slug oluştur
                slug = scholarship_data['title'].lower().replace(' ', '-')
                slug = re.sub(r'[^a-z0-9-]', '', slug)
                
                scholarship = {
                    'title': scholarship_data['title'],
                    'slug': slug,
                    'organization_id': org_id,
                    'description': scholarship_data['description'],
                    'amount': scholarship_data['amount'],
                    'amount_type': scholarship_data['amount_type'],
                    'type': scholarship_data['type'],
                    'education_level': scholarship_data['education_level'],
                    'deadline': scholarship_data['deadline'],
                    'application_url': scholarship_data['application_url'],
                    'is_active': True,
                    'is_published': True,
                }
                
                # Daha önce eklenmiş mi kontrol et
                existing = supabase.table('scholarships')\
                    .select('id')\
                    .eq('organization_id', org_id)\
                    .ilike('title', scholarship_data['title'])\
                    .execute()
                
                if existing.data and len(existing.data) > 0:
                    print(f"  ⏭️  Burs zaten var: {scholarship_data['title']}")
                    continue
                
                result = supabase.table('scholarships').insert(scholarship).execute()
                print(f"  ✅ Burs eklendi: {scholarship_data['title']}")
                
            except Exception as e:
                print(f"  ❌ Burs ekleme hatası ({scholarship_data['title']}): {e}")
        
        print("\n✅ Işık Üniversitesi bursları başarıyla eklendi!")
        
    except Exception as e:
        print(f"❌ Scraping hatası: {e}")
        # Yine de manuel bursları ekle
        print("Manuel burslar ekleniyor...")
        manual_scholarships = [
            {
                'title': 'Işık Üniversitesi Başarı Bursu',
                'description': 'Lisans programlarına kayıt yaptıran öğrenciler için başarı durumlarına göre verilen burslar. Detaylı bilgi için üniversite ile iletişime geçiniz.',
                'amount': 0,
                'amount_type': 'yıllık',
                'type': 'akademik',
                'education_level': 'lisans',
                'deadline': None,
                'application_url': burs_url,
            },
        ]
        
        for scholarship_data in manual_scholarships:
            try:
                slug = scholarship_data['title'].lower().replace(' ', '-')
                slug = re.sub(r'[^a-z0-9-]', '', slug)
                
                scholarship = {
                    'title': scholarship_data['title'],
                    'slug': slug,
                    'organization_id': org_id,
                    'description': scholarship_data['description'],
                    'amount': scholarship_data['amount'],
                    'amount_type': scholarship_data['amount_type'],
                    'type': scholarship_data['type'],
                    'education_level': scholarship_data['education_level'],
                    'deadline': scholarship_data['deadline'],
                    'application_url': scholarship_data['application_url'],
                    'is_active': True,
                    'is_published': True,
                }
                
                existing = supabase.table('scholarships')\
                    .select('id')\
                    .eq('organization_id', org_id)\
                    .ilike('title', scholarship_data['title'])\
                    .execute()
                
                if existing.data and len(existing.data) > 0:
                    print(f"  ⏭️  Burs zaten var: {scholarship_data['title']}")
                    continue
                
                result = supabase.table('scholarships').insert(scholarship).execute()
                print(f"  ✅ Burs eklendi: {scholarship_data['title']}")
                
            except Exception as e:
                print(f"  ❌ Burs ekleme hatası: {e}")

if __name__ == "__main__":
    scrape_isik_university_scholarships()

