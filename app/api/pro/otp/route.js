import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

// Prevent dynamic module hot-reload from clearing the OTP map in development
if (!global.proOtpStore) {
  global.proOtpStore = new Map();
}
if (!global.proRegistrationStore) {
  global.proRegistrationStore = new Map();
}
const otpStore = global.proOtpStore;
const registrationStore = global.proRegistrationStore;

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

    // --- ACTION: SEND REGISTER OTP ---
    if (action === 'register_send') {
      const { name, phone, trade, location } = body;
      
      if (!name || name.trim().length < 2) {
        return NextResponse.json({ error: 'Please enter a valid name (min 2 characters).' }, { status: 400 });
      }
      if (!phone || !/^[6-9]\d{9}$/.test(phone.trim())) {
        return NextResponse.json({ error: 'Please enter a valid 10-digit mobile number.' }, { status: 400 });
      }
      if (!trade || trade === '') {
        return NextResponse.json({ error: 'Please select a valid trade.' }, { status: 400 });
      }
      if (!location || location.trim().length < 3) {
        return NextResponse.json({ error: 'Please enter a valid location.' }, { status: 400 });
      }

      // Check if profile already exists
      if (profile) {
        return NextResponse.json({ error: 'An account with this email is already registered.' }, { status: 400 });
      }

      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity

      // Store registration info
      registrationStore.set(cleanEmail, {
        code: generatedCode,
        expiresAt,
        name: name.trim(),
        phone: phone.trim(),
        trade: trade,
        location: location.trim()
      });

      let sentRealEmail = false;
      let emailError = null;

      // Try sending with Resend if API Key is configured
      if (process.env.RESEND_API_KEY) {
        try {
          console.log(`[Resend Pro Register] Attempting to send pro registration OTP email using verified custom domain from: onboarding@carpenterwala.com`);
          let emailResponse = await resend.emails.send({
            from: 'Carpenterwala Pro <onboarding@carpenterwala.com>',
            to: cleanEmail,
            subject: 'Your Carpenterwala Pro Verification Code',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff; color: #333333;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <span style="font-size: 40px;">🔧</span>
                  <h1 style="color: #2563eb; margin: 10px 0 0 0; font-size: 24px;">Welcome to Carpenterwala Pro!</h1>
                </div>
                <p>Hello <strong>${name.trim()}</strong>,</p>
                <p>Thank you for signing up as a Service Professional. To complete your registration and start your onboarding, please use the verification code below:</p>
                <div style="text-align: center; margin: 30px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
                  <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e3a8a;">${generatedCode}</span>
                </div>
                <p style="font-size: 0.9rem; color: #666666;">This code is valid for 10 minutes. If you did not request this code, you can safely ignore this email.</p>
                
                <div style="margin-top: 25px; padding: 12px; background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; color: #b45309; font-size: 0.85rem;">
                  <strong>⚠️ Important Notice:</strong> This is an automated notification. Please do not reply directly to this email address as replies are sent to an unmonitored mailbox and will not be received.
                </div>

                <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
                <p style="font-size: 0.8rem; color: #999999; text-align: center;">Carpenterwala.com · Bangalore, India</p>
              </div>
            `
          });

          // Check if custom domain email failed
          if (emailResponse.error) {
            console.warn(`[Resend Pro Register] Custom domain sending failed: ${emailResponse.error.message}. Falling back to default sandbox domain onboarding@resend.dev...`);
            
            emailResponse = await resend.emails.send({
              from: 'Carpenterwala Pro <onboarding@resend.dev>',
              to: cleanEmail,
              subject: 'Your Carpenterwala Pro Verification Code',
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff; color: #333333;">
                  <div style="text-align: center; margin-bottom: 20px;">
                    <span style="font-size: 40px;">🔧</span>
                    <h1 style="color: #2563eb; margin: 10px 0 0 0; font-size: 24px;">Welcome to Carpenterwala Pro!</h1>
                  </div>
                  <p>Hello <strong>${name.trim()}</strong>,</p>
                  <p>Thank you for signing up as a Service Professional. To complete your registration and start your onboarding, please use the verification code below:</p>
                  <div style="text-align: center; margin: 30px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e3a8a;">${generatedCode}</span>
                  </div>
                  <p style="font-size: 0.9rem; color: #666666;">This code is valid for 10 minutes. If you did not request this code, you can safely ignore this email.</p>
                  
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
        } catch (e) {
          emailError = e.message || 'Resend delivery failed';
        }
      }

      return NextResponse.json({
        success: true,
        simulated: !sentRealEmail,
        otp: !sentRealEmail ? generatedCode : null,
        message: sentRealEmail 
          ? 'OTP sent to your registered email address.' 
          : 'OTP generated (Simulated Gateway due to sandbox mode).'
      });
    }

    // --- ACTION: VERIFY REGISTER OTP ---
    if (action === 'register_verify') {
      if (!otp || otp.length !== 6) {
        return NextResponse.json({ error: 'Please enter a 6-digit OTP.' }, { status: 400 });
      }

      const storedReg = registrationStore.get(cleanEmail);

      if (!storedReg) {
        return NextResponse.json({ error: 'No registration OTP requested for this email address.' }, { status: 400 });
      }

      if (Date.now() > storedReg.expiresAt) {
        registrationStore.delete(cleanEmail);
        return NextResponse.json({ error: 'OTP has expired. Please register again.' }, { status: 400 });
      }

      if (storedReg.code !== otp.trim()) {
        return NextResponse.json({ error: 'Invalid OTP. Please try again.' }, { status: 400 });
      }

      // Generate unique slug
      const baseSlug = storedReg.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      let slug = baseSlug;
      let counter = 1;
      while (true) {
        const { data: existing } = await supabase.from('profiles').select('id').eq('slug', slug).maybeSingle();
        if (!existing) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Insert profile
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          slug,
          name: storedReg.name,
          email: cleanEmail,
          phone: storedReg.phone,
          trade: storedReg.trade,
          location: storedReg.location,
          verified: false,
          onboarding_completed: false,
          onboarding_step: 1
        })
        .select()
        .single();

      if (insertError) {
        console.error('Failed to create profile:', insertError);
        return NextResponse.json({ error: 'Failed to create professional profile. Please try again.' }, { status: 500 });
      }

      registrationStore.delete(cleanEmail);

      return NextResponse.json({
        success: true,
        profiles: [newProfile]
      });
    }

    // --- CHECK FOR LOGIN DISPATCH ---
    if (!profile) {
      return NextResponse.json({
        error: 'No professional profile found matching this email. Please click the Sign Up tab to register.'
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
          console.log(`[Resend Pro] Attempting to send pro OTP email using verified custom domain from: onboarding@carpenterwala.com`);
          let emailResponse = await resend.emails.send({
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
                  <strong>⚠️ Important Notice:</strong> This is an automated notification. Please do not reply directly to this email address as replies are sent to an unmonitored mailbox and will not be received.
                </div>

                <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
                <p style="font-size: 0.8rem; color: #999999; text-align: center;">Carpenterwala.com · Bangalore, India</p>
              </div>
            `
          });

          // Check if custom domain email failed
          if (emailResponse.error) {
            console.warn(`[Resend Pro] Custom domain sending failed: ${emailResponse.error.message}. Falling back to default sandbox domain onboarding@resend.dev...`);
            
            emailResponse = await resend.emails.send({
              from: 'Carpenterwala Pro <onboarding@resend.dev>',
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
        } catch (e) {
          emailError = e.message || 'Resend delivery failed';
        }
      }

      return NextResponse.json({
        success: true,
        simulated: !sentRealEmail,
        otp: !sentRealEmail ? generatedCode : null,
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

      otpStore.delete(cleanEmail);

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
