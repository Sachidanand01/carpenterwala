import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

// In-memory OTP storage for customer verification
const otpStore = new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, email, otp } = body;

    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // --- ACTION: SEND EMAIL OTP ---
    if (action === 'send') {
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity

      // Store OTP
      otpStore.set(cleanEmail, { code: generatedCode, expiresAt });

      let sentRealEmail = false;
      let emailError = null;

      // Try sending with Resend if API Key is configured
      if (process.env.RESEND_API_KEY) {
        try {
          await resend.emails.send({
            from: 'Carpenterwala <onboarding@resend.dev>',
            to: cleanEmail,
            subject: 'Your Carpenterwala Verification Code',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff; color: #333333;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <span style="font-size: 40px;">🔑</span>
                  <h1 style="color: #2563eb; margin: 10px 0 0 0; font-size: 24px;">Carpenterwala Customer Portal</h1>
                </div>
                <p>Hello,</p>
                <p>Use the following verification code to secure your account and proceed with your request on Carpenterwala:</p>
                <div style="text-align: center; margin: 30px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
                  <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e3a8a;">${generatedCode}</span>
                </div>
                <p style="font-size: 0.9rem; color: #666666;">This code is valid for 10 minutes. If you did not request this login, you can safely ignore this email.</p>
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
        console.warn('Resend failed for customer OTP, falling back to simulated OTP banner:', emailError);
      }

      return NextResponse.json({
        success: true,
        simulated: !sentRealEmail,
        otp: !sentRealEmail ? generatedCode : null, // Send the code to frontend ONLY for simulation fallback
        message: sentRealEmail 
          ? 'OTP sent to your email address.' 
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

      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully.'
      });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (err) {
    console.error('Customer OTP Route error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
