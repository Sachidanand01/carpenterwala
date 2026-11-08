/**
 * Phone Number Obfuscation Utility for Anti-Scraping
 * Prevents automated scrapers, regular expressions, and bots from harvesting
 * technician phone numbers from static HTML, while allowing human visitors to click-to-call.
 */

const SALT = 'CW_PRO_PROTECT_2026';

/**
 * Masks a phone number for safe SSR / HTML rendering (e.g. "+91 98•••• ••10")
 * @param {string} phone 
 * @returns {string} Masked phone number
 */
export function maskPhone(phone) {
  if (!phone) return '+91 ••••• •••••';
  const digits = phone.toString().replace(/\D/g, '').slice(-10);
  if (digits.length < 10) return '+91 ••••• •••••';
  return `+91 ${digits.slice(0, 2)}•••• ••${digits.slice(-2)}`;
}

/**
 * Obfuscates a phone number into an encoded token for client-side hydration.
 * Text scrapers cannot regex or pattern-match this string.
 * @param {string} phone 
 * @returns {string} Obfuscated payload
 */
export function scramblePhone(phone) {
  if (!phone) return '';
  const digits = phone.toString().replace(/\D/g, '').slice(-10);
  if (digits.length !== 10) return '';
  
  // Reversible lightweight XOR + Base64 encoding
  const chars = [];
  for (let i = 0; i < digits.length; i++) {
    const code = digits.charCodeAt(i) ^ SALT.charCodeAt(i % SALT.length);
    chars.push(String.fromCharCode(code));
  }
  
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(chars.join('')).toString('base64');
  }
  return btoa(chars.join(''));
}

/**
 * Decodes an obfuscated phone token back into its real 10-digit number on user interaction.
 * @param {string} token 
 * @returns {string} Clean 10-digit phone or empty
 */
export function unscramblePhone(token) {
  if (!token) return '';
  try {
    let raw = '';
    if (typeof atob !== 'undefined') {
      raw = atob(token);
    } else if (typeof Buffer !== 'undefined') {
      raw = Buffer.from(token, 'base64').toString('binary');
    }
    const digits = [];
    for (let i = 0; i < raw.length; i++) {
      const code = raw.charCodeAt(i) ^ SALT.charCodeAt(i % SALT.length);
      digits.push(String.fromCharCode(code));
    }
    const phone = digits.join('');
    return /^\d{10}$/.test(phone) ? phone : '';
  } catch {
    return '';
  }
}

