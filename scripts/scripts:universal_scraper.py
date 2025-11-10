# -*- coding: utf-8 -*-
import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv
import anthropic
import json

load_dotenv('.env.local')

# Supabase
supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# Anthropic Claude API
claude = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

# Scrape edilecek siteler
SITES = [
    "https://www.tev.org.tr/",
    "https://www.vkv.org.tr/",
    "https://www.turkiyeburslari.gov.tr/",
]

def fetch_page(url):
    """Sayfayı indir"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"❌ Sayfa indirilemedi ({url}): {e}")
        return None

def ai_parse_scholarships(html, url):
    """Claude AI ile burs bilgilerini çıkar"""
    
    # HTML'i kısalt (token limiti için)
    soup = BeautifulSoup(html, 'html.parser')
    
    # Sadece text content al
    text = soup.get_text(separator='\n', strip=True)
    
    # Çok uzunsa kısalt (ilk 10000 karakter)
    if len(text) > 10000:
        text = text[:10000]
    
    prompt = f"""Bu web sayfasından burs bilgilerini çıkar. JSON array döndür:

Web sayfası içeriği:
{text}

Kaynak URL: {url}

Çıkar:
- title: Burs adı
- organization: Kurum adı (URL'den çıkar)
- description: Açıklama (kısa)
- amount: Miktar (sadece sayı, TL/dolar işaretlerini çıkar)
- amount_type: "aylık" veya "yıllık" veya "tek seferlik"
- deadline: Son başvuru (YYYY-MM-DD formatında, bulamazsan null)
- type: "akademik" veya "ihtiyaç" veya "engelli" veya "sporcu"
- education_level: "lise" veya "lisans" veya "yükseklisans" veya "doktora"
- application_url: Başvuru linki (bulamazsan kaynak URL kullan)

Sadece JSON döndür, başka açıklama yapma.
"""

    try:
        message = claude.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        response_text = message.content[0].text
        
        # JSON parse et
        scholarships = json.loads(response_text)
        
        return scholarships
        
    except Exception as e:
        print(f"❌ AI parsing hatası: {e}")
        return []

def save_to_supabase(scholarships):
    """Supabase'e kaydet"""
    saved = 0
    skipped = 0
    
    for s in scholarships:
        try:
            # Zorunlu alanları kontrol et
            if not s.get('title') or not s.get('organization'):
                print(f"⚠️  Eksik alan, atlandı: {s}")
                continue
            
            # is_active ekle
            s['is_active'] = True
            
            # Duplicate kontrolü
            existing = supabase.table('scholarships')\
                .select('id')\
                .eq('title', s['title'])\
                .eq('organization', s['organization'])\
                .execute()
            
            if not existing.data:
                supabase.table('scholarships').insert(s).execute()
                print(f"✅ Eklendi: {s['title']} ({s['organization']})")
                saved += 1
            else:
                print(f"⏭️  Zaten var: {s['title']}")
                skipped += 1
                
        except Exception as e:
            print(f"❌ Kayıt hatası: {e}")
    
    print(f"\n📊 Özet: {saved} yeni, {skipped} mevcut")
    return saved

def scrape_all_sites():
    """Tüm siteleri scrape et"""
    total_saved = 0
    
    for url in SITES:
        print(f"\n🕷️  Scraping: {url}")
        print("─" * 50)
        
        # Sayfayı indir
        html = fetch_page(url)
        if not html:
            continue
        
        # AI ile parse et
        scholarships = ai_parse_scholarships(html, url)
        print(f"📊 {len(scholarships)} burs bulundu")
        
        # Kaydet
        if scholarships:
            saved = save_to_supabase(scholarships)
            total_saved += saved
    
    return total_saved

if __name__ == "__main__":
    print("🚀 Universal AI Scraper Başlatılıyor...")
    print("=" * 50)
    
    total = scrape_all_sites()
    
    print("\n" + "=" * 50)
    print(f"✅ TOPLAM: {total} yeni burs eklendi!")