-- Organizations tablosu için UPDATE politikası
-- Scraper'ların organizasyon bilgilerini güncelleyebilmesi için

DROP POLICY IF EXISTS "Scrapers can update organizations" ON organizations;

CREATE POLICY "Scrapers can update organizations"
    ON organizations FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

