import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Real helper function to get a profile by slug from DB
export async function getProfileBySlug(slug) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !profile) {
    console.error("Error fetching profile:", error);
    return null;
  }

  // Fetch reviews for this profile
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('pro_id', profile.id)
    .order('created_at', { ascending: false });

  return { ...profile, reviews: reviews || [] };
}
