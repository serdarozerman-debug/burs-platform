import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv
import re

load_dotenv('.env.local')

# Supabase connection
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

def scrape_tev():
    """TEV burslarını scrape et"""
    print("🕷️  TEV web sitesi taranıyor...")
    
    # Örnek - gerçek URL'i değiştireceğiz
    url = "https://www.tev.org.tr/burslar"
    
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        scholarships = []
        
        # Örnek parsing - gerçek site yapısına göre değişecek
        items = soup.find_all('div', class_='burs-item')
        
        for item in items:
            try:
                scholarship = {
                    'title': item.find('h3').text.strip(),
                    'organization': 'Türk Eğitim Vakfı',
                    'description': item.find('p').text.strip(),
                    'amount': 15000,  # Placeholder
                    'amount_type': 'yıllık',
                    'deadline': '2025-12-31',  # Placeholder
                    'type': 'akademik',
                    'education_level': 'lisans',
                    'application_url': 'https://www.tev.org.tr',
                    'is_active': True
                }
                scholarships.append(scholarship)
            except Exception as e:
                print(f"⚠️  Burs parse edilemedi: {e}")
                continue
        
        return scholarships
        
    except Exception as e:
        print(f"❌ Hata: {e}")
        return []

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
            print(f"❌ Kayıt hatası: {e}")
    
    print(f"\n📊 Özet: {saved_count} eklendi, {skipped_count} atlandı")

if __name__ == "__main__":
    print("🚀 Burs Scraper Başlatılıyor...\n")
    
    scholarships = scrape_tev()
    print(f"\n📊 {len(scholarships)} burs bulundu")
    
    if scholarships:
        save_to_supabase(scholarships)
    
    print("\n✅ islem tamamlandi!")
