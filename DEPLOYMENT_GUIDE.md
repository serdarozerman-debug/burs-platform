# BursBuldum - Production Deployment Rehberi

## 🚀 En Hızlı Deployment Yöntemi: Vercel + Cloudflare

### Teknoloji Stack
- **Frontend**: Next.js 15 (App Router)
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Email**: Resend
- **Hosting**: Vercel (Önerilen)
- **Domain**: Cloudflare (Önerilen)

---

## 📋 Adım 1: Domain Satın Alma ve Yönetim

### Domain Satın Alma Seçenekleri:

#### 1. Cloudflare Registrar (Önerilen - En Ucuz)
- **Avantajlar**: 
  - En ucuz fiyatlar
  - Ücretsiz DNS yönetimi
  - Ücretsiz SSL
  - Kolay Vercel entegrasyonu
- **Adımlar**:
  1. https://www.cloudflare.com/products/registrar/ adresine gidin
  2. İstediğiniz domain'i arayın (örn: bursbuldum.com)
  3. Sepete ekleyip satın alın
  4. Ödeme işlemini tamamlayın

#### 2. Namecheap (Alternatif)
- **Avantajlar**: Kolay kullanım, iyi müşteri desteği
- **Fiyat**: ~$10-15/yıl (.com domain)

#### 3. GoDaddy (Alternatif)
- **Avantajlar**: Yaygın kullanım
- **Fiyat**: ~$12-20/yıl (.com domain)

---

## 📋 Adım 2: Vercel'e Deployment

### 2.1 Vercel Hesabı Oluşturma
1. https://vercel.com adresine gidin
2. "Sign Up" ile GitHub/GitLab/Bitbucket hesabınızla giriş yapın
3. Ücretsiz plan yeterli (Hobby plan)

### 2.2 Projeyi Vercel'e Bağlama

#### Yöntem 1: GitHub ile (Önerilen)
```bash
# 1. Mevcut değişiklikleri commit edin
cd "/Users/serdarozerman/Desktop/jobbox-react/1. JobBox-Nextjs 15 (app router)"
git add .
git commit -m "feat: BursBuldum rebranding and production ready"

# 2. Main branch'e geçin veya yeni branch oluşturun
git checkout main || git checkout -b main
git merge feature/v3-implementation  # Eğer feature branch'inden merge ediyorsanız

# 3. GitHub'a push edin
git push origin main

# Not: Remote zaten ayarlı: https://github.com/serdarozerman-debug/burs-platform.git
# Eğer repository adını değiştirmek isterseniz:
# git remote set-url origin https://github.com/YOUR_USERNAME/bursbuldum.git

# 4. Vercel Dashboard'a gidin
# 5. "Add New Project" tıklayın
# 6. GitHub repository'nizi seçin (serdarozerman-debug/burs-platform)
# 7. "Import" tıklayın
```

#### Yöntem 2: Vercel CLI ile
```bash
# 1. Vercel CLI'yi yükleyin
npm i -g vercel

# 2. Proje dizinine gidin
cd "/Users/serdarozerman/Desktop/jobbox-react/1. JobBox-Nextjs 15 (app router)"

# 3. Vercel'e login olun
vercel login

# 4. Projeyi deploy edin
vercel

# 5. Production'a deploy edin
vercel --prod
```

### 2.3 Environment Variables Ayarlama

Vercel Dashboard > Project Settings > Environment Variables bölümüne şunları ekleyin:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend
RESEND_API_KEY=re_bpcvL6GX_J6XqcfKiK9RxhibuJVF6n77w

# App URL (Production)
NEXT_PUBLIC_APP_URL=https://bursbuldum.com

# Google OAuth (Supabase'de ayarlanmalı)
# Supabase Dashboard > Authentication > URL Configuration
# Site URL: https://bursbuldum.com
# Redirect URLs: https://bursbuldum.com/auth/callback
```

**Önemli**: `.env.local` dosyasındaki değerleri Vercel'e ekleyin!

---

## 📋 Adım 3: Domain'i Vercel'e Bağlama

### 3.1 Vercel'de Domain Ekleme
1. Vercel Dashboard > Project > Settings > Domains
2. "Add Domain" tıklayın
3. Domain'inizi girin (örn: bursbuldum.com)
4. "Add" tıklayın
5. Vercel size DNS kayıtlarını gösterecek

### 3.2 DNS Ayarları (Cloudflare kullanıyorsanız)

#### Cloudflare Dashboard'da:
1. Domain'inizi seçin
2. DNS > Records bölümüne gidin
3. Şu kayıtları ekleyin:

```
Type: A
Name: @
Content: 76.76.21.21
Proxy: Proxied (turuncu bulut)

Type: CNAME
Name: www
Content: cname.vercel-dns.com
Proxy: Proxied (turuncu bulut)
```

**Not**: Vercel'in verdiği IP adreslerini kullanın (76.76.21.21 örnek)

#### Alternatif: Vercel'in Önerdiği CNAME Kaydı
Vercel bazen CNAME kaydı önerir:
```
Type: CNAME
Name: @
Content: cname.vercel-dns.com
Proxy: Proxied
```

### 3.3 SSL Sertifikası
- Vercel otomatik olarak SSL sertifikası sağlar (Let's Encrypt)
- Domain bağlandıktan sonra 5-10 dakika içinde aktif olur

---

## 📋 Adım 4: Supabase Ayarları

### 4.1 Supabase Dashboard'da URL Güncelleme
1. Supabase Dashboard > Project Settings > API
2. "Site URL" alanını güncelleyin: `https://bursbuldum.com`
3. Kaydedin

