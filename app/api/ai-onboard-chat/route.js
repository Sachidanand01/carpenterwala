import { NextResponse } from 'next/server';
import {
  initOnboardingSession,
  resolveOrigin,
  normalizeIndianPhone,
  normalizeTrade,
  normalizePincode
} from '@/lib/onboarding.js';
import {
  checkRateLimit,
  checkWindowRateLimit,
  getClientIp,
  buildRateLimitHeaders
} from '@/lib/rate-limiter.js';

// Common Bangalore localities for smart Indian locality matching
const KNOWN_BANGALORE_LOCALITIES = [
  'Whitefield',
  'Koramangala',
  'Indiranagar',
  'HSR Layout',
  'Electronic City',
  'Jayanagar',
  'Marathahalli',
  'Bellandur',
  'BTM Layout',
  'Malleshwaram',
  'Hebbal',
  'Yelahanka',
  'Sarjapur',
  'Thanisandra',
  'Banashankari',
  'Rajajinagar',
  'JP Nagar',
  'RT Nagar',
  'Domlur',
  'Kalyan Nagar',
  'Vijayanagar',
  'Basavanagudi',
  'Richmond Town',
  'Frazer Town',
  'Ulsoor',
  'Mahadevapura',
  'KR Puram',
  'Kengeri',
  'Kanakapura Road',
  'Bannerghatta Road',
  'Kundalahalli',
  'Brookefield',
  'Kadugodi',
  'Varthur',
  'Hoodi',
  'Nagawara',
  'Hennur',
  'Horamavu',
  'Ramamurthy Nagar',
  'Harlur',
  'Kasavanahalli',
  'Kudlu Gate',
  'Bommanahalli',
  'Begur',
  'Singasandra',
  'Attibele',
  'Chandapura',
  'Devanahalli',
  'Yeshwanthpur',
  'Peenya',
  'Nagarbhavi'
];

const KNOWN_INDIAN_CITIES = [
  'Bangalore',
  'Bengaluru',
  'Mumbai',
  'Delhi',
  'New Delhi',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Chandigarh',
  'Noida',
  'Gurgaon',
  'Gurugram',
  'Ghaziabad',
  'Faridabad',
  'Indore',
  'Bhopal',
  'Coimbatore',
  'Kochi',
  'Mysore',
  'Mysuru',
  'Nagpur',
  'Surat',
  'Vadodara',
  'Patna'
];

/**
 * Extracts entities using intelligent regex and heuristic NLP
 */
