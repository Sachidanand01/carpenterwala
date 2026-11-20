import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { isValidAdminToken } from '@/lib/admin-auth';

// GET /api/admin/profiles
export async function GET(request) {
  try {
    // 1. Verify Authorization
    const authHeader = request.headers.get('authorization');
    if (!isValidAdminToken(authHeader)) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    // 2. Fetch Profiles from Supabase using Service Role (supabaseAdmin) or Fallback Client
    const client = supabaseAdmin || supabase;
    let { data: profiles, error } = await client
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    // If select('*') failed (due to column restrictions, missing columns, or egress payload limits),
    // attempt a fallback query with explicit safe admin columns
    if (error) {
      console.warn('Admin profiles select(*) failed, attempting fallback query:', error.message);
      
      const fallbackQuery = await client
        .from('profiles')
        .select(`
          id, pro_code, slug, name, trade, experience, location, full_address, phone, email,
          about, skills, portfolio, avatar, pending_avatar, languages, verified,
          onboarding_completed, onboarding_step, accepting_leads,
          aadhaar_front, aadhaar_back, pan_front, pan_back, voter_driving_front, voter_driving_back,
          police_verification, service_radius_km, average_rating, created_at
        `)
        .order('created_at', { ascending: false });

      if (fallbackQuery.error) {
        // Last resort: query public columns so admin dashboard loads cleanly without breaking
        const publicOnly = await client
          .from('profiles')
          .select('id, pro_code, slug, name, trade, experience, location, avatar, pending_avatar, languages, verified, onboarding_completed, onboarding_step, accepting_leads, service_radius_km, average_rating, phone, created_at')
          .order('created_at', { ascending: false });

        if (publicOnly.error) {
          throw error;
        }
        profiles = publicOnly.data;
      } else {
        profiles = fallbackQuery.data;
      }
    }

    return NextResponse.json({ success: true, profiles: profiles || [] });
  } catch (err) {
    console.error('Secure profiles fetch error:', err);
    return NextResponse.json({ 
      error: 'Failed to fetch profiles securely', 
      message: err?.message || 'Database query failed' 
    }, { status: 500 });
  }
}
