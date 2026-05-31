import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

// Prevent dynamic module hot-reload from clearing the OTP map in development
if (!global.proOtpStore) {
  global.proOtpStore = new Map();
}
const otpStore = global.proOtpStore;

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, email, otp } = body;

    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // 1. LOOKUP PROFESSIONAL PROFILE BY EMAIL
    const { data: profile, error: dbError } = await supabase
      .from('profiles')
      .select('id, name, email, slug, trade, location, verified')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (dbError) {
      console.error('DB Lookup error:', dbError);
      return NextResponse.json({ error: 'Database lookup failed.' }, { status: 500 });
    }

    if (!profile) {
      return NextResponse.json({
        error: 'No professional profile found matching this email. Please contact support to register.'
      }, { status: 404 });
    }

    // --- ACTION: SEND EMAIL OTP ---
    if (action === 'send') {
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity

      // Store OTP
      otpStore.set(cleanEmail, { code: generatedCode, expiresAt, profileId: profile.id });

      let sentRealEmail = false;
      let emailError = null;

      // Try sending with Resend if API Key is configured
      if (process.env.RESEND_API_KEY) {
        try {
          await resend.emails.send({
            from: 'Carpenterwala Pro <onboarding@carpenterwala.com>',
            to: cleanEmail,
            subject: 'Your Carpenterwala Pro Verification Code',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff; color: #333333;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <span style="font-size: 40px;">🔧</span>
                  <h1 style="color: #2563eb; margin: 10px 0 0 0; font-size: 24px;">Carpenterwala Pro Portal</h1>
                </div>
                <p>Hello <strong>${profile.name}</strong>,</p>
                <p>You requested a One-Time Password (OTP) to log in to your Pro Portal. Please use the verification code below:</p>
                <div style="text-align: center; margin: 30px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
                  <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e3a8a;">${generatedCode}</span>
                </div>
                <p style="font-size: 0.9rem; color: #666666;">This code is valid for 10 minutes. If you did not request this login, you can safely ignore this email.</p>
                
                <div style="margin-top: 25px; padding: 12px; background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; color: #b45309; font-size: 0.85rem;">
                  <strong>⚠️ Important Notice:</strong> This is an automated notification. Please do not reply directly to this email address (onboarding@carpenterwala.com) as replies are sent to an unmonitored mailbox and will not be received.
                </div>

                <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
                <p style="font-size: 0.8rem; color: #999999; text-align: center;">Carpenterwala.com · Bangalore, India</p>
              </div>
            `
          });
          sentRealEmail = true;
        } catch (e) {
          emailError = e.message || 'Resend delivery failed';
        }
      }

      if (emailError) {
        console.warn('Resend failed, falling back to simulated OTP banner:', emailError);
      }

      return NextResponse.json({
        success: true,
        simulated: !sentRealEmail,
        otp: !sentRealEmail ? generatedCode : null, // Send the code to frontend for simulation mode
        message: sentRealEmail 
          ? 'OTP sent to your registered email address.' 
          : 'OTP generated (Simulated Gateway due to sandbox mode).'
      });
    }

    // --- ACTION: VERIFY EMAIL OTP ---
    if (action === 'verify') {
      if (!otp || otp.length !== 6) {
        return NextResponse.json({ error: 'Please enter a 6-digit OTP.' }, { status: 400 });
      }

      const storedOtp = otpStore.get(cleanEmail);

      if (!storedOtp) {
        return NextResponse.json({ error: 'No OTP requested for this email address.' }, { status: 400 });
      }

      if (Date.now() > storedOtp.expiresAt) {
        otpStore.delete(cleanEmail);
        return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
      }

      if (storedOtp.code !== otp.trim()) {
        return NextResponse.json({ error: 'Invalid OTP. Please try again.' }, { status: 400 });
      }

      // OTP Verified! Remove it from store.
      otpStore.delete(cleanEmail);

      // Return the single matched profile
      return NextResponse.json({
        success: true,
        profiles: [profile]
      });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (err) {
    console.error('OTP Route error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
