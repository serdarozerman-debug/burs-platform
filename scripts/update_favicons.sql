-- Kurumların gerçek favicon URL'lerini güncelle

-- TÜBİTAK (zaten var)
UPDATE scholarships
SET organization_logo = 'https://www.tubitak.gov.tr/sites/default/files/favicon.png'
WHERE organization = 'TÜBİTAK' AND (organization_logo IS NULL OR organization_logo = '');

-- VKV
UPDATE scholarships
SET organization_logo = 'https://www.vkv.org.tr/favicon.ico'
WHERE organization LIKE '%Vehbi Koç%' AND (organization_logo IS NULL OR organization_logo = '');

-- TEV
UPDATE scholarships
SET organization_logo = 'https://www.tev.org.tr/favicons/favicon-32x32.png'
WHERE organization LIKE '%Türk Eğitim Vakfı%' AND (organization_logo IS NULL OR organization_logo = '');

-- Sabancı Vakfı
UPDATE scholarships
SET organization_logo = 'https://www.sabancivakfi.org/i/assets/images/site/favicon.png'
WHERE organization LIKE '%Sabancı%' AND (organization_logo IS NULL OR organization_logo = '');

-- İBB (SVG logo)
UPDATE scholarships
SET organization_logo = 'https://www.ibb.istanbul/BBImages/Areas/CorporateWebsite/Content/img/favicon.png'
WHERE organization LIKE '%İstanbul Büyükşehir%' AND (organization_logo IS NULL OR organization_logo = '');

