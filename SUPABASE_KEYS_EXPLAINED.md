# 🔑 Supabase Keys Açıklaması

## 📚 Supabase'de İki Tür Key Var

### 1. 🔓 Anon Key (Public Key) - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Ne için kullanılır:**
- Client-side (tarayıcıda) kullanılır
- Public olarak paylaşılabilir (güvenli)
- Row Level Security (RLS) politikalarına tabidir
- Kullanıcılar sadece izin verilen verilere erişebilir

**Özellikler:**
- ✅ Public - kodunuzda görünebilir
- ✅ Güvenli - RLS ile korunur
- ✅ Client-side kullanım için tasarlandı
- ✅ Herkese açık (public)

**Nerede kullanılır:**
- `lib/supabase.ts` - Client-side Supabase client
- Tarayıcıda çalışan tüm kodlar
- Next.js client components

**Örnek kullanım:**
```typescript
// lib/supabase.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
```

---

### 2. 🔒 Service Role Key (Secret Key) - `SUPABASE_SERVICE_ROLE_KEY`

**Ne için kullanılır:**
- Server-side (API routes) kullanılır
- **ASLA** client-side'da kullanılmamalı
- RLS politikalarını bypass eder
- Admin işlemleri için kullanılır

**Özellikler:**
- ❌ Secret - asla paylaşılmamalı
- ❌ RLS bypass - tüm verilere erişim
- ✅ Server-side only
- ⚠️ Çok güçlü - dikkatli kullanılmalı

**Nerede kullanılır:**
- `lib/supabase-server.ts` - Server-side Supabase client
- API routes (`app/api/*/route.ts`)
- Admin işlemleri

**Örnek kullanım:**
```typescript
// lib/supabase-server.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
export const supabaseServer = createServerClient(supabaseUrl, supabaseServiceKey)
```

---

## 🔐 Güvenlik Farkları

| Özellik | Anon Key | Service Role Key |
|---------|----------|------------------|
| **Public mi?** | ✅ Evet | ❌ Hayır |
| **RLS Kontrolü** | ✅ Var | ❌ Yok |
| **Kullanım Yeri** | Client-side | Server-side |
| **Güvenlik** | RLS ile korunur | Çok güçlü - dikkatli! |
| **Paylaşılabilir mi?** | ✅ Evet | ❌ Asla! |

---

## 📍 Nereden Bulabilirsiniz?

### Supabase Dashboard:
1. https://app.supabase.com → Projenizi seçin
2. Sol menüden **Settings** → **API**
3. **Project API keys** bölümünde:

**anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Bu key'i kodunuzda kullanabilirsiniz
- Public olarak paylaşılabilir
- RLS politikalarına tabidir

**service_role** → `SUPABASE_SERVICE_ROLE_KEY`
- ⚠️ Bu key'i ASLA paylaşmayın!
- Sadece server-side kullanın
- `.env.local` ve Vercel'de saklayın

---

## ✅ Doğru Kullanım

### ✅ Anon Key (Client-side)
```typescript
// lib/supabase.ts
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // ✅ Public key
)
```

### ✅ Service Role Key (Server-side)
```typescript
// lib/supabase-server.ts
const supabaseServer = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ✅ Secret key
)
```

---

## ❌ Yanlış Kullanım

### ❌ Service Role Key'i Client-side'da kullanmak
```typescript
// ❌ YANLIŞ!
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ❌ ASLA!
)
```

### ❌ Anon Key'i Server-side'da admin işlemleri için kullanmak
```typescript
// ❌ YANLIŞ! RLS engelleyebilir
const result = await supabase.from('users').delete() // ❌ Çalışmayabilir
```

---

## 🎯 Özet

- **Anon Key** = Public, güvenli, client-side için
- **Service Role Key** = Secret, güçlü, server-side için
- İkisi de Supabase Dashboard > Settings > API'de bulunur
- Anon key'i kodunuzda görebilirsiniz (güvenli)
- Service role key'i asla paylaşmayın!

