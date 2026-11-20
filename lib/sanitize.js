/**
 * Centralized Security Sanitization Helpers
 * Protects against XSS in JSON-LD, HTML email injection, open redirects, and PostgREST filter injection.
 */

export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function sanitizeRelativeUrl(url, fallback = '/') {
  if (!url || typeof url !== 'string') return fallback;
  const clean = url.trim();
  // Relative path only: must start with single '/', not '//' or 'javascript:' or external scheme
  if (/^\/(?!\/)/.test(clean)) {
    return clean;
  }
  return fallback;
}

export function safeJsonLd(obj) {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

export function sanitizePostgrestFilter(str) {
  if (!str) return '';
  return String(str).replace(/[^a-zA-Z0-9\s_-]/g, '').trim();
}
