# 🚂 Railway ile BursBuldum Deployment Rehberi

## Adım 1: Railway'e Giriş Yap

1. **Railway'e git:** https://railway.app
2. **"Login"** butonuna tıkla
3. **"Login with GitHub"** seç
4. GitHub hesabınla giriş yap ve Railway'e izin ver

---

## Adım 2: Yeni Proje Oluştur

1. Dashboard'da **"New Project"** butonuna tıkla
2. **"Deploy from GitHub repo"** seç
3. Repo listesinden **`burs-platform`** seç
   - Eğer görmüyorsan: "Configure GitHub App" → Railway'e repo erişimi ver

---

## Adım 3: Environment Variables Ekle

Railway projesinde → **"Variables"** sekmesi → **"New Variable"**

### Eklenecek Environment Variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://aivvlkoyybzpcgqchlcp.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdnZsa295eWJ6cGNncWNobGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MjQyODMsImV4cCI6MjA0ODMwMDI4M30.7vYlZ5g_QoNpBFrWMXzPU8wZqU3Rt3LkXHU7RZZd_kI

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdnZsa295eWJ6cGNncWNobGNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjcyNDI4MywiZXhwIjoyMDQ4MzAwMjgzfQ.LTUe7zGdVYR9-6QSnzHX9kR8Y3x_wPiPqxwAR32uyOc

# Site Configuration (Railway deploy olduktan sonra güncellenecek)
NEXT_PUBLIC_SITE_URL=https://bursbuldum.up.railway.app

# OpenAI (Opsiyonel - scraper için)
OPENAI_API_KEY=sk-proj-your-key-here

# Resend (Email için)
RESEND_API_KEY=re_bpcvL6GX_J6XqcfKiK9RxhibuJVF6n77w
```

**NOT:** Her bir variable'ı tek tek ekle:
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://aivvlkoyybzpcgqchlcp.supabase.co`
- **"Add"** butonuna tıkla
- Diğer variable'lar için tekrarla

---

## Adım 4: Deploy Başlat

1. Variable'ları ekledikten sonra Railway **otomatik olarak deploy başlatır**
2. **"Deployments"** sekmesinden ilerlemeyi izle
3. Build log'larını görebilirsin (2-3 dakika sürer)

### Deploy Tamamlandığında:
- ✅ **Success** görmelisin
- Railway sana bir URL verecek: `https://bursbuldum.up.railway.app` (ya da benzeri)

---

## Adım 5: Public URL'i Al

1. Railway projesinde → **"Settings"** sekmesi
2. **"Networking"** bölümü
3. **"Generate Domain"** butonuna tıkla
4. Railway sana bir domain verir: `your-project.up.railway.app`
5. Bu URL'i kopyala

---

## Adım 6: NEXT_PUBLIC_SITE_URL'i Güncelle

1. **"Variables"** sekmesine dön
2. `NEXT_PUBLIC_SITE_URL` variable'ını bul
3. Value'yu Railway'in verdiği URL ile güncelle:
   ```
   https://your-project.up.railway.app
   ```
4. **"Update"** butonuna tıkla
5. Railway otomatik olarak yeniden deploy eder

---

## Adım 7: Supabase Callback URL'lerini Güncelle

1. **Supabase Dashboard'a git:** https://supabase.com/dashboard
2. Projenizi seçin → **"Authentication"** → **"URL Configuration"**

### Güncellenecek URL'ler:

**Site URL:**
```
https://your-project.up.railway.app
```

**Redirect URLs (her satırı ayrı ayrı ekle):**
```
https://your-project.up.railway.app/auth/callback
https://your-project.up.railway.app
https://your-project.up.railway.app/admin/dashboard
```

**Save** butonuna tıkla.

---

## Adım 8: Test Et! 🎉

