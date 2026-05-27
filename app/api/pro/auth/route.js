import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/pro/auth?name=Ram+Singh
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name || name.trim().length < 2) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, slug, name, trade, location, avatar, verified, about')
      .ilike('name', `%${name.trim()}%`)
      .limit(5);

    if (error) throw error;
    return NextResponse.json({ profiles: profiles || [] });
  } catch (err) {
    console.error('Pro auth lookup error:', err);
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 });
  }
}
