# Google Maps Platform — dependency audit, independence & rollback

_Audit date: 2026-09-13_

## 1. What depends on Google Maps Platform

A full search of `src/`, `public/`, `scripts/`, `next.config.ts`, `package.json` and env files found **one** Google Maps Platform dependency:

| Feature | Google service | Where |
|---|---|---|
| Real photogrammetry Berlin in the hero's Berlin chapter | **Map Tiles API — Photorealistic 3D Tiles** (`tile.googleapis.com`) | `src/components/hero/berlin/GoogleBerlin.tsx`, key check in `src/components/hero/GermanyExperience3D.tsx`, CSP entry in `next.config.ts`, npm package `3d-tiles-renderer`, env var `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` |

**Not used anywhere:** Maps JavaScript API, Static Maps, Places, Geocoding, Directions, Distance Matrix, Street View, Google-hosted map images or marker assets.

**Already independent (no Google at runtime):**
- Europe/Germany 3D map, borders, routes and markers — bundled Natural Earth data (public domain) in `src/data/geo-region.json`, coordinates in `src/components/hero/geo.ts`.
- The six aircraft, routes, labels, camera animation, campus, logo — code-generated in `src/components/hero/`.
- Built-in 3D Berlin (Brandenburger Tor, Reichstag, Fernsehturm, streets, cars, people) — `src/components/hero/berlin/`.
- Fonts: `next/font/google` downloads Cormorant Garamond & Manrope **at build time** and self-hosts them. Not Maps Platform, no billing; the build machine needs internet.
- 3D decoder files are self-hosted in `public/draco/`.

## 2. Legal constraint

Google's Map Tiles API terms do not permit downloading, caching or self-hosting Photorealistic 3D Tiles for use outside the API. They were **not** copied. Without the API the photogrammetry Berlin cannot legally be reproduced, so the website uses its own built-in 3D Berlin instead (the existing, fully tested fallback). That is the only visual difference: the Berlin chapter shows the modelled city instead of Google's scanned city.

A legal open-data path to real Berlin buildings exists (Berlin's official 3D city model, LoD2 with textures, published under _Datenlizenz Deutschland – Namensnennung 2.0_). It would need a separate conversion project and is not part of this migration.

## 3. How independence works

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` empty/absent → Google code is never used; zero requests to Google.
- Key present but Google rejects it (billing disabled, key deleted, quota, outage) → the tiles report an error or a React error boundary catches it, and the built-in Berlin stays on screen. The page never crashes.

## 4. Environment variables that can be removed after cancellation

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (in `.env.local` and your hosting provider's environment settings)

No other Google variables exist.

## 5. Steps before cancelling Google Maps billing

1. Remove the line `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...` from `.env.local` (and from hosting env settings).
2. Rebuild and restart: `npm run build && npm start` (or restart `npm run dev`). `NEXT_PUBLIC_` values are baked in at build time, so a rebuild is required.
3. Open the site and scroll to the Berlin chapter: the built-in Berlin must show and the browser Network tab must show no `tile.googleapis.com` requests.
4. Then disable billing / delete the key in Google Cloud Console (APIs & Services → Credentials).
5. Optional clean-up once you are sure you will not re-enable it: remove `https://tile.googleapis.com` from `connect-src` in `next.config.ts`. Leaving it has no effect.

## 6. Rollback

Backups: `~/Downloads/aviora-edu-backups/20260913-012600/`
- `aviora-edu-original-full.zip` — whole project before this migration (includes `.env.local`)
- `config/` — `.env.local`, `.env.example`, `next.config.ts`, `package.json`, `package-lock.json`
- `content-data/` — admin content (settings, submissions, reviews)
- `assets-public-and-geo.zip` — `public/`, geo data, icon

To restore Google 3D Berlin: put `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<key>` back into `.env.local` (billing must be active), rebuild, restart.
To restore everything: unzip `aviora-edu-original-full.zip` over a copy of the project, run `npm install`, `npm run build`.
