# BreatheWise — Urban Air Quality Assistant

> **"Know your air. Change your routine. Protect your surroundings."**

BreatheWise is a production-quality, accessible, GenAI-powered urban atmospheric health assistant designed to help families, students, working professionals, and communities navigate severe winter smog and chronic everyday urban pollution. Rather than merely displaying raw AQI digits, BreatheWise translates real atmospheric observations into actionable, personalized, and low-emission daily routines.

Built exclusively for **100% serverless Vercel deployment**.

---

## 1. Primary Problem Statement & Objectives

Urban air pollution—characterized by severe winter temperature inversions, fine respirable particulate matter ($PM_{2.5}$ and $PM_{10}$), nitrogen dioxide ($NO_2$), and ground-level ozone ($O_3$)—affects billions of citizens worldwide. Traditional dashboards present static numbers without answering the user's immediate practical dilemmas:
- *"Is it safe for my child to do morning sports outdoors today?"*
- *"Should I crack open my bedroom window or keep it sealed?"*
- *"How should I commute to minimize personal soot inhalation while reducing my own carbon footprint?"*
- *"How can my family clean indoor air without buying expensive equipment?"*

BreatheWise bridges this gap by combining **real Copernicus atmospheric dispersion modeling**, a **personalized AI daily routine generator**, an **evidence-based indoor air guide**, a **transparent avoided emissions calculator**, and an **environmental GenAI advisor**.

---

## 2. Core Modules & Capabilities

### Module A — Location-Aware Air Quality Dashboard
- **Instant 3-Second Comprehension**: Clear visual hierarchy with bold AQI scale, category badge, and active standard identification.
- **Strict Standard Separation**: Displays Indian CPCB NAQI (0-500 scale across 6 bands), US EPA AQI, and European EAQI independently without mixing formulas.
- **Pollutant Breakdown Grid**: Real-time concentrations for $PM_{2.5}$, $PM_{10}$, $NO_2$, $SO_2$, $CO$, and $O_3$ with ratio bars comparing against national safe standards.
- **Hourly Forecast & Risk Analysis**: 24-hour and 48-hour trend area charts with automated detection of the day's **Optimal Outdoor Window** and **Peak Hazard Window**.
- **5-Day Outlook**: Daily minimum, maximum, and average AQI expectations with dominant pollutant trajectories.
- **Geolocation & Search**: Explicit user-consented GPS geolocation detection with robust handling for permission denial, timeout, and global city autocomplete.

### Module B — Personalized AI Daily Routine Planner
- **Lifestyle & Commute Tailoring**: Customized schedules for students, corporate workers, remote workers (WFH), homemakers, and seniors across all travel modes (metro, bus, car, two-wheeler, walking, bicycle).
- **7-Phase Daily Timeline**:
  1. *Early Morning*: Inversion protection and safe waking habits.
  2. *Morning Prep*: Covered cooking and kitchen exhaust protocols.
  3. *Work/Study Commute*: Cabin recirculation, N95 platform masking, and mass transit switches.
  4. *Afternoon Window*: Timed solar cross-ventilation flushes.
  5. *Evening Return*: Post-transit skin and clothing soot decontamination.
  6. *Exercise & Recreation*: Dynamic shifting between outdoor parks and indoor workouts based on ambient AQI.
  7. *Night Sleep Sanctuary*: Purifier placement and bedroom damp-mopping routines.
- **Adaptive Controls**: Complete/skip toggles, alternatives drawer for constrained lifestyles, and exposure hours shielded tracking.

### Module C — Indoor Air Quality Intelligence
- **4 Scientific Categories**: HEPA filtration mechanics and CADR sizing; outdoor-aware ventilation timing; household emitter elimination (incense, candles, frying, tobacco); and wet mopping dust suppression.
- **Interactive Daily Checklist**: Persistent local progress tracking for daily household habits.
- **Budget Tier Solutions**: Detailed recommendations for Free (behavioral), Low Budget (sealing & N95s), and Moderate Budget (True HEPA purifiers) with honest scientific limitations documented.
- **Debunked Myths & Prohibited Actions**: Strict alerts against hazardous ozone generators, unverified ionizers, salt lamps, and the false claim that houseplants replace mechanical filtration.

### Module D — Sustainable Alternatives & Low-Emission Routines
- Actionable recommendations across Clean Transportation, Household Energy Conservation, and Community Stewardship.
- Every card specifies: What to change, Why it matters, Your direct benefit, Verified environmental impact, and Limitations/assumptions.
- Realistic disclaimer: Clarifies that individual actions avoid personal exposure and shrink individual footprints, but systemic clean air requires community-wide action.

