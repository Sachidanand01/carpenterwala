import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key_for_build');

function verifyAdminToken(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim();

  // Also support cron secret if invoked by automated scheduler
  if (process.env.CRON_SECRET && token === process.env.CRON_SECRET) {
    return true;
  }

  const expectedPassword = process.env.ADMIN_PASSWORD || 'CarpenterwalaAdmin2026';
  const expectedToken = crypto
    .createHash('sha256')
    .update(expectedPassword + 'carpenterwala-salt-2026')
    .digest('hex');

  return token === expectedToken;
}

function buildReminderEmailHtml({ name, trade, location }) {
  const cleanName = name || 'Service Professional';
  const cleanTrade = trade || 'Carpentry / Handyman';
  const cleanLoc = location || 'your city';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Carpenterwala Profile is Almost Ready!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); padding: 35px 30px; text-align: center;">
              <span style="font-size: 45px; display: block; margin-bottom: 10px;">🚀</span>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">You're One Step Away!</h1>
              <p style="color: #bfdbfe; margin: 8px 0 0 0; font-size: 15px; font-weight: 500;">Complete your profile to activate your public profile page and showcase your work</p>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 35px 30px;">
              <p style="font-size: 16px; color: #1f2937; margin: 0 0 16px 0; line-height: 1.5;">
                Hello <strong>${cleanName}</strong>,
              </p>
              
              <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                Great news — your registration for <strong>${cleanTrade}</strong> in <strong>${cleanLoc}</strong> is almost complete! To activate your public profile page and showcase your craft, experience, and past work on Carpenterwala, you just need to complete verification.
              </p>

              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                  ✨ What You'll Unlock Once Listed:
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #15803d; font-size: 14px; line-height: 1.6;">
                  <li><strong>Dedicated Public Profile Page</strong> to showcase your work photos, specialties, and experience online</li>
                  <li><strong>Verified Pro Badge</strong> establishing instant trust and credibility for your craft</li>
                  <li><strong>Google Search Discoverability</strong> so people searching in ${cleanLoc} can view your profile</li>
                </ul>
              </div>

              <!-- Action Needed Checklist -->
              <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 15px;">
                  📋 Action Needed: Upload Verification Documents
                </h3>
                <p style="color: #b45309; font-size: 13.5px; margin: 0 0 12px 0; line-height: 1.5;">
                  To publish your profile live, please log in and upload clear photos or PDFs of:
                </p>
                <div style="font-size: 13.5px; color: #78350f; line-height: 1.8;">
                  • 🪪 <strong>Voter ID or Driving License</strong> (Front & Back)<br>
                  • 👮‍♂️ <strong>Police Verification Certificate</strong> (PCC / Character Certificate)
                </div>
              </div>

              <!-- Call to Action Button -->
              <div style="text-align: center; margin: 35px 0 25px 0;">
                <a href="https://carpenterwala.com/pro/login" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; padding: 15px 35px; border-radius: 10px; font-weight: 700; font-size: 16px; text-decoration: none; display: inline-block; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.35);">
                  👉 Complete Profile & Upload Documents
                </a>
              </div>

              <p style="text-align: center; color: #9ca3af; font-size: 12.5px; margin: 0;">
                Takes less than 2 minutes from your mobile phone.
              </p>
            </td>
          </tr>

          <!-- Hindi Help Section -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #6b7280; line-height: 1.6;">
              <strong style="color: #374151;">हिंदी सहायता:</strong><br>
              नमस्ते ${cleanName} जी, कारपेंटरवाला पर आपका प्रोफ़ाइल लगभग तैयार है। अपना पब्लिक प्रोफाइल पेज चालू करने और अपने काम का प्रदर्शन करने के लिए कृपया अपने पहचान दस्तावेज़ अपलोड करें: <a href="https://carpenterwala.com/pro/login" style="color: #2563eb;">carpenterwala.com/pro/login</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #111827; padding: 25px 30px; text-align: center; color: #9ca3af; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0 0 5px 0; color: #f3f4f6; font-weight: 600;">Carpenterwala — India's Free Home Services Directory</p>
              <p style="margin: 0 0 10px 0;">Need help? Reply directly to this email or visit <a href="https://carpenterwala.com/contact" style="color: #60a5fa; text-decoration: none;">carpenterwala.com/contact</a></p>
              <p style="margin: 0; color: #6b7280;">© 2026 Carpenterwala. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// POST /api/admin/remind-pro
