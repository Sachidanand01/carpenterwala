-- Run this in your Supabase SQL Editor to support the accepting leads flag

-- 1. Add accepting_leads column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS accepting_leads BOOLEAN DEFAULT true;

-- 2. Ensure all existing profiles default to true
UPDATE profiles 
SET accepting_leads = true 
WHERE accepting_leads IS NULL;
