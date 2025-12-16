"""
Burs verilerini doğrula ve hataları tespit et
- Amount kontrolü (0 olanlar)
- Deep link kontrolü
- Deadline kontrolü
- Eksik alan kontrolü
"""
import os
from dotenv import load_dotenv
from supabase import create_client
from datetime import datetime

load_dotenv('.env.local')

supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(supabase_url, supabase_key)

def validate_scholarships():
    """Tüm bursları doğrula ve sorunları raporla"""
    
    print("✅ BURS DOĞRULAMA SİSTEMİ")
    print("="*60)
    
    # Tüm published bursları getir
    scholarships = supabase.table('scholarships')\
        .select('*, organizations(name, website, logo_url)')\
        .eq('is_published', True)\
        .execute()
    
    if not scholarships.data:
        print("❌ Hiç burs bulunamadı!")
        return
    
    total = len(scholarships.data)
    issues = {
        'no_amount': [],
        'no_deadline': [],
        'no_deep_link': [],
        'no_description': [],
        'org_no_logo': []
    }
    
    print(f"📊 Toplam {total} burs kontrol ediliyor...\n")
    
    for s in scholarships.data:
        # Amount kontrolü
        if not s.get('amount') or s.get('amount') == 0:
            issues['no_amount'].append({
                'id': s['id'],
                'title': s['title'],
                'org': s.get('organizations', {}).get('name') if s.get('organizations') else 'N/A'
            })
        
        # Deadline kontrolü
        if not s.get('deadline'):
            issues['no_deadline'].append({
                'id': s['id'],
                'title': s['title']
            })
        
        # Deep link kontrolü
        if not s.get('application_url'):
            issues['no_deep_link'].append({
                'id': s['id'],
                'title': s['title']
            })
        
        # Description kontrolü
        if not s.get('description') or len(s.get('description', '')) < 50:
            issues['no_description'].append({
                'id': s['id'],
                'title': s['title']
            })
        
        # Organization logo kontrolü
        if s.get('organizations') and not s['organizations'].get('logo_url'):
            issues['org_no_logo'].append({
                'org_name': s['organizations'].get('name'),
                'org_id': s.get('organization_id')
            })
    
    # Rapor yazdır
    print("\n📊 DOĞRULAMA SONUÇLARI")
    print("="*60)
    
    print(f"\n💰 Amount Eksik: {len(issues['no_amount'])}")
    if issues['no_amount'][:5]:  # İlk 5'ini göster
        for item in issues['no_amount'][:5]:
            print(f"  • {item['title']} ({item['org']})")
        if len(issues['no_amount']) > 5:
            print(f"  ... ve {len(issues['no_amount']) - 5} daha")
    
    print(f"\n📅 Deadline Eksik: {len(issues['no_deadline'])}")
    if issues['no_deadline'][:3]:
        for item in issues['no_deadline'][:3]:
            print(f"  • {item['title']}")
    
    print(f"\n🔗 Deep Link Eksik: {len(issues['no_deep_link'])}")
    if issues['no_deep_link'][:3]:
        for item in issues['no_deep_link'][:3]:
            print(f"  • {item['title']}")
    
    print(f"\n📝 Description Eksik/Kısa: {len(issues['no_description'])}")
    if issues['no_description'][:3]:
        for item in issues['no_description'][:3]:
            print(f"  • {item['title']}")
    
    print(f"\n🎨 Logo Eksik Kurumlar: {len(set([x['org_name'] for x in issues['org_no_logo']]))}")
    unique_orgs = list(set([x['org_name'] for x in issues['org_no_logo']]))[:3]
    for org in unique_orgs:
        print(f"  • {org}")
    
    # Başarı oranı
    success_rate = ((total - len(issues['no_amount'])) / total * 100) if total > 0 else 0
    print(f"\n📈 Veri Bütünlüğü: {success_rate:.1f}%")
    
    # Kritik sorunlar varsa exit code 1
    if len(issues['no_amount']) > total * 0.3:  # %30'dan fazla amount eksikse
        print("\n⚠️ UYARI: Çok fazla burs amount bilgisi eksik!")
        return False
    
    print("\n✅ Validasyon tamamlandı!")
    return True

if __name__ == "__main__":
    print("\n" + "="*60)
    print("✅ BURS VALIDASYON SİSTEMİ")
    print("="*60 + "\n")
    
    success = validate_scholarships()
    
    if not success:
        exit(1)

