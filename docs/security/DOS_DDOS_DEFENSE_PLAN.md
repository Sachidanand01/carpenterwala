# CarpenterWala — Comprehensive DoS/DDoS Defense & Origin Hardening Plan
**Target Architecture:** Next.js 16 (Vercel) + Supabase PostgreSQL + Cloudflare Edge (Free Tier)  
**Budget / Cost:** **$0 / Month** (Leveraging Cloudflare Free, Upstash Redis Free, & Free Webhooks)  
**Status:** Pre-Implementation Readiness & Architecture Specification  
**Document Location:** `docs/security/DOS_DDOS_DEFENSE_PLAN.md`

---

## 1. Threat Model & Critical Vulnerability Vectors

For CarpenterWala (`carpenterwala.com`), DoS/DDoS attacks are not merely about raw bandwidth flooding (Layer 3/4); they also manifest as high-impact application-layer (Layer 7) and economic attacks:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     CARPENTERWALA THREAT VECTORS                                 │
├─────────────────────────┬───────────────────────────────────┬────────────────────────────────────┤
│ Attack Type             │ Target Endpoints / Assets         │ Business & Infrastructure Impact   │
├─────────────────────────┼───────────────────────────────────┼────────────────────────────────────┤
│ 1. SMS/OTP Toll Fraud   │ /api/customer/otp                 │ Depletes SMS balance ($), causes   │
│    & Bombing (L7)       │ /api/pro/otp                      │ provider account suspension.       │
├─────────────────────────┼───────────────────────────────────┼────────────────────────────────────┤
│ 2. Lead & Review Spam   │ /api/leads                        │ Pollutes database, triggers emails │
│    (Form Automation)    │ /api/reviews                      │ via Resend, exhausts pro quotas.   │
├─────────────────────────┼───────────────────────────────────┼────────────────────────────────────┤
│ 3. Heavy DB / CPU       │ /api/pro/verify-doc (Sharp OCR)   │ Maxes out Vercel Serverless CPU,   │
│    Exhaustion           │ /[proSlug], /api/blog/comments    │ exhausts Supabase pooler (PGBouncer)│
├─────────────────────────┼───────────────────────────────────┼────────────────────────────────────┤
│ 4. Direct Origin Bypass │ *.vercel.app domain or direct     │ Bypasses any Cloudflare rules or   │
│                         │ CNAME/IP traffic                  │ rate limits completely.            │
├─────────────────────────┼───────────────────────────────────┼────────────────────────────────────┤
│ 5. Volumetric Edge Flood│ Entire site HTTP/HTTPS GET flood  │ Incurring huge Vercel function     │
│    (L3/L4 & L7 floods)  │                                   │ execution bills or site downtime.  │
└─────────────────────────┴───────────────────────────────────┴────────────────────────────────────┘
```

---

## 2. Layer 1: Edge CDN & WAF Architecture (Cloudflare Free Tier)

Cloudflare acts as the defensive perimeter. On the Free Plan, CarpenterWala gains access to unmetered DDoS mitigation, 1 Custom WAF Rule, 1 Rate Limiting Rule, Bot Fight Mode, and Cloudflare Turnstile.

### Step-by-Step Cloudflare Setup Checklist

1. **DNS Onboarding & Proxy Activation:**
   - Change your Domain Registrar’s nameservers to Cloudflare.
   - In Cloudflare DNS records:
     - Set `@` (carpenterwala.com) `CNAME` pointing to `cname.vercel-dns.com` with **Proxy status: PROXIED (Orange Cloud)**.
     - Set `www` `CNAME` pointing to `carpenterwala.com` with **Proxy status: PROXIED**.
   - **Crucial Rule:** Verify that the Orange Cloud is toggled ON for all web traffic records. Gray-clouded records reveal the origin.

2. **SSL/TLS Encryption Mode:**
   - Navigate to **SSL/TLS > Overview**.
   - Select **Full (Strict)**.
   - Enable **Always Use HTTPS** and **Automatic HTTPS Rewrites**.
   - Enable **Minimum TLS Version: TLS 1.2**.
   - Enable **HTTP/3 (with QUIC)** and **0-RTT Connection Resumption** for performance.

3. **Bot Fight Mode & Security Level:**
   - In Cloudflare dashboard: **Security > Bots** -> Toggle **Bot Fight Mode** to **ON**.
     - This automatically challenges known scrapers and suspicious headless browsers before they consume any Vercel execution time.
   - Set default **Security Level** to **Medium** (raise to **High** or **Under Attack Mode** during active incident).

4. **Cloudflare WAF Custom Rules (Free Tier):**
   - Create a WAF Custom Rule to block high-risk scanner user agents:
     ```
     (http.user_agent contains "sqlmap" or http.user_agent contains "nikto" or http.user_agent contains "nmap" or http.user_agent contains "dirbuster")
     Action: Block
     ```

---

## 3. Layer 2: Cloaking Origin & Preventing Direct Vercel Bypass

An edge WAF is useless if attackers can query your Vercel deployment directly via `carpenterwala.vercel.app` or direct Vercel Edge IPs.

### Mitigation Strategy: Shared Secret Header Verification

```
[ Visitor / Attacker ]
         │
         ├─── (A: Tries direct carpenterwala.vercel.app) ────► [ Next.js Middleware ] ──► HTTP 403 Forbidden
         │
         ▼
