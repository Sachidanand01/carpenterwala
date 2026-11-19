import crypto from 'crypto';
import { supabase, supabaseAdmin } from './supabase.js';
import { generateProCode, toUrlSlug, getProUrl, getProShortUrl } from './pro-slug.js';
import { validateStoredDocumentPath } from './storage.js';

export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;
export const ONBOARDING_TOKEN_TTL_MS = 60 * 60 * 1000; // Strict 60-minute expiry window
export const MAX_DB_ONBOARDING_SESSIONS_PER_24H = 5; // Persistent 24h DB-backed rate limit per phone number

// In-memory fallback store used ONLY when Supabase network is unreachable in isolated offline/CI sandboxes
const offlineSessionStore = new Map(); // session_token -> session object
const offlineProfileStore = new Map(); // phone_number -> profile object

function isNetworkFetchError(err) {
  if (!err) return false;
  const msg = String(err.message || err.details || err).toLowerCase();
  return msg.includes('fetch failed') || msg.includes('enotfound') || msg.includes('econnrefused');
}

export const LOCALIZED_EXPIRED_MESSAGES = {
  en: {
    title: 'Link Expired',
    message: 'Link Expired: For your security, magic upload links expire after 60 minutes. Please start a fresh onboarding chat (/join) to get a new link.'
  },
  hi: {
    title: 'लिंक समाप्त हो गया है (Link Expired)',
    message: 'लिंक समाप्त हो गया है: सुरक्षा कारणों से यह लिंक 60 मिनट तक ही मान्य रहता है। नया लिंक पाने के लिए कृपया नया रजिस्ट्रेशन (/join) शुरू करें।'
  },
  kn: {
    title: 'ಲಿಂಕ್ ಅವಧಿ ಮುಗಿದಿದೆ (Link Expired)',
    message: 'ಲಿಂಕ್ ಅವಧಿ ಮುಗಿದಿದೆ: ಭದ್ರತಾ ಕಾರಣಗಳಿಗಾಗಿ ಈ ಲಿಂಕ್ 60 ನಿಮಿಷಗಳವರೆಗೆ ಮಾತ್ರ ಮಾನ್ಯವಾಗಿರುತ್ತದೆ. ಹೊಸ ಲಿಂಕ್ ಪಡೆಯಲು ದಯವಿಟ್ಟು ಹೊಸ ನೋಂದಣಿ (/join) ಪ್ರಾರಂಭಿಸಿ.'
  },
  ta: {
    title: 'இணைப்பு காலாவதியாகிவிட்டது (Link Expired)',
    message: 'இணைப்பு காலாவதியாகிவிட்டது: பாதுகாப்பு காரணங்களுக்காக இந்த இணைப்பு 60 நிமிடங்களுக்கு மட்டுமே செல்லுபடியாகும். புதிய இணைப்பைப் பெற (/join) தொடங்கவும்.'
  },
  te: {
    title: 'లింక్ గడువు ముగిసింది (Link Expired)',
    message: 'లింక్ గడువు ముగిసింది: భద్రతా కారణాల వల్ల ఈ లింక్ 60 నిమిషాలు మాత్రమే పనిచేస్తుంది. కొత్త లింక్ కోసం (/join) ప్రారంభించండి.'
  },
  mr: {
    title: 'लिंक कालबाह्य झाली आहे (Link Expired)',
    message: 'लिंक कालबाह्य झाली आहे: सुरक्षेसाठी ही लिंक 60 मिनिटांसाठीच वैध असते. नवीन लिंक मिळवण्यासाठी कृपया नवीन नोंदणी (/join) सुरू करा.'
  },
  bn: {
    title: 'লিঙ্কের মেয়াদ শেষ হয়ে গেছে (Link Expired)',
    message: 'লিঙ্কের মেয়াদ শেষ হয়ে গেছে: নিরাপত্তার কারণে এই লিঙ্কটি ৬০ মিনিটের জন্য বৈধ থাকে। নতুন লিঙ্ক পেতে অনুগ্রহ করে নতুন রেজিস্ট্রেশন (/join) শুরু করুন।'
  }
};

