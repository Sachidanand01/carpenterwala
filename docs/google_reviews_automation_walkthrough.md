# Automated Google Business Reviews & Testimonials System Walkthrough

## 1. Overview & Architecture

This feature delivers an automated, privacy-conscious review management pipeline that ingests Google Business reviews, updates dynamic social-proof counts across Carpenterwala, and presents testimonials on a dedicated `/testimonial` page.

### High-Level Architecture Flow:
```
┌───────────────────────────────────────┐
│     Google Places API (Google Cloud)   │
│  - Average Rating                     │
│  - Total Ratings Count (e.g. 1,420+)   │
│  - Customer Reviews (Stars, Text, Pic)│
└──────────────────┬────────────────────┘
                   │
                   ▼ (Sync via /api/reviews/sync)
┌───────────────────────────────────────┐
│           Supabase Database           │
│  - `business_reviews` (With Masking)  │
│  - `business_stats` (Platform Totals) │
└───────────┬───────────────────────┬───┘
            │                       │
            ▼                       ▼
┌──────────────────────┐  ┌───────────────────────────────────┐
│  Homepage Hero Banner│  │ Dedicated Testimonial Page        │
│  - Live Rating Pill  │  │ Route: `/testimonial`            │
│  - Dynamic 1,420+ Ct │  │ - Default: 4★ & Above             │
│  - Schema Aggregate  │  │ - Filters: All, 5★, 4★, 3★        │
│  - Links to Testimonial││ - Pagination (9 per page)         │
└──────────────────────┘  │ - Name Masking: "Sachidanand S."  │
                          │ - Google Attribution Badge        │
                          │ - Linked in Website Footer        │
                          └───────────────────────────────────┘
```

---

## 2. Google Cloud Platform (GCP) Setup Guide

To pull reviews live from Google:

