import crypto from 'crypto';

const GCM_ALGORITHM = 'aes-256-gcm';
const CBC_ALGORITHM = 'aes-256-cbc';

function getEncryptionKey() {
  const secret = process.env.TOKEN_ENCRYPTION_SECRET || process.env.RESEND_API_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[Crypto] Warning: TOKEN_ENCRYPTION_SECRET is not configured in production environment.');
    }
    return crypto.createHash('sha256').update('carpenterwala-prod-otp-fallback-secret-2026').digest();
  }
  return crypto.createHash('sha256').update(secret).digest();
}

const KEY = getEncryptionKey();

/**
 * Encrypts a payload object into a secure, authenticated hex string using AES-256-GCM.
 * @param {Object} payload 
 * @returns {string} Encrypted token in "gcm:iv:authTag:ciphertext" format
 */
export function encryptToken(payload) {
  const iv = crypto.randomBytes(12); // Standard 12 bytes for GCM
  const cipher = crypto.createCipheriv(GCM_ALGORITHM, KEY, iv);
  let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return `gcm:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts a secure hex string back into its original payload object.
 * Enforces authenticated decryption (AES-256-GCM) with legacy AES-256-CBC fallback,
 * and automatically validates token expiration (expiresAt).
 * @param {string} token
 * @returns {Object|null} Decrypted payload object or null if invalid, tampered, or expired
 */
export function decryptToken(token) {
  if (!token || typeof token !== 'string') return null;

  try {
    let payload = null;

    if (token.startsWith('gcm:')) {
      const parts = token.split(':');
      if (parts.length !== 4) return null;
      const [, ivHex, tagHex, encryptedHex] = parts;
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(tagHex, 'hex');
      const decipher = crypto.createDecipheriv(GCM_ALGORITHM, KEY, iv);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      payload = JSON.parse(decrypted);
    } else {
      // Legacy AES-256-CBC fallback for active sessions
      const [ivHex, encryptedHex] = token.split(':');
      if (!ivHex || !encryptedHex) return null;
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv(CBC_ALGORITHM, KEY, iv);
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      payload = JSON.parse(decrypted);
    }

    if (!payload || typeof payload !== 'object') return null;

    // Centralized token expiry enforcement
    if (payload.expiresAt && Number(payload.expiresAt) < Date.now()) {
      return null;
    }

    return payload;
  } catch (e) {
    console.error('[Crypto] Token decryption/verification failed:', e.message);
    return null;
  }
}
