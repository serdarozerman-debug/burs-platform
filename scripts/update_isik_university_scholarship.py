"""
Işık Üniversitesi 'Sende Işık Var Burs Programı' bilgilerini güncelle
Web sitesinden alınan bilgilere göre: https://aday.isikun.edu.tr/sende-isik-var-burs-programi
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import re
from datetime import datetime

load_dotenv('.env.local')

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
anon_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
key = service_key if service_key else anon_key

if not key:
    raise Exception("❌ Supabase key bulunamadı!")

supabase: Client = create_client(url, key)

def update_isik_scholarship():
    """Işık Üniversitesi 'Sende Işık Var Burs Programı' bilgilerini güncelle"""
    print("\n🔍 Işık Üniversitesi bursları güncelleniyor...\n")
    
    # Organizasyonu bul
    org_result = supabase.table('organizations')\
        .select('id, name')\
        .ilike('name', '%Işık%')\
        .execute()
    
    if not org_result.data:
        print("❌ Işık Üniversitesi bulunamadı!")
        return
    
    org_id = org_result.data[0]['id']
    print(f"✅ Organizasyon bulundu: {org_result.data[0]['name']}")
    
    # Mevcut bursları kontrol et
    existing_scholarships = supabase.table('scholarships')\
        .select('id, title')\
        .eq('organization_id', org_id)\
        .execute()
    
    print(f"\n📊 Mevcut burslar: {len(existing_scholarships.data)}")
    
    # "Sende Işık Var Burs Programı" bilgileri
    scholarship_data = {
        'title': 'Sende Işık Var Burs Programı',
        'description': '''"Sende Işık Var" Nedir?

YKS ile bir üniversiteye yerleşmeden önce hayallerini, projelerini, yeteneklerini ve geleceğe dönük kariyer hedeflerini değerlendirerek, üniversite yaşamına bir adım önde başlamanı desteklemek amacıyla Işık Üniversitesi tarafından hazırlanmış bir burs başvuru programıdır.

Başvuru Dönemleri:
• İkinci Dönem: 1 Şubat - 2 Mayıs (Sonuçlar: 16 Mayıs 2025)
• Üçüncü Dönem: 3 Mayıs - 4 Temmuz (Sonuçlar: 18 Temmuz 2025)
• Dördüncü Dönem: 5 Temmuz - 9 Ağustos (Sonuçlar: 11 Ağustos)
• Ek Tercih Dönemi: 12 - 28 Eylül (Sonuçlar: 29 Eylül)

Burs Özellikleri:
• Tam bursa kadar çeşitli oranlarda burs imkanı
• Hazırlık sınıfında 1 yıl, Lisans Programlarında 4 yıl geçerlidir
• %50 indirimli kontenjanına ilk tercihi içinde veya ücretli kontenjanına ilk 3 tercihi içinde yerleştirilmiş olması gereklidir
• Öğretim sırasında verilen ek burs, indirim ve desteklerle birleştirilebilir

Başvuru Süreci:
1. Kayıt Ol ve Giriş Yap
2. Kendinden Bahset
3. Eğitim Bilgilerini Paylaş
4. Bir Projeni Anlat
5. Fikirlerini ve Hayallerini Paylaş
6. Kişisel Bilgilerini Gir
7. Dosya ve Belge Yükle
8. Kontrol Et ve Başvurunu Tamamla

Başvuru sonucu, değerlendirme takviminde belirtilen tarihlerde başvuru sisteminden ve e-posta ile bildirilecektir.''',
        'amount': 0,  # Yüzde bazlı, tam bursa kadar
        'amount_type': 'yıllık',
        'type': 'akademik',
        'education_level': 'lisans',
        'deadline': '2025-09-28',  # Ek Tercih Dönemi son tarihi
        'application_url': 'https://aday.isikun.edu.tr/sende-isik-var-burs-programi',
    }
    
    # Slug oluştur
    slug = scholarship_data['title'].lower()
    slug = slug.replace('ı', 'i').replace('ğ', 'g').replace('ü', 'u').replace('ş', 's').replace('ö', 'o').replace('ç', 'c')
    slug = re.sub(r'[^a-z0-9-]', '-', slug)
    slug = re.sub(r'-+', '-', slug).strip('-')
    
    # Mevcut burs var mı kontrol et
    existing = None
    for s in existing_scholarships.data:
        if 'ışık var' in s['title'].lower() or 'sende' in s['title'].lower():
            existing = s
            break
    
    if existing:
        # Mevcut bursu güncelle
        print(f"\n🔄 Mevcut burs güncelleniyor: {existing['title']}")
        try:
            result = supabase.table('scholarships')\
                .update({
                    'title': scholarship_data['title'],
                    'slug': slug,
                    'description': scholarship_data['description'],
                    'amount': scholarship_data['amount'],
                    'amount_type': scholarship_data['amount_type'],
                    'type': scholarship_data['type'],
                    'education_level': scholarship_data['education_level'],
                    'deadline': scholarship_data['deadline'],
                    'application_url': scholarship_data['application_url'],
                    'is_active': True,
                    'is_published': True,
                })\
                .eq('id', existing['id'])\
                .execute()
            
            print(f"✅ Burs güncellendi: {scholarship_data['title']}")
        except Exception as e:
            print(f"❌ Burs güncelleme hatası: {e}")
    else:
        # Yeni burs oluştur
        print(f"\n➕ Yeni burs oluşturuluyor: {scholarship_data['title']}")
        try:
            scholarship = {
                'title': scholarship_data['title'],
                'slug': slug,
                'organization_id': org_id,
                'description': scholarship_data['description'],
                'amount': scholarship_data['amount'],
                'amount_type': scholarship_data['amount_type'],
                'type': scholarship_data['type'],
                'education_level': scholarship_data['education_level'],
                'deadline': scholarship_data['deadline'],
                'application_url': scholarship_data['application_url'],
                'is_active': True,
                'is_published': True,
            }
            
            result = supabase.table('scholarships').insert(scholarship).execute()
            print(f"✅ Burs eklendi: {scholarship_data['title']}")
        except Exception as e:
            print(f"❌ Burs ekleme hatası: {e}")
    
    print("\n✅ Güncelleme tamamlandı!")

if __name__ == "__main__":
    update_isik_scholarship()

