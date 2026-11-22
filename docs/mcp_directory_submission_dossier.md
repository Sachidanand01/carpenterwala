# Carpenterwala Remote MCP Server — Directory Submission Dossier
*(OpenAI ChatGPT App Directory & Anthropic Claude Connectors Submission Package)*

---

## 1. General Application & Directory Metadata

| Field | Value |
|---|---|
| **App / Connector Name** | `Carpenterwala` |
| **Tagline / Short Summary** | Pan-India 0% commission technician onboarding, Bangalore verified home improvement marketplace, and Customer/Pro OAuth 2.1 self-service portals with appliance warranty locker. |
| **Category** | Local Services / Home Improvement / Marketplace / Utilities |
| **Official Website** | `https://carpenterwala.com` |
| **Voice AI Onboarding Hub** | `https://carpenterwala.com/join` |
| **Privacy Policy URL** | `https://carpenterwala.com/privacy` *(redirects from `/privacy-policy`)* |
| **Terms of Service URL** | `https://carpenterwala.com/terms` |
| **Support Contact** | `contact@carpenterwala.com` · Phone: `+91-809-555-1001` |
| **Headquarters Location** | Thanisandra Main Road, Bangalore, Karnataka 560077, India |

---

## 2. Remote MCP Server Connection & OAuth 2.1 Specs

| Configuration Field | Specification Value |
|---|---|
| **Protocol Specification** | Model Context Protocol (`2024-11-05` / Streamable HTTP standard) |
| **Remote MCP Endpoint (JSON-RPC / SSE)** | `https://carpenterwala.com/api/mcp` |
| **Supported Transports** | HTTP POST (Streamable HTTP / JSON-RPC 2.0) and Server-Sent Events (SSE) via `Accept: text/event-stream` |
| **OpenAPI 3.1 Specification URL** | `https://carpenterwala.com/api/mcp/openapi.json` |
| **Official Registry Manifest (`server.json`)** | `https://carpenterwala.com/server.json` (also at repository root `server.json`) |
| **Well-Known Discovery Card** | `https://carpenterwala.com/.well-known/mcp/server-card.json` |
| **Public GitHub Repository** | `https://github.com/Sachidanand01/carpenterwala` |
| **OAuth 2.1 Discovery (RFC 8414 & PRM)** | `https://carpenterwala.com/.well-known/oauth-authorization-server` |
| **OAuth Authorization Endpoint** | `https://carpenterwala.com/oauth/authorize` |
| **OAuth Token Endpoint** | `https://carpenterwala.com/api/oauth/token` |
| **OAuth Grant & Proof** | Authorization Code Grant with PKCE (`code_challenge_method: S256`) |
| **OAuth Scopes** | `customer` (Appliance warranties & repair bookings), `pro` (Technician jobs & availability) |
| **User Authentication Method** | 10-Digit Indian Mobile Number + Instant SMS OTP (Zero password friction) |
| **Context & LLM Documentation** | `https://carpenterwala.com/llms.txt` and `https://carpenterwala.com/llms-full.txt` |
| **CORS Policy** | Fully enabled (`Access-Control-Allow-Origin: *`, `Methods: GET, POST, DELETE, HEAD, OPTIONS`) |
| **Rate Limiting** | Max 60 requests/hr per IP; max 5 onboarding sessions/24h per mobile number |

---

## 3. Registered Remote MCP Tools (16 Tools)

### A. Public Marketplace & Onboarding Tools (6 Tools — No Auth Required)

#### Tool 1: `start_carpenterwala_onboarding`
- **Description:** Onboards technicians (carpenters, painters, plumbers, electricians) across India with 0% platform commission. Returns a Dual-Handoff response with an Android mobile magic link (`/v/[token]`) and a QR code for desktop camera scanning.
- **Inputs:** `phone_number` *(required)*, `full_name`, `trade`, `city`, `locality`, `pincode`, `experience_years`, `email`.

