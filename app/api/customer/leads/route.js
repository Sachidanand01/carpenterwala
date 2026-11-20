import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { decryptToken } from '@/lib/crypto';
import { isValidAdminToken } from '@/lib/admin-auth';

function getAuthorizedCustomer(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim() ||
                request.headers.get('x-customer-auth') ||
                new URL(request.url).searchParams.get('token');

  if (!token) return null;

  if (isValidAdminToken(token)) {
    return { isAdmin: true };
  }

  const decrypted = decryptToken(token);
  if (!decrypted) return null;
  if (decrypted.expiresAt && decrypted.expiresAt < Date.now()) return null;
  if (decrypted.type !== 'customer_session' && decrypted.type !== 'customer_otp') return null;

  return decrypted;
}

export async function GET(request) {
  const auth = getAuthorizedCustomer(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized: Valid customer session required' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');

  if (!phone) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
  }

  const client = supabaseAdmin || supabase;

  try {
    if (!auth.isAdmin) {
      let authorizedPhone = auth.phone ? String(auth.phone).trim() : null;
      if (!authorizedPhone && auth.email) {
        const { data: cust } = await client
          .from('customers')
          .select('phone')
          .eq('email', String(auth.email).toLowerCase().trim())
          .maybeSingle();
        authorizedPhone = cust?.phone || null;
      }

      if (!authorizedPhone || authorizedPhone !== phone.trim()) {
        return NextResponse.json({ error: 'Forbidden: Cannot view leads for another customer' }, { status: 403 });
      }
    }

    const { data: leads, error } = await client
      .from('leads')
      .select(`
        id,
        name,
        phone,
        task,
        created_at,
        profiles ( id, pro_code, slug, name, trade, avatar, location )
      `)
      .eq('phone', phone.trim())
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    return NextResponse.json({ leads: leads || [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching customer leads:", error);
    return NextResponse.json({ error: 'Failed to fetch customer leads' }, { status: 500 });
  }
}
