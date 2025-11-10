# 🔧 HIZLI FIX TALİMATLARI

**Tarih:** 10 Kasım 2024, 15:00  
**Sorunlar:** Logo bozuk + Burslar gelmiyor

---

## ⚡ HEMEN ŞİMDİ: TEST VERİSİ EKLE (2 dakika)

### Adım 1: SQL Dosyasını Aç

**Cursor'da:**
```
📂 INSERT_TEST_DATA.sql (yeni oluşturdum!)
```

---

### Adım 2: SQL'i Kopyala

1. ✅ Tümünü seç: **Cmd+A**
2. ✅ Kopyala: **Cmd+C**

---

### Adım 3: Supabase'de Çalıştır

**SQL Editor'da:**
```
🌐 https://supabase.com/dashboard/project/hzebnzsjuqirmkewwaol/editor
```

1. ✅ "New query" tıkla
2. ✅ Paste: **Cmd+V**
3. ✅ **"RUN"** tıkla
4. ✅ Success! **10 burs eklendi**

---

### Adım 4: Doğrula

**Table Editor → scholarships**

10 burs görmelisiniz:
```
✅ Vehbi Koç Vakfı
✅ İBB
✅ TÜBİTAK
✅ TEV
✅ Sabancı Vakfı
✅ Koç Üniversitesi
✅ Anadolu Üniversitesi
✅ Darüşşafaka
✅ Boğaziçi Üniversitesi
✅ Engelsiz Eğitim Vakfı
```

---

### Adım 5: Browser'ı Yenile

```
🌐 http://localhost:3000
→ F5 veya Cmd+R (Sayfa yenileme)
```

**Artık bursları görmelisiniz!** 🎉

---

## 🖼️ LOGO SORUNU (Opsiyonel - Sonra Düzelt)

Logo sorunu bir image path problemi. Şu an kritik değil, burslar daha önemli!

**Nasıl Düzeltilir (sonra):**
```typescript
// components/Layout/Layout.tsx veya Header.tsx
<Image 
  src="/logo.png"  // public klasöründe olmalı
  alt="jobBox"
  width={120}
  height={40}
/>
```

---

## ✅ BEKLENTİLER

**SQL çalıştırdıktan sonra:**

### Homepage'de göreceksiniz:
```
✅ 10 burs kartı
✅ "Öne Çıkan Burslar" bölümü dolu
✅ Filtreleme çalışıyor
✅ Sayfalama çalışıyor
✅ No more "Henüz burs bulunmamaktadır" mesajı
```

---

## 🧪 TEST

### 1. Burslar Geldi Mi?
```
Homepage → 10 burs kartı görülmeli
```

### 2. Filtreleme Çalışıyor Mu?
```
Sol taraf "Gelişmiş Filtreler"
→ Akademik seç
→ Sadece akademik burslar görünmeli
```

### 3. Arama Çalışıyor Mu?
```
Arama kutusuna "Koç" yaz
→ Koç Üniversitesi ve Vehbi Koç Vakfı görünmeli
```

---

## 📊 ÖZETİ

**Sorun:**
- ❌ Database boş (yeni Supabase, veri yok)
- ❌ Logo image yolu hatalı

**Çözüm:**
- ✅ 10 test bursu ekle (INSERT_TEST_DATA.sql)
- ⏳ Logo sorunu sonra düzeltilir (kritik değil)

**Süre:**
- Test verisi: 2 dakika
- Logo düzeltme: 5 dakika (opsiyonel)

---

## 🚀 HEMEN BAŞLA!

1. ✅ `INSERT_TEST_DATA.sql` aç
2. ✅ Kopyala
3. ✅ Supabase SQL Editor'da çalıştır
4. ✅ Browser'ı yenile
5. 🎉 Bursları gör!

---

**İyi Şanslar!** 💪

