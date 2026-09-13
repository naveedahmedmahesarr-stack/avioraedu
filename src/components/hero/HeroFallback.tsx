"use client";

import { useEffect, useState } from "react";
import { destinationMarkers, places, project, sourceMarkets, type GeoCountry } from "./geo";

/** Static-but-elegant SVG map used when WebGL is unavailable or data-saver is on. */
export function HeroFallback() {
  const [geo, setGeo] = useState<GeoCountry[] | null>(null);
  useEffect(() => {
    import("@/data/geo-region.json").then((m) => setGeo(m.default as GeoCountry[]));
  }, []);

  const pt = (lon: number, lat: number) => {
    const [x, y] = project(lon, lat);
    return [x * 60, -y * 60] as const;
  };
  const [bx, by] = pt(places.berlin.lon, places.berlin.lat);
  const fill = { primary: "#d8b674", destination: "#8c7650", source: "#1d3a64", other: "#12223d" };

  return (
    <div className="absolute inset-0 overflow-hidden bg-navy-950" aria-hidden>
      <svg viewBox="-480 -330 1100 580" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <defs>
          <radialGradient id="fb-glow">
            <stop offset="0" stopColor="#d8b674" stopOpacity=".35" />
            <stop offset="1" stopColor="#d8b674" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={bx} cy={by} r="120" fill="url(#fb-glow)" />
        {geo?.map((c) =>
          c.rings.map((r, i) => (
            <path
              key={`${c.id}-${i}`}
              d={`M${r.map(([lon, lat]) => pt(lon, lat).join(",")).join("L")}Z`}
              fill={fill[c.role]}
              stroke={c.role === "primary" ? "#f3e2b8" : "#5d7aa6"}
              strokeOpacity={c.role === "other" ? 0.25 : 0.6}
              strokeWidth={c.role === "primary" ? 1.2 : 0.5}
            />
          )),
        )}
        {sourceMarkets.map((s) => {
          const [sx, sy] = pt(places[s.key].lon, places[s.key].lat);
          const mx = (sx + bx) / 2;
          const my = (sy + by) / 2 - 60;
          return (
            <g key={s.key}>
              <path
                d={`M${sx},${sy} Q${mx},${my} ${bx},${by}`}
                fill="none"
                stroke="#9fb8dc"
                strokeWidth="1.4"
                strokeDasharray="6 5"
                pathLength={1}
                className="[stroke-dasharray:1] motion-safe:[animation:route-draw_3s_ease-out_both]"
              />
              <circle cx={sx} cy={sy} r="3.5" fill="#cfe0ff" />
            </g>
          );
        })}
        {destinationMarkers.map((d) => {
          const [x, y] = pt(places[d.key].lon, places[d.key].lat);
          return <circle key={d.key} cx={x} cy={y} r={d.primary ? 6 : 3.5} fill="#f3e2b8" stroke="#050d1c" strokeWidth="1.5" />;
        })}
      </svg>
    </div>
  );
}
