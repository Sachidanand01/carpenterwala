import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { proId, name, phone, task } = body;

    // 1. Save this lead to Supabase database
    const { error } = await supabase.from('leads').insert([{ 
      pro_id: proId, 
      name, 
      phone, 
      task 
    }]);

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    // 2. Fetch the Pro's details to include their name in the email
    const { data: pro } = await supabase.from('profiles').select('name').eq('id', proId).single();
    const proName = pro?.name || 'Unknown Professional';

    // 3. Trigger an email via Resend
    // Important: While in the Resend free tier, you can only send emails TO the email address you verified on Resend.
    // Replace 'onboarding@resend.dev' with your domain if you add it, but for testing, use 'onboarding@resend.dev' to send to your registered email.
    await resend.emails.send({
      from: 'Carpenterwala Leads <onboarding@resend.dev>',
      to: 'contact@carpenterwala.com', // NOTE: Resend free tier requires you to change this to the email you signed up with if you haven't verified a domain!
      subject: `New Lead for ${proName}`,
      html: `
        <h2>New Lead Received!</h2>
        <p>A homeowner has requested a quote for <strong>${proName}</strong>.</p>
        <ul>
          <li><strong>Customer Name:</strong> ${name}</li>
          <li><strong>Phone Number:</strong> ${phone}</li>
          <li><strong>Task Description:</strong> ${task}</li>
        </ul>
        <p>Log in to your Admin Dashboard to view more details.</p>
      `
    });

    console.log(`[LEAD CAPTURED & EMAILED] To Pro ${proId} - From ${name} (${phone})`);

    return NextResponse.json({ success: true, message: 'Lead routed and emailed successfully' }, { status: 200 });
  } catch (error) {
    console.error("Lead Routing Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to route lead' }, { status: 500 });
  }
}
