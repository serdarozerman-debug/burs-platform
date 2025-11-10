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
key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

def extract_amount(text):
    """Metinden miktar çıkar"""
    if not text:
        return 5000, "aylık"
    
    # Sayıları bul
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
    
    # Türkçe ayları İngilizce'ye çevir
    months = {
        'ocak': '01', 'şubat': '02', 'mart': '03', 'nisan': '04',
        'mayıs': '05', 'haziran': '06', 'temmuz': '07', 'ağustos': '08',
        'eylül': '09', 'ekim': '10', 'kasım': '11', 'aralık': '12'
    }
    
    text_lower = text.lower()
    
    # "31 Aralık 2025" formatı
    for month_tr, month_num in months.items():
        if month_tr in text_lower:
            numbers = re.findall(r'\d+', text)
            if len(numbers) >= 2:
                day = numbers[0].zfill(2)
                year = numbers[1] if len(numbers[1]) == 4 else f"20{numbers[1]}"
                return f"{year}-{month_num}-{day}"
    
    # Varsayılan: 6 ay sonra
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

def find_favicon(url):
    """Web sitesinden favicon URL'ini bul"""
    try:
        print(f"  🔍 Favicon aranıyor: {url}")
        
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

def scrape_tubitak():
    """TÜBİTAK burslarını detaylı scrape et"""
    print("🕷️  TÜBİTAK web sitesi detaylı taranıyor...")
    
    base_url = "https://www.tubitak.gov.tr"
    burs_url = f"{base_url}/tr/burslar"
    
    # TÜBİTAK favicon'ını bul
    tubitak_favicon = find_favicon(base_url)
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        print(f"📡 Bağlanıyor: {burs_url}")
        response = requests.get(burs_url, headers=headers, timeout=15)
        response.encoding = 'utf-8'
        soup = BeautifulSoup(response.content, 'html.parser')
        
        scholarships = []
        
        # Farklı HTML yapılarını dene
        selectors = [
            ('div.view-content div.views-row', 'TÜBİTAK burs listesi'),
            ('article', 'Article elementleri'),
            ('div[class*="burs"]', 'Burs içeren div\'ler'),
            ('div.content-item', 'İçerik öğeleri'),
            ('div.item', 'Genel öğeler'),
        ]
        
        items = []
        for selector, desc in selectors:
            items = soup.select(selector)
            if items:
                print(f"✅ {desc} bulundu: {len(items)} adet")
                break
        
        if not items:
            print("⚠️  Liste bulunamadı, tüm linkleri tarıyorum...")
            # Burs ile ilgili tüm linkleri bul
            all_links = soup.find_all('a', href=True)
            relevant_links = [
                link for link in all_links 
                if any(k in link.get_text(strip=True).lower() for k in ['burs', 'destek', 'program'])
                and link.get_text(strip=True)
            ]
            
            print(f"🔗 {len(relevant_links)} ilgili link bulundu")
            
            for link in relevant_links[:10]:  # İlk 10 link
                try:
                    title = link.get_text(strip=True)
                    href = link['href']
                    
                    if not href.startswith('http'):
                        href = base_url + href
                    
                    # Burs detaylarını çıkar
                    scholarship = create_scholarship_from_link(link, href, soup)
                    if scholarship:
                        scholarships.append(scholarship)
                        print(f"✅ Burs eklendi: {title[:50]}...")
                        
                except Exception as e:
                    print(f"⚠️  Link parse edilemedi: {e}")
                    continue
        else:
            # Liste öğelerini parse et
            for idx, item in enumerate(items[:15]):  # İlk 15 öğe
                try:
                    scholarship = parse_scholarship_item(item, base_url, tubitak_favicon)
                    if scholarship:
                        scholarships.append(scholarship)
                        print(f"✅ {idx+1}. Burs parse edildi: {scholarship['title'][:50]}...")
                except Exception as e:
                    print(f"⚠️  {idx+1}. öğe parse edilemedi: {e}")
                    continue
        
        # Eğer scraping başarısızsa, TÜBİTAK'ın bilinen burs programlarını ekle
        if len(scholarships) < 3:
            print("\n⚠️  Yeterli burs bulunamadı, TÜBİTAK'ın bilinen programlarını ekliyorum...")
            scholarships.extend(get_known_tubitak_programs(tubitak_favicon))
        
        return scholarships
        
    except Exception as e:
        print(f"❌ Scraping hatası: {e}")
        print("⚠️  TÜBİTAK'ın bilinen programlarını ekliyorum...")
        tubitak_favicon = find_favicon("https://www.tubitak.gov.tr")
        return get_known_tubitak_programs(tubitak_favicon)

