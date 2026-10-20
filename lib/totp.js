import crypto from 'crypto';

/**
 * RFC 6238 Standard Time-Based One-Time Password (TOTP) Implementation
 * Zero external dependencies — pure Node.js crypto.
 * Compatible with Microsoft Authenticator, Google Authenticator, Authy, Apple Keychain, 1Password.
 */

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Decode(str) {
  const cleaned = str.toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
  let bits = '';
  for (let i = 0; i < cleaned.length; i++) {
    const val = BASE32_ALPHABET.indexOf(cleaned[i]);
    if (val === -1) {
      throw new Error(`Invalid base32 character: ${cleaned[i]}`);
    }
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substr(i, 8), 2));
  }
  return Buffer.from(bytes);
}

/**
 * Generate a 6-digit TOTP code for a given secret and time offset
 */
export function generateTOTP(secret, timeStepOffset = 0) {
  const epoch = Math.floor(Date.now() / 1000);
  const timeStep = Math.floor(epoch / 30) + timeStepOffset;

  const buf = Buffer.alloc(8);
  buf.writeBigInt64BE(BigInt(timeStep));

  const key = base32Decode(secret);
  const hmac = crypto.createHmac('sha1', key).update(buf).digest();

  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  return (binary % 1000000).toString().padStart(6, '0');
}

/**
 * Verifies a 6-digit TOTP code or an 8-character emergency backup code.
 * Includes a ±1 time step window tolerance (±30 seconds) for clock drift.
 */
export function verifyAdmin2FA({ secret, code, backupCodes = [] }) {
  if (!code || typeof code !== 'string') return false;

  const cleanCode = code.trim().replace(/\s+/g, '').toUpperCase();

  // 1. Check against emergency backup recovery codes (format: XXXX-XXXX or XXXXXXXX)
  const normalizedBackupCodes = (backupCodes || []).map((c) =>
    c.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  );
  const cleanCodeAlphanumeric = cleanCode.replace(/[^A-Za-z0-9]/g, '');

  if (cleanCodeAlphanumeric.length === 8) {
    if (normalizedBackupCodes.includes(cleanCodeAlphanumeric)) {
      return { success: true, method: 'backup_code' };
    }
  }

  // 2. Check 6-digit Authenticator TOTP code
  if (/^\d{6}$/.test(cleanCode) && secret) {
    try {
      // Check current window, -1 window (30s prior), and +1 window (30s after)
      for (let offset of [0, -1, 1]) {
        const expected = generateTOTP(secret, offset);
        if (crypto.timingSafeEqual(Buffer.from(cleanCode), Buffer.from(expected))) {
          return { success: true, method: 'totp' };
        }
      }
    } catch (err) {
      console.error('[TOTP] Verification error:', err);
      return { success: false, error: 'Verification error' };
    }
  }

  return { success: false, error: 'Invalid 2FA code' };
}
