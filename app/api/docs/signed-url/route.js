import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSignedDocumentUrl, STORAGE_BUCKETS } from '@/lib/storage';
import { decryptToken } from '@/lib/crypto';

function isAuthorizedForDocument(request, path, bucket) {
  // Public bucket files don't require authorization
  if (bucket === STORAGE_BUCKETS.PUBLIC) {
    return true;
  }

  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim() ||
                request.headers.get('x-pro-token') ||
                request.headers.get('x-customer-auth') ||
                new URL(request.url).searchParams.get('token');

  if (!token) return false;

  // 1. Check Admin token
  const expectedPassword = process.env.ADMIN_PASSWORD || 'CarpenterwalaAdmin2026';
  const expectedAdminToken = crypto
    .createHash('sha256')
    .update(expectedPassword + 'carpenterwala-salt-2026')
    .digest('hex');
  if (token === expectedAdminToken || token === expectedPassword) {
    return true;
  }

  // 2. Check Customer phone or Customer session for warranties
  if (path && (path.includes('warranties') || bucket === 'warranties')) {
    if (/^[6-9]\d{9}$/.test(token)) {
      return true;
    }
    const decryptedCustomer = decryptToken(token);
    if (decryptedCustomer?.type === 'customer_otp' || decryptedCustomer?.type === 'customer_session') {
      return true;
    }
  }

  // 3. Check Pro session token
  const decrypted = decryptToken(token);
  if (decrypted && (decrypted.type === 'pro_session' || decrypted.type === 'ai_pro_onboarding')) {
    return true;
  }

  return false;
}

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

    if (!isAuthorizedForDocument(request, path, bucket)) {
      return NextResponse.json({ error: 'Unauthorized: Session required to view private document' }, { status: 401 });
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

    if (!isAuthorizedForDocument(request, path, bucket)) {
      return NextResponse.json({ error: 'Unauthorized: Session required to view private document' }, { status: 401 });
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
