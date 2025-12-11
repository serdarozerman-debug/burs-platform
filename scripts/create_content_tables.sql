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
    ('hero_title', 'Ana Başlık', 'BursBuldum'),
    ('hero_subtitle', 'Alt Başlık', 'Yurtiçi ve yurtdışındaki üniversite burslarına kolayca ulaşın'),
    ('hero_description', 'Açıklama', 'BursBuldum platformu ile binlerce burs fırsatını keşfedin')
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

