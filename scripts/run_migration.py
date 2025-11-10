"""
Database migration'ını otomatik çalıştırır
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

# .env.local yükle
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env.local'))

# Supabase bağlantısı
supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not supabase_url or not supabase_key:
    raise Exception("❌ Supabase credentials bulunamadı!")

supabase: Client = create_client(supabase_url, supabase_key)

print("🚀 Database Migration Başlıyor...\n")

# Migration SQL'ini oku
with open('scripts/FULL_MIGRATION.sql', 'r', encoding='utf-8') as f:
    sql = f.read()

# SQL komutlarını satırlara ayır
commands = []
current_command = []

for line in sql.split('\n'):
    line = line.strip()
    
    # Yorum satırlarını atla
    if line.startswith('--') or not line:
        continue
    
    current_command.append(line)
    
    # Noktalı virgül ile biten satırlar komut sonu
    if line.endswith(';'):
        commands.append(' '.join(current_command))
        current_command = []

print(f"📋 {len(commands)} SQL komutu bulundu\n")

# Her komutu tek tek çalıştır
success_count = 0
error_count = 0

for idx, cmd in enumerate(commands, 1):
    try:
        # Komut önizlemesi
        preview = cmd[:80] + '...' if len(cmd) > 80 else cmd
        print(f"[{idx}/{len(commands)}] {preview}")
        
        # SQL çalıştır
        result = supabase.rpc('exec_sql', {'query': cmd}).execute()
        
        print(f"  ✅ Başarılı")
        success_count += 1
        
    except Exception as e:
        error_msg = str(e)
        
        # "column already exists" hatası normal
        if 'already exists' in error_msg.lower() or 'if not exists' in cmd.lower():
            print(f"  ⏭️  Zaten var (normal)")
            success_count += 1
        else:
            print(f"  ❌ Hata: {error_msg}")
            error_count += 1

print(f"\n{'='*60}")
print(f"📊 Migration Özeti:")
print(f"   ✅ Başarılı: {success_count}")
print(f"   ❌ Hatalı: {error_count}")
print(f"{'='*60}\n")

if error_count == 0:
    print("🎉 Migration başarıyla tamamlandı!")
    print("\n📋 Sonraki adım:")
    print("   Tarayıcıda Cmd+Shift+R ile sayfayı yenileyin")
else:
    print("⚠️  Bazı komutlar hata verdi.")
    print("   Manuel olarak Supabase SQL Editor'da çalıştırmayı deneyin:")
    print("   👉 scripts/FULL_MIGRATION.sql")