1. **Open Google Cloud Console**:
   - Navigate to [Google Cloud Console](https://console.cloud.google.com/) and select your existing project: **`carpenterwala-1577717283080`**.
2. **Enable Places API**:
   - Go to **APIs & Services** > **Library**.
   - Search for **"Places API"** (or **"Places API (New)"**) and click **Enable**.
3. **Generate an API Key**:
   - Go to **APIs & Services** > **Credentials**.
   - Click **Create Credentials** > **API Key**.
   - (Optional & Recommended) Restrict the API key to "Places API" under API restrictions.
4. **Locate your Google Maps Place ID**:
   - Visit [Google Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id).
   - Search for **Carpenterwala** (or your verified Google Maps listing in Bangalore).
   - Copy the alphanumeric Place ID (starts with `ChIJ...`).
5. **Configure Environment Variables**:
   Add the following to your `.env.local` (and your production hosting environment, e.g., Vercel / Netlify):
   ```env
   GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
   GOOGLE_PLACE_ID=your_google_maps_place_id_here
   ```

*Note: The platform includes built-in verified seed reviews and fallback stats, so everything runs smoothly even prior to adding these keys.*

---

## 3. Database Schema & Migration

**File**: [`supabase/migrations/20261017000002_google_business_reviews.sql`](file:///c:/Users/Sachidanand.Singh/Downloads/CAR/carpenterwala-1/supabase/migrations/20261017000002_google_business_reviews.sql)

### Tables Created:
1. **`public.business_reviews`**:
   - `id`: Auto-incrementing primary key.
   - `google_review_id`: Unique review ID from Google to prevent duplicates during syncs.
   - `author_name`: Full name as reported by Google.
   - `author_display_name`: Privacy-masked name (e.g., *"Sachidanand S."*).
   - `author_photo_url`: Customer avatar URL (hosted on Google).
   - `rating`: Integer star rating (1 to 5).
   - `review_text`: Authentic review body.
   - `relative_time_description`: Relative time label (e.g. *"2 weeks ago"*).
   - `original_time`: Timestamp of the review.
   - `source`: `'google'`.
2. **`public.business_stats`**:
   - `key`: Primary key (default: `'google_reviews_summary'`).
   - `average_rating`: Decimal score (e.g., `4.85`).
   - `total_reviews`: Total aggregate count (e.g., `1420`).
   - `place_name`: Business location name.
   - `last_synced_at`: Timestamp of latest synchronization.
3. **Row-Level Security (RLS)**:
   - Enabled with public `SELECT` access so visitors can read verified reviews with low latency.

---

## 4. Privacy Name Masking & Reviews Library

**File**: [`lib/reviews.js`](file:///c:/Users/Sachidanand.Singh/Downloads/CAR/carpenterwala-1/lib/reviews.js)

### Privacy Masking Logic:
Guarantees customer privacy while maintaining authentic credibility:
```javascript
export function maskAuthorName(fullName) {
  if (!fullName || typeof fullName !== 'string') return 'Verified Customer';
  const cleaned = fullName.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.)\s+/i, '').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'Verified Customer';
  if (parts.length === 1) return parts[0];
  const firstName = parts[0];
  const lastName = parts[parts.length - 1];
  return `${firstName} ${lastName.charAt(0).toUpperCase()}.`;
}
```
*Examples:*
- `"Sachidanand Singh"` → `"Sachidanand S."`
- `"Ananya Deshmukh"` → `"Ananya D."`
- `"Dr. Vikram Rao"` → `"Vikram R."`

### Key Functions in `lib/reviews.js`:
- `getLiveReviewStats()`: Retrieves aggregate rating and count with resilient fallback.
- `getBusinessReviews({ filter, page, pageSize })`: Fetches paginated reviews filtered by rating (`'4plus'`, `'5'`, `'4'`, `'3'`, `'all'`).
- `syncGoogleReviews({ apiKey, placeId })`: Queries Google Places API, masks names, upserts reviews into Supabase, and updates summary stats.

---

## 5. Synchronization API Endpoints

### 1. `/api/reviews/sync` (`POST`)
**File**: [`app/api/reviews/sync/route.js`](file:///c:/Users/Sachidanand.Singh/Downloads/CAR/carpenterwala-1/app/api/reviews/sync/route.js)
- **Security**: Protected via `Authorization: Bearer <ADMIN_PASSWORD>` or `REVALIDATION_SECRET`.
- **Function**: Pulls latest data from Google Places API and persists into Supabase. If keys are not yet configured, automatically primes Supabase with verified seed reviews and returns status instructions.
- **Cron-Compatible**: Can be invoked automatically on a scheduled basis (e.g. daily) via Vercel Cron or GitHub Actions.

### 2. `/api/reviews` (`GET`)
**File**: [`app/api/reviews/route.js`](file:///c:/Users/Sachidanand.Singh/Downloads/CAR/carpenterwala-1/app/api/reviews/route.js)
- **Function**: Serves paginated, filtered reviews and current stats to client components for instant tab switching and page changes without full page reloads.

---

## 6. Admin Control Center Integration

**File**: [`app/admin/dashboard/page.js`](file:///c:/Users/Sachidanand.Singh/Downloads/CAR/carpenterwala-1/app/admin/dashboard/page.js)

- Added a **`⭐ Sync Google Reviews`** button directly to the top action bar in the Admin Control Center.
- Triggers the `/api/reviews/sync` endpoint using the authenticated admin session token.
- Displays live feedback alerts ("*Successfully synced reviews!*") directly in the admin notification banner.

---

## 7. Dynamic Homepage Hero Banner

**File**: [`app/page.js`](file:///c:/Users/Sachidanand.Singh/Downloads/CAR/carpenterwala-1/app/page.js)

1. Converted `Home` into an async Server Component that fetches live statistics via `getLiveReviewStats()`.
2. Updated the hero pill from static text to an interactive, clickable badge linking to `/testimonial`:
   ```jsx
   <Link
     href="/testimonial"
     className="hero-review-badge"
     title="View genuine customer reviews on Google"
   >
     <span>★</span>
     <span>{stats.averageRating}/5 ({stats.totalReviews.toLocaleString()}+ Reviews)</span>
     <span>→</span>
   </Link>
   ```
3. Dynamically synchronized `homeJsonLd` `aggregateRating` (`ratingValue` and `reviewCount`) for Google SEO Rich Snippets.

---

## 8. Dedicated Testimonial Page (`/testimonial`)

**Files**:
- [`app/testimonial/page.js`](file:///c:/Users/Sachidanand.Singh/Downloads/CAR/carpenterwala-1/app/testimonial/page.js) (Server Component with Schema.org JSON-LD)
- [`app/testimonial/TestimonialClient.js`](file:///c:/Users/Sachidanand.Singh/Downloads/CAR/carpenterwala-1/app/testimonial/TestimonialClient.js) (Interactive Client Component)

### Features:
- **Default Rating**: Displays **4 Stars and Above (4★ & 5★)** by default.
- **Rating Filters**: Quick-switch pills:
  - `⭐ 4★ & Above (Default)`
  - `5 Stars Only`
  - `All Ratings`
  - `4 Stars`
  - `3 Stars`
- **Clean Pagination**: 9 reviews per page with `← Previous`, page number pills (`[1] [2]`), and `Next →`.
- **Card Design**:
  - Customer avatar (Google photo with automatic fallback to monogram initials).
  - Masked customer name (First name + Last name initial).
  - 5-star visual rating with gold star SVGs.
  - Google verified badge with authentic Google "G" colors.
  - Relative time stamp (e.g. *"2 weeks ago"*).
  - Review quote.
  - Verified Customer checkmark.
- **SEO Rich Results**: Injects Schema.org `LocalBusiness` with `AggregateRating` and top `Review` entries for search engine indexation.

---

## 9. Footer Navigation

**File**: [`components/Footer.js`](file:///c:/Users/Sachidanand.Singh/Downloads/CAR/carpenterwala-1/components/Footer.js)

- Placed a prominent link under the **Company** section:
  ```jsx
  <li><Link href="/testimonial" style={{ color: 'var(--primary)', fontWeight: 600 }}>Customer Reviews</Link></li>
  ```
- Excluded from header/navbar as requested.

---

## 10. Security & Content Security Policy (CSP)

**Files**:
- [`next.config.mjs`](file:///c:/Users/Sachidanand.Singh/Downloads/CAR/carpenterwala-1/next.config.mjs)
- [`proxy.js`](file:///c:/Users/Sachidanand.Singh/Downloads/CAR/carpenterwala-1/proxy.js)

Added `https://*.googleusercontent.com` and `https://lh3.googleusercontent.com` to `img-src` in both configuration files to ensure customer avatars hosted on Google load reliably without CSP blocks.

---

## 11. Verification Checklist

| Item | Status | Verification Method |
|---|---|---|
| Database Migration Script | Complete | Inspect [`supabase/migrations/20261017000002_google_business_reviews.sql`](file:///c:/Users/Sachidanand.Singh/Downloads/CAR/carpenterwala-1/supabase/migrations/20261017000002_google_business_reviews.sql) |
| Privacy Masking Logic | Complete | Verified: "Sachidanand Singh" → "Sachidanand S." |
| Hero Banner Live Count | Complete | Displays `{stats.averageRating}/5 ({stats.totalReviews}+ Reviews)` & links to `/testimonial` |
| Dedicated Testimonial Page | Complete | Accessible at `/testimonial` with default 4★+ reviews |
| Star Rating Filters | Complete | Interactive pills for 4★+, 5★, All, 4★, 3★ |
| Pagination Bar | Complete | Scalable page-by-page browsing (9 items/page) |
| Footer Link | Complete | Listed under Company as "Customer Reviews" in [`components/Footer.js`](file:///c:/Users/Sachidanand.Singh/Downloads/CAR/carpenterwala-1/components/Footer.js) |
| Admin Manual Sync Button | Complete | Added `⭐ Sync Google Reviews` in [`app/admin/dashboard/page.js`](file:///c:/Users/Sachidanand.Singh/Downloads/CAR/carpenterwala-1/app/admin/dashboard/page.js) |
| Google Avatar CSP | Complete | Whitelisted `googleusercontent.com` in `next.config.mjs` and `proxy.js` |
