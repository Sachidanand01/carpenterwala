-- DoS / Performance Hardening: Query Statement Timeouts and Essential High-Traffic Indexes
-- CarpenterWala DoS Defense Plan (Layer 5)

-- 1. Prevent runaway / unindexed queries from locking database threads during traffic spikes
ALTER ROLE anon SET statement_timeout = '5000';
ALTER ROLE authenticated SET statement_timeout = '8000';

-- 2. Partial index for rapid pro queries by slug and verified status (serves /[proSlug] public pages)
CREATE INDEX IF NOT EXISTS idx_profiles_slug_verified ON public.profiles(slug) WHERE verified = true;
