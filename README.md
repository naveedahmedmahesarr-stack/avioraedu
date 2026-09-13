# AVIORA EDU

Premium website for an education consultancy focused on **Germany** and selected European destinations (Italy, Poland, Portugal, Austria), serving students from Pakistan, India, the UAE, Saudi Arabia and Bangladesh.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · Three.js + React Three Fiber + Drei · Zod

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run typecheck` | Route type generation + `tsc` |
| `npm run lint` | ESLint (Next + React Compiler rules) |
| `npm run build:geo` | Regenerate `src/data/geo-region.json` from Natural Earth (world-atlas) |

## CONFIGURATION REQUIRED

Nothing below is faked. Until configured, the site shows an explicit configuration state instead.

| Feature | Variables | Behaviour when unset |
| --- | --- | --- |
| Admin dashboard `/admin` | `ADMIN_PASSWORD` (10+ chars), `ADMIN_SESSION_SECRET` (32+ chars) | Login page shows "configuration required"; no default password exists |
| WhatsApp number & message | Admin → **Business settings** (not env vars) | Floating button and contact card hidden when empty |
| Business email & phone | Admin → **Business settings** | Omitted from contact section/footer when empty |
| Real 3D Berlin (optional) | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — see **Google Cloud setup** below | Built-in 3D Berlin is shown; no requests to Google |
| Social links | `NEXT_PUBLIC_SOCIAL_*` | Icons are not rendered |
| Email notifications | `RESEND_API_KEY`, `CONSULTATION_TO_EMAIL`, `CONSULTATION_FROM_EMAIL` | Submissions are still stored and visible in admin |
| Content & media storage | `CONTENT_DIR`, `UPLOAD_DIR` | Defaults to `./.data/` (must be persistent and writable) |
| Canonical URLs / sitemap | `NEXT_PUBLIC_SITE_URL` | Falls back to localhost |
| Legal pages | Edit `src/app/legal/[doc]/page.tsx` | Highlighted "CONFIGURATION REQUIRED" placeholders; have a lawyer review |

## Google Cloud setup

The website uses exactly **one** Google Maps Platform service:

| API | Used for | Required? |
| --- | --- | --- |
| **Map Tiles API** (Photorealistic 3D Tiles) | Real photogrammetry Berlin in the hero's Berlin chapter | Optional — without it the built-in 3D Berlin is used |

Not used (do **not** enable): Maps JavaScript API, Places API, Routes API, Geocoding, Directions, Distance Matrix, Street View. The Europe map, routes and markers are built into the site from public-domain Natural Earth data. Fonts are self-hosted at build time.

1. Google Cloud Console → select the project → **Billing**: link an active billing account. Without billing Google answers every tile request with **HTTP 404 "Requested entity was not found"** (the previously seen `GoogleCloudAuth … 404`).
2. **APIs & Services → Library** → enable **Map Tiles API**.
3. **APIs & Services → Credentials** → create a key (or regenerate an exposed one) and restrict it:
   - Application restriction: **Websites** → `http://localhost:3100/*` (testing) and `https://YOUR-DOMAIN/*`
   - API restriction: **Map Tiles API** only
4. Put it in `.env.local` (never commit): `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...` — this key is browser-visible by design, which is why the restrictions above matter.
5. Rebuild and restart (`NEXT_PUBLIC_` values are baked in at build time).
6. Verify: scroll to the Berlin chapter → Network tab shows `tile.googleapis.com/v1/3dtiles/root.json` → **200**, real Berlin appears. Without billing/key the site logs one clear message (`Google Photorealistic 3D Tiles unavailable: HTTP …`) and shows the built-in Berlin — it never crashes.

To stop using Google entirely, delete the variable and rebuild — see `MIGRATION-GOOGLE-MAPS.md`.

## Deployment

1. `npm ci && npm run build`
2. Provide env vars on the host (`ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, optionally `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `CONTENT_DIR`, `UPLOAD_DIR`, Resend variables).
3. `npm start` behind HTTPS (a VPS, Docker host or any Node host with a persistent disk — see hosting note).
4. Set WhatsApp number, message, business email and phone in **/admin → Business settings**.

## What was fixed in the final production pass

- **GoogleCloudAuth 404:** caused by the Google Cloud project having no billing (Google returns 404 for Map Tiles requests). The library then retried via token refresh and threw a confusing error. The auth plugin now handles the first request itself: one request, one clear error with Google's real status, immediate fallback to the built-in Berlin, auto-refresh only after a real session exists. Billing itself must be enabled in Google Cloud (cannot be done in code).
- Google photo textures were blocked by the Content-Security-Policy (`blob:` missing in `connect-src`) → added.
- Auth plugin was re-created on every render (session lost → 400/403 tile errors → page crash) → plugin arguments memoised; tiles wrapped in an error boundary.
- Tiles rendered rotated 180° → corrected; fallback city no longer drawn on top of loaded tiles.
- Rendering softness removed: depth-of-field blur, adaptive DPR downscaling, half-resolution AO; tile LOD tightened, anisotropic filtering added.

