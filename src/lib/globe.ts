/**
 * Orthographic globe projection shared by the static globe image (/karachi-globe.svg) and the
 * Karachi feature overlay, so land, route and markers line up exactly.
 */
export const GLOBE = { lon0: 42, lat0: 34, R: 240 } as const;
const rad = Math.PI / 180;

export function project(lon: number, lat: number) {
  const { lon0, lat0, R } = GLOBE;
  const l = (lon - lon0) * rad;
  const p = lat * rad;
  const p0 = lat0 * rad;
  const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
  const x = R * Math.cos(p) * Math.sin(l);
  const y = -R * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l));
  return { x, y, visible: cosc > 0 };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Point on the visible disc; points behind the horizon are pushed onto the limb. */
function onDisc(lon: number, lat: number) {
  const pt = project(lon, lat);
  if (pt.visible) return pt;
  const d = Math.hypot(pt.x, pt.y) || 1;
  return { x: (pt.x / d) * GLOBE.R, y: (pt.y / d) * GLOBE.R, visible: false };
}

export function ringPath(ring: [number, number][], step = 2) {
  const pts = ring.filter((_, i) => i % step === 0 || i === ring.length - 1).map(([lon, lat]) => onDisc(lon, lat));
  if (pts.every((p) => !p.visible)) return "";
  return `M${pts.map((p) => `${r1(p.x)},${r1(p.y)}`).join("L")}Z`;
}

export function graticule(every = 15) {
  const parts: string[] = [];
  const line = (pts: { x: number; y: number; visible: boolean }[]) => {
    let seg: string[] = [];
    for (const p of pts) {
      if (p.visible) seg.push(`${r1(p.x)},${r1(p.y)}`);
      else if (seg.length) {
        if (seg.length > 1) parts.push(`M${seg.join("L")}`);
        seg = [];
      }
    }
    if (seg.length > 1) parts.push(`M${seg.join("L")}`);
  };
  for (let lon = -180; lon < 180; lon += every) line(Array.from({ length: 61 }, (_, i) => project(lon, -90 + i * 3)));
  for (let lat = -75; lat <= 75; lat += every) line(Array.from({ length: 121 }, (_, i) => project(-180 + i * 3, lat)));
  return parts.join("");
}

/** Great-circle route lifted above the surface (sin-shaped altitude) for a 3D feel. */
export function routePath(a: { lon: number; lat: number }, b: { lon: number; lat: number }, lift = 0.2, steps = 72) {
  const vec = (lon: number, lat: number) => [Math.cos(lat * rad) * Math.cos(lon * rad), Math.cos(lat * rad) * Math.sin(lon * rad), Math.sin(lat * rad)];
  const va = vec(a.lon, a.lat);
  const vb = vec(b.lon, b.lat);
  const dot = Math.min(1, Math.max(-1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]));
  const w = Math.acos(dot);
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const s1 = Math.sin((1 - t) * w) / Math.sin(w);
    const s2 = Math.sin(t * w) / Math.sin(w);
    const v = [s1 * va[0] + s2 * vb[0], s1 * va[1] + s2 * vb[1], s1 * va[2] + s2 * vb[2]];
    const lat = Math.asin(v[2]) / rad;
    const lon = Math.atan2(v[1], v[0]) / rad;
    const p = project(lon, lat);
    const k = 1 + lift * Math.sin(Math.PI * t);
    pts.push(`${r1(p.x * k)},${r1(p.y * k)}`);
  }
  return `M${pts.join("L")}`;
}

export const CITIES = {
  berlin: { lon: 13.405, lat: 52.52 },
  karachi: { lon: 67.0099, lat: 24.8607 },
} as const;