export function getLocalizedExpiredMessage(lang = 'en') {
  const cleanLang = String(lang || 'en').toLowerCase().trim().split('-')[0];
  return LOCALIZED_EXPIRED_MESSAGES[cleanLang] || LOCALIZED_EXPIRED_MESSAGES.en;
}

const VALID_TRADES_MAP = {
  carpentry: 'carpentry',
  carpenter: 'carpentry',
  woodwork: 'carpentry',
  painting: 'painting',
  painter: 'painting',
  plumbing: 'plumbing',
  plumber: 'plumbing',
  electrical: 'electrical',
  electrician: 'electrical'
};

const PROFILE_TRADE_LABELS = {
  carpentry: 'Carpenter',
  painting: 'Painter',
  plumbing: 'Plumber',
  electrical: 'Electrician'
};

/**
 * Generates an unambiguous 8-character URL-safe short session token (e.g. "7K9M2P4X")
 */
export function generateSessionToken(length = 8) {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
  const bytes = crypto.randomBytes(length);
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars[bytes[i] % chars.length];
  }
  return token;
}

/**
 * Strictly normalizes and validates a 10-digit Indian mobile number (must start with 6, 7, 8, or 9).
 * Accepts optional "+91", "91" (12 digits), or "0" (11 digits) country/trunk prefix.
 * Rejects any number with invalid length or non-numeric characters.
 */
export function normalizeIndianPhone(phone) {
  if (phone === undefined || phone === null) return '';
  const raw = String(phone).trim();
  if (!raw) return '';

  // Reject if input contains letters or unexpected symbols beyond phone formatting
  if (/[^0-9+\s\-().]/.test(raw)) return '';

  let digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  return INDIAN_MOBILE_REGEX.test(digits) ? digits : '';
}

/**
 * Returns true if the input is a valid 10-digit Indian mobile number starting with 6-9.
 */
export function isValidIndianMobile(phone) {
  return Boolean(normalizeIndianPhone(phone));
}

/**
 * Checks if an onboarding session has exceeded the 60-minute expiry window.
 */
export function isSessionExpired(session) {
  if (!session) return false;
  if (session.status === 'VERIFIED') return false;
  if (session.status === 'EXPIRED') return true;

  const now = Date.now();
  if (session.expires_at) {
    const expMs = new Date(session.expires_at).getTime();
    if (!Number.isNaN(expMs) && expMs <= now) {
      return true;
    }
  }

  // Fallback check on updated_at / created_at (> 60 minutes)
  const refTimestamp = session.updated_at || session.created_at;
  if (refTimestamp) {
    const createdMs = new Date(refTimestamp).getTime();
    if (!Number.isNaN(createdMs) && now - createdMs > ONBOARDING_TOKEN_TTL_MS) {
      return true;
    }
  }

  return false;
}

/**
 * Normalizes a trade string into one of: carpentry, painting, plumbing, electrical
 */
export function normalizeTrade(trade) {
  if (!trade) return '';
  const key = String(trade).trim().toLowerCase();
  if (VALID_TRADES_MAP[key]) return VALID_TRADES_MAP[key];
  for (const [k, val] of Object.entries(VALID_TRADES_MAP)) {
    if (key.includes(k)) return val;
  }
  return '';
}

/**
 * Normalizes a 6-digit Indian PIN code (returns null if not provided)
 */
export function normalizePincode(pincode) {
  if (pincode === undefined || pincode === null || String(pincode).trim() === '') {
    return null;
  }
  const digits = String(pincode).trim().replace(/\D/g, '');
  return /^[1-9]\d{5}$/.test(digits) ? digits : null;
}

/**
 * Resolves origin URL from incoming Request headers
 */
export function resolveOrigin(request) {
  if (!request) return process.env.NEXT_PUBLIC_SITE_URL || 'https://carpenterwala.com';
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (!host) return process.env.NEXT_PUBLIC_SITE_URL || 'https://carpenterwala.com';
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https');
  return `${proto}://${host}`;
}

/**
 * Creates or updates a PENDING_UPLOAD session in pro_onboarding_sessions
 * and ensures a linked row in profiles is prepared or matched.
 */
