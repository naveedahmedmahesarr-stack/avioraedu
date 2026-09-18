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
| WhatsApp | `NEXT_PUBLIC_WHATSAPP_NUMBER` (digits, intl format) | Floating button hidden; contact page shows notice |
| Contact email | `NEXT_PUBLIC_CONTACT_EMAIL` | Contact page shows notice |
| Social links | `NEXT_PUBLIC_SOCIAL_*` | Icons are not rendered |
| Email notifications | `RESEND_API_KEY`, `CONSULTATION_TO_EMAIL`, `CONSULTATION_FROM_EMAIL` | Submissions are still stored and visible in admin |
| Content & media storage | `CONTENT_DIR`, `UPLOAD_DIR` | Defaults to `./.data/` (must be persistent and writable) |
| Canonical URLs / sitemap | `NEXT_PUBLIC_SITE_URL` | Falls back to localhost |
| Legal pages | Edit `src/app/legal/[doc]/page.tsx` | Highlighted "CONFIGURATION REQUIRED" placeholders; have a lawyer review |

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


## Germany Insights (photos & videos)

- Public page: `/germany-insights` (also linked as **Insights** in the menu). The newest uploads also appear on the homepage ("Fresh from Germany").
- Admin: `/admin` → **Germany Insights**. Drag in photos (JPG/PNG/WebP/AVIF ≤ 15 MB) or videos (MP4/WebM/MOV ≤ 500 MB), pick a category, tick *Publish immediately* or publish later. Edit title, description, category, featured flag, sort order and video thumbnail; unpublish or delete (deleting also removes the stored files).
- Large photos are resized in the browser to 2560 px WebP; a WebP poster frame and duration are captured from every video before upload.
- Storage: with `BLOB_READ_WRITE_TOKEN` set (Vercel), files go straight from the browser to Vercel Blob (no 4.5 MB serverless limit) and all admin content is stored in Blob. Without it, the local-disk driver (`CONTENT_DIR`, `UPLOAD_DIR`) is used.
