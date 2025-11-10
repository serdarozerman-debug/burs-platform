import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv
from openai import OpenAI
import json

load_dotenv('.env.local')

# Supabase
supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# OpenAI
openai_api_key = os.environ.get("OPENAI_API_KEY")
openai_client = OpenAI(api_key=openai_api_key)

# Scrape edilecek siteler
SITES = [
    "https://www.tev.org.tr/",
    "https://www.vkv.org.tr/",
    "https://www.turkiyeburslari.gov.tr/",
    "https://www.sabancivakfi.org/",
    "https://www.ibb.istanbul/EgitimDestek",
    "https://www.ankara.bel.tr/egitim-burslari",
]

def fetch_page(url):
    """Sayfayi indir"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"Sayfa indirilemedi ({url}): {e}")
        return None

def ai_parse_scholarships(html, url):
    """GPT-4 ile burs bilgilerini cikar - Gelistirilmis prompt"""
    
    soup = BeautifulSoup(html, 'html.parser')
    
    # Script ve style tag'lerini temizle
    for script in soup(["script", "style", "nav", "footer", "header"]):
        script.decompose()
    
    # Sadece text content al
    text = soup.get_text(separator='\n', strip=True)
    
    # Cok uzunsa kisalt
    if len(text) > 12000:
        text = text[:12000]
    
    prompt = f"""Sen bir web scraping uzmanısın. Aşağıdaki web sayfasından burs/scholarship bilgilerini çıkar.

WEB SAYFASI İÇERİĞİ:
{text}

KAYNAK URL: {url}

GÖREV:
Bu sayfadan GERÇEK burs programlarını bul ve her biri için bilgileri çıkar.
Reklam, navigasyon, genel açıklama metinlerini ATLAYIP sadece GERÇEK burs programlarını çıkar.

HER BURS İÇİN ZORUNLU BİLGİLER:
1. title: Burs programının TAM ADI (örn: "2210-A Genel Yüksek Lisans Burs Programı", "TEV Burs Programı")
2. organization: Kurumu URL'den belirle (örn: "tev.org.tr" → "Türk Eğitim Vakfı", "vkv.org.tr" → "Vehbi Koç Vakfı")
3. description: Burs hakkında 1-2 cümlelik özet (max 250 karakter)
4. amount: Burs miktarı - SADECE SAYI (örn: 7500, 15000, 20000)
   - Eğer metin "7.500 TL", "15,000 TL", "$10000" içeriyorsa → sadece sayıyı al
   - Eğer bulamazsan → 0 yaz
5. amount_type: "aylık", "yıllık" veya "tek seferlik"
   - "aylık", "monthly", "per month" → "aylık"
   - "yıllık", "annual", "per year" → "yıllık"
   - Diğer → "tek seferlik"
6. deadline: Son başvuru tarihi YYYY-MM-DD formatında
   - Eğer "31 Aralık 2025" → "2025-12-31"
   - Eğer "December 31, 2025" → "2025-12-31"
   - Eğer bulamazsan veya "sürekli açık" → "2026-12-31"
   - ESKİ TARİHLER ATLANACAK (2024 ve öncesi)
7. type: "akademik" (çoğu burs akademiktir)
8. education_level: "lise", "lisans", "yukseklisans" veya "doktora"
   - Eğer belirtilmemişse → "lisans"
9. application_url: Başvuru linki
   - Sayfada bulursan tam URL yaz
   - Bulamazsan kaynak URL'i kullan: {url}

ÖNEMLİ KURALLAR:
- Minimum 2, maksimum 8 burs programı bul
- Sadece GERÇEK, AKTİF burs programlarını ekle
- Tekrar eden programları çıkar
- ESKİ (2024 öncesi) veya GEÇMİŞ bursları ATLAYIP
- Genel açıklama metinlerini, navigasyon linklerini ATLA

ÇIKTI FORMATI:
Sadece geçerli JSON array döndür, başka açıklama yapma:

