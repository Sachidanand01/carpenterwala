-- Run this in your Supabase SQL Editor to update the profiles schema for onboarding

-- 1. Add onboarding columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS full_address TEXT,
ADD COLUMN IF NOT EXISTS aadhaar_front TEXT,
ADD COLUMN IF NOT EXISTS aadhaar_back TEXT,
ADD COLUMN IF NOT EXISTS pan_front TEXT,
ADD COLUMN IF NOT EXISTS pan_back TEXT,
ADD COLUMN IF NOT EXISTS voter_driving_front TEXT,
ADD COLUMN IF NOT EXISTS voter_driving_back TEXT,
ADD COLUMN IF NOT EXISTS police_verification TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 1;

-- 2. Ensure existing dummy profiles have completed onboarding (so they don't get blocked)
UPDATE profiles 
SET 
  onboarding_completed = true,
  onboarding_step = 3
WHERE onboarding_completed IS NULL OR onboarding_completed = false;
