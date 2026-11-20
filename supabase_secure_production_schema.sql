-- =========================================================================
-- Carpenterwala Production Security Hardening & RLS Permissions Script
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =========================================================================

-- 1. Ensure required helper columns exist with correct names
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS pro_code VARCHAR(16),
ADD COLUMN IF NOT EXISTS average_rating FLOAT DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS service_radius_km INT DEFAULT 5,
ADD COLUMN IF NOT EXISTS accepting_leads BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 2. Restore essential schema permissions for PostgREST & Service Role
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Grant standard public client access (Reviews & Leads)
GRANT SELECT, INSERT ON public.reviews TO anon, authenticated;
GRANT INSERT ON public.leads TO anon, authenticated;

-- F-03 Hardening: Revoke table-level ALL on profiles from public roles
REVOKE ALL ON public.profiles FROM anon, authenticated;

-- Column-level SELECT on non-sensitive columns only
GRANT SELECT (
  id,
  pro_code,
  slug,
  name,
  trade,
  experience,
  location,
  latitude,
  longitude,
  about,
  skills,
  portfolio,
  avatar,
  languages,
  verified,
  accepting_leads,
  service_radius_km,
  average_rating,
  created_at,
  city,
  locality,
  pincode,
  experience_years
) ON public.profiles TO anon, authenticated;

-- 3. Enable Row Level Security (RLS) on core tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 4. Create secure 'public_profiles' view for public frontend directory queries
-- Exposes ONLY public marketing and presentation fields.
-- Completely omits: aadhaar_front, aadhaar_back, pan_front, pan_back, 
-- voter_driving_front, voter_driving_back, police_verification, full_address, rejection_reason, email, phone.
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = true) AS
SELECT 
  id,
  pro_code,
  slug,
  name,
  trade,
  experience,
  location,
  latitude,
  longitude,
  about,
  skills,
  portfolio,
  avatar,
  languages,
  verified,
  accepting_leads,
  service_radius_km,
  average_rating,
  created_at
FROM public.profiles
WHERE verified = true;

GRANT SELECT ON public.public_profiles TO anon, authenticated, service_role;

-- 5. POLICIES FOR 'profiles'
DROP POLICY IF EXISTS "Allow public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read verified profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public update profiles" ON public.profiles;

-- Allow public frontend visitors to read verified profiles (name, trade, portfolio, etc.)
CREATE POLICY "Allow public read verified profiles" 
ON public.profiles 
FOR SELECT 
USING (verified = true);

-- (Note: Profile creation, KYC verification, and sensitive updates are strictly performed server-side via Next.js API routes using the Service Role)

-- 6. POLICIES FOR 'reviews'
DROP POLICY IF EXISTS "Allow public read reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow public insert reviews" ON public.reviews;

CREATE POLICY "Allow public read reviews" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (true);

-- 7. POLICIES FOR 'leads'
DROP POLICY IF EXISTS "Allow public insert leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public read leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public update leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public delete leads" ON public.leads;

-- Allow homeowners to submit service leads
CREATE POLICY "Allow public insert leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

-- (Note: Reading, updating, and deleting leads is restricted to authenticated Pros & Admins via Next.js backend API routes)

-- =========================================================================
-- 8. PHASE 6: STORAGE BUCKETS & PRIVATE KYC RLS POLICIES
-- Enforces JPEG/PNG/WebP only, max 2MB (2,097,152 bytes), and Admin-Only
-- access to Aadhaar & KYC documents in the private 'kyc-documents' bucket.
-- =========================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public-assets',
  'public-assets',
  true,
  2097152, -- Strict 2MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kyc-documents',
  'kyc-documents',
  false, -- Strictly Private bucket for Aadhaar & KYC documents
  2097152, -- Strict 2MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Public Assets Storage Policies (JPEG/PNG/WebP only)
DROP POLICY IF EXISTS "Public Assets Are Viewable By Everyone" ON storage.objects;
CREATE POLICY "Public Assets Are Viewable By Everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-assets');

DROP POLICY IF EXISTS "Allow Public Assets Uploads" ON storage.objects;
CREATE POLICY "Allow Public Assets Uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'public-assets'
  AND LOWER(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp')
);

DROP POLICY IF EXISTS "Allow Public Assets Updates" ON storage.objects;
CREATE POLICY "Allow Public Assets Updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'public-assets')
WITH CHECK (
  bucket_id = 'public-assets'
  AND LOWER(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp')
);

-- Private KYC Documents Storage Policies (Aadhaar accessible ONLY to Admins / Service Role)
DROP POLICY IF EXISTS "Allow KYC Documents Uploads" ON storage.objects;
CREATE POLICY "Allow KYC Documents Uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'kyc-documents'
  AND LOWER(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp')
);

DROP POLICY IF EXISTS "Admins Only Read KYC Documents" ON storage.objects;
CREATE POLICY "Admins Only Read KYC Documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyc-documents'
  AND COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
);

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

-- =========================================================================
-- 9. PHASE 6: HARDEN 'pro_onboarding_sessions' CONSTRAINTS & RLS
-- =========================================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'pro_onboarding_sessions'
  ) THEN
    ALTER TABLE public.pro_onboarding_sessions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.pro_onboarding_sessions
      ALTER COLUMN expires_at SET DEFAULT (NOW() + INTERVAL '60 minutes');
    CREATE INDEX IF NOT EXISTS idx_pro_onboarding_sessions_phone_created
      ON public.pro_onboarding_sessions(phone_number, created_at DESC);
  END IF;
END $$;
