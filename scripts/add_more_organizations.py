"""
Daha fazla burs veren kurum eklemek için script
Toplum Gönüllüleri Vakfı ve diğer önemli kurumları ekler
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

def create_slug(name):
    """Organizasyon adından slug oluştur"""
    slug = name.lower()
    slug = slug.replace('ı', 'i').replace('ğ', 'g').replace('ü', 'u').replace('ş', 's').replace('ö', 'o').replace('ç', 'c')
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    return slug[:100]

def find_favicon(website):
    """Web sitesinden favicon bul"""
    if not website:
        return None
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(website, headers=headers, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Favicon için farklı yerleri kontrol et
        favicon_selectors = [
            ('link', {'rel': 'icon'}),
            ('link', {'rel': 'shortcut icon'}),
            ('link', {'rel': 'apple-touch-icon'}),
        ]
        
        for tag, attrs in favicon_selectors:
            favicon = soup.find(tag, attrs=attrs)
            if favicon and favicon.get('href'):
                favicon_url = favicon['href']
                if not favicon_url.startswith('http'):
                    parsed_url = urlparse(website)
                    base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
                    favicon_url = urljoin(base_url, favicon_url)
                return favicon_url
        
        # /favicon.ico dene
        parsed_url = urlparse(website)
        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
        favicon_default = f"{base_url}/favicon.ico"
        
        try:
            favicon_response = requests.head(favicon_default, headers=headers, timeout=5)
            if favicon_response.status_code == 200:
                return favicon_default
        except:
            pass
        
        return None
    except:
        return None

def get_or_create_organization(name, org_type, website, logo_url=None):
    """Organizasyonu bul veya oluştur"""
    try:
        # Önce var mı kontrol et
        result = supabase.table('organizations')\
            .select('id')\
            .ilike('name', name)\
            .execute()
        
        if result.data and len(result.data) > 0:
            org_id = result.data[0]['id']
            print(f"  ✅ Organizasyon bulundu: {name}")
            return org_id
        
        # Yoksa oluştur
        slug = create_slug(name)
        
        org_data = {
            'name': name,
            'slug': slug,
            'type': org_type,
            'website': website,
            'logo_url': logo_url,
            'is_verified': True
        }
        
        result = supabase.table('organizations').insert(org_data).execute()
        
        if result.data and len(result.data) > 0:
            org_id = result.data[0]['id']
            print(f"  ✅ Organizasyon oluşturuldu: {name}")
            return org_id
        else:
            print(f"  ❌ Organizasyon oluşturulamadı: {name}")
            return None
            
    except Exception as e:
        print(f"  ❌ Organizasyon hatası ({name}): {e}")
        return None

# Geniş burs veren kurumlar listesi
ORGANIZATIONS = [
    {
        'name': 'Toplum Gönüllüleri Vakfı',
        'type': 'vakıf',
        'website': 'https://www.tog.org.tr',
        'description': 'Gençlerin sosyal sorumluluk projelerine destek veren vakıf'
    },
    {
        'name': 'Türkiye Eğitim Gönüllüleri Vakfı',
        'type': 'vakıf',
        'website': 'https://www.tegv.org',
        'description': 'Eğitim alanında faaliyet gösteren vakıf'
    },
    {
        'name': 'Türkiye İş Bankası',
        'type': 'özel',
        'website': 'https://www.isbank.com.tr',
        'description': 'İş Bankacılık burs programları'
    },
    {
        'name': 'Garanti BBVA',
        'type': 'özel',
        'website': 'https://www.garantibbva.com.tr',
        'description': 'Garanti BBVA burs programları'
    },
    {
        'name': 'Akbank',
        'type': 'özel',
        'website': 'https://www.akbank.com',
        'description': 'Akbank burs programları'
    },
    {
        'name': 'Yapı Kredi Bankası',
        'type': 'özel',
        'website': 'https://www.yapikredi.com.tr',
        'description': 'Yapı Kredi burs programları'
    },
    {
        'name': 'Türkiye Ziraat Bankası',
        'type': 'kamu',
        'website': 'https://www.ziraatbank.com.tr',
        'description': 'Ziraat Bankası burs programları'
    },
    {
        'name': 'Türkiye Halk Bankası',
        'type': 'kamu',
        'website': 'https://www.halkbank.com.tr',
        'description': 'Halk Bankası burs programları'
    },
    {
        'name': 'Türkiye Vakıflar Bankası',
        'type': 'kamu',
        'website': 'https://www.vakifbank.com.tr',
        'description': 'Vakıfbank burs programları'
    },
    {
        'name': 'Türkiye Kalkınma ve Yatırım Bankası',
        'type': 'kamu',
        'website': 'https://www.kalkinma.com.tr',
        'description': 'Kalkınma Bankası burs programları'
    },
    {
        'name': 'Türkiye Eğitim Vakfı (TEV)',
        'type': 'vakıf',
        'website': 'https://www.tev.org.tr',
        'description': 'Türkiye\'nin en köklü eğitim vakıflarından biri'
    },
    {
        'name': 'Türkiye Diyanet Vakfı',
        'type': 'vakıf',
        'website': 'https://www.tdv.org.tr',
        'description': 'Diyanet İşleri Başkanlığı burs programları'
    },
    {
        'name': 'Türkiye Kızılay Derneği',
        'type': 'dernek',
        'website': 'https://www.kizilay.org.tr',
        'description': 'Kızılay burs programları'
    },
    {
        'name': 'Türkiye Eğitim Derneği',
        'type': 'dernek',
        'website': 'https://www.ted.org.tr',
        'description': 'TED burs programları'
    },
    {
        'name': 'Türkiye Bilimsel ve Teknolojik Araştırma Kurumu',
        'type': 'kamu',
        'website': 'https://www.tubitak.gov.tr',
        'description': 'TÜBİTAK burs programları'
    },
    {
        'name': 'Türkiye Cumhuriyeti Milli Eğitim Bakanlığı',
        'type': 'kamu',
        'website': 'https://www.meb.gov.tr',
        'description': 'MEB burs programları'
    },
    {
        'name': 'Türkiye Cumhuriyeti Yükseköğretim Kurulu',
        'type': 'kamu',
        'website': 'https://www.yok.gov.tr',
        'description': 'YÖK burs programları'
    },
    {
        'name': 'Türkiye Cumhuriyeti Gençlik ve Spor Bakanlığı',
        'type': 'kamu',
        'website': 'https://www.gsb.gov.tr',
        'description': 'Gençlik ve Spor Bakanlığı burs programları'
    },
    {
        'name': 'Türkiye Cumhuriyeti Aile ve Sosyal Hizmetler Bakanlığı',
        'type': 'kamu',
        'website': 'https://www.aile.gov.tr',
        'description': 'Aile ve Sosyal Hizmetler Bakanlığı burs programları'
    },
    {
        'name': 'Türkiye Cumhuriyeti Çalışma ve Sosyal Güvenlik Bakanlığı',
        'type': 'kamu',
        'website': 'https://www.csgb.gov.tr',
        'description': 'Çalışma ve Sosyal Güvenlik Bakanlığı burs programları'
    },
    {
        'name': 'İstanbul Üniversitesi',
        'type': 'üniversite',
        'website': 'https://www.istanbul.edu.tr',
        'description': 'İstanbul Üniversitesi burs programları'
    },
    {
        'name': 'Ankara Üniversitesi',
        'type': 'üniversite',
        'website': 'https://www.ankara.edu.tr',
        'description': 'Ankara Üniversitesi burs programları'
    },
    {
        'name': 'Hacettepe Üniversitesi',
        'type': 'üniversite',
        'website': 'https://www.hacettepe.edu.tr',
        'description': 'Hacettepe Üniversitesi burs programları'
    },
    {
        'name': 'Orta Doğu Teknik Üniversitesi',
        'type': 'üniversite',
        'website': 'https://www.metu.edu.tr',
        'description': 'ODTÜ burs programları'
    },
    {
        'name': 'İstanbul Teknik Üniversitesi',
        'type': 'üniversite',
        'website': 'https://www.itu.edu.tr',
        'description': 'İTÜ burs programları'
    },
    {
        'name': 'Sabancı Üniversitesi',
        'type': 'üniversite',
        'website': 'https://www.sabanciuniv.edu.tr',
        'description': 'Sabancı Üniversitesi burs programları'
    },
    {
        'name': 'Bilkent Üniversitesi',
        'type': 'üniversite',
        'website': 'https://www.bilkent.edu.tr',
        'description': 'Bilkent Üniversitesi burs programları'
    },
    {
        'name': 'Özyeğin Üniversitesi',
        'type': 'üniversite',
        'website': 'https://www.ozyegin.edu.tr',
        'description': 'Özyeğin Üniversitesi burs programları'
    },
    {
        'name': 'Bahçeşehir Üniversitesi',
        'type': 'üniversite',
        'website': 'https://www.bau.edu.tr',
        'description': 'Bahçeşehir Üniversitesi burs programları'
    },
    {
        'name': 'İstanbul Bilgi Üniversitesi',
        'type': 'üniversite',
        'website': 'https://www.bilgi.edu.tr',
        'description': 'İstanbul Bilgi Üniversitesi burs programları'
    },
    {
        'name': 'Yeditepe Üniversitesi',
        'type': 'üniversite',
        'website': 'https://www.yeditepe.edu.tr',
        'description': 'Yeditepe Üniversitesi burs programları'
    },
]

def add_organizations():
    """Organizasyonları ekle"""
    print("🔄 Burs veren kurumlar ekleniyor...\n")
    
    added_count = 0
    skipped_count = 0
    
    for org_info in ORGANIZATIONS:
        print(f"🔍 {org_info['name']}")
        
        # Favicon bul
        logo_url = find_favicon(org_info['website'])
        if logo_url:
            print(f"  ✅ Favicon bulundu: {logo_url}")
        
        # Organizasyonu ekle
        org_id = get_or_create_organization(
            org_info['name'],
            org_info['type'],
            org_info['website'],
            logo_url
        )
        
        if org_id:
            added_count += 1
        else:
            skipped_count += 1
        
        print()
    
    print(f"\n📊 Özet: {added_count} eklendi, {skipped_count} zaten var/atlandı")

if __name__ == "__main__":
    add_organizations()

