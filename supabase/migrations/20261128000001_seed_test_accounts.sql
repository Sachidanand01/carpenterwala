-- =========================================================================
-- Migration: Seed Multi-Platform Test Accounts (Customer & Service Pro)
-- Universal AI Platform Test Harness (Claude, ChatGPT, Gemini, Glama, etc.)
-- =========================================================================

-- 1. Add is_test columns to core tables
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_test BOOLEAN DEFAULT false;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS is_test BOOLEAN DEFAULT false;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.warranties ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE public.warranties ADD COLUMN IF NOT EXISTS is_test BOOLEAN DEFAULT false;

-- 2. Update public_profiles view to strictly exclude test profiles
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
WHERE verified = true AND (is_test IS FALSE OR is_test IS NULL);

GRANT SELECT ON public.public_profiles TO anon, authenticated, service_role;

-- 3. Seed or Update Test Pro and Test Customer
DO $$
DECLARE
  v_pro_id BIGINT;
BEGIN
  -- Test Pro
  INSERT INTO public.profiles (
    pro_code, slug, name, email, phone, trade, experience, location, full_address,
    about, skills, avatar, verified, onboarding_completed, accepting_leads, is_test, average_rating
  ) VALUES (
    'TEST001',
    'test-master-carpenter-test001',
    'Vikram Sharma',
    'test.pro@carpenterwala.com',
    '9800000002',
    'Carpentry',
    '12 years',
    'Koramangala, Bangalore',
    '#42, 5th Cross, 4th Block, Koramangala, Bangalore - 560034',
    'Specialist in modular kitchen assembly, precision hydraulic hinges, and custom Sheesham wood crafting. Platform demo account for automated verification.',
    ARRAY['Modular Kitchen', 'Hydraulic Hinges', 'Furniture Assembly', 'Custom Bookshelves', 'Lock Fitting'],
    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80',
    true, true, true, true, 4.9
  )
  ON CONFLICT (pro_code) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    slug = EXCLUDED.slug,
    trade = EXCLUDED.trade,
    location = EXCLUDED.location,
    about = EXCLUDED.about,
    skills = EXCLUDED.skills,
    verified = true,
    accepting_leads = true,
    is_test = true,
    average_rating = 4.9
  RETURNING id INTO v_pro_id;

  IF v_pro_id IS NULL THEN
    SELECT id INTO v_pro_id FROM public.profiles WHERE pro_code = 'TEST001';
  END IF;

  -- Test Customer
  INSERT INTO public.customers (phone, first_name, last_name, email)
  VALUES (
    '9800000001',
    'Aditi',
    'Sharma',
    'test.customer@carpenterwala.com'
  )
  ON CONFLICT (phone) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    email = EXCLUDED.email;

  -- Test Warranties
  IF NOT EXISTS (SELECT 1 FROM public.warranties WHERE customer_phone = '9800000001' AND appliance_name = 'Godrej Nav-Tal Brass Lock') THEN
    INSERT INTO public.warranties (
      customer_phone, customer_email, category, appliance_name, purchase_date,
      warranty_start_date, warranty_duration_months, receipt_copy, notes, is_test
    ) VALUES (
      '9800000001',
      'test.customer@carpenterwala.com',
      'Carpentry & Furniture',
      'Godrej Nav-Tal Brass Lock',
      '2026-03-15',
      '2026-03-15',
      36,
      'warranties/9800000001/receipt_godrej_lock.webp',
      'Registered with official GST tax invoice via Carpenterwala locker',
      true
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.warranties WHERE customer_phone = '9800000001' AND appliance_name = 'Samsung 28L Convection Microwave Oven') THEN
    INSERT INTO public.warranties (
      customer_phone, customer_email, category, appliance_name, purchase_date,
      warranty_start_date, warranty_duration_months, receipt_copy, notes, is_test
    ) VALUES (
      '9800000001',
      'test.customer@carpenterwala.com',
      'Kitchen Appliances',
      'Samsung 28L Convection Microwave Oven',
      '2026-06-10',
      '2026-06-10',
      24,
      'warranties/9800000001/receipt_microwave.webp',
      'Extended magnetron warranty card verified',
      true
    );
  END IF;

  -- Test Leads
  IF NOT EXISTS (SELECT 1 FROM public.leads WHERE phone = '9800000001' AND task LIKE '%Soft-close%') THEN
    INSERT INTO public.leads (
      pro_id, name, phone, email, task, status, is_test
    ) VALUES (
      v_pro_id,
      'Aditi Sharma',
      '9800000001',
      'test.customer@carpenterwala.com',
      '[Direct OAuth Booking] Trade: Carpentry | Locality: Koramangala | Details: Soft-close modular kitchen hydraulic hinge replacement',
      'completed',
      true
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.leads WHERE pro_id = v_pro_id AND task LIKE '%study table%') THEN
    INSERT INTO public.leads (
      pro_id, name, phone, email, task, status, is_test
    ) VALUES (
      v_pro_id,
      'Pooja Hegde',
      '9800000003',
      'pooja.h@example.com',
      'Custom Sheesham wood study table & 4-tier bookshelf assembly',
      'in_progress',
      true
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.leads WHERE pro_id = v_pro_id AND task LIKE '%sliding wardrobe%') THEN
    INSERT INTO public.leads (
      pro_id, name, phone, email, task, status, is_test
    ) VALUES (
      v_pro_id,
      'Karthik Raja',
      '9800000004',
      'karthik.r@example.com',
      'Master bedroom sliding wardrobe track repair and roller bearing alignment',
      'assigned',
      true
    );
  END IF;

  -- Test Reviews
  IF NOT EXISTS (SELECT 1 FROM public.reviews WHERE pro_id = v_pro_id AND author = 'Aditi Sharma') THEN
    INSERT INTO public.reviews (pro_id, author, rating, text) VALUES
    (
      v_pro_id,
      'Aditi Sharma',
      5,
      'Vikram arrived with digital leveling tools and replaced 4 kitchen hydraulic hinges in under 40 minutes. Clean and polite.'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.reviews WHERE pro_id = v_pro_id AND author = 'Rahul Verma') THEN
    INSERT INTO public.reviews (pro_id, author, rating, text) VALUES
    (
      v_pro_id,
      'Rahul Verma',
      5,
      'Very skilled carpenter. Assembled our heavy Sheesham wood bookshelf flawlessly. Highly recommended!'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.reviews WHERE pro_id = v_pro_id AND author = 'Sneha Rao') THEN
    INSERT INTO public.reviews (pro_id, author, rating, text) VALUES
    (
      v_pro_id,
      'Sneha Rao',
      5,
      'Fixed our stuck wardrobe sliding door quickly. Fair pricing and 0% commission direct coordination.'
    );
  END IF;
END $$;
