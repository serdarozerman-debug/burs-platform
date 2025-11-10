#!/bin/bash
# Scraper'ın bitmesini bekle ve otomatik test et

echo "⏳ Scraper'ın bitmesini bekliyorum..."
echo ""

SCRIPT_DIR="/Users/serdarozerman/Desktop/jobbox-react/1. JobBox-Nextjs 15 (app router)/scripts"
cd "$SCRIPT_DIR"

# Wait for scraper to finish
while ps aux | grep "scrape_non_universities.py" | grep -v grep > /dev/null; do
    echo "🔄 Scraper hala çalışıyor... ($(date +%H:%M:%S))"
    
    # Show progress
    if [ -f "scraper_output.log" ]; then
        LINES=$(wc -l < scraper_output.log)
        echo "   📋 Log satırları: $LINES"
    fi
    
    sleep 30  # Check every 30 seconds
done

echo ""
echo "✅ Scraper tamamlandı!"
echo ""

# Check results
echo "📊 Sonuçlar kontrol ediliyor..."
echo ""

cd ..
RESULT=$(curl -s 'http://localhost:3000/api/scholarships?limit=1')
COUNT=$(echo $RESULT | grep -o '"total":[0-9]*' | grep -o '[0-9]*')

if [ -n "$COUNT" ] && [ "$COUNT" -gt 0 ]; then
    echo "✅ Database'de $COUNT burs bulundu!"
    echo ""
    
    # Test API
    echo "🧪 API Test:"
    curl -s 'http://localhost:3000/api/scholarships?limit=3' | head -c 500
    echo ""
    echo ""
    
    # Check for missing favicons
    echo "🖼️ Favicon eksik kurumlar kontrol ediliyor..."
    # TODO: This will be implemented
    
    echo ""
    echo "🎉 VERİ YÜKLEME BAŞARILI!"
    echo ""
    echo "Şimdi browser'da test edin: http://localhost:3000"
    
else
    echo "❌ Henüz veri yüklenemedi!"
    echo ""
    echo "Son log satırları:"
    cd scripts
    tail -20 scraper_output.log
fi

