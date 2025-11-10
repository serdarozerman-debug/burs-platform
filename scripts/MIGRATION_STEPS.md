# 🚀 DATABASE MİGRATION ADIMLARI

## Adım 1: Supabase SQL Editor'ı Açın
1. https://supabase.com/dashboard adresine gidin
2. Projenizi seçin
3. Sol menüden "SQL Editor" tıklayın
4. "New Query" butonuna tıklayın

## Adım 2: Migration SQL'ini Çalıştırın

Aşağıdaki dosyanın içeriğini kopyalayın ve SQL Editor'a yapıştırıp çalıştırın:

📁 **scripts/FULL_MIGRATION.sql**

Bu dosya şunları içerir:
- ✅ 16 yeni kolon ekler (age_min, age_max, documents_mandatory, vb.)
- ✅ Varsayılan değerleri ayarlar
- ✅ Favicon URL'lerini günceller (TÜBİTAK, VKV, TEV, Sabancı, İBB)

## Adım 3: Migration Sonrasını Doğrulayın

SQL Editor'da şu sorguyu çalıştırın:

```sql
SELECT 
  COUNT(*) as total_scholarships,
  COUNT(organization_logo) as with_favicon,
  COUNT(DISTINCT organization) as organizations
FROM scholarships;
```

Beklenen sonuç:
- total_scholarships: 40-50 arası
- with_favicon: 20+ 
- organizations: 5-10 arası

## Adım 4: Test Scraping

```bash
cd scripts
python3 advanced_scraper.py 3
```

Bu komut ilk 3 kurumu (TÜBİTAK, TEV, VKV) scrape edecek.

## Adım 5: Full Scraping (Opsiyonel)

Tüm 213 kurumu scrape etmek için:

```bash
python3 advanced_scraper.py
```

⚠️  **DİKKAT:** Bu işlem 2-3 saat sürebilir ve OpenAI API kredisi tüketir.

## Sorun Giderme

Eğer migration hatası alırsanız:

```sql
-- Mevcut kolonları kontrol edin
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'scholarships';
```

Eğer kolon zaten varsa hata alırsınız, bu normaldir. `IF NOT EXISTS` kullanıldığı için sorun olmaz.
