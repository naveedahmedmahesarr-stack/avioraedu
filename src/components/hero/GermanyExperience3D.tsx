"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { worldAt } from "./space";
import { smoothstep, type ProgressRef } from "./anim";
import { BerlinCity, type LandmarkKey } from "./berlin/BerlinCity";
import { GoogleBerlin, type TilesStatus } from "./berlin/GoogleBerlin";
import { berlinSource } from "./berlin/landmarkSpace";

/** World units per metre for the Berlin model inside the hero map. */
export const BERLIN_SCALE = 0.0008;
/** Campus position relative to the Brandenburger Tor, in hero world units. */
export const CAMPUS_OFFSET = new THREE.Vector3(0.12, 0, 0.55);

// Optional real-Berlin photogrammetry (Google Photorealistic 3D Tiles). Without a key the
// hand-built procedural Berlin is used — it also remains the fallback if tiles fail to load.
const GOOGLE_TILES_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

// Real-tiles extent kept around the landmarks (metres from the Gate): Tiergarten → Alexanderplatz.
const CLIP = { x0: -1500, x1: 2600, z0: -1300, z1: 1100 };

/** Realistic central Berlin rising from the map, plus a generic university campus (no real institution). */
export function GermanyExperience3D({
  progress,
  compact,
  onLandmark,
}: {
  progress: ProgressRef;
  compact: boolean;
  onLandmark?: (key: LandmarkKey) => void;
}) {
  const berlin = useMemo(() => worldAt("berlin", 0.1), []);
  const city = useRef<THREE.Group>(null);
  const campus = useRef<THREE.Group>(null);
  const [tilesStatus, setTilesStatus] = useState<TilesStatus>(GOOGLE_TILES_KEY ? "loading" : "error");
  const [tilesActive, setTilesActive] = useState(false);
  const useTiles = Boolean(GOOGLE_TILES_KEY) && tilesStatus !== "error";
  const tilesReady = useTiles && tilesStatus === "ready";

  const clippingPlanes = useMemo(() => {
    const s = BERLIN_SCALE;
    return [
      new THREE.Plane(new THREE.Vector3(1, 0, 0), -(berlin.x + CLIP.x0 * s)),
      new THREE.Plane(new THREE.Vector3(-1, 0, 0), berlin.x + CLIP.x1 * s),
      new THREE.Plane(new THREE.Vector3(0, 0, 1), -(berlin.z + CLIP.z0 * s)),
      new THREE.Plane(new THREE.Vector3(0, 0, -1), berlin.z + CLIP.z1 * s),
    ];
  }, [berlin]);

  useFrame(() => {
    const p = progress.current;
    const rise = smoothstep(0.46, 0.62, p);
    if (city.current) {
      city.current.scale.set(BERLIN_SCALE, BERLIN_SCALE * Math.max(rise, 0.001), BERLIN_SCALE);
      city.current.visible = rise > 0.002;
    }
    const campusRise = smoothstep(0.7, 0.84, p);
    if (campus.current) {
      campus.current.scale.set(1, Math.max(campusRise, 0.001), 1);
      campus.current.visible = campusRise > 0.002;
    }
    // Only stream Google tiles while Berlin is on screen (keeps requests/cost down).
    const shouldLoad = p > 0.4;
    if (GOOGLE_TILES_KEY && shouldLoad !== tilesActive) setTilesActive(shouldLoad);
    berlinSource.current = tilesReady ? "tiles" : "procedural";
  });

  const stone = <meshStandardMaterial color="#c9b995" roughness={0.8} metalness={0.05} envMapIntensity={0.35} />;

  return (
    <group position={berlin}>
      <group ref={city} visible={false}>
        {useTiles && (
          <GoogleBerlin
            apiKey={GOOGLE_TILES_KEY}
            compact={compact}
            active={tilesActive}
            clippingPlanes={clippingPlanes}
            onStatus={setTilesStatus}
            onLandmark={tilesReady ? onLandmark : undefined}
          />
        )}
        {!tilesReady && <BerlinCity detail={compact ? "low" : "high"} animated lit={0.45} onLandmark={onLandmark} />}
      </group>

      <group ref={campus} position={CAMPUS_OFFSET}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
          <planeGeometry args={[0.3, 0.22]} />
          <meshStandardMaterial color="#20412f" roughness={1} />
        </mesh>
        <mesh position={[0, 0.03, -0.07]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.06, 0.05]} />
          {stone}
        </mesh>
        <mesh position={[0, 0.07, -0.042]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.045, 0.045, 0.012]} />
          {stone}
        </mesh>
        {[-3, -1, 1, 3].map((i) => (
          <mesh key={i} position={[i * 0.011, 0.028, -0.04]} castShadow>
            <cylinderGeometry args={[0.003, 0.003, 0.05, 10]} />
            {stone}
          </mesh>
        ))}
        <mesh position={[0.1, 0.035, 0.05]} castShadow>
          <boxGeometry args={[0.07, 0.07, 0.07]} />
          <meshPhysicalMaterial color="#6f8fbf" metalness={0.2} roughness={0.05} transmission={0.4} emissive="#e7cf9b" emissiveIntensity={0.25} />
        </mesh>
        <mesh position={[-0.1, 0.022, 0.05]} castShadow>
          <boxGeometry args={[0.07, 0.044, 0.08]} />
          <meshStandardMaterial color="#8f8570" roughness={0.75} envMapIntensity={0.35} />
        </mesh>
        {Array.from({ length: 10 }, (_, i) => (
          <mesh key={i} position={[-0.13 + i * 0.029, 0.018, 0.1]} castShadow>
            <coneGeometry args={[0.009, 0.036, 8]} />
            <meshStandardMaterial color="#2f5e43" roughness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