[ Cloudflare Edge ]
         │ (Injects secret header via Transform Rule: x-carpenterwala-origin-secret)
         ▼
[ Next.js Middleware on Vercel ]
         │ (Verifies secret matching process.env.ORIGIN_SECRET)
         ▼
[ Valid Application Route / API ]
```

### 1. Cloudflare Transform Rule (Request Header Modification):
- Go to Cloudflare: **Rules > Transform Rules > Modify Request Header**.
- Rule Name: `Inject-Origin-Secret`.
- When incoming requests match: `All incoming requests`.
- Modify Request Header:
  - Header name: `x-carpenterwala-origin-secret`
  - Value: `<GENERATE_A_64_CHAR_HEX_KEY>` (e.g., using `openssl rand -hex 32`)

### 2. Next.js Middleware Origin Check (`proxy.js` / `middleware.js`):
In CarpenterWala's root middleware:
```javascript
const ORIGIN_SECRET = process.env.ORIGIN_SECRET;

// Enforce in production environments only
if (process.env.NODE_ENV === 'production' && ORIGIN_SECRET) {
  const incomingSecret = request.headers.get('x-carpenterwala-origin-secret');
  
  if (incomingSecret !== ORIGIN_SECRET) {
    return new NextResponse('Access Denied: Direct origin requests are forbidden.', {
      status: 403,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
```

### 3. Vercel Project Settings Hardening:
- Under **Project Settings > Deployment Protection**:
  - Restrict preview deployments from being public if not needed.
  - Set `X-Robots-Tag: noindex` for any `*.vercel.app` default domains to ensure search engines never discover or index the origin URL.

---

## 4. Layer 3: Application-Level Rate Limiting (Next.js + Upstash Redis)

Cloudflare edge rate limits apply globally by IP, but sensitive business endpoints require granular limits by IP, phone number, and route type.

### Recommended Rate Limit Budget ($0 Cost via Upstash Free Tier)
*Upstash Redis provides 10,000 free commands/day, which comfortably covers authentication and lead protection.*

```
┌──────────────────────────┬─────────────────┬─────────────────┬────────────────────────────────┐
│ Route                    │ Rate Limit      │ Window          │ Block Action                   │
├──────────────────────────┼─────────────────┼─────────────────┼────────────────────────────────┤
│ /api/customer/otp (send) │ 3 requests      │ 10 minutes / IP │ HTTP 429 Too Many Requests     │
│ /api/pro/otp (send)      │ 3 requests      │ 10 minutes / IP │ HTTP 429 Too Many Requests     │
│ /api/admin/login         │ 5 attempts      │ 15 minutes / IP │ HTTP 429 + 30 min lock         │
│ /api/leads               │ 5 submissions   │ 1 hour / IP     │ HTTP 429 + Anti-spam alert     │
│ /api/pro/verify-doc      │ 10 uploads      │ 10 minutes / IP │ HTTP 429 (Prevent CPU DoS)     │
│ /api/reviews             │ 2 submissions   │ 1 hour / IP     │ HTTP 429                       │
└──────────────────────────┴─────────────────┴─────────────────┴────────────────────────────────┘
```

### Implementation Architecture (`lib/rate-limiter.js`)

```javascript
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize Upstash Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Dedicated limiters for sensitive endpoints
export const otpRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '10 m'),
  analytics: true,
  prefix: 'rl:otp',
});

export const leadRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '60 m'),
  analytics: true,
  prefix: 'rl:lead',
});