### 4.2 Authentication URL'leri Güncelleme
1. Supabase Dashboard > Authentication > URL Configuration
2. **Site URL**: `https://bursbuldum.com`
3. **Redirect URLs** bölümüne ekleyin:
   ```
   https://bursbuldum.com/auth/callback
   https://bursbuldum.com/**
   ```

### 4.3 Google OAuth Ayarları
1. Google Cloud Console'da OAuth credentials'ı güncelleyin
2. **Authorized redirect URIs** bölümüne ekleyin:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
   (Bu Supabase'in callback URL'i, domain değişmez)

---

## 📋 Adım 5: Resend Email Ayarları

### 5.1 Domain Doğrulama (Önemli!)
1. Resend Dashboard > Domains
2. "Add Domain" tıklayın
3. Domain'inizi girin (örn: bursbuldum.com)
4. Resend size DNS kayıtlarını verecek
5. Cloudflare DNS'e bu kayıtları ekleyin:

```
Type: TXT
Name: @
Content: resend-domain-verification-code

Type: CNAME
Name: resend._domainkey
Content: resend-domain-key
```

6. Domain doğrulandıktan sonra email gönderim adresini güncelleyin:

```typescript
// app/api/send-welcome-email/route.ts
from: 'BursBuldum <noreply@bursbuldum.com>'
```

---

## 📋 Adım 6: Son Kontroller

### 6.1 Test Checklist
- [ ] Site açılıyor mu? (https://bursbuldum.com)
- [ ] SSL sertifikası aktif mi? (https:// olmalı)
- [ ] Supabase bağlantısı çalışıyor mu?
- [ ] Login/Register çalışıyor mu?
- [ ] Google OAuth çalışıyor mu?
- [ ] Email gönderimi çalışıyor mu?
- [ ] API routes çalışıyor mu?
- [ ] Admin dashboard erişilebilir mi?

### 6.2 Performance Optimizasyonları
Vercel otomatik olarak şunları yapar:
- ✅ Image optimization
- ✅ Code splitting
- ✅ Edge caching
- ✅ CDN distribution

### 6.3 Monitoring
- Vercel Analytics'i aktifleştirin (Dashboard > Analytics)
- Supabase Dashboard'da query performance'ı kontrol edin

---

## 🚨 Önemli Notlar

### Güvenlik
1. **Environment Variables**: `.env.local` dosyasını asla commit etmeyin
2. **API Keys**: Production'da service role key'i sadece server-side kullanın
3. **CORS**: Supabase'de allowed origins'e domain'inizi ekleyin

### Backup
1. Supabase'de otomatik backup aktif (ücretsiz plan)
2. Vercel'de GitHub repo backup görevi görür

### Cost Estimation
- **Vercel**: Ücretsiz (Hobby plan) - 100GB bandwidth/yıl
- **Supabase**: Ücretsiz (Free tier) - 500MB database, 2GB bandwidth
- **Resend**: Ücretsiz - 100 email/gün
- **Domain**: ~$10-15/yıl
- **Toplam**: ~$10-15/yıl (sadece domain)

---

## 🔧 Troubleshooting

### Domain bağlanmıyor
- DNS propagation 24-48 saat sürebilir
- Cloudflare'de proxy'yi kapatıp tekrar açmayı deneyin
- `dig bursbuldum.com` komutu ile DNS kayıtlarını kontrol edin

### SSL hatası
- Vercel otomatik SSL sağlar, 5-10 dakika bekleyin
- Domain doğrulaması tamamlandığından emin olun

### Supabase bağlantı hatası
- Environment variables'ın doğru eklendiğinden emin olun
- Supabase'de RLS (Row Level Security) politikalarını kontrol edin

### Email gönderilmiyor
- Resend domain doğrulamasını kontrol edin
- DNS kayıtlarının doğru eklendiğinden emin olun
- Spam klasörünü kontrol edin

---

## 📞 Destek

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Resend Docs**: https://resend.com/docs

---

## ✅ Hızlı Başlangıç Komutları

```bash
# 1. GitHub'a push
git add .
git commit -m "Ready for production"
git push origin main

# 2. Vercel CLI ile deploy
vercel --prod

# 3. Domain kontrolü
dig bursbuldum.com
nslookup bursbuldum.com
```

---

**Tahmini Süre**: 30-60 dakika (DNS propagation hariç)

**Önerilen Sıra**:
1. Domain satın al (5 dk)
2. Vercel'e deploy et (10 dk)
3. Domain'i bağla (5 dk)
4. Supabase ayarlarını güncelle (5 dk)
5. Resend domain doğrula (10 dk)
6. Test et (10 dk)

**Toplam**: ~45 dakika aktif çalışma