export async function initOnboardingSession(details, origin = 'https://carpenterwala.com') {
  const client = supabaseAdmin || supabase;

  const cleanPhone = normalizeIndianPhone(details.phone_number || details.phone);
  if (!cleanPhone) {
    const err = new Error('Please provide a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
    err.status = 400;
    throw err;
  }

  const fullName = String(details.full_name || details.name || '').trim();
  if (fullName.length < 2) {
    const err = new Error('Full name is required (minimum 2 characters).');
    err.status = 400;
    throw err;
  }

  const normalizedTrade = normalizeTrade(details.trade);
  if (!normalizedTrade) {
    const err = new Error('Valid trade is required (carpentry, painting, plumbing, or electrical).');
    err.status = 400;
    throw err;
  }

  const city = String(details.city || 'Bangalore').trim();
  const locality = String(details.locality || details.location || '').trim();
  if (!city || !locality) {
    const err = new Error('Both city and locality are required.');
    err.status = 400;
    throw err;
  }

  const rawPincode = details.pincode;
  const pincode = normalizePincode(rawPincode);
  if (rawPincode && String(rawPincode).trim() !== '' && !pincode) {
    const err = new Error('Invalid 6-digit Indian pincode.');
    err.status = 400;
    throw err;
  }

  let experienceYears = 1;
  if (details.experience_years !== undefined && details.experience_years !== null && details.experience_years !== '') {
    const parsedExp = parseInt(String(details.experience_years).replace(/\D/g, ''), 10);
    if (!Number.isNaN(parsedExp) && parsedExp >= 0 && parsedExp <= 70) {
      experienceYears = parsedExp;
    }
  }

  const cleanEmail = details.email ? String(details.email).trim().toLowerCase() : null;
  if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    const err = new Error('Please provide a valid email address or leave it empty.');
    err.status = 400;
    throw err;
  }

  // Persistent 24-Hour Supabase DB-Backed Rate Limit Check (survives Vercel serverless cold starts)
  const cutoff24hIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: recentSessionCount, error: countError } = await client
    .from('pro_onboarding_sessions')
    .select('id', { count: 'exact', head: true })
    .eq('phone_number', cleanPhone)
    .gte('created_at', cutoff24hIso);

  if (!countError && typeof recentSessionCount === 'number' && recentSessionCount >= MAX_DB_ONBOARDING_SESSIONS_PER_24H) {
    const err = new Error(
      `Maximum ${MAX_DB_ONBOARDING_SESSIONS_PER_24H} onboarding attempts per 24 hours reached for +91 ${cleanPhone}. Please try again tomorrow or contact Carpenterwala support.`
    );
    err.status = 429;
    err.code = 'RATE_LIMIT_EXCEEDED';
    throw err;
  }

  // Offline sandbox fallback count check
  if (countError && isNetworkFetchError(countError)) {
    const cutoff24hMs = Date.now() - 24 * 60 * 60 * 1000;
    let offlineCount = 0;
    for (const s of offlineSessionStore.values()) {
      if (s.phone_number === cleanPhone && new Date(s.created_at).getTime() >= cutoff24hMs) {
        offlineCount++;
      }
    }
    if (offlineCount >= MAX_DB_ONBOARDING_SESSIONS_PER_24H) {
      const err = new Error(
        `Maximum ${MAX_DB_ONBOARDING_SESSIONS_PER_24H} onboarding attempts per 24 hours reached for +91 ${cleanPhone}.`
      );
      err.status = 429;
      err.code = 'RATE_LIMIT_EXCEEDED';
      throw err;
    }
  }

  // Check if a profile already exists for this phone number
  const { data: existingProfile } = await client
    .from('profiles')
    .select('id, pro_code, slug, name, trade, verified')
    .eq('phone', cleanPhone)
    .maybeSingle();

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  // Check if there is an active PENDING_UPLOAD session for this phone_number
  const { data: existingSession, error: lookupError } = await client
    .from('pro_onboarding_sessions')
    .select('*')
    .eq('phone_number', cleanPhone)
    .eq('status', 'PENDING_UPLOAD')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lookupError && lookupError.code !== 'PGRST116') {
    console.error('[Onboarding Init] Lookup warning:', lookupError);
  }

  let sessionRecord = null;

  if (existingSession) {
    // Reuse token if still active, or refresh token if expired
    const isExpired = existingSession.expires_at && new Date(existingSession.expires_at).getTime() <= Date.now();
    const sessionToken = isExpired ? generateSessionToken(8) : existingSession.session_token;

    const updatePayload = {
      session_token: sessionToken,
      pro_id: existingProfile?.id || existingSession.pro_id || null,
      email: cleanEmail || existingSession.email || null,
      full_name: fullName,
      trade: normalizedTrade,
      city,
      locality,
      pincode: pincode || existingSession.pincode || null,
      experience_years: experienceYears,
      status: 'PENDING_UPLOAD',
      expires_at: expiresAt,
      updated_at: new Date().toISOString()
    };

    const { data: updated, error: updateError } = await client
      .from('pro_onboarding_sessions')
      .update(updatePayload)
      .eq('id', existingSession.id)
      .select('*')
      .single();

    if (updateError) {
      console.error('[Onboarding Init] Failed to update session:', updateError);
      throw new Error(`Failed to update onboarding session: ${updateError.message}`);
    }
    sessionRecord = updated;
  } else {
    // Generate unique short session token
    let sessionToken = generateSessionToken(8);
    for (let attempt = 0; attempt < 5; attempt++) {
      const { data: tokenConflict } = await client
        .from('pro_onboarding_sessions')
        .select('id')
        .eq('session_token', sessionToken)
        .maybeSingle();
      if (!tokenConflict) break;
      sessionToken = generateSessionToken(8);
    }

    const insertPayload = {
      session_token: sessionToken,
      pro_id: existingProfile?.id || null,
      phone_number: cleanPhone,
      email: cleanEmail,
      full_name: fullName,
      trade: normalizedTrade,
      city,
      locality,
      pincode,
      experience_years: experienceYears,
      portfolio_urls: [],
      status: 'PENDING_UPLOAD',
      expires_at: expiresAt
    };

    const { data: inserted, error: insertError } = await client
      .from('pro_onboarding_sessions')
      .insert(insertPayload)
      .select('*')
      .single();

    if (insertError) {
      if (isNetworkFetchError(insertError)) {
        const offlineRecord = {
          id: crypto.randomUUID(),
          ...insertPayload,
          verified_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        offlineSessionStore.set(offlineRecord.session_token, offlineRecord);
        sessionRecord = offlineRecord;
      } else {
        console.error('[Onboarding Init] Failed to insert session:', insertError);
        throw new Error(`Failed to create onboarding session: ${insertError.message}`);
      }
    } else {
      sessionRecord = inserted;
    }
  }

  const cleanOrigin = origin.replace(/\/$/, '');
  const verifyUrl = `${cleanOrigin}/v/${sessionRecord.session_token}`;

  return {
    session_token: sessionRecord.session_token,
    verify_url: verifyUrl,
    expires_at: sessionRecord.expires_at,
    status: sessionRecord.status,
    session: sessionRecord
  };
}

