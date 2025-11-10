"""
Advanced Scholarship Scraper with AI
Microfon.co analizi temel alınarak geliştirildi
"""

import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv
import json
from datetime import datetime, timedelta
from openai import OpenAI
import re
from urllib.parse import urljoin, urlparse
import sys
sys.path.append(os.path.dirname(__file__))

try:
    from document_normalizer import normalize_document_name, categorize_documents, extract_requirements_from_text
except ImportError:
    print("⚠️  document_normalizer modülü yüklenemedi, basit normalizasyon kullanılacak")
    def normalize_document_name(doc): return doc.lower().replace(' ', '_')
    def categorize_documents(docs): return {'mandatory': docs, 'optional': [], 'conditional': []}
    def extract_requirements_from_text(text): return {}

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env.local'))

# API connections
supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
openai_key = os.environ.get("OPENAI_API_KEY")

if not supabase_url or not supabase_key:
    raise Exception("Supabase credentials not found in .env.local")

supabase: Client = create_client(supabase_url, supabase_key)
openai_client = OpenAI(api_key=openai_key)

def find_favicon(url: str) -> str:
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
        ]
        
        for tag, attrs in favicon_selectors:
            favicon = soup.find(tag, attrs=attrs)
            if favicon and favicon.get('href'):
                favicon_url = favicon['href']
                if not favicon_url.startswith('http'):
                    parsed_url = urlparse(url)
                    base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
                    favicon_url = urljoin(base_url, favicon_url)
                
                print(f"  ✅ Favicon bulundu: {favicon_url}")
                return favicon_url
        
        # /favicon.ico dene
        parsed_url = urlparse(url)
        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
        favicon_default = f"{base_url}/favicon.ico"
        
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


def scrape_with_ai(url: str, org_name: str, favicon_url: str = None) -> list:
    """OpenAI ile akıllı scraping"""
    try:
        print(f"\n🤖 AI Scraping: {org_name}")
        print(f"📍 URL: {url}")
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Script ve style taglerini kaldır
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Metni al (ilk 8000 karakter)
        text = soup.get_text()
        text = re.sub(r'\s+', ' ', text).strip()[:8000]
        
        # OpenAI'ye gönder
        prompt = f"""
Aşağıdaki web sayfası metninden burs bilgilerini çıkar. Bu sayfa {org_name} kurumuna ait.

ÇIKARILMASI GEREKEN BİLGİLER:
1. Burs başlığı/adı
2. Burs miktarı (sayı olarak) ve türü (aylık/yıllık/tek seferlik)
3. Son başvuru tarihi (YYYY-MM-DD formatında)
4. Başvuru başlangıç tarihi (varsa)
5. Eğitim seviyesi (lise/lisans/yükseklisans/doktora)
6. Burs türü (akademik/ihtiyaç/engelli/spor/sanat)
7. Kapsam (yurtiçi/yurtdışı/her ikisi)
8. Gerekli belgeler (liste halinde)
9. Başvuru koşulları
10. Detaylı açıklama
11. Min yaş, max yaş (varsa)
12. Min not ortalaması (varsa)
13. Cinsiyet kısıtı (erkek/kadın/tümü)
14. Uyruk koşulu (TC vatandaşı vb.)

WEB SAYFA METNİ:
{text}

CEVABI JSON FORMATINDA VER:
{{
  "scholarships": [
    {{
      "title": "Burs adı",
      "amount": 5000,
      "amount_type": "aylık",
      "deadline": "2025-12-31",
      "start_date": "2025-09-01",
      "education_level": "lisans",
      "type": "akademik",
      "scope": "yurtiçi",
      "description": "Kısa açıklama",
      "detailed_description": "Detaylı açıklama",
      "documents_required": ["kimlik belgesi", "öğrenci belgesi"],
      "application_requirements": "Başvuru koşulları text",
      "age_min": 18,
      "age_max": 25,
      "min_gpa": 3.0,
      "gender": "tümü",
      "nationality_requirement": "TC",
      "is_refundable": false
    }}
  ]
}}

NOTLAR:
- Birden fazla burs varsa hepsini liste halinde ver
- Bilgi yoksa null olarak işaretle
- Burs miktarı yoksa 0 yaz
- Tarih formatına DİKKAT ET (YYYY-MM-DD)
- Eğitim seviyesi: "lise", "lisans", "yükseklisans", "doktora" olmalı
- Tür: "akademik", "ihtiyaç", "engelli", "spor", "sanat"
- Kapsam: "yurtiçi", "yurtdışı", "her ikisi"
"""

        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Sen bir web scraping uzmanısın. Burs bilgilerini JSON formatında çıkarıyorsun."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=2000
        )
        
        result_text = response.choices[0].message.content.strip()
        
        # JSON parse et
        if result_text.startswith('```json'):
            result_text = result_text[7:]
        if result_text.endswith('```'):
            result_text = result_text[:-3]
        
        result = json.loads(result_text.strip())
        scholarships = result.get('scholarships', [])
        
        # Normalize et ve ekstra alanları ekle
        for scholarship in scholarships:
            scholarship['organization'] = org_name
            scholarship['organization_logo'] = favicon_url
            scholarship['application_url'] = url
            scholarship['is_active'] = True
            scholarship['has_api_integration'] = False
            scholarship['application_status'] = 'open'
            scholarship['organization_category'] = 'vakıf'  # Kategori bilgisi organizations.json'dan alınacak
            
            # Belgeleri normalize et
            if scholarship.get('documents_required'):
                normalized_docs = [normalize_document_name(doc) for doc in scholarship['documents_required']]
                categorized = categorize_documents(normalized_docs)
                scholarship['documents_mandatory'] = categorized['mandatory']
                scholarship['documents_optional'] = categorized['optional']
                scholarship['documents_conditional'] = categorized['conditional']
                del scholarship['documents_required']
            
            # Requirements extraction
            if scholarship.get('detailed_description'):
                extracted = extract_requirements_from_text(scholarship['detailed_description'])
                for key, value in extracted.items():
                    if key not in scholarship or scholarship[key] is None:
                        scholarship[key] = value
        
        print(f"  ✅ {len(scholarships)} burs bulundu")
        return scholarships
        
    except json.JSONDecodeError as e:
        print(f"  ❌ JSON parse hatası: {e}")
        print(f"  📄 Response: {result_text[:200]}...")
        return []
    except Exception as e:
        print(f"  ❌ Hata: {e}")
        return []


