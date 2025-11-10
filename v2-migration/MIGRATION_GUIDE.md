# 🗄️ BURS PLATFORM v2.0 - DATABASE MIGRATION GUIDE

## 📋 Ön Hazırlık

### 1. Mevcut Verileri Yedekle
```sql
-- Supabase Dashboard > Database > Backups
-- "Create Backup" butonuna tıklayın
```

### 2. Gerekli Extension'ları Kontrol Et
```sql
-- uuid-ossp extension zaten kurulu mu kontrol et
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';
```

---

## 🚀 Migration Adımları

### Adım 1: Supabase Dashboard'a Git
1. https://supabase.com/dashboard açın
2. Projenizi seçin
3. Sol menüden **SQL Editor** seçin

### Adım 2: Migration SQL'i Çalıştır

#### Seçenek A: Dosyadan Yükle (Önerilen)
1. SQL Editor'de **"New Query"** butonuna tıklayın
2. `v2-migration/COMPLETE_SCHEMA_V2.sql` dosyasının içeriğini kopyalayın
3. SQL Editor'e yapıştırın
4. **"Run"** (F5) butonuna tıklayın
5. Hataları kontrol edin

#### Seçenek B: Manuel Çalıştırma
Aşağıdaki SQL'leri sırayla çalıştırın:

**1. Enable UUID Extension**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

**2. Create ENUMs**
```sql
CREATE TYPE user_role AS ENUM ('student', 'organization', 'admin');
CREATE TYPE organization_type AS ENUM ('vakıf', 'kamu', 'belediye', 'üniversite', 'dernek', 'uluslararası', 'özel');
CREATE TYPE education_level AS ENUM ('lise', 'önlisans', 'lisans', 'yükseklisans', 'doktora');
CREATE TYPE scholarship_type AS ENUM ('akademik', 'ihtiyaç', 'engelli', 'sporcu', 'sanatçı', 'girişimci');
CREATE TYPE amount_type AS ENUM ('aylık', 'yıllık', 'tek seferlik');
CREATE TYPE application_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'withdrawn');
CREATE TYPE document_type AS ENUM ('kimlik', 'nufus_cuzdani', 'ogrenci_belgesi', 'transkript', 'diploma', 'gelir_belgesi', 'ikamet_belgesi', 'saglik_raporu', 'engelli_raporu', 'foto', 'cv', 'referans_mektubu', 'motivasyon_mektubu', 'banka_hesap_bilgileri', 'veli_onay_formu', 'diger');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE notification_type AS ENUM ('application_status', 'new_scholarship', 'deadline_reminder', 'document_verification', 'message');
```

**3. Create Tables** (Full SQL in COMPLETE_SCHEMA_V2.sql)

---

## ✅ Migration Verification

### Verification Script
Migration'dan sonra aşağıdaki SQL'i çalıştırarak kontrol edin:

```sql
-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Expected tables:
-- 1. user_profiles
-- 2. organizations
-- 3. students
-- 4. scholarships (updated)
-- 5. applications
-- 6. wallet_documents
-- 7. application_documents
-- 8. favorites
-- 9. chatbot_conversations
-- 10. chatbot_messages
-- 11. notifications

-- Check if all ENUMs exist
SELECT t.typname as enum_name, string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) as values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
GROUP BY t.typname
ORDER BY t.typname;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'organizations', 'students', 'scholarships', 'applications', 'wallet_documents', 'favorites', 'chatbot_conversations', 'notifications')
ORDER BY tablename;

-- Count policies
SELECT schemaname, tablename, COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;
```

### Expected Results
- ✅ **11 tables** created
- ✅ **9 ENUM types** created
- ✅ **RLS enabled** on all tables (rowsecurity = true)
- ✅ **~15 policies** total
- ✅ **5 triggers** created
- ✅ **3 functions** created

---

## 🔧 Olası Hatalar ve Çözümler

### Hata 1: "type already exists"
```
ERROR: type "user_role" already exists
```

**Çözüm:** Bu ENUM zaten var. Devam edebilirsiniz veya önce silin:
```sql
DROP TYPE IF EXISTS user_role CASCADE;
```

### Hata 2: "relation already exists"
```
ERROR: relation "user_profiles" already exists
```

**Çözüm:** Tablo zaten var. Eğer temiz bir migration istiyorsanız:
```sql
-- UYARI: Tüm verileri siler!
DROP TABLE IF EXISTS user_profiles CASCADE;
```

### Hata 3: "permission denied"
```
ERROR: permission denied for schema public
```

**Çözüm:** Supabase'de admin yetkileriniz olduğundan emin olun. SQL Editor'de çalışmalısınız.

### Hata 4: "column already exists"
```
ERROR: column "organization_id" already exists
```

**Çözüm:** `scholarships` tablosu güncelleniyor. Önce mevcut sütunları kontrol edin:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'scholarships'
ORDER BY ordinal_position;
```

---

## 🔄 Rollback (Geri Alma)

Eğer migration başarısız olursa veya sorun çıkarsa:

```sql
-- UYARI: Tüm v2.0 tablolarını ve verilerini siler!

-- Drop all tables
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS chatbot_messages CASCADE;
DROP TABLE IF EXISTS chatbot_conversations CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS application_documents CASCADE;
DROP TABLE IF EXISTS wallet_documents CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Drop all ENUMs
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS verification_status CASCADE;
DROP TYPE IF EXISTS document_type CASCADE;
DROP TYPE IF EXISTS application_status CASCADE;
DROP TYPE IF EXISTS amount_type CASCADE;
DROP TYPE IF EXISTS scholarship_type CASCADE;
DROP TYPE IF EXISTS education_level CASCADE;
DROP TYPE IF EXISTS organization_type CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Backup'tan geri yükle
-- Supabase Dashboard > Database > Backups > Restore
```

---

## 📊 Migration Sonrası Test

### 1. Test User Profile Oluştur
```sql
-- Test için manuel user profile oluştur (sonra silinecek)
INSERT INTO user_profiles (id, role, email, full_name)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'student',
  'test@example.com',
  'Test Student'
);
```

### 2. Test Student Oluştur
```sql
INSERT INTO students (user_id, first_name, last_name)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Test',
  'Student'
);
```

### 3. Verileri Kontrol Et
```sql
SELECT * FROM user_profiles LIMIT 5;
SELECT * FROM students LIMIT 5;
SELECT * FROM organizations LIMIT 5;
SELECT * FROM scholarships LIMIT 5;
```

### 4. Test Verilerini Temizle
```sql
DELETE FROM students WHERE user_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM user_profiles WHERE id = '00000000-0000-0000-0000-000000000001';
```

---

## ✅ Migration Başarılı!

Migration tamamlandıktan sonra:

1. ✅ Tüm tabloların oluştuğunu doğrulayın
2. ✅ RLS'in aktif olduğunu kontrol edin
3. ✅ Test kayıtlarını deneyin
4. ✅ Next.js uygulamasını test edin:
   ```bash
   npm run dev
   ```
5. ✅ `/login` ve `/register` sayfalarını test edin

---

## 🎯 Sıradaki Adımlar

Migration tamamlandıktan sonra **Phase 2: Organization Panel** implementasyonuna geçebiliriz!

- Organization dashboard
- Scholarship CRUD
- Application review

**Hazır olduğunuzda devam edin!** 🚀