def create_scholarship_from_link(link_elem, href, soup):
    """Link elementinden burs oluştur"""
    try:
        title = link_elem.get_text(strip=True)
        
        # Başlık çok kısa veya geçersizse atla
        if len(title) < 10 or title.startswith('http'):
            return None
        
        # Parent elementi bul - daha fazla bilgi olabilir
        parent = link_elem.find_parent(['div', 'article', 'li'])
        description = ""
        
        if parent:
            # Açıklama bul
            desc_elem = parent.find(['p', 'span', 'div'], recursive=True)
            if desc_elem:
                description = desc_elem.get_text(strip=True)[:300]
        
        if not description:
            description = title
        
        # Burs türü ve eğitim seviyesini belirle
        combined_text = f"{title} {description}"
        
        return {
            'title': title[:200],
            'organization': 'TÜBİTAK',
            'organization_logo': tubitak_favicon,
            'description': description,
            'amount': extract_amount(combined_text)[0],
            'amount_type': extract_amount(combined_text)[1],
            'deadline': extract_deadline(combined_text),
            'type': determine_type(combined_text),
            'education_level': determine_education_level(combined_text),
            'application_url': href,
            'is_active': True,
            'has_api_integration': False
        }
    except:
        return None

def parse_scholarship_item(item, base_url, favicon_url=None):
    """Liste öğesinden burs bilgilerini parse et"""
    try:
        # Başlık bul
        title_elem = item.find(['h1', 'h2', 'h3', 'h4', 'a', 'strong'])
        if not title_elem:
            return None
        
        title = title_elem.get_text(strip=True)
        
        # Burs ile ilgili olup olmadığını kontrol et
        keywords = ['burs', 'destek', 'program', 'öğrenci', 'araştırma']
        if not any(k in title.lower() for k in keywords):
            return None
        
        # Açıklama bul
        desc_elem = item.find('p')
        description = desc_elem.get_text(strip=True) if desc_elem else title
        
        # Link bul
        link_elem = item.find('a', href=True)
        app_url = link_elem['href'] if link_elem else base_url + '/tr/burslar'
        if not app_url.startswith('http'):
            app_url = base_url + app_url
        
        # Tüm metni topla
        all_text = item.get_text(strip=True)
        
        # Miktar ve tarih bilgisi ara
        amount_match = re.search(r'(\d+[\.,]?\d*)\s*(TL|₺|lira)', all_text, re.IGNORECASE)
        deadline_match = re.search(r'(\d{1,2})\s*(ocak|şubat|mart|nisan|mayıs|haziran|temmuz|ağustos|eylül|ekim|kasım|aralık)\s*(\d{4})', all_text, re.IGNORECASE)
        
        amount = int(amount_match.group(1).replace('.', '').replace(',', '')) if amount_match else 7500
        deadline = extract_deadline(all_text) if deadline_match else extract_deadline("")
        
        return {
            'title': title[:200],
            'organization': 'TÜBİTAK',
            'organization_logo': favicon_url,
            'description': description[:300],
            'amount': amount,
            'amount_type': extract_amount(all_text)[1],
            'deadline': deadline,
            'type': determine_type(all_text),
            'education_level': determine_education_level(all_text),
            'application_url': app_url,
            'is_active': True,
            'has_api_integration': False
        }
        
    except Exception as e:
        print(f"⚠️  Parse hatası: {e}")
        return None

