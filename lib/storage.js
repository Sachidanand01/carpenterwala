import { supabase } from '@/lib/supabase';

export const STORAGE_BUCKETS = {
  PUBLIC: 'public-assets',
  KYC: 'kyc-documents'
};

/**
 * Category-to-Bucket configuration
 */
export const UPLOAD_CATEGORIES = {
  avatar: { bucket: STORAGE_BUCKETS.PUBLIC, prefix: 'avatars', isPublic: true },
  pending_avatar: { bucket: STORAGE_BUCKETS.PUBLIC, prefix: 'pending-avatars', isPublic: true },
  portfolio: { bucket: STORAGE_BUCKETS.PUBLIC, prefix: 'portfolio', isPublic: true },
  aadhaar_front: { bucket: STORAGE_BUCKETS.KYC, prefix: 'kyc', isPublic: false },
  aadhaar_back: { bucket: STORAGE_BUCKETS.KYC, prefix: 'kyc', isPublic: false },
  pan_front: { bucket: STORAGE_BUCKETS.KYC, prefix: 'kyc', isPublic: false },
  pan_back: { bucket: STORAGE_BUCKETS.KYC, prefix: 'kyc', isPublic: false },
  voter_driving_front: { bucket: STORAGE_BUCKETS.KYC, prefix: 'kyc', isPublic: false },
  voter_driving_back: { bucket: STORAGE_BUCKETS.KYC, prefix: 'kyc', isPublic: false },
  police_verification: { bucket: STORAGE_BUCKETS.KYC, prefix: 'kyc', isPublic: false },
  receipt_copy: { bucket: STORAGE_BUCKETS.KYC, prefix: 'warranties', isPublic: false },
  invoice_copy: { bucket: STORAGE_BUCKETS.KYC, prefix: 'warranties', isPublic: false },
  warranty_card_copy: { bucket: STORAGE_BUCKETS.KYC, prefix: 'warranties', isPublic: false }
};

/**
 * Generates an appropriate storage path for an uploaded asset.
 */
export function generateStoragePath(category, ownerId = 'anonymous', extension = 'webp') {
  const config = UPLOAD_CATEGORIES[category] || { bucket: STORAGE_BUCKETS.PUBLIC, prefix: 'general', isPublic: true };
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 9);
  const cleanOwner = String(ownerId).replace(/[^a-zA-Z0-9_-]/g, '_');
  
  return {
    bucket: config.bucket,
    isPublic: config.isPublic,
    path: `${config.prefix}/${cleanOwner}/${category}_${timestamp}_${randomSuffix}.${extension}`
  };
}

/**
 * Returns a permanent public CDN URL for an object in the public bucket.
 */
export function getPublicStorageUrl(path, bucket = STORAGE_BUCKETS.PUBLIC) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || '';
}

/**
 * Generates a time-limited signed URL for viewing private documents (KYC/Warranties).
 * Default expiry: 15 minutes (900 seconds).
 */
export async function getSignedDocumentUrl(path, bucket = STORAGE_BUCKETS.KYC, expiresIn = 900) {
  if (!path) return null;
  if (path.startsWith('data:')) return path; // Legacy Base64 fallback

  // Clean path if full URL was accidentally passed
  let cleanPath = path;
  if (path.includes(`/${bucket}/`)) {
    cleanPath = path.split(`/${bucket}/`)[1];
  } else if (path.startsWith('http')) {
    return path;
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(cleanPath, expiresIn);

  if (error || !data?.signedUrl) {
    console.error('Error creating signed URL for document:', error);
    return null;
  }

  return data.signedUrl;
}

/**
 * Checks if a string is a legacy Base64 data URL.
 */
export function isBase64DataUrl(str) {
  return typeof str === 'string' && str.startsWith('data:image/');
}

/**
 * Resolves any image source (Base64, full URL, or storage path) to a viewable URL.
 */
export function resolveDisplayUrl(imageSrc, defaultFallback = '/images/authors/editorial.jpg') {
  if (!imageSrc) return defaultFallback;
  if (isBase64DataUrl(imageSrc) || imageSrc.startsWith('http://') || imageSrc.startsWith('https://') || imageSrc.startsWith('/')) {
    return imageSrc;
  }
  return getPublicStorageUrl(imageSrc);
}
