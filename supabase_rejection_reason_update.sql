-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- This adds the rejection_reason column to the profiles table so admin document rejections and notes are saved.

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
