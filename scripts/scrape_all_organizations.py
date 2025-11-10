"""
AŞAMA 2: TÜM KURUMLARI TARA VE BURS BİLGİLERİNİ TOPLA
Bu script organizations.json'dan kurumları okur ve her birini tarar
"""

import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv
import json
import re
from datetime import datetime, timedelta
from openai import OpenAI
from urllib.parse import urljoin, urlparse

load_dotenv('.env.local')

# API connections
supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
openai_key = os.environ.get("OPENAI_API_KEY")

supabase: Client = create_client(supabase_url, supabase_key)
openai_client = OpenAI(api_key=openai_key)

def load_organizations():
    """organizations.json dosyasından kurumları yükle"""
    try:
        with open('scripts/organizations.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("⚠️  organizations.json bulunamadı. Önce discover_organizations.py çalıştırın.")
        return []

def find_favicon(url):
    """Web sitesinden favicon URL'ini bul"""
    try:
        print(f"  🔍 Favicon aranıyor...")
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
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
                    parsed_url = urlparse(url)
                    base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
                    favicon_url = urljoin(base_url, favicon_url)
                
                print(f"  ✅ Favicon bulundu: {favicon_url}")
                return favicon_url
        
        # Eğer HTML'de bulunamazsa, /favicon.ico dene
        parsed_url = urlparse(url)
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

def scrape_organization_website(org):
    """Bir kurumun web sitesini scrape et"""
    print(f"\n🕷️  {org['name']} taranıyor...")
    
    if not org.get('website'):
        print("⚠️  Web sitesi yok, atlanıyor")
        return []
    
    # Favicon bul
    favicon_url = find_favicon(org['website'])
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        # Ana sayfayı tara
        response = requests.get(org['website'], headers=headers, timeout=15)
        response.encoding = 'utf-8'
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Burs ile ilgili linkleri bul
        burs_keywords = ['burs', 'scholarship', 'destek', 'support', 'grant']
        burs_links = []
        
        for link in soup.find_all('a', href=True):
            link_text = link.get_text(strip=True).lower()
            link_href = link['href']
            
            if any(keyword in link_text or keyword in link_href.lower() for keyword in burs_keywords):
                if not link_href.startswith('http'):
                    link_href = org['website'].rstrip('/') + '/' + link_href.lstrip('/')
                burs_links.append(link_href)
        
        burs_links = list(set(burs_links))[:5]  # İlk 5 benzersiz link
        print(f"🔗 {len(burs_links)} burs sayfası bulundu")
        
        # Her burs sayfasını AI ile parse et
        scholarships = []
        for link in burs_links:
            try:
                scholarship_data = scrape_and_parse_with_ai(link, org)
                if scholarship_data:
                    scholarships.extend(scholarship_data)
            except Exception as e:
                print(f"⚠️  {link} parse edilemedi: {e}")
                continue
        
        return scholarships
        
    except Exception as e:
        print(f"❌ Scraping hatası: {e}")
        return []

def scrape_and_parse_with_ai(url, org):
    """AI kullanarak burs sayfasını parse et"""
    print(f"  📄 {url[:60]}... parse ediliyor...")
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=15)
        response.encoding = 'utf-8'
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # JavaScript, style, script etiketlerini kaldır
        for tag in soup(['script', 'style', 'nav', 'footer', 'header']):
            tag.decompose()
        
        # Sadece metin içeriği al
        text_content = soup.get_text(separator='\n', strip=True)
        text_content = re.sub(r'\n+', '\n', text_content)[:4000]  # İlk 4000 karakter
        
        # OpenAI ile parse et
        prompt = f"""
Aşağıdaki web sayfası içeriğinden burs bilgilerini çıkar.
Kurum: {org['name']}

Web sayfası içeriği:
{text_content}

Lütfen JSON formatında şu bilgileri çıkar (birden fazla burs varsa array döndür):
{{
  "scholarships": [
    {{
      "title": "Burs adı",
      "description": "Burs açıklaması (max 300 karakter)",
      "amount": 5000,
      "amount_type": "aylık/yıllık/tek seferlik",
      "deadline": "2025-12-31",
      "type": "akademik/ihtiyaç/engelli",
      "education_level": "lise/lisans/yükseklisans",
      "requirements": "Gereksinimler (kısa)",
      "documents": ["Transkript", "Kimlik"]
    }}
  ]
}}

Eğer burs bilgisi bulamazsan boş array döndür.
"""
        
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Sen burs bilgilerini web sayfalarından çıkaran bir AI asistanısın. Sadece JSON formatında yanıt ver."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1500
        )
        
        # JSON parse et
        result_text = response.choices[0].message.content
        # JSON'u temizle
        result_text = result_text.strip()
        if result_text.startswith('```json'):
            result_text = result_text[7:]
        if result_text.startswith('```'):
            result_text = result_text[3:]
        if result_text.endswith('```'):
            result_text = result_text[:-3]
        
        result = json.loads(result_text.strip())
        scholarships = result.get('scholarships', [])
        
        # Kurumun bilgilerini ekle
        for scholarship in scholarships:
            scholarship['organization'] = org['name']
            scholarship['organization_logo'] = favicon_url
            scholarship['application_url'] = url
            scholarship['is_active'] = True
            scholarship['has_api_integration'] = False
        
        print(f"  ✅ {len(scholarships)} burs bulundu")
        return scholarships
        
    except json.JSONDecodeError as e:
        print(f"  ⚠️  JSON parse hatası: {e}")
        return []
    except Exception as e:
        print(f"  ⚠️  AI parse hatası: {e}")
        return []

def save_to_supabase(scholarships):
    """Bursları Supabase'e kaydet"""
    print("\n💾 Burslar database'e kaydediliyor...")
    
    saved_count = 0
    skipped_count = 0
    
    for s in scholarships:
        try:
            # Duplicate kontrolü
            existing = supabase.table('scholarships')\
                .select('id')\
                .eq('title', s['title'])\
                .eq('organization', s['organization'])\
                .execute()
            
            if not existing.data:
                supabase.table('scholarships').insert(s).execute()
                print(f"✅ Eklendi: {s['title'][:50]}...")
                saved_count += 1
            else:
                print(f"⏭️  Zaten var: {s['title'][:50]}...")
                skipped_count += 1
                
        except Exception as e:
            print(f"❌ Kayıt hatası: {e}")
    
    print(f"\n📊 Özet: {saved_count} eklendi, {skipped_count} atlandı")

if __name__ == "__main__":
    print("🚀 KURUM BAZLI BURS SCRAPER BAŞLATILIYOR\n")
    print("="*60)
    
    # 1. Kurumları yükle
    organizations = load_organizations()
    
    if not organizations:
        print("⚠️  Kurum listesi boş. Önce discover_organizations.py çalıştırın.")
        exit(1)
    
    print(f"📋 {len(organizations)} kurum yüklendi")
    
    # 2. Her kurumu tara
    all_scholarships = []
    
    for idx, org in enumerate(organizations[:5], 1):  # İlk 5 kurum (test)
        print(f"\n[{idx}/{min(5, len(organizations))}] {org['name']}")
        scholarships = scrape_organization_website(org)
        all_scholarships.extend(scholarships)
    
    print("\n"+"="*60)
    print(f"📊 TOPLAM {len(all_scholarships)} BURS BULUNDU")
    print("="*60)
    
    # 3. Supabase'e kaydet
    if all_scholarships:
        save_to_supabase(all_scholarships)
    else:
        print("\n⚠️  Hiç burs bulunamadı!")
    
    print("\n✅ TÜM KURUMLARIN TARAMASI TAMAMLANDI!")

