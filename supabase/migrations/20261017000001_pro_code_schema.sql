-- =========================================================================
-- Migration: Add Pro Code (CW-XXXX) for Service Professionals
-- Enables hierarchical SEO URLs: /pro/[trade]/[pro_code]/[name]
-- and vanity short-links: /pro/[pro_code]
-- =========================================================================

-- 1. Add pro_code column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS pro_code VARCHAR(16) UNIQUE;

-- 2. Create case-insensitive index on pro_code for lightning-fast O(1) lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_pro_code ON public.profiles (LOWER(pro_code));

-- 3. Backfill any existing profiles that don't have a pro_code yet
DO $$
DECLARE
  rec RECORD;
  new_code VARCHAR(16);
  code_exists BOOLEAN;
  chars TEXT := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  rand_part TEXT;
  i INT;
BEGIN
  FOR rec IN SELECT id FROM public.profiles WHERE pro_code IS NULL LOOP
    LOOP
      rand_part := '';
      FOR i IN 1..4 LOOP
        rand_part := rand_part || SUBSTR(chars, FLOOR(RANDOM() * LENGTH(chars) + 1)::INT, 1);
      END LOOP;
      new_code := 'CW-' || rand_part;

      SELECT EXISTS(SELECT 1 FROM public.profiles WHERE pro_code = new_code) INTO code_exists;
      IF NOT code_exists THEN
        UPDATE public.profiles SET pro_code = new_code WHERE id = rec.id;
        EXIT;
      END IF;
    END LOOP;
  END LOOP;
END $$;
