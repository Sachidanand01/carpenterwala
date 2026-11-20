import { NextResponse } from 'next/server';
import { syncYouTubeChannelToDatabase } from '@/lib/reels';
import { isValidAdminOrCron } from '@/lib/admin-auth';

function isAuthorizedSync(req) {
  return isValidAdminOrCron(req);
}

export async function POST(req) {
  try {
    if (!isAuthorizedSync(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin or Cron token required' }, { status: 401 });
    }

    let body = {};
    try {
      body = await req.json();
    } catch {
      // Body is optional
    }

    const channelHandle = body.channelHandle || process.env.NEXT_PUBLIC_YOUTUBE_HANDLE || '@your-carpenterwala';
    const result = await syncYouTubeChannelToDatabase(channelHandle);

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("YouTube sync API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to sync YouTube reels" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    if (!isAuthorizedSync(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin or Cron token required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const channelHandle = searchParams.get('channel') || process.env.NEXT_PUBLIC_YOUTUBE_HANDLE || '@your-carpenterwala';
    
    const result = await syncYouTubeChannelToDatabase(channelHandle);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to sync YouTube reels" },
      { status: 500 }
    );
  }
}
