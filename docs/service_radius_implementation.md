# Service Coverage Radius & Interactive Map Implementation

## 1. Executive Summary

This document details the architecture, design decisions, data flow, and code implementation for the **Interactive Service Coverage Radius Map** and the accompanying **Step 1 Onboarding Reorganization** on Carpenterwala.

The feature empowers verified service professionals (handymen, carpenters, electricians, plumbers, painters, welders, masons, AC technicians, gardeners, barbers, pest control, deep cleaning, roofers, and flooring experts) to visually define their travel coverage area around their home/workshop base using an interactive OpenStreetMap interface with a slider (1 km to 50 km, defaulting to 5 km).

---

## 2. Key Requirements & Design Alignment

| Requirement | Implementation Decision | Rationale |
| :--- | :--- | :--- |
| **Field Reordering** | Address moved below Skills & Specialties; Map placed directly after Address. | Creates a logical narrative flow: Profile Details $\rightarrow$ Skills $\rightarrow$ Physical Location $\rightarrow$ Service Coverage Range. |
| **Map Technology** | OpenStreetMap + Leaflet via `next/dynamic` (`ssr: false`). | 100% open-source, zero API billings, reliable performance, zero SSR hydration mismatches. |
| **Visual Theming** | Brand Terracotta (`#C2410C`, `rgba(194, 65, 12, 0.18)` fill). | Perfectly matches Carpenterwala's craftsmanship theme; eliminates dark/clashing UI boxes. |
| **Slider Range** | 1 km to 50 km (default: 5 km, step: 1 km). | Standard local repair ranges across Indian metros (Bangalore, Mumbai, Delhi-NCR, Hyderabad). |
| **Location Fine-Tuning** | Draggable pin & click-to-place on map. | Allows professionals to fine-tune their exact home or workshop if street geocoding is slightly displaced. |
| **24-Hour Cooldown** | Free during onboarding; locked for 24h once edited post-onboarding. | Prevents constant lead-gaming while giving pros flexibility to expand service ranges periodically. |

---

## 3. Architecture & Data Flow

```mermaid
flowchart TD
    A[Service Professional Inputs Address] -->|Debounced 400ms| B[/api/address/suggest]
    B -->|Nominatim & Postal PIN| C[Address Suggestions + Lat/Lon]
    C -->|Select Suggestion| D[Auto-center Map Pin & Circle]
    D -->|Drag Pin / Click Map| E[Fine-tune Exact Workshop Coordinates]
    D -->|Adjust Range Slider| F[Resize Radius Circle: 1-50 km]
    E --> G[Form State: lat, lng, service_radius_km]
    F --> G
    G -->|Submit Wizard / Save Profile| H[PUT /api/pro/profile]
    H -->|Validate 24h cooldown if post-onboarding| I[Supabase Database Update]
    I -->|Profiles Table| J[(public.profiles)]
    J -->|Customer Search| K[DirectoryClient.js Distance Match]
```

---

## 4. Modified Files & Components