### Module E — Direct Impact & Measurement Engine
- **Transparent Avoided Emissions Calculator**: Fully disclosed mathematical formulas computing kilograms of $CO_2e$ avoided when replacing private cars with electric metro, public buses, carpooling, cycling, walking, or remote work.
- **Audited Factors**: Uses UK DEFRA and ARAI 2024 urban passenger fleet conversion factors.
- **Personal Exposure Duration Shield**: Estimates hours of hazardous peak-smog air avoided through schedule shifting.
- **Weekly Progress History**: Interactive bar charts visualizing day-by-day carbon and exposure mitigation.

### Module F — GenAI Environmental Advisor
- Context-aware chatbot with automatic ingestion of local AQI, dominant pollutant, forecast window, and user lifestyle.
- Vercel AI SDK integration supporting OpenAI (`OPENAI_API_KEY`), Google Gemini (`GOOGLE_GENERATIVE_AI_API_KEY`), or Vercel AI Gateway (`AI_GATEWAY_API_KEY`).
- **Deterministic Environmental Intelligence Fallback**: If external API credentials are absent or fail, a comprehensive rule-based reasoning engine generates high-quality, scientifically grounded structured responses with an honest disclosure notice.
- Zod schema validation ensuring responses always include: Summary, AQI Context, Recommended Actions, Reasons, Personal Impact, Environmental Impact, Confidence, Sources, and Safety Caveats.
- Non-medical safety boundaries: Never diagnoses illness or prescribes pharmaceuticals; provides exposure mitigation advice only.

### Module G — Community Action Center
- **4 Multi-Day Guided Challenges**:
  - *7-Day Cleaner Commute Challenge*
  - *Smoke-Free Home Challenge*
  - *Responsible Waste & Anti-Burning Campaign*
  - *Clean-Air Community Awareness Week*
- **Official Reporting Guides**: Step-by-step instructions for reporting illegal open waste and leaf burning via the CPCB Sameer App, Swachhata App, and municipal emergency helplines.
- **Shareable Action Plans**: Printable and copyable weekly clean-air routines for apartment complexes and schools.
- **Transparency Notice**: All challenge progress is stored locally on the user's device without fabricated online user counts.

---

## 3. Technology Stack

- **Framework**: Next.js 15 (App Router, Server Components & Route Handlers)
- **Runtime**: React 19, TypeScript (Strict Mode enabled)
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **UI & Icons**: Lucide React
- **Data Visualizations**: Recharts (Accessible, responsive area charts and bar charts)
- **Validation**: Zod (Runtime input validation for APIs, queries, and AI schemas)
- **GenAI**: Vercel AI SDK (`ai`, `@ai-sdk/openai`, `@ai-sdk/google`)
- **Testing**: Vitest, React Testing Library, JSDOM
- **Code Quality**: ESLint (Next.js core-web-vitals, zero warnings), Prettier

---

## 4. Technical Architecture & Folder Structure

```
urban-air/
├── public/
│   ├── manifest.json              # Web application manifest
│   └── icon.svg                   # Vector brand icon
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── air-quality/route.ts       # Validated AQI endpoint (CAMS model data)
│   │   │   ├── assistant/route.ts         # GenAI / deterministic advisor endpoint
│   │   │   ├── location/search/route.ts   # Geocoding autocomplete endpoint
│   │   │   └── recommendations/route.ts   # Personalized schedule generation API
│   │   ├── assistant/page.tsx             # AI Advisor page
│   │   ├── community/page.tsx             # Community challenges & reporting page
│   │   ├── impact/page.tsx                # Impact calculator & carbon savings page
│   │   ├── indoor-air/page.tsx            # Indoor air intelligence page
│   │   ├── planner/page.tsx               # Daily routine planner page
│   │   ├── sustainable-choices/page.tsx   # Sustainable lifestyle choices page
│   │   ├── globals.css                    # Tailwind directives & accessibility styles
│   │   ├── layout.tsx                     # Root layout with accessible skip link
│   │   └── page.tsx                       # Location-aware dashboard (Module A)
│   ├── components/
│   │   ├── features/
│   │   │   ├── air-quality/               # AqiCard, PollutantGrid, HourlyChart, DailyOutlook
│   │   │   ├── assistant/                 # AssistantView (Chat thread & structured responses)
│   │   │   ├── community/                 # CommunityView (Challenges & reporting guides)
│   │   │   ├── impact/                    # ImpactView (Emissions calculator & charts)
│   │   │   ├── indoor/                    # IndoorView (Interactive guide & checklist)
│   │   │   ├── location/                  # LocationModal (GPS & city search)
│   │   │   └── planner/                   # RoutineTimeline & ProfileModal
│   │   └── layout/                        # Header, Footer
│   ├── lib/
│   │   ├── air-quality/                   # CPCB math, standards, Open-Meteo provider, service
│   │   ├── assistant/                     # Expert deterministic reasoning engine
│   │   ├── community/                     # Challenge definitions & action guides
│   │   ├── context/                       # Global React AppProvider state & storage
│   │   ├── impact/                        # Emission factors & calculation math
│   │   ├── indoor-air/                    # Indoor guide data & budget tiers
│   │   ├── planner/                       # 7-phase routine generation engine
│   │   └── sustainability/                # Sustainable recommendations database
│   ├── test/                              # Vitest unit, API, and component test suites
│   └── types/                             # Comprehensive TypeScript interfaces
├── .env.example                           # Documented environment variable template
├── eslint.config.mjs                      # ESLint flat configuration
├── next.config.ts                         # Next.js config with HTTP security headers
├── package.json                           # Dependencies and package scripts
├── tailwind.config.ts                     # Environmental design theme & colors
├── tsconfig.json                          # Strict TypeScript compiler options
└── vitest.config.ts                       # Vitest and JSDOM configuration
```

