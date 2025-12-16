# Railway ile BursBuldum Deployment

## Neden Railway?
- ✅ Vercel'den daha basit
- ✅ Aylık $5 ücretsiz kredi
- ✅ Cloudflare domain kolay entegre
- ✅ Supabase ile mükemmel çalışır

## Adım 1: Railway'e Kaydol
1. https://railway.app/ → "Start a New Project"
2. GitHub ile giriş yap
3. Repo'yu seç: `serdarozerman-debug/burs-platform`

## Adım 2: Environment Variables Ekle
Railway Dashboard → Variables sekmesi:

```env
NEXT_PUBLIC_SUPABASE_URL=https://aivvlkoyybzpcgqchlcp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=https://your-railway-domain.railway.app
OPENAI_API_KEY=sk-proj-...
RESEND_API_KEY=re_bpcvL6GX_J6XqcfKiK9RxhibuJVF6n77w
```

## Adım 3: Deploy
- Railway otomatik olarak deploy eder (2-3 dakika)
- Deploy tamamlandıktan sonra URL verir

## Adım 4: Cloudflare Domain Bağlama
1. Railway → Settings → Domains
2. "Add Custom Domain" → `bursbuldum.com`
3. Cloudflare'de:
   - DNS → Add Record
   - Type: `CNAME`
   - Name: `@` (veya `www`)
   - Target: Railway'in verdiği domain

## Adım 5: Supabase Callback URL'i Güncelle
Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `https://bursbuldum.com`
- Redirect URLs:
  ```
  https://bursbuldum.com/auth/callback
  https://bursbuldum.com
  ```

---

## Railway vs Vercel

| Özellik | Railway | Vercel |
|---------|---------|--------|
| Ücretsiz Plan | $5/ay kredi | 100GB bandwidth |
| Kurulum | Çok basit | Basit |
| Custom Domain | ✅ Kolay | ✅ Kolay |
| Edge Functions | ❌ | ✅ |
| PostgreSQL | ✅ Built-in | ❌ (3rd party) |
| Build Süresi | 2-3 dk | 1-2 dk |

---

## Alternatif: Netlify
1. https://netlify.com → "Add new site"
2. GitHub repo seç
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Environment variables ekle
5. Deploy!

Netlify de Vercel'e çok benzer şekilde çalışır.

