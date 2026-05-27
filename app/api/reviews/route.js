import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/reviews
// Body: { pro_id, author, rating, text }
export async function POST(request) {
  try {
    const body = await request.json();
    const { pro_id, author, rating, text } = body;

    if (!pro_id || !author || !rating) {
      return NextResponse.json({ error: 'pro_id, author, and rating are required' }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([{ pro_id: Number(pro_id), author: author.trim(), rating: Number(rating), text: text?.trim() || '' }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, review: data }, { status: 201 });
  } catch (err) {
    console.error('Review submit error:', err);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
