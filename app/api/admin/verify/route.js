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
    } else if (action === 'approve_avatar') {
      // Fetch the profile to get the pending_avatar
      const { data: profile, error: getErr } = await supabase
        .from('profiles')
        .select('pending_avatar')
        .eq('id', proId)
        .single();
      
      if (getErr || !profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }
      
      if (!profile.pending_avatar) {
        return NextResponse.json({ error: 'No pending photo update found to approve' }, { status: 400 });
      }

      updateData = {
        avatar: profile.pending_avatar,
        pending_avatar: null
      };
    } else if (action === 'reject_avatar') {
      updateData = {
        pending_avatar: null
      };
    } else {
      return NextResponse.json({ error: 'Invalid action. Must be "verify", "reject", "approve_avatar", or "reject_avatar"' }, { status: 400 });
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