export async function POST(request) {
  try {
    if (!verifyAdminToken(request)) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const body = await request.json();
    const { proId, action } = body;

    // --- BULK AUTOMATED REMINDER (All pros registered > 24 hours ago with missing docs) ---
    if (action === 'bulk_auto') {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      // Query profiles that are unverified, registered more than 24h ago, and missing documents
      const { data: incompletePros, error: queryErr } = await supabase
        .from('profiles')
        .select('id, name, email, phone, trade, location, created_at, voter_driving_front, police_verification, verified')
        .eq('verified', false)
        .lt('created_at', twentyFourHoursAgo)
        .or('voter_driving_front.is.null,police_verification.is.null')
        .not('email', 'is', null)
        .limit(25); // Safe batch limit

      if (queryErr) {
        console.error('[Bulk Remind] Query error:', queryErr);
        return NextResponse.json({ error: queryErr.message }, { status: 500 });
      }

      if (!incompletePros || incompletePros.length === 0) {
        return NextResponse.json({
          success: true,
          message: 'No unverified profiles older than 24 hours require reminders.',
          count: 0,
        });
      }

      let sentCount = 0;
      const errors = [];

      for (const pro of incompletePros) {
        if (!pro.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pro.email)) continue;

        try {
          const emailHtml = buildReminderEmailHtml(pro);
          let emailRes = await resend.emails.send({
            from: 'Carpenterwala Pro <onboarding@carpenterwala.com>',
            to: pro.email,
            subject: `🚀 ${pro.name || 'Pro'}, You're 1 Step Away from Getting Listed on Carpenterwala!`,
            html: emailHtml,
          });

          // Fallback if custom domain not verified in sandbox
          if (emailRes.error) {
            emailRes = await resend.emails.send({
              from: 'Carpenterwala Pro <onboarding@resend.dev>',
              to: pro.email,
              subject: `🚀 ${pro.name || 'Pro'}, You're 1 Step Away from Getting Listed on Carpenterwala!`,
              html: emailHtml,
            });
          }

          if (!emailRes.error) {
            sentCount++;
          } else {
            errors.push({ id: pro.id, email: pro.email, error: emailRes.error.message });
          }
        } catch (err) {
          errors.push({ id: pro.id, email: pro.email, error: err.message });
        }
      }

      return NextResponse.json({
        success: true,
        message: `Successfully dispatched reminders to ${sentCount} professional(s).`,
        count: sentCount,
        errors: errors.length > 0 ? errors : undefined,
      });
    }

    // --- INDIVIDUAL PRO REMINDER (From Document Audit Modal) ---
    if (!proId) {
      return NextResponse.json({ error: 'proId is required' }, { status: 400 });
    }

    const { data: profile, error: proErr } = await supabase
      .from('profiles')
      .select('id, name, email, phone, trade, location, verified')
      .eq('id', proId)
      .single();

    if (proErr || !profile) {
      return NextResponse.json({ error: 'Professional profile not found' }, { status: 404 });
    }

    if (!profile.email) {
      return NextResponse.json({ error: 'This professional does not have a registered email address.' }, { status: 400 });
    }

    const emailHtml = buildReminderEmailHtml(profile);

    let emailRes = await resend.emails.send({
      from: 'Carpenterwala Pro <onboarding@carpenterwala.com>',
      to: profile.email,
      subject: `🚀 ${profile.name || 'Pro'}, You're 1 Step Away from Getting Listed on Carpenterwala!`,
      html: emailHtml,
    });

    if (emailRes.error) {
      emailRes = await resend.emails.send({
        from: 'Carpenterwala Pro <onboarding@resend.dev>',
        to: profile.email,
        subject: `🚀 ${profile.name || 'Pro'}, You're 1 Step Away from Getting Listed on Carpenterwala!`,
        html: emailHtml,
      });
    }

    if (emailRes.error) {
      console.error('[Remind Pro] Resend error:', emailRes.error);
      return NextResponse.json({ error: emailRes.error.message || 'Failed to dispatch email' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Document completion reminder sent successfully to ${profile.email}!`,
    });
  } catch (err) {
    console.error('[Remind Pro] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
