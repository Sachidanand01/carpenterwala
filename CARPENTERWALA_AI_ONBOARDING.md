# Master Walkthrough Blueprint: Carpenterwala Pan-India AI Pro Onboarding
*(Customized for Next.js App Router + JavaScript + Supabase + Vercel)*

## 1. Product Goal & Architecture

Build a frictionless, zero-commission service professional onboarding system for Carpenterwala tailored for non-tech-savvy Android users across India.

* **Tech Stack:** Next.js App Router (JavaScript), Supabase (Postgres + Storage), and Vercel.
* **Zero Connector Friction:** Technicians onboard either through Carpenterwala's built-in AI Onboarding Chat (`/join`) or via ChatGPT's public app directory powered by our Remote MCP Server.
* **Pan-India & Voice-First:** Captures `full_name`, `trade`, `city`, `locality`, `pincode`, `experience_years`, and 10-digit Indian mobile number. Supports Android voice-to-text natively.
* **Dual Handoff (Mobile Deep Link + Desktop QR):**
  * **Android / Mobile Users:** Tap a direct magic link (`/v/[token]`) that opens without login, compresses camera photos automatically, and supports major Indian languages.
  * **Desktop Users:** Scan an inline QR code with their phone camera to open the exact same `/v/[token]` page.

> **Existing code note:** The repo already has an MCP server at `app/api/mcp/route.js`, with
> `lib/mcp/tool-definitions.js` and `lib/mcp/tool-handlers.js`. Phase 3 must **extend** these files
> with the new tools rather than replace them.

## 2. Model Routing (per phase)

1. Start a fresh agent thread for each phase so context stays small.
2. Keep the Browser Agent OFF during Phases 1, 3, 5, and 6. Turn it on only at the end of Phases 2 and 4 to check the mobile UI.

---

## 3. Phase Specs

### Phase 1: Supabase Migration & Next.js Onboarding APIs
Read @CARPENTERWALA_AI_ONBOARDING.md, @AGENTS.md, @supabase_onboarding_update.sql, and @supabase_storage_setup.sql. Execute Phase 1 only.
1. Create a new Supabase SQL migration file `supabase_ai_onboarding.sql` that adds a `pro_onboarding_sessions` table (linked to our existing pro schema via `pro_id`) with:
   - `id` (uuid pk), `session_token` (unique short code), `pro_id` (bigint fk to `profiles.id`), `phone_number` (10-digit Indian mobile, required), `email` (nullable), `full_name`, `trade` (carpentry, painting, plumbing, electrical), `city`, `locality`, `pincode`, `experience_years` (int), `aadhaar_front_url`, `aadhaar_back_url`, `pan_front_url`, `pan_back_url`, `voter_driving_front_url`, `voter_driving_back_url`, `police_verification_url`, `portfolio_urls` (jsonb), `status` (`PENDING_UPLOAD`, `VERIFIED`, `EXPIRED`), and `expires_at` (now() + interval '60 minutes').
2. Using our existing Supabase client in `@lib/`, build Next.js App Router API routes (in JavaScript):
   - `app/api/onboarding/init/route.js`: Accepts chat-extracted details, creates/updates a `PENDING_UPLOAD` row, and returns `{ session_token, verify_url }`.
   - `app/api/onboarding/status/[token]/route.js`: Returns current session details and status.
   - `app/api/onboarding/complete/route.js`: Saves uploaded Supabase Storage paths, marks status `VERIFIED`, and syncs the pro profile.

### Phase 2: Non-Tech-Savvy Android Upload Page (`app/v/[token]/page.js`)
Build a super-simple, mobile-first Next.js page at `app/v/[token]/page.js` (JavaScript):
1. Auto-validate `[token]` on load with zero login friction. Display a welcoming banner with their pre-filled details.
2. Add a prominent top language toggle (**English | हिन्दी | ಕನ್ನಡ | தமிழ் | తెలుగు | मराठी | বাংলা**) that translates all headings, instructions, and buttons dynamically.
3. Build large tap cards: Aadhaar Card Front, Aadhaar Card Back, PAN Card, Voter ID / Driving Licence, Police Verification, and 2 Photos of Past Work.
4. Use `<input type="file" accept="image/*">` for native Camera/Gallery access. Add client-side HTML5 Canvas compression so photos are resized under 600KB before uploading to Supabase Storage.
5. Add a "Submit & Activate 0% Commission Profile" button calling `POST /api/onboarding/complete`, followed by a success screen.

### Phase 3: Next.js Remote MCP Endpoint (`app/api/mcp/route.js`)
1. Expose tool `start_carpenterwala_onboarding`:
   - Inputs: `phone_number` (required 10-digit Indian mobile), `email` (optional), `full_name`, `trade`, `city`, `locality`, `pincode`, `experience_years`.
   - Calls our onboarding init logic to generate `session_token` and `verify_url`.
   - Returns a dual-handoff response: a mobile-first clickable link ("Tap Here to Upload") and a desktop-friendly QR code of `verify_url`.
