import crypto from 'crypto';

/**
 * Centralized Admin Authorization & Secret Management
 * In production, fails closed if secrets are unset or empty.
 * In development / test, permits development test defaults.
 */

function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function getExpectedAdminTokens() {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    if (process.env.NODE_ENV === 'production') {
      return { configured: false, expectedTokens: [] };
    }
    const devPassword = 'CarpenterwalaAdmin2026';
    const devToken = crypto
      .createHash('sha256')
      .update(devPassword + 'carpenterwala-salt-2026')
      .digest('hex');
    return { configured: true, expectedTokens: [devPassword, devToken] };
  }

  const hashedToken = crypto
    .createHash('sha256')
    .update(password + 'carpenterwala-salt-2026')
    .digest('hex');

  return { configured: true, expectedTokens: [password, hashedToken] };
}

export function isValidAdminToken(token) {
  if (!token || typeof token !== 'string') return false;
  const clean = token.replace(/^Bearer\s+/i, '').trim();
  if (!clean) return false;

  const { configured, expectedTokens } = getExpectedAdminTokens();
  if (!configured) return false;

  for (const expected of expectedTokens) {
    if (safeCompare(clean, expected)) {
      return true;
    }
  }
  return false;
}

export function isValidCronSecret(token) {
  if (!token || typeof token !== 'string') return false;
  const clean = token.replace(/^Bearer\s+/i, '').trim();
  const configuredCron = process.env.CRON_SECRET;
  if (!configuredCron) {
    return false;
  }
  return safeCompare(clean, configuredCron);
}

export function isValidAdminOrCron(request) {
  if (!request) return false;
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const cronSecretHeader = request.headers.get('x-cron-secret');

  if (isValidCronSecret(token) || isValidCronSecret(cronSecretHeader)) {
    return true;
  }

  return isValidAdminToken(token);
}

export function isValidRevalidationSecret(secret) {
  if (!secret || typeof secret !== 'string') return false;
  const configured = process.env.REVALIDATION_SECRET;
  if (!configured) {
    if (process.env.NODE_ENV === 'production') return false;
    return safeCompare(secret, 'carpenterwala-secret-reval-2026');
  }
  return safeCompare(secret, configured);
}
