import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email } = body;

    // 1. Basic Presence Validation
    if (!name || !phone || !email) {
      return NextResponse.json({ error: 'Name, mobile number, and email are all required.' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const cleanPhone = phone.trim().replace(/\D/g, '');

    // 2. Name Length Validation (max 16 chars overall)
    if (trimmedName.length > 16) {
      return NextResponse.json({ error: 'Name must not exceed 16 characters overall.' }, { status: 400 });
    }

    // 3. Indian 10-digit Mobile Number Validation
    // Standard Indian mobile numbers start with 6, 7, 8, or 9 and are exactly 10 digits
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (!indianPhoneRegex.test(cleanPhone)) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit Indian mobile number.' }, { status: 400 });
    }

    // 4. Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // 5. Name Space Splitting Logic
    // If there is space in between the name then after 1st space all should be considered as last name
    const spaceIndex = trimmedName.indexOf(' ');
    let firstName = '';
    let lastName = '';
    if (spaceIndex !== -1) {
      firstName = trimmedName.substring(0, spaceIndex);
      lastName = trimmedName.substring(spaceIndex + 1).trim();
    } else {
      firstName = trimmedName;
      lastName = '';
    }

    // 6. DB Uniqueness Checks (Phone & Email)
    const { data: existingPhone, error: phoneErr } = await supabase
      .from('customers')
      .select('phone')
      .eq('phone', cleanPhone)
      .maybeSingle();

    if (phoneErr) {
      console.error("Supabase check error:", phoneErr);
      return NextResponse.json({ error: 'Database check failed' }, { status: 500 });
    }
    if (existingPhone) {
      return NextResponse.json({ error: 'This mobile number is already registered.' }, { status: 400 });
    }

    const { data: existingEmail, error: emailErr } = await supabase
      .from('customers')
      .select('email')
      .eq('email', trimmedEmail.toLowerCase())
      .maybeSingle();

    if (emailErr) {
      console.error("Supabase check error:", emailErr);
      return NextResponse.json({ error: 'Database check failed' }, { status: 500 });
    }
    if (existingEmail) {
      return NextResponse.json({ error: 'This email address is already registered.' }, { status: 400 });
    }

    // 7. Store the Customer Details in DB
    const { data: customer, error: insertError } = await supabase
      .from('customers')
      .insert([{
        first_name: firstName,
        last_name: lastName || null,
        phone: cleanPhone,
        email: trimmedEmail.toLowerCase()
      }])
      .select('id, first_name, last_name, phone, email')
      .single();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json({ error: 'Registration failed during database save.' }, { status: 500 });
    }

    const fullName = `${customer.first_name} ${customer.last_name || ''}`.trim();

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      customer: {
        id: customer.id,
        name: fullName,
        phone: customer.phone,
        email: customer.email
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Error in customer register route:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
