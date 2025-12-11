#!/usr/bin/env python3
"""
Content management tablolarını oluşturan script
"""
import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

# .env.local dosyasını yükle
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local')
load_dotenv(env_path)

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("HATA: NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY .env.local dosyasında tanımlı olmalı")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

SQL_SCRIPT = """
-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    author VARCHAR(255),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Homepage Content Table
CREATE TABLE IF NOT EXISTS homepage_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Footer Content Table
CREATE TABLE IF NOT EXISTS footer_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255),
    description TEXT,
    links JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default homepage content
INSERT INTO homepage_content (key, title, content) VALUES
    ('hero_title', 'Ana Başlık', 'Tüm Burslar'),
    ('hero_subtitle', 'Alt Başlık', 'Yurtiçi ve yurtdışındaki üniversite burslarına kolayca ulaşın'),
    ('hero_description', 'Açıklama', 'Tüm Burslar platformu ile binlerce burs fırsatını keşfedin')
ON CONFLICT (key) DO NOTHING;

-- Insert default footer content
INSERT INTO footer_content (section, title, description, links) VALUES
    ('home', 'Ana Sayfa', '', '[{"label": "Ana Sayfa", "url": "/"}]'::jsonb),
    ('about', 'Hakkımızda', '', '[{"label": "Hakkımızda", "url": "/hakkimizda"}]'::jsonb),
    ('blog', 'Blog', '', '[{"label": "Blog", "url": "/blog-grid"}]'::jsonb),
    ('contact', 'İletişim', '', '[{"label": "İletişim", "url": "/#contact-section"}]'::jsonb)
ON CONFLICT (section) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_homepage_content_key ON homepage_content(key);
CREATE INDEX IF NOT EXISTS idx_footer_content_section ON footer_content(section);
"""

def create_tables():
    """Tabloları oluştur"""
    print(f"\n{'='*60}")
    print("Content Management Tabloları Oluşturuluyor")
    print(f"{'='*60}\n")
    
    try:
        # SQL'i satır satır çalıştır
        statements = [s.strip() for s in SQL_SCRIPT.split(';') if s.strip() and not s.strip().startswith('--')]
        
        for i, statement in enumerate(statements, 1):
            if statement:
                print(f"{i}. Çalıştırılıyor: {statement[:50]}...")
                try:
                    # Supabase Python client SQL çalıştırmayı desteklemiyor
                    # Bu yüzden kullanıcıya SQL'i manuel çalıştırmasını söylemeliyiz
                    pass
                except Exception as e:
                    print(f"   Hata: {e}")
        
        print("\n⚠ ÖNEMLİ: Supabase Python client SQL çalıştırmayı desteklemiyor.")
        print("Lütfen SQL script'ini Supabase Dashboard > SQL Editor'de çalıştırın:")
        print("\n1. https://app.supabase.com adresine gidin")
        print("2. Projenizi seçin")
        print("3. Sol menüden 'SQL Editor' seçin")
        print("4. scripts/create_content_tables.sql dosyasındaki SQL'i kopyalayıp yapıştırın")
        print("5. 'Run' butonuna tıklayın")
        print("\nVeya SQL dosyasını okuyun:")
        print("   cat scripts/create_content_tables.sql")
        
    except Exception as e:
        print(f"✗ Hata: {e}")

if __name__ == "__main__":
    create_tables()

