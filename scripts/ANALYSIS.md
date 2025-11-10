# Burs Veri Yapısı Analizi

## Kaynak: Microfon.co Burs Detay Sayfaları

### 1. TEMEL BİLGİLER

#### Kurum Bilgileri
- `organization_name`: Kurum adı (örn: "Hacı Ömer Sabancı Vakfı")
- `organization_logo`: Kurum logosu/favicon URL
- `organization_category`: Kurum kategorisi (vakıf, kamu, belediye, özel)

#### Burs Başlığı ve Durum
- `title`: Burs başlığı (örn: "Sabancı Vakfı Bursu İstanbul Üni. - Cerrahpaşa")
- `application_status`: Başvuru durumu (açık, kapalı, yakında)
- `application_url`: Başvuru linki

### 2. İLAN DETAYLARI

#### Mali Bilgiler
- `amount`: Burs miktarı (sayısal)
- `amount_type`: Ödeme türü (aylık, yıllık, tek seferlik, proje başı)
- `payment_schedule`: Ödeme takvimi
- `is_refundable`: Geri ödeme durumu (boolean)

#### Kapsam ve Tarihler
- `scope`: Kapsam (yurtiçi, yurtdışı, her ikisi)
- `deadline`: Son başvuru tarihi
- `start_date`: Başvuru başlangıç tarihi
- `duration`: Burs süresi (ay cinsinden)

### 3. BAŞVURU KOŞULLARI

#### Genel Kriterler
- `nationality_requirement`: Uyruk koşulu
- `age_min`: Minimum yaş
- `age_max`: Maximum yaş
- `gender`: Cinsiyet kısıtı (erkek, kadın, tümü)

#### Akademik Kriterler
- `education_level`: Eğitim seviyesi (lise, önlisans, lisans, yüksek lisans, doktora)
- `education_type`: Öğrenim türü (örgün, uzaktan, açıköğretim, ikinci öğretim)
- `min_gpa`: Minimum not ortalaması
- `exam_type`: Sınav türü (YKS, YÖKDİL, ALES, vb.)
- `min_score`: Minimum sınav puanı
- `score_type`: Puan türü (SAY, EA, SÖZ, DİL)

#### Okul/Bölüm Kısıtları
- `target_universities`: Hedef üniversiteler (array)
- `target_faculties`: Hedef fakülteler (array)
- `target_departments`: Hedef bölümler (array)
- `excluded_programs`: Kabul edilmeyen programlar

#### Mali Durum
- `income_limit`: Gelir üst limiti
- `requires_financial_need`: Mali durum kontrolü (boolean)

### 4. GEREKLİ BELGELER

#### Belgeler (Normalized Field Names)
```json
{
  "documents_required": {
    "mandatory": [
      "identity_document",           // Kimlik fotokopisi, nüfus cüzdanı
      "student_certificate",         // Öğrenci belgesi
      "family_registry",             // Aile nüfus kayıt belgesi, vukuatlı nüfus
      "exam_result",                 // YKS/YÖKDİL/ALES sonuç belgesi
      "placement_document",          // ÖSYS yerleştirme belgesi
      "residence_certificate",       // İkametgah belgesi
      "criminal_record"              // Adli sicil belgesi, sabıka kaydı
    ],
    "optional": [
      "disability_report",           // Engelli raporu, sağlık kurulu raporu
      "sibling_student_certificate", // Kardeş öğrenci belgesi
      "disaster_certificate"         // Afetzede belgesi, hasar tespit
    ],
    "conditional": [
      "parent_income_document",      // Anne/baba gelir belgesi, maaş bordrosu
      "sgk_registration",            // SGK tescil belgesi, sigorta dökümü
      "tax_return",                  // Gelir vergisi beyannamesi
      "property_deed",               // Tapu belgesi, taşınmaz bilgisi
      "vehicle_registration",        // Araç tescil belgesi
      "rental_contract",             // Kira kontratı, kira sözleşmesi
      "asset_declaration"            // Mal varlığı beyanı
    ]
  }
}
```