---

## 5. Data Sources, Standards & Scientific Attribution

### Data Providers
1. **Copernicus Atmosphere Monitoring Service (CAMS) via Open-Meteo Air Quality API**:
   - Atmospheric numerical dispersion data integrating satellite observations and ground assimilation.
   - Hourly variables: $PM_{2.5}$, $PM_{10}$, $NO_2$, $SO_2$, $CO$, and $O_3$.
   - **Crucial Distinction**: Clearly labeled in the interface as *Atmospheric Model-Based Dispersion Estimate (Copernicus CAMS via Open-Meteo)*, never misrepresented as official station hardware sensors.
2. **Open-Meteo Geocoding API**: Global city and locality coordinate resolution.

### Air Quality Standards Implemented
- **CPCB NAQI (India)**: Implements official Indian Central Pollution Control Board (2014) piecewise linear interpolation formulas and breakpoints. Requires minimum 3 pollutants with at least one particulate indicator ($PM_{2.5}$ or $PM_{10}$). Categories: Good (0-50), Satisfactory (51-100), Moderate (101-200), Poor (201-300), Very Poor (301-400), Severe (401-500).
- **US EPA AQI**: 0-500 standardized index.
- **European AQI (EAQI)**: 1 to 6 categorical banding by the European Environment Agency.

### Carbon & Emission Factor References
- UK Department for Environment, Food & Rural Affairs (DEFRA) / BEIS Greenhouse Gas Reporting Conversion Factors (2024).
- Automotive Research Association of India (ARAI) Urban Driving Cycle Emission Factors.
- Central Electricity Authority (CEA) India $CO_2$ Baseline Database.

---

## 6. Environment Variables

Create a `.env.local` file in your project root based on `.env.example`:

```bash
# BreatheWise Environment Variables Configuration

# ------------------------------------------------------------------------------
# AI Provider Configuration (Optional)
# If omitted or unconfigured, BreatheWise automatically runs its built-in
# deterministic environmental intelligence engine with an honest disclosure notice.
# ------------------------------------------------------------------------------
AI_GATEWAY_API_KEY=
OPENAI_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
AI_MODEL=gpt-4o-mini

# ------------------------------------------------------------------------------
# Rate Limiting via Upstash Redis (Optional for multi-region serverless)
# In-memory sliding window rate limiter runs by default on stateless functions.
# ------------------------------------------------------------------------------
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# ------------------------------------------------------------------------------
# Application Public URL
# ------------------------------------------------------------------------------
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Security Rule**: No private keys or secret variables are ever prefixed with `NEXT_PUBLIC_` or exposed to client-side code.

---

## 7. Local Setup & Quality Commands

### 1. Installation
```bash
git clone <your-repo-url>
cd urban-air
npm install
```

### 2. Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Quality Gates
```bash
# 1. Check code formatting
npm run format:check

# 2. Automatically format code
npm run format

# 3. TypeScript strict typecheck
npm run typecheck

# 4. ESLint verification (Zero errors and zero warnings)
npm run lint

# 5. Run automated unit, API, and component tests
npm run test

