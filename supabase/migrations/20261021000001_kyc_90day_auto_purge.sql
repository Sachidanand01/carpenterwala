-- =========================================================================
-- Migration: 90-Day KYC & Verification Document Auto-Purge Routine
-- Purpose: Permanently purge digital copies of Aadhaar, PAN, Voter ID,
--          Driving License, and Police Verification documents after 90 days
--          and provide 48-hour pre-purge detection alerts for Administrators.
-- =========================================================================

-- 1. Routine to permanently wipe expired KYC document copies
CREATE OR REPLACE FUNCTION public.purge_expired_kyc_documents(retention_days INT DEFAULT 90)
RETURNS TABLE (purged_count INT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  affected_rows INT;
BEGIN
  UPDATE public.profiles
  SET 
    aadhaar_front = NULL,
    aadhaar_back = NULL,
    pan_front = NULL,
    pan_back = NULL,
    voter_driving_front = NULL,
    voter_driving_back = NULL,
    police_verification = NULL,
    updated_at = NOW()
  WHERE 
    (created_at < (NOW() - (retention_days || ' days')::INTERVAL)
     OR (verified = true AND updated_at < (NOW() - (retention_days || ' days')::INTERVAL)))
    AND (
      aadhaar_front IS NOT NULL 
      OR aadhaar_back IS NOT NULL 
      OR pan_front IS NOT NULL 
      OR pan_back IS NOT NULL 
      OR voter_driving_front IS NOT NULL 
      OR voter_driving_back IS NOT NULL 
      OR police_verification IS NOT NULL
    );

  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  RETURN QUERY SELECT affected_rows;
END;
$$;

GRANT EXECUTE ON FUNCTION public.purge_expired_kyc_documents(INT) TO postgres, service_role;

-- 2. Query function: Detect profiles with KYC documents scheduled for auto-purge within warning_hours (default 48 hours)
CREATE OR REPLACE FUNCTION public.get_expiring_kyc_documents(warning_hours INT DEFAULT 48, retention_days INT DEFAULT 90)
RETURNS TABLE (
  id BIGINT,
  name TEXT,
  trade TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ,
  verified BOOLEAN,
  hours_remaining NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.trade,
    p.phone,
    p.email,
    p.created_at,
    p.verified,
    ROUND(
      EXTRACT(
        EPOCH FROM (
          (p.created_at + (retention_days || ' days')::INTERVAL) - NOW()
        )
      ) / 3600, 
      1
    ) AS hours_remaining
  FROM public.profiles p
  WHERE 
    -- Documents still present in profile
    (
      p.aadhaar_front IS NOT NULL 
      OR p.aadhaar_back IS NOT NULL 
      OR p.pan_front IS NOT NULL 
      OR p.pan_back IS NOT NULL 
      OR p.voter_driving_front IS NOT NULL 
      OR p.voter_driving_back IS NOT NULL 
      OR p.police_verification IS NOT NULL
    )
    -- Expiring within the next warning_hours (e.g. between 0 and 48 hours remaining)
    AND (p.created_at + (retention_days || ' days')::INTERVAL) > NOW()
    AND (p.created_at + (retention_days || ' days')::INTERVAL) <= (NOW() + (warning_hours || ' hours')::INTERVAL)
  ORDER BY p.created_at ASC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_expiring_kyc_documents(INT, INT) TO postgres, service_role;

COMMENT ON FUNCTION public.purge_expired_kyc_documents(INT) IS 
'Enforces 90-day document deletion policy by wiping sensitive KYC document references from profiles table.';

COMMENT ON FUNCTION public.get_expiring_kyc_documents(INT, INT) IS 
'Detects all service professional profiles whose KYC documents will be permanently purged within the specified warning window (default 48 hours).';
