# 🤖 SCRAPER ÇALIŞTIRMA REHBERİ

**Tarih:** 10 Kasım 2024, 15:05  
**Amaç:** Gerçek burs verilerini Supabase'e yükle

---

## 📋 HAZIRLIK (1 dakika)

### 1. Python Dependencies Kontrol

```bash
cd "/Users/serdarozerman/Desktop/jobbox-react/1. JobBox-Nextjs 15 (app router)/scripts"

# Python version check
python3 --version

# Requirements kontrol
cat requirements.txt
```

**Gerekli Paketler:**
```
requests
beautifulsoup4
supabase
python-dotenv
openai
```

### 2. Dependencies Kur (Gerekirse)

```bash
pip3 install -r requirements.txt
```

---

## 🚀 SCRAPER SEÇENEKLERİ

### Seçenek 1: Vakıf ve Kurumlar (Önerilen) ⭐

**En iyi başlangıç:**
```bash
python3 scrape_non_universities.py
```

**Ne yapar:**
- ✅ Vakıfların burslarını çeker
- ✅ Özel kurumların burslarını çeker
- ❌ Üniversite burslarını atlar
- ⏱️ Süre: ~10-20 dakika
- 📊 Sonuç: ~50-100 burs

**Scrape edilen kaynaklar:**
- Vehbi Koç Vakfı
- İstanbul Büyükşehir Belediyesi
- TÜBİTAK
- TEV (Türk Eğitim Vakfı)
- Sabancı Vakfı
- Darüşşafaka
- +40 daha fazla kurum

---

### Seçenek 2: Tüm Organizasyonlar

**Daha kapsamlı:**
```bash
python3 scrape_all_organizations.py
```

**Ne yapar:**
- ✅ Tüm vakıfları scrape eder
- ✅ Tüm üniversiteleri scrape eder
- ⏱️ Süre: ~30-60 dakika
- 📊 Sonuç: ~200-300 burs

---

### Seçenek 3: Advanced Scraper (AI-Powered)

**En akıllı ama OpenAI key gerekir:**
```bash
python3 advanced_scraper.py
```

**Ne yapar:**
- ✅ GPT-4o-mini ile akıllı parsing
- ✅ Otomatik veri normalizasyonu
- ✅ Favicon otomatik bulma
- ⚠️ OpenAI API key gerekli
- ⏱️ Süre: ~20-40 dakika
- 📊 Sonuç: ~100-150 burs (yüksek kalite)

---

## ⚡ HIZLI BAŞLANGIÇ

### Adım 1: Terminal Aç

```bash
cd "/Users/serdarozerman/Desktop/jobbox-react/1. JobBox-Nextjs 15 (app router)/scripts"
```

### Adım 2: Scraper'ı Çalıştır

**Basit ve hızlı (önerilen):**
```bash
python3 scrape_non_universities.py
```

### Adım 3: İzle

Terminal'de göreceksiniz:
```
🚀 Starting scraper...
🔍 Organization: Vehbi Koç Vakfı
  ✅ Found 3 scholarships
🔍 Organization: İBB
  ✅ Found 5 scholarships
...
✅ Scraping completed!
📊 Total: 85 scholarships added
```

### Adım 4: Doğrula

**Supabase'de kontrol et:**
```
Table Editor → scholarships
→ 50+ burs görmelisin!
```

**Browser'da kontrol et:**
```
http://localhost:3000
→ F5 (yenile)
→ Bursları gör! 🎉
```

---

## 🔧 SORUN ÇÖZÜM

### Hata: "Module not found"

```bash
pip3 install requests beautifulsoup4 supabase python-dotenv openai
```

### Hata: "Supabase credentials not found"

**.env.local kontrol et:**
```bash
cd ..
cat .env.local | grep SUPABASE
```

Şunlar olmalı:
```
NEXT_PUBLIC_SUPABASE_URL=https://hzebnzsjuqirmkewwaol.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Hata: "OpenAI API key required"

**Sadece advanced_scraper.py için gerekli!**

Çözüm 1: OpenAI key ekle (.env.local)
```
OPENAI_API_KEY=sk-...
```

Çözüm 2: Başka scraper kullan
```bash
python3 scrape_non_universities.py  # OpenAI gerektirmez
```

### Hata: "Connection timeout"

**İnternet bağlantısı gerekli!**

Kontrol:
```bash
curl -I https://www.google.com
```

---

## 📊 SCRAPER KARŞILAŞTIRMASI

| Scraper | Hız | Kalite | OpenAI | Burs Sayısı | Önerilen |
|---------|-----|--------|--------|-------------|----------|
| scrape_non_universities.py | ⚡⚡⚡ | ⭐⭐⭐ | ❌ | 50-100 | ✅ Başlangıç için |
| scrape_all_organizations.py | ⚡⚡ | ⭐⭐⭐ | ❌ | 200-300 | ✅ Daha fazla veri |
| advanced_scraper.py | ⚡⚡ | ⭐⭐⭐⭐⭐ | ✅ | 100-150 | ⭐ En kaliteli |

---

## 🎯 ÖNERİ

**İlk çalıştırma için:**
```bash
python3 scrape_non_universities.py
```

**Neden:**
- ✅ Hızlı (10-20 dk)
- ✅ OpenAI key gerektirmez
- ✅ Yeterli veri (50-100 burs)
- ✅ Kaliteli kurumlar (Vakıflar, TEV, İBB, vb.)

**Sonra:**
- Daha fazla veri istersen: `scrape_all_organizations.py`
- OpenAI key'in varsa: `advanced_scraper.py`

---

## 📝 NOTLAR

### Scraper Davranışı:
- ✅ Duplicate kontrolü yapar (aynı burs 2 kez eklenmez)
- ✅ İnaktif bursları günceller
- ✅ Yeni bursları ekler
- ✅ Mevcut bursları günceller

### Veri Kalitesi:
- ✅ Organizasyon adı
- ✅ Burs tutarı
- ✅ Son başvuru tarihi
- ✅ Eğitim seviyesi
- ✅ Burs türü
- ⚠️ Bazı veriler eksik olabilir (web sitesine bağlı)

### Performance:
- İnternet hızına bağlı
- Her organizasyon ~2-5 saniye
- Toplam ~10-60 dakika (scraper'a göre)

---

## ✅ BAŞARIYLA TAMAMLANDIĞINDA

### Supabase'de göreceksiniz:
```
scholarships tablosu → 50-300 burs
Her satırda:
  - title: Burs adı
  - organization: Kurum adı
  - amount: Tutar
  - deadline: Son tarih
  - education_level: Eğitim seviyesi
  - is_active: true
```

### Homepage'de göreceksiniz:
```
✅ Gerçek burslar listeleniyor
✅ Filtreler çalışıyor
✅ Arama çalışıyor
✅ Sayfalama çalışıyor
```

---

## 🚀 HEMEN BAŞLA!

```bash
cd "/Users/serdarozerman/Desktop/jobbox-react/1. JobBox-Nextjs 15 (app router)/scripts"
python3 scrape_non_universities.py
```

**Terminal'i açık bırak ve ilerlemesini izle!**

---

**İyi Scraping!** 🤖✨

