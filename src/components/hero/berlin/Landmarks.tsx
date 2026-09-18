"use client";
/* eslint-disable react-hooks/immutability -- imperative Three.js geometry/material animation inside R3F hooks */

import { useContext, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createFacadeMaterial, createPanelledSteelMaterial, germanFlagTexture } from "./materials";
import { CitySpaceContext } from "./BerlinCity";

/*
 * Berlin landmarks modelled in metres from published dimensions.
 * Brandenburger Tor ≈ 26 m to the top of the Quadriga, 12 Doric columns ≈ 15 m.
 * Reichstagsgebäude ≈ 137 × 97 m, corner towers ≈ 42 m, glass dome Ø 40 m / 23.5 m high.
 * Fernsehturm 368 m, sphere Ø 32 m centred ≈ 212 m.
 * Positions and overall sizes are unchanged; this file carries the surface detail.
 */

function flutedColumn(radius: number, height: number, flutes = 20) {
  const g = new THREE.CylinderGeometry(radius * 0.88, radius, height, flutes * 3, 6);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const z = p.getZ(i);
    const r = Math.hypot(x, z);
    if (r < 1e-3) continue;
    const a = Math.atan2(z, x);
    // Rounded flutes with sharp arrises, slight entasis along the height.
    const flute = Math.pow(Math.abs(Math.sin((a * flutes) / 2)), 0.6);
    const y = p.getY(i) / height + 0.5;
    const entasis = 1 + 0.025 * Math.sin(y * Math.PI * 0.9);
    const k = (1 - 0.055 * (1 - flute)) * entasis;
    p.setX(i, x * k);
    p.setZ(i, z * k);
  }
  g.computeVertexNormals();
  return g;
}

function useStone(key: string, base: string, windows = false, bay = 5, floor = 5) {
  const space = useContext(CitySpaceContext);
  return useMemo(
    () => createFacadeMaterial({ key, base, roof: "#6e6a62", windows, bay, floor, lit: 0.18, roughness: 0.93, stone: true }, space),
    [key, base, windows, bay, floor, space],
  );
}

// Weathered copper/bronze — matte with a slight metallic response, never glossy.
const patina = new THREE.MeshStandardMaterial({ color: "#4e7a67", metalness: 0.35, roughness: 0.62 });
const bronze = new THREE.MeshStandardMaterial({ color: "#56705f", metalness: 0.45, roughness: 0.55 });

function Horse({ z, rear }: { z: number; rear: boolean }) {
  return (
    <group position={[0.6, 0, z]}>
      <mesh material={bronze} position={[0, 1.95, 0]} rotation={[0, 0, Math.PI / 2 + (rear ? 0.25 : 0.08)]} castShadow>
        <capsuleGeometry args={[0.5, 1.5, 6, 14]} />
      </mesh>
      <mesh material={bronze} position={[-0.55, 1.75, 0]} castShadow>
        <sphereGeometry args={[0.55, 14, 10]} />
      </mesh>
      <mesh material={bronze} position={[0.95, 2.75, 0]} rotation={[0, 0, -0.75]} castShadow>
        <cylinderGeometry args={[0.2, 0.36, 1.3, 10]} />
      </mesh>
      <mesh material={bronze} position={[1.45, 3.2, 0]} rotation={[0, 0, -1.1]} castShadow>
        <capsuleGeometry args={[0.16, 0.55, 4, 8]} />
      </mesh>
      {/* mane */}
      <mesh material={bronze} position={[0.9, 3.0, 0]} rotation={[0, 0, -0.75]}>
        <boxGeometry args={[0.12, 1.0, 0.08]} />
      </mesh>
      {[
        [0.65, rear ? 0.55 : 0],
        [-0.65, 0],
      ].map(([x, lift], i) =>
        [-0.22, 0.22].map((lz) => (
          <mesh key={`${i}${lz}`} material={bronze} position={[x, 0.85 + lift * 0.6, lz]} rotation={[0, 0, lift ? -1.1 : 0]}>
            <cylinderGeometry args={[0.1, 0.07, 1.6, 8]} />
          </mesh>
        )),
      )}
    </group>
  );
}

