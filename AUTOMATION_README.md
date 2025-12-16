# 🤖 BursBuldum Otomatik Scraping Sistemi

## 📋 Genel Bakış

Bu sistem **her hafta otomatik olarak**:
1. Yeni burs veren kurumları araştırır
2. Tüm kurumlardan bursları scrape eder
3. Deep link, favicon, amount kontrolü yapar
4. Database'e otomatik ekler
5. Railway'e deploy eder
6. Test ve validasyon yapar
7. Hata varsa tekrar dener

---

## 🏗️ Sistem Mimarisi

```
┌─────────────────────────────────────────────┐
│   GitHub Actions (Haftalık Cron - Pazartesi 09:00 UTC)   │
└─────────────────┬───────────────────────────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
    ▼                           ▼
┌─────────┐               ┌──────────┐
│ 1. AI   │               │ 2. Scraper│
│Research │───────────────▶│ Run       │
└─────────┘               └─────┬────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
              ┌──────────┐ ┌─────────┐ ┌─────────┐
              │3. Validate│ │4. Favicon│ │5. Report│
              └─────┬────┘ └────┬────┘ └────┬────┘
                    │           │           │
                    └───────────┼───────────┘
                                ▼
                        ┌───────────────┐
                        │ 6. Railway    │
                        │    Deploy     │
                        └───────────────┘
```

---

## 📁 Dosya Yapısı

### GitHub Actions
```
.github/workflows/
  └── weekly-scraper.yml          # Haftalık otomasyon workflow
```

### Python Scripts
```
scripts/
  ├── universal_scraper.py                # Ana scraper
  ├── research_new_organizations.py       # AI destekli kurum araştırma
  ├── validate_scholarships.py            # Burs doğrulama
  ├── add_organization_logos.py           # Logo ekleme
  ├── generate_weekly_report.py           # Haftalık rapor
  └── suggested_organizations.json        # AI önerileri (otomatik)
```

### Raporlar
```
reports/
  └── weekly_report_YYYY-MM-DD.txt        # Haftalık raporlar
```

---

## ⚙️ Kurulum

### 1. GitHub Secrets Ekle

Repository Settings → Secrets → Actions → New repository secret:

```
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Workflow'u Aktifleştir

```bash
git add .github/workflows/weekly-scraper.yml
git commit -m "Add: Haftalık otomasyon sistemi"
git push origin main
```

### 3. Manuel Test (İsteğe Bağlı)

GitHub → Actions → "🤖 Haftalık Burs Scraper" → Run workflow

---

## 🕐 Çalışma Zamanlaması

**Haftalık:** Her Pazartesi saat 09:00 UTC (12:00 Türkiye saati)

**Manuel:** İstediğiniz zaman GitHub Actions'tan tetikleyebilirsiniz

---

## 📊 Workflow Adımları

### 1. 🔍 Yeni Kurum Araştırma
- AI (GPT-4o-mini) ile yeni burs veren kurumları araştırır
- Vakıf, dernek, belediye, kamu kurumlarına odaklanır
- Deep link kontrolü yapar
- Önerileri `suggested_organizations.json` dosyasına kaydeder

### 2. 🕷️ Burs Scraping
- Tüm kurumlardan (23+) burs scrape eder
- Deep link, amount, deadline, description çıkarır
- Duplicate kontrolü yapar
- Database'e otomatik ekler

### 3. ✅ Validasyon
- Amount = 0 olanları tespit eder
- Deep link eksiklerini bulur
- Description kalitesini kontrol eder
- Hata oranı %30'u aşarsa uyarı verir

### 4. 🎨 Favicon/Logo Kontrolü
- Yeni kurumlar için otomatik favicon ekler
- Google Favicon Service kullanır
- Logo eksik kurumları günceller

### 5. 📊 Rapor Oluşturma
- Haftalık istatistikler
- Yeni eklenen burslar listesi
- Başarı oranı (veri bütünlüğü)
- reports/ klasörüne kaydeder

### 6. 🚀 Railway Deploy
- Railway otomatik GitHub push'u algılar
- Yeni verilerle siteyi günceller
- 1-2 dakika içinde canlıya alır

### 7. 📧 Bildirim
- Başarılı/başarısız durumu raporlar
- GitHub Actions log'unda görülebilir

---

## 🐛 Hata Yönetimi

### Retry Logic
- Network hatası: 3 defa yeniden dener
- AI parsing hatası: Sonraki kuruma geçer
- Database hatası: Loglar ve devam eder

### Hata Bildirimi
- GitHub Actions log'unda detaylı hata mesajları
- Email bildirimi (opsiyonel, eklenebilir)
- Slack/Discord webhook (opsiyonel, eklenebilir)

---

## 📈 Performans

- **Süre:** ~10-15 dakika (23 kurum için)
- **Maliyet:** ~$0.10-0.20 per run (OpenAI API)
- **Başarı Oranı:** %85-95 (veri bütünlüğü)

---

## 🔧 Özelleştirme

### Scrape Sıklığını Değiştirme

`.github/workflows/weekly-scraper.yml` dosyasında:

```yaml
# Her gün saat 09:00
- cron: '0 9 * * *'

