import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

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
    const { proId, action } = body;

    if (!proId) {
      return NextResponse.json({ error: 'proId is required' }, { status: 400 });
    }

    let updateData = {};

    if (action === 'verify') {
      updateData = {
        verified: true,
        onboarding_completed: true // Ensure marked as completed
      };
    } else if (action === 'reject') {
      updateData = {
        verified: false,
        onboarding_completed: false, // Reverts them to onboarding wizard
        onboarding_step: 1 // Start from beginning to correct details
      };
    } else {
      return NextResponse.json({ error: 'Invalid action. Must be "verify" or "reject"' }, { status: 400 });
    }

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', proId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, message: `Profile successfully ${action}ed` });
  } catch (err) {
    console.error('Error verifying profile securely:', err);
    return NextResponse.json({ error: 'Failed to update professional verification status' }, { status: 500 });
  }
}
