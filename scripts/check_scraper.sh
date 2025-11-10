#!/bin/bash
# Scraper progress checker

cd "/Users/serdarozerman/Desktop/jobbox-react/1. JobBox-Nextjs 15 (app router)/scripts"

echo "=== 🤖 SCRAPER DURUM RAPORU ==="
echo ""

# Check if running
if ps aux | grep "scrape_non_universities" | grep -v grep > /dev/null; then
    echo "✅ Scraper ÇALIŞIYOR"
    echo ""
    
    # Show process info
    ps aux | grep "scrape_non_universities" | grep -v grep | awk '{print "Process ID:", $2, "| Süre:", $10, "| CPU:", $3"%"}'
    echo ""
    
    # Check log file
    if [ -f "scraper_output.log" ]; then
        echo "📋 Log Satırları: $(wc -l < scraper_output.log)"
        echo ""
        echo "📝 Son 10 Satır:"
        echo "---"
        tail -10 scraper_output.log | grep -v "InsecureRequestWarning" || tail -3 scraper_output.log
    fi
else
    echo "❌ Scraper çalışmıyor"
    
    # Check if completed
    if [ -f "scraper_output.log" ]; then
        echo ""
        echo "📊 Son Durum:"
        tail -5 scraper_output.log
    fi
fi

echo ""
echo "=== 📊 DATABASE DURUM ==="
echo ""

# Check database
cd ..
RESULT=$(curl -s 'http://localhost:3000/api/scholarships?limit=1')
COUNT=$(echo $RESULT | grep -o '"total":[0-9]*' | grep -o '[0-9]*')

if [ -n "$COUNT" ]; then
    echo "✅ Database'de $COUNT burs var"
else
    echo "⏳ Henüz veri yüklenmedi"
fi

echo ""
echo "=== KULLANIM ==="
echo "Bu script'i tekrar çalıştırmak için:"
echo "bash scripts/check_scraper.sh"

