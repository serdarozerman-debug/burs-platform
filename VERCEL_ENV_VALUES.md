# 🔑 Vercel Environment Variables - Gerçek Değerler

## ✅ Supabase Proje Bilgileriniz

### 1. NEXT_PUBLIC_SUPABASE_URL
```
https://hzebnzsjuqirmkewwaol.supabase.co
```

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
Bu değeri Supabase Dashboard'dan almanız gerekiyor:
1. https://app.supabase.com → Projenizi seçin
2. Sol menüden **Settings** → **API**
3. **anon public** key'i kopyalayın

### 3. SUPABASE_SERVICE_ROLE_KEY
Bu değeri Supabase Dashboard'dan almanız gerekiyor:
1. https://app.supabase.com → Projenizi seçin
2. Sol menüden **Settings** → **API**
3. **service_role** key'i kopyalayın (⚠️ gizli tutun!)

### 4. RESEND_API_KEY
```
re_bpcvL6GX_J6XqcfKiK9RxhibuJVF6n77w
```

### 5. NEXT_PUBLIC_APP_URL
- **Production**: `https://bursbuldum.com` (domain bağlandıktan sonra)
- **Preview**: Vercel'in otomatik verdiği URL (örn: `https://burs-platform-xxx.vercel.app`)
- **Development**: `http://localhost:3000`

---

## 📋 Vercel'e Ekleme Adımları

1. **Vercel Dashboard'a gidin**: https://vercel.com/dashboard
2. **Projenizi seçin**: burs-platform
3. **Settings** → **Environment Variables**
4. Her birini tek tek ekleyin:

### ✅ NEXT_PUBLIC_SUPABASE_URL
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://hzebnzsjuqirmkewwaol.supabase.co`
- **Environment**: ✅ Production ✅ Preview ✅ Development

### ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: Supabase Dashboard'dan kopyalayın
- **Environment**: ✅ Production ✅ Preview ✅ Development

### ✅ SUPABASE_SERVICE_ROLE_KEY
- **Key**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: Supabase Dashboard'dan kopyalayın
- **Environment**: ✅ Production ✅ Preview (Development'e eklemeyin!)

### ✅ RESEND_API_KEY
- **Key**: `RESEND_API_KEY`
- **Value**: `re_bpcvL6GX_J6XqcfKiK9RxhibuJVF6n77w`
- **Environment**: ✅ Production ✅ Preview ✅ Development

### ✅ NEXT_PUBLIC_APP_URL
- **Key**: `NEXT_PUBLIC_APP_URL`
- **Value**: Production için domain URL'iniz
- **Environment**: ✅ Production ✅ Preview ✅ Development

---

## ⚠️ ÖNEMLİ: Redeploy

Environment variables eklendikten sonra:
1. **Deployments** sekmesine gidin
2. Son deployment'ın yanındaki **"..."** → **"Redeploy"**
3. **"Use existing Build Cache"** seçeneğini **KAPATIN**
4. **"Redeploy"** butonuna tıklayın

---

## 🔍 Supabase Keys'i Nereden Bulabilirsiniz?

1. https://app.supabase.com → Projenizi seçin
2. Sol menüden **Settings** → **API**
3. **Project URL**: `NEXT_PUBLIC_SUPABASE_URL` için
4. **anon public** key: `NEXT_PUBLIC_SUPABASE_ANON_KEY` için
5. **service_role** key: `SUPABASE_SERVICE_ROLE_KEY` için (⚠️ gizli!)

