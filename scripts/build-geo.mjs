// Extracts a compact, pre-simplified geography file for the hero map from
// Natural Earth (via world-atlas, public domain). Run: npm run build:geo
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { feature } from "topojson-client";

const topo = JSON.parse(
  readFileSync(new URL("../node_modules/world-atlas/countries-50m.json", import.meta.url)),
);
const countries = feature(topo, topo.objects.countries).features;

// ISO 3166-1 numeric codes
const ROLE = {
  "276": "primary", // Germany
  "380": "destination", // Italy
  "616": "destination", // Poland
  "620": "destination", // Portugal
  "040": "destination", // Austria
  "586": "source", // Pakistan
  "356": "source", // India
  "784": "source", // UAE
  "682": "source", // Saudi Arabia
  "050": "source", // Bangladesh
};

const BBOX = { minLon: -28, maxLon: 98, minLat: 4, maxLat: 72 };

function ringInBox(ring) {
  return ring.some(
    ([lon, lat]) => lon >= BBOX.minLon && lon <= BBOX.maxLon && lat >= BBOX.minLat && lat <= BBOX.maxLat,
  );
}

function simplify(ring, step) {
  const out = [];
  for (let i = 0; i < ring.length; i += step) {
    const p = [Math.round(ring[i][0] * 100) / 100, Math.round(ring[i][1] * 100) / 100];
    const last = out[out.length - 1];
    if (!last || last[0] !== p[0] || last[1] !== p[1]) out.push(p);
  }
  return out;
}

const result = [];
for (const f of countries) {
  const id = String(f.id ?? "");
  const role = ROLE[id] ?? "other";
  const polys = f.geometry?.type === "Polygon" ? [f.geometry.coordinates] : f.geometry?.coordinates ?? [];
  const rings = [];
  for (const poly of polys) {
    const outer = poly[0];
    if (!outer || outer.length < 8 || !ringInBox(outer)) continue;
    // Clip far-east Russia etc. so the map does not stretch across the globe.
    if (outer.every(([lon]) => lon > BBOX.maxLon + 10)) continue;
    const step = role === "other" ? 2 : 1;
    const s = simplify(outer, step).filter(([lon]) => lon <= 140);
    if (s.length >= 6) rings.push(s);
  }
  if (rings.length) result.push({ id, name: f.properties.name, role, rings });
}

mkdirSync(new URL("../src/data/", import.meta.url), { recursive: true });
writeFileSync(new URL("../src/data/geo-region.json", import.meta.url), JSON.stringify(result));
console.log(`geo-region.json: ${result.length} countries`);
