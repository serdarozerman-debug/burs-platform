#!/bin/bash

# BursBuldum - Production Deployment Hazırlık Scripti

echo "🚀 BursBuldum Deployment Hazırlığı Başlıyor..."
echo ""

# 1. Build testi
echo "📦 Build testi yapılıyor..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build hatası! Lütfen hataları düzeltin."
    exit 1
fi

echo "✅ Build başarılı!"
echo ""

# 2. Environment variables kontrolü
echo "🔍 Environment variables kontrol ediliyor..."
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local dosyası bulunamadı!"
    echo "Lütfen .env.local dosyasını oluşturun."
else
    echo "✅ .env.local dosyası mevcut"
fi

echo ""
echo "📋 Vercel'e eklemeniz gereken environment variables:"
echo ""
echo "NEXT_PUBLIC_SUPABASE_URL"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "SUPABASE_SERVICE_ROLE_KEY"
echo "RESEND_API_KEY"
echo "NEXT_PUBLIC_APP_URL=https://bursbuldum.com"
echo ""

# 3. Git kontrolü
echo "🔍 Git durumu kontrol ediliyor..."
if [ -d .git ]; then
    echo "✅ Git repository mevcut"
    echo ""
    echo "📝 Son commit:"
    git log -1 --oneline
else
    echo "⚠️  Git repository bulunamadı!"
    echo "GitHub'a push etmek için:"
    echo "  git init"
    echo "  git add ."
    echo "  git commit -m 'Initial commit'"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/bursbuldum.git"
    echo "  git push -u origin main"
fi

echo ""
echo "✅ Hazırlık tamamlandı!"
echo ""
echo "📖 Sonraki adımlar için DEPLOYMENT_GUIDE.md dosyasını okuyun."

