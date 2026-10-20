/**
 * Cloudflare Turnstile Server-Side Verification Utility
 * Validates invisible bot-challenge tokens submitted from public forms.
 */
export async function verifyTurnstileToken(token, clientIp = '') {
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

  // During rollout or in local dev, if secret is not set, allow requests gracefully
  if (!secretKey) {
    console.warn('[Turnstile] CLOUDFLARE_TURNSTILE_SECRET_KEY is not defined. Bypassing check.');
    return { success: true, bypassed: true };
  }

  // Once secret is configured, strictly require token
  if (!token) {
    return { success: false, error: 'Bot verification token missing' };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (clientIp) {
      formData.append('remoteip', clientIp);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const result = await res.json();
    return {
      success: result.success === true,
      errorCodes: result['error-codes'] || [],
    };
  } catch (err) {
    console.error('[Turnstile] Verification request failed:', err);
    return { success: false, error: err.message };
  }
}