export function BrandenburgGate() {
  const stone = useStone("gate", "#cdbd9c");
  const column = useMemo(() => flutedColumn(0.88, 13.4), []);
  // Column centres (z) — central passage wider than the four side passages.
  const zs = [-14.8, -9.25, -3.7, 3.7, 9.25, 14.8];

  return (
    <group>
      {/* stepped stylobate */}
      <mesh material={stone} position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[14, 0.3, 36]} />
      </mesh>
      {/* plinths, columns (with base torus and Doric capital) and the piers joining front and back rows */}
      {zs.map((z) => (
        <group key={z}>
          {[-5.2, 5.2].map((x) => (
            <group key={x} position={[x, 0, z]}>
              <mesh material={stone} position={[0, 0.55, 0]} castShadow receiveShadow>
                <boxGeometry args={[2.1, 0.8, 2.1]} />
              </mesh>
              <mesh material={stone} position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.9, 0.14, 8, 28]} />
              </mesh>
              <mesh geometry={column} material={stone} position={[0, 7.7, 0]} castShadow receiveShadow />
              {/* echinus + abacus */}
              <mesh material={stone} position={[0, 14.55, 0]} castShadow>
                <cylinderGeometry args={[1.05, 0.8, 0.45, 28]} />
              </mesh>
              <mesh material={stone} position={[0, 14.95, 0]} castShadow>
                <boxGeometry args={[2.3, 0.35, 2.3]} />
              </mesh>
            </group>
          ))}
          <mesh material={stone} position={[0, 7.4, z]} castShadow receiveShadow>
            <boxGeometry args={[8.6, 14.2, 1.3]} />
          </mesh>
          {/* recessed panel on each pier */}
          {[-1, 1].map((s) => (
            <mesh key={s} material={stone} position={[0, 7.4, z + s * 0.66]}>
              <boxGeometry args={[5.4, 9.5, 0.06]} />
            </mesh>
          ))}
        </group>
      ))}
      {/* architrave, triglyph frieze with metopes and a dentilled cornice */}
      <mesh material={stone} position={[0, 15.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[12.6, 1.4, 34]} />
      </mesh>
      <mesh material={stone} position={[0, 17.3, 0]} castShadow>
        <boxGeometry args={[12.2, 1.4, 33.6]} />
      </mesh>
      {[-1, 1].map((side) =>
        Array.from({ length: 23 }, (_, i) => (
          <mesh key={`${side}-${i}`} material={stone} position={[side * 6.15, 17.3, -16.2 + i * 1.47]}>
            <boxGeometry args={[0.2, 1.25, 0.55]} />
          </mesh>
        )),
      )}
      <mesh material={stone} position={[0, 18.2, 0]} castShadow>
        <boxGeometry args={[13.2, 0.35, 34.6]} />
      </mesh>
      {[-1, 1].map((side) =>
        Array.from({ length: 58 }, (_, i) => (
          <mesh key={`d${side}-${i}`} material={stone} position={[side * 6.72, 18.05, -17 + i * 0.595]}>
            <boxGeometry args={[0.18, 0.18, 0.3]} />
          </mesh>
        )),
      )}
      <mesh material={stone} position={[0, 18.55, 0]} castShadow>
        <boxGeometry args={[13.6, 0.45, 35]} />
      </mesh>
      {/* stepped attic with the Pompe relief band */}
      <mesh material={stone} position={[0, 19.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[10.6, 2.1, 26]} />
      </mesh>
      <mesh material={stone} position={[0, 21.7, 0]} castShadow>
        <boxGeometry args={[9.4, 1.8, 20]} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 5.31, 19.8, 0]}>
            <boxGeometry args={[0.05, 1.35, 20]} />
            <meshStandardMaterial color="#9f8f73" roughness={1} />
          </mesh>
          {Array.from({ length: 14 }, (_, i) => (
            <mesh key={i} material={stone} position={[side * 5.36, 19.75, -9.3 + i * 1.43]} rotation={[0, 0, (i % 3) * 0.15]}>
              <boxGeometry args={[0.14, 0.9 + (i % 2) * 0.25, 0.45]} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh material={stone} position={[0, 23, 0]} castShadow>
        <boxGeometry args={[6, 0.8, 8.6]} />
      </mesh>
      {/* Quadriga facing east, with Victoria and her staff */}
      <group position={[0, 23.4, 0]}>
        {[-2.1, -0.7, 0.7, 2.1].map((z, i) => (
          <Horse key={z} z={z} rear={i === 0 || i === 3} />
        ))}
        <mesh material={bronze} position={[-1.3, 1.5, 0]} castShadow>
          <boxGeometry args={[1.4, 1.2, 2.2]} />
        </mesh>
        {[-1.15, 1.15].map((z) => (
          <mesh key={z} material={bronze} position={[-1.3, 1.1, z]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.75, 0.09, 8, 24]} />
          </mesh>
        ))}
        <mesh material={patina} position={[-1.7, 3.3, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.48, 2.8, 14]} />
        </mesh>
        <mesh material={patina} position={[-1.7, 4.95, 0]}>
          <sphereGeometry args={[0.28, 14, 12]} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} material={patina} position={[-2.1, 4.3, s * 0.7]} rotation={[s * 0.5, 0, 0.3]}>
            <boxGeometry args={[0.1, 1.9, 1.0]} />
          </mesh>
        ))}
        <mesh material={patina} position={[-1.35, 5.2, 0.2]} rotation={[0, 0, -0.08]}>
          <cylinderGeometry args={[0.05, 0.05, 4.6, 6]} />
        </mesh>
        <mesh material={patina} position={[-1.15, 7.5, 0.2]}>
          <torusGeometry args={[0.45, 0.07, 8, 20]} />
        </mesh>
      </group>
      {/* flanking guardhouses with porticos */}
      {[-1, 1].map((s) => (
        <group key={s} position={[0, 0, s * 29]}>
          <mesh material={stone} position={[0, 5, 0]} castShadow receiveShadow>
            <boxGeometry args={[10, 10, 9]} />
          </mesh>
          <mesh material={stone} position={[0, 10.3, 0]} castShadow>
            <boxGeometry args={[11, 0.6, 10]} />
          </mesh>
          <mesh material={stone} position={[0, 10.8, 0]} castShadow>
            <boxGeometry args={[11.4, 0.4, 10.4]} />
          </mesh>
          {[-3.2, -1.1, 1.1, 3.2].map((x) => (
            <mesh key={x} geometry={column} material={stone} position={[x, 4.7, -s * 5.2]} scale={[0.5, 0.66, 0.5]} castShadow />
          ))}
          <mesh material={stone} position={[0, 3, -s * 9.5]} castShadow receiveShadow>
            <boxGeometry args={[4, 6, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Flag({ position, tex }: { position: [number, number, number]; tex: THREE.Texture }) {
  const flag = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.PlaneGeometry(5, 3, 12, 4), []);
  const rest = useMemo(() => Float32Array.from(geo.attributes.position.array), [geo]);
  useFrame(({ clock }) => {
    const m = flag.current;
    if (!m) return;
    // Cloth-like ripple increasing towards the free edge.
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = rest[i * 3] + 2.5;
      p.setZ(i, Math.sin(x * 1.6 - clock.elapsedTime * 3 + position[0]) * 0.12 * x);
    }
    p.needsUpdate = true;
    geo.computeVertexNormals();
  });
  return (
    <group position={position}>
      <mesh position={[0, 5, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 10, 8]} />
        <meshStandardMaterial color="#cfcfcf" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh ref={flag} geometry={geo} position={[2.5, 8.6, 0]}>
        <meshStandardMaterial map={tex} side={THREE.DoubleSide} roughness={0.95} />
      </mesh>
    </group>
  );
}

export function Reichstag({ showFlags = true }: { showFlags?: boolean }) {
  const walls = useStone("reichstag", "#bcae94", true, 5.4, 6.2);
  const plain = useStone("reichstag-plain", "#b3a58b");
  const column = useMemo(() => flutedColumn(1.05, 19), []);
  const flagTex = useMemo(() => (typeof document === "undefined" ? null : germanFlagTexture()), []);
  const { dome, ribs, ramp } = useMemo(() => {
    const prof: THREE.Vector2[] = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const a = t * (Math.PI / 2) * 0.9;
      prof.push(new THREE.Vector2(20 * Math.cos(a), (23.5 * Math.sin(a)) / Math.sin((Math.PI / 2) * 0.9)));
    }
    const dome = new THREE.LatheGeometry(prof, 72);
    const pts: number[] = [];
    for (let m = 0; m < 24; m++) {
      const a0 = (m / 24) * Math.PI * 2;
      for (let i = 0; i < prof.length - 1; i++) {
        const p0 = prof[i];
        const p1 = prof[i + 1];
        pts.push(Math.cos(a0) * p0.x, p0.y, Math.sin(a0) * p0.x, Math.cos(a0) * p1.x, p1.y, Math.sin(a0) * p1.x);
      }
    }
    for (let i = 1; i < prof.length; i += 1) {
      const p = prof[i];
      for (let s = 0; s < 72; s++) {
        const a0 = (s / 72) * Math.PI * 2;
        const a1 = ((s + 1) / 72) * Math.PI * 2;
        pts.push(Math.cos(a0) * p.x, p.y, Math.sin(a0) * p.x, Math.cos(a1) * p.x, p.y, Math.sin(a1) * p.x);
      }
    }
    const ribs = new THREE.BufferGeometry();
    ribs.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    const helix: THREE.Vector3[] = [];
    for (let i = 0; i <= 160; i++) {
      const t = i / 160;
      const y = 1 + t * 19;
      const r = 17.5 * Math.cos((y / 23.5) * (Math.PI / 2) * 0.9) - 0.8;
      helix.push(new THREE.Vector3(Math.cos(t * Math.PI * 4) * r, y, Math.sin(t * Math.PI * 4) * r));
    }
    const ramp = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(helix), 200, 0.45, 6, false);
    return { dome, ribs, ramp };
  }, []);

  // Giant-order pilasters articulating the long facades.
  const pilasters = useMemo(() => {
    const out: [number, number, number, number, number][] = [];
    for (let z = -60; z <= 60; z += 7.2) [-1, 1].forEach((s) => out.push([s * 45.3, 19, z, 0.7, 1.7]));
    for (let x = -22; x <= 22; x += 7.2) [-1, 1].forEach((s) => out.push([x, 19, s * 65.3, 1.7, 0.7]));
    return out;
  }, []);

  return (
    <group>
      {/* rusticated base and main body (long axis N–S, portico to the west) */}
      <mesh material={plain} position={[0, 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[97, 8, 137]} />
      </mesh>
      <mesh material={plain} position={[0, 8.2, 0]} castShadow>
        <boxGeometry args={[98, 0.6, 138]} />
      </mesh>
      <mesh material={walls} position={[0, 19, 0]} castShadow receiveShadow>
        <boxGeometry args={[90, 22, 130]} />
      </mesh>
      {pilasters.map(([x, y, z, sx, sz], i) => (
        <mesh key={i} material={plain} position={[x, y, z]} castShadow>
          <boxGeometry args={[sx, 21, sz]} />
        </mesh>
      ))}
      <mesh material={plain} position={[0, 30.3, 0]} castShadow>
        <boxGeometry args={[92, 1.2, 132]} />
      </mesh>
      <mesh material={plain} position={[0, 31.2, 0]} castShadow>
        <boxGeometry args={[93, 0.6, 133]} />
      </mesh>
      {/* four corner towers */}
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <group key={`${sx}${sz}`} position={[sx * 37, 0, sz * 57]}>
            <mesh material={walls} position={[0, 20.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[25, 41, 25]} />
            </mesh>
            {[-1, 1].flatMap((qx) =>
              [-1, 1].map((qz) => (
                <mesh key={`${qx}${qz}`} material={plain} position={[qx * 12.3, 20.5, qz * 12.3]} castShadow>
                  <boxGeometry args={[1.4, 41, 1.4]} />
                </mesh>
              )),
            )}
            <mesh material={plain} position={[0, 41.4, 0]} castShadow>
              <boxGeometry args={[27, 1.2, 27]} />
            </mesh>
            <mesh material={plain} position={[0, 42.3, 0]} castShadow>
              <boxGeometry args={[25.5, 0.8, 25.5]} />
            </mesh>
            {showFlags && flagTex && <Flag position={[0, 42.7, 0]} tex={flagTex} />}
          </group>
        )),
      )}
      {/* west portico: six columns with capitals, entablature, inscription, pediment and steps */}
      <group position={[-49.5, 0, 0]}>
        {[-15, -9, -3, 3, 9, 15].map((z) => (
          <group key={z} position={[-4, 0, z]}>
            <mesh geometry={column} material={plain} position={[0, 17.5, 0]} castShadow />
            <mesh material={plain} position={[0, 27.35, 0]} castShadow>
              <cylinderGeometry args={[1.55, 1.05, 1.3, 24]} />
            </mesh>
            <mesh material={plain} position={[0, 8.4, 0]}>
              <boxGeometry args={[2.6, 0.6, 2.6]} />
            </mesh>
          </group>
        ))}
        <mesh material={plain} position={[-2.5, 28.9, 0]} castShadow>
          <boxGeometry args={[8, 2.6, 38]} />
        </mesh>
        <mesh position={[-6.55, 28.9, 0]}>
          <boxGeometry args={[0.1, 0.9, 22]} />
          <meshStandardMaterial color="#3f3a2e" roughness={0.9} metalness={0.3} />
        </mesh>
        <mesh material={plain} position={[-2.5, 30.2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <extrudeGeometry
            args={[new THREE.Shape([new THREE.Vector2(-20, 0), new THREE.Vector2(20, 0), new THREE.Vector2(0, 7.5)]), { depth: 8, bevelEnabled: false }]}
          />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} material={plain} position={[-8 - i * 1.6, 7 - i * 1.8, 0]} receiveShadow>
            <boxGeometry args={[3, 1.8, 42 + i * 4]} />
          </mesh>
        ))}
      </group>
      {/* Norman Foster's glass dome with mirror cone and spiral ramp */}
      <group position={[0, 31.5, 0]}>
        <mesh position={[0, 1, 0]} castShadow>
          <cylinderGeometry args={[21, 21.5, 2, 64]} />
          <meshStandardMaterial color="#8a8883" metalness={0.5} roughness={0.45} />
        </mesh>
        <mesh geometry={dome} position={[0, 2, 0]} renderOrder={2}>
          <meshPhysicalMaterial
            color="#e3edf2"
            metalness={0}
            roughness={0.04}
            ior={1.5}
            specularIntensity={1}
            clearcoat={1}
            transparent
            opacity={0.22}
            side={THREE.DoubleSide}
            envMapIntensity={2.4}
            depthWrite={false}
          />
        </mesh>
        <lineSegments geometry={ribs} position={[0, 2, 0]}>
          <lineBasicMaterial color="#cfd5d8" transparent opacity={0.9} />
        </lineSegments>
        <mesh position={[0, 11, 0]}>
          <coneGeometry args={[8.5, 18, 48, 6, true]} />
          <meshStandardMaterial color="#e6e9ec" metalness={1} roughness={0.12} side={THREE.DoubleSide} flatShading />
        </mesh>
        <mesh geometry={ramp} position={[0, 2, 0]}>
          <meshStandardMaterial color="#c9cdd0" metalness={0.45} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

