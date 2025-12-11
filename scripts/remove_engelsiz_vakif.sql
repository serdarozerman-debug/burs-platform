-- Engelsiz Eğitim Vakfı'nın burslarını pasif hale getir
-- Site çalışmadığı için burslar kaldırılıyor

UPDATE scholarships
SET 
    is_active = FALSE,
    is_published = FALSE
WHERE organization_id IN (
    SELECT id FROM organizations 
    WHERE name ILIKE '%Engelsiz Eğitim Vakfı%'
);

-- Kontrol için sorgu
SELECT 
    s.id,
    s.title,
    s.is_active,
    s.is_published,
    o.name as organization_name
FROM scholarships s
JOIN organizations o ON s.organization_id = o.id
WHERE o.name ILIKE '%Engelsiz Eğitim Vakfı%';

