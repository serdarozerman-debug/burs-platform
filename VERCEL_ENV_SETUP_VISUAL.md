# 🚀 Vercel Environment Variables Ekleme - Görsel Rehber

## ⚠️ ÖNEMLİ: GitHub Değil, Vercel!

**GitHub Environments** = GitHub Actions için (CI/CD)
**Vercel Environment Variables** = Next.js uygulamanız için (Production)

Sizin ihtiyacınız **Vercel Dashboard**'da environment variables eklemek!

---

## 📋 Adım Adım: Vercel Dashboard'da Environment Variables Ekleme

### 1. Vercel'e Giriş Yapın
1. https://vercel.com adresine gidin
2. GitHub hesabınızla giriş yapın
3. Dashboard'a gidin

### 2. Projenizi Seçin
1. Ana sayfada projeleriniz listelenir
2. **burs-platform** projesine tıklayın
3. Veya: https://vercel.com/dashboard → Projenizi seçin

### 3. Settings Sekmesine Gidin
1. Proje sayfasında üst menüden **"Settings"** sekmesine tıklayın
2. Sol menüden **"Environment Variables"** seçin

### 4. Environment Variable Ekleme

Her bir değişken için:

1. **"Add New"** butonuna tıklayın
2. **Key** alanına değişken adını yazın (örn: `NEXT_PUBLIC_SUPABASE_URL`)
3. **Value** alanına değeri yazın (örn: `https://your-project.supabase.co`)
4. **Environment** seçeneklerini işaretleyin:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development (opsiyonel)
5. **"Save"** butonuna tıklayın

### 5. Eklenmesi Gereken Environment Variables

Aşağıdaki değişkenleri tek tek ekleyin:

#### ✅ 1. NEXT_PUBLIC_SUPABASE_URL
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project.supabase.co
Environment: ✅ Production ✅ Preview ✅ Development
```

#### ✅ 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (anon key)
Environment: ✅ Production ✅ Preview ✅ Development
```

#### ✅ 3. SUPABASE_SERVICE_ROLE_KEY
```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (service_role key)
Environment: ✅ Production ✅ Preview (Development'e eklemeyin!)
```

#### ✅ 4. RESEND_API_KEY
```
Key: RESEND_API_KEY
Value: re_bpcvL6GX_J6XqcfKiK9RxhibuJVF6n77w
Environment: ✅ Production ✅ Preview ✅ Development
```

#### ✅ 5. NEXT_PUBLIC_APP_URL
```
Key: NEXT_PUBLIC_APP_URL
Value: https://bursbuldum.com (veya Vercel'in verdiği URL)
Environment: ✅ Production ✅ Preview ✅ Development
```

---

## 🔍 Değerleri Nereden Bulabilirsiniz?

### Supabase Değerleri:
1. https://app.supabase.com → Projenizi seçin
2. Sol menüden **"Settings"** → **"API"** tıklayın
3. **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
4. **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ gizli!)

### Resend API Key:
- Mevcut key: `re_bpcvL6GX_J6XqcfKiK9RxhibuJVF6n77w`
- Veya: https://resend.com/api-keys

### Application URL:
- Production: `https://bursbuldum.com` (domain bağlandıktan sonra)
- Preview: `https://burs-platform-xxx.vercel.app` (Vercel'in otomatik verdiği)
- Development: `http://localhost:3000`

---

## ⚠️ ÖNEMLİ: Environment Variables Eklendikten Sonra

### Redeploy Yapmalısınız!

Environment variables eklendikten sonra **otomatik deploy olmaz**. Manuel redeploy yapmalısınız:

1. Vercel Dashboard > **"Deployments"** sekmesine gidin
2. En son deployment'ı bulun
3. Sağ taraftaki **"..."** (üç nokta) menüsüne tıklayın
4. **"Redeploy"** seçin
5. **"Use existing Build Cache"** seçeneğini **KAPATIN** (önemli!)
6. **"Redeploy"** butonuna tıklayın

---

## ✅ Kontrol Listesi

- [ ] Tüm 5 environment variable eklendi
- [ ] Her değişken için doğru environment seçildi
- [ ] Değerler doğru kopyalandı (boşluk yok)
- [ ] Redeploy yapıldı
- [ ] Site test edildi

---

## 🎯 Hızlı Erişim Linkleri

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://app.supabase.com
- **Resend Dashboard**: https://resend.com

---

## 📸 Ekran Görüntüsü Yerleşimi

Vercel Dashboard'da:
```
Project Name (burs-platform)
├── Overview
├── Deployments
├── Analytics
├── Settings ⬅️ BURAYA TIKLAYIN
│   ├── General
│   ├── Environment Variables ⬅️ BURAYA TIKLAYIN
│   ├── Domains
│   └── ...
```

---

## ❓ Sorun Giderme

### Environment variable görünmüyor?
- Redeploy yaptınız mı? (Yapmalısınız!)
- Doğru environment seçtiniz mi? (Production, Preview, Development)
- Değer doğru mu? (Boşluk karakteri var mı kontrol edin)

### Site hala çalışmıyor?
- Browser console'u kontrol edin (F12)
- Vercel deployment logs'u kontrol edin
- Environment variables'ın gerçekten eklendiğini doğrulayın

---

**Not**: GitHub Environments, GitHub Actions için kullanılır. Next.js uygulamanız için Vercel Dashboard kullanmalısınız!

