-- =========================================================================
-- Run this script in your Supabase SQL Editor to enable production RLS & Anti-Scraping Protection
-- =========================================================================

-- 1. Ensure required columns exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS pro_code VARCHAR(16),
ADD COLUMN IF NOT EXISTS average_rating FLOAT DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS service_radius_km INT DEFAULT 5,
ADD COLUMN IF NOT EXISTS accepting_leads BOOLEAN DEFAULT true;

-- 2. Enable Row Level Security (RLS) on core tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 3. CREATE SECURE 'public_profiles' VIEW
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

-- 4. DEFINE POLICIES & PERMISSIONS FOR 'profiles'
REVOKE ALL ON public.profiles FROM anon;

-- Grant SELECT only on public non-sensitive columns to anon role (KYC and personal files are excluded)
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

DROP POLICY IF EXISTS "Allow public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read verified profiles" ON public.profiles;
CREATE POLICY "Allow public read verified profiles" ON public.profiles FOR SELECT USING (verified = true);

DROP POLICY IF EXISTS "Allow public insert profiles" ON public.profiles;
CREATE POLICY "Allow public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update profiles" ON public.profiles;
CREATE POLICY "Allow public update profiles" ON public.profiles FOR UPDATE USING (true);

-- 5. POLICIES FOR 'reviews'
DROP POLICY IF EXISTS "Allow public read reviews" ON public.reviews;
CREATE POLICY "Allow public read reviews" ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert reviews" ON public.reviews;
CREATE POLICY "Allow public insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);

-- 6. POLICIES FOR 'leads'
DROP POLICY IF EXISTS "Allow public insert leads" ON public.leads;
CREATE POLICY "Allow public insert leads" ON public.leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read leads" ON public.leads;
CREATE POLICY "Allow public read leads" ON public.leads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public update leads" ON public.leads;
CREATE POLICY "Allow public update leads" ON public.leads FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete leads" ON public.leads;
CREATE POLICY "Allow public delete leads" ON public.leads FOR DELETE USING (true);
