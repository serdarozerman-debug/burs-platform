# 🚀 BURS PLATFORM v2.0 - ARCHITECTURE

## Sistem Topolojisi

```
┌─────────────────────────────────────────────────────────────┐
│                     BURS PLATFORM v2.0                      │
│                    (Full-Stack Platform)                    │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   KURUM PANELI   │     │  ÖĞRENCİ PANELI  │     │   PUBLIC VIEW    │
│  (Organization)  │     │    (Student)     │     │   (Anonymous)    │
├──────────────────┤     ├──────────────────┤     ├──────────────────┤
│ • Sign Up        │     │ • Sign Up        │     │ • Burs Listesi   │
│ • Login          │     │ • Login          │     │ • Filtreleme     │
│ • Burs Ekle      │     │ • Profile        │     │ • Detay Görüntü  │
│ • Burs Düzenle   │     │ • Burs Wallet    │     │ • Chatbot        │
│ • Başvuruları    │     │ • Başvurular     │     │                  │
│   Gör            │     │ • Favori Burslar │     │                  │
│ • İstatistikler  │     │ • Eşleştirme     │     │                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

## Database Schema (v2.0)

### Core Tables

#### 1. users (Supabase Auth)
```sql
- id (uuid, PK)
- email (text, unique)
- role (enum: 'student', 'organization', 'admin')
- created_at (timestamp)
- updated_at (timestamp)
```

#### 2. organizations
```sql
- id (uuid, PK)
- user_id (uuid, FK → users.id)
- name (text)
- category (text)
- website (text)
- logo_url (text)
- description (text)
- contact_email (text)
- contact_phone (text)
- verified (boolean)
- created_at (timestamp)
```

#### 3. students
```sql
- id (uuid, PK)
- user_id (uuid, FK → users.id)
- first_name (text)
- last_name (text)
- tc_no (text, encrypted)
- birth_date (date)
- phone (text)
- education_level (text)
- university (text)
- department (text)
- gpa (numeric)
- profile_photo (text)
- created_at (timestamp)
```

#### 4. scholarships (Mevcut + Yeni)
```sql
- id (uuid, PK)
- organization_id (uuid, FK → organizations.id)
- created_by_user_id (uuid, FK → users.id) -- Kurum kullanıcısı
- title (text)
- amount (numeric)
- deadline (date)
- quota (integer) -- Kontenjan
- filled_quota (integer) -- Dolmuş kontenjan
- status (enum: 'draft', 'active', 'closed', 'expired')
- visibility (enum: 'public', 'private')
... (mevcut kolonlar devam)
```

#### 5. applications
```sql
- id (uuid, PK)
- scholarship_id (uuid, FK → scholarships.id)
- student_id (uuid, FK → students.id)
- status (enum: 'pending', 'approved', 'rejected', 'withdrawn')
- submitted_at (timestamp)
- reviewed_at (timestamp)
- reviewed_by (uuid, FK → users.id)
- notes (text)
- documents (jsonb) -- Yüklenen belgeler
```

#### 6. student_wallet
```sql
- id (uuid, PK)
- student_id (uuid, FK → students.id)
- scholarship_id (uuid, FK → scholarships.id)
- status (enum: 'applied', 'shortlisted', 'favorite', 'matched')
- match_score (integer) -- AI eşleştirme skoru
- added_at (timestamp)
```

#### 7. documents
```sql
- id (uuid, PK)
- student_id (uuid, FK → students.id)
- document_type (text) -- 'identity', 'transcript', 'photo'
- file_url (text) -- Supabase Storage
- file_name (text)
- file_size (integer)
- uploaded_at (timestamp)
- verified (boolean)
```

#### 8. chatbot_sessions
```sql
- id (uuid, PK)
- user_id (uuid, FK → users.id, nullable)
- session_id (text)
- messages (jsonb[])
- created_at (timestamp)
- last_message_at (timestamp)
```

## API Endpoints (v2.0)

### Public API
```
GET  /api/scholarships              - Burs listesi (pagination + filters)
GET  /api/scholarships/[id]         - Burs detayı
POST /api/chatbot                   - AI chatbot
```

### Student API (Auth Required)
```
GET    /api/student/profile         - Öğrenci profili
PUT    /api/student/profile         - Profil güncelleme
GET    /api/student/wallet          - Burs cüzdanı
POST   /api/student/wallet          - Bursa ekle (favorite/applied)
GET    /api/student/applications    - Başvuru listesi
POST   /api/student/applications    - Yeni başvuru
POST   /api/student/upload          - Belge yükleme
GET    /api/student/matches         - AI eşleştirme
```

### Organization API (Auth Required)
```
GET    /api/org/dashboard           - İstatistikler
GET    /api/org/scholarships        - Kurum bursları
POST   /api/org/scholarships        - Yeni burs ekle
PUT    /api/org/scholarships/[id]   - Burs güncelle
DELETE /api/org/scholarships/[id]   - Burs sil
GET    /api/org/applications        - Başvurular
PUT    /api/org/applications/[id]   - Başvuru değerlendir
```

## Pages Structure

```
app/
├── (public)/
│   ├── page.tsx                    -- Ana sayfa (burs listesi)
│   ├── burs/[id]/page.tsx         -- Burs detay
│   └── chatbot/page.tsx           -- Standalone chatbot
│
├── (auth)/
│   ├── login/page.tsx             -- Login (hem öğrenci hem kurum)
│   ├── signup/
│   │   ├── student/page.tsx       -- Öğrenci kayıt
│   │   └── organization/page.tsx  -- Kurum kayıt
│   └── forgot-password/page.tsx
│
├── student/
│   ├── layout.tsx                 -- Student layout (protected)
│   ├── dashboard/page.tsx         -- Öğrenci dashboard
│   ├── profile/page.tsx           -- Profil yönetimi
│   ├── wallet/page.tsx            -- Burs cüzdanı
│   ├── applications/page.tsx      -- Başvurularım
│   ├── documents/page.tsx         -- Belgelerim
│   └── matches/page.tsx           -- Eşleşen burslar (AI)
│
├── organization/
│   ├── layout.tsx                 -- Org layout (protected)
│   ├── dashboard/page.tsx         -- Kurum dashboard
│   ├── scholarships/
│   │   ├── page.tsx               -- Burs listesi
│   │   ├── new/page.tsx           -- Yeni burs ekle
│   │   └── [id]/edit/page.tsx     -- Burs düzenle
│   ├── applications/page.tsx      -- Başvuru yönetimi
│   └── settings/page.tsx          -- Kurum ayarları
│
└── api/
    ├── auth/
    ├── student/
    ├── org/
    ├── scholarships/
    └── chatbot/
