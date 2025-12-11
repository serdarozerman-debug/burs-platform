-- Scraper'ların scholarships tablosuna insert ve update yapabilmesi için RLS politikaları
-- Bu politikalar anonim kullanıcıların (scraper'ların) burs eklemesine ve güncellemesine izin verir

-- Önce mevcut politikaları kaldır (varsa)
DROP POLICY IF EXISTS "Scrapers can insert scholarships" ON scholarships;
DROP POLICY IF EXISTS "Scrapers can update scholarships" ON scholarships;

-- INSERT politikası - anonim kullanıcılar için
CREATE POLICY "Scrapers can insert scholarships"
    ON scholarships FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- UPDATE politikası - anonim kullanıcılar için
CREATE POLICY "Scrapers can update scholarships"
    ON scholarships FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Alternatif: Service role key kullanmak isterseniz, yukarıdaki politika yerine
-- .env.local dosyasına SUPABASE_SERVICE_ROLE_KEY ekleyin
-- Service role key RLS'yi bypass eder

