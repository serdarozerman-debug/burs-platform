# 🔐 .env.local TEMPLATE

**Supabase projesi oluşturduktan sonra bu dosyayı `.env.local` olarak kaydet!**

---

## 📋 ADIMLAR:

### 1. Supabase API Keys'i Kopyala
```
Supabase Dashboard → Settings → API

Project URL ve anon key'i kopyala
```

### 2. .env.local Dosyası Oluştur
```bash
# Proje dizininde:
nano .env.local
# veya Cursor'da yeni dosya oluştur
```

### 3. Aşağıdaki Template'i Yapıştır ve Doldur

```env
# ============================================
# SUPABASE v2.0 CONFIGURATION
# ============================================

# Supabase Project URL (ZORUNLU)
# Örnek: https://abcdefghijklmno.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co

# Supabase Anon Key (ZORUNLU)
# Supabase Dashboard → Settings → API → anon/public
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...

# ============================================
# OPENAI CONFIGURATION (Chatbot için)
# ============================================

# OpenAI API Key (Chatbot özelliği için gerekli)
# https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-...

# ============================================
# APP CONFIGURATION
# ============================================

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

---

## ✅ KONTROL LİSTESİ:

Kaydetmeden önce kontrol et:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` dolduruldu mu?
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` dolduruldu mu?
- [ ] `OPENAI_API_KEY` dolduruldu mu? (chatbot için)
- [ ] Dosya adı tam olarak `.env.local` mi?
- [ ] Dosya proje root dizininde mi?

---

## ⚠️ GÜVENLİK NOTLARI:

1. **.env.local GİT'E COMMIT ETME!**
   ```bash
   # .gitignore'da olmalı:
   .env.local
   .env*.local
   ```

2. **service_role key'i ASLA client-side'da kullanma!**
   - `service_role` key'i sadece backend/server-side'da kullan
   - `anon` key'i client-side için güvenli

3. **API Keys'i KİMSEYLE PAYLAŞMA!**
   - Slack, Discord, email'de paylaşma
   - Screenshot alırken gizle
   - GitHub issue'larda paylaşma

---

## 🧪 TEST:

.env.local oluşturduktan sonra test et:

```bash
# 1. Dependencies yükle
npm install

# 2. Dev server başlat
npm run dev

# 3. API test
curl http://localhost:3000/api/scholarships?limit=1

# Başarılı ise JSON dönmeli!
```

---

## 🔄 SUPABASE CREDENTIALS DEĞİŞTİRME:

Eğer Supabase project'ini yeniden oluşturduğunda:

1. Eski credentials'ı sil
2. Yeni credentials'ı kopyala
3. `.env.local`'i güncelle
4. Server'ı restart et:
   ```bash
   # Terminal'de Ctrl+C ile durdur
   npm run dev
   ```

---

## 📞 YARDIM:

**Hata: "Invalid API key"**
→ Credentials'ı tekrar kontrol et, doğru project'ten mi kopyaladın?

**Hata: "Project not found"**
→ URL'i kontrol et, `https://` ve `.supabase.co` var mı?

**Hata: "CORS error"**
→ Supabase Dashboard → Settings → API → CORS origins kontrol et

---

✅ **Hazır olduğunda bu dosyayı silebilirsin!**