def save_to_database(scholarships: list):
    """Bursları Supabase'e kaydet"""
    if not scholarships:
        return 0
    
    print(f"\n💾 {len(scholarships)} burs database'e kaydediliyor...")
    saved_count = 0
    
    for scholarship in scholarships:
        try:
            # Aynı başlık ve kurum varsa kontrol et
            existing = supabase.table('scholarships')\
                .select('id')\
                .eq('title', scholarship['title'])\
                .eq('organization', scholarship['organization'])\
                .execute()
            
            if existing.data:
                print(f"  ⏭️  Zaten var: {scholarship['title']}")
                continue
            
            # Yeni kayıt ekle
            supabase.table('scholarships').insert(scholarship).execute()
            saved_count += 1
            print(f"  ✅ Kaydedildi: {scholarship['title']}")
            
        except Exception as e:
            print(f"  ❌ Kayıt hatası ({scholarship.get('title', 'Unknown')}): {e}")
    
    return saved_count


def load_organizations():
    """organizations.json'dan kurumları yükle"""
    try:
        with open('scripts/organizations.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("⚠️  organizations.json bulunamadı")
        return []


def scrape_all_organizations(limit: int = None):
    """Tüm kurumları scrape et"""
    organizations = load_organizations()
    
    if limit:
        organizations = organizations[:limit]
    
    print(f"🚀 {len(organizations)} kurum scrape edilecek...\n")
    
    total_scholarships = 0
    total_saved = 0
    
    for idx, org in enumerate(organizations, 1):
        print(f"\n{'='*60}")
        print(f"[{idx}/{len(organizations)}] {org['name']}")
        print(f"{'='*60}")
        
        if not org.get('website'):
            print("  ⚠️  Web sitesi yok, atlanıyor")
            continue
        
        # Favicon bul
        favicon_url = find_favicon(org['website'])
        
        # Scrape et
        scholarships = scrape_with_ai(
            url=org['website'],
            org_name=org['name'],
            favicon_url=favicon_url
        )
        
        # Kategori bilgisini ekle
        for scholarship in scholarships:
            scholarship['organization_category'] = org.get('category', 'diğer')
        
        # Database'e kaydet
        saved = save_to_database(scholarships)
        
        total_scholarships += len(scholarships)
        total_saved += saved
        
        print(f"\n📊 Bu kurum için: {len(scholarships)} bulundu, {saved} kaydedildi")
        
        # Rate limiting
        import time
        time.sleep(2)
    
    print(f"\n{'='*60}")
    print(f"✅ TAMAMLANDI!")
    print(f"📊 Toplam: {total_scholarships} burs bulundu")
    print(f"💾 Toplam: {total_saved} burs kaydedildi")
    print(f"{'='*60}")


if __name__ == '__main__':
    import sys
    
    # Komut satırı argümanı: ilk N kurum
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else None
    
    if limit:
        print(f"🎯 İlk {limit} kurum scrape edilecek (test modu)")
    else:
        print(f"🎯 TÜM kurumlar scrape edilecek")
    
    scrape_all_organizations(limit=limit)

