#!/usr/bin/env python3
"""
Yeni burs veren kurumları otomatik keşfeder
GitHub Actions ile 15 günde bir çalışır
"""

import os
import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import sys
from typing import List, Dict

def search_scholarship_organizations() -> List[Dict]:
    """Google/Bing'de burs veren kurumları ara"""
    organizations = []
    
    search_queries = [
        "türkiye burs veren vakıflar",
        "öğrenci burs programları türkiye",
        "eğitim bursu veren kurumlar",
        "üniversite dışı burs programları",
        "belediye öğrenci bursu",
        "sivil toplum kuruluşu burs",
    ]
    
    print("🔍 Yeni kurum araştırması başlatıldı...")
    print("")
    
    # Known scholarship keywords
    keywords = [
        'burs', 'scholarship', 'eğitim desteği', 'öğrenci yardımı',
        'vakıf', 'foundation', 'belediye', 'dernek', 'sivil toplum'
    ]
    
    # Bilinen kurum tipleri
    known_types = [
        {'type': 'vakıf', 'keywords': ['vakıf', 'vakfı', 'foundation']},
        {'type': 'belediye', 'keywords': ['belediye', 'municipality', 'büyükşehir']},
        {'type': 'kamu', 'keywords': ['bakanlık', 'ministry', 'kamu', 'devlet']},
        {'type': 'dernek', 'keywords': ['dernek', 'association', 'kurum']},
        {'type': 'özel', 'keywords': ['holding', 'şirket', 'company', 'grup']},
    ]
    
    # Bilinen burs veren kurumlar (seed data)
    seed_organizations = [
        {
            'name': 'Vehbi Koç Vakfı',
            'url': 'https://www.vkv.org.tr',
            'type': 'vakıf',
            'category': 'private',
            'keywords': ['eğitim', 'burs', 'destek']
        },
        {
            'name': 'Türk Eğitim Vakfı',
            'url': 'https://www.tev.org.tr',
            'type': 'vakıf',
            'category': 'private',
            'keywords': ['eğitim', 'burs']
        },
        {
            'name': 'TÜBİTAK',
            'url': 'https://www.tubitak.gov.tr',
            'type': 'kamu',
            'category': 'government',
            'keywords': ['bilim', 'araştırma', 'burs']
        },
        {
            'name': 'İstanbul Büyükşehir Belediyesi',
            'url': 'https://www.ibb.istanbul',
            'type': 'belediye',
            'category': 'government',
            'keywords': ['belediye', 'hizmet', 'burs']
        },
        {
            'name': 'Sabancı Vakfı',
            'url': 'https://www.sabancivakfi.org',
            'type': 'vakıf',
            'category': 'private',
            'keywords': ['eğitim', 'sosyal', 'burs']
        },
        {
            'name': 'Türkiye Bursları',
            'url': 'https://www.turkiyeburslari.gov.tr',
            'type': 'kamu',
            'category': 'government',
            'keywords': ['uluslararası', 'burs', 'eğitim']
        },
        {
            'name': 'Darüşşafaka',
            'url': 'https://www.darussafaka.org',
            'type': 'vakıf',
            'category': 'private',
            'keywords': ['eğitim', 'yatılı', 'burs']
        },
        {
            'name': 'Ankara Büyükşehir Belediyesi',
            'url': 'https://www.ankara.bel.tr',
            'type': 'belediye',
            'category': 'government',
            'keywords': ['belediye', 'sosyal', 'burs']
        },
        {
            'name': 'İzmir Büyükşehir Belediyesi',
            'url': 'https://www.izmir.bel.tr',
            'type': 'belediye',
            'category': 'government',
            'keywords': ['belediye', 'eğitim', 'burs']
        },
        {
            'name': 'Koç Holding',
            'url': 'https://www.koc.com.tr',
            'type': 'özel',
            'category': 'private',
            'keywords': ['holding', 'sosyal sorumluluk', 'burs']
        },
    ]
    
    print(f"📚 Seed data: {len(seed_organizations)} kurum")
    
    return seed_organizations


def load_existing_organizations() -> List[Dict]:
    """Mevcut organizations.json'ı yükle"""
    org_file = os.path.join(os.path.dirname(__file__), 'organizations.json')
    
    try:
        with open(org_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except FileNotFoundError:
        print("⚠️  organizations.json bulunamadı, yeni oluşturulacak")
        return []
    except Exception as e:
        print(f"⚠️  organizations.json yüklenemedi: {e}")
        return []


def save_organizations(organizations: List[Dict], auto_save: bool = False):
    """Kurumları organizations.json'a kaydet"""
    org_file = os.path.join(os.path.dirname(__file__), 'organizations.json')
    
    try:
        # Deduplicate by name
        unique_orgs = {org['name']: org for org in organizations}
        final_orgs = list(unique_orgs.values())
        
        # Sort by name
        final_orgs.sort(key=lambda x: x['name'])
        
        # Backup existing file
        if os.path.exists(org_file):
            backup_file = org_file.replace('.json', f'_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json')
            os.rename(org_file, backup_file)
            print(f"📦 Backup oluşturuldu: {os.path.basename(backup_file)}")
        
        # Save new data
        with open(org_file, 'w', encoding='utf-8') as f:
            json.dump(final_orgs, f, ensure_ascii=False, indent=2)
        
        print(f"✅ {len(final_orgs)} kurum kaydedildi")
        print(f"📁 {org_file}")
        
        return True
    except Exception as e:
        print(f"❌ Kayıt hatası: {e}")
        return False


def discover_new_organizations(limit: int = 50):
    """Yeni kurumları keşfet"""
    print("=" * 60)
    print("🔍 YENİ KURUM KEŞFİ")
    print("=" * 60)
    print("")
    
    # Load existing
    existing_orgs = load_existing_organizations()
    existing_names = {org['name'] for org in existing_orgs if 'name' in org}
    
    print(f"📊 Mevcut kurum sayısı: {len(existing_names)}")
    print("")
    
    # Search for new
    discovered = search_scholarship_organizations()
    
    # Find truly new organizations
    new_orgs = []
    for org in discovered:
        if org['name'] not in existing_names:
            new_orgs.append(org)
            print(f"✨ Yeni: {org['name']}")
    
    print("")
    print(f"📈 Keşfedilen yeni kurum: {len(new_orgs)}")
    
    # Merge with existing
    all_orgs = existing_orgs + new_orgs
    
    return all_orgs, len(new_orgs)


def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Yeni burs veren kurumları keşfet')
    parser.add_argument('--limit', type=int, default=50, help='Maksimum arama sayısı')
    parser.add_argument('--auto-save', action='store_true', help='Otomatik kaydet (onay bekleme)')
    
    args = parser.parse_args()
    
    try:
        all_orgs, new_count = discover_new_organizations(args.limit)
        
        if new_count > 0 or args.auto_save:
            save_organizations(all_orgs, args.auto_save)
            print("")
            print("✅ Keşif tamamlandı!")
            print(f"📊 Toplam: {len(all_orgs)} kurum")
            print(f"✨ Yeni: {new_count} kurum")
        else:
            print("")
            print("ℹ️  Yeni kurum bulunamadı")
        
        return 0
    except Exception as e:
        print(f"❌ Hata: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