#### Tool 2: `check_onboarding_status`
- **Description:** Checks the verification status of an onboarding session (`PENDING_UPLOAD`, `VERIFIED`, `EXPIRED`), returning pre-filled details and public profile links.
- **Inputs:** `session_token` or `phone_number`.

#### Tool 3: `search_verified_pros`
- **Description:** Searches verified, background-checked home service professionals in Bangalore filtered by trade, locality, minimum rating, and radius.
- **Inputs:** `trade`, `location`, `min_rating`, `limit`.

#### Tool 4: `get_service_rate_card`
- **Description:** Retrieves transparent benchmark metro labor rate cards and standard pricing for home repairs in Bangalore (carpentry, painting, plumbing, electrical).
- **Inputs:** `serviceCategory`, `jobType`.

#### Tool 5: `calculate_service_estimate`
- **Description:** Calculates instant cost, labor, and material estimates for home projects.
- **Inputs:**
  - `calculatorType`: `paint_cost`, `water_wastage`, `electricity_bill`.
  - `params`: JSON object with inputs (e.g. `{ carpetAreaSqFt: 1200 }` or `{ drippingTaps: 2 }`).

#### Tool 6: `request_service_callback`
- **Description:** Requests a callback from a verified service professional for homeowners in Bangalore without paying middleman commissions.
- **Inputs:** `customerName`, `customerPhone`, `trade`, `locality`, `description`.

---

### B. Authenticated Customer Tools (6 Tools — Scope: `customer`)

#### Tool 7: `get_my_warranties`
- **Description:** Retrieves the authenticated homeowner's registered appliance warranties, purchase dates, coverage durations, expiry dates, and digital invoice links.
- **Inputs:** None *(authenticated via Bearer OAuth access token)*.

#### Tool 8: `get_warranty_upload_ticket`
- **Description:** Generates a secure pre-signed direct upload ticket for attaching a receipt, bill, or warranty card scan to the customer's digital warranty locker without passing heavy Base64 data through LLM contexts.
- **Inputs:**
  - `documentType`: `receipt_copy`, `invoice_copy`, `warranty_card_copy` *(defaults to `receipt_copy`)*.
  - `fileType`: `image/jpeg`, `image/png`, `image/webp`, `application/pdf` *(required)*.

#### Tool 9: `register_warranty`
- **Description:** Registers a new appliance warranty in the customer's Carpenterwala digital vault with extracted bill details and storage path, automatically calculating expiration dates and days remaining.
- **Inputs:**
  - `category` *(required)*: Appliance or fixture category (e.g., "Carpentry & Furniture", "Air Conditioner", "Water Purifier").
  - `applianceName` *(required)*: Brand and model name (e.g., "Godrej Nav-Tal Lock", "Daikin 1.5T Inverter AC").
  - `purchaseDate` *(required)*: Purchase date in `YYYY-MM-DD` format.
  - `warrantyDurationMonths` *(required)*: Warranty duration in months (e.g. 12, 24, 60).
  - `warrantyStartDate` *(optional)*: Defaults to purchaseDate.
  - `receiptStoragePath` *(optional)*: Storage path from `get_warranty_upload_ticket`.
  - `invoiceStoragePath` *(optional)*: Optional invoice storage path.
  - `warrantyCardStoragePath` *(optional)*: Optional warranty card scan path.
  - `notes` *(optional)*: Serial numbers, retailer name, or special terms.

#### Tool 10: `get_my_bookings`
- **Description:** Retrieves the authenticated homeowner's active and historical repair service requests and bookings with assigned technician details.
- **Inputs:** `status` *(optional: `all`, `pending`, `assigned`, `completed`)*.

#### Tool 11: `book_service_job`
- **Description:** Directly books a verified technician for home repairs (carpentry, painting, plumbing, electrical) with zero platform commission.
- **Inputs:** `trade` *(required)*, `locality` *(required)*, `taskDescription` *(required)*, `preferredTime` *(optional)*.

