-- Burs Database Schema Migration
-- Microfon.co analizi temel alınarak oluşturuldu

-- 1. Yeni kolonlar ekle
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS organization_category TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS application_status TEXT DEFAULT 'open';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS duration_months INTEGER;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS payment_schedule TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS is_refundable BOOLEAN DEFAULT false;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS scope TEXT DEFAULT 'domestic';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS nationality_requirement TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS age_min INTEGER;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS age_max INTEGER;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'all';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS education_type TEXT DEFAULT 'formal';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS min_gpa NUMERIC(3,2);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS exam_type TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS min_score NUMERIC(6,2);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS score_type TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS target_universities TEXT[];
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS target_faculties TEXT[];
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS target_departments TEXT[];
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS excluded_programs TEXT[];
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS income_limit NUMERIC(10,2);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS requires_financial_need BOOLEAN DEFAULT false;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS documents_mandatory TEXT[];
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS documents_optional TEXT[];
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS documents_conditional TEXT[];
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS exclusion_criteria TEXT[];
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS detailed_description TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS terms_and_conditions TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS how_to_apply TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS contact_info JSONB;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS target_group TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS scholarship_category TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS priority_criteria TEXT[];
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS quota INTEGER;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS benefits TEXT[];

-- 2. İndeksler ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_scholarships_organization_category ON scholarships(organization_category);
CREATE INDEX IF NOT EXISTS idx_scholarships_application_status ON scholarships(application_status);
CREATE INDEX IF NOT EXISTS idx_scholarships_scope ON scholarships(scope);
CREATE INDEX IF NOT EXISTS idx_scholarships_education_type ON scholarships(education_type);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(deadline);
CREATE INDEX IF NOT EXISTS idx_scholarships_start_date ON scholarships(start_date);
CREATE INDEX IF NOT EXISTS idx_scholarships_gender ON scholarships(gender);
CREATE INDEX IF NOT EXISTS idx_scholarships_min_score ON scholarships(min_score);

-- 3. Enum'lar için check constraint'ler ekle
ALTER TABLE scholarships ADD CONSTRAINT check_application_status 
  CHECK (application_status IN ('open', 'closed', 'upcoming', 'expired'));

ALTER TABLE scholarships ADD CONSTRAINT check_scope 
  CHECK (scope IN ('domestic', 'international', 'both'));

ALTER TABLE scholarships ADD CONSTRAINT check_gender 
  CHECK (gender IN ('all', 'male', 'female'));

ALTER TABLE scholarships ADD CONSTRAINT check_education_type 
  CHECK (education_type IN ('formal', 'distance', 'open', 'evening', 'all'));

-- 4. Mevcut verileri güncelle (default değerler)
UPDATE scholarships SET application_status = 'open' WHERE application_status IS NULL;
UPDATE scholarships SET scope = 'domestic' WHERE scope IS NULL;
UPDATE scholarships SET gender = 'all' WHERE gender IS NULL;
UPDATE scholarships SET education_type = 'formal' WHERE education_type IS NULL;
UPDATE scholarships SET is_refundable = false WHERE is_refundable IS NULL;
UPDATE scholarships SET requires_financial_need = false WHERE requires_financial_need IS NULL;

-- 5. Organization categories tablosu (referans için)
CREATE TABLE IF NOT EXISTS organization_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO organization_categories (name, description) VALUES
  ('kamu', 'Kamu kurumları ve devlet destekli programlar'),
  ('vakıf', 'Özel vakıflar ve hayır kurumları'),
  ('belediye', 'Yerel yönetimler ve belediyeler'),
  ('özel', 'Özel şirketler ve kuruluşlar'),
  ('dernek', 'Sivil toplum kuruluşları ve dernekler'),
  ('üniversite', 'Üniversiteler ve akademik kurumlar'),
  ('uluslararası', 'Uluslararası organizasyonlar ve programlar')
ON CONFLICT (name) DO NOTHING;

-- 6. Document types tablosu (normalized belge türleri)
CREATE TABLE IF NOT EXISTS document_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  canonical_name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  synonyms TEXT[],
  category TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO document_types (canonical_name, display_name, synonyms, category) VALUES
  ('identity_document', 'Kimlik Belgesi', ARRAY['kimlik fotokopisi', 'nüfus cüzdanı', 'TC kimlik'], 'identity'),
  ('family_registry', 'Aile Nüfus Kayıt Belgesi', ARRAY['vukuatlı nüfus', 'nüfus kayıt örneği'], 'family'),
  ('student_certificate', 'Öğrenci Belgesi', ARRAY['öğrencilik belgesi', 'kayıt belgesi'], 'education'),
  ('exam_result', 'Sınav Sonuç Belgesi', ARRAY['YKS sonuç', 'ALES sonuç', 'YÖKDİL sonuç'], 'education'),
  ('placement_document', 'Yerleştirme Belgesi', ARRAY['ÖSYS yerleştirme', 'üniversite yerleştirme'], 'education'),
  ('residence_certificate', 'İkametgah Belgesi', ARRAY['yerleşim yeri belgesi', 'ikamet belgesi'], 'residence'),
  ('criminal_record', 'Adli Sicil Belgesi', ARRAY['sabıka kaydı', 'arşiv kaydı'], 'legal'),
  ('disability_report', 'Engelli Raporu', ARRAY['özürlü raporu', 'sağlık kurulu raporu'], 'health'),
  ('sibling_student_certificate', 'Kardeş Öğrenci Belgesi', ARRAY['kardeş öğrencilik belgesi'], 'family'),
  ('disaster_certificate', 'Afetzede Belgesi', ARRAY['hasar tespit raporu', 'afet belgesi'], 'special'),
  ('parent_income_document', 'Gelir Belgesi', ARRAY['maaş bordrosu', 'emekli maaş belgesi'], 'financial'),
  ('sgk_registration', 'SGK Belgesi', ARRAY['sigorta dökümü', '4A hizmet dökümü'], 'financial'),
  ('tax_return', 'Gelir Vergisi Beyannamesi', ARRAY['vergi beyanı'], 'financial'),
  ('property_deed', 'Tapu Belgesi', ARRAY['taşınmaz belgesi', 'emlak belgesi'], 'financial'),
  ('vehicle_registration', 'Araç Tescil Belgesi', ARRAY['araç kayıt belgesi'], 'financial'),
  ('rental_contract', 'Kira Sözleşmesi', ARRAY['kira kontratı'], 'residence'),
  ('asset_declaration', 'Mal Varlığı Beyanı', ARRAY['varlık beyanı'], 'financial')
ON CONFLICT (canonical_name) DO NOTHING;

-- 7. Scholarship applications tablosu (başvurular için)
CREATE TABLE IF NOT EXISTS scholarship_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT,
  submitted_documents JSONB,
  application_status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_scholarship ON scholarship_applications(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON scholarship_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_applications_email ON scholarship_applications(applicant_email);

COMMENT ON TABLE scholarships IS 'Burs ilanları ve detayları';
COMMENT ON TABLE organization_categories IS 'Burs veren kurum kategorileri';
COMMENT ON TABLE document_types IS 'Normalized belge türleri ve eşanlamlıları';
COMMENT ON TABLE scholarship_applications IS 'Burs başvuruları';

