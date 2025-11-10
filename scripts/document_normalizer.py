"""
Belge adlarını normalize eden utility
Farklı sitelerden gelen değişik belge isimlerini standart formata çevirir
"""

# Belge eşanlamlıları mapping
DOCUMENT_MAPPING = {
    # Kimlik Belgeleri
    'identity_document': [
        'kimlik', 'kimlik fotokopisi', 'kimlik belgesi', 
        'nüfus cüzdanı', 'tc kimlik', 'kimlik kartı',
        'identity card', 'id card', 'national id'
    ],
    
    # Nüfus Kayıt
    'family_registry': [
        'nüfus kayıt', 'vukuatlı nüfus', 'aile nüfus', 
        'nüfus kayıt örneği', 'nüfus belgesi', 'aile kütüğü',
        'family registry', 'household registry'
    ],
    
    # Öğrenci Belgesi
    'student_certificate': [
        'öğrenci belgesi', 'öğrencilik belgesi', 'kayıt belgesi',
        'öğrenci onay', 'öğrenim belgesi', 'student certificate',
        'enrollment certificate'
    ],
    
    # Sınav Sonuçları
    'exam_result': [
        'yks sonuç', 'ales sonuç', 'yökdil sonuç', 'kpss sonuç',
        'sınav sonuç belgesi', 'exam result', 'test score'
    ],
    
    'placement_document': [
        'ösys yerleştirme', 'yerleştirme belgesi', 'üniversite yerleştirme',
        'placement document', 'university placement'
    ],
    
    # İkamet
    'residence_certificate': [
        'ikametgah', 'ikamet belgesi', 'yerleşim yeri belgesi',
        'ikametgah belgesi', 'adres belgesi', 'residence certificate'
    ],
    
    # Adli Sicil
    'criminal_record': [
        'adli sicil', 'sabıka kaydı', 'arşiv kaydı',
        'sabıka belgesi', 'criminal record', 'police clearance'
    ],
    
    # Engelli Raporu
    'disability_report': [
        'engelli raporu', 'özürlü raporu', 'engellilik raporu',
        'sağlık kurulu raporu', 'engelli sağlık raporu',
        'disability report', 'health report'
    ],
    
    # Kardeş Öğrenci
    'sibling_student_certificate': [
        'kardeş öğrenci belgesi', 'kardeş öğrencilik',
        'sibling student certificate'
    ],
    
    # Afetzede
    'disaster_certificate': [
        'afetzede belgesi', 'afet belgesi', 'hasar tespit',
        'hasar raporu', 'deprem belgesi', 'disaster certificate'
    ],
    
    # Gelir Belgeleri
    'parent_income_document': [
        'gelir belgesi', 'maaş bordrosu', 'bordro',
        'emekli maaş', 'aylık belgesi', 'gelir döküm',
        'income certificate', 'salary slip', 'pay stub'
    ],
    
    # SGK
    'sgk_registration': [
        'sgk belgesi', 'sgk tescil', 'sigorta dökümü',
        '4a hizmet', '4b hizmet', '4c hizmet',
        'sosyal güvenlik', 'social security'
    ],
    
    # Vergi
    'tax_return': [
        'vergi beyannamesi', 'gelir vergisi', 'vergi beyanı',
        'tax return', 'income tax declaration'
    ],
    
    # Tapu
    'property_deed': [
        'tapu belgesi', 'tapu', 'taşınmaz belgesi',
        'emlak belgesi', 'property deed', 'title deed'
    ],
    
    # Araç
    'vehicle_registration': [
        'araç tescil', 'araç belgesi', 'ruhsat',
        'araç kayıt', 'vehicle registration', 'car registration'
    ],
    
    # Kira
    'rental_contract': [
        'kira kontratı', 'kira sözleşmesi', 'kira belgesi',
        'rental contract', 'lease agreement'
    ],
    
    # Mal Varlığı
    'asset_declaration': [
        'mal varlığı', 'varlık beyanı', 'mal bildirim',
        'asset declaration', 'wealth statement'
    ],
    
    # Fotoğraf
    'photo': [
        'fotoğraf', 'vesikalık', 'vesikalık fotoğraf',
        'biyometrik fotoğraf', 'photo', 'passport photo'
    ],
    
    # Diploma/Transkript
    'diploma': [
        'diploma', 'mezuniyet belgesi', 'graduation certificate'
    ],
    
    'transcript': [
        'transkript', 'not dökümü', 'başarı belgesi',
        'transcript', 'grade report'
    ],
    
    # Referans Mektubu
    'reference_letter': [
        'referans mektubu', 'tavsiye mektubu', 'öneri mektubu',
        'reference letter', 'recommendation letter'
    ],
    
    # Niyet Mektubu
    'motivation_letter': [
        'niyet mektubu', 'motivasyon mektubu', 'amaç mektubu',
        'motivation letter', 'statement of purpose'
    ],
    
    # Özgeçmiş
    'cv': [
        'cv', 'özgeçmiş', 'resume', 'curriculum vitae'
    ]
}


