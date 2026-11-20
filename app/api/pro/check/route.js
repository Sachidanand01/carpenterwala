import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');

    if (!email && !phone) {
      return NextResponse.json({ error: 'Email or phone parameter is required.' }, { status: 400 });
    }

    const client = supabaseAdmin || supabase;
    let query = client.from('profiles').select('id, slug, name, trade, location, verified');

    if (email) {
      const cleanEmail = email.trim().toLowerCase();
      query = query.eq('email', cleanEmail);
    } else {
      const cleanPhone = phone.trim().replace(/\D/g, '').slice(-10);
      query = query.eq('phone', cleanPhone);
    }

    const { data: profile, error } = await query.maybeSingle();

    if (error) {
      console.error('Pro check error:', error);
      return NextResponse.json({ error: 'Database check failed' }, { status: 500 });
    }

    if (!profile) {
      return NextResponse.json({ registered: false }, { status: 200 });
    }

    return NextResponse.json({
      registered: true,
      pro: {
        id: profile.id,
        slug: profile.slug,
        name: profile.name,
        trade: profile.trade,
        location: profile.location,
        verified: profile.verified
      }
    }, { status: 200 });
  } catch (err) {
    console.error('Pro check exception:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
