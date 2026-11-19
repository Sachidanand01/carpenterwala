import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import {
  generateStoragePath,
  getPublicStorageUrl,
  UPLOAD_CATEGORIES,
  PRIVATE_KYC_CATEGORIES,
  STORAGE_BUCKETS,
  MAX_UPLOAD_FILE_SIZE_BYTES,
  validateUploadFile
} from '@/lib/storage';
import { checkWindowRateLimit, getClientIp, buildRateLimitHeaders } from '@/lib/rate-limiter';

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
      return NextResponse.json(
        {
          success: false,
          error: 'Too many upload requests. Please wait before uploading more documents.'
        },
        {
          status: 429,
          headers: buildRateLimitHeaders(rateCheck, 25)
        }
      );
    }

    const body = await request.json();
    const { category, ownerId, fileType = 'image/jpeg', fileSize, fileName } = body;

    if (!category || !UPLOAD_CATEGORIES[category]) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid or unauthorized upload category "${category}".`
        },
        { status: 400 }
      );
    }

    // Strict file validation: JPEG/PNG/WebP only, max 2MB
    const validation = validateUploadFile({ fileType, fileSize, fileName });
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
          maxSizeBytes: MAX_UPLOAD_FILE_SIZE_BYTES
        },
        { status: validation.status || 400 }
      );
    }

    const cleanOwnerId = ownerId ? String(ownerId).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50) : 'anonymous';
    const generated = generateStoragePath(category, cleanOwnerId, validation.extension);

    // Guarantee that Aadhaar & other KYC documents always route to the private kyc-documents bucket
    const isPrivateKyc = PRIVATE_KYC_CATEGORIES.has(category);
    const bucket = isPrivateKyc ? STORAGE_BUCKETS.KYC : generated.bucket;
    const isPublic = isPrivateKyc ? false : generated.isPublic;
    const path = generated.path;

    // Create signed upload URL via supabaseAdmin for secure client-to-storage transfer
    const storageClient = supabaseAdmin || supabase;
    const { data: signedData, error: signError } = await storageClient.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (signError) {
      console.error('Failed to create signed upload URL:', signError);
      return NextResponse.json({
        success: true,
        bucket,
        path,
        isPublic,
        maxSizeBytes: MAX_UPLOAD_FILE_SIZE_BYTES,
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
      maxSizeBytes: MAX_UPLOAD_FILE_SIZE_BYTES,
      signedUrl: signedData?.signedUrl || null,
      token: signedData?.token || null,
      publicUrl
    });
  } catch (err) {
    console.error('Upload signing route error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to generate upload authorization' },
      { status: 500 }
    );
  }
}
