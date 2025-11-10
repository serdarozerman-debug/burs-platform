-- Hızlı Migration: Sadece Gerekli Kolonlar
-- Supabase SQL Editor'da çalıştırın

-- Temel alanlar
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS organization_category TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS application_status TEXT DEFAULT 'open';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS scope TEXT DEFAULT 'domestic';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS nationality_requirement TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS age_min INTEGER;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS age_max INTEGER;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'all';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS min_gpa NUMERIC(3,2);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS is_refundable BOOLEAN DEFAULT false;

-- Belge alanları
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS documents_mandatory TEXT[];
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS documents_optional TEXT[];
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS documents_conditional TEXT[];

-- Açıklama alanları
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS detailed_description TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS application_requirements TEXT;

-- Varsayılan değerleri güncelle
UPDATE scholarships SET application_status = 'open' WHERE application_status IS NULL;
UPDATE scholarships SET scope = 'domestic' WHERE scope IS NULL;
UPDATE scholarships SET gender = 'all' WHERE gender IS NULL;
UPDATE scholarships SET is_refundable = false WHERE is_refundable IS NULL;

