# 🗄️ SUPABASE v2.0 KURULUM REHBERİ

**Tarih:** 10 Kasım 2024  
**Proje:** Burs Platform v2.0  
**Süre:** ~45-60 dakika  
**Durum:** ⏳ BEKLIYOR

---

## ⚡ HIZLI BAŞLANGIÇ (5 dakika)

### ✅ Ön Hazırlık Kontrol:
- [x] Database schema hazır: `v2-migration/COMPLETE_SCHEMA_V2.sql`
- [x] Migration guide hazır
- [x] Backup alındı
- [x] Git commit yapıldı

---

## 📋 ADIM 1: YENİ SUPABASE PROJESİ OLUŞTUR (10 dakika)

### 1.1 Supabase Dashboard'a Git
```
🌐 https://supabase.com/dashboard
```

### 1.2 Yeni Proje Oluştur
**Adımlar:**
1. ✅ "New Project" butonuna tıkla
2. ✅ Formu doldur:
   ```
   Organization: [Mevcut organization'ı seç]
   Project Name: burs-platform-v2
   Database Password: [GÜÇLÜ ŞİFRE - KAYDET!]
   Region: Central EU (Frankfurt, Germany)
   Pricing Plan: Free
   ```
3. ✅ "Create new project" tıkla
4. ⏱️ 2-3 dakika bekle (proje oluşturuluyor)

### 1.3 API Keys'i Kaydet
**Settings → API**

Şunları kopyala ve güvenli bir yere kaydet:

```env
# Supabase v2.0 Credentials
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG... (GİZLİ - SERVER-ONLY)
```

**⚠️ ÖNEMLİ:** `service_role` key'i asla client-side kodda kullanma!

---

## 📊 ADIM 2: DATABASE SCHEMA UYGULA (15 dakika)

### 2.1 SQL Dosyasını Hazırla
```bash
# Proje dizininde:
cat v2-migration/COMPLETE_SCHEMA_V2.sql
```

**İçeriği Kontrol Et:**
- ✅ 13 tablo tanımı
- ✅ 9 ENUM type
- ✅ RLS policies
- ✅ Indexes
- ✅ Triggers
- ✅ Functions

### 2.2 SQL Editor'da Çalıştır

**Supabase Dashboard:**
1. ✅ Sol menüden **"SQL Editor"** tıkla
2. ✅ **"New query"** tıkla
3. ✅ `COMPLETE_SCHEMA_V2.sql` içeriğini kopyala-yapıştır
4. ✅ Sağ üstteki **"RUN"** butonuna tıkla
5. ⏱️ 10-15 saniye bekle
6. ✅ **"Success"** mesajı gelsin!

**Hata Alırsan:**
```sql
-- Önce temizlik yap (opsiyonel):
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Sonra COMPLETE_SCHEMA_V2.sql'i çalıştır
```

### 2.3 Tabloları Doğrula

**Table Editor → Tables**

Görmemiz gereken 13 tablo:

```
✅ user_profiles          (Kullanıcı profilleri)
✅ organizations          (Organizasyonlar)
✅ students               (Öğrenciler)
✅ scholarships           (Burslar - genişletilmiş)
✅ applications           (Başvurular)
✅ wallet_documents       (Öğrenci belgeleri)
✅ chatbot_conversations  (Chat oturumları)
✅ chatbot_messages       (Chat mesajları)
✅ notifications          (Bildirimler)
✅ admin_logs            (Admin logları)
✅ scholarship_documents  (Burs gereklilikleri)
✅ favorites             (Favoriler)
✅ reviews               (Değerlendirmeler)
```

**Her tabloda kontrol et:**
- Columns doğru mu?
- RLS enabled mi?
- Indexes var mı?

---

## 🔐 ADIM 3: AUTHENTICATION AYARLARI (5 dakika)

### 3.1 Email Auth Ayarları

**Authentication → Settings**

```
✅ Email Provider: Enabled
✅ Confirm Email: Enabled (production için)
✅ Secure Email Change: Enabled
✅ Email OTP: Enabled
```

### 3.2 Email Templates (Opsiyonel)

**Authentication → Email Templates**

Türkçe şablonlar için:
- Confirmation email
- Password reset
- Email change

---

## 💾 ADIM 4: STORAGE BUCKET OLUŞTUR (5 dakika)

### 4.1 Student Documents Bucket

**Storage → Create bucket**

```
Name: student-documents
Public: OFF (Private)
File size limit: 10 MB
Allowed MIME types:
  - application/pdf
  - image/jpeg
  - image/png
  - image/webp
```

### 4.2 RLS Policies

**Bucket → Policies → New policy**

```sql
-- Policy 1: Students can upload their own documents
CREATE POLICY "Students can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'student-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: Students can read their own documents
CREATE POLICY "Students can read own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'student-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3: Organizations can read documents in applications
CREATE POLICY "Organizations can read application documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'student-documents'
  AND EXISTS (
    SELECT 1 FROM applications a
    JOIN scholarships s ON s.id = a.scholarship_id
    WHERE s.organization_id = auth.uid()
  )
);
```

