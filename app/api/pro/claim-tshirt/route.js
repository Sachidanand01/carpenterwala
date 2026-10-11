import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key_for_build');

export async function POST(request) {
  try {
    const body = await request.json();
    const { proId, size, fullAddress, landmark, pincode } = body;

    if (!proId) {
      return NextResponse.json({ error: 'Pro ID is required' }, { status: 400 });
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

    // 1. Fetch current profile
    const { data: profile, error: fetchError } = await supabase
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

    // Update profile
    const { error: updateError } = await supabase
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
          subject: `🎁 New T-Shirt Claim: ${profile.name} (${profile.trade} - ${cleanPincode})`,
          html: `
            <h2>New Pro Welcome T-Shirt Claim Request</h2>
            <p><strong>Pro Name:</strong> ${profile.name}</p>
            <p><strong>Trade:</strong> ${profile.trade}</p>
            <p><strong>Phone:</strong> ${profile.phone || 'N/A'}</p>
            <p><strong>Email:</strong> ${profile.email}</p>
            <p><strong>T-Shirt Size:</strong> ${size}</p>
            <p><strong>Courier Address:</strong> ${formattedAddress}</p>
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
        size: size.trim(),
        fullAddress: formattedAddress,
        pincode: cleanPincode,
        claimedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('T-shirt claim error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