[
  {{
    "title": "...",
    "organization": "...",
    "description": "...",
    "amount": 15000,
    "amount_type": "aylık",
    "deadline": "2025-12-31",
    "type": "akademik",
    "education_level": "lisans",
    "application_url": "https://..."
  }}
]"""

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system", 
                    "content": "Sen profesyonel bir web scraping ve data extraction uzmanısın. Web sayfalarından strukturlu veri çıkarmada çok başarılısın. Her zaman geçerli JSON formatında cevap verirsin."
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
            temperature=0.2,  # Daha deterministik
            max_tokens=3000,
            response_format={"type": "json_object"}  # JSON zorunlu kıl
        )
        
        response_text = response.choices[0].message.content
        
        # JSON parse et
        if '```json' in response_text:
            response_text = response_text.split('```json')[1].split('```')[0].strip()
        elif '```' in response_text:
            response_text = response_text.split('```')[1].split('```')[0].strip()
        
        # JSON içinde array varsa direkt array döndür, yoksa obje içindeki array'i bul
        try:
            data = json.loads(response_text)
            if isinstance(data, list):
                scholarships = data
            elif isinstance(data, dict):
                # En büyük array'i bul
                scholarships = []
                for value in data.values():
                    if isinstance(value, list) and len(value) > len(scholarships):
                        scholarships = value
            else:
                scholarships = []
        except:
            scholarships = []
        
        # Validation: Her bursu kontrol et
        valid_scholarships = []
        for s in scholarships:
            if (s.get('title') and 
                s.get('organization') and 
                s.get('amount') is not None and
                int(s.get('amount', 0)) >= 0):
                valid_scholarships.append(s)
        
        return valid_scholarships
        
    except Exception as e:
        print(f"AI parsing hatasi: {e}")
        import traceback
        traceback.print_exc()
        return []

def save_to_supabase(scholarships):
    """Supabase'e kaydet"""
    saved = 0
    skipped = 0
    
    for s in scholarships:
        try:
            # Zorunlu alanlari kontrol et
            if not s.get('title') or not s.get('organization'):
                print(f"Eksik alan, atlandi: {s.get('title', 'Unknown')}")
                continue
            
            # is_active ekle
            s['is_active'] = True
            
            # Duplicate kontrolu
            existing = supabase.table('scholarships')\
                .select('id')\
                .eq('title', s['title'])\
                .eq('organization', s['organization'])\
                .execute()
            
            if not existing.data:
                supabase.table('scholarships').insert(s).execute()
                print(f"Eklendi: {s['title']} ({s['organization']})")
                saved += 1
            else:
                print(f"Zaten var: {s['title']}")
                skipped += 1
                
        except Exception as e:
            print(f"Kayit hatasi ({s.get('title', 'Unknown')}): {e}")
    
    print(f"\nOzet: {saved} yeni, {skipped} mevcut")
    return saved

def scrape_all_sites():
    """Tum siteleri scrape et"""
    total_saved = 0
    
    for url in SITES:
        print(f"\n{'='*60}")
        print(f"Scraping: {url}")
        print('='*60)
        
        # Sayfayi indir
        html = fetch_page(url)
        if not html:
            print("Sayfa indirilemedi, atlanıyor...")
            continue
        
        # AI ile parse et
        print("AI parsing...")
        scholarships = ai_parse_scholarships(html, url)
        print(f"{len(scholarships)} burs bulundu")
        
        # Kaydet
        if scholarships:
            saved = save_to_supabase(scholarships)
            total_saved += saved
        else:
            print("Hicbir burs parse edilemedi.")
    
    return total_saved

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🤖 Universal AI Scraper (GPT-4o-mini)")
    print("="*60 + "\n")
    
    # API key kontrolu
    if not openai_api_key:
        print("HATA: OPENAI_API_KEY bulunamadi!")
        print(".env.local dosyasina OPENAI_API_KEY ekleyin.")
        exit(1)
    
    print(f"API Key: {openai_api_key[:20]}...")
    print(f"Toplam {len(SITES)} site taranacak\n")
    
    total = scrape_all_sites()
    
    print("\n" + "="*60)
    print(f"SONUC: {total} yeni burs eklendi!")
    print("="*60 + "\n")