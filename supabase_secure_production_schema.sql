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

-- Grant standard public client access
GRANT SELECT, INSERT ON public.reviews TO anon, authenticated;
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;

-- 3. Enable Row Level Security (RLS) on core tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 4. Create secure 'public_profiles' view for public frontend directory queries
-- Exposes ONLY public marketing and presentation fields.
-- Completely omits: aadhaar_front, aadhaar_back, pan_front, pan_back, 
-- voter_driving_front, voter_driving_back, police_verification, full_address, rejection_reason, email.
CREATE OR REPLACE VIEW public.public_profiles AS
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

-- Allow new service professionals to register initial profile record
CREATE POLICY "Allow public insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

-- (Note: Profile updates and sensitive KYC access are performed server-side via Next.js API routes using the Service Role)

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
