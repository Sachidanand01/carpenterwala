import { NextResponse } from 'next/server';
import { decryptToken } from '@/lib/crypto';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const session = searchParams.get('session');

  if (!session) {
    return NextResponse.json({ success: false, error: 'Session token is required.' }, { status: 400 });
  }

  try {
    const payload = decryptToken(session);

    if (!payload || payload.type !== 'ai_pro_onboarding') {
      return NextResponse.json({
        success: false,
        error: 'Invalid onboarding session. Please start registration directly.'
      }, { status: 400 });
    }

    if (payload.expiresAt && Date.now() > payload.expiresAt) {
      return NextResponse.json({
        success: false,
        error: 'This registration link has expired (valid for 60 minutes). Please register directly.'
      }, { status: 410 });
    }

    return NextResponse.json({
      success: true,
      data: {
        name: payload.name || '',
        phone: payload.phone || '',
        trade: payload.trade || 'Carpenter',
        location: payload.location || '',
        experienceYears: payload.experienceYears || null
      }
    });
  } catch (err) {
    console.error('AI session decryption error:', err);
    return NextResponse.json({ success: false, error: 'Failed to decrypt session' }, { status: 500 });
  }
}
