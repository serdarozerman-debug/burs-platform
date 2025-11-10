-- BURS PLATFORM v2.0 - REAL DATA INSERT
-- Yeni schema'ya uyumlu versiyon

-- STEP 1: Organizations ekle
INSERT INTO organizations (
  name,
  website,
  logo_url,
  description,
  is_verified
) VALUES
  ('Vehbi Koç Vakfı', 'https://www.vkv.org.tr', 'https://www.vkv.org.tr/Content/images/logo.png', 'Eğitim ve kültür alanında faaliyet gösteren vakıf', true),
  ('İstanbul Büyükşehir Belediyesi', 'https://www.ibb.istanbul', 'https://www.ibb.istanbul/images/logo.svg', 'İstanbul Büyükşehir Belediyesi', true),
  ('TÜBİTAK', 'https://www.tubitak.gov.tr', 'https://www.tubitak.gov.tr/sites/default/files/tubitak_logo.png', 'Türkiye Bilimsel ve Teknolojik Araştırma Kurumu', true),
  ('Türk Eğitim Vakfı', 'https://www.tev.org.tr', 'https://www.tev.org.tr/images/tev-logo.png', 'Türkiye''nin en köklü eğitim vakıflarından', true),
  ('Sabancı Vakfı', 'https://www.sabancivakfi.org', 'https://www.sabancivakfi.org/Content/images/logo.svg', 'Eğitim ve sosyal kalkınmada öncü vakıf', true),
  ('Koç Üniversitesi', 'https://www.ku.edu.tr', 'https://www.ku.edu.tr/images/ku-logo.png', 'Türkiye''nin önde gelen özel üniversitelerinden', true),
  ('Anadolu Üniversitesi', 'https://www.anadolu.edu.tr', 'https://www.anadolu.edu.tr/images/logo.png', 'Türkiye''nin en büyük üniversitelerinden', true),
  ('Darüşşafaka', 'https://www.darussafaka.org', 'https://www.darussafaka.org/images/logo.png', 'Yetim ve öksüz öğrencilere eğitim desteği', true),
  ('Boğaziçi Üniversitesi', 'https://www.boun.edu.tr', 'https://www.boun.edu.tr/images/logo.png', 'Türkiye''nin en prestijli üniversitelerinden', true),
  ('Engelsiz Eğitim Vakfı', 'https://www.engelsizvakif.org', 'https://www.engelsizvakif.org/images/logo.png', 'Engelli öğrencilere eğitim desteği', true)
ON CONFLICT (name) DO NOTHING;

-- Organizations'ları al (ID'leri kullanmak için)
-- Temporary table oluştur
CREATE TEMP TABLE temp_org_ids AS
SELECT id, name FROM organizations 
WHERE name IN (
  'Vehbi Koç Vakfı',
  'İstanbul Büyükşehir Belediyesi',
  'TÜBİTAK',
  'Türk Eğitim Vakfı',
  'Sabancı Vakfı',
  'Koç Üniversitesi',
  'Anadolu Üniversitesi',
  'Darüşşafaka',
  'Boğaziçi Üniversitesi',
  'Engelsiz Eğitim Vakfı'
);

-- STEP 2: Scholarships ekle (organization_id ile)
INSERT INTO scholarships (
  organization_id,
  title,
  slug,
  description,
  amount,
  amount_type,
  education_level,
  type,
  deadline,
  application_url,
  is_active,
  is_published
)
SELECT 
  o.id,
  v.title,
  v.slug,
  v.description,
  v.amount,
  v.amount_type::amount_type,
  v.education_level::education_level,
  v.type::scholarship_type,
  v.deadline::date,
  v.application_url,
  true,
  true