### 4.1. New Component: `components/ServiceRadiusMap.js`
- **Location**: [`components/ServiceRadiusMap.js`](file:///c:/Users/Sachidanand.Singh/Downloads/CAR/carpenterwala-1/components/ServiceRadiusMap.js)
- **Features**:
  - Initializes a Leaflet map instance on client-side mount.
  - Custom terracotta SVG pin marker (`#C2410C`) with a glowing animated pulse.
  - Interactive terracotta coverage circle (`L.circle`) bound to `activeRadius * 1000` meters.
  - Draggable marker (`marker.on('dragend')`) and map click handler to adjust base location.
  - Live slider (`<input type="range" min="1" max="50" step="1" />`) with terracotta progress gradient.
  - 24-hour countdown timer calculating hours and minutes remaining when locked.

### 4.2. Onboarding & Profile Dashboard: `app/pro/dashboard/page.js`
- **Location**: [`app/pro/dashboard/page.js`](file:///c:/Users/Sachidanand.Singh/Downloads/CAR/carpenterwala-1/app/pro/dashboard/page.js)
- **Modifications**:
  1. **Dynamic Import**: Embedded `ServiceRadiusMap` using `dynamic(() => import(...), { ssr: false })` with a fallback skeleton.
  2. **Step 1 Field Order**:
     - *1. Contact Info*: Phone Number & Years of Experience
     - *2. About Me*: Bio description with AI Rephrase
     - *3. Skills & Specialties*: Pill selector with trade presets & 10-skill ceiling
     - *4. Full Address with Zipcode*: Textarea with address recommendation dropdown & parameter badges (`House/Flat`, `Street/Area`, `City/State`, `6-Digit PIN`)
     - *5. Service Radius Map*: Centered on pro's address with real-time range slider
  3. **Profile Edit Tab**: Added the Full Base Address input with autocomplete suggestions and the `ServiceRadiusMap` with 24-hour cooldown enforcement.
  4. **State Management**: Updated `onboardForm` and `form` state to track `service_radius_km`, `latitude`, `longitude`, and `radius_updated_at`.

### 4.3. Profile API Route: `app/api/pro/profile/route.js`
- **Location**: [`app/api/pro/profile/route.js`](file:///c:/Users/Sachidanand.Singh/Downloads/CAR/carpenterwala-1/app/api/pro/profile/route.js)
- **Modifications**:
  - **GET**: Queries `service_radius_km`, `latitude`, `longitude`, and `radius_updated_at`. Features resilient fallback parsing if dedicated columns are not yet applied on remote Supabase.
  - **PUT**:
    - Validates 24-hour cooldown if the profile has already completed onboarding. Rejects attempts under 24 hours with `HTTP 400` (`RADIUS_COOLDOWN`).
    - Enforces numeric radius constraints between 1 and 50 km.
    - Saves coordinates and radius with graceful fallback retry if column cache hasn't refreshed.

### 4.4. Geocoding & Address Suggestion API: `app/api/address/suggest/route.js`
- **Location**: [`app/api/address/suggest/route.js`](file:///c:/Users/Sachidanand.Singh/Downloads/CAR/carpenterwala-1/app/api/address/suggest/route.js)
- **Modifications**:
  - Returns `lat: parseFloat(item.lat)` and `lon: parseFloat(item.lon)` alongside formatted address suggestions from OpenStreetMap Nominatim.

### 4.5. Customer Distance Matching: `components/DirectoryClient.js`
- **Location**: [`components/DirectoryClient.js`](file:///c:/Users/Sachidanand.Singh/Downloads/CAR/carpenterwala-1/components/DirectoryClient.js)
- **Modifications**:
  - Updated distance filter to respect `p.service_radius_km` (up to 50 km) so customer searches match professionals whose defined service coverage includes the customer's coordinates.

### 4.6. Database Migration: `supabase/migrations/20260927000001_service_radius.sql`
- **Location**: [`supabase/migrations/20260927000001_service_radius.sql`](file:///c:/Users/Sachidanand.Singh/Downloads/CAR/carpenterwala-1/supabase/migrations/20260927000001_service_radius.sql)
```sql
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS service_radius_km INT DEFAULT 5,
  ADD COLUMN IF NOT EXISTS latitude NUMERIC DEFAULT 12.9716,
  ADD COLUMN IF NOT EXISTS longitude NUMERIC DEFAULT 77.5946,
  ADD COLUMN IF NOT EXISTS radius_updated_at TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_geo ON public.profiles (latitude, longitude);
```

---

## 5. Verification & Testing Summary

1. **Build Validation**:
   - Command: `node ./node_modules/next/dist/bin/next build`
   - Result: `✓ Compiled successfully in 14.6s`
   - Static/Dynamic Routes: `284/284` pages generated without errors or warnings.
2. **SSR & Hydration Safety**:
   - Leaflet is completely isolated from Node.js SSR runtime via `next/dynamic` (`ssr: false`).
3. **Graceful Database Fallback**:
   - `app/api/pro/profile/route.js` supports both native columns and metadata fallbacks, ensuring zero downtime.
