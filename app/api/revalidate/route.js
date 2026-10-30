// app/api/revalidate/route.js
// Next.js App Router On-Demand Revalidation Webhook
// Example: POST /api/revalidate?secret=YOUR_SECRET&slug=how-to-fix-a-kitchen-drawer

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  const configuredSecret = process.env.REVALIDATION_SECRET || 'carpenterwala-secret-reval-2026';

  if (secret !== configuredSecret) {
    return NextResponse.json({ message: 'Invalid or missing revalidation secret' }, { status: 401 });
  }

  try {
    // Purge Data Cache tags immediately
    try {
      revalidateTag('blogs', { expire: 0 });
      if (slug) {
        revalidateTag(`blog-${slug}`, { expire: 0 });
      }
    } catch (tagErr) {
      console.warn('[revalidate] tag error:', tagErr.message);
    }

    // Revalidate page paths
    revalidatePath('/blog');
    revalidatePath('/sitemap.xml');

    if (slug) {
      revalidatePath(`/blog/${slug}`);
    }

    return NextResponse.json({
      revalidated: true,
      slug: slug || 'all',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ message: 'Revalidation error', error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  return POST(request);
}
