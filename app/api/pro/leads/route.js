import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { decryptToken } from '@/lib/crypto';

function isAuthorizedPro(request, targetProId) {
  if (!targetProId) return false;
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim() || 
                request.headers.get('x-pro-token') || 
                new URL(request.url).searchParams.get('token');

  if (!token) return false;

  // Support Admin token
  const expectedPassword = process.env.ADMIN_PASSWORD || 'CarpenterwalaAdmin2026';
  const expectedAdminToken = crypto
    .createHash('sha256')
    .update(expectedPassword + 'carpenterwala-salt-2026')
    .digest('hex');
  if (token === expectedAdminToken || token === expectedPassword) {
    return true;
  }

  const decrypted = decryptToken(token);
  if (!decrypted) return false;

  if (decrypted.type === 'pro_session' && String(decrypted.proId) === String(targetProId)) {
    return true;
  }
  if (decrypted.role === 'admin' || decrypted.type === 'admin_session') {
    return true;
  }
  return false;
}

// GET /api/pro/leads?pro_id=1
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const proId = searchParams.get('pro_id');

  if (!proId) return NextResponse.json({ error: 'pro_id required' }, { status: 400 });

  if (!isAuthorizedPro(request, proId)) {
    return NextResponse.json({ error: 'Unauthorized: Valid professional session required to view leads' }, { status: 401 });
  }

  try {
    const client = supabaseAdmin || supabase;
    const { data: leads, error } = await client
      .from('leads')
      .select('*')
      .eq('pro_id', proId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ leads: leads || [] });
  } catch (err) {
    console.error('Failed to fetch leads:', err);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
