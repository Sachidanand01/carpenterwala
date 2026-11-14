import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { generateProCode } from '@/lib/pro-slug';
import { decryptToken } from '@/lib/crypto';

/**
 * Checks whether the incoming request is authorized to view or edit full KYC and private details
 */
function isAuthorizedPro(request, targetProId) {
  if (!targetProId) return false;
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim() || 
                request.headers.get('x-pro-token') || 
                new URL(request.url).searchParams.get('token');

  if (!token) return false;

  // Support Admin authorization
  const expectedPassword = process.env.ADMIN_PASSWORD || 'CarpenterwalaAdmin2026';
  const expectedAdminToken = crypto
    .createHash('sha256')
    .update(expectedPassword + 'carpenterwala-salt-2026')
    .digest('hex');
  if (token === expectedAdminToken || token === expectedPassword) {
    return true;
  }

  const decrypted = decryptToken(token);
  if (!decrypted) return false;

  if (decrypted.type === 'pro_session' && String(decrypted.proId) === String(targetProId)) {
    return true;
  }
  if (decrypted.role === 'admin' || decrypted.type === 'admin_session') {
    return true;
  }
  return false;
}

// GET /api/pro/profile?id=1
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const authorized = isAuthorizedPro(request, id);

  try {
    let { data: profile, error } = await supabase
      .from('profiles')
      .select(`id, pro_code, slug, name, email, trade, experience, location, avatar, about, skills, portfolio, languages, verified, created_at,
        latitude, longitude,
        phone, full_address, aadhaar_front, aadhaar_back, pan_front, pan_back, 
        voter_driving_front, voter_driving_back, police_verification, onboarding_completed, onboarding_step, accepting_leads, pending_avatar, rejection_reason,
        service_radius_km, radius_updated_at,
        reviews ( id, author, rating, text, created_at )`)
      .eq('id', id)
      .single();

    if (error && (error.code === '42703' || error.message?.includes('pro_code') || error.message?.includes('service_radius_km') || error.message?.includes('rejection_reason') || error.code === 'PGRST204')) {
      const fallbackRes = await supabase
        .from('profiles')
        .select(`id, slug, name, email, trade, experience, location, avatar, about, skills, portfolio, languages, verified, created_at,
          latitude, longitude,
          phone, full_address, aadhaar_front, aadhaar_back, pan_front, pan_back, 
          voter_driving_front, voter_driving_back, police_verification, onboarding_completed, onboarding_step, accepting_leads, pending_avatar,
          reviews ( id, author, rating, text, created_at )`)
        .eq('id', id)
        .single();
      profile = fallbackRes.data;
      error = fallbackRes.error;
    }

    if (error) throw error;

    if (profile) {
      // Auto-assign pro_code if missing
      if (!profile.pro_code) {
        try {
          const generated = generateProCode();
          const { error: codeErr } = await supabase.from('profiles').update({ pro_code: generated }).eq('id', id);
          if (!codeErr) profile.pro_code = generated;
        } catch (_) {}
      }
      // Parse fallback radius & timestamp if dedicated columns aren't present yet
      if (profile.service_radius_km === undefined || profile.service_radius_km === null) {
        const radiusTag = (profile.languages || []).find(l => typeof l === 'string' && l.startsWith('radius:'));
        profile.service_radius_km = radiusTag ? parseInt(radiusTag.replace('radius:', ''), 10) : 5;
      }
      if (!profile.radius_updated_at) {
        const updatedTag = (profile.languages || []).find(l => typeof l === 'string' && l.startsWith('radius_updated:'));
        profile.radius_updated_at = updatedTag ? updatedTag.replace('radius_updated:', '') : null;
      }
      if (!profile.latitude) profile.latitude = 12.9716;
      if (!profile.longitude) profile.longitude = 77.5946;

      // ANTI-SCRAPING SHIELD: Strip sensitive KYC documents and private PII if caller is not authorized
      if (!authorized) {
        delete profile.aadhaar_front;
        delete profile.aadhaar_back;
        delete profile.pan_front;
        delete profile.pan_back;
        delete profile.voter_driving_front;
        delete profile.voter_driving_back;
        delete profile.police_verification;
        delete profile.full_address;
        delete profile.rejection_reason;
        delete profile.phone;
        delete profile.email;
      }
    }

    return NextResponse.json({ profile });
  } catch (err) {
    console.error('Failed to fetch profile:', err);
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
      voter_driving_front, voter_driving_back, police_verification, onboarding_completed, onboarding_step, accepting_leads, pending_avatar, rejection_reason,
      service_radius_km, latitude, longitude, radius_updated_at
    } = body;

    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    // Authorization Shield: Only the pro owning this profile (or an admin) may update it
    if (!isAuthorizedPro(request, id)) {
      return NextResponse.json({ error: 'Unauthorized: You do not have permission to modify this profile.' }, { status: 401 });
    }

    const client = supabaseAdmin || supabase;

    // Fetch existing profile to check previous state for 24h radius cooldown
    const { data: existingProfile } = await client
      .from('profiles')
      .select('id, onboarding_completed, latitude, longitude, languages')
      .eq('id', id)
      .maybeSingle();

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (trade !== undefined) updateData.trade = trade;
    if (location !== undefined) updateData.location = location;
    if (about !== undefined) updateData.about = typeof about === 'string' ? about.slice(0, 350) : about;
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

    // Geolocation & Radius handling
    if (latitude !== undefined) updateData.latitude = Number(latitude);
    if (longitude !== undefined) updateData.longitude = Number(longitude);

    let newRadiusUpdatedAt = null;
    let fallbackLanguages = existingProfile?.languages ? [...existingProfile.languages] : [];

    if (service_radius_km !== undefined) {
      const radiusNum = Math.min(50, Math.max(1, Number(service_radius_km) || 5));
      updateData.service_radius_km = radiusNum;

      // 24-hr check if profile has completed onboarding (post-onboarding edit)
      if (existingProfile?.onboarding_completed) {
        const existingUpdatedTag = (fallbackLanguages || []).find(l => typeof l === 'string' && l.startsWith('radius_updated:'));
        const lastUpdated = radius_updated_at || (existingUpdatedTag ? existingUpdatedTag.replace('radius_updated:', '') : null);

        if (lastUpdated) {
          const diffMs = Date.now() - new Date(lastUpdated).getTime();
          const cooldownMs = 24 * 60 * 60 * 1000;
          if (diffMs < cooldownMs) {
            return NextResponse.json({
              error: 'Service radius can only be updated once every 24 hours.',
              code: 'RADIUS_COOLDOWN'
            }, { status: 400 });
          }
        }
        newRadiusUpdatedAt = new Date().toISOString();
        updateData.radius_updated_at = newRadiusUpdatedAt;
      }

      // Update fallback tags in languages
      fallbackLanguages = fallbackLanguages.filter(l => typeof l === 'string' && !l.startsWith('radius:') && !l.startsWith('radius_updated:'));
      fallbackLanguages.push(`radius:${radiusNum}`);
      if (newRadiusUpdatedAt) {
        fallbackLanguages.push(`radius_updated:${newRadiusUpdatedAt}`);
      }
      updateData.languages = fallbackLanguages;
    }

    // Onboarding fields
    if (phone !== undefined) {
      const cleanPhone = phone ? phone.trim().replace(/\D/g, '').slice(-10) : '';
      if (cleanPhone) {
        // Check if another profile already has this phone number
        const { data: existingPhone } = await supabase
          .from('profiles')
          .select('id')
          .eq('phone', cleanPhone)
          .neq('id', id)
          .maybeSingle();

        if (existingPhone) {
          return NextResponse.json({
            error: 'This mobile number is already registered with another professional account. Please use your personal number.',
            code: 'PHONE_EXISTS'
          }, { status: 400 });
        }
      }
      updateData.phone = cleanPhone || phone;
    }
    if (full_address !== undefined) updateData.full_address = full_address;
    if (aadhaar_front !== undefined) updateData.aadhaar_front = aadhaar_front;
    if (aadhaar_back !== undefined) updateData.aadhaar_back = aadhaar_back;
    if (pan_front !== undefined) updateData.pan_front = pan_front;
    if (pan_back !== undefined) updateData.pan_back = pan_back;
    if (voter_driving_front !== undefined) updateData.voter_driving_front = voter_driving_front;
    if (voter_driving_back !== undefined) updateData.voter_driving_back = voter_driving_back;
    if (police_verification !== undefined) updateData.police_verification = police_verification;
    if (onboarding_completed !== undefined) {
      updateData.onboarding_completed = onboarding_completed;
      if (onboarding_completed === true) {
        // Clear previous rejection reasons when pro resubmits
        updateData.rejection_reason = null;
      }
    }
    if (onboarding_step !== undefined) updateData.onboarding_step = onboarding_step;
    if (accepting_leads !== undefined) updateData.accepting_leads = accepting_leads;
    if (pending_avatar !== undefined) updateData.pending_avatar = pending_avatar;
    if (rejection_reason !== undefined) updateData.rejection_reason = rejection_reason;

    let { error } = await client.from('profiles').update(updateData).eq('id', id);

    // If update fails because dedicated columns don't exist yet, retry with fallbackData
    if (error && (error.code === '42703' || error.message?.includes('service_radius_km') || error.message?.includes('rejection_reason') || error.code === 'PGRST204')) {
      const fallbackData = { ...updateData };
      delete fallbackData.service_radius_km;
      delete fallbackData.radius_updated_at;
      delete fallbackData.rejection_reason;
      const retry = await client.from('profiles').update(fallbackData).eq('id', id);
      error = retry.error;
    }

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to update profile:', err);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

