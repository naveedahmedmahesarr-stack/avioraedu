import geo from "@/data/geo-region.json";
import { GLOBE, graticule, ringPath } from "@/lib/globe";

/** Static globe artwork for the Karachi feature, prerendered at build time and cached. */
export const dynamic = "force-static";

type Country = { id: string; name: string; rings: [number, number][][] };

export function GET() {
  const countries = geo as unknown as Country[];
  const highlight = new Set(["Germany", "Pakistan"]);
  const land = countries
    .filter((c) => !highlight.has(c.name))
    .flatMap((c) => c.rings.map((r) => ringPath(r)))
    .join("");
  const marked = countries
    .filter((c) => highlight.has(c.name))
    .flatMap((c) => c.rings.map((r) => ringPath(r, 1)))
    .join("");
  const R = GLOBE.R;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-260 -260 520 520">
<defs>
<radialGradient id="ocean" cx="38%" cy="30%" r="78%"><stop offset="0" stop-color="#1c3860"/><stop offset=".55" stop-color="#0c1d38"/><stop offset="1" stop-color="#050d1c"/></radialGradient>
<radialGradient id="shade" cx="30%" cy="25%" r="85%"><stop offset=".55" stop-color="#050d1c" stop-opacity="0"/><stop offset="1" stop-color="#02060d" stop-opacity=".75"/></radialGradient>
<radialGradient id="sheen" cx="32%" cy="22%" r="40%"><stop offset="0" stop-color="#f3e2b8" stop-opacity=".16"/><stop offset="1" stop-color="#f3e2b8" stop-opacity="0"/></radialGradient>
<clipPath id="disc"><circle r="${R}"/></clipPath>
</defs>
<circle r="${R}" fill="url(#ocean)"/>
<g clip-path="url(#disc)">
<path d="${graticule()}" fill="none" stroke="#9fb1cc" stroke-opacity=".13" stroke-width=".6"/>
<path d="${land}" fill="#15294a" stroke="#d8b674" stroke-opacity=".22" stroke-width=".45" stroke-linejoin="round"/>
<path d="${marked}" fill="#8c7650" fill-opacity=".85" stroke="#f3e2b8" stroke-opacity=".8" stroke-width=".7" stroke-linejoin="round"/>
</g>
<circle r="${R}" fill="url(#shade)"/>
<circle r="${R}" fill="url(#sheen)"/>
<circle r="${R}" fill="none" stroke="#e7cf9b" stroke-opacity=".35" stroke-width="1"/>
</svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" } });
}
