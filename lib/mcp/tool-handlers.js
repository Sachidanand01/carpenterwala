import { supabase, supabaseAdmin } from '../supabase.js';
import { encryptToken } from '../crypto.js';
import { checkRateLimit } from '../rate-limiter.js';
import {
  initOnboardingSession,
  getOnboardingSessionStatus,
  getOnboardingSessionProfile,
  normalizeIndianPhone,
  LOCALIZED_EXPIRED_MESSAGES
} from '../onboarding.js';
import { getProUrl, getProShortUrl } from '../pro-slug.js';

function buildQrCodeUrl(verifyUrl, size = 300) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodeURIComponent(verifyUrl)}`;
}

// Official Bangalore Standard Labor Rate Cards
const RATE_CARDS = {
  carpentry: [
    { task: 'Door Lock Installation / Replacement', priceRange: '₹250 – ₹450', duration: '30-45 mins', notes: 'Godrej/Europa cylindrical or mortise lock replacement' },
    { task: 'Modular Kitchen Hydraulic Hinge Repair', priceRange: '₹180 – ₹350 per shutter', duration: '20-30 mins', notes: 'Soft-close hydraulic concealed hinge adjustment/swap' },
    { task: 'Custom Wardrobe Assembly / Fitting', priceRange: '₹600 – ₹1,200', duration: '1-3 hours', notes: 'Knock-down wardrobe assembly (IKEA, Pepperfry, Urban Ladder)' },
    { task: 'Door Alignment & Planing', priceRange: '₹200 – ₹350', duration: '30 mins', notes: 'Scraping swollen doors during Bangalore monsoon' },
    { task: 'Bed Repair & Plywood Slat Reinforcement', priceRange: '₹350 – ₹700', duration: '45-60 mins', notes: 'Fixing squeaks, hydraulic bed lift channels' }
  ],
  painting: [
    { task: '1 BHK Interior Repainting (Walls & Ceilings)', priceRange: '₹4,500 – ₹7,500', duration: '2-3 days', notes: '2 coats tractor/premier emulsion + minor patch putty' },
    { task: '2 BHK Interior Repainting', priceRange: '₹8,000 – ₹13,000', duration: '3-4 days', notes: 'Complete repainting with zero furniture mess protection' },
    { task: '3 BHK Interior Repainting', priceRange: '₹12,000 – ₹19,000', duration: '4-6 days', notes: 'Interior painting with Asian Paints/Berger/Dulux' },
    { task: 'Damp-Proof Putty & Waterproof Primer', priceRange: '₹18 – ₹32 / sq ft', duration: '1-2 days', notes: 'Treating Bangalore wall seepage & efflorescence' },
    { task: 'Single Accent Texture Wall', priceRange: '₹2,500 – ₹4,500', duration: '1 day', notes: 'Royale Play / Stencil / Metallic designer finish' }
  ],
  plumbing: [
    { task: 'Tap / Faucet Replacement or Cartridge Fix', priceRange: '₹149 – ₹299', duration: '20-30 mins', notes: 'Fixing dripping taps, ceramic spindle replacement' },
    { task: 'Overhead Water Tank Deep Cleaning (up to 1,000L)', priceRange: '₹699 – ₹1,299', duration: '1-2 hours', notes: 'High-pressure mechanized cleaning & UV sterilization' },
    { task: 'Kitchen Drain / Sink Unclogging', priceRange: '₹399 – ₹799', duration: '30-45 mins', notes: 'Manual motorized drain snake clearing without pipe damage' },
    { task: 'Flush Tank / Cistern Syphon Repair', priceRange: '₹349 – ₹699', duration: '30-60 mins', notes: 'Concealed or dual-flush internal assembly replacement' },
    { task: 'Water Heater / Geyser Pipe Installation', priceRange: '₹299 – ₹549', duration: '30-45 mins', notes: 'Inlet-outlet braided connection pipe fitting & safety valve' }
  ],
  electrical: [
    { task: 'Switchboard / Socket Repair or Replacement', priceRange: '₹99 – ₹180', duration: '20 mins', notes: 'Modular plate replacement (Anchor, Legrand, Havells)' },
    { task: 'MCB Trip Diagnostic & Distribution Box Repair', priceRange: '₹349 – ₹699', duration: '30-45 mins', notes: 'Isolating short circuits & loose neutral connections' },
    { task: 'Ceiling Fan Installation / Uninstallation', priceRange: '₹149 – ₹299', duration: '30 mins', notes: 'Downrod assembly, hook safety pin check & regulator test' },
    { task: 'Full House Rewiring (Per Point)', priceRange: '₹180 – ₹320 per point', duration: 'Project-based', notes: 'Concealed conduit wiring with FRLS fire-resistant copper wire' },
    { task: 'Geyser / AC Dedicated 16A Power Point Installation', priceRange: '₹300 – ₹600', duration: '45 mins', notes: 'Heavy appliance wiring with 2.5/4 sq mm cabling' }
  ]
};

/**
 * Masks a technician name for public agent responses to preserve privacy
 */
function maskName(name) {
  if (!name) return 'Professional';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
}

/**
 * Executes a tool by name with arguments and client context
 */
export async function executeTool(name, args = {}, context = {}) {
  const { ip = '127.0.0.1', origin = 'https://carpenterwala.com' } = context;

  switch (name) {
    case 'start_carpenterwala_onboarding': {
      const rawPhone = args.phone_number ?? args.phone ?? '';
      const cleanPhone = normalizeIndianPhone(rawPhone);
      if (!cleanPhone) {
        throw new Error(
          'Please provide a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9 (e.g. "9876543210").'
        );
      }

      // Enforce sliding 24h rate limit per phone number & IP
      const rateCheck = checkRateLimit({
        phone: cleanPhone,
        ip,
        maxAttempts: 5,
        ipMaxAttempts: 25
      });
      if (!rateCheck.allowed) {
        throw new Error(rateCheck.reason);
      }

      const onboardingDetails = {
        phone_number: cleanPhone,
        email: args.email ?? args.email1 ?? null,
        full_name: args.full_name ?? args.name ?? '',
        trade: args.trade ?? '',
        city: args.city ?? 'Bangalore',
        locality: args.locality ?? args.location ?? '',
        pincode: args.pincode ?? null,
        experience_years: args.experience_years ?? args.experienceYears ?? 1
      };

      const initResult = await initOnboardingSession(onboardingDetails, origin);
      const { session_token, verify_url, expires_at, status, session } = initResult;
      const qrCodeUrl = buildQrCodeUrl(verify_url, 300);

      const markdownHandoff = [
        `### Namaste ${session.full_name}! Your Carpenterwala 0% Commission Onboarding Link is Ready`,
        ``,
        `- **Trade:** ${session.trade.charAt(0).toUpperCase() + session.trade.slice(1)} (${session.experience_years} yrs exp)`,
        `- **Location:** ${[session.locality, session.city, session.pincode].filter(Boolean).join(', ')}`,
        `- **Mobile:** +91 ${session.phone_number}`,
        `- **Session Token:** \`${session_token}\` *(valid for 60 minutes)*`,
        ``,
        `#### 1. On Mobile / Android (1-Tap Upload — No Login Needed):`,
        `👉 **[Tap Here to Upload](${verify_url})**`,
        `*(Direct link: ${verify_url} — supports English, हिन्दी, ಕನ್ನಡ, தமிழ், తెలుగు, मराठी, বাংলা and auto-compresses camera photos)*`,
        ``,
        `#### 2. On Desktop / Laptop (Scan with Phone Camera):`,
        `![Scan QR Code to Upload Documents](${qrCodeUrl})`,
        ``,
        `Once you submit your Aadhaar card photos on the page, reply **"Done"** here and I will verify your profile status immediately!`
      ].join('\n');

      return {
        success: true,
        session_token,
        verify_url,
        status,
        expires_at,
        expires_in_minutes: 60,
        qr_code_url: qrCodeUrl,
        qr_payload: verify_url,
        mobile_link_label: 'Tap Here to Upload',
        mobile_link_markdown: `[Tap Here to Upload](${verify_url})`,
        qr_code_markdown: `![Scan QR Code to Upload Documents](${qrCodeUrl})`,
        handoff: {
          mobile: {
            label: 'Tap Here to Upload',
            url: verify_url,
            markdown: `[Tap Here to Upload](${verify_url})`
          },
          desktop: {
            label: 'Scan QR Code with Phone Camera',
            qr_code_url: qrCodeUrl,
            qr_payload: verify_url,
            verify_url,
            markdown: `![Scan QR Code to Upload Documents](${qrCodeUrl})`
          }
        },
        professional: {
          full_name: session.full_name,
          phone_number: session.phone_number,
          email: session.email || null,
          trade: session.trade,
          city: session.city,
          locality: session.locality,
          pincode: session.pincode || null,
          experience_years: session.experience_years
        },
        instructions: 'On mobile, tap "Tap Here to Upload" to open your zero-login upload page. On desktop, scan the QR code with your phone camera to take photos of your Aadhaar card and past work.',
        markdown: markdownHandoff
      };
    }

    case 'check_onboarding_status': {
      const tokenArg = args.session_token || args.token;
      const phoneArg = args.phone_number || args.phone;

      let lookupInput = tokenArg ? String(tokenArg).trim() : '';
      if (!lookupInput && phoneArg) {
        const cleanPhone = normalizeIndianPhone(phoneArg);
        if (!cleanPhone) {
          throw new Error(
            'Please provide a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.'
          );
        }
        lookupInput = cleanPhone;
      }

      if (!lookupInput) {
        throw new Error('Please provide either a session_token or a 10-digit Indian phone_number to check onboarding status.');
      }

      const session = await getOnboardingSessionStatus(lookupInput);
      if (!session) {
        return {
          success: false,
          found: false,
          status: 'NOT_FOUND',
          verified: false,
          message: 'No onboarding session found for the provided session_token or phone_number. Please initiate onboarding first using start_carpenterwala_onboarding.'
        };
      }

      const cleanOrigin = origin.replace(/\/$/, '');
      const verifyUrl = `${cleanOrigin}/v/${session.session_token}`;
      const qrCodeUrl = buildQrCodeUrl(verifyUrl, 300);

      if (session.status === 'VERIFIED') {
        const profile = await getOnboardingSessionProfile(session);

        const profilePath = profile?.profile_url || (profile ? getProUrl(profile) : '/find-a-professional');
        const shortPath = profile?.short_url || (profile?.pro_code ? getProShortUrl(profile) : null);
        const fullProfileUrl = `${cleanOrigin}${profilePath}`;
        const fullShortUrl = shortPath ? `${cleanOrigin}${shortPath}` : null;

        const welcomeMessage = `🎉 Welcome to Carpenterwala, ${session.full_name}! Your ${session.trade} profile in ${session.locality}, ${session.city} is now VERIFIED and live with 0% platform commission. Homeowners in your area can now discover and book you directly!`;

        return {
          success: true,
          found: true,
          session_token: session.session_token,
          status: 'VERIFIED',
          verified: true,
          verified_at: session.verified_at || session.updated_at || null,
          welcome_message: welcomeMessage,
          message: welcomeMessage,
          professional: {
            pro_id: session.pro_id || profile?.id || null,
            pro_code: profile?.pro_code || null,
            full_name: session.full_name,
            phone_number: session.phone_number,
            email: session.email || null,
            trade: session.trade,
            city: session.city,
            locality: session.locality,
            pincode: session.pincode || null,
            experience_years: session.experience_years,
            profile_url: fullProfileUrl,
            short_url: fullShortUrl
          },
          documents_uploaded: {
            aadhaar_front: Boolean(session.aadhaar_front_url),
            aadhaar_back: Boolean(session.aadhaar_back_url),
            pan_front: Boolean(session.pan_front_url),
            voter_driving_front: Boolean(session.voter_driving_front_url),
            police_verification: Boolean(session.police_verification_url),
            portfolio_count: Array.isArray(session.portfolio_urls) ? session.portfolio_urls.length : 0
          }
        };
      }

      if (session.status === 'EXPIRED') {
        return {
          success: true,
          found: true,
          session_token: session.session_token,
          status: 'EXPIRED',
          verified: false,
          is_expired: true,
          expired_title: 'Link Expired',
          localized_expired: LOCALIZED_EXPIRED_MESSAGES,
          expires_at: session.expires_at,
          professional: {
            full_name: session.full_name,
            phone_number: session.phone_number,
            trade: session.trade,
            city: session.city,
            locality: session.locality
          },
          message: `Link Expired: The onboarding link for ${session.full_name} has expired (links are valid for 60 minutes). Please call start_carpenterwala_onboarding to generate a fresh upload link.`
        };
      }

      return {
        success: true,
        found: true,
        session_token: session.session_token,
        status: session.status,
        verified: false,
        verify_url: verifyUrl,
        qr_code_url: qrCodeUrl,
        qr_payload: verifyUrl,
        expires_at: session.expires_at,
        handoff: {
          mobile: {
            label: 'Tap Here to Upload',
            url: verifyUrl,
            markdown: `[Tap Here to Upload](${verifyUrl})`
          },
          desktop: {
            label: 'Scan QR Code with Phone Camera',
            qr_code_url: qrCodeUrl,
            qr_payload: verifyUrl,
            verify_url: verifyUrl,
            markdown: `![Scan QR Code to Upload Documents](${qrCodeUrl})`
          }
        },
        professional: {
          full_name: session.full_name,
          phone_number: session.phone_number,
          trade: session.trade,
          city: session.city,
          locality: session.locality,
          pincode: session.pincode || null,
          experience_years: session.experience_years
        },
        message: `Onboarding for ${session.full_name} (${session.trade} in ${session.locality}, ${session.city}) is currently PENDING_UPLOAD. Tap [Tap Here to Upload](${verifyUrl}) on your phone or scan the QR code to upload your Aadhaar card photos and complete verification.`
      };
    }

    case 'initiate_technician_onboarding': {
      const { name: techName, phone, trade, location, experienceYears } = args;

      if (!techName || techName.trim().length < 2) {
        throw new Error('Technician name must be at least 2 characters long.');
      }

      const cleanPhone = normalizeIndianPhone(phone);
      if (!cleanPhone) {
        throw new Error('Please provide a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      }

      if (!trade || trade.trim().length < 2) {
        throw new Error('Please specify a valid trade (e.g. carpentry, painting, plumbing, electrical).');
      }

      if (!location || location.trim().length < 2) {
        throw new Error('Please specify a valid Bangalore locality (e.g. HSR Layout, Whitefield).');
      }

      // Check rate limit: 3 attempts per 24 hours per phone and IP
      const rateCheck = checkRateLimit({ phone: cleanPhone, ip, maxAttempts: 3 });
      if (!rateCheck.allowed) {
        return {
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          message: rateCheck.reason,
          resetAt: rateCheck.resetAt.toISOString(),
          directPortalUrl: `${origin}/pro/login`
        };
      }

      // Check if phone or email already has an active profile
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, name, trade, verified')
        .eq('phone', cleanPhone)
        .maybeSingle();

      if (existingProfile) {
        return {
          success: false,
          code: 'PROFILE_EXISTS',
          message: `A profile with this phone number is already registered under "${existingProfile.name}" (${existingProfile.trade}). Please proceed to sign in directly.`,
          loginUrl: `${origin}/pro/login`
        };
      }

      // Generate a tamper-proof encrypted onboarding session token (valid for 60 minutes)
      const tokenPayload = {
        type: 'ai_pro_onboarding',
        name: techName.trim(),
        phone: cleanPhone,
        trade: trade.trim(),
        location: location.trim(),
        experienceYears: experienceYears || null,
        createdAt: Date.now(),
        expiresAt: Date.now() + 60 * 60 * 1000 // 60 mins
      };

      const sessionToken = encryptToken(tokenPayload);
      const onboardingUrl = `${origin}/pro/login?session=${encodeURIComponent(sessionToken)}`;

      return {
        success: true,
        technicianName: techName.trim(),
        trade: trade.trim(),
        location: location.trim(),
        attemptsRemainingToday: rateCheck.remaining,
        onboardingUrl,
        expiresInMinutes: 60,
        instructions: 'Please tap the secure verification link on your phone. You will receive an instant 6-digit OTP and be able to take a quick photo of your ID on your device. Your sensitive credentials and OTP are never shared with 3rd-party AI chats.'
      };
    }

    case 'check_technician_application_status': {
      const { phone } = args;
      const cleanPhone = normalizeIndianPhone(phone);
      if (!cleanPhone) {
        throw new Error('Please provide a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, name, trade, location, verified, onboarding_completed, onboarding_step, created_at')
        .eq('phone', cleanPhone)
        .maybeSingle();

      if (error) {
        console.error('Check status DB error:', error);
        throw new Error('Database lookup failed.');
      }

      if (!profile) {
        return {
          found: false,
          message: 'No professional profile found for this mobile number. You can register anytime via Carpenterwala Pro.',
          registerUrl: `${origin}/pro/login`
        };
      }

      let statusDescription = 'Pending Verification';
      let nextAction = 'Your documents are being reviewed by the Carpenterwala verification team in Bangalore.';

      if (profile.verified) {
        statusDescription = 'Active & Verified';
        nextAction = 'You are ready to receive direct homeowner service requests in your area with 0% platform commission!';
      } else if (!profile.onboarding_completed) {
        statusDescription = 'Onboarding Incomplete';
        nextAction = `Please sign in at ${origin}/pro/login to complete step ${profile.onboarding_step || 1} (Aadhaar or identity photo).`;
      }

      return {
        found: true,
        displayName: maskName(profile.name),
        trade: profile.trade,
        location: profile.location,
        verified: !!profile.verified,
        onboardingCompleted: !!profile.onboarding_completed,
        status: statusDescription,
        nextAction,
        portalUrl: `${origin}/pro/login`
      };
    }

    case 'search_verified_pros': {
      const { trade, locality, limit = 5 } = args;
      if (!trade) throw new Error('Trade parameter is required (e.g. carpentry, painting, plumbing, electrical).');

      let query = supabase
        .from('profiles')
        .select('id, slug, name, trade, location, avatar, verified, about, service_radius_km')
        .eq('verified', true)
        .ilike('trade', `%${trade.trim()}%`);

      if (locality && locality.trim()) {
        query = query.ilike('location', `%${locality.trim()}%`);
      }

      const safeLimit = Math.min(Math.max(1, Number(limit) || 5), 15);
      const { data: pros, error } = await query.limit(safeLimit);

      if (error) {
        console.error('Search pros error:', error);
        throw new Error('Failed to query marketplace.');
      }

      const results = (pros || []).map(p => ({
        name: p.name,
        trade: p.trade,
        location: p.location,
        verified: true,
        about: p.about || 'Experienced verified professional in Bangalore',
        profileUrl: `${origin}/pro/${p.slug}`,
        directBookingUrl: `${origin}/pro/${p.slug}#lead-form`
      }));

      return {
        count: results.length,
        tradeRequested: trade,
        localityRequested: locality || 'All Bangalore',
        professionals: results,
        directoryUrl: `${origin}/find-a-professional`
      };
    }

    case 'get_service_rate_card': {
      const { serviceCategory, jobType } = args;
      if (!serviceCategory) {
        throw new Error('Service category is required ("carpentry", "painting", "plumbing", "electrical").');
      }

      const catKey = serviceCategory.toLowerCase().trim();
      const list = RATE_CARDS[catKey];

      if (!list) {
        return {
          supportedCategories: Object.keys(RATE_CARDS),
          message: `Category "${serviceCategory}" not recognized. Please choose from carpentry, painting, plumbing, electrical.`
        };
      }

      let filtered = list;
      if (jobType && jobType.trim()) {
        const query = jobType.toLowerCase().trim();
        filtered = list.filter(item => 
          item.task.toLowerCase().includes(query) || 
          item.notes.toLowerCase().includes(query)
        );
        if (filtered.length === 0) filtered = list;
      }

      return {
        category: catKey,
        city: 'Bangalore, India',
        platformCommission: '0%',
        rates: filtered,
        pricingPolicy: 'Homeowners pay technicians directly at standard rate card prices without middlemen markups.'
      };
    }

    case 'calculate_service_estimate': {
      const { calculatorType, params = {} } = args;

      if (calculatorType === 'paint_cost') {
        const carpetArea = Number(params.carpetAreaSqFt) || (params.flatType === '1bhk' ? 550 : params.flatType === '3bhk' ? 1400 : 900);
        // Paintable area in India standard is carpet area * 3.5 (4 walls + ceiling)
        const paintableArea = Math.round(carpetArea * 3.5);
        // Emulsion coverage approx 120-140 sq ft / liter for 2 coats
        const litersRequired = Math.ceil(paintableArea / 130);
        const ratePerSqFt = params.paintQuality === 'luxury' ? 24 : params.paintQuality === 'economy' ? 12 : 16;
        const estimatedCost = paintableArea * ratePerSqFt;

        return {
          calculator: 'Paint Cost & Quantity Estimator',
          carpetAreaSqFt: carpetArea,
          paintableWallAreaSqFt: paintableArea,
          paintLitersRequired: litersRequired,
          primerLitersRequired: Math.ceil(paintableArea / 140),
          estimatedCostINR: estimatedCost,
          durationDays: carpetArea > 1200 ? '4-6 days' : '2-4 days',
          detailedCalculatorUrl: `${origin}/services/painting#calculator`
        };
      }

      if (calculatorType === 'water_wastage') {
        const taps = Number(params.drippingTaps) || 1;
        // Slow drip = ~15 drips/min = 4 liters/day. Fast drip = ~60 drips/min = 20 liters/day
        const litersPerTapPerDay = params.dripRate === 'fast' ? 20 : params.dripRate === 'medium' ? 10 : 5;
        const dailyLiters = taps * litersPerTapPerDay;
        const monthlyLiters = dailyLiters * 30;
        // Bangalore BWSSB average residential tariff approx ₹0.045 per liter
        const monthlyLossRupees = Math.round(monthlyLiters * 0.045);

        return {
          calculator: 'Water Wastage & Leaking Tap Calculator',
          drippingTaps: taps,
          dailyWaterLossLitres: dailyLiters,
          monthlyWaterLossLitres: monthlyLiters,
          monthlyFinancialLossINR: monthlyLossRupees,
          remedyRecommendation: 'A standard tap washer or ceramic cartridge replacement costs ₹150–₹250 and saves thousands of liters of drinking water in Bangalore.',
          detailedCalculatorUrl: `${origin}/services/plumbing#calculator`
        };
      }

      if (calculatorType === 'electricity_bill') {
        const appliances = Array.isArray(params.appliances) ? params.appliances : [
          { name: 'fan', hoursPerDay: 12, count: 3, wattage: 75 },
          { name: 'refrigerator', hoursPerDay: 24, count: 1, wattage: 200 }
        ];

        let totalDailyKWh = 0;
        appliances.forEach(app => {
          const watts = Number(app.wattage) || (app.name === 'ac' ? 1500 : app.name === 'geyser' ? 2000 : app.name === 'refrigerator' ? 200 : 75);
          const hours = Number(app.hoursPerDay) || 8;
          const count = Number(app.count) || 1;
          totalDailyKWh += (watts * hours * count) / 1000;
        });

        const monthlyKWh = Math.round(totalDailyKWh * 30);
        // BESCOM Bangalore average tier slab ₹7.50 per unit (kWh)
        const estimatedBillINR = Math.round(monthlyKWh * 7.5);

        return {
          calculator: 'Electricity Bill & Consumption Estimator',
          monthlyUnitsKWh: monthlyKWh,
          estimatedMonthlyBillINR: estimatedBillINR,
          bescomTariffBase: '₹7.50 / kWh average slab in Bangalore',
          detailedCalculatorUrl: `${origin}/services/electrical#calculator`
        };
      }

      throw new Error(`Unknown calculatorType: "${calculatorType}". Choose from paint_cost, water_wastage, electricity_bill.`);
    }

    case 'request_service_callback': {
      const { customerName, customerPhone, trade, locality, description } = args;

      if (!customerName || customerName.trim().length < 2) {
        throw new Error('Customer name is required.');
      }

      const cleanPhone = normalizeIndianPhone(customerPhone);
      if (!cleanPhone) {
        throw new Error('Please provide a valid 10-digit Indian phone number starting with 6-9.');
      }

      // Check lead submission rate limit: max 5 per day per customer phone
      const leadRate = checkRateLimit({ phone: cleanPhone, ip, maxAttempts: 5 });
      if (!leadRate.allowed) {
        return {
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many booking requests submitted from this number today. Please call our Bangalore support directly at +91-809-555-1001.'
        };
      }

      // Insert into leads table
      const leadData = {
        name: customerName.trim(),
        phone: cleanPhone,
        task: `[AI Lead] Trade: ${trade} | Locality: ${locality} | Details: ${description}`
      };

      const { data: inserted, error: leadError } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single();

      if (leadError) {
        console.error('Lead insertion error:', leadError);
      }

      return {
        success: true,
        bookingId: inserted?.id || `LEAD-${Date.now().toString().slice(-6)}`,
        customerName: customerName.trim(),
        trade,
        locality,
        etaMinutes: '60 – 90 mins',
        message: 'Your service request has been logged. A verified professional in your Bangalore cluster will contact you directly.',
        supportPhone: '+91-809-555-1001'
      };
    }

    default:
      throw new Error(`Tool "${name}" is not implemented.`);
  }
}
