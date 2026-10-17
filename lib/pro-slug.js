import crypto from 'crypto';

/**
 * Generates an uppercase 4-character alphanumeric Pro Code (e.g. CW-7K92)
 * Excludes ambiguous characters (0, O, 1, I) for readability.
 */
export function generateProCode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomPart = '';
  const randomBytes = crypto.randomBytes(4);
  for (let i = 0; i < 4; i++) {
    randomPart += chars[randomBytes[i] % chars.length];
  }
  return `CW-${randomPart}`;
}

/**
 * Normalizes a professional name into a clean, URL-safe slug.
 */
export function toUrlSlug(name) {
  if (!name) return 'pro';
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'pro';
}

/**
 * Normalizes trade name into URL-safe path component.
 */
export function toTradeSlug(trade) {
  if (!trade) return 'services';
  return trade
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'services';
}

/**
 * Normalizes Pro Code (handles lowercase cw-7k92 or cw7k92 -> CW-7K92)
 */
export function normalizeProCode(code) {
  if (!code) return '';
  let cleaned = String(code).trim().toUpperCase();
  if (!cleaned.startsWith('CW-') && !cleaned.startsWith('CW')) {
    cleaned = `CW-${cleaned}`;
  } else if (cleaned.startsWith('CW') && !cleaned.startsWith('CW-')) {
    cleaned = `CW-${cleaned.slice(2)}`;
  }
  return cleaned;
}

/**
 * Builds the canonical public profile URL for a professional.
 * Example: /pro/welder/cw-7k92/ram-singh
 */
export function getProUrl(profile) {
  if (!profile) return '/find-a-professional';
  const trade = toTradeSlug(profile.trade);
  const code = (profile.pro_code || 'cw-0000').toLowerCase();
  const nameSlug = toUrlSlug(profile.name || profile.slug);
  return `/pro/${trade}/${code}/${nameSlug}`;
}

/**
 * Builds the short vanity URL for a professional.
 * Example: /pro/cw-7k92
 */
export function getProShortUrl(profileOrCode) {
  const code = typeof profileOrCode === 'string' 
    ? profileOrCode 
    : (profileOrCode?.pro_code || 'cw-0000');
  return `/pro/${code.toLowerCase()}`;
}