function extractEntitiesHeuristically(text, currentData = {}) {
  const input = String(text || '').trim();
  const lower = input.toLowerCase();
  const extracted = { ...currentData };

  // 1. Phone number extraction (10-digit Indian mobile starting with 6, 7, 8, 9)
  // Check exact 10-digit word boundary first to avoid merging with experience digits (e.g. "9876543210 ... 8 saal")
  const directMatch = input.match(/\b([6-9]\d{9})\b/);
  if (directMatch) {
    extracted.phone_number = directMatch[1];
  } else {
    // Handles +91, 0, spaces, hyphens
    const phoneRegex = /(?:\+?91[\s-]*)?(?:0[\s-]*)?([6-9]\d{4}[\s-]?\d{5})\b/;
    const formattedMatch = input.match(phoneRegex);
    if (formattedMatch && formattedMatch[1]) {
      const normalized = normalizeIndianPhone(formattedMatch[1]);
      if (normalized) extracted.phone_number = normalized;
    } else {
      // Look for individual 10+ digits sequence before non-digit words
      const seqMatch = input.match(/(?:mobile|phone|number|no|contact)?[\s:]*(?:\+?91[\s-]*)?(?:0[\s-]*)?([6-9]\d{9})/i);
      if (seqMatch && seqMatch[1]) {
        extracted.phone_number = seqMatch[1];
      }
    }
  }

  // 2. Trade extraction
  if (!extracted.trade) {
    if (
      /\b(carpenter|carpentry|badhai|badaee|badhaiji|furniture|plywood|woodwork|almirah|wardrobe|door fitting|shutter|बढ़ई|कारपेंटर)\b/i.test(lower)
    ) {
      extracted.trade = 'carpentry';
    } else if (
      /\b(painter|painting|paint|putty|primer|whitewash|texture|rangai|रंगाई|पेंटर)\b/i.test(lower)
    ) {
      extracted.trade = 'painting';
    } else if (
      /\b(plumber|plumbing|leak|leakage|pipe|tap|faucet|water tank|flush|drain|bathroom fitting|नल|प्लंबर)\b/i.test(lower)
    ) {
      extracted.trade = 'plumbing';
    } else if (
      /\b(electrician|electrical|electric|wiring|switch|socket|mcb|fan fitting|inverter|geyser wiring|बिजली|इलेक्ट्रीशियन)\b/i.test(lower)
    ) {
      extracted.trade = 'electrical';
    }
  }

  // 3. Experience years extraction
  const expMatch =
    input.match(/(\d{1,2})\s*(?:\+?\s*)?(?:years?|yrs?|saal|साल|varsh|वर्ष|baras)\b/i) ||
    input.match(/(?:experience|exp|anubhav|tajurba)\s*(?:of|is|:)?\s*(\d{1,2})/i);
  if (expMatch && expMatch[1]) {
    const yrs = parseInt(expMatch[1], 10);
    if (!Number.isNaN(yrs) && yrs >= 0 && yrs <= 60) {
      extracted.experience_years = yrs;
    }
  }

  // 4. Locality & City extraction
  // Check known cities first so we can avoid capturing city name as locality
  for (const city of KNOWN_INDIAN_CITIES) {
    const cityRegex = new RegExp(`\\b${city.replace(/\s+/g, '\\s+')}\\b`, 'i');
    if (cityRegex.test(input)) {
      extracted.city = city === 'Bengaluru' ? 'Bangalore' : city;
      break;
    }
  }

  // Check known Bangalore localities
  for (const loc of KNOWN_BANGALORE_LOCALITIES) {
    const locRegex = new RegExp(`\\b${loc.replace(/\s+/g, '\\s+')}\\b`, 'i');
    if (locRegex.test(input)) {
      extracted.locality = loc;
      if (!extracted.city) extracted.city = 'Bangalore';
      break;
    }
  }

  // If no known locality was found, look for patterns like "in [Location]", "at [Location]", "[Location] se"
  if (!extracted.locality) {
    const locationPatterns = [
      /(?:in|at|from|near|around|area|locality)\s+([A-Za-z]{3,20}(?:\s+[A-Za-z]{3,20})?)/i,
      /([A-Za-z]{3,20}(?:\s+[A-Za-z]{3,20})?)\s+(?:se|mein|me|ilake|area|rehta|ka)\b/i
    ];
    const ignoreLocWords = new Set([
      'carpenter', 'carpentry', 'painter', 'painting', 'plumber', 'plumbing',
      'electrician', 'electrical', 'years', 'yrs', 'saal', 'varsh', 'phone',
      'mobile', 'number', 'call', 'today', 'work', 'working', 'experience',
      'india', 'the', 'and', 'hai', 'hoon', 'hu'
    ]);
    for (const pat of locationPatterns) {
      const locMatch = input.match(pat);
      if (locMatch && locMatch[1]) {
        let candidate = locMatch[1].trim();
        // Strip trailing noise or known city from two-word candidate
        const words = candidate.split(/\s+/).filter((w) => {
          const wl = w.toLowerCase();
          return !ignoreLocWords.has(wl) && !KNOWN_INDIAN_CITIES.some((c) => c.toLowerCase() === wl);
        });
        candidate = words.join(' ').trim();
        if (candidate.length >= 3) {
          extracted.locality = candidate;
          if (!extracted.city) extracted.city = 'Bangalore';
          break;
        }
      }
    }
  }

  // 5. Pincode extraction (6-digit)
  const pinMatch = input.match(/\b([1-9]\d{5})\b/);
  if (pinMatch && pinMatch[1]) {
    extracted.pincode = pinMatch[1];
  }

  // 6. Name extraction
  if (!extracted.full_name) {
    const stopAndNoiseWords = new Set([
      'hai', 'hain', 'hoon', 'hu', 'ji', 'and', 'aur', 'or', 'from', 'se',
      'in', 'at', 'is', 'am', 'main', 'mein', 'me', 'i', 'my', 'the', 'a', 'an',
      'carpenter', 'carpentry', 'painter', 'painting', 'plumber', 'plumbing',
      'electrician', 'electrical', 'badhai', 'mistri', 'here', 'available',
      'work', 'working', 'live', 'living', 'years', 'yrs', 'saal', 'varsh',
      'mobile', 'phone', 'number', 'contact', 'experience'
    ]);

    const cleanNameCandidate = (raw) => {
      const parts = String(raw || '')
        .replace(/[,.;:!?]/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean);
      const cleaned = [];
      for (const word of parts) {
        if (stopAndNoiseWords.has(word.toLowerCase())) break;
        cleaned.push(word);
      }
      const joined = cleaned.join(' ').trim();
      return joined.length >= 2 ? joined : '';
    };

    const namePatterns = [
      /(?:mera naam|my name is|name is|this is|naam hai|naam)\s+([A-Za-z\u0900-\u097F]{2,25}(?:\s+[A-Za-z\u0900-\u097F]{1,25}){0,2})/i,
      /(?:myself|call me|i am|i'm)\s+([A-Za-z\u0900-\u097F]{2,25}(?:\s+[A-Za-z\u0900-\u097F]{1,25}){0,2})/i
    ];
    for (const pat of namePatterns) {
      const nmMatch = input.match(pat);
      if (nmMatch && nmMatch[1]) {
        const candidate = cleanNameCandidate(nmMatch[1]);
        if (candidate && !KNOWN_BANGALORE_LOCALITIES.some((l) => l.toLowerCase() === candidate.toLowerCase())) {
          extracted.full_name = candidate;
          break;
        }
      }
    }

    // Fallback if user entered a short clean name or comma-first intro (e.g. "Ramesh Kumar" or "Ramesh Kumar, carpenter...")
    const firstChunk = input.split(',')[0].trim();
    if (!extracted.full_name && /^[A-Za-z\u0900-\u097F]{2,20}(?:\s+[A-Za-z\u0900-\u097F]{2,20}){0,2}$/.test(firstChunk)) {
      const candidate = cleanNameCandidate(firstChunk);
      const matchesLocality = KNOWN_BANGALORE_LOCALITIES.some((l) => l.toLowerCase() === candidate.toLowerCase());
      const matchesCity = KNOWN_INDIAN_CITIES.some((c) => c.toLowerCase() === candidate.toLowerCase());
      if (candidate && !matchesLocality && !matchesCity) {
        extracted.full_name = candidate;
      }
    }
  }

  return extracted;
}

/**
 * Calls Gemini API if available to extract entities and generate natural response
 */
async function callGeminiExtractor(messages, currentData, userLang) {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!geminiKey) return null;

  try {
    const prompt = `You are the Carpenterwala Pro Onboarding Voice Assistant for Indian technicians (carpenters, painters, plumbers, electricians).
Carpenterwala provides 0% commission direct customer calls in India (primarily Bengaluru).
Your goal: Conversationally extract these 6 details from the technician:
1. full_name (e.g. "Ramesh Kumar")
2. trade (MUST be one of: "carpentry", "painting", "plumbing", "electrical")
3. city (default "Bangalore" if in India)
4. locality (e.g. "Whitefield", "Koramangala", "HSR Layout")
5. phone_number (10-digit Indian mobile number)
6. experience_years (integer number of years, e.g. 5)

Current known data: ${JSON.stringify(currentData)}
User preferred language: ${userLang === 'hi' ? 'Hindi / Hinglish' : 'English / Indian English'}

Conversation history:
${messages.map((m) => `${m.role === 'user' ? 'Technician' : 'Assistant'}: ${m.content}`).join('\n')}

Output STRICT JSON only:
{
  "extracted": {
    "full_name": string or null,
    "trade": "carpentry" | "painting" | "plumbing" | "electrical" | null,
    "city": string or null,
    "locality": string or null,
    "phone_number": string (10 digits) or null,
    "experience_years": number or null
  },
  "reply": string (Friendly, short, conversational response in ${userLang === 'hi' ? 'Hindi or Hinglish' : 'English'}. If all required details [full_name, trade, locality, phone_number] are present, celebrate that their link is ready! If any are missing, warmly ask for the missing ones in 1 short sentence).
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(6000),
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.2,
            responseMimeType: 'application/json'
          }
        })
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const parsed = JSON.parse(rawText.trim());
    return parsed;
  } catch (err) {
    console.warn('[Gemini Extractor] Fallback to heuristic:', err.message);
    return null;
  }
}

/**
 * Builds friendly, conversational response based on missing fields
 */
function buildConversationalReply(extracted, missing, lang) {
  const isHindi = lang === 'hi';
  const name = extracted.full_name ? (isHindi ? `${extracted.full_name} जी` : extracted.full_name) : '';

  if (missing.length === 0) {
    return isHindi
      ? `शानदार ${name}! आपकी जानकारी दर्ज हो गई है। नीचे दिए गए बटन पर टैप करके सिर्फ़ अपने आधार कार्ड की फ़ोटो अपलोड करें और 0% कमीशन पर सीधे कस्टमर कॉल पाना शुरू करें!`
      : `Awesome ${name}! Your details have been captured. Tap the button below to upload your Aadhaar card and start receiving direct customer calls with 0% commission!`;
  }

  // Handle specific missing combinations
  if (missing.includes('phone_number') && missing.length === 1) {
    return isHindi
      ? `बहुत बढ़िया ${name}! कृपया अपना 10 अंकों का मोबाइल नंबर बताएं ताकि हम आपकी प्रोफ़ाइल एक्टिवेट कर सकें।`
      : `Great ${name}! Please share your 10-digit mobile number so we can activate your profile.`;
  }

  if (missing.includes('trade') && missing.includes('locality')) {
    return isHindi
      ? `नमस्ते ${name || 'साथी'}! आप किस काम में एक्सपर्ट हैं (कारपेंटर, पेंटर, प्लंबर, इलेक्ट्रीशियन) और किस इलाके में काम करते हैं?`
      : `Welcome ${name || 'friend'}! What is your trade (carpentry, painting, plumbing, or electrical) and which area/locality do you work in?`;
  }

  if (missing.includes('trade')) {
    return isHindi
      ? `बहुत अच्छा ${name}! आपका मुख्य काम क्या है? (कारपेंटर, पेंटर, प्लंबर, या इलेक्ट्रीशियन)`
      : `Great ${name}! What is your main trade? (Carpenter, Painter, Plumber, or Electrician)`;
  }

  if (missing.includes('locality')) {
    return isHindi
      ? `धन्यवाद ${name}! आप किस शहर या इलाके में काम करते हैं? (जैसे: व्हाइटफ़ील्ड, कोरमंगला, बैंगलोर)`
      : `Thanks ${name}! Which locality or city do you work in? (e.g. Whitefield, Koramangala, Bangalore)`;
  }

  if (missing.includes('full_name')) {
    return isHindi
      ? `नमस्ते! कृपया अपना शुभ नाम बताएं।`
      : `Hello! Please tell us your full name.`;
  }

  return isHindi
    ? `कृपया अपना नाम, काम, इलाका और 10 अंकों का मोबाइल नंबर बोलकर या लिखकर बताएं।`
    : `Please speak or type your name, trade, locality, and 10-digit mobile number.`;
}

export async function POST(request) {
  try {
    const ip = getClientIp(request);

    // 1. IP-based rate limit: Max 45 chat turns per hour per IP
    const ipWindowCheck = checkWindowRateLimit({
      key: `ai-onboard-chat-ip:${ip}`,
      maxAttempts: 45,
      windowMs: 60 * 60 * 1000
    });

    if (!ipWindowCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          code: 'RATE_LIMIT_EXCEEDED',
          error: 'Too many chat requests from this network. Please wait a few minutes and try again.'
        },
        {
          status: 429,
          headers: buildRateLimitHeaders(ipWindowCheck, 45)
        }
      );
    }

    const body = await request.json();
    const { message = '', messages = [], current_data = {}, lang = 'hi' } = body;

    // Detect if user entered an invalid mobile number (e.g. 10 digits starting with 0-5, or 8-9/11+ digits)
    const rawNumericTokens = String(message || '').match(/\b\d{7,14}\b/g) || [];
    let invalidPhoneProvided = false;
    for (const numTok of rawNumericTokens) {
      // Ignore 6-digit pincodes
      if (numTok.length === 6) continue;
      if (!normalizeIndianPhone(numTok)) {
        invalidPhoneProvided = true;
      }
    }

    // 2. Heuristic Entity Extraction
    const heuristicExtracted = extractEntitiesHeuristically(message, current_data);

    // 3. Try Gemini LLM for enhanced natural understanding if available
    const geminiResult = await callGeminiExtractor(
      [...messages, { role: 'user', content: message }],
      heuristicExtracted,
      lang
    );

    let mergedData = { ...heuristicExtracted };
    let aiReply = null;

    if (geminiResult?.extracted) {
      for (const [key, val] of Object.entries(geminiResult.extracted)) {
        if (val !== null && val !== undefined && val !== '') {
          mergedData[key] = val;
        }
      }
      if (geminiResult.reply) {
        aiReply = geminiResult.reply;
      }
    }

    // Strict Normalizations
    if (mergedData.phone_number) {
      const validPhone = normalizeIndianPhone(mergedData.phone_number);
      if (!validPhone) {
        invalidPhoneProvided = true;
        mergedData.phone_number = '';
      } else {
        mergedData.phone_number = validPhone;
        invalidPhoneProvided = false;
      }
    }
    if (mergedData.trade) {
      mergedData.trade = normalizeTrade(mergedData.trade);
    }
    if (mergedData.pincode) {
      mergedData.pincode = normalizePincode(mergedData.pincode);
    }
    if (!mergedData.city && mergedData.locality) {
      mergedData.city = 'Bangalore';
    }
    if (mergedData.experience_years !== undefined && mergedData.experience_years !== null) {
      const parsedExp = parseInt(String(mergedData.experience_years), 10);
      mergedData.experience_years = !Number.isNaN(parsedExp) ? parsedExp : 1;
    }

    // Check missing mandatory fields: full_name, trade, locality, phone_number
    const missing = [];
    if (!mergedData.full_name || String(mergedData.full_name).trim().length < 2) {
      missing.push('full_name');
    }
    if (!mergedData.trade) {
      missing.push('trade');
    }
    if (!mergedData.locality) {
      missing.push('locality');
    }
    if (!mergedData.phone_number || !/^[6-9]\d{9}$/.test(mergedData.phone_number)) {
      missing.push('phone_number');
    }

    const isComplete = missing.length === 0;

    let onboardingResult = null;
    let initErrorMessage = null;
    let initErrorStatus = 500;

    // 4. When all required details are extracted, enforce phone+IP rate limit & trigger onboarding init
    if (isComplete) {
      const phoneRateCheck = checkRateLimit({
        phone: mergedData.phone_number,
        ip,
        maxAttempts: 5,
        ipMaxAttempts: 25
      });

      if (!phoneRateCheck.allowed) {
        return NextResponse.json(
          {
            success: false,
            code: 'RATE_LIMIT_EXCEEDED',
            error: phoneRateCheck.reason,
            extracted_data: mergedData,
            is_complete: false,
            missing_fields: missing
          },
          {
            status: 429,
            headers: buildRateLimitHeaders(phoneRateCheck, 5)
          }
        );
      }

      const origin = resolveOrigin(request);
      try {
        const initData = {
          phone_number: mergedData.phone_number,
          full_name: mergedData.full_name,
          trade: mergedData.trade,
          city: mergedData.city || 'Bangalore',
          locality: mergedData.locality || mergedData.city || 'Bangalore',
          pincode: mergedData.pincode || null,
          experience_years: mergedData.experience_years || 1,
          email: mergedData.email || null
        };

        const initRes = await initOnboardingSession(initData, origin);
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(initRes.verify_url)}`;

        onboardingResult = {
          session_token: initRes.session_token,
          verify_url: initRes.verify_url,
          qr_code_url: qrCodeUrl,
          expires_at: initRes.expires_at,
          status: initRes.status,
          session: initRes.session
        };
      } catch (initErr) {
        console.error('[AI Onboard Chat] initOnboardingSession error:', initErr);
        initErrorMessage = initErr.message || 'Could not initialize onboarding session.';
        initErrorStatus = initErr.status || 500;
      }
    }

    if (initErrorMessage) {
      return NextResponse.json(
        {
          success: false,
          error: initErrorMessage,
          extracted_data: mergedData,
          is_complete: false,
          missing_fields: missing
        },
        { status: initErrorStatus }
      );
    }

    let finalReply;
    if (isComplete && onboardingResult) {
      finalReply = buildConversationalReply(mergedData, [], lang);
    } else if (invalidPhoneProvided && missing.includes('phone_number')) {
      finalReply =
        lang === 'hi'
          ? 'कृपया सही 10 अंकों का भारतीय मोबाइल नंबर बताएं जो 6, 7, 8 या 9 से शुरू होता हो (जैसे: 9876543210)।'
          : 'Please provide a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9 (e.g. 9876543210).';
    } else {
      finalReply = aiReply || buildConversationalReply(mergedData, missing, lang);
    }

    return NextResponse.json(
      {
        success: true,
        reply: finalReply,
        invalid_phone: invalidPhoneProvided && missing.includes('phone_number'),
        extracted_data: mergedData,
        is_complete: isComplete && Boolean(onboardingResult),
        missing_fields: missing,
        onboarding: onboardingResult
      },
      {
        headers: buildRateLimitHeaders(ipWindowCheck, 45)
      }
    );
  } catch (err) {
    console.error('[POST /api/ai-onboard-chat] Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to process AI onboarding chat message.'
      },
      { status: 500 }
    );
  }
}
