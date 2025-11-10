# Burs Scraper Sistemi

## 2 Aşamalı Scraping Yapısı

### AŞAMA 1: Kurum Keşfi
**Script**: `discover_organizations.py`

Türkiye'deki burs veren kurumları keşfeder ve listeler.

**Kaynaklar:**
- isinolsun.com
- microfon.co
- Google araması (simülasyon)
- Manuel bilinen kurumlar

**Çalıştırma:**
```bash
python3 scripts/discover_organizations.py
```

**Çıktı:**
- `scripts/organizations.json` - Kurum listesi
- Console'da bulunan kurumlar

---

### AŞAMA 2: Kurum Bazlı Burs Scraping
**Script**: `scrape_all_organizations.py`

`organizations.json`'daki her kurumun web sitesini tarar ve burs bilgilerini AI ile çıkarır.

**Özellikler:**
- OpenAI GPT-4o-mini ile akıllı parsing
- Her kurumun web sitesini tarar
- Burs detaylarını otomatik çıkarır
- Supabase'e kaydeder

**Çalıştırma:**
```bash
python3 scripts/scrape_all_organizations.py
```

---

## Kurulum

1. **Python paketlerini kur:**
```bash
pip3 install -r scripts/requirements.txt
```

2. **Environment variables (.env.local):**
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...
```

3. **Supabase'de organizations tablosu oluştur:**
```sql
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    website TEXT,
    category TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_scraped TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Kullanım Akışı

### Tam Süreç:
```bash
# 1. Kurumları keşfet
python3 scripts/discover_organizations.py

# 2. Kurumları tara
python3 scripts/scrape_all_organizations.py
```

### Tek Kurum Test:
```bash
# Sadece TÜBİTAK
python3 scripts/scraper.py
```

---

## Özellikler

### Discover Organizations:
- ✅ Web scraping ile kurum keşfi
- ✅ Duplikasyon kontrolü
- ✅ JSON export
- ✅ Kategorize etme (vakıf, kamu, özel)

### Scrape All Organizations:
- ✅ AI destekli akıllı parsing
- ✅ OpenAI GPT-4o-mini kullanımı
- ✅ Otomatik burs detay çıkarımı
- ✅ Supabase entegrasyonu
- ✅ Duplicate kontrolü

---

## AI Parsing

OpenAI kullanarak her kurumun sitesinden:
- 📝 Burs başlığı
- 💰 Miktar ve tipi
- 📅 Son başvuru tarihi
- 📋 Açıklama
- 🎓 Eğitim seviyesi
- 📄 Gerekli evraklar

otomatik olarak çıkarılır.

---

## Notlar

- İlk çalıştırmada 5 kurum test edilir
- Tüm kurumlar için script'teki `[:5]` kısmını kaldırın
- Rate limiting için gerekirse `time.sleep()` ekleyin
- Organizations tablosu opsiyoneldir (JSON export yeterli)

