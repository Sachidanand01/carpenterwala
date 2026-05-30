-- Run this entire script in your Supabase SQL Editor to support Email-based OTP login

-- 1. Add email column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

-- 2. Update existing dummy profiles with mock email addresses for testing
UPDATE profiles SET email = 'ram@example.com' WHERE slug = 'ram-singh';
UPDATE profiles SET email = 'arjun@example.com' WHERE slug = 'arjun-kumar';

-- 3. Create an index on the email column for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
