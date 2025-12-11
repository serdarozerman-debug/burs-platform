# Test Rehberi

## Python Script'i Nasıl Çalıştırılır?

### Terminal'de Çalıştırma (Mac/Linux)

1. **Terminal'i açın** (Applications > Utilities > Terminal veya Cmd+Space ile "Terminal" yazın)

2. **Proje dizinine gidin:**
```bash
cd "/Users/serdarozerman/Desktop/jobbox-react/1. JobBox-Nextjs 15 (app router)"
```

3. **Script'i çalıştırın:**

**API Session Testi:**
```bash
python3 scripts/test_login.py --api-test
```

**Login Testi (email ve şifre ile):**
```bash
python3 scripts/test_login.py serdar@siemoapp.com yourpassword
```

### Windows'ta Çalıştırma

1. **Command Prompt veya PowerShell açın**

2. **Proje dizinine gidin:**
```cmd
cd "C:\Users\YourName\Desktop\jobbox-react\1. JobBox-Nextjs 15 (app router)"
```

3. **Script'i çalıştırın:**
```cmd
python scripts\test_login.py --api-test
```

### Gerekli Python Paketleri

Eğer hata alırsanız, şu paketleri yükleyin:
```bash
pip3 install supabase python-dotenv requests
```

## Debug Endpoint Kullanımı

### Browser'da Test

1. Development server'ın çalıştığından emin olun:
```bash
npm run dev
```

2. Browser'da şu URL'yi açın:
```
http://localhost:3000/api/debug/session
```

3. JSON çıktısını kontrol edin:
- `session: null` → Cookie'ler okunamıyor (sorun var)
- `session: {...}` → Session var (çalışıyor)

## Sorun Giderme

### "Module not found" hatası
```bash
pip3 install supabase python-dotenv requests
```

### "Connection refused" hatası
- Development server çalışıyor mu kontrol edin: `npm run dev`
- Port 3000 kullanımda mı kontrol edin

### Session null görünüyor
- Login yaptıktan sonra debug endpoint'i kontrol edin
- Browser cookie'lerini kontrol edin (F12 > Application > Cookies)
- `sb-` ile başlayan cookie'ler var mı?