FROM (VALUES
  ('Vehbi Koç Vakfı', 'Vehbi Koç Vakfı Üniversite Bursu', 'vehbi-koc-vakfi-universite-bursu', 'Vehbi Koç Vakfı tarafından sağlanan tam burs imkanı. Lise son sınıf öğrencileri ve üniversite öğrencileri başvurabilir.', 5000, 'aylık', 'lisans', 'akademik', '2024-12-31', 'https://www.vkv.org.tr'),
  ('İstanbul Büyükşehir Belediyesi', 'İstanbul Büyükşehir Belediyesi Öğrenci Bursu', 'ibb-ogrenci-bursu', 'İstanbul''da ikamet eden veya İstanbul''da okul okuyan üniversite öğrencilerine yönelik burs programı.', 2500, 'aylık', 'lisans', 'ihtiyaç', '2024-11-30', 'https://www.ibb.istanbul'),
  ('TÜBİTAK', 'TÜBİTAK Bilim İnsanı Destekleme Bursu', 'tubitak-bilim-insani-bursu', 'Yüksek lisans ve doktora öğrencilerine yönelik araştırma bursu. Bilimsel çalışmalara katkı sağlayanlar desteklenir.', 8000, 'aylık', 'yükseklisans', 'akademik', '2025-01-15', 'https://bideb.tubitak.gov.tr'),
  ('Türk Eğitim Vakfı', 'Türk Eğitim Vakfı Burs Programı', 'tev-burs-programi', 'Maddi imkanları yetersiz, başarılı öğrencilere eğitim desteği. Lise ve üniversite öğrencileri başvurabilir.', 3000, 'aylık', 'lise', 'ihtiyaç', '2024-12-15', 'https://www.tev.org.tr'),
  ('Sabancı Vakfı', 'Sabancı Vakfı Eğitim Bursu', 'sabanci-vakfi-egitim-bursu', 'Sabancı Vakfı tarafından sağlanan tam burs. Başarılı ve maddi durumu iyi olmayan öğrenciler desteklenir.', 4500, 'aylık', 'lisans', 'akademik', '2024-12-20', 'https://www.sabancivakfi.org'),
  ('Koç Üniversitesi', 'Koç Üniversitesi Tam Burs', 'koc-universitesi-tam-burs', 'YKS başarı sıralamasına göre verilen tam burs. Tüm eğitim masrafları karşılanır.', 15000, 'yıllık', 'lisans', 'akademik', '2024-08-01', 'https://www.ku.edu.tr'),
  ('Anadolu Üniversitesi', 'Anadolu Üniversitesi Başarı Bursu', 'anadolu-universitesi-basari-bursu', 'Üniversiteye yeni kayıt olan başarılı öğrencilere verilen burs. İlk yıl tam burs.', 2000, 'aylık', 'lisans', 'akademik', '2024-09-15', 'https://www.anadolu.edu.tr'),
  ('Darüşşafaka', 'Darüşşafaka Tam Burs Programı', 'darussafaka-tam-burs', 'Yetim ve öksüz öğrencilere tam burs. Barınma, iaşe ve eğitim masrafları karşılanır.', 10000, 'tek_seferlik', 'lise', 'ihtiyaç', '2024-11-01', 'https://www.darussafaka.org'),
  ('Boğaziçi Üniversitesi', 'Boğaziçi Üniversitesi Yüksek Lisans Bursu', 'bogazici-yuksek-lisans-bursu', 'Yüksek lisans programlarına kayıt olan öğrencilere araştırma bursu. Tez çalışması zorunludur.', 6000, 'aylık', 'yükseklisans', 'akademik', '2024-10-30', 'https://www.boun.edu.tr'),
  ('Engelsiz Eğitim Vakfı', 'Engelli Öğrenciler İçin Eğitim Bursu', 'engelli-ogrenciler-egitim-bursu', 'Engelli öğrencilere özel eğitim bursu. Tüm eğitim kademelerindeki öğrenciler başvurabilir.', 3500, 'aylık', 'lisans', 'engelli', '2024-12-31', 'https://www.engelsizvakif.org')
) AS v(org_name, title, slug, description, amount, amount_type, education_level, type, deadline, application_url)
JOIN temp_org_ids o ON o.name = v.org_name;

-- Verify
SELECT 
  s.title,
  o.name as organization,
  s.amount,
  s.education_level
FROM scholarships s
JOIN organizations o ON o.id = s.organization_id
ORDER BY s.created_at DESC
LIMIT 10;

-- Cleanup
DROP TABLE IF EXISTS temp_org_ids;

