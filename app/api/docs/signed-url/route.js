import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSignedDocumentUrl, STORAGE_BUCKETS } from '@/lib/storage';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const bucket = searchParams.get('bucket') || STORAGE_BUCKETS.KYC;
    const expiresIn = parseInt(searchParams.get('expiresIn') || '900', 10);

    if (!path) {
      return NextResponse.json({ error: 'Document path is required' }, { status: 400 });
    }

    // If it's already a full HTTP URL or legacy base64, return it as-is
    if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
      return NextResponse.json({ success: true, signedUrl: path });
    }

    const signedUrl = await getSignedDocumentUrl(path, bucket, expiresIn);

    if (!signedUrl) {
      return NextResponse.json({ error: 'Failed to generate secure document access link' }, { status: 500 });
    }

    return NextResponse.json({ success: true, signedUrl, expiresIn });
  } catch (err) {
    console.error('Signed URL retrieval error:', err);
    return NextResponse.json({ error: 'Internal server error while resolving document' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { path, bucket = STORAGE_BUCKETS.KYC, expiresIn = 900 } = body;

    if (!path) {
      return NextResponse.json({ error: 'Document path is required' }, { status: 400 });
    }

    if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
      return NextResponse.json({ success: true, signedUrl: path });
    }

    const signedUrl = await getSignedDocumentUrl(path, bucket, expiresIn);

    if (!signedUrl) {
      return NextResponse.json({ error: 'Failed to generate secure document access link' }, { status: 500 });
    }

    return NextResponse.json({ success: true, signedUrl, expiresIn });
  } catch (err) {
    console.error('Signed URL generation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
