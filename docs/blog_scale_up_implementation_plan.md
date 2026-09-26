# Implementation Plan: Migrating Blogs to Supabase + Self-Hosted Storage + Next.js ISR

This plan outlines the architecture, database schema, data service layer, image migration pipeline, and Next.js App Router ISR configuration to scale CarpenterWala from 90 to hundreds of home repair and carpentry guides.

---

## 1. System Architecture Overview

```
                      ┌────────────────────────────────────────┐
                      │     Publishing CLI / AI Pipeline       │
                      │     `scripts/publish-blog.mjs`         │
                      └──────────────────┬─────────────────────┘
                                         │
                        ┌────────────────┴────────────────┐
                        ▼                                 ▼
           ┌─────────────────────────┐       ┌─────────────────────────┐
           │      Supabase DB        │       │    Supabase Storage     │
           │     Table: `blogs`      │       │  Bucket: `blog-images`  │
           └────────────┬────────────┘       └────────────┬────────────┘
                        │                                 │
                        │ Revalidate Trigger / ISR        │
                        ▼                                 ▼
           ┌───────────────────────────────────────────────────────────┐
           │             Next.js App Router (Vercel CDN)               │
           │  - `generateStaticParams()`                               │
           │  - ISR: `revalidate = 3600` (1-hour background refresh)   │
           │  - On-Demand Revalidation: `POST /api/revalidate`          │
           │  - Resilient Fallback: `lib/blog-data.js` (offline build) │
           └───────────────────────────────────────────────────────────┘
```

### Key Decisions Resolved
1. **Database & Delivery**: Supabase PostgreSQL + Next.js Incremental Static Regeneration (ISR).
2. **Asset Independence**: 100% self-hosted images in Supabase Storage bucket (`blog-images`) — zero external Unsplash hotlinks.
3. **Build Resilience**: Data service automatically falls back to local cached `BLOG_POSTS` if Supabase credentials are missing or the database is unreachable, guaranteeing `npm run build` never breaks.
4. **Publishing Workflow**: Direct script-based publishing (`scripts/publish-blog.mjs`) that pushes data to Supabase, updates local fallback, and triggers on-demand ISR revalidation.

---

## 2. Proposed Changes

### Database & Storage (Supabase)
#### [NEW] `supabase_blogs_schema.sql`
- Create `public.blogs` table with columns: `id`, `slug`, `title`, `meta_title`, `meta_description`, `excerpt`, `category`, `author`, `date`, `read_time`, `image_url`, `content`, `status`, `created_at`, `updated_at`.
- Add unique index on `slug` and indexes on `category` and `status`.
- Setup automatic `updated_at` trigger.
- Configure Row Level Security (RLS): public read for `status = 'published'`, service-role write.
- Create public Supabase Storage bucket `blog-images`.

---

### Data Access Layer
#### [NEW] `lib/blog-service.js`
- Create an abstraction layer for blog data:
  - `getAllBlogPosts()`: Queries Supabase `blogs` table ordered by `id DESC`. If database call fails or returns empty, returns `BLOG_POSTS` from `lib/blog-data.js`.
  - `getBlogPostBySlug(slug)`: Queries Supabase by slug; falls back to local array.
  - `getBlogCategories()`: Fetches distinct categories with fallback.
  - `normalizeBlogPost(dbRow)`: Normalizes DB columns to matching frontend format (`metaTitle`, `readTime`, `image`).

---

### Image Migration & Asset Pipeline
#### [NEW] `scripts/migrate-blog-images-to-supabase.mjs`
- Audit all 90 existing posts in `lib/blog-data.js`.
- Download the 86 Unsplash images, convert/save them, and upload to Supabase Storage bucket `blog-images` with key `<slug>.webp`.
- Update each post's `image` URL to point to the permanent Supabase public CDN URL (`https://<supabase-id>.supabase.co/storage/v1/object/public/blog-images/<slug>.webp`).

#### [NEW] `scripts/seed-blogs-to-supabase.mjs`
- Batch insert/upsert all 90 existing blog posts from `lib/blog-data.js` into the Supabase `blogs` table with their new self-hosted Supabase Storage image URLs.

---

### App Router ISR & On-Demand Revalidation
#### [MODIFY] `app/blog/[slug]/page.js`
- Import `getAllBlogPosts` and `getBlogPostBySlug` from `@/lib/blog-service` instead of importing static `BLOG_POSTS` directly.
- Export `export const revalidate = 3600;` for ISR.
- Ensure all existing JSON-LD schemas (`HowTo`, `FAQPage`, `BreadcrumbList`), Position-0 callouts, and Table of Contents parsers remain completely unaffected.

#### [MODIFY] `app/blog/page.js` & `app/blog/BlogListing.js`
- Update `BlogListing` to receive posts from `getAllBlogPosts()` or fetch server-side with ISR.

#### [MODIFY] `app/blog/category/[category]/page.js`
- Use `getAllBlogPosts()` and `getBlogCategories()` from `@/lib/blog-service` for `generateStaticParams` and page rendering.

#### [NEW] `app/api/revalidate/route.js`
- Secure API endpoint (`POST /api/revalidate?secret=...&slug=...`) to purge and rebuild specific blog pages instantaneously on-demand when published.

---

### Publishing Workflow
#### [NEW] `scripts/publish-blog.mjs`
- Accepts a JSON file or markdown input for a new blog post.
- Checks and uploads any local image to Supabase Storage `blog-images`.
- Inserts post into Supabase `blogs` table.
- Appends or synchronizes the post into `lib/blog-data.js` (for offline fallback).
- Hits the revalidation webhook `/api/revalidate` so the post goes live immediately on production.

---

## 3. Verification Plan

### Automated & Build Verification
1. **SQL & Storage Verification**:
   - Verify table structure and storage bucket in Supabase dashboard.
   - Verify public image accessibility via HTTP GET.
2. **Schema & Extraction Test**:
   ```bash
   node -e "import('./lib/blog-service.js').then(async m => { const posts = await m.getAllBlogPosts(); console.log('Fetched posts:', posts.length); })"
   ```
3. **Build Integrity Check**:
   ```powershell
   npm.cmd run build
   ```
   - Confirm all 258+ static routes build cleanly in Next.js Turbopack with 0 errors.
   - Test both conditions:
     a) With live Supabase credentials.
     b) In simulated offline mode (invalid credentials) to verify fallback guarantee.
4. **On-Demand Revalidation Test**:
   - Send `POST /api/revalidate?secret=...&slug=how-to-fix-a-kitchen-drawer-front-that-fell-off-the-runner` and verify `200 OK` response with `revalidated: true`.

---

## 4. Execution Phases

| Phase | Description | Deliverables |
| :--- | :--- | :--- |
| **Phase 1** | Supabase SQL Setup | `supabase_blogs_schema.sql` |
| **Phase 2** | Image Migration Pipeline | `scripts/migrate-blog-images-to-supabase.mjs` |
| **Phase 3** | Data Seeding & Fallback Layer | `scripts/seed-blogs-to-supabase.mjs`, `lib/blog-service.js` |
| **Phase 4** | Next.js App Router Integration | Updates to `app/blog/[slug]/page.js`, `app/blog/BlogListing.js`, `app/api/revalidate/route.js` |
| **Phase 5** | Production Build & Offline Validation | `npm.cmd run build` verification |
