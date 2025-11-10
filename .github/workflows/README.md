# 🤖 OTOMATIK SCRAPING SİSTEMİ

**Durum:** ✅ AKTIF  
**Platform:** GitHub Actions  
**Maliyet:** Ücretsiz (public repo)

---

## 📋 ÇALIŞAN İŞLER

### 1. 🔍 **Yeni Kurum Keşfi** (discover-organizations.yml)

**Ne Yapar:**
- Yeni burs veren kurumları araştırır
- `organizations.json` dosyasını günceller
- Otomatik commit ve push yapar

**Çalışma Takvimi:**
```
📅 Her 15 günde bir
⏰ Ayın 1. ve 15. günü, saat 03:00 UTC (06:00 TR)
⏱️ Tahmini süre: 30-60 dakika
```

**Manuel Çalıştırma:**
```
GitHub → Actions → "Discover New Organizations" → Run workflow
```

---

### 2. 🎓 **Burs Scraping** (scrape-scholarships.yml)

**Ne Yapar:**
- Mevcut kurumlardan burs verilerini çeker
- Supabase'e otomatik yükler
- Duplicate kontrolü yapar
- Scraping raporu oluşturur

**Çalışma Takvimi:**
```
📅 Her 5 günde bir (ayda 6 kez)
⏰ Ayın 1, 6, 11, 16, 21, 26. günleri, saat 02:00 UTC (05:00 TR)
⏱️ Tahmini süre: 60-90 dakika
```

**Scraper Seçenekleri:**
- `non-universities`: Sadece vakıflar ve kurumlar (önerilen)
- `all`: Tüm organizasyonlar (üniversiteler dahil)
- `advanced`: AI-powered scraper (OpenAI gerekli)

**Manuel Çalıştırma:**
```
GitHub → Actions → "Scrape Scholarships" → Run workflow
Parameters:
  - Scraper type: non-universities/all/advanced
  - Limit: 50 (varsayılan)
```

---

## 🔧 KURULUM

### 1. GitHub Secrets Ekle

**Repository → Settings → Secrets and variables → Actions**

Şu secrets'ları ekleyin:

```
SUPABASE_URL=https://hzebnzsjuqirmkewwaol.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
OPENAI_API_KEY=sk-... (opsiyonel, advanced scraper için)
```

### 2. Actions'ı Aktifleştir

**Repository → Actions → Enable Actions**

```
✅ I understand my workflows, go ahead and enable them
```

### 3. İlk Çalıştırmayı Test Et

**Actions → "Scrape Scholarships" → Run workflow**

```
Scraper type: non-universities
Limit: 10
```

---

## 📊 TAKVİM ÖZETİ

### Aylık Schedule (Örnek: Kasım 2024)

```
Kasım 1:  🔍 Organization Discovery + 🎓 Scholarship Scraping
Kasım 6:                             🎓 Scholarship Scraping
Kasım 11:                            🎓 Scholarship Scraping
Kasım 15: 🔍 Organization Discovery
Kasım 16:                            🎓 Scholarship Scraping
Kasım 21:                            🎓 Scholarship Scraping
Kasım 26:                            🎓 Scholarship Scraping
```

**Toplam:**
- Organization Discovery: 2 kez/ay
- Scholarship Scraping: 6 kez/ay

---

## 📈 BEKLENEN SONUÇLAR

### Organization Discovery:
```
Her çalıştırmada:
  - 5-20 yeni kurum bulunabilir
  - organizations.json güncellenir
  - Otomatik commit yapılır
```

### Scholarship Scraping:
```
Her çalıştırmada:
  - 50-200 burs çekilir
  - Yeni burslar eklenir
  - Eski burslar güncellenir
  - Deadline geçenler is_active=false yapılır
  - Duplicate'ler temizlenir
```

---

## 🔍 İZLEME

### Logs Görüntüleme

**GitHub → Actions → İlgili workflow → Run details**

```
✅ Her step'in logları
✅ Hata mesajları
✅ Scraping raporu (artifact olarak)
```

### Email Bildirimleri

**GitHub Settings → Notifications**

```
✅ Actions: Workflow run failures
✅ Email'e bildirim al
```

---

## ⚙️ YAPITLANDIRMA

### Cron Syntax Değiştirme

**discover-organizations.yml:**
```yaml
schedule:
  # Her hafta Pazartesi sabah 9
  - cron: '0 9 * * 1'
  
  # Her gün gece yarısı
  - cron: '0 0 * * *'
  
  # Her ayın ilk günü
  - cron: '0 0 1 * *'
```

**scrape-scholarships.yml:**
```yaml
schedule:
  # Her gün saat 2'de
  - cron: '0 2 * * *'
  
  # Haftada 2 kez (Pazartesi ve Perşembe)
  - cron: '0 2 * * 1,4'
```

**Cron Helper:** https://crontab.guru/

---

## 🐛 SORUN ÇÖZÜM

### Issue: "Secrets not found"
**Çözüm:** GitHub Secrets'ları kontrol et

### Issue: "Timeout"
**Çözüm:** `timeout-minutes` artır (120 → 180)

### Issue: "Permission denied"
**Çözüm:** Workflow permissions'ı kontrol et

### Issue: "Python module not found"
**Çözüm:** requirements.txt'i kontrol et

---

## 📊 PERFORMANS

### Resource Usage (GitHub Actions):
```
Free tier limits:
  - 2,000 dakika/ay (public repo için SINIRSIZ!)
  - Paralel jobs: 20
  - Storage: 500 MB artifacts
```

### Estimated Usage:
```
Organization Discovery: ~60 dk x 2 = 120 dk/ay
Scholarship Scraping:   ~90 dk x 6 = 540 dk/ay
---------------------------------------------
TOPLAM:                          ~660 dk/ay

✅ Public repo ise SINIRSIZ!
⚠️ Private repo ise free tier aşılır
```

---

## 🚀 PRODUCTION BEST PRACTICES

### 1. Error Handling
```python
# Scraper'lara try-catch ekle
# Supabase connection retry
# Rate limiting
```

### 2. Monitoring
```
- Sentry integration
- Email alerts on failure
- Slack notifications
```

### 3. Data Quality
```
- Duplicate detection
- Data validation
- Orphaned data cleanup
```

### 4. Scalability
```
- Parallel scraping
- Database indexing
- Caching strategy
```

---

## 📝 KULLANIM

### Manuel Tetikleme

**Actions → Workflow seç → Run workflow**

Parametreler:
- Organization discovery: Parametre yok
- Scholarship scraping: 
  - `limit`: 10-200
  - `scraper_type`: non-universities/all/advanced

### Workflow Disable

```yaml
# Geçici olarak devre dışı bırakmak için:
on:
  # schedule:
  #   - cron: '0 3 1,15 * *'
  workflow_dispatch:  # Sadece manuel
```

### Logs İndirme

```
Actions → Run → Artifacts → scraping-report-XXX.txt
```

---

## 🎯 BAŞARILAR

✅ Tamamen otomatik sistem  
✅ Düzenli veri güncellemesi  
✅ Yeni kurum keşfi  
✅ Manuel override mümkün  
✅ Ücretsiz (public repo)  
✅ Scalable  
✅ Monitörlenebilir  

---

**Kurulum tamamlandığında GitHub Secrets'ları eklemeyi unutmayın!**

🚀 **HAPPY AUTOMATING!**

