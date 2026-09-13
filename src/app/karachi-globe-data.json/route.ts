import { feature, mesh } from "topojson-client";
import land110 from "world-atlas/land-110m.json";
import countries110 from "world-atlas/countries-110m.json";

/**
 * Compact world geometry for the interactive Karachi globe (Natural Earth via world-atlas, public domain).
 * Prerendered at build time; fetched lazily by the browser only when the globe scrolls into view.
 * Rings are flat [lon, lat, lon, lat, …] arrays rounded to 0.1°.
 */
export const dynamic = "force-static";

type Ring = [number, number][];
type Geometry = { type: string; coordinates: unknown };
type Feature = { id?: string | number; geometry: Geometry | null };

const r = (n: number) => Math.round(n * 10) / 10;
const flat = (ring: Ring) => ring.flatMap(([lon, lat]) => [r(lon), r(lat)]);

function rings(g: Geometry | null): Ring[] {
  if (!g) return [];
  if (g.type === "Polygon") return g.coordinates as Ring[];
  if (g.type === "MultiPolygon") return (g.coordinates as Ring[][]).flat();
  return [];
}

export function GET() {
  const landTopo = land110 as unknown as Parameters<typeof feature>[0];
  const countryTopo = countries110 as unknown as Parameters<typeof feature>[0];
  const objects = (landTopo as unknown as { objects: Record<string, never> }).objects;
  const cObjects = (countryTopo as unknown as { objects: Record<string, never> }).objects;

  const landFeatures = (feature(landTopo, objects.land) as unknown as { features: Feature[] }).features;
  // Antarctica is skipped: it sits beyond the horizon for this view and distorts limb-clamped fills.
  const land = landFeatures
    .flatMap((f) => rings(f.geometry))
    .filter((ring) => ring.some(([, lat]) => lat > -58))
    .map(flat);

  const countryFeatures = (feature(countryTopo, cObjects.countries) as unknown as { features: Feature[] }).features;
  const highlight = countryFeatures
    .filter((f) => String(f.id) === "276" || String(f.id) === "586") // Germany, Pakistan
    .flatMap((f) => rings(f.geometry))
    .map(flat);

  const borderMesh = mesh(countryTopo, cObjects.countries, (a: unknown, b: unknown) => a !== b) as unknown as { coordinates: Ring[] };
  const borders = borderMesh.coordinates.filter((line) => line.some(([, lat]) => lat > -58)).map(flat);

  return new Response(JSON.stringify({ land, borders, highlight }), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
  });
}
