import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/pro/leads?pro_id=1
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const proId = searchParams.get('pro_id');

  if (!proId) return NextResponse.json({ error: 'pro_id required' }, { status: 400 });

  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .eq('pro_id', proId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ leads: leads || [] });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
