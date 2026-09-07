import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateStoragePath, getPublicStorageUrl, UPLOAD_CATEGORIES } from '@/lib/storage';

export async function POST(request) {
  try {
    const body = await request.json();
    const { category, ownerId, fileType = 'image/webp' } = body;

    if (!category) {
      return NextResponse.json({ error: 'Upload category is required' }, { status: 400 });
    }

    const extension = fileType.includes('png') ? 'png' : fileType.includes('jpeg') || fileType.includes('jpg') ? 'jpg' : 'webp';
    const { bucket, path, isPublic } = generateStoragePath(category, ownerId, extension);

    // Create signed upload URL for secure direct client-to-storage transfer
    const { data: signedData, error: signError } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (signError) {
      console.error('Failed to create signed upload URL:', signError);
      // Even if signed upload URL creation fails (e.g. if anon key policy allows standard upload), return path and bucket
      return NextResponse.json({
        success: true,
        bucket,
        path,
        isPublic,
        publicUrl: isPublic ? getPublicStorageUrl(path, bucket) : null,
        signedUrl: null,
        token: null
      });
    }

    const publicUrl = isPublic ? getPublicStorageUrl(path, bucket) : null;

    return NextResponse.json({
      success: true,
      bucket,
      path,
      isPublic,
      signedUrl: signedData?.signedUrl || null,
      token: signedData?.token || null,
      publicUrl
    });
  } catch (err) {
    console.error('Upload signing route error:', err);
    return NextResponse.json({ error: 'Failed to generate upload authorization' }, { status: 500 });
  }
}
