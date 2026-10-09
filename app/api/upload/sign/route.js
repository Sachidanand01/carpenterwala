import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateStoragePath, getPublicStorageUrl, UPLOAD_CATEGORIES } from '@/lib/storage';
import { checkWindowRateLimit } from '@/lib/rate-limiter';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'application/pdf'
]);

function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || '127.0.0.1';
}

export async function POST(request) {
  try {
    const ip = getClientIp(request);

    // Rate limit: Max 25 upload authorizations per hour per IP
    const rateCheck = checkWindowRateLimit({
      key: `upload-sign:${ip}`,
      maxAttempts: 25,
      windowMs: 60 * 60 * 1000
    });

    if (!rateCheck.allowed) {
      return NextResponse.json({
        error: 'Too many upload requests. Please wait before uploading more documents.'
      }, { status: 429 });
    }

    const body = await request.json();
    const { category, ownerId, fileType = 'image/webp' } = body;

    if (!category || !UPLOAD_CATEGORIES[category]) {
      return NextResponse.json({
        error: `Invalid or unauthorized upload category "${category}".`
      }, { status: 400 });
    }

    const normalizedMime = (fileType || '').toLowerCase().trim();
    if (!ALLOWED_MIME_TYPES.has(normalizedMime)) {
      return NextResponse.json({
        error: 'Unsupported file type. Only JPEG, PNG, WebP, HEIC, and PDF documents are permitted.'
      }, { status: 400 });
    }

    // Determine strict extension from verified MIME type
    const extension = normalizedMime === 'application/pdf'
      ? 'pdf'
      : normalizedMime === 'image/png'
        ? 'png'
        : normalizedMime === 'image/heic'
          ? 'heic'
          : normalizedMime.includes('jpeg') || normalizedMime.includes('jpg')
            ? 'jpg'
            : 'webp';

    const cleanOwnerId = ownerId ? String(ownerId).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50) : 'anonymous';
    const { bucket, path, isPublic } = generateStoragePath(category, cleanOwnerId, extension);

    // Create signed upload URL for secure direct client-to-storage transfer
    const { data: signedData, error: signError } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (signError) {
      console.error('Failed to create signed upload URL:', signError);
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
