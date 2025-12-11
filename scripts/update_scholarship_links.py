"""
Mevcut bursların başvuru linklerini güncellemek için script
TÜBİTAK bursları için doğru detay sayfası linklerini oluşturur
"""

import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv
import re
from urllib.parse import urljoin

load_dotenv('.env.local')

# Supabase connection
# Service role key kullan (RLS bypass için)
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
anon_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
key = service_key if service_key else anon_key

if not key:
    raise Exception("❌ Supabase key bulunamadı!")

supabase: Client = create_client(url, key)

base_url = "https://www.tubitak.gov.tr"

def create_slug(title):
    """Başlıktan slug oluştur"""
    slug = title.lower()
    slug = slug.replace('ı', 'i').replace('ğ', 'g').replace('ü', 'u').replace('ş', 's').replace('ö', 'o').replace('ç', 'c')
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    slug = slug[:100]
    return slug

def get_correct_url(title, current_url):
    """Burs başlığından doğru TÜBİTAK URL'ini oluştur"""
    # Program kodlarını bul (örn: 2209-A, 2211-C)
    program_code_match = re.search(r'(\d{4}[-]?[A-Z]?)', title)
    
    if program_code_match:
        code = program_code_match.group(1).lower().replace('-', '-')
        
        # Özel durumlar
        if '2209-a' in code or '2209-A' in title:
            return f"{base_url}/tr/destekler/akademik/ulusal-destek-programlari/2209-a"
        elif '2209-b' in code or '2209-B' in title:
            return f"{base_url}/tr/destekler/akademik/ulusal-destek-programlari/2209-b"
        elif '2210' in code or '2210' in title:
            return f"{base_url}/tr/destekler/akademik/ulusal-destek-programlari/2210-a"
        elif '2211-a' in code or '2211-A' in title:
            return f"{base_url}/tr/destekler/akademik/ulusal-destek-programlari/2211-a"
        elif '2211-c' in code or '2211-C' in title:
            return f"{base_url}/tr/destekler/akademik/ulusal-destek-programlari/2211-c"
        elif '2212-a' in code or '2212-A' in title:
            return f"{base_url}/tr/destekler/akademik/ulusal-destek-programlari/2212-a"
        elif '2213-a' in code or ('2213-A' in title and 'Müşterek' not in title):
            return f"{base_url}/tr/destekler/akademik/uluslararasi-destek-programlari/2213-a"
        elif '2213-b' in code or ('2213-B' in title or 'Müşterek' in title):
            return f"{base_url}/tr/destekler/akademik/uluslararasi-destek-programlari/2213-b"
        elif '2214-a' in code or '2214-A' in title:
            return f"{base_url}/tr/destekler/akademik/uluslararasi-destek-programlari/2214-a"
        elif '2215' in code or '2215' in title:
            return f"{base_url}/tr/destekler/akademik/uluslararasi-destek-programlari/2215"
        elif '2244' in code or '2244' in title:
            return f"{base_url}/tr/destekler/sanayi/ulusal-destek-programlari/2244"
        elif '2247' in code or '2247' in title:
            if 'STAR' in title or 'Stajyer' in title:
                return f"{base_url}/tr/destekler/sanayi/ulusal-destek-programlari/2247-c"
            else:
                return f"{base_url}/tr/destekler/sanayi/ulusal-destek-programlari/2247-a"
        elif '2248' in code or '2248' in title:
            return f"{base_url}/tr/destekler/akademik/ulusal-destek-programlari/2248"
        elif '2250' in code or '2250' in title:
            return f"{base_url}/tr/destekler/akademik/ulusal-destek-programlari/2250"
        elif '2205' in code or '2205' in title:
            return f"{base_url}/tr/destekler/akademik/ulusal-destek-programlari/2205"
        else:
            # Genel format
            return f"{base_url}/tr/destekler/akademik/ulusal-destek-programlari/{code}"
    
    # Özel durumlar
    if 'BİDEB' in title or 'Bilim İnsanı Destekleme' in title:
        return f"{base_url}/tr/burslar/yurt-ici/lisansustu"
    elif 'Fuat SEZGİN' in title or 'Fuat Sezgin' in title:
        return f"{base_url}/tr/burslar/yurt-ici/lisansustu"
    elif 'BİÇABA' in title:
        return f"{base_url}/tr/destekler/akademik/ulusal-destek-programlari/bicaba"
    
    # Ana sayfa linklerini kontrol et
    if current_url in ['/', '/tr', '/tr/burslar', base_url, f"{base_url}/", f"{base_url}/tr"]:
        return f"{base_url}/tr/burslar"
    
    return current_url

def update_scholarship_links():
    """TÜBİTAK burslarının linklerini güncelle"""
    print("🔄 TÜBİTAK burslarının linklerini güncelleniyor...\n")
    
    try:
        # TÜBİTAK organizasyonunu bul
        org_result = supabase.table('organizations')\
            .select('id')\
            .ilike('name', 'TÜBİTAK')\
            .execute()
        
        if not org_result.data:
            print("❌ TÜBİTAK organizasyonu bulunamadı!")
            return
        
        org_id = org_result.data[0]['id']
        print(f"✅ TÜBİTAK organizasyonu bulundu: {org_id[:8]}...\n")
        
        # TÜBİTAK burslarını al
        scholarships_result = supabase.table('scholarships')\
            .select('id, title, application_url')\
            .eq('organization_id', org_id)\
            .execute()
        
        if not scholarships_result.data:
            print("❌ TÜBİTAK bursu bulunamadı!")
            return
        
        print(f"📋 Toplam {len(scholarships_result.data)} burs bulundu\n")
        
        updated_count = 0
        skipped_count = 0
        
        for scholarship in scholarships_result.data:
            title = scholarship['title']
            current_url = scholarship['application_url']
            new_url = get_correct_url(title, current_url)
            
            # URL değişti mi kontrol et
            if new_url != current_url:
                try:
                    supabase.table('scholarships')\
                        .update({'application_url': new_url})\
                        .eq('id', scholarship['id'])\
                        .execute()
                    
                    print(f"✅ Güncellendi: {title[:60]}")
                    print(f"   Eski: {current_url[:80]}")
                    print(f"   Yeni: {new_url[:80]}\n")
                    updated_count += 1
                except Exception as e:
                    print(f"❌ Hata ({title[:50]}): {e}\n")
            else:
                print(f"⏭️  Zaten doğru: {title[:60]}\n")
                skipped_count += 1
        
        print(f"\n📊 Özet: {updated_count} güncellendi, {skipped_count} zaten doğru")
        
    except Exception as e:
        print(f"❌ Hata: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    update_scholarship_links()

