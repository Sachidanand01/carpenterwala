import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/pro/profile?id=1
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`id, slug, name, trade, experience, location, avatar, about, skills, portfolio, verified, created_at,
        reviews ( id, author, rating, text, created_at )`)
      .eq('id', id)
      .single();

    if (error) throw error;
    return NextResponse.json({ profile });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PUT /api/pro/profile — update profile fields
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, trade, location, about, skills, experience, portfolio } = body;

    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (trade !== undefined) updateData.trade = trade;
    if (location !== undefined) updateData.location = location;
    if (about !== undefined) updateData.about = about;
    if (experience !== undefined) updateData.experience = experience;
    if (skills !== undefined) {
      updateData.skills = Array.isArray(skills)
        ? skills
        : skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (portfolio !== undefined) {
      updateData.portfolio = Array.isArray(portfolio) ? portfolio : [];
    }

    const { error } = await supabase.from('profiles').update(updateData).eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
