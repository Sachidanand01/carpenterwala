-- Migration to add service radius and geocoordinates to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS service_radius_km INT DEFAULT 5,
  ADD COLUMN IF NOT EXISTS latitude NUMERIC DEFAULT 12.9716,
  ADD COLUMN IF NOT EXISTS longitude NUMERIC DEFAULT 77.5946,
  ADD COLUMN IF NOT EXISTS radius_updated_at TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_geo ON public.profiles (latitude, longitude);