```

## Authentication Flow

### Student Registration
1. Sign up form (email, password, ad, soyad)
2. Email verification
3. Profile completion (TC, doğum tarihi, eğitim bilgileri)
4. Document upload (optional)

### Organization Registration
1. Sign up form (email, password, kurum adı)
2. Email verification
3. Organization details (kategori, website, iletişim)
4. Admin approval (verified = false initially)

### Login
1. Unified login page
2. Role detection from database
3. Redirect to appropriate dashboard

## AI Features

### 1. Chatbot (Public + Student)
- Burs sorguları yanıtla
- Eligibility kontrolü
- Başvuru rehberliği
- Multi-turn conversation
- Context-aware

### 2. Smart Matching (Student)
- Öğrenci profili analizi
- Burs kriterleri eşleştirme
- Match score hesaplama
- Öneri sistemi

### 3. Document Verification (Future)
- OCR ile belge okuma
- Otomatik doğrulama
- Fraud detection

## File Upload System

### Supabase Storage Buckets
```
/student-documents/
  /{student_id}/
    /identity/
    /transcripts/
    /photos/
    /other/
```

### Upload Flow
1. Student selects file
2. Frontend validates (type, size)
3. Upload to Supabase Storage
4. Save metadata to `documents` table
5. Return file URL

## Next Steps (Implementation Order)

### Phase 1: Authentication (Week 1)
- [ ] Supabase Auth setup
- [ ] User roles table
- [ ] Login/Signup pages
- [ ] Protected routes middleware

### Phase 2: Student Panel (Week 1-2)
- [ ] Student profile
- [ ] Wallet system
- [ ] Application flow
- [ ] Document upload

### Phase 3: Organization Panel (Week 2)
- [ ] Org dashboard
- [ ] Scholarship CRUD
- [ ] Application management
- [ ] Statistics

### Phase 4: AI Features (Week 3)
- [ ] Chatbot integration
- [ ] Smart matching algorithm
- [ ] Semantic search

### Phase 5: Polish (Week 3-4)
- [ ] Email notifications
- [ ] Admin panel
- [ ] Analytics
- [ ] Testing

## Technology Stack (Updated)

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- React Hook Form (form validation)
- Zustand (state management)

### Backend
- Next.js API Routes
- Supabase (PostgreSQL + Auth + Storage)
- OpenAI GPT-4o-mini (Chatbot + Matching)
- Anthropic Claude (Alternative chatbot)

### DevOps
- Vercel (Deployment)
- GitHub Actions (CI/CD)
- Supabase (Hosting)

## Security

- Row Level Security (RLS) on all tables
- JWT-based authentication
- File upload validation
- Rate limiting on AI endpoints
- GDPR compliance (TC no encryption)

## Estimated Timeline

- Phase 1: 3-4 days
- Phase 2: 5-7 days
- Phase 3: 4-5 days
- Phase 4: 5-7 days
- Phase 5: 5-7 days

**Total: 3-4 weeks for full implementation**

