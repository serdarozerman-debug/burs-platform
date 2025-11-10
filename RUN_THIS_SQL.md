# ⚡ HEMEN BU SQL'İ ÇALIŞTIRIN!

## 📄 Dosya: INSERT_REAL_DATA_V2.sql

**Yeni schema'ya uyumlu versiyon!**

---

## 🎯 ADIMLAR (1 dakika)

### 1. Cursor'da Aç
```
📄 INSERT_REAL_DATA_V2.sql (yeni oluşturdum!)
```

### 2. Kopyala
```
Cmd+A → Cmd+C
```

### 3. Supabase'de Çalıştır
```
https://supabase.com/dashboard/project/hzebnzsjuqirmkewwaol/editor

→ New query
→ Cmd+V
→ RUN
→ ✅ Success!
```

### 4. Browser Yenile
```
http://localhost:3000
→ F5
```

---

## ✅ NE OLACAK?

**İlk çalıştırmada:**
1. ✅ 10 organization eklenir
2. ✅ 10 scholarship eklenir (organization_id ile bağlı)
3. ✅ Verification query çalışır
4. ✅ Sonuç gösterilir

**Browser'da göreceksiniz:**
```
✅ 10 burs kartı
✅ Organizasyon adları
✅ Logolar
✅ Filtreler çalışır
✅ Pagination çalışır
```

---

## 🔧 FARK: ESKİ vs YENİ

### ❌ Eski Schema (INSERT_TEST_DATA.sql):
```sql
INSERT INTO scholarships (
  organization,  -- ❌ Bu kolon yok artık
  organization_logo,  -- ❌ Bu kolon yok
  ...
)
```

### ✅ Yeni Schema (INSERT_REAL_DATA_V2.sql):
```sql
-- Önce organizations
INSERT INTO organizations (name, logo_url, ...)

-- Sonra scholarships
INSERT INTO scholarships (
  organization_id,  -- ✅ Foreign key
  slug,  -- ✅ Unique slug gerekli
  ...
)
```

---

# 🚀 HEMEN ÇALIŞTIRIN!

**Cursor → INSERT_REAL_DATA_V2.sql → Kopyala → Supabase RUN!**