def normalize_document_name(doc_name: str) -> str:
    """
    Belge adını normalize eder
    
    Args:
        doc_name: Ham belge adı
        
    Returns:
        Normalize edilmiş canonical ad
    """
    if not doc_name:
        return 'other_document'
    
    # Küçük harfe çevir ve temizle
    doc_name = doc_name.lower().strip()
    
    # Mapping'de ara
    for canonical_name, synonyms in DOCUMENT_MAPPING.items():
        for synonym in synonyms:
            if synonym in doc_name:
                return canonical_name
    
    # Bulunamazsa olduğu gibi döndür
    return doc_name.replace(' ', '_')


def categorize_documents(documents_list: list) -> dict:
    """
    Belgeleri mandatory, optional, conditional olarak kategorize eder
    
    Args:
        documents_list: Ham belge listesi
        
    Returns:
        Kategorize edilmiş belgeler dict
    """
    # Mandatory documents (genellikle her yerde istenen)
    MANDATORY_DOCS = {
        'identity_document', 'student_certificate', 'family_registry',
        'exam_result', 'residence_certificate'
    }
    
    # Conditional documents (duruma göre istenen)
    CONDITIONAL_DOCS = {
        'parent_income_document', 'sgk_registration', 'tax_return',
        'property_deed', 'vehicle_registration', 'rental_contract'
    }
    
    categorized = {
        'mandatory': [],
        'optional': [],
        'conditional': []
    }
    
    for doc in documents_list:
        normalized = normalize_document_name(doc)
        
        if normalized in MANDATORY_DOCS:
            categorized['mandatory'].append(normalized)
        elif normalized in CONDITIONAL_DOCS:
            categorized['conditional'].append(normalized)
        else:
            categorized['optional'].append(normalized)
    
    return categorized


def extract_requirements_from_text(text: str) -> dict:
    """
    Metin içinden gereksinimleri çıkarır
    
    Args:
        text: Burs açıklama metni
        
    Returns:
        Extracted requirements dict
    """
    import re
    
    requirements = {}
    
    # Minimum yaş
    age_match = re.search(r'(\d{1,2})\s*yaş', text, re.IGNORECASE)
    if age_match:
        requirements['age_min'] = int(age_match.group(1))
    
    # Minimum puan
    score_match = re.search(r'(\d{2,3}\.?\d*)\s*(puan|skor)', text, re.IGNORECASE)
    if score_match:
        requirements['min_score'] = float(score_match.group(1).replace('.', ''))
    
    # Minimum not ortalaması
    gpa_match = re.search(r'(\d\.\d{2})\s*(not|ortalama|gpa)', text, re.IGNORECASE)
    if gpa_match:
        requirements['min_gpa'] = float(gpa_match.group(1))
    
    # Uyruk
    if 't.c.' in text.lower() or 'türk vatandaşı' in text.lower():
        requirements['nationality_requirement'] = 'TC'
    
    # Cinsiyet
    if 'erkek öğrenci' in text.lower():
        requirements['gender'] = 'male'
    elif 'kız öğrenci' in text.lower() or 'kadın öğrenci' in text.lower():
        requirements['gender'] = 'female'
    else:
        requirements['gender'] = 'all'
    
    return requirements


if __name__ == '__main__':
    # Test
    test_docs = [
        'Kimlik Fotokopisi',
        'Vukuatlı Nüfus Kayıt Belgesi',
        'YKS Sonuç Belgesi',
        'Maaş Bordrosu (Anne/Baba)',
        'Engelli Sağlık Raporu'
    ]
    
    print("Test: Belge Normalizasyonu")
    print("=" * 50)
    for doc in test_docs:
        normalized = normalize_document_name(doc)
        print(f"{doc:40} → {normalized}")
    
    print("\nTest: Belge Kategorizasyonu")
    print("=" * 50)
    categorized = categorize_documents(test_docs)
    for category, docs in categorized.items():
        print(f"\n{category.upper()}:")
        for doc in docs:
            print(f"  - {doc}")

