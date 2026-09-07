-- =========================================================================
-- Migration 02: Storage Buckets & Policies
-- Buckets: public-assets (Public CDN) & kyc-documents (Strictly Private)
-- =========================================================================

-- 1. Create 'public-assets' bucket (Public CDN for avatars & portfolio)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public-assets',
  'public-assets',
  true,
  10485760, -- 10MB limit per image
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Create 'kyc-documents' bucket (Strictly Private for Aadhaar, PAN, Invoices, Receipts)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kyc-documents',
  'kyc-documents',
  false, -- Private bucket: access only via time-limited signed URLs
  15728640, -- 15MB limit per scan
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 15728640,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];

-- 3. Storage Policies (Row Level Security is enabled on storage.objects by default)

-- Policy A: Anyone can read from public-assets bucket
DROP POLICY IF EXISTS "Public Assets Are Viewable By Everyone" ON storage.objects;
CREATE POLICY "Public Assets Are Viewable By Everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-assets');

-- Policy B: Allow uploads to public-assets bucket
DROP POLICY IF EXISTS "Allow Public Assets Uploads" ON storage.objects;
CREATE POLICY "Allow Public Assets Uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'public-assets');

-- Policy C: Allow updates/overwrites in public-assets
DROP POLICY IF EXISTS "Allow Public Assets Updates" ON storage.objects;
CREATE POLICY "Allow Public Assets Updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'public-assets');

-- Policy D: Allow uploads to kyc-documents bucket
DROP POLICY IF EXISTS "Allow KYC Documents Uploads" ON storage.objects;
CREATE POLICY "Allow KYC Documents Uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'kyc-documents');
