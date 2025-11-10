"""
AŞAMA 1: BURS VEREN KURUMLARI KEŞFEDİCİ
Bu script Türkiye'deki burs veren kurumları bulur ve listeler
"""

import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv
import re
import json
from datetime import datetime

load_dotenv('.env.local')

# Supabase connection
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

# Bilinen kurum listesi (manuel başlangıç)
KNOWN_ORGANIZATIONS = [
    {
        'name': 'TÜBİTAK',
        'website': 'https://www.tubitak.gov.tr/tr/burslar',
        'category': 'kamu',
        'description': 'Türkiye Bilimsel ve Teknolojik Araştırma Kurumu'
    },
    {
        'name': 'Türk Eğitim Vakfı',
        'website': 'https://www.tev.org.tr',
        'category': 'vakıf',
        'description': 'Eğitim alanında çalışan köklü vakıf'
    },
    {
        'name': 'Vehbi Koç Vakfı',
        'website': 'https://www.vkv.org.tr',
        'category': 'vakıf',
        'description': 'Eğitim, sağlık ve kültür alanlarında destek veren vakıf'
    },
    {
        'name': 'Sabancı Vakfı',
        'website': 'https://www.sabancivakfi.org',
        'category': 'vakıf',
        'description': 'Eğitim ve sosyal gelişim programları sunan vakıf'
    }
]

def scrape_isinolsun():
    """isinolsun.com'dan burs veren kurumları scrape et"""
    print("\n📡 isinolsun.com taranıyor...")
    
    url = "https://isinolsun.com/blog/2024te-universite-ogrencilerine-burs-veren-kurumlar/"
    organizations = []
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Kurumları bul - makale içeriğinde başlıklar ve linkler olabilir
        content = soup.find(['article', 'div'], class_=re.compile('content|post|article'))
        
        if content:
            # Başlıkları ve linkleri tara
            headings = content.find_all(['h2', 'h3', 'strong', 'b'])
            links = content.find_all('a', href=True)
            
            for heading in headings:
                text = heading.get_text(strip=True)
                # Vakıf, dernek, kurum isimleri filtrele
                keywords = ['vakf', 'dernek', 'kurum', 'üniversite', 'belediye', 'burs']
                if any(k in text.lower() for k in keywords) and len(text) > 5:
                    # Yakındaki link'i bul
                    next_link = heading.find_next('a', href=True)
                    website = next_link['href'] if next_link and next_link['href'].startswith('http') else None
                    
                    organizations.append({
                        'name': text[:100],
                        'website': website,
                        'category': 'vakıf' if 'vakf' in text.lower() else 'diğer',
                        'description': f'{text} - isinolsun.com listesinden',
                        'source': 'isinolsun.com'
                    })
        
        print(f"✅ {len(organizations)} kurum bulundu")
        return organizations
        
    except Exception as e:
        print(f"⚠️  Hata: {e}")
        return []

def scrape_microfon():
    """microfon.co'dan burs veren kurumları scrape et"""
    print("\n📡 microfon.co taranıyor...")
    
    url = "https://microfon.co/scholarship"
    organizations = set()
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Burs kartlarındaki kurum isimlerini bul
        # Farklı selector'ları dene
        selectors = [
            '.scholarship-card',
            'div[class*="card"]',
            'article',
            'div[class*="burs"]'
        ]
        
        for selector in selectors:
            items = soup.select(selector)
            if items:
                print(f"✅ {len(items)} burs kartı bulundu")
                for item in items[:20]:  # İlk 20 kart
                    # Kurum ismini bul
                    org_elem = item.find(['h3', 'h4', 'strong', 'span'], class_=re.compile('org|kurum|institution'))
                    if not org_elem:
                        # Tüm text'i tara
                        text = item.get_text()
                        # "Vakfı", "Derneği" ile biten satırları bul
                        matches = re.findall(r'([A-ZÇĞİÖŞÜ][a-zçğıöşü\s]+(?:Vakfı|Derneği|Kurumu|Üniversitesi|Belediyesi))', text)
                        for match in matches:
                            organizations.add(match.strip())
                    else:
                        organizations.add(org_elem.get_text(strip=True))
                break
        
        org_list = [{'name': org, 'source': 'microfon.co'} for org in organizations if len(org) > 3]
        print(f"✅ {len(org_list)} benzersiz kurum bulundu")
        return org_list
        
    except Exception as e:
        print(f"⚠️  Hata: {e}")
        return []

