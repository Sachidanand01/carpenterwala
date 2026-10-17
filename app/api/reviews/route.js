import { NextResponse } from 'next/server';
import { getBusinessReviews, getLiveReviewStats } from '@/lib/reviews';

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
