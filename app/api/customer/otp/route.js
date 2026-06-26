import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { encryptToken, decryptToken } from '@/lib/crypto';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key_for_build');

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, email, otp, otpToken } = body;

    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // --- ACTION: SEND EMAIL OTP ---
    if (action === 'send') {
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity

      // Generate secure, stateless token for customer OTP
      const tokenPayload = {
        type: 'customer_otp',
        email: cleanEmail,
        code: generatedCode,
        expiresAt
      };
      const otpTokenStr = encryptToken(tokenPayload);

      let sentRealEmail = false;
      let emailError = null;

      // Try sending with Resend if API Key is configured
      if (process.env.RESEND_API_KEY) {
        try {
          console.log(`[Resend] Attempting to send customer OTP email using verified custom domain from: onboarding@carpenterwala.com`);
          let emailResponse = await resend.emails.send({
            from: 'Carpenterwala <onboarding@carpenterwala.com>',
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
                
                <div style="margin-top: 25px; padding: 12px; background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; color: #b45309; font-size: 0.85rem;">
                  <strong>⚠️ Important Notice:</strong> This is an automated notification. Please do not reply directly to this email address as replies are sent to an unmonitored mailbox and will not be received.
                </div>

                <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
                <p style="font-size: 0.8rem; color: #999999; text-align: center;">Carpenterwala.com · Bangalore, India</p>
              </div>
            `
          });

          // Check if custom domain email failed due to unverified domains
          if (emailResponse.error) {
            console.warn(`[Resend] Custom domain sending failed: ${emailResponse.error.message}. Falling back to default sandbox domain onboarding@resend.dev...`);
            
            emailResponse = await resend.emails.send({
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
                  
                  <div style="margin-top: 25px; padding: 12px; background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; color: #b45309; font-size: 0.85rem;">
                    <strong>⚠️ Important Notice:</strong> This is an automated notification. Please do not reply directly to this email address as replies are sent to an unmonitored mailbox and will not be received.
                  </div>

                  <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
                  <p style="font-size: 0.8rem; color: #999999; text-align: center;">Carpenterwala.com · Bangalore, India</p>
                </div>
              `
            });
          }

          if (emailResponse.error) {
            throw new Error(emailResponse.error.message || 'Resend API returned an error');
          }

          sentRealEmail = true;
          console.log(`[Resend] OTP successfully dispatched to ${cleanEmail}`);
        } catch (e) {
          emailError = e.message || 'Resend delivery failed';
          console.error(`[Resend Error] Failed to deliver OTP:`, emailError);
        }
      }

      if (emailError) {
        console.warn('Resend failed for customer OTP, falling back to simulated OTP banner:', emailError);
      }

      return NextResponse.json({
        success: true,
        simulated: !sentRealEmail,
        otp: !sentRealEmail ? generatedCode : null, // Send the code to frontend ONLY for simulation fallback
        otpToken: otpTokenStr,
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

      if (!otpToken) {
        return NextResponse.json({ error: 'Verification session has expired. Please request a new OTP.' }, { status: 400 });
      }

      const decrypted = decryptToken(otpToken);

      if (!decrypted || decrypted.type !== 'customer_otp' || decrypted.email !== cleanEmail) {
        return NextResponse.json({ error: 'Invalid verification session. Please request a new OTP.' }, { status: 400 });
      }

      if (Date.now() > decrypted.expiresAt) {
        return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
      }

      if (decrypted.code !== otp.trim()) {
        return NextResponse.json({ error: 'Invalid OTP. Please try again.' }, { status: 400 });
      }

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
