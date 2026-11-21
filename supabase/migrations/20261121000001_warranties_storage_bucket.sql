-- =========================================================================
-- Migration: Warranties Dedicated Private Storage Bucket
-- Bucket: warranties (Strictly Private - Customer appliance & furniture receipts)
-- =========================================================================

-- 1. Create 'warranties' bucket (Private bucket for long-term bill & warranty storage)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'warranties',
  'warranties',
  false, -- Private bucket: access only via time-limited signed URLs
  15728640, -- 15MB limit per scan/invoice/PDF
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 15728640,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];

-- 2. Storage Policies for 'warranties' bucket (RLS is enabled on storage.objects)

-- Policy A: Allow presigned & authenticated uploads to warranties bucket
DROP POLICY IF EXISTS "Allow Warranties Uploads" ON storage.objects;
CREATE POLICY "Allow Warranties Uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'warranties');

-- Policy B: Allow updates/overwrites in warranties bucket
DROP POLICY IF EXISTS "Allow Warranties Updates" ON storage.objects;
CREATE POLICY "Allow Warranties Updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'warranties');

-- Policy C: Allow deletes in warranties bucket
DROP POLICY IF EXISTS "Allow Warranties Deletes" ON storage.objects;
CREATE POLICY "Allow Warranties Deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'warranties');