def google_search_organizations():
    """Google araması simülasyonu - bilinen kurumlar"""
    print("\n📡 Google araması simülasyonu...")
    
    # Gerçek Google API kullanmak yerine bilinen kurumları ekle
    additional_orgs = [
        {
            'name': 'İstanbul Büyükşehir Belediyesi',
            'website': 'https://www.ibb.istanbul',
            'category': 'belediye',
            'description': 'İBB eğitim bursları'
        },
        {
            'name': 'Türkiye Scholarships',
            'website': 'https://www.turkiyeburslari.gov.tr',
            'category': 'kamu',
            'description': 'Türkiye Bursları - Yurt dışı öğrenciler için'
        },
        {
            'name': 'TÜSEB',
            'website': 'https://www.tuseb.gov.tr',
            'category': 'kamu',
            'description': 'Türkiye Su Enstitüsü eğitim bursları'
        },
        {
            'name': 'Darüşşafaka Cemiyeti',
            'website': 'https://www.darussafaka.org',
            'category': 'vakıf',
            'description': 'Tam burs ve barınma imkanı'
        },
        {
            'name': 'TOBB',
            'website': 'https://www.tobb.org.tr',
            'category': 'özel',
            'description': 'TOBB Üniversitesi bursları'
        }
    ]
    
    print(f"✅ {len(additional_orgs)} ek kurum eklendi")
    return additional_orgs

def merge_and_deduplicate(org_lists):
    """Tüm listeleri birleştir ve duplikaları temizle"""
    print("\n🔄 Kurumlar birleştiriliyor...")
    
    all_orgs = {}
    
    for org_list in org_lists:
        for org in org_list:
            name = org.get('name', '').strip()
            if not name or len(name) < 3:
                continue
            
            # Normalize et (küçük harf, ekstra boşluklar)
            normalized = re.sub(r'\s+', ' ', name.lower())
            
            if normalized not in all_orgs:
                all_orgs[normalized] = {
                    'name': name,
                    'website': org.get('website'),
                    'category': org.get('category', 'diğer'),
                    'description': org.get('description', ''),
                    'sources': [org.get('source', 'manual')]
                }
            else:
                # Mevcut kaydı güncelle
                if org.get('website') and not all_orgs[normalized]['website']:
                    all_orgs[normalized]['website'] = org.get('website')
                if org.get('source'):
                    all_orgs[normalized]['sources'].append(org.get('source'))
    
    return list(all_orgs.values())

def save_organizations_to_db(organizations):
    """Kurumları organizations tablosuna kaydet"""
    print("\n💾 Kurumlar database'e kaydediliyor...")
    
    saved_count = 0
    skipped_count = 0
    
    for org in organizations:
        try:
            # Duplicate kontrolü
            existing = supabase.table('organizations')\
                .select('id')\
                .eq('name', org['name'])\
                .execute()
            
            if not existing.data:
                data_to_insert = {
                    'name': org['name'],
                    'website': org['website'],
                    'category': org['category'],
                    'description': org['description'],
                    'is_active': True,
                    'last_scraped': None,
                    'created_at': datetime.now().isoformat()
                }
                
                supabase.table('organizations').insert(data_to_insert).execute()
                print(f"✅ Eklendi: {org['name']}")
                saved_count += 1
            else:
                print(f"⏭️  Zaten var: {org['name']}")
                skipped_count += 1
                
        except Exception as e:
            print(f"❌ Kayıt hatası ({org['name']}): {e}")
    
    print(f"\n📊 Özet: {saved_count} eklendi, {skipped_count} atlandı")
    return saved_count

def save_to_json(organizations, filename='organizations.json'):
    """Kurumları JSON dosyasına kaydet"""
    with open(f'scripts/{filename}', 'w', encoding='utf-8') as f:
        json.dump(organizations, f, ensure_ascii=False, indent=2)
    print(f"💾 {len(organizations)} kurum {filename} dosyasına kaydedildi")

if __name__ == "__main__":
    print("🚀 KURUM KEŞİF SCRAPER BAŞLATILIYOR\n")
    print("="*60)
    
    # 1. Bilinen kurumlarla başla
    print("\n📋 Bilinen kurumlar yükleniyor...")
    all_organizations = [KNOWN_ORGANIZATIONS]
    
    # 2. isinolsun.com'u tara
    isinolsun_orgs = scrape_isinolsun()
    if isinolsun_orgs:
        all_organizations.append(isinolsun_orgs)
    
    # 3. microfon.co'yu tara
    microfon_orgs = scrape_microfon()
    if microfon_orgs:
        all_organizations.append(microfon_orgs)
    
    # 4. Google araması (bilinen ek kurumlar)
    google_orgs = google_search_organizations()
    if google_orgs:
        all_organizations.append(google_orgs)
    
    # 5. Birleştir ve temizle
    final_organizations = merge_and_deduplicate(all_organizations)
    
    print("\n"+"="*60)
    print(f"📊 TOPLAM {len(final_organizations)} BENZERSIZ KURUM BULUNDU")
    print("="*60)
    
    # 6. JSON'a kaydet
    save_to_json(final_organizations)
    
    # 7. Supabase'e kaydet
    print("\nℹ️  Supabase'e kaydetmek için 'organizations' tablosu oluşturulmalı.")
    print("SQL:")
    print("""
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    website TEXT,
    category TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_scraped TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
    """)
    
    # Kullanıcı onayı (yorumdan çıkar)
    # if input("\n💾 Supabase'e kaydetmek istiyor musunuz? (y/n): ").lower() == 'y':
    #     save_organizations_to_db(final_organizations)
    
    print("\n✅ KURUM KEŞFİ TAMAMLANDI!")
    print(f"📁 Sonuçlar: scripts/organizations.json")

