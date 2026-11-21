import crypto from 'crypto';
import { encryptToken, decryptToken } from './crypto.js';

/**
 * OAuth 2.1 & PKCE Utilities for Carpenterwala Remote MCP Server
 * Conforms to RFC 7636 (PKCE), RFC 6749, and OAuth 2.1 draft.
 */

// Allowed redirect URI patterns (ChatGPT, Claude, local dev, Carpenterwala)
const ALLOWED_REDIRECT_PATTERNS = [
  /^https:\/\/(.*\.)?chatgpt\.com(\/.*)?$/i,
  /^https:\/\/(.*\.)?openai\.com(\/.*)?$/i,
  /^https:\/\/(.*\.)?claude\.ai(\/.*)?$/i,
  /^https:\/\/(.*\.)?anthropic\.com(\/.*)?$/i,
  /^http:\/\/localhost(:\d+)?(\/.*)?$/i,
  /^http:\/\/127\.0\.0\.1(:\d+)?(\/.*)?$/i,
  /^https:\/\/carpenterwala\.com(\/.*)?$/i,
  /^https:\/\/(.*\.)?carpenterwala\.com(\/.*)?$/i
];

/**
 * Validates whether the client's redirect URI matches authorized redirect origins
 */
export function isValidRedirectUri(uri) {
  if (!uri || typeof uri !== 'string') return false;
  try {
    const parsed = new URL(uri);
    return ALLOWED_REDIRECT_PATTERNS.some(pattern => pattern.test(parsed.href));
  } catch {
    return false;
  }
}

/**
 * Validates a PKCE code_verifier against a code_challenge (S256)
 */
export function verifyCodeChallenge(codeVerifier, codeChallenge, method = 'S256') {
  if (!codeVerifier || !codeChallenge) return false;
  
  if (method === 'S256') {
    const hash = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');
    return hash === codeChallenge;
  }

  if (method === 'plain') {
    return codeVerifier === codeChallenge;
  }

  return false;
}

/**
 * Mints an encrypted, tamper-proof Authorization Code (Valid for 10 minutes)
 */
export function createAuthorizationCode({
  phone = null,
  email = null,
  role,
  proId = null,
  clientId,
  redirectUri,
  codeChallenge,
  codeChallengeMethod = 'S256',
  scopes = ['customer']
}) {
  const payload = {
    type: 'oauth_code',
    phone,
    email,
    role,
    proId,
    clientId,
    redirectUri,
    codeChallenge,
    codeChallengeMethod,
    scopes,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes TTL
  };

  return encryptToken(payload);
}

/**
 * Verifies and unpacks an Authorization Code
 */
export function verifyAuthorizationCode(code) {
  if (!code) return null;
  const decrypted = decryptToken(code);
  if (!decrypted || decrypted.type !== 'oauth_code') return null;
  if (decrypted.expiresAt && decrypted.expiresAt < Date.now()) return null;
  return decrypted;
}

/**
 * Issues an authenticated OAuth 2.1 Access Token (Valid for 30 days)
 */
export function createOAuthAccessToken({
  phone = null,
  email = null,
  role,
  proId = null,
  clientId,
  scopes = ['customer']
}) {
  const payload = {
    type: 'oauth_access_token',
    phone,
    email,
    role,
    proId,
    clientId,
    scopes,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days TTL
  };

  return encryptToken(payload);
}

/**
 * Verifies an incoming OAuth 2.1 Bearer Token
 */
export function verifyOAuthAccessToken(token) {
  if (!token || typeof token !== 'string') return null;
  const clean = token.replace(/^Bearer\s+/i, '').trim();
  if (!clean) return null;

  const decrypted = decryptToken(clean);
  if (!decrypted) return null;

  if (decrypted.type !== 'oauth_access_token' && decrypted.type !== 'customer_session' && decrypted.type !== 'pro_session') {
    return null;
  }

  if (decrypted.expiresAt && decrypted.expiresAt < Date.now()) {
    return null;
  }

  return decrypted;
}
