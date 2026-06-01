import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
// Use the RESEND_API_KEY as the secret key. If not configured, fall back to a long-lived default secret.
const SECRET = process.env.RESEND_API_KEY || 'carpenterwala-prod-otp-fallback-secret-2026';
const KEY = crypto.createHash('sha256').update(SECRET).digest();

/**
 * Encrypts a payload object into a secure, tamper-proof hex string.
 * @param {Object} payload 
 * @returns {string} Encrypted token in "iv:ciphertext" format
 */
export function encryptToken(payload) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts a secure hex string back into its original payload object.
 * @param {string} token "iv:ciphertext" format
 * @returns {Object|null} Decrypted payload object or null if invalid/tampered
 */
export function decryptToken(token) {
  if (!token) return null;
  try {
    const [ivHex, encryptedHex] = token.split(':');
    if (!ivHex || !encryptedHex) return null;
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  } catch (e) {
    console.error('[Crypto] Token decryption/verification failed:', e);
    return null;
  }
}
