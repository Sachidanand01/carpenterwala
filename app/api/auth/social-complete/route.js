import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
      if (!trade) {
        return NextResponse.json({ error: 'Please select your trade.' }, { status: 400 });
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

      // Generate unique slug
      const baseSlug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'pro';
      let slug = baseSlug;
      let counter = 1;
      while (true) {
        const { data: existing } = await supabase.from('profiles').select('id').eq('slug', slug).maybeSingle();
        if (!existing) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const { data: newProfile, error: insertErr } = await supabase
        .from('profiles')
        .insert([{
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
        }])
        .select('id, slug, name, trade, location, email, phone')
        .single();

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