export function Fernsehturm() {
  const space = useContext(CitySpaceContext);
  const { shaft, base } = useMemo(() => {
    const prof: THREE.Vector2[] = [];
    for (let i = 0; i <= 60; i++) {
      const y = (i / 60) * 250;
      const r = 5 + 11 * Math.pow(1 - y / 250, 3.2);
      prof.push(new THREE.Vector2(r, y));
    }
    const shaft = new THREE.LatheGeometry(prof, 64);
    // Folded concrete pavilion roof around the foot of the tower.
    const wedge = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(26, -9), new THREE.Vector2(26, 9)]);
    const base = new THREE.ExtrudeGeometry(wedge, { depth: 3, bevelEnabled: true, bevelThickness: 0.3, bevelSize: 0.3, bevelSegments: 2 });
    base.rotateX(-Math.PI / 2);
    return { shaft, base };
  }, []);
  // Board-marked concrete: weathered, streaked, no windows.
  const concrete = useMemo(
    () => createFacadeMaterial({ key: "tv-concrete", base: "#d3d1cb", windows: false, bay: 1.2, floor: 1.2, roughness: 0.85, stone: false }, space),
    [space],
  );
  const steel = useMemo(() => createPanelledSteelMaterial(), []);
  const light = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ clock }) => {
    if (light.current) light.current.color.setRGB(0.4 + 0.6 * (Math.sin(clock.elapsedTime * 2.2) > 0.3 ? 1 : 0.2), 0.05, 0.03);
  });

  return (
    <group>
      <mesh position={[0, 5, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[30, 34, 10, 6]} />
        <meshStandardMaterial color="#2f3945" metalness={0.3} roughness={0.12} envMapIntensity={1.3} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} geometry={base} material={concrete} position={[0, 10, 0]} rotation={[0, (i / 6) * Math.PI * 2, 0.12]} castShadow receiveShadow />
      ))}
      <mesh geometry={shaft} material={concrete} castShadow receiveShadow />
      {/* telecafé sphere: stainless-steel triangular panels (seams + per-panel reflectance) */}
      <mesh position={[0, 212, 0]} material={steel} castShadow>
        <sphereGeometry args={[16, 96, 64]} />
      </mesh>
      {/* glazed observation and restaurant bands with mullions */}
      <mesh position={[0, 205.5, 0]}>
        <cylinderGeometry args={[14.9, 14.3, 4.2, 96, 1, true]} />
        <meshStandardMaterial color="#1a232d" metalness={0.25} roughness={0.05} emissive="#ffb866" emissiveIntensity={0.12} envMapIntensity={1.6} />
      </mesh>
      <mesh position={[0, 211.2, 0]}>
        <cylinderGeometry args={[16.15, 16.1, 2.6, 96, 1, true]} />
        <meshStandardMaterial color="#1a232d" metalness={0.25} roughness={0.05} emissive="#ffb866" emissiveIntensity={0.12} envMapIntensity={1.6} />
      </mesh>
      {Array.from({ length: 48 }, (_, i) => {
        const a = (i / 48) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <mesh position={[14.65, 205.5, 0]} rotation={[0, 0, 0.14]}>
              <boxGeometry args={[0.18, 4.3, 0.18]} />
              <meshStandardMaterial color="#9ea3a8" metalness={0.8} roughness={0.35} />
            </mesh>
            <mesh position={[16.2, 211.2, 0]}>
              <boxGeometry args={[0.16, 2.7, 0.16]} />
              <meshStandardMaterial color="#9ea3a8" metalness={0.8} roughness={0.35} />
            </mesh>
          </group>
        );
      })}
      <mesh material={concrete} position={[0, 240, 0]} castShadow>
        <cylinderGeometry args={[3.4, 4.6, 24, 32]} />
      </mesh>
      {/* antenna with red/white aviation banding and platform rings */}
      {Array.from({ length: 12 }, (_, i) => {
        const h = 118 / 12;
        const r0 = 2.4 - (i / 12) * 1.5;
        return (
          <mesh key={i} position={[0, 252 + h * i + h / 2, 0]} castShadow>
            <cylinderGeometry args={[r0 - 0.12, r0, h, 20]} />
            <meshStandardMaterial color={i >= 6 && i % 2 === 0 ? "#b8322b" : "#e6e5df"} roughness={0.7} metalness={0.1} />
          </mesh>
        );
      })}
      {[262, 290, 318].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[2.9, 2.9, 0.4, 24]} />
          <meshStandardMaterial color="#8e9297" metalness={0.8} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 368.5, 0]}>
        <sphereGeometry args={[1.6, 8, 8]} />
        <meshBasicMaterial ref={light} color="#ff2a1a" toneMapped={false} />
      </mesh>
    </group>
  );
}

