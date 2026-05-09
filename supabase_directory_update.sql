-- Run this in your Supabase SQL Editor to update the schema for the directory filters

-- 1. Add new columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS languages TEXT[],
ADD COLUMN IF NOT EXISTS latitude FLOAT,
ADD COLUMN IF NOT EXISTS longitude FLOAT,
ADD COLUMN IF NOT EXISTS average_rating FLOAT DEFAULT 0.0;

-- 2. Update the existing dummy profile with some values so filtering works
UPDATE profiles 
SET 
  languages = ARRAY['Kannada', 'Hindi', 'English'],
  latitude = 12.9716, -- Approx Bangalore lat
  longitude = 77.5946, -- Approx Bangalore long
  average_rating = 5.0
WHERE slug = 'ram-singh';

-- 3. Insert another dummy profile for testing filtering
INSERT INTO profiles (slug, name, trade, experience, location, verified, avatar, about, skills, portfolio, languages, latitude, longitude, average_rating, created_at)
VALUES (
  'arjun-kumar', 
  'Arjun Kumar', 
  'Painter', 
  '8 Years', 
  'Bangalore North', 
  true, 
  'https://i.pravatar.cc/150?u=arjun', 
  'Specialized in interior painting, texture design, and waterproofing.', 
  ARRAY['Interior Painting', 'Waterproofing', 'Texture Design'], 
  ARRAY['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80'],
  ARRAY['Hindi', 'English'],
  13.0285, -- Approx Bangalore North
  77.5898,
  4.5,
  NOW() - INTERVAL '2 days' -- Making him older for testing "Newly Added" filter
) ON CONFLICT (slug) DO NOTHING;
