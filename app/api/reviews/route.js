import { NextResponse } from 'next/server';
import { getBusinessReviews, getLiveReviewStats, maskAuthorName } from '@/lib/reviews';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const filter = url.searchParams.get('filter') || '4plus';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '9', 10);

    const [reviewsData, stats] = await Promise.all([
      getBusinessReviews({ filter, page, pageSize }),
      getLiveReviewStats()
    ]);

    return NextResponse.json({
      success: true,
      data: reviewsData.reviews,
      pagination: {
        total: reviewsData.total,
        page: reviewsData.page,
        pageSize: reviewsData.pageSize,
        totalPages: reviewsData.totalPages
      },
      stats
    });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { pro_id, author, rating, text } = body;
    const numericProId = Number(pro_id);
    const numericRating = Math.round(Number(rating));

    if (!numericProId || Number.isNaN(numericProId)) {
      return NextResponse.json({ error: 'Valid professional ID is required.' }, { status: 400 });
    }
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ error: 'Rating must be an integer between 1 and 5.' }, { status: 400 });
    }
    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Review text is required.' }, { status: 400 });
    }

    const client = supabaseAdmin || supabase;
    const authorDisplayName = maskAuthorName(author || 'Verified Customer');

    const { data: newReview, error: revError } = await client
      .from('reviews')
      .insert([{
        pro_id: numericProId,
        author: authorDisplayName,
        rating: numericRating,
        text: text.trim()
      }])
      .select()
      .single();

    if (revError) {
      console.error('Error inserting review:', revError);
      return NextResponse.json({ error: 'Failed to submit review.' }, { status: 500 });
    }

    // Recalculate profile aggregate rating and review count
    const { data: allReviews } = await client
      .from('reviews')
      .select('rating')
      .eq('pro_id', numericProId);

    if (allReviews && allReviews.length > 0) {
      const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = (totalRating / allReviews.length).toFixed(2);

      await client
        .from('profiles')
        .update({
          rating: parseFloat(avgRating),
          reviews_count: allReviews.length,
          updated_at: new Date().toISOString()
        })
        .eq('id', numericProId);
    }

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (err) {
    console.error('POST /api/reviews error:', err);
    return NextResponse.json({ error: 'Internal server error while submitting review' }, { status: 500 });
  }
}
