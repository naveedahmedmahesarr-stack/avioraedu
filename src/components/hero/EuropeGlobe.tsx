"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import geoData from "@/data/geo-region.json";
import { project, type GeoCountry } from "./geo";
import { smoothstep, type ProgressRef } from "./anim";

const STYLE = {
  other: { depth: 0.012, color: "#12223d" },
  source: { depth: 0.022, color: "#1d3a64" },
  destination: { depth: 0.04, color: "#8c7650" },
  primary: { depth: 0.1, color: "#d8b674" },
} as const;

/**
 * Europe + source-market region rendered as extruded country shapes from
 * Natural Earth borders. Lies flat on the XZ plane (north = -Z).
 */
export function EuropeGlobe({ progress }: { progress: ProgressRef }) {
  const primaryMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const primaryEdge = useRef<THREE.LineBasicMaterial>(null);
  const destMat = useRef<THREE.MeshStandardMaterial>(null);

  const layers = useMemo(() => {
    const countries = geoData as GeoCountry[];
    const byRole = { other: [], source: [], destination: [], primary: [] } as Record<keyof typeof STYLE, THREE.BufferGeometry[]>;
    const edges = { other: [], source: [], destination: [], primary: [] } as Record<keyof typeof STYLE, number[]>;

    for (const c of countries) {
      const { depth } = STYLE[c.role];
      for (const ring of c.rings) {
        const pts = ring.map(([lon, lat]) => new THREE.Vector2(...project(lon, lat)));
        if (THREE.ShapeUtils.isClockWise(pts)) pts.reverse();
        const shape = new THREE.Shape(pts);
        const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 1 });
        g.deleteAttribute("uv");
        byRole[c.role].push(g);
        const e = edges[c.role];
        for (let i = 0; i < pts.length; i++) {
          const a = pts[i];
          const b = pts[(i + 1) % pts.length];
          e.push(a.x, a.y, depth + 0.001, b.x, b.y, depth + 0.001);
        }
      }
    }
    return (Object.keys(STYLE) as (keyof typeof STYLE)[]).map((role) => {
      const mesh = mergeGeometries(byRole[role], false);
      byRole[role].forEach((g) => g.dispose());
      const edge = new THREE.BufferGeometry();
      edge.setAttribute("position", new THREE.Float32BufferAttribute(edges[role], 3));
      return { role, mesh, edge };
    });
  }, []);

  useFrame(({ clock }) => {
    const p = progress.current;
    const glow = smoothstep(0.12, 0.3, p);
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 1.6);
    if (primaryMat.current) primaryMat.current.emissiveIntensity = 0.15 + glow * (0.35 + pulse * 0.25);
    if (primaryEdge.current) primaryEdge.current.opacity = 0.35 + glow * 0.65;
    if (destMat.current) destMat.current.emissiveIntensity = 0.05 + glow * 0.18;
  });

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {/* Ocean */}
      <mesh position={[2, 0, -0.002]} receiveShadow>
        <planeGeometry args={[80, 60]} />
        <meshStandardMaterial color="#071327" roughness={1} metalness={0} />
      </mesh>
      {layers.map(({ role, mesh, edge }) => (
        <group key={role}>
          {role === "primary" ? (
            <mesh geometry={mesh ?? undefined}>
              <meshPhysicalMaterial
                ref={primaryMat}
                color={STYLE.primary.color}
                metalness={0.95}
                roughness={0.24}
                clearcoat={1}
                clearcoatRoughness={0.25}
                emissive="#6b4d1a"
                emissiveIntensity={0.2}
              />
            </mesh>
          ) : role === "destination" ? (
            <mesh geometry={mesh ?? undefined}>
              <meshStandardMaterial ref={destMat} color={STYLE.destination.color} metalness={0.6} roughness={0.42} emissive="#4a3a1c" />
            </mesh>
          ) : (
            <mesh geometry={mesh ?? undefined}>
              <meshStandardMaterial color={STYLE[role].color} metalness={0.15} roughness={0.85} />
            </mesh>
          )}
          <lineSegments geometry={edge}>
            {role === "primary" ? (
              <lineBasicMaterial ref={primaryEdge} color="#f3e2b8" transparent opacity={0.6} />
            ) : (
              <lineBasicMaterial
                color={role === "destination" ? "#e7cf9b" : "#5d7aa6"}
                transparent
                opacity={role === "other" ? 0.22 : role === "source" ? 0.45 : 0.55}
              />
            )}
          </lineSegments>
        </group>
      ))}
    </group>
  );
}
