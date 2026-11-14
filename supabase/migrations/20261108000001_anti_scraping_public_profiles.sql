-- =========================================================================
-- Migration: Anti-Scraping Public Profiles View & Permission Restoration
-- =========================================================================

-- 1. Ensure required helper columns exist
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

GRANT SELECT, INSERT ON public.reviews TO anon, authenticated;
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;

-- 3. Enable Row Level Security (RLS) on core tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 4. Create secure 'public_profiles' view for public frontend directory queries
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

CREATE POLICY "Allow public read verified profiles" 
ON public.profiles 
FOR SELECT 
USING (verified = true);

CREATE POLICY "Allow public insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);