2. Expose tool `check_onboarding_status`:
   - Inputs: `session_token` (or `phone_number`).
   - Polls session status and welcomes the pro once `VERIFIED`.

### Phase 4: Zero-Setup Web Voice AI Onboarding Page (`app/join/page.js`)
Build a zero-setup AI onboarding chat page at `app/join/page.js` (and backend `app/api/ai-onboard-chat/route.js`):
1. Build a clean mobile chat UI with a large microphone button (Web Speech API supporting `en-IN` and `hi-IN`) so handymen can speak their details.
2. Have `POST /api/ai-onboard-chat` extract details conversationally in 2–3 turns, then trigger `POST /api/onboarding/init`.
3. Render the clickable upload button/QR code inline in the chat, and auto-poll status when they finish.

### Phase 5: Automated Terminal End-to-End Test
Write a Node.js integration test script in `scripts/test-ai-onboarding.mjs` that tests our Next.js endpoints end-to-end via terminal:
1. Calls `start_carpenterwala_onboarding` via `/api/mcp` for pros in different cities.
2. Verifies `verify_url` and QR payload.
3. Calls `POST /api/onboarding/complete` with mock Supabase storage URLs.
4. Calls `check_onboarding_status` and asserts status transitions to `VERIFIED`.

### Phase 6: Security & Production Hardening
Read @supabase_secure_production_schema.sql. Audit `/api/onboarding/*`, `/api/mcp`, `/api/ai-onboard-chat`, and `/v/[token]` for production readiness on Vercel + Supabase:
1. Add IP-based rate limiting (reuse `lib/rate-limiter.js`) and strict 10-digit Indian mobile validation.
2. Enforce strict file validation (JPEG/PNG/WebP, max 2MB) and Supabase Storage RLS policies so Aadhaar documents are stored in a private bucket accessible only to admins.
3. Ensure expired tokens (> 60 mins) show a localized "Link Expired" message.
4. Configure CORS headers on `/api/mcp` for ChatGPT App Directory review.

---

## 4. Phase 7: Directory Submission Checklist & Launch

Once Phases 1–6 are deployed on Vercel (`https://carpenterwala.com`):

1. **Immediately launch `/join`:** Start driving traffic to `https://carpenterwala.com/join`.
2. **Prepare directory assets:** Ensure `/privacy-policy` and `/terms` are live. Make the `start_carpenterwala_onboarding` tool description clear about target users. Have a test phone number ready for reviewers.
3. **Submit to OpenAI's ChatGPT App Directory:** OpenAI Developer Portal → Apps / MCP Submissions. Enter the MCP URL, select No Auth / Session-Based Auth, and submit screenshots.
4. **Submit to Anthropic's Claude Connectors Directory:** Anthropic Console → Connectors / MCP Directory. Paste the MCP URL and submit.

---

## 5. Implementation Status & Production Checklist

| Phase | Deliverable | Status |
|-------|-------------|--------|
| **Phase 1** | Supabase schema (`pro_onboarding_sessions`, `profiles` columns, indexes) & Onboarding APIs (`/api/onboarding/init`, `/status/[token]`, `/complete`) | ✅ Completed & Live in Supabase |
| **Phase 2** | Mobile-first Android upload page (`app/v/[token]/page.js` + `translations.js`) with 7 Indian languages & HTML5 Canvas compression (`< 600KB`) | ✅ Completed |
| **Phase 3** | Remote MCP endpoint (`app/api/mcp/route.js`) exposing `start_carpenterwala_onboarding` & `check_onboarding_status` with mobile link + QR handoff | ✅ Completed |
| **Phase 4** | Zero-setup web voice AI onboarding page (`/join` + `/api/ai-onboard-chat`) using native Web Speech API (`en-IN`, `hi-IN`) & local bilingual parser | ✅ Completed |
| **Phase 5** | Automated terminal end-to-end test (`scripts/test-ai-onboarding.mjs`) across 3 cities + Phase 6 assertions | ✅ Completed & Passing |
| **Phase 6** | Security & production hardening: IP + 24h DB rate limits, strict 10-digit Indian mobile validation, JPEG/PNG/WebP ≤ 2MB validation, private `kyc-documents` bucket with admin-only RLS, 60-min localized expiry, `/api/mcp` CORS headers, `public_profiles` `security_invoker = true` | ✅ Completed & Applied |
| **Phase 7** | Directory submission readiness (`/privacy` + `/privacy-policy` redirect, `/terms`, `NEXT_PUBLIC_SITE_URL`, production deploy) | ✅ Ready for OpenAI & Anthropic Submission |

> **Important Production Note (`GEMINI_API_KEY`):** Keep `GEMINI_API_KEY` **unset** in production. `/join` uses native browser Web Speech API + the local bilingual entity extractor in `app/api/ai-onboard-chat/route.js` (zero external LLM dependency, zero cost, and no third-party PII sharing).