1. Railway URL'ini tarayıcıda aç: `https://your-project.up.railway.app`
2. Test et:
   - ✅ Ana sayfa yükleniyor mu?
   - ✅ Burslar listeleniyor mu?
   - ✅ Kayıt ol / Giriş yap çalışıyor mu?
   - ✅ Google OAuth çalışıyor mu?
   - ✅ Admin dashboard erişilebiliyor mu?

---

## Adım 9: Custom Domain Bağla (Cloudflare)

### Railway Tarafı:

1. Railway → **"Settings"** → **"Networking"**
2. **"Custom Domain"** bölümü
3. **"Add Domain"** butonuna tıkla
4. Domain'i gir: `bursbuldum.com`
5. Railway sana DNS kayıtları verecek

### Cloudflare Tarafı:

1. **Cloudflare Dashboard'a git:** https://dash.cloudflare.com
2. **"bursbuldum.com"** domain'ini seç
3. **"DNS"** → **"Records"** sekmesi
4. **"Add record"** butonuna tıkla

**Ana Domain için:**
- Type: `CNAME`
- Name: `@`
- Target: Railway'in verdiği domain (örn: `your-project.up.railway.app`)
- Proxy status: `DNS only` (gri bulut)
- **Save**

**www için (opsiyonel):**
- Type: `CNAME`
- Name: `www`
- Target: Railway'in verdiği domain
- Proxy status: `DNS only` (gri bulut)
- **Save**

**NOT:** DNS propagation 5-10 dakika sürebilir.

---

## Adım 10: SSL/HTTPS Otomatik Aktif Olacak

Railway otomatik olarak Let's Encrypt SSL sertifikası oluşturur.
- Domain bağlandıktan 2-3 dakika sonra `https://bursbuldum.com` çalışır.

---

## Adım 11: Supabase'i Domain ile Güncelle

Domain bağlandıktan sonra Supabase'i tekrar güncelle:

**Site URL:**
```
https://bursbuldum.com
```

**Redirect URLs:**
```
https://bursbuldum.com/auth/callback
https://bursbuldum.com
https://bursbuldum.com/admin/dashboard
```

---

## 🎊 Tamamlandı!

Artık siteniz Railway'de live:
- ✅ `https://bursbuldum.com` çalışıyor
- ✅ SSL/HTTPS aktif
- ✅ GitHub'a her push otomatik deploy
- ✅ Supabase bağlı
- ✅ Email gönderimi çalışıyor

---

## 🔄 Otomatik Deployments

Railway otomatik olarak:
- Her GitHub push'ta yeniden deploy eder
- Branch bazlı deployment'lar yapar
- Build log'larını saklar
- Rollback yapmanıza izin verir

---

## 💰 Maliyet

Railway ücretsiz başlar:
- **$5/ay ücretsiz kredi**
- Kullanım bazlı ödeme: ~$0.000463 per GB-hour
- Küçük projeler için **aylık $0-5** arası

---

## ⚠️ Olası Sorunlar ve Çözümler

### 1. Build Başarısız Olursa:
- Railway → Deployments → Build log'u oku
- Genelde `npm install` hatası olur
- `package.json` ve `package-lock.json` güncel mi kontrol et

### 2. Environment Variable Eksik Hatası:
- Variables sekmesinde tüm variable'ları ekle
- Railway'i restart et: Settings → "Restart"

### 3. 500 Internal Server Error:
- Supabase URL'lerini kontrol et
- Railway log'larını oku: Deployments → View Logs

### 4. Google OAuth Çalışmıyor:
- Supabase Redirect URLs'i kontrol et
- Google Cloud Console'da Railway URL'ini ekle

### 5. Domain Bağlanmıyor:
- Cloudflare'de Proxy status: "DNS only" olmalı
- 10-15 dakika bekle (DNS propagation)
- Railway'de domain status: "Active" olmalı

---

## 📞 Yardım

Railway Support:
- Discord: https://discord.gg/railway
- Docs: https://docs.railway.app

---

**Başarılar! 🚀**