# 6. Production build simulation (Vercel serverless build)
npm run build
```

---

## 8. Automated Testing Suite

BreatheWise includes a comprehensive Vitest test suite covering:
1. `cpcb.test.ts`: CPCB boundary values (0, 50, 100, 200, 300, 400, 500), sub-index interpolation, dominant pollutant logic, and negative/NaN input protection.
2. `impact.test.ts`: Avoided emissions math (petrol car vs metro/walking/carpooling), distance handling, zero-distance edge cases, and non-medical personal exposure explanations.
3. `planner.test.ts`: 7-phase schedule completeness, exercise routine shifting during high smog, remote WFH guidance, and clean-air window adaptation.
4. `assistant.test.ts`: Deterministic engine accuracy for running safety, window opening flushes, commute masking, severe smog protocols, and $PM_{2.5}$ definitions.
5. `api.test.ts`: Query validation on `/api/air-quality` (lat/lon bounds), `/api/location/search` (character lengths), and `/api/assistant` payload validation.
6. `components.test.tsx`: React Testing Library DOM rendering of AQI card, category colors, and pollutant grid.

**Result**: 27 / 27 tests passing.

---

## 9. Accessibility (Target: WCAG 2.2 AA)

- **Semantic Landmarks**: Semantic `<header>`, `<nav>`, `<main id="main-content">`, `<section>`, `<article>`, and `<footer>` elements.
- **Skip Link**: Accessible `.skip-link` allowing keyboard users and screen readers to bypass navigation directly to main content.
- **No Color Alone**: AQI categories always pair color indicators with clear textual labels, numeric values, and descriptive health bands.
- **Screen Reader Tables**: Hourly forecast chart includes an accessible, expandable data table specifically formatted for screen reader users.
- **Keyboard Trapping & Escape**: Location and profile dialogs support Escape key closure, focus trapping, and visible focus rings (`focus-visible:ring-2 focus-visible:ring-emerald-500`).
- **Reduced Motion**: Respects `prefers-reduced-motion` media queries by disabling transitions and animations for users sensitive to vestibular motion.

---

## 10. Security & Hardening Measures

- **No Secret Leakage**: Upstream API keys remain strictly on the server; zero secrets in client bundles.
- **SSRF & Input Defense**: Coordinate parameters are strictly clamped ($-90 \le \text{lat} \le 90$, $-180 \le \text{lon} \le 180$) and validated with Zod. Arbitrary client URLs cannot be fetched.
- **Prompt Injection Defense**: The assistant system prompt firmly bounds model behavior to provided atmospheric data, rejecting attempts to override instructions or generate medical prescriptions.
- **Rate Limiting**: Sliding-window rate limiter per client IP on expensive endpoints (`/api/assistant`).
- **HTTP Security Headers**: Configured in `next.config.ts`:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(self)`

---

## 11. Vercel Deployment Instructions

BreatheWise is designed to deploy seamlessly on Vercel as a single unified project:

1. Push your code to your GitHub / GitLab / Bitbucket repository:
   ```bash
   git add .
   git commit -m "feat: complete BreatheWise urban air quality assistant"
   git push origin main
   ```
2. Log into your [Vercel Dashboard](https://vercel.com).
3. Click **"Add New..."** → **"Project"** and import your repository.
4. Framework Preset will automatically detect **Next.js**.
5. (Optional) In the **Environment Variables** section, add your AI key:
   - `OPENAI_API_KEY` or `GOOGLE_GENERATIVE_AI_API_KEY`
   - `AI_MODEL` (e.g. `gpt-4o-mini` or `gemini-1.5-flash`)
   *(If you omit these, BreatheWise will run smoothly using its built-in deterministic engine).*
6. Click **"Deploy"**.
7. Vercel will run `npm run build`, generate serverless Route Handlers, optimize static assets, and issue your production HTTPS domain.

---

## 12. Known Limitations & Future Roadmap

- **Atmospheric Model Resolution**: CAMS dispersion data has a grid resolution of ~0.4° (~40 km). Local micro-climates (e.g. standing directly next to an idling truck or street corner) may experience higher particle spikes than modeled regional background air.
- **Official CPCB Station Live Scraping**: Official CPCB ground monitoring station readings require authenticated API access and are currently distinguished from CAMS models to respect anti-scraping and access policies. Future releases will integrate official central pollution board OAuth access tokens when made publicly available.
- **Stateless Serverless Rate Limiting**: In-memory rate limiting functions per serverless container. For high-traffic enterprise production scaling across multiple edge regions, configure `UPSTASH_REDIS_REST_URL` as documented in `.env.example`.
