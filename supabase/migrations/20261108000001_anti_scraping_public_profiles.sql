-- =========================================================================
-- Migration: Anti-Scraping & KYC Data Privacy Protection (Fixed Schema)
-- 1. Ensure required columns exist
-- 2. Create secure 'public_profiles' view for public directory & search
-- 3. Restrict anon SELECT to prevent dumping sensitive KYC & PII files
-- =========================================================================

-- 1. ENSURE BASE COLUMNS EXIST
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS pro_code VARCHAR(16),
ADD COLUMN IF NOT EXISTS average_rating FLOAT DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS service_radius_km INT DEFAULT 5,
ADD COLUMN IF NOT EXISTS accepting_leads BOOLEAN DEFAULT true;

-- 2. SECURE PUBLIC PROFILES VIEW
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

-- Grant SELECT on public_profiles view to anonymous visitors, authenticated users, and service role
GRANT SELECT ON public.public_profiles TO anon, authenticated, service_role;

-- 3. COLUMN-LEVEL PERMISSIONS ON BASE TABLE 'profiles'
REVOKE ALL ON public.profiles FROM anon;

-- Grant SELECT only on public and presentation columns to anon role (KYC and PII documents are excluded)
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
  phone,
  created_at
) ON public.profiles TO anon;

-- Grant INSERT & UPDATE for registration / profile updates
GRANT INSERT (
  slug, name, trade, experience, location, full_address, phone, email,
  about, skills, portfolio, avatar, languages, verified, onboarding_completed,
  onboarding_step, accepting_leads, aadhaar_front, aadhaar_back, pan_front, pan_back,
  voter_driving_front, voter_driving_back, police_verification, latitude, longitude, service_radius_km
) ON public.profiles TO anon, authenticated;

GRANT UPDATE (
  slug, name, trade, experience, location, full_address, phone, email,
  about, skills, portfolio, avatar, pending_avatar, languages, accepting_leads,
  aadhaar_front, aadhaar_back, pan_front, pan_back, voter_driving_front,
  voter_driving_back, police_verification, latitude, longitude, service_radius_km
) ON public.profiles TO anon, authenticated;

-- 4. RLS POLICIES ENFORCEMENT
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read verified profiles" ON public.profiles;

CREATE POLICY "Allow public read verified profiles" 
ON public.profiles 
FOR SELECT 
TO anon, authenticated
USING (verified = true);