#### Tool 12: `submit_pro_review`
- **Description:** Submits a verified customer star rating (1-5) and feedback for a service professional after a completed job, publishing it directly to their public profile with a "Verified Hiring" trust badge and recalculating their aggregate rating.
- **Inputs:**
  - `rating` *(required)*: Star rating from 1 to 5.
  - `reviewText` *(required)*: Detailed feedback on the quality of work and punctuality.
  - `bookingId` *(optional)*: Booking/lead ID (automatically resolves technician and marks booking as completed).
  - `proId` *(optional)*: Technician's profile ID.
  - `proCode` *(optional)*: Technician's unique identifier (e.g. `CARP001`).
  - `authorName` *(optional)*: Display name (defaults to authenticated customer name or masked phone).

---

### C. Authenticated Service Professional Tools (4 Tools — Scope: `pro`)

#### Tool 13: `get_my_assigned_jobs`
- **Description:** Retrieves assigned customer repair leads, active work orders, customer contact details, and scheduled tasks for the logged-in professional.
- **Inputs:** `status` *(optional: `all`, `pending`, `contacted`, `completed`)*.

#### Tool 14: `update_job_status`
- **Description:** Updates the lifecycle state of an assigned job (`contacted`, `in-progress`, `completed`, `cancelled`) with optional completion notes.
- **Inputs:** `jobId` *(required)*, `status` *(required)*, `notes` *(optional)*.

#### Tool 15: `get_my_pro_dashboard`
- **Description:** Retrieves the logged-in technician's performance dashboard, verified badge status, public profile URL, average customer rating, total leads received, and commission tier (0%).
- **Inputs:** None *(authenticated via Bearer OAuth access token)*.

#### Tool 16: `set_my_availability`
- **Description:** Toggles the technician's availability status to start or pause receiving new customer dispatch leads in their service cluster.
- **Inputs:** `accepting_leads` *(boolean, required)*.

---

## 4. Step-by-Step Submission Guide

### Pathway 1: Native OpenAI MCP Tool Integration (Responses API & Agents SDK)

Clients, developers, and ChatGPT tools can consume Carpenterwala directly via standard MCP JSON-RPC/SSE:

- **Server URL:** `https://carpenterwala.com/api/mcp`
- **Transport Type:** Streamable HTTP / Server-Sent Events (SSE)
- **Authentication:** OAuth 2.1 (RFC 8414 auto-discovery enabled)

#### Code Example (OpenAI Responses API / Agents SDK):
```json
{
  "model": "gpt-4o",
  "tools": [
    {
      "type": "mcp",
      "server_url": "https://carpenterwala.com/api/mcp"
    }
  ]
}
```

---

### Pathway 2: OpenAI ChatGPT Store Listing & Action Submission

#### Step 1: Complete Builder Profile & Domain Verification (Mandatory for Public Store)
Per OpenAI's updated troubleshooting & publishing policies (Help Article `11325361`):
1. In ChatGPT, navigate to **Settings** → **Builder Profile**.
2. Under **Domain**, click **Verify a new domain** and enter `carpenterwala.com`.
3. OpenAI will display a DNS `TXT` verification record (e.g. `openai-domain-verification=...`).
4. Add this `TXT` record in your **Cloudflare DNS Dashboard** for `carpenterwala.com`.
5. Return to ChatGPT and click **Verify**.