export function BerlinerDom() {
  const stone = useStone("dom", "#8c806c", true, 6, 8);
  return (
    <group>
      <mesh material={stone} position={[0, 17, 0]} castShadow receiveShadow>
        <boxGeometry args={[73, 34, 114]} />
      </mesh>
      <mesh material={stone} position={[0, 34.4, 0]} castShadow>
        <boxGeometry args={[75, 0.8, 116]} />
      </mesh>
      <mesh material={stone} position={[0, 41, 0]} castShadow>
        <cylinderGeometry args={[20, 21, 14, 48]} />
      </mesh>
      <mesh material={patina} position={[0, 48, 0]} scale={[1, 1.35, 1]} castShadow>
        <sphereGeometry args={[20, 64, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      {Array.from({ length: 16 }, (_, i) => (
        <mesh key={i} material={patina} rotation={[0, (i / 16) * Math.PI * 2, 0]} position={[0, 48, 0]} scale={[1, 1.35, 1]}>
          <torusGeometry args={[20.05, 0.25, 6, 40, Math.PI / 2]} />
        </mesh>
      ))}
      <mesh material={patina} position={[0, 80, 0]} castShadow>
        <cylinderGeometry args={[2.6, 3.2, 10, 16]} />
      </mesh>
      <mesh position={[0, 87, 0]}>
        <coneGeometry args={[1.2, 5, 12]} />
        <meshStandardMaterial color="#c9a65e" metalness={1} roughness={0.35} />
      </mesh>
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <group key={`${sx}${sz}`} position={[sx * 30, 0, sz * 50]}>
            <mesh material={stone} position={[0, 24, 0]} castShadow>
              <boxGeometry args={[13, 48, 13]} />
            </mesh>
            <mesh material={patina} position={[0, 48, 0]} scale={[1, 1.4, 1]} castShadow>
              <sphereGeometry args={[6.5, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            </mesh>
          </group>
        )),
      )}
    </group>
  );
}

