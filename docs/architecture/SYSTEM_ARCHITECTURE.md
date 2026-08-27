# Carpenterwala — System Architecture & Master API Directory

This document provides the high-level system architecture, complete REST API directory, security models, and database schema specifications for **Carpenterwala** (`carpenterwala.com`).

---

## 1. System Architecture Layers

```
                                  [ CUSTOMERS / VISITORS ]       [ SERVICE PROFESSIONALS ]       [ ADMINISTRATORS ]
                                             │                               │                           │
                                             ▼                               ▼                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                  EDGE & CDN ROUTING LAYER                                              │
│                                                     (Vercel Edge Network)                                              │
│                                            • DNS & SSL Termination (HTTPS/TLS)                                         │
│                                            • Static Asset Caching (Images, WebP, Fonts)                                │
│                                            • Middleware (Proxy routing, Geo headers)                                   │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                 │
                                                                 ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                           NEXT.JS 16 APPLICATION ARCHITECTURE                                          │
│                                                                                                                        │
│   ┌─────────────────────────────────────────────────┐     ┌────────────────────────────────────────────────────────┐   │
│   │               SERVER RUNTIME (SSR / SSG)        │     │                REACT CLIENT COMPONENTS                 │   │
│   │  • Static Prerendering (123+ SEO Landing Pages) │     │  • LeadCaptureModal / DirectCallModal                  │   │
│   │  • Blog & Service Hub SSG (generateStaticParams)│     │  • 4-Step Document Scanner Pro Onboarding              │   │
│   │  • Dynamic Pro Profiles (/[proSlug])            │     │  • Customer Bookings & 90-Day Warranty Center          │   │
│   │  • Metadata & Schema.org JSON-LD Generation     │     │  • Admin Audit & Rejection Decision Console            │   │
│   └─────────────────────────────────────────────────┘     └────────────────────────────────────────────────────────┘   │
│                                                                 │                                                      │
│   ┌─────────────────────────────────────────────────────────────┴──────────────────────────────────────────────────┐   │
│   │                                       REST API ROUTE HANDLERS (/api/*)                                         │   │
│   │  • /api/customer/otp, /leads, /warranties, /register     • /api/pro/otp, /profile, /verify-doc, /leads         │   │
│   │  • /api/reviews, /geo, /blog/comments                    • /api/admin/login, /profiles, /verify, /leads        │   │
│   └────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                 │
                                     ┌───────────────────────────┴──────────────────────────┐
                                     ▼                                                      ▼
┌─────────────────────────────────────────────────────────────┐ ┌────────────────────────────────────────────────────────┐
│                  SUPABASE POSTGRESQL DATABASE               │ │                   EXTERNAL CLOUD SERVICES              │
│  • Connection Pooling via @supabase/supabase-js             │ │  • Resend API (Transactional HTML Lead/Audit Notices)  │
│  • Row Level Security (RLS) policies                        │ │  • SMS Gateway / OTP Verification Service              │
│  • Tables: profiles, leads, customers, warranties, reviews  │ │  • LocalStorage / SessionStorage Browser State         │
└─────────────────────────────────────────────────────────────┘ └────────────────────────────────────────────────────────┘
```

---

## 2. Master REST API Endpoint Directory

### A. Customer Endpoints

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/customer/otp` | Dispatches or verifies customer OTP | `{ phone, action: 'send' \| 'verify', otp? }` | `{ success: true, message: '...' }` |
| `POST` | `/api/customer/register` | Registers customer profile in database | `{ name, phone, address }` | `{ success: true, customer: {...} }` |
| `POST` | `/api/customer/check` | Checks if customer is registered | `{ phone }` | `{ exists: boolean, customer: {...} }` |
| `POST` | `/api/leads` | Creates new service inquiry lead | `{ pro_id, name, phone, task, location }` | `{ success: true, lead: {...} }` |
| `GET` | `/api/customer/leads` | Fetches customer booking history | `?phone=9876543210` | `{ leads: [...] }` |
| `GET` | `/api/customer/warranties` | Lists customer 90-day warranties | `?phone=9876543210` | `{ warranties: [...] }` |
| `POST` | `/api/customer/warranties` | Files warranty claim or registers warranty | `{ action: 'claim', warranty_id, description }` | `{ success: true }` |

---

### B. Service Professional Endpoints

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/pro/otp` | Sends or verifies handyman login OTP | `{ phone, action: 'send' \| 'verify', otp? }` | `{ success: true, pro: {...} }` |
| `GET` | `/api/pro/profile` | Fetches pro profile, reviews, and audit state | `?id=12` | `{ profile: {...} }` |
| `PUT` | `/api/pro/profile` | Updates profile info, docs, avatar, or settings | `{ id, full_address, aadhaar_front, pan_front, ... }` | `{ success: true }` |
| `POST` | `/api/pro/verify-doc` | Scans uploaded doc for sharpness & dimensions | `FormData` (image file) | `{ valid: true, sharpness: 94, isDocument: true }` |
| `GET` | `/api/pro/leads` | Fetches leads assigned to professional | `?pro_id=12` | `{ leads: [...] }` |

---

### C. Administrator Endpoints

| Method | Endpoint | Description | Request Headers / Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/login` | Authenticates administrator with SHA-256 token | `{ password: '...' }` | `{ success: true, token: '...' }` |
| `GET` | `/api/admin/profiles` | Fetches all profiles for review/directory | `Authorization: Bearer <token>` | `{ success: true, profiles: [...] }` |
| `POST` | `/api/admin/verify` | Approves or declines profile documents | `Authorization: Bearer <token>`<br/>`{ proId, action: 'verify' \| 'reject', reasons?, targetStep? }` | `{ success: true, message: '...' }` |
| `GET` | `/api/admin/leads` | Fetches system-wide customer lead logs | `Authorization: Bearer <token>` | `{ success: true, leads: [...] }` |

---

### D. Reviews & Community Endpoints

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/reviews` | Submits customer review & recomputes rating | `{ pro_id, author, rating, text, customer_phone }` | `{ success: true }` |
| `GET` | `/api/blog/comments` | Fetches blog comments for article | `?slug=how-to-fix-hinges` | `{ comments: [...] }` |
| `POST` | `/api/blog/comments` | Posts comment on DIY blog guide | `{ post_slug, author_name, comment_text, parent_id? }` | `{ success: true }` |
| `POST` | `/api/blog/comments/react`| Adds like/helpful reaction to comment | `{ comment_id, reaction_type }` | `{ success: true }` |
| `GET` | `/api/geo` | Detects user city/locality from IP headers | *None* | `{ city: 'Bangalore', region: 'Karnataka' }` |

---

## 3. Environment Variables Reference

| Variable | Scope | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | Public Supabase anon client key |
| `ADMIN_PASSWORD` | Server Only | Master administrator authentication secret |
| `RESEND_API_KEY` | Server Only | Resend email API key for transactional alerts |

---

*Carpenterwala Architecture Blueprint • Maintained for Pair Programming & Visual Diagram Generation*
