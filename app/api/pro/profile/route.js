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
      .select(`id, slug, name, email, trade, experience, location, avatar, about, skills, portfolio, verified, created_at,
        phone, full_address, aadhaar_front, aadhaar_back, pan_front, pan_back, 
        voter_driving_front, voter_driving_back, police_verification, onboarding_completed, onboarding_step, accepting_leads,
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
    const { 
      id, name, trade, location, about, skills, experience, portfolio, avatar,
      phone, full_address, aadhaar_front, aadhaar_back, pan_front, pan_back, 
      voter_driving_front, voter_driving_back, police_verification, onboarding_completed, onboarding_step, accepting_leads
    } = body;

    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (trade !== undefined) updateData.trade = trade;
    if (location !== undefined) updateData.location = location;
    if (about !== undefined) updateData.about = about;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (experience !== undefined) updateData.experience = experience;
    if (skills !== undefined) {
      updateData.skills = Array.isArray(skills)
        ? skills
        : skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (portfolio !== undefined) {
      updateData.portfolio = Array.isArray(portfolio) ? portfolio : [];
    }

    // Onboarding fields
    if (phone !== undefined) updateData.phone = phone;
    if (full_address !== undefined) updateData.full_address = full_address;
    if (aadhaar_front !== undefined) updateData.aadhaar_front = aadhaar_front;
    if (aadhaar_back !== undefined) updateData.aadhaar_back = aadhaar_back;
    if (pan_front !== undefined) updateData.pan_front = pan_front;
    if (pan_back !== undefined) updateData.pan_back = pan_back;
    if (voter_driving_front !== undefined) updateData.voter_driving_front = voter_driving_front;
    if (voter_driving_back !== undefined) updateData.voter_driving_back = voter_driving_back;
    if (police_verification !== undefined) updateData.police_verification = police_verification;
    if (onboarding_completed !== undefined) updateData.onboarding_completed = onboarding_completed;
    if (onboarding_step !== undefined) updateData.onboarding_step = onboarding_step;
    if (accepting_leads !== undefined) updateData.accepting_leads = accepting_leads;

    const { error } = await supabase.from('profiles').update(updateData).eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

