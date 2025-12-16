import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('.env.local')

supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(supabase_url, supabase_key)

# Website ve logo mapping
ORG_DATA = {
    "Borusan Kocabıyık Vakfı": {
        "website": "https://bkv.org.tr",
        "logo_url": "https://www.google.com/s2/favicons?domain=bkv.org.tr&sz=128"
    },
    "Fulbright Eğitim Komisyonu": {
        "website": "https://www.fulbright.org.tr",
        "logo_url": "https://www.google.com/s2/favicons?domain=fulbright.org.tr&sz=128"
    },
    "Türkiye Fulbright Eğitim Komisyonu": {
        "website": "https://www.fulbright.org.tr",
        "logo_url": "https://www.google.com/s2/favicons?domain=fulbright.org.tr&sz=128"
    },
    "Fulbright Turkiye": {
        "website": "https://www.fulbright.org.tr",
        "logo_url": "https://www.google.com/s2/favicons?domain=fulbright.org.tr&sz=128"
    },
    "İbrahim Çeçen Vakfı": {
        "website": "https://icvakfi.org.tr",
        "logo_url": "https://www.google.com/s2/favicons?domain=icvakfi.org.tr&sz=128"
    },
    "Türk Eğitim Derneği": {
        "website": "https://ted.org.tr",
        "logo_url": "https://www.google.com/s2/favicons?domain=ted.org.tr&sz=128"
    },
    "İstanbul Gelişim Üniversitesi": {
        "website": "https://www.gelisim.edu.tr",
        "logo_url": "https://www.google.com/s2/favicons?domain=gelisim.edu.tr&sz=128"
    },
    "TÜRGEV": {
        "website": "https://www.turgev.org",
        "logo_url": "https://www.google.com/s2/favicons?domain=turgev.org&sz=128"
    },
    "Turkcell": {
        "website": "https://www.turkcell.com.tr",
        "logo_url": "https://www.google.com/s2/favicons?domain=turkcell.com.tr&sz=128"
    },
    "DAAD": {
        "website": "https://www.daad.de",
        "logo_url": "https://www.google.com/s2/favicons?domain=daad.de&sz=128"
    },
    "Antalya Buyuksehir Belediyesi": {
        "website": "https://www.antalya.bel.tr",
        "logo_url": "https://www.google.com/s2/favicons?domain=antalya.bel.tr&sz=128"
    },
    "Izmir Buyuksehir Belediyesi": {
        "website": "https://www.izmir.bel.tr",
        "logo_url": "https://www.google.com/s2/favicons?domain=izmir.bel.tr&sz=128"
    },
    "Turkiye Genclik ve Egitime Hizmet Vakfi": {
        "website": "https://www.turgev.org",
        "logo_url": "https://www.google.com/s2/favicons?domain=turgev.org&sz=128"
    },
    "Losemili Cocuklar Vakfi": {
        "website": "https://www.losev.org.tr",
        "logo_url": "https://www.google.com/s2/favicons?domain=losev.org.tr&sz=128"
    },
    "Anne Cocuk Egitim Vakfi": {
        "website": "https://www.acev.org",
        "logo_url": "https://www.google.com/s2/favicons?domain=acev.org&sz=128"
    },
    "Turkiye Burslari": {
        "website": "https://www.turkiyeburslari.gov.tr",
        "logo_url": "https://www.google.com/s2/favicons?domain=turkiyeburslari.gov.tr&sz=128"
    },
    "Milli Egitim Bakanligi": {
        "website": "https://www.meb.gov.tr",
        "logo_url": "https://www.google.com/s2/favicons?domain=meb.gov.tr&sz=128"
    },
    "Bahçeşehir Üniversitesi": {
        "website": "https://www.bau.edu.tr",
        "logo_url": "https://www.google.com/s2/favicons?domain=bau.edu.tr&sz=128"
    },
    "Türkiye Cumhuriyeti Yükseköğretim Kurulu": {
        "website": "https://www.yok.gov.tr",
        "logo_url": "https://www.google.com/s2/favicons?domain=yok.gov.tr&sz=128"
    }
}

print("🎨 KURUM LOGO VE FAVICON GÜNCELLENİYOR")
print("="*60)

updated = 0
skipped = 0

for org_name, data in ORG_DATA.items():
    try:
        # Kurumu bul
        org_result = supabase.table('organizations')\
            .select('id, name')\
            .ilike('name', org_name)\
            .limit(1)\
            .execute()
        
        if not org_result.data:
            print(f"❌ Bulunamadı: {org_name}")
            skipped += 1
            continue
        
        org_id = org_result.data[0]['id']
        
        # Logo ve website güncelle
        update_result = supabase.table('organizations')\
            .update({
                'website': data['website'],
                'logo_url': data['logo_url']
            })\
            .eq('id', org_id)\
            .execute()
        
        if update_result.data:
            print(f"✅ {org_name}")
            print(f"   Logo: {data['logo_url'][:50]}...")
            updated += 1
        else:
            print(f"⚠️ Güncelleme hatası: {org_name}")
            skipped += 1
    
    except Exception as e:
        print(f"❌ Hata ({org_name}): {e}")
        skipped += 1

print()
print("="*60)
print(f"✅ Güncellenen: {updated}")
print(f"⏭️ Atlanan: {skipped}")
print(f"📊 Toplam: {updated + skipped}")

