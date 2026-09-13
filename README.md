# AVIORA EDU

Bilingual (English / German) website for a Berlin-based education consultancy focused on **Germany** and selected European destinations (Italy, Poland, Portugal, Austria), serving students from Pakistan, India, Bangladesh, the UAE, Saudi Arabia, Qatar, Oman and Bahrain. A presence in **Karachi, Pakistan** is planned and shown as "opening soon".

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

## Languages (English / German)

- **English** lives at the root (`/about`), **German** under `/de` (`/de/about`). `src/proxy.ts` rewrites `/de/*` onto the same routes and sets an internal locale header; any locale header sent by a browser is discarded. `/de/admin` and `/de/api/*` redirect to the unprefixed, protected paths.
- Every page has a self-referencing canonical plus `hreflang` alternates (`en`, `de`, `x-default`); the sitemap lists both languages with alternates. English uses American spelling; German uses the formal "Sie".
- **Interface text:** `src/i18n/ui.ts`. **Page copy:** a `copy = { en, de }` object at the top of each page. **Code-authored content:** `src/lib/content/*.de.ts` (country pages, guides, services) and `studentSupport.ts`.
- **Admin-managed content** has German fields next to the English ones (e.g. *Description* and *Description (German)*) for the homepage, destinations, universities, FAQs and team. An empty German field falls back to English. Reviews and Dream Stories are shown in the language they were written in.
- Stored form values stay in English (Admin, email notifications); only labels are translated.
- The language switcher (EN | DE in the header and mobile menu) does a full page load so `<html lang>`, metadata and all content switch together.

## Pages

| Page | Notes |
| --- | --- |
| `/founder` | Naveed Ahmed — Founder & Lead Immigration Consultant · Berlin, Germany · German & Pakistani · 10+ years. Facts come from **Admin → Team** (nationality, experience, German versions). No photograph — a CSS monogram is used. |
| `/student-support` | Pre-departure, accommodation, arrival, Anmeldung, bank, SIM, settlement and academic orientation. Worded as guidance/support; explicitly no guarantees. |
| Home → Karachi feature | "Karachi, Pakistan — Opening soon" with a 3D-tilted globe and animated Berlin → Karachi route. Server-rendered SVG + CSS (no WebGL, no client JS); the globe artwork is prerendered at `/karachi-globe.svg`. Animations stop under `prefers-reduced-motion`. No address, date, staff or office imagery. |
| `/legal` | Legal center: Impressum, Privacy Policy / Datenschutzerklärung, Terms, Disclaimer, Cookie Policy, and **Pakistan — planned Karachi presence**. Numbered sections, version date, *Print / Save as PDF*. |
| `/study-in-germany/from/[country]` | Eight country pages in both languages. |
| `/services`, `/guides/*`, `/universities`, `/destinations/*` | Unchanged features, now bilingual. |

## CONFIGURATION REQUIRED

Nothing below is faked. Until configured, the site shows an explicit configuration state or a clearly marked placeholder.

| Feature | Where | Behaviour when unset |
| --- | --- | --- |
| Admin dashboard `/admin` | `ADMIN_PASSWORD` (10+ chars), `ADMIN_SESSION_SECRET` (32+ chars) | Login page shows "configuration required"; no default password exists |
| Business name, email, phone, WhatsApp (+ German message), website URL, social links | Admin → **Settings · Contact information** | Channels are hidden when empty |
| Location | Admin → Settings → city/country (currently Berlin, Germany). Street is optional and stays empty for a home-based business | Only "Berlin, Germany" is shown; no local-business structured data without a street |
| **Legal details** (Impressum/privacy address, legal form, VAT ID, register entry, dispute-resolution statement) | Admin → Settings → *Legal — …* fields | Legal pages show highlighted "To complete before publishing" placeholders and stay `noindex` |
| **Pakistan details** (entity name, SECP number, NTN, Karachi address) | Admin → Settings → *Pakistan — …* fields | Placeholders; the page states that no office or branch operates yet |
| Legal texts | `src/app/legal/docs.tsx` | Have a lawyer review before launch (see "Legal review" below) |
| Real 3D Berlin (optional) | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — see **Google Cloud setup** | Built-in 3D Berlin is shown; no requests to Google |
| Email notifications | `RESEND_API_KEY`, `CONSULTATION_FROM_EMAIL` (recipient defaults to the Admin business email) | Submissions are still stored and visible in Admin |
| Content & media storage | `CONTENT_DIR`, `UPLOAD_DIR` | Defaults to `./.data/` (must be persistent and writable) |
| Canonical URLs / sitemap | Admin → Website URL, or `NEXT_PUBLIC_SITE_URL` | Falls back to localhost |

### Legal review (owner action)

- **Impressum address:** § 5 DDG requires a postal address where legal documents can be served — also for a home-based business. A business/service address can be used instead of the home address.
- **"Lead Immigration Consultant":** individual legal advice on residence law is regulated by the German Legal Services Act (RDG). The Disclaimer states that AVIORA EDU is not a law firm; have the title and wording confirmed by a lawyer.
- **Google 3D tiles and consent** (TDDDG/GDPR), hosting provider, email provider and retention periods must be completed in the privacy policy.
- **Pakistan:** company/branch registration, tax registration and any licensing requirements must be confirmed by a lawyer qualified in Pakistan before the Karachi presence opens.

