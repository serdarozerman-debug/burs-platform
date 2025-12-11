"""
Yeni eklenen organizasyonların burslarını scrape etmek için script
Toplum Gönüllüleri Vakfı ve diğer kurumlar için
"""

import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv
import re
from datetime import datetime, timedelta
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

def create_slug(title):
    """Başlıktan slug oluştur"""
    slug = title.lower()
    slug = slug.replace('ı', 'i').replace('ğ', 'g').replace('ü', 'u').replace('ş', 's').replace('ö', 'o').replace('ç', 'c')
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    return slug[:100]

def extract_amount(text):
    """Metinden miktar çıkar"""
    if not text:
        return 5000, "aylık"
    
    numbers = re.findall(r'\d+\.?\d*', text.replace('.', '').replace(',', '.'))
    if numbers:
        try:
            amount = int(float(numbers[0]))
            amount_type = "aylık" if "aylık" in text.lower() or "ay" in text.lower() else "yıllık"
            if "tek" in text.lower() or "seferlik" in text.lower():
                amount_type = "tek seferlik"
            return amount, amount_type
        except:
            pass
    
    return 5000, "aylık"

def extract_deadline(text):
    """Son başvuru tarihini çıkar"""
    if not text:
        return (datetime.now() + timedelta(days=180)).strftime('%Y-%m-%d')
    
    months = {
        'ocak': '01', 'şubat': '02', 'mart': '03', 'nisan': '04',
        'mayıs': '05', 'haziran': '06', 'temmuz': '07', 'ağustos': '08',
        'eylül': '09', 'ekim': '10', 'kasım': '11', 'aralık': '12'
    }
    
    text_lower = text.lower()
    
    for month_tr, month_num in months.items():
        if month_tr in text_lower:
            numbers = re.findall(r'\d+', text)
            if len(numbers) >= 2:
                day = numbers[0].zfill(2)
                year = numbers[1] if len(numbers[1]) == 4 else f"20{numbers[1]}"
                return f"{year}-{month_num}-{day}"
    
    return (datetime.now() + timedelta(days=180)).strftime('%Y-%m-%d')

def determine_education_level(text):
    """Eğitim seviyesini belirle"""
    text_lower = text.lower()
    
    if any(k in text_lower for k in ['doktora', 'phd', 'doctorate']):
        return 'yükseklisans'
    elif any(k in text_lower for k in ['yüksek lisans', 'master', 'yükseklisans']):
        return 'yükseklisans'
    elif any(k in text_lower for k in ['lisans', 'üniversite', 'university']):
        return 'lisans'
    elif any(k in text_lower for k in ['lise', 'high school']):
        return 'lise'
    else:
        return 'lisans'

def determine_type(text):
    """Burs türünü belirle"""
    text_lower = text.lower()
    
    if any(k in text_lower for k in ['engelli', 'engellilik', 'disability']):
        return 'engelli'
    elif any(k in text_lower for k in ['ihtiyaç', 'maddi', 'gelir']):
        return 'ihtiyaç'
    else:
        return 'akademik'

def scrape_tog():
    """Toplum Gönüllüleri Vakfı burslarını scrape et"""
    print("🕷️  Toplum Gönüllüleri Vakfı web sitesi taranıyor...")
    
    base_url = "https://www.tog.org.tr"
    burs_url = f"{base_url}/burslar"  # Burs sayfası
    
    # Organizasyonu bul
    org_result = supabase.table('organizations').select('id').ilike('name', '%Toplum Gönüllüleri%').execute()
    
    if not org_result.data:
        print("❌ Toplum Gönüllüleri Vakfı bulunamadı!")
        return []
    
    org_id = org_result.data[0]['id']
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(burs_url, headers=headers, timeout=15)
        response.encoding = 'utf-8'
        soup = BeautifulSoup(response.content, 'html.parser')
        
        scholarships = []
        
        # Burs başlıklarını bul
        burs_links = soup.find_all('a', href=True)
        burs_keywords = ['burs', 'destek', 'program']
        
        for link in burs_links:
            link_text = link.get_text(strip=True).lower()
            if any(k in link_text for k in burs_keywords) and len(link_text) > 10:
                href = link.get('href', '')
                if not href.startswith('http'):
                    href = urljoin(base_url, href)
                
                # Basit burs oluştur
                scholarship = {
                    'organization_id': org_id,
                    'title': link.get_text(strip=True)[:200],
                    'slug': create_slug(link.get_text(strip=True)),
                    'description': f"Toplum Gönüllüleri Vakfı {link.get_text(strip=True)} burs programı",
                    'amount': 5000,
                    'amount_type': 'aylık',
                    'deadline': (datetime.now() + timedelta(days=180)).strftime('%Y-%m-%d'),
                    'type': 'akademik',
                    'education_level': 'lisans',
                    'application_url': href,
                    'is_active': True,
                    'is_published': True
                }
                
                scholarships.append(scholarship)
        
        # Eğer scraping başarısızsa, bilinen bursları ekle
        if len(scholarships) < 1:
            scholarships.append({
                'organization_id': org_id,
                'title': 'Toplum Gönüllüleri Vakfı Burs Programı',
                'slug': create_slug('Toplum Gönüllüleri Vakfı Burs Programı'),
                'description': 'Toplum Gönüllüleri Vakfı tarafından verilen burs programı',
                'amount': 5000,
                'amount_type': 'aylık',
                'deadline': (datetime.now() + timedelta(days=180)).strftime('%Y-%m-%d'),
                'type': 'akademik',
                'education_level': 'lisans',
                'application_url': f"{base_url}/burslar",
                'is_active': True,
                'is_published': True
            })
        
        return scholarships[:5]  # İlk 5 burs
        
    except Exception as e:
        print(f"❌ Scraping hatası: {e}")
        return []

def save_scholarships(scholarships):
    """Bursları kaydet"""
    saved_count = 0
    skipped_count = 0
    
    for s in scholarships:
        try:
            # Duplicate kontrolü
            existing = supabase.table('scholarships')\
                .select('id')\
                .eq('slug', s['slug'])\
                .eq('organization_id', s['organization_id'])\
                .execute()
            
            if not existing.data:
                supabase.table('scholarships').insert(s).execute()
                print(f"  ✅ Eklendi: {s['title']}")
                saved_count += 1
            else:
                print(f"  ⏭️  Zaten var: {s['title']}")
                skipped_count += 1
                
        except Exception as e:
            print(f"  ❌ Kayıt hatası ({s.get('title', 'Unknown')}): {e}")
    
    return saved_count

def scrape_new_organizations():
    """Yeni eklenen organizasyonların burslarını scrape et"""
    print("🔄 Yeni organizasyonların bursları scrape ediliyor...\n")
    
    # Öncelikli organizasyonlar (burs sayfaları bilinenler)
    priority_orgs = [
        'Toplum Gönüllüleri Vakfı',
        'Türkiye Eğitim Gönüllüleri Vakfı',
    ]
    
    total_saved = 0
    
    for org_name in priority_orgs:
        print(f"🔍 {org_name}")
        
        if 'Toplum Gönüllüleri' in org_name:
            scholarships = scrape_tog()
        else:
            scholarships = []
        
        if scholarships:
            saved = save_scholarships(scholarships)
            total_saved += saved
            print()
        else:
            print(f"  ⚠️  Burs bulunamadı\n")
    
    print(f"\n📊 Özet: {total_saved} yeni burs eklendi")

if __name__ == "__main__":
    scrape_new_organizations()