### 5. UYGUNLUK KRİTERLERİ

#### Negatif Kriterler (Aday Olamayacaklar)
- `exclusion_criteria`: Array of exclusion reasons
  - Belirtilen üniversite dışında kayıt
  - Minimum puan altı
  - İkinci öğretim
  - Açıköğretim
  - Ara sınıf (ilk kayıt değil)

### 6. AÇIKLAMA VE DETAYLAR

- `description`: Genel açıklama
- `detailed_description`: Detaylı açıklama (HTML/Markdown)
- `terms_and_conditions`: Şartlar ve koşullar
- `how_to_apply`: Başvuru süreci açıklaması
- `contact_info`: İletişim bilgileri

### 7. EK BİLGİLER

- `type`: Burs türü (akademik, ihtiyaç, engelli, spor, sanat)
- `target_group`: Hedef kitle
- `scholarship_category`: Alt kategori
- `priority_criteria`: Öncelik kriterleri
- `quota`: Kontenjan
- `benefits`: Ek faydalar (yurt, ulaşım, vb.)

## UNIQUE FIELD MAPPING (Normalize Edilecek)

### Kimlik Belgeleri
- "kimlik fotokopisi" → `identity_document`
- "nüfus cüzdanı fotokopisi" → `identity_document`
- "TC kimlik belgesi" → `identity_document`

### Nüfus Kayıt
- "vukuatlı nüfus kayıt belgesi" → `family_registry`
- "aile nüfus kayıt örneği" → `family_registry`
- "nüfus kayıt örneği belgesi" → `family_registry`

### Öğrenci Belgesi
- "öğrenci belgesi" → `student_certificate`
- "öğrencilik belgesi" → `student_certificate`
- "kayıt belgesi" → `student_certificate`

### Gelir Belgeleri
- "maaş bordrosu" → `parent_income_document`
- "gelir belgesi" → `parent_income_document`
- "kurum onaylı bordro" → `parent_income_document`
- "emekli maaş belgesi" → `parent_income_document`

### SGK Belgeleri
- "SGK tescil belgesi" → `sgk_registration`
- "sosyal güvenlik kayıt belgesi" → `sgk_registration`
- "4A hizmet dökümü" → `sgk_registration`

### Adli Sicil
- "adli sicil belgesi" → `criminal_record`
- "sabıka kaydı" → `criminal_record`
- "arşiv kaydı" → `criminal_record`

### İkametgah
- "ikametgah belgesi" → `residence_certificate`
- "yerleşim yeri belgesi" → `residence_certificate`
- "ikamet belgesi" → `residence_certificate`

### Sınav Sonuçları
- "YKS sonuç belgesi" → `exam_result`
- "ÖSYS yerleştirme belgesi" → `placement_document`
- "üniversite sınav sonucu" → `exam_result`

### Engelli Raporu
- "engelli sağlık kurulu raporu" → `disability_report`
- "özürlü raporu" → `disability_report`
- "sağlık raporu" → `disability_report`

### Tapu/Mal Varlığı
- "tapu belgesi" → `property_deed`
- "taşınmaz mal beyanı" → `property_deed`
- "emlak belgesi" → `property_deed`

### Kira
- "kira kontratı" → `rental_contract`
- "kira sözleşmesi" → `rental_contract`

## DATABASE SCHEMA ÖNERİSİ

```sql
-- Mevcut scholarships tablosuna eklenecek kolonlar:
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS organization_category TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS application_status TEXT DEFAULT 'open';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS duration_months INTEGER;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS payment_schedule TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS is_refundable BOOLEAN DEFAULT false;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS scope TEXT; -- 'domestic', 'international', 'both'
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS nationality_requirement TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS age_min INTEGER;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS age_max INTEGER;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'all';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS education_type TEXT;
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
```

