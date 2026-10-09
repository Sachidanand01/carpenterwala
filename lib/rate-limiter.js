import crypto from 'crypto';

/**
 * Sliding Window Rate Limiter for AI Agent Endpoints
 * Enforces maximum attempts (default: 3) per 24-hour window per phone hash and per IP address.
 */

// Memory store for rate limits (persists in warm container/server lifecycle)
// Structure: Map<key, Array<number>> (array of timestamp ms)
const rateLimitStore = new Map();

const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_ATTEMPTS = 3; // Maximum 3 onboarding requests per 24h

/**
 * Normalizes and hashes a phone number with SHA-256 to avoid storing plaintext PII in rate limit logs
 * @param {string} phone 10-digit Indian phone number
 * @returns {string} SHA-256 hash prefix
 */
export function hashIdentifier(value) {
  if (!value) return 'unknown';
  const clean = value.toString().trim().toLowerCase();
  return crypto.createHash('sha256').update(clean).digest('hex').slice(0, 32);
}

/**
 * Cleans up expired timestamps older than 24 hours
 */
function cleanupExpired() {
  const cutoff = Date.now() - WINDOW_MS;
  for (const [key, timestamps] of rateLimitStore.entries()) {
    const valid = timestamps.filter(ts => ts > cutoff);
    if (valid.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, valid);
    }
  }
}

// Auto-cleanup every 30 minutes
if (typeof setInterval !== 'undefined') {
  const interval = setInterval(cleanupExpired, 30 * 60 * 1000);
  if (interval.unref) interval.unref();
}

/**
 * Checks and records an action attempt against the 24-hour rate limit.
 * 
 * @param {Object} options
 * @param {string} options.phone 10-digit phone number
 * @param {string} options.ip Client IP address
 * @param {number} [options.maxAttempts=3] Max allowed attempts in the 24h window
 * @returns {{ allowed: boolean, remaining: number, resetAt: Date, reason?: string }}
 */
export function checkRateLimit({ phone, ip, maxAttempts = MAX_ATTEMPTS }) {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;

  const phoneKey = phone ? `phone:${hashIdentifier(phone)}` : null;
  const ipKey = ip ? `ip:${ip.trim()}` : null;

  // 1. Check phone rate limit
  if (phoneKey) {
    const phoneAttempts = (rateLimitStore.get(phoneKey) || []).filter(ts => ts > cutoff);
    if (phoneAttempts.length >= maxAttempts) {
      const oldestAttempt = phoneAttempts[0];
      const resetAt = new Date(oldestAttempt + WINDOW_MS);
      return {
        allowed: false,
        remaining: 0,
        resetAt,
        reason: `Maximum ${maxAttempts} onboarding attempts per 24 hours reached for this mobile number. Please proceed directly on carpenterwala.com/pro/login or try again later.`
      };
    }
  }

  // 2. Check IP rate limit (slightly higher tolerance for shared mobile carrier IPs if needed, or equal)
  if (ipKey) {
    const ipAttempts = (rateLimitStore.get(ipKey) || []).filter(ts => ts > cutoff);
    // Allow up to maxAttempts * 2 for shared NAT IPs, but strictly maxAttempts for individual
    const ipLimit = maxAttempts * 2;
    if (ipAttempts.length >= ipLimit) {
      const oldestAttempt = ipAttempts[0];
      const resetAt = new Date(oldestAttempt + WINDOW_MS);
      return {
        allowed: false,
        remaining: 0,
        resetAt,
        reason: `Too many requests from this network. Maximum ${maxAttempts} registration requests allowed per 24 hours. Please visit carpenterwala.com/pro/login.`
      };
    }
  }

  // 3. Record attempt
  let remainingForPhone = maxAttempts;
  if (phoneKey) {
    const phoneAttempts = (rateLimitStore.get(phoneKey) || []).filter(ts => ts > cutoff);
    phoneAttempts.push(now);
    rateLimitStore.set(phoneKey, phoneAttempts);
    remainingForPhone = Math.max(0, maxAttempts - phoneAttempts.length);
  }

  if (ipKey) {
    const ipAttempts = (rateLimitStore.get(ipKey) || []).filter(ts => ts > cutoff);
    ipAttempts.push(now);
    rateLimitStore.set(ipKey, ipAttempts);
  }

  return {
    allowed: true,
    remaining: remainingForPhone,
    resetAt: new Date(now + WINDOW_MS)
  };
}

/**
 * Generic rate limiter for specific actions/keys (e.g. document verification, upload signing)
 * @param {Object} options
 * @param {string} options.key Identifier key (e.g. `verify-doc:192.168.1.1`)
 * @param {number} [options.maxAttempts=15] Max attempts within window
 * @param {number} [options.windowMs=3600000] Time window in ms (default: 1 hour)
 * @returns {{ allowed: boolean, remaining: number, resetAt: Date }}
 */
export function checkWindowRateLimit({ key, maxAttempts = 15, windowMs = 60 * 60 * 1000 }) {
  const now = Date.now();
  const cutoff = now - windowMs;

  const attempts = (rateLimitStore.get(key) || []).filter(ts => ts > cutoff);

  if (attempts.length >= maxAttempts) {
    const oldest = attempts[0];
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(oldest + windowMs)
    };
  }

  attempts.push(now);
  rateLimitStore.set(key, attempts);

  return {
    allowed: true,
    remaining: Math.max(0, maxAttempts - attempts.length),
    resetAt: new Date(now + windowMs)
  };
}
