"""
Supabase'de SQL çalıştırmak için RPC fonksiyonu kullanarak
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv('.env.local')

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

# Service role key varsa onu kullan (RLS bypass)
key = SERVICE_ROLE_KEY if SERVICE_ROLE_KEY else SUPABASE_KEY

if not SUPABASE_URL or not key:
    print("❌ Supabase credentials bulunamadı!")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, key)

# SQL'i çalıştırmak için önce bir RPC fonksiyonu oluşturmamız gerekir
# Ama bu da Supabase Dashboard'da yapılmalı

# Alternatif: Direkt SQL çalıştırmak için Supabase'in REST API'sini kullan
# Ama bu da Management API gerektirir ve service role key ile çalışır

print("⚠️  Supabase Python client direkt SQL çalıştıramaz.")
print("📋 SQL'i Supabase Dashboard'da çalıştırın:")
print("\n" + "="*60)
print("CREATE POLICY IF NOT EXISTS \"Scrapers can insert scholarships\"")
print("    ON scholarships FOR INSERT")
print("    WITH CHECK (true);")
print("="*60)
print("\n🔗 Adımlar:")
print("1. https://supabase.com/dashboard → Projenizi seçin")
print("2. SQL Editor sekmesine gidin")
print("3. Yukarıdaki SQL'i yapıştırın")
print("4. 'Run' butonuna tıklayın")
print("\n✅ Alternatif: Service role key ile psql kullanabilirsiniz")

