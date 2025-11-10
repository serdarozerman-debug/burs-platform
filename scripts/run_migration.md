# Database Migration Talimatları

## Supabase SQL Editor'da Çalıştırılacak

`schema_migration.sql` dosyasındaki SQL komutlarını Supabase Dashboard'da çalıştırın:

1. Supabase Dashboard'a gidin: https://supabase.com/dashboard
2. Projenizi seçin
3. Sol menüden "SQL Editor" seçin
4. "New Query" butonuna tıklayın
5. `schema_migration.sql` dosyasının içeriğini kopyalayıp yapıştırın
6. "Run" butonuna tıklayın

## Migration'ın İçeriği

✅ 35+ yeni kolon eklenir:
- organization_category
- application_status
- start_date, duration_months
- payment_schedule, is_refundable
- scope, nationality_requirement
- age_min, age_max, gender
- education_type, min_gpa
- exam_type, min_score, score_type
- target_universities, target_faculties, target_departments
- excluded_programs
- income_limit, requires_financial_need
- documents_mandatory, documents_optional, documents_conditional
- exclusion_criteria
- detailed_description, terms_and_conditions
- how_to_apply, contact_info
- target_group, scholarship_category
- priority_criteria, quota, benefits

✅ İndeksler eklenir (performans için)

✅ Check constraint'ler eklenir (veri tutarlılığı için)

✅ Yardımcı tablolar oluşturulur:
- organization_categories
- document_types
- scholarship_applications

## Migration Sonrası

Migration tamamlandıktan sonra şu komutu çalıştırın:

```bash
python3 scripts/advanced_scraper.py 5
```

Bu komut ilk 5 kurumu test olarak scrape edecek.

Herşey yolunda giderse tüm kurumları scrape etmek için:

```bash
python3 scripts/advanced_scraper.py
```