#### Step 2: Configure the Custom GPT Action with OAuth 2.1
1. Navigate to: [OpenAI Custom GPT Editor](https://chatgpt.com/gpts/editor).
2. **Name:** `Carpenterwala`
3. **Description:** `Pan-India 0% commission technician onboarding, verified Bangalore home services, appliance warranty tracking with photo receipt scans, and technician job dashboard.`
4. **Actions:**
   - Click **Create new action**.
   - Under **Schema**, select **Import from URL** and paste:
     `https://carpenterwala.com/api/mcp/openapi.json`
   - Under **Authentication**, select **OAuth**:
     - **Client ID:** `chatgpt` *(or any preferred identifier)*
     - **Client Secret:** *(leave blank or enter standard placeholder)*
     - **Authorization URL:** `https://carpenterwala.com/oauth/authorize`
     - **Token URL:** `https://carpenterwala.com/api/oauth/token`
     - **Scope:** `customer pro`
     - **Token Exchange Method:** `Default (POST)` with PKCE
   - Under **Privacy Policy**, paste: `https://carpenterwala.com/privacy`.
5. **Publish:** Select **Everyone** with the verified publisher badge `carpenterwala.com`.

---

### Pathway 3: Anthropic Claude Desktop & Connectors Directory Submission

#### Claude Desktop Configuration (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "carpenterwala": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://carpenterwala.com/api/mcp"
      ]
    }
  }
}
```

---

### Pathway 4: Glama.ai, Smithery & Official MCP Registry Submission

#### 1. Glama.ai Listing Submission
- **Portal URL:** [glama.ai/mcp/servers](https://glama.ai/mcp/servers)
- **GitHub Repository URL Field:** `https://github.com/Sachidanand01/carpenterwala` *(Note: Must be the public GitHub repository link, not the API URL).*
- **Short Description:**
  > `Carpenterwala Pan-India Home Improvement Marketplace: 16 production tools for booking certified carpenters, instant custom furniture quoting, job lifecycle tracking, digital appliance warranty management, and verified customer reviews.`
- **Live Server Endpoint (when prompted):** `https://carpenterwala.com/api/mcp`

#### 2. Official Registry Manifest (`server.json`)
The root of the repository includes `server.json` (also served at `https://carpenterwala.com/server.json`), which conforms to the official Linux Foundation schema (`https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json`):
```json
{
  "$schema": "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
  "name": "io.github.Sachidanand01/carpenterwala",
  "title": "Carpenterwala MCP Server",
  "description": "Carpenterwala Pan-India Home Improvement Marketplace: 16 production tools for booking certified carpenters, instant custom furniture quoting, job lifecycle tracking, digital appliance warranty management, and verified customer reviews.",
  "version": "1.0.0",
  "repository": {
    "url": "https://github.com/Sachidanand01/carpenterwala",
    "source": "github"
  },
  "homepage": "https://carpenterwala.com",
  "remotes": [
    {
      "type": "streamable-http",
      "url": "https://carpenterwala.com/api/mcp"
    }
  ],
  "categories": [
    "home-services",
    "e-commerce",
    "local-business",
    "customer-support"
  ],
  "authentication": {
    "type": "oauth2",
    "authorizationUrl": "https://carpenterwala.com/oauth/authorize",
    "tokenUrl": "https://carpenterwala.com/api/oauth/token"
  }
}
```

#### 3. Smithery & PulseMCP
- **Smithery:** Run `npx -y @smithery/cli init` in the repo root or submit `https://github.com/Sachidanand01/carpenterwala`.
- **PulseMCP:** Submit `https://github.com/Sachidanand01/carpenterwala`. Tools are automatically discovered via `public/llms.txt`.

---

## 5. Reviewer Demo Script & Test Cases

### Test Case 1: Photo/Invoice Warranty Scan & Registration (Multimodal + MCP Tool Calling)
- **Prompt:**
  > *"Here is a photo of my new Godrej Door Lock invoice. Can you register this in my warranty locker?"*
- **Flow:**
  1. The vision model analyzes the invoice photo, extracting:
     - Product: `Godrej Nav-Tal Brass Lock`
     - Category: `Carpentry & Furniture`
     - Purchase Date: `2026-03-15`
     - Warranty Period: `36 Months`
  2. The assistant requests an upload authorization via `get_warranty_upload_ticket(documentType: "receipt_copy", fileType: "image/webp")`, obtaining a direct pre-signed upload URL to the dedicated `warranties` bucket.
  3. Once the document is uploaded to storage, the assistant invokes:
     ```json
     register_warranty({
       "category": "Carpentry & Furniture",
       "applianceName": "Godrej Nav-Tal Brass Lock",
       "purchaseDate": "2026-03-15",
       "warrantyDurationMonths": 36,
       "receiptStoragePath": "warranties/9876543210/receipt_copy_1732...webp"
     })
     ```
  4. The assistant confirms:
     > *"Your Godrej Nav-Tal Brass Lock warranty is successfully registered! Coverage is active until March 15, 2029 (1,088 days remaining). Reference ID: #WAR-1042."*