/**
 * Fetches an onboarding session by session_token (or phone_number) and auto-transitions EXPIRED sessions
 */
export async function getOnboardingSessionStatus(tokenOrPhone) {
  const client = supabaseAdmin || supabase;
  const cleanInput = String(tokenOrPhone || '').trim();
  if (!cleanInput) return null;

  const normalizedPhone = cleanInput.length >= 10 ? normalizeIndianPhone(cleanInput) : '';
  const isPhone = Boolean(normalizedPhone);
  let query = client.from('pro_onboarding_sessions').select('*');

  if (isPhone) {
    query = query.eq('phone_number', normalizedPhone).order('created_at', { ascending: false }).limit(1);
  } else {
    query = query.eq('session_token', cleanInput);
  }

  const { data: session, error } = await query.maybeSingle();
  if (error) {
    if (isNetworkFetchError(error)) {
      let offlineSess = null;
      if (isPhone) {
        for (const s of offlineSessionStore.values()) {
          if (s.phone_number === normalizedPhone) {
            offlineSess = s;
          }
        }
      } else {
        offlineSess = offlineSessionStore.get(cleanInput) || null;
      }
      if (!offlineSess) return null;
      if (offlineSess.status === 'PENDING_UPLOAD' && isSessionExpired(offlineSess)) {
        offlineSess.status = 'EXPIRED';
        offlineSess.updated_at = new Date().toISOString();
      }
      return offlineSess;
    }
    console.error('[Onboarding Status] Query error:', error);
    throw new Error(`Failed to retrieve onboarding session: ${error.message}`);
  }

  if (!session) return null;

  // Check if PENDING_UPLOAD session has passed its 60-minute expires_at window
  if (session.status === 'PENDING_UPLOAD' && isSessionExpired(session)) {
    const { data: expiredSession } = await client
      .from('pro_onboarding_sessions')
      .update({
        status: 'EXPIRED',
        updated_at: new Date().toISOString()
      })
      .eq('id', session.id)
      .select('*')
      .maybeSingle();

    return expiredSession || { ...session, status: 'EXPIRED' };
  }

  return session;
}