# Her Pazartesi ve Perşembe 09:00
- cron: '0 9 * * 1,4'

# Her ay 1'inde 09:00
- cron: '0 9 1 * *'
```

### Yeni Script Ekleme

1. `scripts/` klasörüne Python script'i ekle
2. `.github/workflows/weekly-scraper.yml` içine yeni step ekle
3. Gerekli secrets'ı tanımla

---

## 🧪 Manuel Test

### Lokal Test

```bash
# 1. Yeni kurum araştır
python3 scripts/research_new_organizations.py

# 2. Scraper çalıştır
python3 scripts/universal_scraper.py

# 3. Validasyon
python3 scripts/validate_scholarships.py

# 4. Logo ekle
python3 scripts/add_organization_logos.py

# 5. Rapor oluştur
python3 scripts/generate_weekly_report.py
```

### GitHub Actions Test

1. GitHub → Repository → Actions
2. "🤖 Haftalık Burs Scraper" workflow'u seç
3. "Run workflow" → "Run workflow" butonuna tıkla
4. Log'ları takip et

---

## 📝 TODO / İyileştirmeler

- [ ] Email bildirimi ekle (başarılı/hatalı scraping)
- [ ] Slack/Discord webhook entegrasyonu
- [ ] Daha fazla kurum ekleme (AI önerileri otomatik ekle)
- [ ] Amount değeri 0 olanları AI ile tekrar kontrol et
- [ ] Dashboard: Scraping history ve istatistikleri görüntüle
- [ ] A/B testing: Farklı AI promptları dene
- [ ] Rate limiting: API limit aşımını önle
- [ ] Cache: Scrape edilen sayfaları cache'le

---

## 🆘 Sorun Giderme

### Workflow Çalışmıyor
- GitHub Secrets doğru tanımlandı mı?
- Workflow dosyası `.github/workflows/` altında mı?
- Repository'nin Actions'ı aktif mi?

### Scraping Başarısız
- OpenAI API key geçerli mi ve bakiyesi var mı?
- Supabase bağlantısı çalışıyor mu?
- Website'ler erişilebilir mi? (firewall, VPN kontrolü)

### Veri Eksik (Amount = 0)
- AI prompt iyileştirilebilir
- Manuel olarak amount eklenebilir
- Website'de amount bilgisi olmayabilir

---

## 📞 Destek

- GitHub Issues: Hata bildirimi
- Email: [email buraya]
- Dokümantasyon: Bu dosya + kod içi yorumlar

---

**Son Güncelleme:** 2025-12-16
**Versiyon:** 1.0.0