## Google Cloud setup

The website uses exactly **one** Google Maps Platform service:

| API | Used for | Required? |
| --- | --- | --- |
| **Map Tiles API** (Photorealistic 3D Tiles) | Real photogrammetry Berlin in the hero's Berlin chapter | Optional — without it the built-in 3D Berlin is used |

Not used (do **not** enable): Maps JavaScript API, Places API, Routes API, Geocoding, Directions, Distance Matrix, Street View. The Europe map, routes, markers and the Karachi globe are built into the site from public-domain Natural Earth data. Fonts are self-hosted at build time.

1. Google Cloud Console → select the project → **Billing**: link an active billing account. Without billing Google answers every tile request with **HTTP 404 "Requested entity was not found"**.
2. **APIs & Services → Library** → enable **Map Tiles API**.
3. **APIs & Services → Credentials** → create a key (or regenerate an exposed one) and restrict it:
   - Application restriction: **Websites** → `https://YOUR-DOMAIN/*` (plus a local testing origin if needed)
   - API restriction: **Map Tiles API** only
4. Put it in the host's environment (never commit): `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...` — this key is browser-visible by design, which is why the restrictions above matter.
5. Rebuild and restart (`NEXT_PUBLIC_` values are baked in at build time).

To stop using Google entirely, delete the variable and rebuild — see `MIGRATION-GOOGLE-MAPS.md`.

## Deployment

1. `npm ci && npm run build`
2. Provide env vars on the host (`ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`, `CONTENT_DIR`, `UPLOAD_DIR`, optionally `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and Resend variables).
3. `npm start` behind HTTPS on a Node host with a **persistent disk** (see hosting note).
4. In **/admin → Settings**, confirm contact details and fill in the legal fields; add German texts where you edit content.
5. Submit `https://YOUR-DOMAIN/sitemap.xml` in Google Search Console (it contains both languages).

### Hosting note (important)

The bundled storage driver (`src/lib/content/store.ts`) writes JSON files and uploads to local disk. That is real, working persistence on a VPS, Docker volume or any `next start` host with a persistent disk. **Serverless platforms (e.g. Vercel) have a read-only filesystem**: pages will render seed content, but form submissions, admin edits and uploads will return a `503 configurationRequired` response. The rate limiter (`src/lib/rate-limit.ts`) is in-memory per instance; use Redis for multi-instance deployments.

## Architecture

```
src/
  app/                      Routes (content pages are server components)
    api/consultation        POST — validated, rate-limited, honeypot, stored + optional email
    api/reviews             POST — public review submission (always pending)
    api/admin/*             Auth-protected CRUD, login/logout, uploads
    api/media/[file]        Serves uploaded media (with byte-range support for video)
    admin/                  Dashboard + login (English only)
    founder/, student-support/, services/, study-in-germany/from/[country]
    legal/                  Legal center, [doc] renderer, docs.tsx (all legal texts, EN + DE)
    karachi-globe.svg/      Prerendered globe artwork for the Karachi feature
    sitemap.ts, robots.ts
  proxy.ts                  /de routing, CSRF origin check, admin protection
  i18n/                     locales, ui dictionary, server/client locale helpers, metadata, content fallback
  components/
    hero/                   3D hero (Hero3D, EuropeGlobe, flights, Berlin), HeroFallback, LoadingScreen
    sections/               KarachiFeature, StudentSupportTeaser, FounderTeaser, ServicesList, UniversityExplorer, …
    layout/                 Navbar, LanguageSwitcher, Footer, CookieBanner, WhatsAppButton, PageHeader
    brand/                  Logo, Monogram3D, CitySkyline artwork
    admin/                  Schema-driven admin dashboard
  lib/
    content/                schemas, store, seed, markets(.de), guides(.de), services(.de), studentSupport
    globe.ts                Orthographic projection shared by the globe image and overlay
    site.ts                 Central business identity from Admin settings
    auth.ts                 HMAC-signed session cookie (Web Crypto)
  data/geo-region.json      Pre-simplified Natural Earth borders (public domain)
```

## Content honesty rules

- **Reviews and Dream Stories start empty.** Only real, consented content should be added through `/admin`; public reviews appear only after approval.
- The **founder profile** contains only facts supplied by the owner (name, role, Berlin, German & Pakistani nationality, 10+ years of experience). No photo, degrees, licenses or awards.
- **Universities** are informational entries. The Admin flag "Details still to double-check" is internal and not shown publicly; no partnership, representation or admission guarantee is claimed.
- **Karachi** is shown only as "opening soon" — no address, date, staff or registration details until they exist.
- No statistics, guarantees, partnerships, offices or credentials are invented anywhere.

## Replacing the logo

The mark in `src/components/brand/Logo.tsx` (and its 3D twin in `src/components/hero/Logo3D.tsx`) is the typographic identity. Swap the SVG, or render an `<Image>`, in `Logo.tsx`; every usage goes through that file.

## Imagery

No stock or licensed photography is bundled. Destinations use original line-art skylines until you upload images via **Admin → Destinations → Hero image / Gallery**. Only upload photos you hold rights to, and do not use university logos in a way that implies affiliation.
