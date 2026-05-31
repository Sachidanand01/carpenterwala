import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all warranties for a customer phone number
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');

  if (!phone) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
  }

  try {
    const { data: warranties, error } = await supabase
      .from('warranties')
      .select('*')
      .eq('customer_phone', phone)
      .order('created_at', { ascending: false });

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

    if (!customer_phone || !category || !appliance_name) {
      return NextResponse.json({ error: 'Required fields: customer_phone, category, and appliance_name are mandatory' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('warranties')
      .insert([{
        customer_phone,
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
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Warranty ID is required' }, { status: 400 });
  }

  try {
    const { error } = await supabase
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

    const { data, error } = await supabase
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
