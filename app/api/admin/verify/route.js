import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key_for_build');

// POST /api/admin/verify
export async function POST(request) {
  try {
    // 1. Verify Authorization
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    const expectedPassword = process.env.ADMIN_PASSWORD || 'CarpenterwalaAdmin2026';
    const expectedToken = crypto
      .createHash('sha256')
      .update(expectedPassword + 'carpenterwala-salt-2026')
      .digest('hex');

    if (!token || token !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    // 2. Parse request payload
    const body = await request.json();
    const { proId, action, reasons = [], customMessage = '', targetStep = 2 } = body;

    if (!proId) {
      return NextResponse.json({ error: 'proId is required' }, { status: 400 });
    }

    // Fetch the current profile
    const { data: profile, error: getErr } = await supabase
      .from('profiles')
      .select('id, name, email, phone, trade, pending_avatar')
      .eq('id', proId)
      .single();

    if (getErr || !profile) {
      return NextResponse.json({ error: 'Professional profile not found' }, { status: 404 });
    }

    let updateData = {};

    if (action === 'verify') {
      updateData = {
        verified: true,
        onboarding_completed: true,
        rejection_reason: null,
      };
    } else if (action === 'reject') {
      const reasonParts = [];
      if (Array.isArray(reasons) && reasons.length > 0) {
        reasonParts.push(reasons.join('; '));
      }
      if (customMessage && customMessage.trim()) {
        reasonParts.push(customMessage.trim());
      }
      const combinedReason = reasonParts.join(' — ') || 'Please re-upload clearer copies of your verification documents.';

      updateData = {
        verified: false,
        onboarding_completed: false, // Reverts them to onboarding wizard
        onboarding_step: Number(targetStep) || 2, // Reopen at selected step
        rejection_reason: combinedReason,
      };
    } else if (action === 'approve_avatar') {
      if (!profile.pending_avatar) {
        return NextResponse.json({ error: 'No pending photo update found to approve' }, { status: 400 });
      }

      updateData = {
        avatar: profile.pending_avatar,
        pending_avatar: null,
      };
    } else if (action === 'reject_avatar') {
      updateData = {
        pending_avatar: null,
      };
    } else {
      return NextResponse.json({ error: 'Invalid action. Must be "verify", "reject", "approve_avatar", or "reject_avatar"' }, { status: 400 });
    }

    // Attempt update
    let { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', proId);

    // Graceful fallback if `rejection_reason` column does not exist yet in Supabase
    if (error && (error.message?.includes('rejection_reason') || error.details?.includes('rejection_reason') || error.code === 'PGRST204' || error.code === '42703')) {
      console.warn('Supabase profiles table missing rejection_reason column. Retrying update without rejection_reason:', error);
      const fallbackData = { ...updateData };
      delete fallbackData.rejection_reason;
      const retry = await supabase
        .from('profiles')
        .update(fallbackData)
        .eq('id', proId);
      error = retry.error;
    }

    if (error) {
      console.error('Supabase update failed in /api/admin/verify:', error);
      return NextResponse.json({ 
        error: error.message || 'Failed to update professional verification status',
        details: error.details || error.hint || error.code 
      }, { status: 500 });
    }

    // Send rejection notification email via Resend if email exists (non-blocking)
    if (action === 'reject' && profile.email) {
      try {
        const proName = profile.name || 'Service Professional';
        const reasonsListHtml = Array.isArray(reasons) && reasons.length > 0
          ? reasons.map(r => `<li style="margin-bottom: 6px;">${r}</li>`).join('')
          : `<li>Documents require clearer, higher resolution scans.</li>`;

        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #ea580c, #c2410c); padding: 32px 24px; text-align: center; color: #ffffff; }
    .content { padding: 32px 28px; }
    .callout { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 18px 20px; border-radius: 8px; margin: 20px 0; }
    .tips { background: #f1f5f9; padding: 18px 20px; border-radius: 8px; margin: 20px 0; }
    .btn { display: inline-block; background: #ea580c; color: #ffffff !important; padding: 14px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 15px; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #64748b; background: #f8fafc; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">🪚 Carpenterwala.com</h1>
      <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">Professional Verification Update</p>
    </div>
    <div class="content">
      <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">Hello ${proName},</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #475569;">
        Thank you for submitting your onboarding details on Carpenterwala. Our verification team reviewed your documents, and we need you to update a few items before activating your verified listing.
      </p>

      <div class="callout">
        <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 700; color: #b45309;">⚠️ Action Required / Document Issues:</h3>
        <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #78350f; line-height: 1.6;">
          ${reasonsListHtml}
        </ul>
        ${customMessage ? `<p style="margin: 10px 0 0 0; font-size: 13px; color: #78350f; font-style: italic;"><strong>Admin Feedback:</strong> ${customMessage}</p>` : ''}
      </div>

      <div class="tips">
        <h4 style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #334155;">💡 Tips for instant verification:</h4>
        <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #64748b; line-height: 1.5;">
          <li>Place documents on a flat, well-lit surface with no flash glare.</li>
          <li>Ensure all 4 corners and government ID numbers are clearly legible.</li>
          <li>Use the <strong>"📸 Take Photo"</strong> button to snap directly with camera autofocus.</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 25px 0;">
        <a href="https://carpenterwala.com/pro/login" class="btn">
          🔄 Re-upload Documents & Resubmit
        </a>
      </div>

      <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
        Your existing profile details and phone number are safely saved. You only need to replace the requested document scans.
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0;">Carpenterwala — India's Direct Service Craftsmen Network</p>
      <p style="margin: 4px 0 0 0;">Bengaluru, Karnataka, India • contact@carpenterwala.com</p>
    </div>
  </div>
</body>
</html>
        `;

        if (process.env.RESEND_API_KEY) {
          let emailRes = await resend.emails.send({
            from: 'Carpenterwala Verification <onboarding@carpenterwala.com>',
            to: profile.email,
            subject: 'Action Required: Update Your Verification Documents on Carpenterwala',
            html: emailHtml,
          });

          if (emailRes.error) {
            console.warn('Custom domain send failed, trying resend.dev fallback:', emailRes.error);
            await resend.emails.send({
              from: 'Carpenterwala Verification <onboarding@resend.dev>',
              to: profile.email,
              subject: 'Action Required: Update Your Verification Documents on Carpenterwala',
              html: emailHtml,
            });
          }
        }
      } catch (emailErr) {
        console.warn('Failed to send rejection email notification:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Profile successfully ${action === 'reject' ? 'declined & re-opened for document re-upload' : action + 'ed'}`
    });
  } catch (err) {
    console.error('Error verifying profile securely:', err);
    return NextResponse.json({ 
      error: err?.message || 'Failed to update professional verification status',
      details: err?.details || err?.hint || String(err)
    }, { status: 500 });
  }
}
