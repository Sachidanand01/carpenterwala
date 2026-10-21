import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key_for_build');

function verifyAdminOrCron(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  // 1. Allow CRON secret
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && token === cronSecret) return true;

  // 2. Allow Admin Session Token
  const expectedPassword = process.env.ADMIN_PASSWORD || 'CarpenterwalaAdmin2026';
  const expectedToken = crypto
    .createHash('sha256')
    .update(expectedPassword + 'carpenterwala-salt-2026')
    .digest('hex');

  return token === expectedToken;
}

// GET /api/admin/kyc-purge-alert - Check expiring documents (for Admin UI badges)
export async function GET(request) {
  try {
    if (!verifyAdminOrCron(request)) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { data: expiringProfiles, error } = await supabase.rpc('get_expiring_kyc_documents', {
      warning_hours: 48,
      retention_days: 90,
    });

    if (error) {
      console.error('[KYC Alert] RPC error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: expiringProfiles ? expiringProfiles.length : 0,
      expiringProfiles: expiringProfiles || [],
    });
  } catch (err) {
    console.error('[KYC Alert] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/kyc-purge-alert - Dispatches email notification to Admin if documents are expiring in 48h
export async function POST(request) {
  try {
    if (!verifyAdminOrCron(request)) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { data: expiringProfiles, error } = await supabase.rpc('get_expiring_kyc_documents', {
      warning_hours: 48,
      retention_days: 90,
    });

    if (error) {
      console.error('[KYC Alert] RPC error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const count = expiringProfiles?.length || 0;

    if (count === 0) {
      return NextResponse.json({
        success: true,
        message: 'No KYC documents scheduled for deletion within 48 hours.',
        count: 0,
      });
    }

    // Prepare table rows for email
    const proListHtml = expiringProfiles
      .map(
        (p) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 10px; font-weight: bold; color: #1f2937;">${p.name} (ID: ${p.id})</td>
          <td style="padding: 10px; color: #4b5563;">${p.trade || 'Handyman'}</td>
          <td style="padding: 10px; color: #4b5563;">${p.phone || 'N/A'}</td>
          <td style="padding: 10px; color: #dc2626; font-weight: bold;">~${p.hours_remaining} hrs left</td>
          <td style="padding: 10px;">
            <span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; background: ${
              p.verified ? '#dcfce7; color: #15803d;' : '#fef3c7; color: #b45309;'
            }">${p.verified ? 'Verified Pro' : 'Pending Audit'}</span>
          </td>
        </tr>`
      )
      .join('');

    const adminEmail = process.env.ADMIN_ALERT_EMAIL || 'contact@carpenterwala.com';

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Carpenterwala Admin Alerts <onboarding@resend.dev>',
        to: adminEmail,
        subject: `⚠️ [ACTION REQUIRED] ${count} KYC Document(s) Expiring within 48 Hours`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
            <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
              <h2 style="color: #991b1b; margin: 0 0 10px 0; font-size: 18px;">⚠️ 48-Hour KYC Document Auto-Purge Notice</h2>
              <p style="margin: 0; color: #7f1d1d; font-size: 14px; line-height: 1.5;">
                In accordance with Carpenterwala's <strong>90-Day Document Non-Retention Policy</strong>, digital copies of identity and police verification documents for <strong>${count} service professional(s)</strong> are scheduled for permanent deletion within the next 48 hours.
              </p>
            </div>

            <h3 style="font-size: 15px; color: #374151; margin-bottom: 10px;">Expiring Profiles:</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #f9fafb; border-bottom: 2px solid #e5e7eb;">
                  <th style="padding: 10px;">Professional</th>
                  <th style="padding: 10px;">Trade</th>
                  <th style="padding: 10px;">Phone</th>
                  <th style="padding: 10px;">Auto-Purge In</th>
                  <th style="padding: 10px;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${proListHtml}
              </tbody>
            </table>

            <div style="text-align: center; margin: 25px 0;">
              <a href="https://carpenterwala.com/admin/dashboard" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
                Open Admin Dashboard to Inspect
              </a>
            </div>

            <p style="font-size: 12px; color: #6b7280; line-height: 1.4;">
              <strong>Note:</strong> Once deleted, these digital files cannot be recovered. The professional's public listing, star rating, verified status, and customer reviews will remain active.
            </p>
          </div>
        `,
      });
      console.log(`[KYC Alert] Alert email dispatched to ${adminEmail} for ${count} expiring records.`);
    }

    return NextResponse.json({
      success: true,
      message: `Alert email dispatched for ${count} expiring profiles.`,
      count,
      expiringProfiles,
    });
  } catch (err) {
    console.error('[KYC Alert] Notification error:', err);
    return NextResponse.json({ error: 'Failed to dispatch alert' }, { status: 500 });
  }
}