### Test Case 2: Customer Appliance Warranties & Expiry Check (OAuth Authenticated)
- **Prompt:**
  > *"Can you check my appliance warranties and show me if my AC or TV is still under warranty?"*
- **Flow:**
  1. The assistant invokes `get_my_warranties`. If not authenticated, the MCP server returns `AUTH_REQUIRED` with the branded consent URL: `https://carpenterwala.com/oauth/authorize`.
  2. The user enters their 10-digit mobile number, verifies with OTP, and approves access.
  3. The assistant automatically receives the token and displays the user's active warranties, expiration dates, days remaining, and invoice links.

### Test Case 3: Service Professional Job Management & Availability (OAuth Authenticated)
- **Prompt:**
  > *"I am a registered Carpenterwala carpenter. What active jobs are assigned to me today, and can you mark my availability to active?"*
- **Flow:**
  1. Assistant invokes `get_my_assigned_jobs` and `set_my_availability(accepting_leads: true)`.
  2. Upon technician authentication, displays pending leads and confirms availability is active for new customer dispatches.

### Test Case 4: Public Marketplace Inquiries (No Auth Required)
- **Prompt:**
  > *"Show me background-checked plumbers near Whitefield with a rating of 4.5 or higher."*
- **Flow:**
  The assistant directly invokes `search_verified_pros(trade: "plumbing", location: "Whitefield", min_rating: 4.5)` without prompting for authentication.

### Test Case 5: Verified Review Submission After Job Completion (OAuth Authenticated)
- **Prompt:**
  > *"Ramesh finished replacing our modular kitchen hydraulic hinges today. I'd like to leave him a 5-star review: 'Punctual, brought laser tools, and finished in 30 minutes. Clean workmanship!'"*
- **Flow:**
  1. Assistant invokes `submit_pro_review({ proCode: "CARP001", rating: 5, reviewText: "Punctual, brought laser tools, and finished in 30 minutes. Clean workmanship!" })`.
  2. The review is recorded in `public.reviews` under Ramesh's profile with verified hiring badge.
  3. Aggregate rating and reviews count on `public.profiles` are automatically recalculated.
  4. Assistant confirms to the homeowner:
     > *"Thank you! Your 5-star review for Ramesh Kumar (Carpenter) has been published! It is now live on his verified profile: https://carpenterwala.com/pro/carpentry/CARP001/ramesh-kumar"*

---

## 6. Security & Privacy Guarantees for Reviewers

- **Zero-Password OTP Security:** Homeowners and tradesmen log in via ephemeral 6-digit SMS OTPs; no sensitive passwords are stored or transmitted.
- **Cryptographic PKCE Protection:** Strict RFC 7636 PKCE validation prevents authorization code interception and token replay attacks.
- **Strict Storage Segregation & Privacy:**
  - **`kyc-documents` (Private):** Holds service professional verification documents (Aadhaar, PAN), governed by an automated 90-day compliance auto-purge routine.
  - **`warranties` (Private):** Segregated bucket for long-term customer receipts and warranty cards (1-5+ years retention), accessible only via expiring 15-minute signed URLs.
- **Zero Base64 in LLM Context:** Document transfers use direct pre-signed upload URLs to Supabase Storage, completely avoiding heavy Base64 payload bloat in LLM contexts.
- **Strict Rate Limits:** Rate-limited at the Cloudflare edge and application level (max 60 MCP tool calls/hr per IP; max 5 onboarding requests/24h per mobile number).
