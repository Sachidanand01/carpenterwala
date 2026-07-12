-- Run this script in your Supabase SQL Editor to enable production RLS policies on profiles, reviews, and leads

-- 1. Enable Row Level Security (RLS) on remaining tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 2. Define policies for 'profiles'
-- Allow public read access to view professionals' details, skills, and portfolio
DROP POLICY IF EXISTS "Allow public read profiles" ON profiles;
CREATE POLICY "Allow public read profiles" ON profiles FOR SELECT USING (true);

-- Allow public insert/update access for Pro registration and dashboard profile updates
DROP POLICY IF EXISTS "Allow public insert profiles" ON profiles;
CREATE POLICY "Allow public insert profiles" ON profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update profiles" ON profiles;
CREATE POLICY "Allow public update profiles" ON profiles FOR UPDATE USING (true);

-- 3. Define policies for 'reviews'
-- Allow public read access to read reviews for each professional
DROP POLICY IF EXISTS "Allow public read reviews" ON reviews;
CREATE POLICY "Allow public read reviews" ON reviews FOR SELECT USING (true);

-- Allow public insert access for customers to leave reviews
DROP POLICY IF EXISTS "Allow public insert reviews" ON reviews;
CREATE POLICY "Allow public insert reviews" ON reviews FOR INSERT WITH CHECK (true);

-- 4. Define policies for 'leads'
-- Allow public insert access for customers to request/book a pro
DROP POLICY IF EXISTS "Allow public insert leads" ON leads;
CREATE POLICY "Allow public insert leads" ON leads FOR INSERT WITH CHECK (true);

-- Allow public read/update/delete access for client leads actions
DROP POLICY IF EXISTS "Allow public read leads" ON leads;
CREATE POLICY "Allow public read leads" ON leads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public update leads" ON leads;
CREATE POLICY "Allow public update leads" ON leads FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete leads" ON leads;
CREATE POLICY "Allow public delete leads" ON leads FOR DELETE USING (true);
