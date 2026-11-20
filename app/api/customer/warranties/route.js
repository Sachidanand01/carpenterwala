import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { decryptToken } from '@/lib/crypto';

function getAuthorizedCustomer(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim() ||
                request.headers.get('x-customer-auth') ||
                new URL(request.url).searchParams.get('token');

  if (!token) return null;

  // 1. Admin token check
  const expectedPassword = process.env.ADMIN_PASSWORD || 'CarpenterwalaAdmin2026';
  const expectedAdminToken = crypto
    .createHash('sha256')
    .update(expectedPassword + 'carpenterwala-salt-2026')
    .digest('hex');
  if (token === expectedAdminToken || token === expectedPassword) {
    return { isAdmin: true };
  }

  // 2. Customer token check
  const decrypted = decryptToken(token);
  if (!decrypted) return null;
  if (decrypted.expiresAt && decrypted.expiresAt < Date.now()) return null;
  if (decrypted.type !== 'customer_session' && decrypted.type !== 'customer_otp') return null;

  return decrypted;
}

async function resolveCustomerPhone(auth) {
  if (auth.isAdmin) return null;
  if (auth.phone) return String(auth.phone).trim();

  if (auth.email) {
    const client = supabaseAdmin || supabase;
    const { data: customer } = await client
      .from('customers')
      .select('phone')
      .eq('email', String(auth.email).toLowerCase().trim())
      .maybeSingle();
    return customer?.phone || null;
  }
  return null;
}

// GET all warranties for an authenticated customer
export async function GET(request) {
  const auth = getAuthorizedCustomer(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized: Valid customer session required' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const requestedPhone = searchParams.get('phone');
  const client = supabaseAdmin || supabase;

  try {
    let query = client.from('warranties').select('*').order('created_at', { ascending: false });

    if (!auth.isAdmin) {
      const customerPhone = await resolveCustomerPhone(auth);
      if (!customerPhone) {
        return NextResponse.json({ error: 'Customer account not found' }, { status: 403 });
      }
      if (requestedPhone && requestedPhone !== customerPhone) {
        return NextResponse.json({ error: 'Forbidden: Cannot view warranties of another account' }, { status: 403 });
      }
      query = query.eq('customer_phone', customerPhone);
    } else if (requestedPhone) {
      query = query.eq('customer_phone', requestedPhone);
    }

    const { data: warranties, error } = await query;
    if (error) {
      console.error("Supabase GET error:", error);
      throw error;
    }

    return NextResponse.json({ warranties: warranties || [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching customer warranties:", error);
    return NextResponse.json({ error: 'Failed to fetch warranties' }, { status: 500 });
  }
}

// POST: Add a new warranty
export async function POST(request) {
  const auth = getAuthorizedCustomer(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized: Valid customer session required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      customer_phone,
      category,
      appliance_name,
      purchase_date,
      warranty_start_date,
      warranty_duration_months,
      receipt_copy,
      invoice_copy,
      warranty_card_copy,
      notes
    } = body;

    let targetPhone = customer_phone;
    if (!auth.isAdmin) {
      const customerPhone = await resolveCustomerPhone(auth);
      if (!customerPhone) {
        return NextResponse.json({ error: 'Customer account not found' }, { status: 403 });
      }
      targetPhone = customerPhone;
    }

    if (!targetPhone || !category || !appliance_name) {
      return NextResponse.json({ error: 'Required fields: category and appliance_name are mandatory' }, { status: 400 });
    }

    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from('warranties')
      .insert([{
        customer_phone: targetPhone,
        category,
        appliance_name,
        purchase_date: purchase_date || null,
        warranty_start_date: warranty_start_date || null,
        warranty_duration_months: warranty_duration_months ? parseInt(warranty_duration_months, 10) : null,
        receipt_copy: receipt_copy || null,
        invoice_copy: invoice_copy || null,
        warranty_card_copy: warranty_card_copy || null,
        notes: notes || null
      }])
      .select()
      .single();

    if (error) {
      console.error("Supabase POST error:", error);
      throw error;
    }

    return NextResponse.json({ success: true, warranty: data }, { status: 201 });
  } catch (error) {
    console.error("Error saving warranty:", error);
    return NextResponse.json({ error: 'Failed to save warranty record' }, { status: 500 });
  }
}

// DELETE: Remove a warranty record
export async function DELETE(request) {
  const auth = getAuthorizedCustomer(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized: Valid customer session required' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Warranty ID is required' }, { status: 400 });
  }

  const client = supabaseAdmin || supabase;

  try {
    if (!auth.isAdmin) {
      const customerPhone = await resolveCustomerPhone(auth);
      if (!customerPhone) {
        return NextResponse.json({ error: 'Customer account not found' }, { status: 403 });
      }
      // Ensure the warranty belongs to the customer
      const { data: existing } = await client
        .from('warranties')
        .select('customer_phone')
        .eq('id', id)
        .maybeSingle();

      if (!existing || existing.customer_phone !== customerPhone) {
        return NextResponse.json({ error: 'Forbidden: Cannot delete warranty of another customer' }, { status: 403 });
      }
    }

    const { error } = await client
      .from('warranties')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase DELETE error:", error);
      throw error;
    }

    return NextResponse.json({ success: true, message: 'Warranty deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error deleting warranty:", error);
    return NextResponse.json({ error: 'Failed to delete warranty record' }, { status: 500 });
  }
}

// PUT: Update an existing warranty
export async function PUT(request) {
  const auth = getAuthorizedCustomer(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized: Valid customer session required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      id,
      category,
      appliance_name,
      purchase_date,
      warranty_start_date,
      warranty_duration_months,
      receipt_copy,
      invoice_copy,
      warranty_card_copy,
      notes
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Warranty ID is required for update' }, { status: 400 });
    }

    const client = supabaseAdmin || supabase;

    if (!auth.isAdmin) {
      const customerPhone = await resolveCustomerPhone(auth);
      if (!customerPhone) {
        return NextResponse.json({ error: 'Customer account not found' }, { status: 403 });
      }
      const { data: existing } = await client
        .from('warranties')
        .select('customer_phone')
        .eq('id', id)
        .maybeSingle();

      if (!existing || existing.customer_phone !== customerPhone) {
        return NextResponse.json({ error: 'Forbidden: Cannot update warranty of another customer' }, { status: 403 });
      }
    }

    const { data, error } = await client
      .from('warranties')
      .update({
        category,
        appliance_name,
        purchase_date: purchase_date || null,
        warranty_start_date: warranty_start_date || null,
        warranty_duration_months: warranty_duration_months ? parseInt(warranty_duration_months, 10) : null,
        receipt_copy: receipt_copy || null,
        invoice_copy: invoice_copy || null,
        warranty_card_copy: warranty_card_copy || null,
        notes: notes || null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Supabase PUT error:", error);
      throw error;
    }

    return NextResponse.json({ success: true, warranty: data }, { status: 200 });
  } catch (error) {
    console.error("Error updating warranty:", error);
    return NextResponse.json({ error: 'Failed to update warranty record' }, { status: 500 });
  }
}