export const adminLoginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
  prefix: 'rl:admin',
});
```

---

## 5. Layer 4: Bot Defense via Cloudflare Turnstile ($0 Cost, Privacy-First)

Unlike legacy reCAPTCHAs that degrade customer conversions, **Cloudflare Turnstile** is completely free, non-intrusive, and invisible for most legitimate human users.

### Where Turnstile Must Be Embedded:
1. `components/LeadCaptureModal.js` (Customer fast quote form)
2. `components/DirectCallModal.js` (Direct phone reveal form)
3. `app/pro/login/ProLoginClient.js` (Carpenter Pro onboarding & login)
4. `app/admin/AdminLoginModal.js` (Admin console access)

### Turnstile Workflow:
```
1. Client Modal loads invisible Turnstile widget (<Turnstile onVerify={(token) => setCfToken(token)} />)
2. User clicks "Send OTP" or "Submit Booking"
3. Client sends payload + { cf_token: token } to /api/*
4. Server verifies token against https://challenges.cloudflare.com/turnstile/v0/siteverify
5. If invalid or missing: Reject immediately without touching Supabase or sending SMS!
```

### Server-Side Turnstile Verification Utility (`lib/verify-turnstile.js`):
```javascript
export async function verifyTurnstileToken(token, clientIp) {
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  if (!secretKey) return true; // Bypass in local dev if not configured

  const formData = new URLSearchParams();
  formData.append('secret', secretKey);
  formData.append('response', token);
  if (clientIp) formData.append('remoteip', clientIp);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData,
  });

  const outcome = await res.json();
  return outcome.success === true;
}
```

---

## 6. Layer 5: Database & Backend Resource Exhaustion Protection

Supabase PostgreSQL can be overwhelmed during a Layer 7 spike if queries are unindexed or connections are not pooled.

### 1. Connection Pooling:
- Always use the **Transaction / Session Pooler URL (Port 6543 / 5432)** provided by Supabase rather than direct connection strings.
- Verify `NEXT_PUBLIC_SUPABASE_URL` and service role configurations use pooling.

### 2. Statement Timeouts:
Prevent runaway queries from locking database threads during high traffic. Execute in Supabase SQL editor:
```sql
-- Set max statement execution time to 5 seconds for web requests
ALTER ROLE anon SET statement_timeout = '5000';
ALTER ROLE authenticated SET statement_timeout = '8000';
```

### 3. Key Indexes for High-Traffic Read Endpoints:
Ensure query filters hit indexes to keep database CPU near 0%:
```sql
-- Index for rapid pro queries by slug and verification status
CREATE INDEX IF NOT EXISTS idx_profiles_slug_verified ON public.profiles(slug) WHERE verified = true;
```

---

## 7. Layer 6: Real-Time Monitoring & Webhook Alerting ($0 Cost)

Early detection allows automated or manual intervention before downtime occurs.

### 1. Cloudflare Free Notifications:
- Go to Cloudflare: **Notifications > Add**.
- Enable:
  - **DDoS Attack Alerts** (Instant email when edge mitigations kick in).
  - **High Error Rate Alert** (Triggers if 5xx HTTP responses exceed thresholds).

### 2. Rate-Limit / Attack Spike Webhook (Slack / Discord / Telegram):
Create a utility `lib/security-alerts.js` that dispatches a webhook alert when an IP breaches thresholds:
```javascript
export async function sendSecurityAlert({ type, ip, endpoint, details }) {
  const webhookUrl = process.env.SECURITY_WEBHOOK_URL;
  if (!webhookUrl) return;

  const payload = {
    text: `🚨 *CarpenterWala Security Alert*
*Type:* ${type}
*Endpoint:* \`${endpoint}\`
*IP:* \`${ip}\`
*Details:* ${details}
*Timestamp:* ${new Date().toISOString()}`,
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('Failed to post security webhook', err);
  }
}
```

---

## 8. Layer 7: Emergency Incident Response Playbook (Runbook)

When an active attack is detected:

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                            ACTIVE ATTACK RUNBOOK FLOW                                │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ 1. ACTIVATE "UNDER ATTACK MODE"                                                      │
│    • In Cloudflare Dashboard: Toggle "Under Attack Mode" ON.                         │
│    • All visitors get a 3-5 second non-intrusive JavaScript challenge.               │
│                                                                                      │
│ 2. ENABLE AGGRESSIVE FORM CHALLENGES                                                 │
│    • Change Cloudflare Turnstile widget mode from "Managed" to "Interactive".        │
│                                                                                      │
│ 3. TEMPORARY RATE LIMIT TIGHTENING                                                   │
│    • Reduce OTP rate limit to 1 attempt / 15 minutes per IP.                         │
│                                                                                      │
│ 4. IDENTIFY & BLOCK ATTACK SIGNATURE                                                 │
│    • Cloudflare Analytics > Security: Filter Top ASNs, Countries, or User-Agents.    │
│    • Add IP Access Rule: Block malicious ASN / CIDR block for 24 hours.              │
│                                                                                      │
│ 5. RECOVERY & POST-MORTEM                                                            │
│    • Turn off "Under Attack Mode" once traffic stabilizes to baseline.               │
│    • Export attack logs for IP blocklisting update.                                  │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Pre-Implementation Verification Checklist

Before deploying changes to production, complete this validation matrix:

- [ ] **Cloudflare Nameservers:** Active and verified (`dig carpenterwala.com NS`).
- [ ] **Origin Masking Secret:** Secret generated and shared between Cloudflare Transform Rule and Vercel Environment variables (`ORIGIN_SECRET`).
- [ ] **Direct Request Rejection Test:** `curl -I https://carpenterwala.vercel.app` returns `403 Forbidden`.
- [ ] **Proxied Request Success Test:** `curl -I https://carpenterwala.com` returns `200 OK` (via Cloudflare headers `cf-ray`, `cf-cache-status`).
- [ ] **Turnstile Verification Test:** Submit `/api/customer/otp` without `cf_token`; verify endpoint rejects request with `400 Bad Request`.
- [ ] **Rate Limit Threshold Test:** Fire 5 consecutive requests to `/api/customer/otp`; verify 4th and 5th return `429 Too Many Requests`.
- [ ] **Database Connection Pooling Test:** Confirm queries succeed under simulated concurrent loads without exhausting Supabase pool connections.
- [ ] **Webhook Alert Test:** Trigger rate limiter; verify instant alert is delivered to target Slack/Telegram channel.