### Hosting note (important)

The bundled storage driver (`src/lib/content/store.ts`) writes JSON files and uploads to local disk. That is real, working persistence on a VPS, Docker volume or any `next start` host. **Serverless platforms (e.g. Vercel) have a read-only filesystem**: pages will render seed content, but form submissions, admin edits and uploads will return a `503 configurationRequired` response. For serverless, implement the same `list / getById / create / update / remove` functions against a database (Postgres/Supabase) and the upload route against object storage (S3/R2). The rate limiter (`src/lib/rate-limit.ts`) is in-memory per instance; use Redis for multi-instance deployments.

## Architecture

```
src/
  app/                      Routes (all content pages are server components)
    api/consultation        POST — validated, rate-limited, honeypot, stored + optional email
    api/reviews             POST — public review submission (always pending)
    api/admin/*             Auth-protected CRUD, login/logout, uploads
    api/media/[file]        Serves uploaded media (with byte-range support for video)
    admin/                  Dashboard + login
    legal/[doc]             Privacy, Imprint, Terms, Cookie Policy
    sitemap.ts, robots.ts
  proxy.ts                  Protects /admin and /api/admin (Next 16 "proxy" = middleware)
  components/
    hero/                   Hero, Hero3D, EuropeGlobe, FlightRoute, Airplane3D,
                            GermanyExperience3D, Logo3D, Atmosphere, HeroFallback, LoadingScreen
    sections/               WhyGermany, GermanyExperience, DestinationExplorer, UniversityExplorer,
                            AdmissionTimeline, DreamStories, Reviews, TrustSection, AboutSection,
                            ConsultationForm, ConsultationCTA, FaqList, ...
    layout/                 Navbar, Footer, CookieBanner, WhatsAppButton, PageHeader
    brand/                  Logo (temporary typographic mark), CitySkyline artwork
    admin/                  Schema-driven admin dashboard
  lib/
    content/schemas.ts      Zod data models (Destination, University, DreamStory, Review, FAQ, Team, Homepage, Submission)
    content/store.ts        Storage driver
    content/seed.ts         Initial content
    auth.ts                 HMAC-signed session cookie (Web Crypto)
  data/geo-region.json      Pre-simplified Natural Earth borders (public domain)
```

### The 3D hero

- A story progress value `p` (0 → 1) drives everything. The first ~9 s play automatically (dark → Europe → routes); after that, scrolling through the 520svh pinned section drives the rest (Germany → Berlin → campus → brand reveal). The camera follows a Catmull-Rom path through keyframes defined in `Hero3D.tsx`.
- Country shapes are extruded from real borders. Germany is the gold primary destination; the four secondary destinations use a muted gold; source markets are blue.
- The aircraft is procedural geometry (no third-party model). Berlin's TV Tower and Brandenburg Gate are stylised originals, and the campus is generic (it depicts no real institution).
- **Performance:** the 3D bundle is code-split (`next/dynamic`, `ssr:false`), capped DPR with `AdaptiveDpr`, rendering paused when off-screen, lighter scene on mobile/coarse pointers, and no external HDR/texture downloads (environment lighting is generated).
- **Fallbacks:** without WebGL, with Save-Data on, or with `?3d=off`, an SVG map renders instead. With `prefers-reduced-motion`, auto-play, the flight loop and scroll smoothing are disabled.
- Depth of field is approximated with fog and a vignette rather than a post-processing pass, to keep the bundle light.

## Content honesty rules (built into the data model)

- **Dream Stories, Reviews and Team start empty.** Only real, consented content should be added through `/admin`.
- Public reviews are stored as `pending` and appear only after an admin approves them. "Verified" shows only when an admin ticks it.
- Dream Stories cannot be published unless "written consent obtained" is ticked.
- The seeded universities are **sample entries** (`sample: true`), labelled in the UI as "Sample data · no affiliation". Verify each one and untick `sample`, or delete them, before launch.
- No statistics, guarantees, partnerships or contact details are invented anywhere.

## Replacing the logo

The mark in `src/components/brand/Logo.tsx` (and its 3D twin in `src/components/hero/Logo3D.tsx`) is a temporary typographic identity. Swap the SVG, or render an `<Image>`, in `Logo.tsx`; every usage goes through that file.

## Imagery

No stock or licensed photography is bundled. Destinations use original line-art skylines until you upload images via **Admin → Destinations → Hero image / Gallery**. Only upload photos you hold rights to, and do not use university logos in a way that implies affiliation.
