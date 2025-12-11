# Admin Hesabı Oluşturma Rehberi

## Yöntem 1: Python Script ile (Önerilen)

### Gereksinimler
1. Python 3.x yüklü olmalı
2. `.env.local` dosyasında `SUPABASE_SERVICE_ROLE_KEY` tanımlı olmalı
3. Gerekli Python paketleri yüklü olmalı

### Adımlar

#### 1. Python paketlerini yükle
```bash
cd scripts
pip3 install supabase python-dotenv
```

veya tüm proje için:
```bash
pip3 install -r scripts/requirements.txt
```

#### 2. .env.local dosyasını kontrol et
Proje kök dizininde `.env.local` dosyası olmalı ve şu değişkenleri içermeli:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**SUPABASE_SERVICE_ROLE_KEY'i nereden alırım?**
1. Supabase Dashboard'a git: https://app.supabase.com
2. Projenizi seçin
3. Sol menüden **Settings** > **API** seçin
4. **service_role** key'i kopyalayın (anon key değil!)
5. `.env.local` dosyasına ekleyin

#### 3. Script'i çalıştır

**Yeni admin kullanıcı oluştur:**
```bash
python3 scripts/create_admin.py --create admin@example.com MyPassword123 "Admin Name"
```

**Mevcut kullanıcıyı admin yap:**
```bash
python3 scripts/create_admin.py --make-admin serdar.ozerman@gmail.com
```

**Tüm adminleri listele:**
```bash
python3 scripts/create_admin.py --list
```

---

## Yöntem 2: Supabase Dashboard SQL Editor ile

### Adımlar

#### 1. Supabase Dashboard'a git
https://app.supabase.com → Projenizi seçin

#### 2. SQL Editor'ü aç
Sol menüden **SQL Editor** seçin

#### 3. SQL sorgusu çalıştır

**Mevcut kullanıcıyı admin yap:**
```sql
-- Email adresini değiştirin
UPDATE user_profiles 
SET role = 'admin', is_verified = true, is_active = true
WHERE email = 'serdar.ozerman@gmail.com';
```

**Yeni admin kullanıcı oluştur (önce auth.users'a eklemeniz gerekir):**
```sql
-- 1. Önce Supabase Auth'tan kullanıcı oluşturun (Dashboard > Authentication > Add User)
-- 2. Sonra user_profiles'a admin olarak ekleyin:

-- Kullanıcı ID'sini auth.users tablosundan alın ve buraya yazın
INSERT INTO user_profiles (id, email, full_name, role, is_verified, is_active)
VALUES (
  'USER_ID_BURAYA',  -- auth.users tablosundan aldığınız ID
  'admin@example.com',
  'Admin User',
  'admin',
  true,
  true
)
ON CONFLICT (id) DO UPDATE 
SET role = 'admin', is_verified = true, is_active = true;
```

---

## Yöntem 3: Supabase Dashboard UI ile

### Adımlar

#### 1. Authentication > Users
Supabase Dashboard > **Authentication** > **Users** bölümüne gidin

#### 2. Kullanıcıyı bul veya oluştur
- Mevcut kullanıcıyı bulun veya "Add User" ile yeni kullanıcı oluşturun

#### 3. Table Editor'dan role güncelle
1. Sol menüden **Table Editor** > **user_profiles** seçin
2. Kullanıcının satırını bulun
3. **role** sütununu **admin** olarak değiştirin
4. **is_verified** ve **is_active** sütunlarını **true** yapın
5. Kaydedin

---

## Hızlı Başlangıç (En Kolay Yöntem)

### Python Script ile (1 dakika)

1. **Terminal'i açın** ve proje dizinine gidin:
```bash
cd "/Users/serdarozerman/Desktop/jobbox-react/1. JobBox-Nextjs 15 (app router)"
```

2. **.env.local dosyasını kontrol edin:**
```bash
cat .env.local | grep SUPABASE_SERVICE_ROLE_KEY
```

Eğer yoksa, Supabase Dashboard'dan alıp ekleyin.

3. **Script'i çalıştırın:**
```bash
python3 scripts/create_admin.py --make-admin serdar.ozerman@gmail.com
```

Bu komut mevcut kullanıcıyı admin yapar.

---

## Sorun Giderme

### "SUPABASE_SERVICE_ROLE_KEY bulunamadı" hatası
- `.env.local` dosyasının proje kök dizininde olduğundan emin olun
- Dosya adının tam olarak `.env.local` olduğunu kontrol edin
- Service role key'i Supabase Dashboard'dan aldığınızdan emin olun (anon key değil!)

### "Module not found" hatası
```bash
pip3 install supabase python-dotenv
```

### "Permission denied" hatası
```bash
chmod +x scripts/create_admin.py
```

### Kullanıcı bulunamadı hatası
- Önce kullanıcının kayıt olması gerekiyor
- Veya yeni admin kullanıcı oluşturun: `--create` komutunu kullanın

---

## Güvenlik Notları

⚠️ **ÖNEMLİ:**
- `SUPABASE_SERVICE_ROLE_KEY` çok güçlü bir key'dir - asla public repository'lere commit etmeyin!
- `.env.local` dosyası `.gitignore`'da olmalı
- Service role key'i sadece güvenilir ortamlarda kullanın
- Production'da admin oluşturma işlemlerini sınırlandırın

---

## Yardım

Sorun yaşarsanız:
1. Script'i `--list` ile çalıştırıp mevcut adminleri kontrol edin
2. Supabase Dashboard > Authentication > Users'dan kullanıcıyı kontrol edin
3. Supabase Dashboard > Table Editor > user_profiles'dan role'ü kontrol edin

