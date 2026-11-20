import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';
import { decryptToken } from '@/lib/crypto';
import { isValidAdminToken } from '@/lib/admin-auth';
import { escapeHtml } from '@/lib/sanitize';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key_for_build');

function isAuthorizedPro(request, targetProId) {
  if (!targetProId) return false;
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim() ||
                request.headers.get('x-pro-token') ||
                new URL(request.url).searchParams.get('token');

  if (!token) return false;

  if (isValidAdminToken(token)) return true;

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

export async function POST(request) {
  try {
    const body = await request.json();
    const { proId, size, fullAddress, landmark, pincode } = body;

    if (!proId) {
      return NextResponse.json({ error: 'Pro ID is required' }, { status: 400 });
    }

    // Security Hardening (F-08): Require valid pro or admin session to claim T-shirt
    if (!isAuthorizedPro(request, proId)) {
      return NextResponse.json({ error: 'Unauthorized: Professional session required to claim welcome gift' }, { status: 401 });
    }

    if (!size || !size.trim()) {
      return NextResponse.json({ error: 'Please select a valid T-shirt size' }, { status: 400 });
    }
    if (!fullAddress || fullAddress.trim().length < 5) {
      return NextResponse.json({ error: 'Please enter a valid complete courier delivery address' }, { status: 400 });
    }
    const cleanPincode = (pincode || '').toString().trim();
    if (!/^\d{6}$/.test(cleanPincode)) {
      return NextResponse.json({ error: 'Please enter a valid 6-digit Indian PIN code' }, { status: 400 });
    }

    const client = supabaseAdmin || supabase;

    // 1. Fetch current profile
    const { data: profile, error: fetchError } = await client
      .from('profiles')
      .select('id, name, phone, email, trade, location, languages, verified, full_address')
      .eq('id', proId)
      .single();

    if (fetchError || !profile) {
      return NextResponse.json({ error: 'Pro profile not found' }, { status: 404 });
    }

    const cleanLandmark = landmark ? landmark.trim() : '';
    const formattedAddress = `${fullAddress.trim()}${cleanLandmark ? `, Near: ${cleanLandmark}` : ''}, PIN: ${cleanPincode}`;

    // Manage metadata tags safely in languages array
    let currentTags = Array.isArray(profile.languages) ? [...profile.languages] : [];
    currentTags = currentTags.filter(t => typeof t === 'string' && !t.startsWith('tshirt_'));
    
    currentTags.push(`tshirt_claimed:true`);
    currentTags.push(`tshirt_size:${size.trim()}`);
    currentTags.push(`tshirt_pincode:${cleanPincode}`);
    currentTags.push(`tshirt_date:${new Date().toISOString()}`);

    // Update profile using service_role
    const { error: updateError } = await client
      .from('profiles')
      .update({
        full_address: formattedAddress,
        languages: currentTags
      })
      .eq('id', proId);

    if (updateError) {
      console.error('Failed to update profile for T-shirt claim:', updateError);
      return NextResponse.json({ error: 'Failed to record shipment address' }, { status: 500 });
    }

    // Optional notification email to admin if RESEND_API_KEY is present
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_placeholder_key_for_build') {
      try {
        await resend.emails.send({
          from: 'Carpenterwala Alerts <alerts@carpenterwala.com>',
          to: ['carpenterwala.care@gmail.com'],
          subject: `🎁 New T-Shirt Claim: ${escapeHtml(profile.name)} (${escapeHtml(profile.trade)} - ${cleanPincode})`,
          html: `
            <h2>New Pro Welcome T-Shirt Claim Request</h2>
            <p><strong>Pro Name:</strong> ${escapeHtml(profile.name)}</p>
            <p><strong>Trade:</strong> ${escapeHtml(profile.trade)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(profile.phone || 'N/A')}</p>
            <p><strong>Email:</strong> ${escapeHtml(profile.email)}</p>
            <p><strong>T-Shirt Size:</strong> ${escapeHtml(size)}</p>
            <p><strong>Courier Address:</strong> ${escapeHtml(formattedAddress)}</p>
            <p><strong>KYC Verified:</strong> ${profile.verified ? '✅ YES' : '⏳ PENDING KYC'}</p>
            <p><strong>Claimed At:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          `
        });
      } catch (emailErr) {
        console.warn('Could not send admin email notification for T-shirt claim:', emailErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'T-shirt claim details recorded successfully',
      data: {
        tshirt_claimed: true,
        size: size.trim(),
        pincode: cleanPincode,
        delivery_address: formattedAddress
      }
    });
  } catch (error) {
    console.error('T-shirt claim route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
