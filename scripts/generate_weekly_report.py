"""
Haftalık scraping raporu oluştur
- Kaç yeni burs eklendi
- Kaç kurum eklendi
- Başarı oranı
- Hatalar ve uyarılar
"""
import os
from dotenv import load_dotenv
from supabase import create_client
from datetime import datetime, timedelta

load_dotenv('.env.local')

supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(supabase_url, supabase_key)

def generate_weekly_report():
    """Haftalık rapor oluştur"""
    
    print("📊 HAFTALIK RAPOR")
    print("="*60)
    print(f"Tarih: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("="*60)
    
    # Son 7 gün içinde eklenen burslar
    week_ago = (datetime.now() - timedelta(days=7)).isoformat()
    
    new_scholarships = supabase.table('scholarships')\
        .select('id, title, created_at, organizations(name)', count='exact')\
        .gte('created_at', week_ago)\
        .execute()
    
    # Toplam istatistikler
    total_scholarships = supabase.table('scholarships')\
        .select('id', count='exact')\
        .eq('is_published', True)\
        .execute()
    
    total_organizations = supabase.table('organizations')\
        .select('id', count='exact')\
        .execute()
    
    # Amount eksik olanlar
    no_amount = supabase.table('scholarships')\
        .select('id', count='exact')\
        .eq('is_published', True)\
        .eq('amount', 0)\
        .execute()
    
    print(f"\n📈 GENELİSTATİSTİKLER")
    print("-"*60)
    print(f"Toplam Burs: {total_scholarships.count}")
    print(f"Toplam Kurum: {total_organizations.count}")
    print(f"Bu Hafta Eklenen: {new_scholarships.count}")
    print(f"Amount Eksik: {no_amount.count}")
    
    if new_scholarships.data:
        print(f"\n🆕 YENİ EKLENEN BURSLAR ({new_scholarships.count})")
        print("-"*60)
        for s in new_scholarships.data[:10]:  # İlk 10
            org_name = s.get('organizations', {}).get('name', 'N/A') if isinstance(s.get('organizations'), dict) else 'N/A'
            date = datetime.fromisoformat(s['created_at'].replace('Z', '+00:00')).strftime('%Y-%m-%d')
            print(f"• [{date}] {s['title']}")
            print(f"  Kurum: {org_name}")
        
        if new_scholarships.count > 10:
            print(f"... ve {new_scholarships.count - 10} burs daha")
    
    # Başarı oranı
    success_rate = ((total_scholarships.count - no_amount.count) / total_scholarships.count * 100) if total_scholarships.count > 0 else 0
    
    print(f"\n📊 BAŞARI ORANI")
    print("-"*60)
    print(f"Veri Bütünlüğü: {success_rate:.1f}%")
    
    if success_rate >= 90:
        print("✅ Mükemmel!")
    elif success_rate >= 75:
        print("⚠️ İyi, ama iyileştirilebilir")
    else:
        print("❌ Dikkat! Çok fazla eksik veri var")
    
    print("\n" + "="*60)
    print("✅ Rapor tamamlandı!")
    
    # Raporu dosyaya da kaydet
    report_file = f"reports/weekly_report_{datetime.now().strftime('%Y-%m-%d')}.txt"
    os.makedirs('reports', exist_ok=True)
    
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(f"HAFTALIK BURS SCRAPING RAPORU\n")
        f.write(f"Tarih: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
        f.write(f"="*60 + "\n\n")
        f.write(f"Toplam Burs: {total_scholarships.count}\n")
        f.write(f"Toplam Kurum: {total_organizations.count}\n")
        f.write(f"Bu Hafta Eklenen: {new_scholarships.count}\n")
        f.write(f"Veri Bütünlüğü: {success_rate:.1f}%\n")
    
    print(f"💾 Rapor kaydedildi: {report_file}")

if __name__ == "__main__":
    print("\n" + "="*60)
    print("📊 HAFTALIK RAPOR OLUŞTURUCU")
    print("="*60 + "\n")
    
    generate_weekly_report()