/**
 * Completes an onboarding session: saves uploaded document paths, marks session VERIFIED,
 * and creates or updates the linked row in the `profiles` table.
 */
export async function completeOnboardingSession(payload) {
  const client = supabaseAdmin || supabase;
  const sessionToken = String(payload.session_token || payload.token || '').trim();
  const lang = String(payload.lang || 'en').toLowerCase().trim();

  if (!sessionToken) {
    const err = new Error('session_token is required.');
    err.status = 400;
    throw err;
  }

  const session = await getOnboardingSessionStatus(sessionToken);
  if (!session) {
    const err = new Error('Invalid onboarding session token.');
    err.status = 404;
    throw err;
  }

  if (session.status === 'EXPIRED' || isSessionExpired(session)) {
    const localized = getLocalizedExpiredMessage(lang);
    const err = new Error(localized.message);
    err.status = 410;
    err.code = 'SESSION_EXPIRED';
    err.expired_title = localized.title;
    err.localized_expired = LOCALIZED_EXPIRED_MESSAGES;
    throw err;
  }

  const rawAadhaarFrontUrl = payload.aadhaar_front_url ?? payload.aadhaar_front ?? session.aadhaar_front_url ?? null;
  const rawAadhaarBackUrl = payload.aadhaar_back_url ?? payload.aadhaar_back ?? session.aadhaar_back_url ?? null;
  const rawPanFrontUrl = payload.pan_front_url ?? payload.pan_front ?? payload.pan_url ?? session.pan_front_url ?? null;
  const rawPanBackUrl = payload.pan_back_url ?? payload.pan_back ?? session.pan_back_url ?? null;
  const rawVoterDrivingFrontUrl =
    payload.voter_driving_front_url ??
    payload.voter_driving_front ??
    payload.voter_driving_url ??
    session.voter_driving_front_url ??
    null;
  const rawVoterDrivingBackUrl =
    payload.voter_driving_back_url ??
    payload.voter_driving_back ??
    session.voter_driving_back_url ??
    null;
  const rawPoliceVerificationUrl =
    payload.police_verification_url ??
    payload.police_verification ??
    session.police_verification_url ??
    null;

  let rawPortfolioUrls = session.portfolio_urls || [];
  if (Array.isArray(payload.portfolio_urls)) {
    rawPortfolioUrls = payload.portfolio_urls.filter(Boolean);
  } else if (Array.isArray(payload.portfolio)) {
    rawPortfolioUrls = payload.portfolio.filter(Boolean);
  }

  if (!rawAadhaarFrontUrl || !rawAadhaarBackUrl) {
    const err = new Error('Both Aadhaar Front and Aadhaar Back photos are required to complete verification.');
    err.status = 400;
    throw err;
  }

  // Strict validation of Aadhaar & KYC document paths (must be JPEG/PNG/WebP and stored in private bucket)
  const frontCheck = validateStoredDocumentPath(rawAadhaarFrontUrl, {
    isPrivateKyc: true,
    label: 'Aadhaar Front'
  });
  if (!frontCheck.valid) {
    const err = new Error(frontCheck.error);
    err.status = 400;
    err.code = 'INVALID_DOCUMENT_FILE';
    throw err;
  }

  const backCheck = validateStoredDocumentPath(rawAadhaarBackUrl, {
    isPrivateKyc: true,
    label: 'Aadhaar Back'
  });
  if (!backCheck.valid) {
    const err = new Error(backCheck.error);
    err.status = 400;
    err.code = 'INVALID_DOCUMENT_FILE';
    throw err;
  }

  const aadhaarFrontUrl = frontCheck.cleanPath;
  const aadhaarBackUrl = backCheck.cleanPath;

  const validateOptionalKyc = (val, label) => {
    if (!val) return null;
    const chk = validateStoredDocumentPath(val, { isPrivateKyc: true, label });
    if (!chk.valid) {
      const err = new Error(chk.error);
      err.status = 400;
      err.code = 'INVALID_DOCUMENT_FILE';
      throw err;
    }
    return chk.cleanPath;
  };

  const panFrontUrl = validateOptionalKyc(rawPanFrontUrl, 'PAN Card Front');
  const panBackUrl = validateOptionalKyc(rawPanBackUrl, 'PAN Card Back');
  const voterDrivingFrontUrl = validateOptionalKyc(rawVoterDrivingFrontUrl, 'Voter ID / Driving Licence Front');
  const voterDrivingBackUrl = validateOptionalKyc(rawVoterDrivingBackUrl, 'Voter ID / Driving Licence Back');
  const policeVerificationUrl = validateOptionalKyc(rawPoliceVerificationUrl, 'Police Verification');

  const portfolioUrls = [];
  for (const item of rawPortfolioUrls.slice(0, 6)) {
    const chk = validateStoredDocumentPath(item, { isPrivateKyc: false, label: 'Portfolio work photo' });
    if (!chk.valid) {
      const err = new Error(chk.error);
      err.status = 400;
      err.code = 'INVALID_DOCUMENT_FILE';
      throw err;
    }
    portfolioUrls.push(chk.cleanPath);
  }

  // Sync with `profiles` table (upsert by pro_id or phone)
  let existingProfile = null;
  if (session.pro_id) {
    const { data } = await client
      .from('profiles')
      .select('*')
      .eq('id', session.pro_id)
      .maybeSingle();
    existingProfile = data;
  }

  if (!existingProfile && session.phone_number) {
    const { data } = await client
      .from('profiles')
      .select('*')
      .eq('phone', session.phone_number)
      .maybeSingle();
    existingProfile = data;
  }

  const tradeLabel = PROFILE_TRADE_LABELS[session.trade] || session.trade;
  const formattedLocation = [session.locality, session.city, session.pincode].filter(Boolean).join(', ');
  const formattedExperience = `${session.experience_years ?? 1} ${Number(session.experience_years) === 1 ? 'Year' : 'Years'}`;

  let syncedProfile = null;

  if (existingProfile) {
    let proCode = existingProfile.pro_code;
    if (!proCode) {
      proCode = generateProCode();
    }

    const mergedPortfolio = Array.from(
      new Set([...(Array.isArray(existingProfile.portfolio) ? existingProfile.portfolio : []), ...portfolioUrls])
    );

    const profileUpdate = {
      pro_code: proCode,
      name: session.full_name || existingProfile.name,
      phone: session.phone_number,
      email: session.email || existingProfile.email || null,
      trade: tradeLabel,
      experience: formattedExperience,
      location: formattedLocation,
      full_address: formattedLocation,
      aadhaar_front: aadhaarFrontUrl,
      aadhaar_back: aadhaarBackUrl,
      pan_front: panFrontUrl || existingProfile.pan_front || null,
      pan_back: panBackUrl || existingProfile.pan_back || null,
      voter_driving_front: voterDrivingFrontUrl || existingProfile.voter_driving_front || null,
      voter_driving_back: voterDrivingBackUrl || existingProfile.voter_driving_back || null,
      police_verification: policeVerificationUrl || existingProfile.police_verification || null,
      portfolio: mergedPortfolio,
      verified: true,
      onboarding_completed: true,
      onboarding_step: 3,
      accepting_leads: true
    };

    let { data: updatedPro, error: proUpdateErr } = await client
      .from('profiles')
      .update(profileUpdate)
      .eq('id', existingProfile.id)
      .select('*')
      .single();

    // Fallback if optional columns are not yet present in older DB schema
    if (proUpdateErr && (proUpdateErr.code === '42703' || proUpdateErr.code === 'PGRST204')) {
      const safeUpdate = {
        name: profileUpdate.name,
        phone: profileUpdate.phone,
        trade: profileUpdate.trade,
        experience: profileUpdate.experience,
        location: profileUpdate.location,
        full_address: profileUpdate.full_address,
        aadhaar_front: profileUpdate.aadhaar_front,
        aadhaar_back: profileUpdate.aadhaar_back,
        pan_front: profileUpdate.pan_front,
        pan_back: profileUpdate.pan_back,
        voter_driving_front: profileUpdate.voter_driving_front,
        voter_driving_back: profileUpdate.voter_driving_back,
        police_verification: profileUpdate.police_verification,
        portfolio: profileUpdate.portfolio,
        verified: true,
        onboarding_completed: true,
        onboarding_step: 3
      };
      const retry = await client
        .from('profiles')
        .update(safeUpdate)
        .eq('id', existingProfile.id)
        .select('*')
        .single();
      updatedPro = retry.data;
      proUpdateErr = retry.error;
    }

    if (proUpdateErr) {
      console.error('[Onboarding Complete] Profile update warning:', proUpdateErr);
    } else {
      syncedProfile = updatedPro;
    }
  } else {
    // Create a brand new profile row
    let proCode = generateProCode();
    for (let attempt = 0; attempt < 5; attempt++) {
      const { data: codeTaken } = await client
        .from('profiles')
        .select('id')
        .eq('pro_code', proCode)
        .maybeSingle();
      if (!codeTaken) break;
      proCode = generateProCode();
    }

    const baseSlug = toUrlSlug(session.full_name);
    let uniqueSlug = `${baseSlug}-${proCode.toLowerCase()}`;

    const newProfilePayload = {
      pro_code: proCode,
      slug: uniqueSlug,
      name: session.full_name,
      phone: session.phone_number,
      email: session.email || null,
      trade: tradeLabel,
      experience: formattedExperience,
      location: formattedLocation,
      full_address: formattedLocation,
      about: `Verified ${tradeLabel} in ${session.locality}, ${session.city} with ${formattedExperience} of hands-on experience. Available for direct zero-commission bookings.`,
      portfolio: portfolioUrls,
      aadhaar_front: aadhaarFrontUrl,
      aadhaar_back: aadhaarBackUrl,
      pan_front: panFrontUrl,
      pan_back: panBackUrl,
      voter_driving_front: voterDrivingFrontUrl,
      voter_driving_back: voterDrivingBackUrl,
      police_verification: policeVerificationUrl,
      verified: true,
      onboarding_completed: true,
      onboarding_step: 3,
      accepting_leads: true
    };

    let { data: insertedPro, error: proInsertErr } = await client
      .from('profiles')
      .insert(newProfilePayload)
      .select('*')
      .single();

    if (proInsertErr && (proInsertErr.code === '42703' || proInsertErr.code === 'PGRST204')) {
      const safeInsert = {
        slug: uniqueSlug,
        name: newProfilePayload.name,
        phone: newProfilePayload.phone,
        trade: newProfilePayload.trade,
        experience: newProfilePayload.experience,
        location: newProfilePayload.location,
        full_address: newProfilePayload.full_address,
        about: newProfilePayload.about,
        portfolio: newProfilePayload.portfolio,
        aadhaar_front: newProfilePayload.aadhaar_front,
        aadhaar_back: newProfilePayload.aadhaar_back,
        pan_front: newProfilePayload.pan_front,
        pan_back: newProfilePayload.pan_back,
        voter_driving_front: newProfilePayload.voter_driving_front,
        voter_driving_back: newProfilePayload.voter_driving_back,
        police_verification: newProfilePayload.police_verification,
        verified: true,
        onboarding_completed: true,
        onboarding_step: 3
      };
      const retry = await client
        .from('profiles')
        .insert(safeInsert)
        .select('*')
        .single();
      insertedPro = retry.data;
      proInsertErr = retry.error;
    }

    if (proInsertErr) {
      if (isNetworkFetchError(proInsertErr)) {
        const offlinePro = {
          id: Date.now(),
          ...newProfilePayload,
          created_at: new Date().toISOString()
        };
        offlineProfileStore.set(session.phone_number, offlinePro);
        syncedProfile = offlinePro;
      } else {
        console.error('[Onboarding Complete] Profile insert warning:', proInsertErr);
      }
    } else {
      syncedProfile = insertedPro;
    }
  }

  // Update pro_onboarding_sessions record to VERIFIED
  const sessionUpdatePayload = {
    pro_id: syncedProfile?.id || session.pro_id || null,
    aadhaar_front_url: aadhaarFrontUrl,
    aadhaar_back_url: aadhaarBackUrl,
    pan_front_url: panFrontUrl,
    pan_back_url: panBackUrl,
    voter_driving_front_url: voterDrivingFrontUrl,
    voter_driving_back_url: voterDrivingBackUrl,
    police_verification_url: policeVerificationUrl,
    portfolio_urls: portfolioUrls,
    status: 'VERIFIED',
    verified_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  let { data: updatedSession, error: sessionUpdateErr } = await client
    .from('pro_onboarding_sessions')
    .update(sessionUpdatePayload)
    .eq('id', session.id)
    .select('*')
    .single();

  // Fallback if optional extra doc columns aren't migrated yet
  if (sessionUpdateErr && (sessionUpdateErr.code === '42703' || sessionUpdateErr.code === 'PGRST204')) {
    const coreSessionUpdate = {
      aadhaar_front_url: aadhaarFrontUrl,
      aadhaar_back_url: aadhaarBackUrl,
      portfolio_urls: portfolioUrls,
      status: 'VERIFIED'
    };
    const retry = await client
      .from('pro_onboarding_sessions')
      .update(coreSessionUpdate)
      .eq('id', session.id)
      .select('*')
      .single();
    updatedSession = retry.data;
    sessionUpdateErr = retry.error;
  }

  if (sessionUpdateErr) {
    if (isNetworkFetchError(sessionUpdateErr) || offlineSessionStore.has(session.session_token)) {
      const mergedOffline = {
        ...session,
        ...sessionUpdatePayload
      };
      offlineSessionStore.set(session.session_token, mergedOffline);
      updatedSession = mergedOffline;
    } else {
      throw new Error(`Failed to mark onboarding session as VERIFIED: ${sessionUpdateErr.message}`);
    }
  }

  return {
    session: updatedSession,
    profile: formatPublicOnboardingProfile(syncedProfile)
  };
}

/**
 * Formats safe public profile metadata for onboarding status responses
 */
function formatPublicOnboardingProfile(profile) {
  if (!profile) return null;
  return {
    id: profile.id,
    pro_code: profile.pro_code || null,
    slug: profile.slug,
    name: profile.name,
    trade: profile.trade,
    location: profile.location,
    verified: profile.verified,
    profile_url: getProUrl(profile),
    short_url: getProShortUrl(profile)
  };
}

/**
 * Fetches the linked public profile for an onboarding session if available
 */
export async function getOnboardingSessionProfile(session) {
  if (!session) return null;
  const client = supabaseAdmin || supabase;
  let profile = null;

  if (session.pro_id) {
    const { data } = await client
      .from('profiles')
      .select('id, pro_code, slug, name, trade, location, verified')
      .eq('id', session.pro_id)
      .maybeSingle();
    profile = data;
  }

  if (!profile && session.phone_number) {
    const { data } = await client
      .from('profiles')
      .select('id, pro_code, slug, name, trade, location, verified')
      .eq('phone', session.phone_number)
      .maybeSingle();
    profile = data;
  }

  if (!profile && session.phone_number && offlineProfileStore.has(session.phone_number)) {
    profile = offlineProfileStore.get(session.phone_number);
  }

  return formatPublicOnboardingProfile(profile);
}
