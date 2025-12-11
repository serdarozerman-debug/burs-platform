# 🔧 Vercel Deployment Hatalarını Düzeltme

## ⚠️ Durum: Çoğu Deployment "Error" Durumunda

Görüntülerde birçok deployment "Error" durumunda. Bu genellikle **eksik Environment Variables**'dan kaynaklanır.

---

## ✅ Çözüm: Environment Variables Ekleme

### Adım 1: Settings Sekmesine Gidin

**Şu anda**: "Deployments" sekmesindesiniz
**Gitmeniz gereken**: "Settings" sekmesi

1. Üst menüdeki **"Settings"** sekmesine tıklayın
2. Sol menüden **"Environment Variables"** seçin

### Adım 2: Environment Variables Ekleyin

Aşağıdaki 5 değişkeni tek tek ekleyin:

#### 1️⃣ NEXT_PUBLIC_SUPABASE_URL
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://hzebnzsjuqirmkewwaol.supabase.co
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 2️⃣ NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [Supabase Dashboard'dan kopyalayın]
Environment: ✅ Production ✅ Preview ✅ Development
```

**Nereden bulunur:**
- https://app.supabase.com → Projenizi seçin
- Settings → API → "anon public" key

#### 3️⃣ SUPABASE_SERVICE_ROLE_KEY
```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: [Supabase Dashboard'dan kopyalayın]
Environment: ✅ Production ✅ Preview (Development'e eklemeyin!)
```

**Nereden bulunur:**
- https://app.supabase.com → Projenizi seçin
- Settings → API → "service_role" key

#### 4️⃣ RESEND_API_KEY
```
Key: RESEND_API_KEY
Value: re_bpcvL6GX_J6XqcfKiK9RxhibuJVF6n77w
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 5️⃣ NEXT_PUBLIC_APP_URL
```
Key: NEXT_PUBLIC_APP_URL
Value: https://burs-platform-xxx.vercel.app (Vercel'in verdiği URL)
Environment: ✅ Production ✅ Preview ✅ Development
```

**Not**: Vercel'in otomatik verdiği URL'i kullanabilirsiniz veya domain bağladıktan sonra domain URL'inizi kullanın.

---

### Adım 3: Her Değişkeni Ekleme Adımları

Her değişken için:
1. **"Add New"** butonuna tıklayın
2. **Key** alanına değişken adını yazın
3. **Value** alanına değeri yazın
4. **Environment** seçeneklerini işaretleyin
5. **"Save"** butonuna tıklayın

---

### Adım 4: Redeploy Yapın

Environment variables eklendikten sonra:

1. **"Deployments"** sekmesine geri dönün
2. En son deployment'ın yanındaki **"..."** (üç nokta) menüsüne tıklayın
3. **"Redeploy"** seçin
4. **"Use existing Build Cache"** seçeneğini **KAPATIN** (önemli!)
5. **"Redeploy"** butonuna tıklayın

---

## 🔍 Hata Loglarını Kontrol Etme

Eğer hala hata alıyorsanız:

1. Hatalı deployment'a tıklayın
2. **"Logs"** sekmesine gidin
3. Hata mesajını okuyun
4. Hata mesajını bana gönderin, yardımcı olabilirim

---

## ✅ Kontrol Listesi

- [ ] Settings sekmesine gittiniz mi?
- [ ] Environment Variables sekmesine gittiniz mi?
- [ ] 5 environment variable eklendi mi?
- [ ] Her değişken için doğru environment seçildi mi?
- [ ] Değerler doğru mu? (boşluk yok mu?)
- [ ] Redeploy yaptınız mı?
- [ ] Build cache'i kapattınız mı?

---

## 🎯 Hızlı Navigasyon

**Şu anda**: Deployments sayfasındasınız
**Gitmeniz gereken**: Settings → Environment Variables

**Yol:**
1. Üst menüden **"Settings"** tıklayın
2. Sol menüden **"Environment Variables"** seçin
3. **"Add New"** butonuna tıklayın
4. Değişkenleri ekleyin

---

## 📝 Notlar

- Environment variables eklendikten sonra **otomatik deploy olmaz**
- Mutlaka **manuel redeploy** yapmalısınız
- **Build cache'i kapatmayı unutmayın** - bu çok önemli!

