# 🏗️ BURS PLATFORM v2.0 - IMPLEMENTATION PLANI

## 📋 İÇİNDEKİLER
1. [Sistem Topolojisi](#topoloji)
2. [Kullanıcı Akışları](#akışlar)
3. [Burs Wallet Sistemi](#wallet)
4. [AI Chatbot](#chatbot)
5. [Mobile Responsive](#mobile)
6. [Implementation Adımları](#implementation)

---

## 🏛️ 1. SİSTEM TOPOLOJİSİ {#topoloji}

### A) Dosya Yapısı (Updated)

```
/app
  ├── (auth)                          # Auth layout group
  │   ├── login/
  │   │   └── page.tsx                # Login page (both types)
  │   ├── register/
  │   │   ├── student/page.tsx        # Student registration
  │   │   └── organization/page.tsx   # Organization registration
  │   └── forgot-password/page.tsx
  │
  ├── (student)                       # Student dashboard layout
  │   ├── dashboard/
  │   │   └── page.tsx                # Student dashboard
  │   ├── profile/
  │   │   └── page.tsx                # Student profile
  │   ├── wallet/
  │   │   ├── page.tsx                # Wallet main page
  │   │   └── upload/page.tsx         # Upload documents
  │   ├── applications/
  │   │   ├── page.tsx                # My applications
  │   │   └── [id]/page.tsx           # Application detail
  │   ├── favorites/
  │   │   └── page.tsx                # Favorite scholarships
  │   └── chatbot/
  │       └── page.tsx                # AI chatbot interface
  │
  ├── (organization)                  # Organization dashboard layout
  │   ├── dashboard/
  │   │   └── page.tsx                # Org dashboard
  │   ├── profile/
  │   │   └── page.tsx                # Org profile
  │   ├── scholarships/
  │   │   ├── page.tsx                # List scholarships
  │   │   ├── new/page.tsx            # Create scholarship
  │   │   └── [id]/
  │   │       ├── page.tsx            # View scholarship
  │   │       └── edit/page.tsx       # Edit scholarship
  │   ├── applications/
  │   │   ├── page.tsx                # Received applications
  │   │   └── [id]/page.tsx           # Application review
  │   └── analytics/
  │       └── page.tsx                # Stats & analytics
  │
  ├── api/
  │   ├── auth/
  │   │   ├── register/route.ts       # Registration endpoint
  │   │   └── profile/route.ts        # Profile management
  │   ├── scholarships/
  │   │   └── route.ts                # EXISTING - Update for org filtering
  │   ├── applications/
  │   │   └── route.ts                # Application management
  │   ├── wallet/
  │   │   ├── documents/route.ts      # Document CRUD
  │   │   └── upload/route.ts         # File upload
  │   └── chatbot/
  │       └── route.ts                # AI chatbot endpoint
  │
  ├── burs/                           # EXISTING - Public pages
  │   └── [id]/page.tsx               # Scholarship detail
  │
  └── page.tsx                        # EXISTING - Homepage

/components
  ├── auth/
  │   ├── LoginForm.tsx
  │   ├── RegisterForm.tsx
  │   └── ProtectedRoute.tsx
  │
  ├── student/
  │   ├── StudentLayout.tsx
  │   ├── WalletCard.tsx
  │   ├── ApplicationCard.tsx
  │   └── ProfileProgress.tsx
  │
  ├── organization/
  │   ├── OrgLayout.tsx
  │   ├── ScholarshipForm.tsx
  │   ├── ApplicationReview.tsx
  │   └── StatsCard.tsx
  │
  ├── chatbot/
  │   ├── ChatInterface.tsx
  │   ├── MessageBubble.tsx
  │   └── ScholarshipSuggestion.tsx
  │
  ├── wallet/
  │   ├── DocumentUpload.tsx
  │   ├── DocumentCard.tsx
  │   └── DocumentViewer.tsx
  │
  └── shared/
      ├── Navbar.tsx (Update with auth state)
      ├── Footer.tsx
      └── MobileMenu.tsx

/lib
  ├── supabase.ts                     # EXISTING - Extend with new types
  ├── auth.ts                         # NEW - Auth utilities
  ├── api-client.ts                   # NEW - API client wrapper
  └── chatbot.ts                      # NEW - Chatbot utilities

/hooks
  ├── useAuth.ts                      # Authentication hook
  ├── useStudent.ts                   # Student data hook
  ├── useOrganization.ts              # Organization data hook
  └── useChatbot.ts                   # Chatbot hook

/types
  ├── auth.ts                         # Auth types
  ├── student.ts                      # Student types
  ├── organization.ts                 # Organization types
  ├── application.ts                  # Application types
  ├── wallet.ts                       # Wallet types
  └── chatbot.ts                      # Chatbot types

/utils
  ├── validators.ts                   # Form validation
  ├── formatters.ts                   # Date, currency formatters
  └── permissions.ts                  # Permission checks
```

[Content continues with full implementation plan...]

