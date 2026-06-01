import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

// GET /api/admin/profiles
export async function GET(request) {
  try {
    // 1. Verify Authorization
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    const expectedPassword = process.env.ADMIN_PASSWORD || 'CarpenterwalaAdmin2026';
    const expectedToken = crypto
      .createHash('sha256')
      .update(expectedPassword + 'carpenterwala-salt-2026')
      .digest('hex');

    if (!token || token !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    // 2. Fetch Profiles from Supabase
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, profiles });
  } catch (err) {
    console.error('Secure profiles fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch profiles securely' }, { status: 500 });
  }
}
