import { NextResponse } from 'next/server';
import { syncYouTubeChannelToDatabase } from '@/lib/reels';

export async function POST(req) {
  try {
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
