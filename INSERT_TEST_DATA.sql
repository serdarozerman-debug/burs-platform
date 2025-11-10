-- TEST DATA FOR BURS PLATFORM v2.0
-- Run this in Supabase SQL Editor

-- Insert 10 test scholarships
INSERT INTO scholarships (
  title,
  organization,
  organization_logo,
  amount,
  amount_type,
  deadline,
  description,
  type,
  education_level,
  application_url,
  is_active,
  created_at
) VALUES
-- 1. Vakıf Bursu
(
  'Vehbi Koç Vakfı Üniversite Bursu',
  'Vehbi Koç Vakfı',
  'https://www.vkv.org.tr/Content/images/logo.png',
  5000,
  'aylık',
  '2024-12-31',
  'Vehbi Koç Vakfı tarafından sağlanan tam burs imkanı. Lise son sınıf öğrencileri ve üniversite öğrencileri başvurabilir.',
  'akademik',
  'lisans',
  'https://www.vkv.org.tr',
  true,
  NOW()
),

-- 2. İBB Bursu
(
  'İstanbul Büyükşehir Belediyesi Öğrenci Bursu',
  'İstanbul Büyükşehir Belediyesi',
  'https://www.ibb.istanbul/images/logo.svg',
  2500,
  'aylık',
  '2024-11-30',
  'İstanbul''da ikamet eden veya İstanbul''da okul okuyan üniversite öğrencilerine yönelik burs programı.',
  'ihtiyaç',
  'lisans',
  'https://www.ibb.istanbul',
  true,
  NOW()
),

-- 3. TÜBİTAK Bursu
(
  'TÜBİTAK Bilim İnsanı Destekleme Bursu',
  'TÜBİTAK',
  'https://www.tubitak.gov.tr/sites/default/files/tubitak_logo.png',
  8000,
  'aylık',
  '2025-01-15',
  'Yüksek lisans ve doktora öğrencilerine yönelik araştırma bursu. Bilimsel çalışmalara katkı sağlayanlar desteklenir.',
  'akademik',
  'yükseklisans',
  'https://bideb.tubitak.gov.tr',
  true,
  NOW()
),

-- 4. TEV Bursu
(
  'Türk Eğitim Vakfı Burs Programı',
  'Türk Eğitim Vakfı',
  'https://www.tev.org.tr/images/tev-logo.png',
  3000,
  'aylık',
  '2024-12-15',
  'Maddi imkanları yetersiz, başarılı öğrencilere eğitim desteği. Lise ve üniversite öğrencileri başvurabilir.',
  'ihtiyaç',
  'lise',
  'https://www.tev.org.tr',
  true,
  NOW()
),

-- 5. Sabancı Vakfı
(
  'Sabancı Vakfı Eğitim Bursu',
  'Sabancı Vakfı',
  'https://www.sabancivakfi.org/Content/images/logo.svg',
  4500,
  'aylık',
  '2024-12-20',
  'Sabancı Vakfı tarafından sağlanan tam burs. Başarılı ve maddi durumu iyi olmayan öğrenciler desteklenir.',
  'akademik',
  'lisans',
  'https://www.sabancivakfi.org',
  true,
  NOW()
),

-- 6. Koç Üniversitesi
(
  'Koç Üniversitesi Tam Burs',
  'Koç Üniversitesi',
  'https://www.ku.edu.tr/images/ku-logo.png',
  15000,
  'yıllık',
  '2024-08-01',
  'YKS başarı sıralamasına göre verilen tam burs. Tüm eğitim masrafları karşılanır.',
  'akademik',
  'lisans',
  'https://www.ku.edu.tr',
  true,
  NOW()
),

-- 7. ANADOLU Bursu
(
  'Anadolu Üniversitesi Başarı Bursu',
  'Anadolu Üniversitesi',
  'https://www.anadolu.edu.tr/images/logo.png',
  2000,
  'aylık',
  '2024-09-15',
  'Üniversiteye yeni kayıt olan başarılı öğrencilere verilen burs. İlk yıl tam burs.',
  'akademik',
  'lisans',
  'https://www.anadolu.edu.tr',
  true,
  NOW()
),

-- 8. Darüşşafaka
(
  'Darüşşafaka Tam Burs Programı',
  'Darüşşafaka',
  'https://www.darussafaka.org/images/logo.png',
  10000,
  'tek_seferlik',
  '2024-11-01',
  'Yetim ve öksüz öğrencilere tam burs. Barınma, iaşe ve eğitim masrafları karşılanır.',
  'ihtiyaç',
  'lise',
  'https://www.darussafaka.org',
  true,
  NOW()
),

-- 9. Boğaziçi Üniversitesi
(
  'Boğaziçi Üniversitesi Yüksek Lisans Bursu',
  'Boğaziçi Üniversitesi',
  'https://www.boun.edu.tr/images/logo.png',
  6000,
  'aylık',
  '2024-10-30',
  'Yüksek lisans programlarına kayıt olan öğrencilere araştırma bursu. Tez çalışması zorunludur.',
  'akademik',
  'yükseklisans',
  'https://www.boun.edu.tr',
  true,
  NOW()
),

-- 10. Engelsiz Eğitim Vakfı
(
  'Engelli Öğrenciler İçin Eğitim Bursu',
  'Engelsiz Eğitim Vakfı',
  'https://www.engelsizvakif.org/images/logo.png',
  3500,
  'aylık',
  '2024-12-31',
  'Engelli öğrencilere özel eğitim bursu. Tüm eğitim kademelerindeki öğrenciler başvurabilir.',
  'engelli',
  'lisans',
  'https://www.engelsizvakif.org',
  true,
  NOW()
);

-- Verify insertion
SELECT COUNT(*) as total_scholarships FROM scholarships WHERE is_active = true;