export function Siegessaeule() {
  const pedestal = useStone("siegessaeule", "#8e3a33");
  const shaftStone = useStone("siegessaeule-shaft", "#b8aa8a");
  return (
    <group>
      <mesh material={pedestal} position={[0, 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[18, 8, 18]} />
      </mesh>
      <mesh material={shaftStone} position={[0, 11, 0]} castShadow>
        <cylinderGeometry args={[7, 7.5, 6, 32]} />
      </mesh>
      <mesh material={shaftStone} position={[0, 36, 0]} castShadow>
        <cylinderGeometry args={[2.6, 3.4, 44, 32]} />
      </mesh>
      {[22, 32, 42].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <torusGeometry args={[3.2, 0.35, 10, 32]} />
          <meshStandardMaterial color="#b8903c" metalness={1} roughness={0.38} />
        </mesh>
      ))}
      <mesh position={[0, 62, 0]} castShadow>
        <cylinderGeometry args={[0.8, 1.4, 8, 14]} />
        <meshStandardMaterial color="#c9a14a" metalness={1} roughness={0.3} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, 64, s * 1.6]} rotation={[s * 0.5, 0, 0]}>
          <boxGeometry args={[0.3, 4.5, 2.5]} />
          <meshStandardMaterial color="#c9a14a" metalness={1} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}
