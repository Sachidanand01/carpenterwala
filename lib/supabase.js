import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase;

// Explicit public columns — never fetches private KYC documents (Aadhaar/PAN/police checks)
export const SAFE_PUBLIC_PRO_COLUMNS = [
  'id',
  'pro_code',
  'slug',
  'name',
  'trade',
  'experience',
  'location',
  'latitude',
  'longitude',
  'about',
  'skills',
  'portfolio',
  'avatar',
  'languages',
  'verified',
  'accepting_leads',
  'service_radius_km',
  'average_rating',
  'created_at',
  'phone'
].join(', ');

// Helper function to get a profile by slug from DB
export async function getProfileBySlug(slug) {
  if (!slug) return null;
  const client = supabaseAdmin || supabase;
  const { data: profile, error } = await client
    .from('profiles')
    .select(SAFE_PUBLIC_PRO_COLUMNS)
    .eq('slug', slug)
    .single();

  if (error || !profile) {
    if (error) console.error("Error fetching profile by slug:", error);
    return null;
  }

  // Fetch reviews for this profile
  const { data: reviews } = await client
    .from('reviews')
    .select('id, author, rating, text, created_at')
    .eq('pro_id', profile.id)
    .order('created_at', { ascending: false });

  return { ...profile, reviews: reviews || [] };
}

// Helper function to get a profile by pro_code from DB
export async function getProfileByProCode(proCode) {
  if (!proCode) return null;
  const cleanCode = String(proCode).trim();
  const client = supabaseAdmin || supabase;

  // Try exact match or ilike match
  const { data: profile, error } = await client
    .from('profiles')
    .select(SAFE_PUBLIC_PRO_COLUMNS)
    .ilike('pro_code', cleanCode)
    .maybeSingle();

  if (error || !profile) {
    if (error) console.error("Error fetching profile by pro_code:", error);
    return null;
  }

  // Fetch reviews for this profile
  const { data: reviews } = await client
    .from('reviews')
    .select('id, author, rating, text, created_at')
    .eq('pro_id', profile.id)
    .order('created_at', { ascending: false });

  return { ...profile, reviews: reviews || [] };
}
