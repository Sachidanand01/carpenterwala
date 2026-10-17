import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateProCode, toUrlSlug } from '@/lib/pro-slug';

export async function POST(request) {
  try {
    const body = await request.json();
    const { role, name, email, phone, trade, location, avatar } = body;

    const cleanEmail = email?.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    const cleanPhone = phone ? phone.trim().replace(/\D/g, '').slice(-10) : '';
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (!cleanPhone || !indianPhoneRegex.test(cleanPhone)) {
      return NextResponse.json({ error: 'Please provide a valid 10-digit Indian mobile number.' }, { status: 400 });
    }

    // ==========================================
    // 1. CUSTOMER PROFILE COMPLETION
    // ==========================================
    if (role === 'customer') {
      const trimmedName = (name || '').trim() || 'Valued Customer';

      // Check if email already exists
      const { data: existingEmailCustomer } = await supabase
        .from('customers')
        .select('id, first_name, last_name, phone, email')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existingEmailCustomer) {
        const fullName = `${existingEmailCustomer.first_name} ${existingEmailCustomer.last_name || ''}`.trim();
        return NextResponse.json({
          success: true,
          customer: {
            id: existingEmailCustomer.id,
            name: fullName,
            phone: existingEmailCustomer.phone,
            email: existingEmailCustomer.email
          }
        });
      }

      // Check if phone already exists
      const { data: existingPhoneCustomer } = await supabase
        .from('customers')
        .select('id, first_name, last_name, phone, email')
        .eq('phone', cleanPhone)
        .maybeSingle();

      if (existingPhoneCustomer) {
        return NextResponse.json({
          error: 'This mobile number is already registered. Please sign in or use another number.'
        }, { status: 400 });
      }

      // Name Splitting logic (first name + last name)
      const spaceIndex = trimmedName.indexOf(' ');
      let firstName = '';
      let lastName = '';
      if (spaceIndex !== -1) {
        firstName = trimmedName.substring(0, spaceIndex).slice(0, 16);
        lastName = trimmedName.substring(spaceIndex + 1).trim();
      } else {
        firstName = trimmedName.slice(0, 16);
        lastName = '';
      }

      const { data: newCustomer, error: insertErr } = await supabase
        .from('customers')
        .insert([{
          first_name: firstName,
          last_name: lastName || null,
          phone: cleanPhone,
          email: cleanEmail
        }])
        .select('id, first_name, last_name, phone, email')
        .single();

      if (insertErr) {
        console.error('Customer insert error:', insertErr);
        return NextResponse.json({ error: 'Failed to create customer profile.' }, { status: 500 });
      }

      const fullName = `${newCustomer.first_name} ${newCustomer.last_name || ''}`.trim();
      return NextResponse.json({
        success: true,
        customer: {
          id: newCustomer.id,
          name: fullName,
          phone: newCustomer.phone,
          email: newCustomer.email
        }
      });
    }

    // ==========================================
    // 2. PRO PROFILE COMPLETION
    // ==========================================
    if (role === 'pro') {
      const trimmedName = (name || '').trim();
      if (!trimmedName || trimmedName.length < 2) {
        return NextResponse.json({ error: 'Name must be at least 2 characters.' }, { status: 400 });
      }
      if (!trade || typeof trade !== 'string' || trade.trim() === '') {
        return NextResponse.json({ error: 'Please select or specify your trade.' }, { status: 400 });
      }
      if (trade.trim().length > 30) {
        return NextResponse.json({ error: 'Trade name cannot exceed 30 characters.' }, { status: 400 });
      }
      if (!location || location.trim().length < 3) {
        return NextResponse.json({ error: 'Please enter a valid location (min 3 characters).' }, { status: 400 });
      }

      // Check if email already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, slug, name, trade, location, email, phone')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existingProfile) {
        return NextResponse.json({
          success: true,
          profile: existingProfile
        });
      }

      // Check if phone already exists
      const { data: existingPhoneProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', cleanPhone)
        .maybeSingle();

      if (existingPhoneProfile) {
        return NextResponse.json({
          error: 'This mobile number is already registered with another professional profile.'
        }, { status: 400 });
      }

      // Generate unique Pro Code & slug
      let proCode = generateProCode();
      for (let attempt = 0; attempt < 5; attempt++) {
        const { data: existingCode } = await supabase.from('profiles').select('id').eq('pro_code', proCode).maybeSingle();
        if (!existingCode) break;
        proCode = generateProCode();
      }

      const slug = toUrlSlug(trimmedName);

      const proPayload = {
        pro_code: proCode,
        slug,
        name: trimmedName,
        email: cleanEmail,
        phone: cleanPhone,
        trade: trade,
        location: location.trim(),
        avatar: avatar || null,
        verified: false,
        onboarding_completed: false,
        onboarding_step: 1
      };

      let { data: newProfile, error: insertErr } = await supabase
        .from('profiles')
        .insert([proPayload])
        .select('*')
        .single();

      if (insertErr && (insertErr.message?.includes('pro_code') || insertErr.code === '42703')) {
        delete proPayload.pro_code;
        const retry = await supabase
          .from('profiles')
          .insert([proPayload])
          .select('*')
          .single();
        newProfile = retry.data;
        insertErr = retry.error;
      }

      if (insertErr) {
        console.error('Pro profile insert error:', insertErr);
        return NextResponse.json({ error: 'Failed to create professional profile.' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        profile: newProfile
      });
    }

    return NextResponse.json({ error: 'Invalid role specified.' }, { status: 400 });
  } catch (error) {
    console.error('Error in social-complete route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
