import { NextResponse } from 'next/server';
import { supabaseAdmin, supabase } from '@/lib/supabase';
import { isValidAdminToken } from '@/lib/admin-auth';

function isAuthorized(request) {
  const authHeader = request.headers.get('authorization') || '';
  if (isValidAdminToken(authHeader)) return true;

  const adminSecret = request.headers.get('x-admin-secret') || '';
  if (adminSecret && (adminSecret === process.env.ADMIN_PASSWORD || adminSecret === process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    return true;
  }

  // Development bypass if not in production
  if (process.env.NODE_ENV !== 'production' && adminSecret === 'CarpenterwalaAdmin2026') {
    return true;
  }

  return false;
}

export async function POST(request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const client = supabaseAdmin || supabase;

    // 1. Ensure or upsert Test Service Professional profile (TEST001)
    let { data: testPro } = await client
      .from('profiles')
      .select('id')
      .eq('pro_code', 'TEST001')
      .maybeSingle();

    if (!testPro) {
      const { data: newPro, error: proErr } = await client
        .from('profiles')
        .insert([{
          name: 'Vikram Sharma',
          pro_code: 'TEST001',
          trade: 'Carpenter',
          slug: 'test-master-carpenter-test001',
          phone: '9800000002',
          email: 'test.pro@carpenterwala.com',
          location: 'Indiranagar, Bangalore',
          experience: '12 years',
          skills: ['Modular Kitchen Assembly', 'Custom Wardrobes', 'Door Lock Fitting', 'Wood Polishing'],
          about: 'Test Master Carpenter account for AI MCP directory evaluations. 12+ years experience in premium modular furniture assembly.',
          verified: true,
          accepting_leads: true,
          service_radius_km: 15,
          average_rating: 4.9,
          reviews_count: 3,
          is_test: true
        }])
        .select()
        .single();

      if (proErr) {
        console.error('Failed to create test pro:', proErr);
      }
      testPro = newPro;
    } else {
      await client
        .from('profiles')
        .update({
          name: 'Vikram Sharma',
          trade: 'Carpenter',
          slug: 'test-master-carpenter-test001',
          phone: '9800000002',
          email: 'test.pro@carpenterwala.com',
          location: 'Indiranagar, Bangalore',
          experience: '12 years',
          verified: true,
          accepting_leads: true,
          service_radius_km: 15,
          average_rating: 4.9,
          reviews_count: 3,
          is_test: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', testPro.id);
    }

    const proId = testPro?.id;

    // 2. Ensure or upsert Customer in customers table
    await client
      .from('customers')
      .upsert({
        phone: '9800000001',
        email: 'test.customer@carpenterwala.com',
        first_name: 'Aditi',
        last_name: 'Sharma'
      }, { onConflict: 'phone' });

    // 3. Purge existing test leads, warranties, and reviews
    if (proId) {
      await client.from('reviews').delete().eq('pro_id', proId);
    }
    await client.from('leads').delete().or(`phone.eq.9800000001,email.eq.test.customer@carpenterwala.com${proId ? `,pro_id.eq.${proId}` : ''}`);
    await client.from('warranties').delete().or('customer_phone.eq.9800000001,customer_email.eq.test.customer@carpenterwala.com');

    // 4. Seed baseline warranties for Test Customer
    await client.from('warranties').insert([
      {
        customer_phone: '9800000001',
        customer_email: 'test.customer@carpenterwala.com',
        appliance_name: 'Godrej Pentacool 260L Refrigerator',
        category: 'Kitchen Appliances',
        purchase_date: '2025-06-15',
        warranty_start_date: '2025-06-15',
        warranty_duration_months: 24,
        notes: 'Official manufacturer compressor & unit warranty registered via Carpenterwala Digital Locker.',
        is_test: true
      },
      {
        customer_phone: '9800000001',
        customer_email: 'test.customer@carpenterwala.com',
        appliance_name: 'Havells 25L Storage Geyser (Monza EC)',
        category: 'Water Heaters',
        purchase_date: '2025-01-10',
        warranty_start_date: '2025-01-10',
        warranty_duration_months: 36,
        notes: 'Heating element & inner tank covered. Free annual inspection valid till 2028.',
        is_test: true
      }
    ]);

    // 5. Seed baseline leads
    await client.from('leads').insert([
      {
        name: 'Aditi Sharma',
        phone: '9800000001',
        email: 'test.customer@carpenterwala.com',
        task: '[Direct OAuth Booking] Trade: carpentry | Locality: Indiranagar | Details: Godrej Rim Lock Installation & Main Door Planing',
        status: 'completed',
        pro_id: proId,
        is_test: true
      },
      {
        name: 'Rajesh K. (Demo Lead)',
        phone: '9800009991',
        email: 'demo.lead1@carpenterwala.com',
        task: '[Assigned Job] Trade: carpentry | Locality: Koramangala 4th Block | Details: Modular kitchen hydraulic soft-close hinges replacement (6 shutters)',
        status: 'in_progress',
        pro_id: proId,
        is_test: true
      },
      {
        name: 'Pooja M. (Demo Lead)',
        phone: '9800009992',
        email: 'demo.lead2@carpenterwala.com',
        task: '[Assigned Job] Trade: carpentry | Locality: HSR Layout Sector 2 | Details: Teak wood 6-seater dining table buffing and scratch removal polish',
        status: 'pending',
        pro_id: proId,
        is_test: true
      }
    ]);

    // 6. Seed baseline reviews for TEST001
    if (proId) {
      await client.from('reviews').insert([
        {
          pro_id: proId,
          author: 'Priya M. (Indiranagar)',
          rating: 5,
          text: 'Vikram fixed our swollen teakwood front door in 40 minutes. Absolutely flawless craftsmanship and zero mess.'
        },
        {
          pro_id: proId,
          author: 'Karthik N. (Domlur)',
          rating: 5,
          text: 'Super professional modular wardrobe fitting. Arrived right on time and didn’t charge a single rupee over the rate card.'
        },
        {
          pro_id: proId,
          author: 'Ananya S. (Koramangala)',
          rating: 5,
          text: 'Excellent hydraulic hinges repair for our kitchen cabinets. Very polite and knowledgeable master carpenter.'
        }
      ]);
    }

    return NextResponse.json({
      success: true,
      message: 'Test accounts and baseline demo records successfully restored.',
      customer: {
        email: 'test.customer@carpenterwala.com',
        phone: '9800000001',
        name: 'Aditi Sharma',
        fixedOtp: '999999',
        warranties: 2,
        bookings: 1
      },
      servicePro: {
        email: 'test.pro@carpenterwala.com',
        phone: '9800000002',
        name: 'Vikram Sharma',
        proCode: 'TEST001',
        fixedOtp: '999999',
        rating: 4.9,
        reviewsCount: 3,
        assignedJobs: 3
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Test accounts reset error:', err);
    return NextResponse.json({ error: 'Failed to reset test accounts', details: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }
  return NextResponse.json({
    status: 'ready',
    message: 'Send a POST request with Authorization header or x-admin-secret to reset test accounts to baseline.'
  });
}
