"""
Duplicate bursları temizle
Aynı title + organization olan kayıtlardan en yenisini tut
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv
from collections import defaultdict

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env.local'))

supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase: Client = create_client(supabase_url, supabase_key)

print("🧹 Duplicate Temizleme Başlıyor...\n")

# Tüm bursları çek
result = supabase.table('scholarships').select('*').execute()
scholarships = result.data

print(f"📊 Toplam burs: {len(scholarships)}\n")

# Duplicate'leri bul
duplicates = defaultdict(list)
for s in scholarships:
    key = (s['title'], s['organization'])
    duplicates[key].append(s)

# Duplicate olanları filtrele
to_delete = []
for key, items in duplicates.items():
    if len(items) > 1:
        # En yeni olanı tut, diğerlerini sil
        items_sorted = sorted(items, key=lambda x: x['created_at'], reverse=True)
        keep = items_sorted[0]
        delete = items_sorted[1:]
        
        print(f"🔍 Duplicate bulundu: {key[0][:50]}... ({key[1]})")
        print(f"   ✅ Tutulacak: {keep['id']} (created: {keep['created_at']})")
        print(f"   ❌ Silinecek: {len(delete)} kayıt")
        
        to_delete.extend([item['id'] for item in delete])

print(f"\n{'='*60}")
print(f"📊 Özet:")
print(f"   Toplam kayıt: {len(scholarships)}")
print(f"   Unique kayıt: {len(duplicates)}")
print(f"   Silinecek: {len(to_delete)}")
print(f"{'='*60}\n")

if to_delete:
    confirm = input(f"⚠️  {len(to_delete)} duplicate kaydı silmek istiyor musunuz? (evet/hayır): ")
    
    if confirm.lower() in ['evet', 'yes', 'e', 'y']:
        deleted_count = 0
        for delete_id in to_delete:
            try:
                supabase.table('scholarships').delete().eq('id', delete_id).execute()
                deleted_count += 1
                print(f"  ✅ Silindi: {delete_id}")
            except Exception as e:
                print(f"  ❌ Hata: {e}")
        
        print(f"\n{'='*60}")
        print(f"✅ {deleted_count} duplicate kayıt silindi!")
        print(f"📊 Kalan kayıt: {len(scholarships) - deleted_count}")
        print(f"{'='*60}")
    else:
        print("\n❌ İşlem iptal edildi.")
else:
    print("✅ Duplicate kayıt bulunamadı! Database temiz.")

