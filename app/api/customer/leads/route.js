import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');

  if (!phone) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
  }

  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select(`
        id,
        name,
        phone,
        task,
        created_at,
        profiles ( id, slug, name, trade, avatar, location )
      `)
      .eq('phone', phone)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    return NextResponse.json({ leads }, { status: 200 });
  } catch (error) {
    console.error("Error fetching customer leads:", error);
    return NextResponse.json({ error: 'Failed to fetch customer leads' }, { status: 500 });
  }
}
