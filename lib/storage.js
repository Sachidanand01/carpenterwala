import { supabase, supabaseAdmin } from './supabase.js';

export const STORAGE_BUCKETS = {
  PUBLIC: 'public-assets',
  KYC: 'kyc-documents'
};

/**
 * Strict File Validation Constants (Phase 6 Hardening):
 * Only JPEG, PNG, and WebP images up to 2MB are permitted.
 */
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export const ALLOWED_IMAGE_MIME_SET = new Set(ALLOWED_IMAGE_MIME_TYPES);

export const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

export const MAX_UPLOAD_FILE_SIZE_BYTES = 2 * 1024 * 1024; // Strict 2MB limit (2,097,152 bytes)

export const PRIVATE_KYC_CATEGORIES = new Set([
  'aadhaar_front',
  'aadhaar_back',
  'pan_front',
  'pan_back',
  'voter_driving_front',
  'voter_driving_back',
  'police_verification'
]);

/**
 * Validates file MIME type, size (max 2MB), and optional filename extension.
 * @param {{ fileType?: string, fileSize?: number, fileName?: string }} params
 * @returns {{ valid: boolean, error?: string, status?: number, normalizedMime?: string, extension?: string }}
 */
export function validateUploadFile({ fileType, fileSize, fileName } = {}) {
  const normalizedMime = String(fileType || '').toLowerCase().trim();
  if (!normalizedMime || !ALLOWED_IMAGE_MIME_SET.has(normalizedMime)) {
    return {
      valid: false,
      status: 400,
      error: 'Unsupported file type. Only JPEG, PNG, and WebP images (max 2MB) are permitted.'
    };
  }

  if (fileSize !== undefined && fileSize !== null && fileSize !== '') {
    const numericSize = Number(fileSize);
    if (Number.isNaN(numericSize) || numericSize <= 0) {
      return {
        valid: false,
        status: 400,
        error: 'Invalid file size. Uploaded image cannot be empty.'
      };
    }
    if (numericSize > MAX_UPLOAD_FILE_SIZE_BYTES) {
      return {
        valid: false,
        status: 413,
        error: 'File size exceeds the maximum 2MB limit. Please upload a JPEG, PNG, or WebP image under 2MB.'
      };
    }
  }

  if (fileName && typeof fileName === 'string' && fileName.includes('.')) {
    const ext = fileName.split('.').pop().toLowerCase().trim();
    if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
      return {
        valid: false,
        status: 400,
        error: 'Invalid file extension. Only .jpg, .jpeg, .png, and .webp files are allowed.'
      };
    }
  }

  const extension =
    normalizedMime === 'image/png'
      ? 'png'
      : normalizedMime === 'image/webp'
        ? 'webp'
        : 'jpg';

  return {
    valid: true,
    normalizedMime,
    extension
  };
}

/**
 * Validates a stored document path or URL before persisting to the database.
 * Ensures no path traversal, enforces JPEG/PNG/WebP extension, and prevents
 * private KYC documents (Aadhaar/PAN/etc.) from being stored in a public bucket.
 *
 * @param {string} urlOrPath
 * @param {{ isPrivateKyc?: boolean, label?: string }} [options]
 * @returns {{ valid: boolean, cleanPath: string, error?: string }}
 */
export function validateStoredDocumentPath(urlOrPath, { isPrivateKyc = false, label = 'Document' } = {}) {
  if (!urlOrPath || typeof urlOrPath !== 'string') {
    return { valid: false, cleanPath: '', error: `${label} path is required.` };
  }

  const trimmed = urlOrPath.trim();
  if (!trimmed || trimmed.length > 1024) {
    return { valid: false, cleanPath: '', error: `${label} path is invalid or too long.` };
  }

  if (trimmed.includes('..') || trimmed.includes('\\') || /^(javascript|data|vbscript|file):/i.test(trimmed)) {
    return { valid: false, cleanPath: '', error: `${label} path contains disallowed characters or scheme.` };
  }

  // Strip query string / hash when checking file extension
  const pathWithoutQuery = trimmed.split('?')[0].split('#')[0];
  const extMatch = pathWithoutQuery.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : '';

  if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      cleanPath: '',
      error: `${label} must be a valid JPEG, PNG, or WebP image (.jpg, .jpeg, .png, .webp).`
    };
  }

  if (isPrivateKyc) {
    // Reject if a private KYC document (like Aadhaar) was uploaded to the public-assets bucket
    if (
      trimmed.includes('/public/public-assets/') ||
      trimmed.startsWith('public-assets/') ||
      trimmed.startsWith('portfolio/') ||
      trimmed.startsWith('avatars/')
    ) {
      return {
        valid: false,
        cleanPath: '',
        error: `${label} contains sensitive KYC data and must be stored in the private kyc-documents bucket.`
      };
    }
  }

  return { valid: true, cleanPath: trimmed };
}

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

  const client = supabaseAdmin || supabase;
  const { data, error } = await client.storage
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