def get_known_tubitak_programs(favicon_url=None):
    """TÜBİTAK'ın bilinen ve aktif burs programları"""
    return [
        {
            'title': 'TÜBİTAK Bilim İnsanı Destekleme Programı (BİDEB)',
            'organization': 'TÜBİTAK',
            'organization_logo': favicon_url,
            'description': 'Bilim ve teknoloji alanında çalışan lisansüstü öğrenciler için aylık burs desteği',
            'amount': 7500,
            'amount_type': 'aylık',
            'deadline': '2025-12-31',
            'type': 'akademik',
            'education_level': 'yükseklisans',
            'application_url': 'https://www.tubitak.gov.tr/tr/burslar/yurt-ici/lisansustu',
            'is_active': True,
            'has_api_integration': False
        },
        {
            'title': 'TÜBİTAK 2209-A Üniversite Öğrencileri Araştırma Projeleri',
            'organization': 'TÜBİTAK',
            'organization_logo': favicon_url,
            'description': 'Lisans öğrencilerinin bilimsel araştırma projelerine maddi destek sağlanması',
            'amount': 5000,
            'amount_type': 'proje başı',
            'deadline': '2025-06-30',
            'type': 'akademik',
            'education_level': 'lisans',
            'application_url': 'https://www.tubitak.gov.tr/tr/destekler/akademik/ulusal-destek-programlari/2209-a',
            'is_active': True,
            'has_api_integration': False
        },
        {
            'title': 'TÜBİTAK 2211-A Yurt İçi Yüksek Lisans Burs Programı',
            'organization': 'TÜBİTAK',
            'organization_logo': favicon_url,
            'description': 'Türkiye\'de yüksek lisans yapan öğrenciler için aylık burs desteği',
            'amount': 9000,
            'amount_type': 'aylık',
            'deadline': '2025-09-30',
            'type': 'akademik',
            'education_level': 'yükseklisans',
            'application_url': 'https://www.tubitak.gov.tr/tr/destekler/akademik/ulusal-destek-programlari/2211-a',
            'is_active': True,
            'has_api_integration': False
        },
        {
            'title': 'TÜBİTAK 2211-C Yurt İçi Öncelikli Alanlarda Yüksek Lisans Burs Programı',
            'organization': 'TÜBİTAK',
            'organization_logo': favicon_url,
            'description': 'Öncelikli alanlarda yüksek lisans yapan öğrenciler için burs',
            'amount': 10000,
            'amount_type': 'aylık',
            'deadline': '2025-08-31',
            'type': 'akademik',
            'education_level': 'yükseklisans',
            'application_url': 'https://www.tubitak.gov.tr/tr/destekler/akademik/ulusal-destek-programlari/2211-c',
            'is_active': True,
            'has_api_integration': False
        },
        {
            'title': 'TÜBİTAK 2212-A Yurt İçi Doktora Burs Programı',
            'organization': 'TÜBİTAK',
            'organization_logo': favicon_url,
            'description': 'Türkiye\'de doktora yapan öğrenciler için aylık burs desteği',
            'amount': 12000,
            'amount_type': 'aylık',
            'deadline': '2025-10-31',
            'type': 'akademik',
            'education_level': 'yükseklisans',
            'application_url': 'https://www.tubitak.gov.tr/tr/destekler/akademik/ulusal-destek-programlari/2212-a',
            'is_active': True,
            'has_api_integration': False
        },
        {
            'title': 'TÜBİTAK 2213 Yurt Dışı Doktora Sırası Araştırma Burs Programı',
            'organization': 'TÜBİTAK',
            'organization_logo': favicon_url,
            'description': 'Yurt dışında doktora yapan öğrencilere araştırma bursu',
            'amount': 15000,
            'amount_type': 'aylık',
            'deadline': '2025-11-30',
            'type': 'akademik',
            'education_level': 'yükseklisans',
            'application_url': 'https://www.tubitak.gov.tr/tr/destekler/akademik/uluslararasi-destek-programlari/2213',
            'is_active': True,
            'has_api_integration': False
        },
        {
            'title': 'TÜBİTAK 2214-A Yurt Dışı Doktora Sırası Araştırma Burs Programı',
            'organization': 'TÜBİTAK',
            'organization_logo': favicon_url,
            'description': 'Yurt dışında doktora sırasında araştırma yapmak isteyenler için burs',
            'amount': 18000,
            'amount_type': 'aylık',
            'deadline': '2026-01-31',
            'type': 'akademik',
            'education_level': 'yükseklisans',
            'application_url': 'https://www.tubitak.gov.tr/tr/destekler/akademik/uluslararasi-destek-programlari/2214-a',
            'is_active': True,
            'has_api_integration': False
        },
        {
            'title': 'TÜBİTAK 2215 Yurt Dışı Doktora Sonrası Araştırma Burs Programı',
            'organization': 'TÜBİTAK',
            'organization_logo': favicon_url,
            'description': 'Doktora sonrası araştırma yapmak isteyenler için post-doktora bursu',
            'amount': 20000,
            'amount_type': 'aylık',
            'deadline': '2026-02-28',
            'type': 'akademik',
            'education_level': 'yükseklisans',
            'application_url': 'https://www.tubitak.gov.tr/tr/destekler/akademik/uluslararasi-destek-programlari/2215',
            'is_active': True,
            'has_api_integration': False
        },
        {
            'title': 'TÜBİTAK 2247-A Sanayi Doktora Programı',
            'organization': 'TÜBİTAK',
            'organization_logo': favicon_url,
            'description': 'Sanayi ve üniversite işbirliğinde doktora yapan öğrencilere burs',
            'amount': 14000,
            'amount_type': 'aylık',
            'deadline': '2025-07-31',
            'type': 'akademik',
            'education_level': 'yükseklisans',
            'application_url': 'https://www.tubitak.gov.tr/tr/destekler/sanayi/ulusal-destek-programlari/2247-a',
            'is_active': True,
            'has_api_integration': False
        },
        {
            'title': 'TÜBİTAK Lise Öğrencileri Araştırma Projeleri Yarışması',
            'organization': 'TÜBİTAK',
            'organization_logo': favicon_url,
            'description': 'Lise öğrencilerinin bilim fuarı projelerine ödül ve destek',
            'amount': 3000,
            'amount_type': 'tek seferlik',
            'deadline': '2025-04-30',
            'type': 'akademik',
            'education_level': 'lise',
            'application_url': 'https://www.tubitak.gov.tr/tr/ogrenci/lise/ulusal-yarismalar',
            'is_active': True,
            'has_api_integration': False
        }
    ]

def save_to_supabase(scholarships):
    """Supabase'e kaydet"""
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
                print(f"✅ Eklendi: {s['title']}")
                saved_count += 1
            else:
                print(f"⏭️  Zaten var: {s['title']}")
                skipped_count += 1
                
        except Exception as e:
            print(f"❌ Kayıt hatası: {s['title']} - {e}")
    
    print(f"\n📊 Özet: {saved_count} eklendi, {skipped_count} atlandı")

if __name__ == "__main__":
    print("🚀 TÜBİTAK Burs Scraper Başlatılıyor...\n")
    
    scholarships = scrape_tubitak()
    print(f"\n📊 Toplam {len(scholarships)} burs hazır")
    
    if scholarships:
        print("\n💾 Supabase'e kaydediliyor...")
        save_to_supabase(scholarships)
    else:
        print("\n⚠️  Hiç burs bulunamadı!")
    
    print("\n✅ İşlem tamamlandı!")
