import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { decryptToken } from '@/lib/crypto';
import { isValidAdminToken } from '@/lib/admin-auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');

    if (!phone && !email) {
      return NextResponse.json({ error: 'Phone number or email is required' }, { status: 400 });
    }

    const client = supabaseAdmin || supabase;
    let query = client.from('customers').select('first_name, last_name, phone, email');
    let cleanEmail = '';
    let cleanPhone = '';

    if (phone) {
      cleanPhone = phone.trim().replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
      }
      query = query.eq('phone', cleanPhone);
    } else {
      cleanEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return NextResponse.json({ error: 'Invalid email address format' }, { status: 400 });
      }
      query = query.eq('email', cleanEmail);
    }

    const { data: customer, error } = await query.maybeSingle();

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }

    if (!customer) {
      return NextResponse.json({ registered: false }, { status: 200 });
    }

    // Check if request is authenticated (Admin token, Supabase session, or customer token)
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    let isAuthorized = false;
    if (token) {
      if (isValidAdminToken(token)) {
        isAuthorized = true;
      } else {
        const decrypted = decryptToken(token);
        if (
          decrypted &&
          (decrypted.type === 'customer_session' || decrypted.type === 'customer_otp') &&
          (!decrypted.expiresAt || decrypted.expiresAt > Date.now()) &&
          (decrypted.email === customer.email || decrypted.phone === customer.phone)
        ) {
          isAuthorized = true;
        } else {
          // Check Supabase Auth user session
          const { data: authUser } = await supabase.auth.getUser(token);
          if (authUser?.user?.email?.toLowerCase() === customer.email.toLowerCase()) {
            isAuthorized = true;
          }
        }
      }
    }

    // Security Hardening (F-04): For unauthenticated callers, return boolean status only without reflecting back plaintext PII
    if (!isAuthorized) {
      return NextResponse.json({
        registered: true
      }, { status: 200 });
    }

    const fullName = `${customer.first_name} ${customer.last_name || ''}`.trim();
    return NextResponse.json({
      registered: true,
      customer: {
        name: fullName,
        phone: customer.phone,
        email: customer.email
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error in customer check route:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