---

## 🔧 ADIM 5: PROJE KONFİGÜRASYONU (10 dakika)

### 5.1 .env.local Güncelle

**Proje dizininde:**

```bash
# .env.local dosyasını aç
nano .env.local
# veya
cursor .env.local
```

**İçeriği güncelle:**

```env
# Supabase v2.0 (YENİ)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI (Chatbot)
OPENAI_API_KEY=sk-...

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ DİKKAT:**
- Eski Supabase credentials'ı YENİ ile değiştir
- `.env.local` Git'e commit edilmemeli (.gitignore'da olmalı)

### 5.2 Supabase Client Test

**Test komutu:**

```bash
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
supabase.from('scholarships').select('count').then(console.log);
"
```

**Beklenen çıktı:**
```json
{ data: [{ count: X }], error: null }
```

---

## 📝 ADIM 6: TEST DATA EKLEME (Opsiyonel) (10 dakika)

### 6.1 Test User Oluştur

**Authentication → Users → Add user**

```
Email: test-student@example.com
Password: Test123!@#
Auto-confirm: YES
```

**SQL Editor'da profil ekle:**

```sql
-- Test student profili
INSERT INTO user_profiles (id, email, role, full_name)
VALUES (
  '[USER_UUID]',  -- Authentication'dan kopyala
  'test-student@example.com',
  'student',
  'Test Öğrenci'
);

INSERT INTO students (user_id, full_name, email, university, department, grade, gpa)
VALUES (
  '[USER_UUID]',
  'Test Öğrenci',
  'test-student@example.com',
  'Test Üniversitesi',
  'Bilgisayar Mühendisliği',
  '3',
  3.50
);
```

### 6.2 Test Scholarship Ekle

```sql
INSERT INTO scholarships (
  title,
  organization,
  amount,
  amount_type,
  deadline,
  description,
  type,
  education_level,
  is_active
) VALUES (
  'Test Burs',
  'Test Vakfı',
  5000,
  'aylık',
  '2024-12-31',
  'Test amaçlı oluşturulmuş burs',
  'akademik',
  'lisans',
  true
);
```

---

## ✅ ADIM 7: DOĞRULAMA (5 dakika)

### 7.1 Checklist

**Supabase Dashboard'da kontrol et:**

```
✅ Project created and active
✅ 13 tables exist
✅ RLS policies enabled
✅ Storage bucket created
✅ Authentication enabled
✅ API keys copied
✅ .env.local updated
✅ Test data added (opsiyonel)
```

### 7.2 Connection Test

**Terminal'de:**

```bash
# Proje dizininde
npm run dev

# Başka terminal'de
curl http://localhost:3000/api/scholarships?limit=1
```

**Beklenen:** JSON response

---

## 🚀 ADIM 8: ESKİ DATA'YI MİGRATE ET (Opsiyonel)

### 8.1 Eski Supabase'den Export

**Eski Supabase → SQL Editor:**

```sql
-- Scholarships export
SELECT * FROM scholarships WHERE is_active = true;
```

**Export as CSV**

### 8.2 Yeni Supabase'e Import

**Table Editor → scholarships → Insert → Import data**

CSV dosyasını yükle

---

## 📊 SONUÇ

### ✅ Tamamlanan İşlemler:

```
✅ Yeni Supabase projesi oluşturuldu
✅ Database schema uygulandı (13 tablo)
✅ RLS policies aktif
✅ Storage bucket hazır
✅ Authentication ayarlandı
✅ .env.local güncellendi
✅ Test data eklendi
✅ Connection test başarılı
```

### 🎯 Sonraki Adımlar:

```
1. ✅ npm run dev → Dev server başlat
2. ✅ Test et (login, register, scholarship list)
3. ✅ Production build test
4. 🚀 Deploy (Vercel/Netlify)
```

---

## ⚠️ SORUN GİDERME

### Problem: "relation does not exist"
**Çözüm:** Schema'yı tekrar çalıştır

### Problem: "permission denied"
**Çözüm:** RLS policies'i kontrol et

### Problem: "Invalid API key"
**Çözüm:** .env.local'i kontrol et, doğru project'ten mi kopyaladın?

### Problem: Connection timeout
**Çözüm:** Supabase project'in region'ını kontrol et

---

## 📞 YARDIM

**Supabase Docs:**
- https://supabase.com/docs/guides/database
- https://supabase.com/docs/guides/auth
- https://supabase.com/docs/guides/storage

**Discord:**
- https://discord.supabase.com

---

**Setup tamamlandığında bu dosyayı SETUP_COMPLETED.md olarak rename et!**

✅ **İYİ ŞANSLAR!** 🚀

