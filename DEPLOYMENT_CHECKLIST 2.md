# 🚀 BursBuldum Production Deployment Checklist

## Ön Hazırlık

### 1. Kod Hazırlığı
- [ ] Tüm değişiklikler commit edildi
- [ ] `.env.local` dosyası `.gitignore`'da
- [ ] `package.json` güncel
- [ ] Build hatası yok (`npm run build`)

### 2. Environment Variables Listesi
Şu değişkenleri hazırlayın:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `RESEND_API_KEY`
- [ ] `NEXT_PUBLIC_APP_URL` (production URL)

---

## Domain Satın Alma

- [ ] Domain seçildi (örn: bursbuldum.com)
- [ ] Domain satın alındı
- [ ] DNS yönetim paneline erişim var

---

## Vercel Deployment

### GitHub Setup
- [ ] GitHub repository oluşturuldu
- [ ] Kod push edildi
- [ ] Repository public veya Vercel'e erişim verildi

### Vercel Setup
- [ ] Vercel hesabı oluşturuldu
- [ ] GitHub repository bağlandı
- [ ] Project oluşturuldu
- [ ] Environment variables eklendi
- [ ] İlk deployment başarılı

### Domain Bağlama
- [ ] Domain Vercel'e eklendi
- [ ] DNS kayıtları yapıldı
- [ ] DNS propagation tamamlandı (24-48 saat)
- [ ] SSL sertifikası aktif

---

## Supabase Ayarları

- [ ] Site URL güncellendi: `https://bursbuldum.com`
- [ ] Redirect URLs eklendi:
  - [ ] `https://bursbuldum.com/auth/callback`
  - [ ] `https://bursbuldum.com/**`
- [ ] Google OAuth redirect URI kontrol edildi
- [ ] RLS (Row Level Security) politikaları kontrol edildi

---

## Resend Email Ayarları

- [ ] Resend hesabı oluşturuldu
- [ ] Domain eklendi (bursbuldum.com)
- [ ] DNS kayıtları eklendi:
  - [ ] TXT kaydı (@)
  - [ ] CNAME kaydı (resend._domainkey)
- [ ] Domain doğrulandı
- [ ] Email gönderim adresi güncellendi: `noreply@bursbuldum.com`

---

## Test Checklist

### Genel Testler
- [ ] Site açılıyor: https://bursbuldum.com
- [ ] HTTPS çalışıyor (SSL aktif)
- [ ] www.bursbuldum.com çalışıyor
- [ ] Sayfa yüklenme hızı kabul edilebilir

### Fonksiyonel Testler
- [ ] Ana sayfa yükleniyor
- [ ] Burs listesi görünüyor
- [ ] Filtreler çalışıyor
- [ ] Arama çalışıyor
- [ ] Burs detay sayfası açılıyor

### Authentication Testleri
- [ ] Kayıt ol formu çalışıyor
- [ ] Email/password kayıt çalışıyor
- [ ] Google OAuth çalışıyor
- [ ] Login çalışıyor
- [ ] Logout çalışıyor
- [ ] Email doğrulama çalışıyor

### Email Testleri
- [ ] Kayıt sonrası hoş geldiniz email'i geliyor
- [ ] Email'ler spam'a düşmüyor
- [ ] Email template'i doğru görünüyor

### Admin Testleri
- [ ] Admin dashboard erişilebilir
- [ ] Admin login çalışıyor
- [ ] İstatistikler görünüyor
- [ ] Blog yönetimi çalışıyor
- [ ] Ana sayfa içerik yönetimi çalışıyor
- [ ] Footer yönetimi çalışıyor

### API Testleri
- [ ] `/api/scholarships` çalışıyor
- [ ] `/api/admin/stats` çalışıyor
- [ ] `/api/send-welcome-email` çalışıyor

---

## Performance Optimizasyonu

- [ ] Vercel Analytics aktif
- [ ] Image optimization çalışıyor
- [ ] Lazy loading aktif
- [ ] CDN cache çalışıyor

---

## Güvenlik Kontrolleri

- [ ] Environment variables güvenli (Vercel'de)
- [ ] `.env.local` commit edilmedi
- [ ] API keys production'da doğru
- [ ] CORS ayarları kontrol edildi
- [ ] Supabase RLS politikaları aktif

---

## Monitoring Setup

- [ ] Vercel Analytics aktif
- [ ] Error tracking (opsiyonel: Sentry)
- [ ] Supabase monitoring aktif

---

## Backup

- [ ] Supabase backup aktif
- [ ] GitHub repository backup görevi görüyor
- [ ] Database backup stratejisi belirlendi

---

## Dokümantasyon

- [ ] README.md güncellendi
- [ ] Environment variables dokümante edildi
- [ ] Deployment rehberi hazır

---

## Son Adımlar

- [ ] Tüm testler geçti
- [ ] Production URL paylaşıldı
- [ ] Team members bilgilendirildi
- [ ] Monitoring aktif

---

**Deployment Tarihi**: _______________
**Deployed By**: _______________
**Production URL**: https://bursbuldum.com

