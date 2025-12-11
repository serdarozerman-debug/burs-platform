"""
Supabase'de SQL çalıştırmak için script
Service role key gerektirir
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv('.env.local')

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SERVICE_ROLE_KEY:
    print("❌ SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli!")
    print("   .env.local dosyasına SUPABASE_SERVICE_ROLE_KEY ekleyin")
    exit(1)

# SQL'i oku
sql_file = os.path.join(os.path.dirname(__file__), 'fix_scraper_rls.sql')
with open(sql_file, 'r') as f:
    sql = f.read()

# Supabase Management API ile SQL çalıştır
# Not: Supabase'in REST API'si direkt SQL çalıştırmayı desteklemiyor
# Bu yüzden psql veya Supabase CLI kullanmak gerekir
# Alternatif: Supabase Dashboard → SQL Editor kullanın

print("⚠️  Supabase Python client direkt SQL çalıştıramaz.")
print("📋 SQL'i Supabase Dashboard'da çalıştırın:")
print("\n" + "="*60)
print(sql)
print("="*60)
print("\n🔗 Adımlar:")
print("1. https://supabase.com/dashboard → Projenizi seçin")
print("2. SQL Editor sekmesine gidin")
print("3. Yukarıdaki SQL'i yapıştırın")
print("4. 'Run' butonuna tıklayın")
print("\n✅ Alternatif: Service role key ile psql kullanabilirsiniz")

