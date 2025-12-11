# 🔄 GitHub Environments vs Vercel Environment Variables

## ❌ GitHub "Environments" ≠ Vercel "Environment Variables"

### GitHub "Environments" (Sol menüde gördüğünüz)
- **Ne için**: GitHub Actions workflows (CI/CD)
- **Kullanım**: Otomatik testler, build işlemleri
- **Next.js için**: ❌ Kullanılmaz
- **Konum**: GitHub Repository → Settings → Environments

### Vercel "Environment Variables" (İhtiyacınız olan)
- **Ne için**: Next.js uygulamanızın çalışması
- **Kullanım**: Production deployment
- **Next.js için**: ✅ Kullanılır
- **Konum**: Vercel Dashboard → Project → Settings → Environment Variables

---

## ✅ Doğru Yol: Vercel Dashboard

### Adım 1: Vercel'e Git
1. Yeni bir sekme açın: https://vercel.com
2. GitHub hesabınızla giriş yapın
3. Dashboard'a gidin

### Adım 2: Projenizi Bulun
- Eğer proje yoksa: "Add New Project" → GitHub repo'nuzu seçin
- Eğer proje varsa: Projenize tıklayın

### Adım 3: Environment Variables Ekle
1. Üst menüden **"Settings"** sekmesine tıklayın
2. Sol menüden **"Environment Variables"** seçin
3. "Add New" butonuna tıklayın
4. Değişkenleri ekleyin

---

## 📋 Eklenmesi Gerekenler

```
1. NEXT_PUBLIC_SUPABASE_URL
2. NEXT_PUBLIC_SUPABASE_ANON_KEY
3. SUPABASE_SERVICE_ROLE_KEY
4. RESEND_API_KEY
5. NEXT_PUBLIC_APP_URL
```

---

## 🎯 Hızlı Link

**Vercel Dashboard**: https://vercel.com/dashboard

**Not**: GitHub'daki "Environments" sekmesine dokunmayın, Vercel'e gidin!

