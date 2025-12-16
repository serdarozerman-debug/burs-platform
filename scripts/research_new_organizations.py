"""
AI destekli yeni burs veren kurum araştırması
Her hafta yeni kurumları otomatik bulur ve SITES listesine ekler
"""
import os
from dotenv import load_dotenv
from openai import OpenAI
import json

load_dotenv('.env.local')

openai_api_key = os.environ.get("OPENAI_API_KEY")
openai_client = OpenAI(api_key=openai_api_key)

def research_new_organizations():
    """AI ile yeni burs veren kurumları araştır"""
    
    prompt = """
    Türkiye'de öğrencilere burs veren kurumları araştır ve listele.
    
    ÖNCELİK SIRASINA GÖRE:
    1. Vakıflar ve dernekler
    2. Yabancı vakıflar (Türkiye'de aktif)
    3. Belediyeler
    4. Özel şirketler
    5. Kamu kurumları
    
    HER KURUM İÇİN:
    - Kurum adı
    - Website (deep link - direkt burs sayfası tercihen)
    - Tip (vakıf, dernek, kamu, özel sektör)
    - Ülke
    
    ÖNEMLİ:
    - Sadece AKTIF burs programı olan kurumları ekle
    - Website mutlaka çalışır olmalı
    - Burs sayfasına direkt link ver (örn: /burslar, /scholarships)
    
    ÇIKTI FORMATI (JSON):
    {
        "organizations": [
            {
                "name": "Kurum Adı",
                "website": "https://www.kurum.com.tr/burslar",
                "type": "vakıf",
                "country": "Türkiye",
                "deep_link_works": true
            }
        ]
    }
    
    En az 10 yeni kurum öner.
    """
    
    try:
        print("🔍 AI ile yeni kurumlar araştırılıyor...")
        print("="*60)
        
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "Sen Türkiye'deki eğitim ve burs sistemini çok iyi bilen bir araştırmacısın. Aktif burs programlarını ve kurumlarını takip ediyorsun."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        organizations = result.get('organizations', [])
        
        print(f"✅ {len(organizations)} yeni kurum önerisi bulundu:\n")
        
        for i, org in enumerate(organizations, 1):
            print(f"{i}. {org.get('name')}")
            print(f"   Website: {org.get('website')}")
            print(f"   Tip: {org.get('type')}")
            print(f"   Deep Link: {'✅' if org.get('deep_link_works') else '❓'}")
            print()
        
        # Önerileri dosyaya kaydet
        with open('scripts/suggested_organizations.json', 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        print("💾 Öneriler 'scripts/suggested_organizations.json' dosyasına kaydedildi")
        print()
        print("📋 Sonraki adım: Bu kurumları manuel olarak SITES listesine ekleyin")
        print("    veya otomatik ekleme için validate_and_add_organizations.py çalıştırın")
        
        return organizations
    
    except Exception as e:
        print(f"❌ Araştırma hatası: {e}")
        return []

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🔍 YENİ KURUM ARAŞTIRMA SİSTEMİ")
    print("="*60 + "\n")
    
    if not openai_api_key:
        print("❌ OPENAI_API_KEY bulunamadı!")
        exit(1)
    
    orgs = research_new_organizations()
    
    print("\n" + "="*60)
    print(f"✅ Toplam {len(orgs)} yeni kurum önerisi")
    print("="*60)

