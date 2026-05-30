import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');

    if (!phone && !email) {
      return NextResponse.json({ error: 'Phone number or email is required' }, { status: 400 });
    }

    let query = supabase.from('customers').select('first_name, last_name, phone, email');

    if (phone) {
      const cleanPhone = phone.trim().replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
      }
      query = query.eq('phone', cleanPhone);
    } else {
      const cleanEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return NextResponse.json({ error: 'Invalid email address format' }, { status: 400 });
      }
      query = query.eq('email', cleanEmail);
    }

    // Query 'customers' table in Supabase
    const { data: customer, error } = await query.maybeSingle();

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }

    if (customer) {
      const fullName = `${customer.first_name} ${customer.last_name || ''}`.trim();
      return NextResponse.json({
        registered: true,
        customer: {
          name: fullName,
          phone: customer.phone,
          email: customer.email
        }
      }, { status: 200 });
    }

    return NextResponse.json({ registered: false }, { status: 200 });

  } catch (error) {
    console.error("Error in customer check route:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
