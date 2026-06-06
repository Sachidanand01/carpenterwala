-- Run this in your Supabase SQL Editor to support profile image updates with admin approval

-- 1. Add pending_avatar column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS pending_avatar TEXT;
