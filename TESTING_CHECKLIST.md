# ✅ TESTING CHECKLIST - Hata Önleme Sistemi

**Bu checklist'i her değişiklikten sonra çalıştırın!**

---

## 🎯 AMAÇ

**Aynı hataları tekrar yapmamak için:**
- ✅ Sistemli test
- ✅ Validation
- ✅ Error checking
- ✅ Documentation

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### 1. DATABASE SCHEMA ✅
- [ ] Tüm NOT NULL kolonlar dolduruldu mu?
- [ ] ENUM values doğru mu? (Türkçe/İngilizce kontrol)
- [ ] Foreign keys çalışıyor mu?
- [ ] Unique constraints tanımlı mı?

**Test:**
```sql
-- Supabase SQL Editor'da çalıştır
SELECT table_name, column_name, is_nullable, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND is_nullable = 'NO'
ORDER BY table_name, ordinal_position;
```

---

### 2. API ENDPOINTS ✅
- [ ] Tüm endpoint'ler JSON döndürüyor mu?
- [ ] JOIN'lar çalışıyor mu?
- [ ] Pagination çalışıyor mu?
- [ ] Error handling var mı?

**Test:**
```bash
# Her endpoint'i test et
curl http://localhost:3000/api/scholarships?limit=1
curl http://localhost:3000/api/admin/favicon
curl http://localhost:3000/api/chatbot  # (POST test)
```

---

### 3. FRONTEND TYPE COMPATIBILITY ✅
- [ ] TypeScript types güncellendi mi?
- [ ] Null checks var mı? (optional chaining)
- [ ] Schema ile uyumlu mu?

**Test:**
```bash
# TypeScript compile
npm run build

# Check for errors
grep -r "scholarship.organization[^?]" app/
grep -r "organization_logo" app/
```

---

### 4. MIDDLEWARE & AUTH ✅
- [ ] Public routes tanımlı mı?
- [ ] API routes bypass ediliyor mu?
- [ ] Register routes public mu?
- [ ] Redirect logic çalışıyor mu?

**Test:**
```bash
# Public routes test
curl -I http://localhost:3000/
curl -I http://localhost:3000/login
curl -I http://localhost:3000/register/student

# Should return 200, not 302/404
```

---

### 5. PAGINATION ✅
- [ ] totalPages > 1 kontrolü var mı?
- [ ] currentPage state doğru mu?
- [ ] Sayfa değiştirme çalışıyor mu?
- [ ] 10 sayfa limiti var mı?

**Test:**
```typescript
// app/page.tsx kontrol et:
- totalCount kullanılıyor mu?
- totalCount > ITEMS_PER_PAGE kontrolü var mı?
- Math.min(totalPages, 10) limiti var mı?
```

---

### 6. FAVICON SYSTEM ✅
- [ ] organization.logo_url kullanılıyor mu?
- [ ] Fallback gradient çalışıyor mu?
- [ ] Admin panel erişilebilir mi?
- [ ] Update endpoint çalışıyor mu?

**Test:**
```bash
curl http://localhost:3000/api/admin/favicon
curl http://localhost:3000/api/admin/favicon?missing=true
```

---

## 🧪 MANUEL BROWSER TEST

### Homepage Tests:
```
1. ✅ http://localhost:3000 yükleniyor
2. ✅ Burslar gösteriliyor (10 adet)
3. ✅ Logolar gösteriliyor
4. ✅ Pagination gösteriliyor (varsa)
5. ✅ Filtreler çalışıyor
6. ✅ Arama çalışıyor
7. ✅ Console temiz (F12 - no errors)
```

### Auth Tests:
```
1. ✅ /login sayfası açılıyor
2. ✅ /register/student açılıyor
3. ✅ /register/organization açılıyor
4. ✅ Form submit çalışıyor
5. ✅ Redirect logic çalışıyor
```

### Mobile Tests:
```
1. ✅ Responsive design çalışıyor
2. ✅ Bottom navigation görünüyor (<768px)
3. ✅ Touch-friendly (44px buttons)
4. ✅ Hamburger menu çalışıyor
```

---

## 🔍 COMMON ISSUES & SOLUTIONS

### Issue 1: "Pagination gösterilmiyor"
**Kontrol:**
```typescript
// totalPages > 1 yerine totalCount kullan
{totalCount > ITEMS_PER_PAGE && (...)}
```

### Issue 2: "Organization undefined"
**Kontrol:**
```typescript
// Optional chaining kullan
scholarship.organization?.name
scholarship.organization?.logo_url
```

### Issue 3: "Register çalışmıyor"
**Kontrol:**
```typescript
// middleware.ts - register routes public olmalı
req.nextUrl.pathname.startsWith('/register/')
```

### Issue 4: "ENUM value error"
**Kontrol:**
```sql
-- ENUM values Türkçe mi İngilizce mi?
SELECT enum_range(NULL::organization_type);
SELECT enum_range(NULL::amount_type);
```

### Issue 5: "Column not found"
**Kontrol:**
```sql
-- Tablo structure kontrol
\d+ scholarships
\d+ organizations
```

---

## 📊 AUTOMATED CHECKS

### Pre-Commit Hook (Opsiyonel):
```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "🔍 Running pre-commit checks..."

# TypeScript check
npm run build || exit 1

# Lint check
npm run lint || exit 1

echo "✅ All checks passed!"
```

---

## 🚀 DEPLOYMENT CHECKLIST

### Before Deploy:
- [ ] npm run build başarılı
- [ ] Tüm tests geçti
- [ ] .env.local production için güncellendi
- [ ] Database production'da hazır
- [ ] Secrets konfigüre edildi

### After Deploy:
- [ ] Production URL test edildi
- [ ] SSL sertifikası aktif
- [ ] DNS ayarları doğru
- [ ] Monitoring aktif
- [ ] Backup yapılandırıldı

---

## 📝 HATA RAPOR TEMPLATE

Her hatada şunu doldurun:

```markdown
## Hata: [Kısa açıklama]

**Tarih:** [YYYY-MM-DD]
**Etki:** [Low/Medium/High/Critical]

**Belirti:**
- [Hata mesajı]
- [Görsel/log]

**Kök Neden:**
- [Analiz]

**Çözüm:**
- [Yapılan değişiklik]

**Test:**
- [Nasıl doğrulandı]

**Önleme:**
- [Gelecekte nasıl önlenir]
```

---

## 🎯 KALİTE STANDARTLARı

### Code Quality:
```
✅ TypeScript strict mode
✅ ESLint rules
✅ No console.log in production
✅ Error boundaries
✅ Try-catch blocks
```

### Performance:
```
✅ Database indexes
✅ API pagination
✅ Image optimization
✅ Code splitting
✅ Caching strategy
```

### Security:
```
✅ Environment variables
✅ RLS policies
✅ Input validation
✅ SQL injection prevention
✅ XSS protection
```

---

## ✅ BU CHECKLIST'İ KULLANIN!

**Her değişiklikten önce:**
1. Neyi değiştiriyorum?
2. Hangi dosyalar etkilenecek?
3. Schema compatibility var mı?
4. Test stratejim ne?

**Her değişiklikten sonra:**
1. Build çalışıyor mu?
2. API test ettim mi?
3. Browser'da test ettim mi?
4. Commit message açıklayıcı mı?

---

**Bu checklist hayat kurtarır! 💪**

