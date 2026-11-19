-- ==========================================================
-- Supabase Storage Setup: Public Assets & Private KYC Docs
-- Phase 6 Hardening: JPEG/PNG/WebP only, max 2MB, Private Admin-Only KYC Bucket
-- ==========================================================

-- 1. Create 'public-assets' bucket (Public CDN for avatars & portfolio, max 2MB, JPEG/PNG/WebP)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public-assets',
  'public-assets',
  true,
  2097152, -- Strict 2MB limit per image (2 * 1024 * 1024)
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- 2. Create 'kyc-documents' bucket (Strictly Private for Aadhaar, PAN, Voter/DL, Police Verification)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kyc-documents',
  'kyc-documents',
  false, -- Private bucket: accessible only to Admins / Service Role
  2097152, -- Strict 2MB limit per document photo
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- 3. Storage Policies (Row Level Security on storage.objects)

-- Policy A: Anyone can read from public-assets bucket
DROP POLICY IF EXISTS "Public Assets Are Viewable By Everyone" ON storage.objects;
CREATE POLICY "Public Assets Are Viewable By Everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-assets');

-- Policy B: Allow validated JPEG/PNG/WebP uploads to public-assets bucket
DROP POLICY IF EXISTS "Allow Public Assets Uploads" ON storage.objects;
CREATE POLICY "Allow Public Assets Uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'public-assets'
  AND LOWER(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp')
);

-- Policy C: Allow updates in public-assets
DROP POLICY IF EXISTS "Allow Public Assets Updates" ON storage.objects;
CREATE POLICY "Allow Public Assets Updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'public-assets')
WITH CHECK (
  bucket_id = 'public-assets'
  AND LOWER(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp')
);

-- Policy D: Allow validated JPEG/PNG/WebP uploads to private kyc-documents bucket
DROP POLICY IF EXISTS "Allow KYC Documents Uploads" ON storage.objects;
CREATE POLICY "Allow KYC Documents Uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'kyc-documents'
  AND LOWER(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp')
);

-- Policy E: Strictly restrict SELECT (read) on kyc-documents bucket to Admins / Service Role ONLY
-- Note: service_role bypasses RLS automatically; authenticated users require app_metadata.role = 'admin'.
DROP POLICY IF EXISTS "Admins Only Read KYC Documents" ON storage.objects;
CREATE POLICY "Admins Only Read KYC Documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyc-documents'
  AND COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
);

-- Policy F: Strictly restrict UPDATE & DELETE on kyc-documents bucket to Admins / Service Role ONLY
DROP POLICY IF EXISTS "Admins Only Modify KYC Documents" ON storage.objects;
CREATE POLICY "Admins Only Modify KYC Documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'kyc-documents'
  AND COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
);

DROP POLICY IF EXISTS "Admins Only Delete KYC Documents" ON storage.objects;
CREATE POLICY "Admins Only Delete KYC Documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'kyc-documents'
  AND COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
);
