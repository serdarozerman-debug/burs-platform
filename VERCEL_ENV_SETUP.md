# Vercel Environment Variables Kurulum Rehberi

## 🔐 Güvenlik Uyarısı
**ÖNEMLİ**: `.env.local` dosyasını asla GitHub'a commit etmeyin! Bu dosya `.gitignore`'da olmalı.

## 📋 Vercel'e Environment Variables Ekleme

### Adım 1: Vercel Dashboard'a Giriş
1. https://vercel.com adresine gidin
2. Projenizi seçin (burs-platform)
3. **Settings** sekmesine tıklayın
4. Sol menüden **Environment Variables** seçin

### Adım 2: Environment Variables Ekleme

Aşağıdaki değişkenleri tek tek ekleyin:

#### 1. Supabase URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project.supabase.co
Environment: Production, Preview, Development (hepsini seçin)
```

#### 2. Supabase Anon Key
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: your-anon-key-here
Environment: Production, Preview, Development (hepsini seçin)
```

#### 3. Supabase Service Role Key
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: your-service-role-key-here
Environment: Production, Preview (Development'e eklemeyin - güvenlik için)
```

#### 4. Resend API Key
```
Name: RESEND_API_KEY
Value: re_bpcvL6GX_J6XqcfKiK9RxhibuJVF6n77w
Environment: Production, Preview, Development (hepsini seçin)
```

#### 5. Application URL
```
Name: NEXT_PUBLIC_APP_URL
Value: https://bursbuldum.com (production için)
Environment: Production

Name: NEXT_PUBLIC_APP_URL
Value: https://your-project.vercel.app (preview için)
Environment: Preview

Name: NEXT_PUBLIC_APP_URL
Value: http://localhost:3000 (development için)
Environment: Development
```

### Adım 3: Değerleri Nereden Bulabilirsiniz?

#### Supabase Değerleri:
1. Supabase Dashboard > Project Settings > API
2. **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ gizli tutun!)

#### Resend API Key:
- Resend Dashboard > API Keys
- Mevcut key: `re_bpcvL6GX_J6XqcfKiK9RxhibuJVF6n77w`

### Adım 4: Environment Variables Eklendikten Sonra

1. **Redeploy** yapın:
   - Vercel Dashboard > Deployments
   - En son deployment'ın yanındaki "..." menüsünden "Redeploy" seçin
   - "Use existing Build Cache" seçeneğini kapatın

2. **Test edin**:
   - Site açılıyor mu?
   - Supabase bağlantısı çalışıyor mu?
   - Login/Register çalışıyor mu?

## 🔍 Kontrol Listesi

- [ ] Tüm environment variables eklendi
- [ ] Her değişken için doğru environment seçildi
- [ ] Değerler doğru kopyalandı (boşluk yok)
- [ ] Redeploy yapıldı
- [ ] Site test edildi

## ⚠️ Yaygın Hatalar

1. **Boşluk karakterleri**: Değerleri kopyalarken başta/sonda boşluk olmamalı
2. **Yanlış environment**: Production için Production seçilmeli
3. **Redeploy unutmak**: Environment variables eklendikten sonra mutlaka redeploy yapın
4. **Service Role Key'i public yapmak**: `SUPABASE_SERVICE_ROLE_KEY` sadece server-side kullanılmalı

## 📝 Notlar

- Environment variables değiştirildikten sonra **otomatik redeploy olmaz**
- Manuel olarak redeploy yapmanız gerekir
- Preview ve Development environment'ları için farklı değerler kullanabilirsiniz

