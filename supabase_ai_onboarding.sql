-- =========================================================================
-- Carpenterwala Pan-India AI Pro Onboarding Schema Migration
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =========================================================================

-- 1. Ensure 'profiles' table has all required onboarding & pan-India columns
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS pro_code VARCHAR(16),
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS locality TEXT,
ADD COLUMN IF NOT EXISTS pincode VARCHAR(10),
ADD COLUMN IF NOT EXISTS experience_years INT,
ADD COLUMN IF NOT EXISTS full_address TEXT,
ADD COLUMN IF NOT EXISTS aadhaar_front TEXT,
ADD COLUMN IF NOT EXISTS aadhaar_back TEXT,
ADD COLUMN IF NOT EXISTS pan_front TEXT,
ADD COLUMN IF NOT EXISTS pan_back TEXT,
ADD COLUMN IF NOT EXISTS voter_driving_front TEXT,
ADD COLUMN IF NOT EXISTS voter_driving_back TEXT,
ADD COLUMN IF NOT EXISTS police_verification TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_step INT DEFAULT 1;

-- 2. Create the 'pro_onboarding_sessions' table linked to 'profiles'
CREATE TABLE IF NOT EXISTS public.pro_onboarding_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token VARCHAR(32) UNIQUE NOT NULL,
  pro_id BIGINT REFERENCES public.profiles(id) ON DELETE SET NULL,
  phone_number VARCHAR(10) NOT NULL CHECK (phone_number ~ '^[6-9][0-9]{9}$'),
  email TEXT,
  full_name TEXT NOT NULL,
  trade TEXT NOT NULL CHECK (LOWER(trade) IN ('carpentry', 'painting', 'plumbing', 'electrical', 'carpenter', 'painter', 'plumber', 'electrician')),
  city TEXT NOT NULL,
  locality TEXT NOT NULL,
  pincode VARCHAR(6) CHECK (pincode IS NULL OR pincode ~ '^[1-9][0-9]{5}$'),
  experience_years INT DEFAULT 1 CHECK (experience_years >= 0 AND experience_years <= 70),
  aadhaar_front_url TEXT,
  aadhaar_back_url TEXT,
  pan_front_url TEXT,
  pan_back_url TEXT,
  voter_driving_front_url TEXT,
  voter_driving_back_url TEXT,
  police_verification_url TEXT,
  portfolio_urls JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'PENDING_UPLOAD' CHECK (status IN ('PENDING_UPLOAD', 'VERIFIED', 'EXPIRED')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '60 minutes'),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 3. Add extra document columns idempotently if table already existed
ALTER TABLE public.pro_onboarding_sessions
ADD COLUMN IF NOT EXISTS pro_id BIGINT REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS pan_front_url TEXT,
ADD COLUMN IF NOT EXISTS pan_back_url TEXT,
ADD COLUMN IF NOT EXISTS voter_driving_front_url TEXT,
ADD COLUMN IF NOT EXISTS voter_driving_back_url TEXT,
ADD COLUMN IF NOT EXISTS police_verification_url TEXT,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

-- 4. Indexes for fast token & mobile lookups + 24h DB rate-limit window queries
CREATE INDEX IF NOT EXISTS idx_pro_onboarding_sessions_token ON public.pro_onboarding_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_pro_onboarding_sessions_phone ON public.pro_onboarding_sessions(phone_number);
CREATE INDEX IF NOT EXISTS idx_pro_onboarding_sessions_phone_created ON public.pro_onboarding_sessions(phone_number, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pro_onboarding_sessions_status ON public.pro_onboarding_sessions(status);

-- 5. Enable Row Level Security & Permissions
ALTER TABLE public.pro_onboarding_sessions ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON public.pro_onboarding_sessions TO service_role;

DROP POLICY IF EXISTS "Allow onboarding session read by token" ON public.pro_onboarding_sessions;
CREATE POLICY "Allow onboarding session read by token"
ON public.pro_onboarding_sessions
FOR SELECT
TO service_role
USING (true);

DROP POLICY IF EXISTS "Allow onboarding session insert" ON public.pro_onboarding_sessions;
CREATE POLICY "Allow onboarding session insert"
ON public.pro_onboarding_sessions
FOR INSERT
TO service_role
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow onboarding session update" ON public.pro_onboarding_sessions;
CREATE POLICY "Allow onboarding session update"
ON public.pro_onboarding_sessions
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);
