import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { isValidAdminToken } from '@/lib/admin-auth';

// GET /api/admin/leads
export async function GET(request) {
  try {
    // 1. Verify Authorization
    const authHeader = request.headers.get('authorization');
    if (!isValidAdminToken(authHeader)) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    // 2. Fetch Leads with Profile Trade/Name info from Supabase
    const client = supabaseAdmin || supabase;
    const { data: leads, error } = await client
      .from('leads')
      .select(`
        id,
        name,
        phone,
        task,
        created_at,
        profiles ( id, name, trade )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, leads });
  } catch (err) {
    console.error('Secure leads fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch leads securely' }, { status: 500 });
  }
}
