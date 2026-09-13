"use client";

import { createContext, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import {
  canopyGeometry,
  carVariants,
  createCitySpace,
  createFacadeMaterial,
  createFoliageMaterial,
  createGroundMaterial,
  radialFadeTexture,
  rng,
  type CitySpace,
} from "./materials";
import { BerlinerDom, BrandenburgGate, Fernsehturm, Reichstag, Siegessaeule } from "./Landmarks";
import { StreetLife } from "./StreetLife";

/** Lets landmark materials map their surface detail in city metres. */
export const CitySpaceContext = createContext<CitySpace | undefined>(undefined);

export type LandmarkKey = "gate" | "reichstag" | "tower";

/*
 * Central Berlin in metres, origin = Brandenburger Tor, +X = east, +Z = south.
 * Relative directions follow the real city: Reichstag ~260 m north-west of the Gate,
 * Unter den Linden running east to the Dom and Alexanderplatz, Tiergarten to the west,
 * the Spree to the north. East–west distances beyond Pariser Platz are compressed
 * (~0.37×) so the Gate, Reichstag and Fernsehturm share one cinematic frame.
 */
export const BERLIN_LANDMARKS = {
  gate: new THREE.Vector3(0, 0, 0),
  reichstag: new THREE.Vector3(-100, 0, -256),
  tower: new THREE.Vector3(800, 0, -170),
  dom: new THREE.Vector3(640, 0, -95),
  column: new THREE.Vector3(-640, 0, 0),
};

type Rect = [x0: number, x1: number, z0: number, z1: number];

const DISTRICTS: Rect[] = [
  [40, 185, 72, 150],
  [40, 185, -150, -72],
  [215, 505, 34, 150],
  [215, 505, -150, -34],
  [535, 690, 34, 150],
  [215, 505, 175, 420],
  [535, 900, 175, 420],
  [40, 505, -300, -175],
  [535, 690, -270, -175],
  [720, 1010, 34, 150],
  [920, 1010, 175, 420],
  [200, 420, -520, -420],
];

// Berlin plaster and sandstone tones: warm ochres, greys and off-whites.
const PALETTE = ["#d9cfbd", "#cbbfa7", "#bcae96", "#e3ddd0", "#a99a83", "#c6b9a4", "#9ea5aa", "#d2c4ad", "#c9b18f", "#b7b3a9"];
const ROOFS = ["#5b5f64", "#4a4d52", "#6a6d70", "#7a4b3c", "#3f4246", "#585450"];

type Side = "n" | "s" | "w" | "e" | "solid";
type Wall = { p: [number, number, number]; s: [number, number, number]; c: string; solid: boolean; side: Side; box: Rect };

// Facade grid used by the shader for the Pariser Platz frontages (no per-building variety there,
// so the sills and window hoods below align exactly with the shaded windows).
const BAY = 4.2;
const FLOOR = 3.6;

function buildBlocks(r: () => number) {
  const walls: Wall[] = [];
  const gap = 22;
  for (const [x0, x1, z0, z1] of DISTRICTS) {
    const W = x1 - x0;
    const D = z1 - z0;
    const nx = Math.max(1, Math.round((W + gap) / 150));
    const nz = Math.max(1, Math.round((D + gap) / 125));
    const bw = (W - gap * (nx - 1)) / nx;
    const bd = (D - gap * (nz - 1)) / nz;
    for (let i = 0; i < nx; i++) {
      for (let j = 0; j < nz; j++) {
        const bx0 = x0 + i * (bw + gap);
        const bz0 = z0 + j * (bd + gap);
        const box: Rect = [bx0, bx0 + bw, bz0, bz0 + bd];
        const base = r() > 0.93 ? 34 + r() * 12 : 21 + r() * 7;
        const c = PALETTE[Math.floor(r() * PALETTE.length)];
        const d = Math.min(17, Math.min(bw, bd) / 2.6);
        if (Math.min(bw, bd) < 48) {
          walls.push({ p: [bx0 + bw / 2, base / 2, bz0 + bd / 2], s: [bw, base, bd], c, solid: true, side: "solid", box });
          continue;
        }
        const h = () => base + (r() - 0.5) * 4;
        const h1 = h();
        const h2 = h();
        const h3 = h();
        const h4 = h();
        const pick = () => PALETTE[Math.floor(r() * PALETTE.length)];
        walls.push({ p: [bx0 + bw / 2, h1 / 2, bz0 + d / 2], s: [bw, h1, d], c, solid: false, side: "n", box });
        walls.push({ p: [bx0 + bw / 2, h2 / 2, bz0 + bd - d / 2], s: [bw, h2, d], c: pick(), solid: false, side: "s", box });
        walls.push({ p: [bx0 + d / 2, h3 / 2, bz0 + bd / 2], s: [d, h3, bd - 2 * d], c, solid: false, side: "w", box });
        walls.push({ p: [bx0 + bw - d / 2, h4 / 2, bz0 + bd / 2], s: [d, h4, bd - 2 * d], c: pick(), solid: false, side: "e", box });
      }
    }
  }
  return walls;
}

const isPariserPlatz = (w: Wall) => w.p[0] < 200 && Math.abs(w.p[2]) < 170;

/** Real protruding sills and window hoods on the outer faces of the Pariser Platz buildings. */
function windowDetail(walls: Wall[]) {
  const sills: { p: [number, number, number]; s: [number, number, number]; c: string }[] = [];
  const hoods: typeof sills = [];
  for (const w of walls) {
    if (w.side === "solid") continue;
    const h = w.s[1];
    const floors = Math.floor(h / FLOOR);
    const [bx0, bx1, bz0, bz1] = w.box;
    const alongX = w.side === "n" || w.side === "s";
    const a = alongX ? w.p[0] - w.s[0] / 2 : w.p[2] - w.s[2] / 2;
    const b = alongX ? w.p[0] + w.s[0] / 2 : w.p[2] + w.s[2] / 2;
    const face = { n: bz0, s: bz1, w: bx0, e: bx1 }[w.side];
    const out = w.side === "n" || w.side === "w" ? -1 : 1;
    for (let k = Math.ceil(a / BAY); k < Math.floor(b / BAY); k++) {
      const u = (k + 0.5) * BAY;
      for (let j = 1; j < floors; j++) {
        if ((j + 0.84) * FLOOR > h - 0.6) continue;
        const sill = (j + 0.25) * FLOOR;
        const hood = (j + 0.845) * FLOOR;
        if (alongX) {
          sills.push({ p: [u, sill, face + out * 0.14], s: [2.45, 0.13, 0.3], c: w.c });
          hoods.push({ p: [u, hood, face + out * 0.1], s: [2.6, 0.2, 0.22], c: w.c });
        } else {
          sills.push({ p: [face + out * 0.14, sill, u], s: [0.3, 0.13, 2.45], c: w.c });
          hoods.push({ p: [face + out * 0.1, hood, u], s: [0.22, 0.2, 2.6], c: w.c });
        }
      }
    }
  }
  return { sills, hoods };
}

function scatter(r: () => number, rect: Rect, count: number, avoid?: (x: number, z: number) => boolean) {
  const out: [number, number][] = [];
  let guard = 0;
  while (out.length < count && guard++ < count * 6) {
    const x = rect[0] + r() * (rect[1] - rect[0]);
    const z = rect[2] + r() * (rect[3] - rect[2]);
    if (avoid?.(x, z)) continue;
    out.push([x, z]);
  }
  return out;
}

function riverGeometry() {
  const curve = new THREE.CatmullRomCurve3(
    [
      [-900, -330],
      [-560, -300],
      [-360, -420],
      [-80, -400],
      [180, -360],
      [470, -320],
      [700, -280],
      [900, -360],
      [1200, -330],
    ].map(([x, z]) => new THREE.Vector3(x, 0, z)),
  );
  const pts = curve.getPoints(160);
  const pos: number[] = [];
  const idx: number[] = [];
  pts.forEach((p, i) => {
    const t = curve.getTangent(i / (pts.length - 1));
    const n = new THREE.Vector3(-t.z, 0, t.x).multiplyScalar(26);
    pos.push(p.x + n.x, 0, p.z + n.z, p.x - n.x, 0, p.z - n.z);
    if (i < pts.length - 1) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Mansard roof profile (unit), extruded along X. */
function roofGeometry() {
  const s = new THREE.Shape([new THREE.Vector2(-0.5, 0), new THREE.Vector2(0.5, 0), new THREE.Vector2(0.3, 0.72), new THREE.Vector2(-0.3, 0.72)]);
  const g = new THREE.ExtrudeGeometry(s, { depth: 1, bevelEnabled: false });
  g.translate(0, 0, -0.5);
  g.rotateY(Math.PI / 2);
  return g;
}

/** Unit branch: base at origin, grows along +Y. */
function branchGeometry() {
  const g = new THREE.CylinderGeometry(0.35, 1, 1, 5);
  g.translate(0, 0.5, 0);
  return g;
}

const LANES = [
  { x0: 60, x1: 1000, z: -22, dir: 1 },
  { x0: 60, x1: 1000, z: 22, dir: -1 },
  { x0: -900, x1: -30, z: -12, dir: -1 },
  { x0: -900, x1: -30, z: 12, dir: 1 },
  { x0: -450, x1: 450, z: -15, dir: 1, ns: true, x: -18 },
  { x0: -450, x1: 450, z: 15, dir: -1, ns: true, x: -2 },
];

type Inst = { p: [number, number, number]; s: [number, number, number]; c?: string; q?: THREE.Quaternion };

function fillInstances(mesh: THREE.InstancedMesh | null, items: Inst[]) {
  if (!mesh) return;
  const m = new THREE.Matrix4();
  const id = new THREE.Quaternion();
  const col = new THREE.Color();
  items.forEach((it, i) => {
    m.compose(new THREE.Vector3(...it.p), it.q ?? id, new THREE.Vector3(...it.s));
    mesh.setMatrixAt(i, m);
    if (it.c) mesh.setColorAt(i, col.set(it.c));
  });
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.computeBoundingSphere();
}

export function BerlinCity({
  detail = "high",
  animated = true,
  lit = 0.35,
  onLandmark,
}: {
  detail?: "high" | "low";
  animated?: boolean;
  lit?: number;
  onLandmark?: (key: LandmarkKey) => void;
}) {
  const high = detail === "high";
  const root = useRef<THREE.Group>(null);
  const blocksRef = useRef<THREE.InstancedMesh>(null);
  const pariserRef = useRef<THREE.InstancedMesh>(null);
  const sillsRef = useRef<THREE.InstancedMesh>(null);
  const hoodsRef = useRef<THREE.InstancedMesh>(null);
  const roofsRef = useRef<THREE.InstancedMesh>(null);
  const chimneysRef = useRef<THREE.InstancedMesh>(null);
  const treesRef = useRef<THREE.InstancedMesh>(null);
  const trunksRef = useRef<THREE.InstancedMesh>(null);
  const branchesRef = useRef<THREE.InstancedMesh>(null);
  const stelaeRef = useRef<THREE.InstancedMesh>(null);
  const carParts = useRef<(THREE.InstancedMesh | null)[][]>([[], [], []]);
  const space = useMemo(() => createCitySpace(), []);

  const data = useMemo(() => {
    const r = rng(11);
    const allWalls = buildBlocks(r);
    const walls = allWalls.filter((w) => !isPariserPlatz(w));
    const pariser = allWalls.filter(isPariserPlatz);
    const windows = high ? windowDetail(pariser) : { sills: [], hoods: [] };
    const nearLandmark = (x: number, z: number) =>
      Math.hypot(x - BERLIN_LANDMARKS.reichstag.x, z - BERLIN_LANDMARKS.reichstag.z) < 120 ||
      Math.hypot(x - BERLIN_LANDMARKS.column.x, z) < 60 ||
      Math.abs(z) < 34 ||
      (x > -40 && x < 40) ||
      // keep the classic view corridor along Straße des 17. Juni open towards the Gate
      (x > -560 && x < 40 && Math.abs(z) < 210 - (x + 560) * 0.1);
    const trees: { x: number; z: number; s: number }[] = [];
    const tiergarten = scatter(r, [-900, -40, 34, 460], high ? 820 : 260, nearLandmark);
    const north = scatter(r, [-900, -330, -300, -34], high ? 360 : 110, nearLandmark);
    const lawnEdge = scatter(r, [-330, 30, -150, -40], high ? 60 : 20, nearLandmark);
    [...tiergarten, ...north, ...lawnEdge].forEach(([x, z]) => trees.push({ x, z, s: 5 + r() * 5 }));
    // Linden: four rows along Unter den Linden
    for (let x = 200; x < 530; x += high ? 11 : 22) [-11, 11].forEach((z) => trees.push({ x, z, s: 4.2 + r() }));
    for (let x = 60; x < 700; x += high ? 13 : 26) [-36, 36].forEach((z) => trees.push({ x, z: z + (r() - 0.5) * 2, s: 4 + r() }));
    for (let x = -900; x < -520; x += high ? 16 : 32) [-30, 30].forEach((z) => trees.push({ x, z, s: 5 + r() * 2 }));
    const stelae: { x: number; z: number; h: number }[] = [];
    for (let i = 0; i < (high ? 24 : 12); i++) {
      for (let j = 0; j < (high ? 18 : 9); j++) {
        const x = 18 + i * (high ? 6.6 : 13.2);
        const z = 205 + j * (high ? 7.2 : 14.4);
        const h = 0.4 + 3.8 * (0.5 + 0.5 * Math.sin(i * 0.45) * Math.cos(j * 0.5)) * (0.7 + 0.3 * r());
        stelae.push({ x, z, h });
      }
    }
    const perVariant = [0, 0, 0];
    const cars = Array.from({ length: high ? 70 : 0 }, () => {
      const lane = LANES[Math.floor(r() * LANES.length)];
      const v = r() < 0.45 ? 0 : r() < 0.6 ? 1 : 2;
      return {
        lane,
        t: r(),
        speed: 0.012 + r() * 0.01,
        c: ["#e8e8e8", "#1c1c1c", "#6b7a88", "#9c2b25", "#d8d2c0", "#26374d", "#4a4f55", "#f2f0ea"][Math.floor(r() * 8)],
        v,
        vi: perVariant[v]++,
      };
    });
    // Mansard roofs on perimeter-block wings, rooftop chimneys / plant rooms.
    const roofs: { p: [number, number, number]; s: [number, number, number]; rotY: number; c: string }[] = [];
    const chimneys: [number, number, number, number][] = [];
    const rr = rng(23);
    allWalls.forEach((w) => {
      const alongX = w.s[0] >= w.s[2];
      const len = alongX ? w.s[0] : w.s[2];
      const depth = alongX ? w.s[2] : w.s[0];
      const top = w.p[1] + w.s[1] / 2;
      if (!w.solid || depth < 30) {
        roofs.push({ p: [w.p[0], top, w.p[2]], s: [len, Math.min(6.5, depth * 0.42), depth], rotY: alongX ? 0 : Math.PI / 2, c: ROOFS[Math.floor(rr() * ROOFS.length)] });
      }
      const n = Math.floor(len / 22);
      for (let k = 0; k < n; k++) {
        if (rr() > 0.55) continue;
        const t = (k + 0.5) / n - 0.5;
        const cx = alongX ? w.p[0] + t * len : w.p[0] + (rr() - 0.5) * depth * 0.3;
        const cz = alongX ? w.p[2] + (rr() - 0.5) * depth * 0.3 : w.p[2] + t * len;
        chimneys.push([cx, top + 4 + rr() * 2, cz, 0.9 + rr() * 1.4]);
      }
    });
    return { walls, pariser, windows, trees, stelae, cars, perVariant, roofs, chimneys };
  }, [high]);

  const mats = useMemo(
    () => ({
      facade: createFacadeMaterial({ key: `facade-${lit}`, base: "#ffffff", roof: "#56595e", glass: "#1b2530", lit, variety: true }, space),
      facadeFixed: createFacadeMaterial({ key: `facade-fixed-${lit}`, base: "#ffffff", roof: "#56595e", glass: "#1b2530", lit, bay: BAY, floor: FLOOR }, space),
      trim: createFacadeMaterial({ key: "trim", base: "#ffffff", windows: false, roughness: 0.85 }, space),
      glass: createFacadeMaterial({ key: `glass-${lit}`, base: "#aab4ba", roof: "#6f7479", glass: "#243442", bay: 1.9, floor: 3.3, lit: lit * 0.8, roughness: 0.4 }, space),
      concrete: createFacadeMaterial({ key: `plattenbau-${lit}`, base: "#c9c7c0", roof: "#6f7275", glass: "#28303a", bay: 3, floor: 2.9, lit }, space),
      stelae: createFacadeMaterial({ key: "stelae", base: "#8f8d88", windows: false, roughness: 0.93 }, space),
      asphalt: createGroundMaterial("asphalt", "#4a4a48", { alphaMap: radialFadeTexture(), transparent: true, depthWrite: false }),
      grass: createGroundMaterial("grass", "#34502f"),
      lawn: createGroundMaterial("grass", "#587540"),
      paving: createGroundMaterial("paving", "#948b7f"),
      gravel: createGroundMaterial("gravel", "#7a7266"),
      plaza: createGroundMaterial("paving", "#7f7a71"),
      sidewalk: createGroundMaterial("paving", "#8c877e"),
      foliage: createFoliageMaterial(),
      canopy: canopyGeometry(),
      branch: branchGeometry(),
      roof: roofGeometry(),
      cars: carVariants(),
      river: riverGeometry(),
    }),
    [lit, space],
  );

  // Keep material patterns in city metres regardless of the parent scale/rise animation.
  useFrame(() => {
    const g = root.current;
    if (!g) return;
    g.updateWorldMatrix(true, false);
    space.value.copy(g.matrixWorld).invert();
  });

  useLayoutEffect(() => {
    const up = new THREE.Vector3(0, 1, 0);
    fillInstances(
      blocksRef.current,
      data.walls.map((w) => ({ p: w.p, s: w.s, c: w.c })),
    );
    fillInstances(
      pariserRef.current,
      data.pariser.map((w) => ({ p: w.p, s: w.s, c: w.c })),
    );
    fillInstances(sillsRef.current, data.windows.sills);
    fillInstances(hoodsRef.current, data.windows.hoods);
    fillInstances(
      roofsRef.current,
      data.roofs.map((rf) => ({ p: rf.p, s: rf.s, c: rf.c, q: new THREE.Quaternion().setFromAxisAngle(up, rf.rotY) })),
    );
    fillInstances(
      chimneysRef.current,
      data.chimneys.map(([x, y, z, s]) => ({ p: [x, y, z], s: [s, 3.5, s * 1.4] })),
    );
    fillInstances(
      stelaeRef.current,
      data.stelae.map((s) => ({ p: [s.x, s.h / 2, s.z], s: [2.38, s.h, 0.95] })),
    );
    if (treesRef.current && trunksRef.current && branchesRef.current) {
      const r = rng(5);
      const m = new THREE.Matrix4();
      const q = new THREE.Quaternion();
      const col = new THREE.Color();
      data.trees.forEach((t, i) => {
        const cy = t.s * 1.25 + 2;
        const sx = t.s * (0.85 + r() * 0.3);
        const sz = t.s * (0.85 + r() * 0.3);
        m.compose(new THREE.Vector3(t.x, cy, t.z), q.setFromEuler(new THREE.Euler(0, r() * 6, 0)), new THREE.Vector3(sx, t.s * (0.82 + r() * 0.25), sz));
        treesRef.current!.setMatrixAt(i, m);
        // Summer linden / oak / plane tones — muted, not saturated.
        treesRef.current!.setColorAt(i, col.setHSL(0.2 + r() * 0.08, 0.26 + r() * 0.14, 0.2 + r() * 0.09));
        const trunkH = Math.max(1.5, cy - t.s * 0.55);
        m.compose(new THREE.Vector3(t.x, trunkH / 2, t.z), q.identity(), new THREE.Vector3(t.s * 0.075, trunkH, t.s * 0.075));
        trunksRef.current!.setMatrixAt(i, m);
        // Three limbs forking from the upper trunk into the canopy.
        for (let b = 0; b < 3; b++) {
          const yaw = (b / 3) * Math.PI * 2 + r();
          q.setFromEuler(new THREE.Euler(0.55 + r() * 0.25, yaw, 0, "YXZ"));
          m.compose(new THREE.Vector3(t.x, trunkH * 0.82, t.z), q, new THREE.Vector3(t.s * 0.035, t.s * 0.75, t.s * 0.035));
          branchesRef.current!.setMatrixAt(i * 3 + b, m);
        }
      });
      treesRef.current.instanceMatrix.needsUpdate = true;
      trunksRef.current.instanceMatrix.needsUpdate = true;
      branchesRef.current.instanceMatrix.needsUpdate = true;
      if (treesRef.current.instanceColor) treesRef.current.instanceColor.needsUpdate = true;
      treesRef.current.computeBoundingSphere();
      trunksRef.current.computeBoundingSphere();
      branchesRef.current.computeBoundingSphere();
    }
    const col = new THREE.Color();
    data.cars.forEach((c) => carParts.current[c.v][0]?.setColorAt(c.vi, col.set(c.c)));
    carParts.current.forEach((parts) => {
      const body = parts[0];
      if (body?.instanceColor) body.instanceColor.needsUpdate = true;
    });
  }, [data]);

  const carMatrix = useMemo(() => new THREE.Matrix4(), []);
  const carQuat = useMemo(() => new THREE.Quaternion(), []);
  const carPos = useMemo(() => new THREE.Vector3(), []);
  const carScale = useMemo(() => new THREE.Vector3(1, 1, 1), []);
  const yAxis = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  useFrame((_, dt) => {
    if (!data.cars.length) return;
    data.cars.forEach((c) => {
      if (animated) c.t = (c.t + dt * c.speed * c.lane.dir + 1) % 1;
      const along = c.lane.x0 + (c.lane.x1 - c.lane.x0) * c.t;
      // Same lane motion as before; vehicles face their direction of travel.
      if (c.lane.ns) {
        carPos.set(c.lane.x!, 1, along);
        carQuat.setFromAxisAngle(yAxis, (c.lane.dir > 0 ? -Math.PI : Math.PI) / 2);
      } else {
        carPos.set(along, 1, c.lane.z);
        carQuat.setFromAxisAngle(yAxis, c.lane.dir > 0 ? 0 : Math.PI);
      }
      carMatrix.compose(carPos, carQuat, carScale);
      carParts.current[c.v].forEach((p) => p?.setMatrixAt(c.vi, carMatrix));
    });
    carParts.current.forEach((parts) =>
      parts.forEach((p) => {
        if (p) p.instanceMatrix.needsUpdate = true;
      }),
    );
  });

  const landmarkProps = (key: LandmarkKey) =>
    onLandmark
      ? {
          onClick: (e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            onLandmark(key);
          },
          onPointerOver: (e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          },
          onPointerOut: () => {
            document.body.style.cursor = "";
          },
        }
      : {};

  return (
    <CitySpaceContext.Provider value={space}>
      <group ref={root}>
        {/* urban asphalt ground, fading softly into the surrounding landscape */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[100, 0.2, 0]} material={mats.asphalt} receiveShadow>
          <planeGeometry args={[2600, 1500]} />
        </mesh>
        {/* Tiergarten and Platz der Republik */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-470, 0.6, 180]} material={mats.grass} receiveShadow>
          <planeGeometry args={[860, 330]} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-560, 0.6, -160]} material={mats.grass} receiveShadow>
          <planeGeometry args={[680, 250]} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-240, 0.7, -240]} material={mats.lawn} receiveShadow>
          <planeGeometry args={[180, 190]} />
        </mesh>
        {/* Pariser Platz, Unter den Linden promenade, Alexanderplatz paving */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[105, 0.8, 0]} material={mats.paving} receiveShadow>
          <planeGeometry args={[150, 130]} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[530, 0.8, 0]} material={mats.gravel} receiveShadow>
          <planeGeometry args={[700, 14]} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[860, 0.8, -150]} material={mats.plaza} receiveShadow>
          <planeGeometry args={[300, 300]} />
        </mesh>
        {/* sidewalks with kerbs along Unter den Linden (roadway itself unchanged) */}
        {[-1, 1].map((s) => (
          <group key={s}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[545, 0.55, s * 31]} material={mats.sidewalk} receiveShadow>
              <planeGeometry args={[890, 6]} />
            </mesh>
            <mesh position={[545, 0.4, s * 27.9]} receiveShadow>
              <boxGeometry args={[890, 0.3, 0.3]} />
              <meshStandardMaterial color="#a8a39a" roughness={0.85} />
            </mesh>
            <mesh position={[-465, 0.45, s * 23]} receiveShadow>
              <boxGeometry args={[850, 0.25, 0.3]} />
              <meshStandardMaterial color="#a8a39a" roughness={0.85} />
            </mesh>
          </group>
        ))}
        {/* road markings on the main axes */}
        {[
          [470, 0, 880, 0.6],
          [-470, 0, 860, 0.6],
        ].map(([x, z, w, t], i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.9, z]}>
            <planeGeometry args={[w, t]} />
            <meshBasicMaterial color="#d9d4c7" transparent opacity={0.35} />
          </mesh>
        ))}
        {/* Spree */}
        <mesh geometry={mats.river} position={[0, 0.5, 0]} receiveShadow>
          <meshStandardMaterial color="#223a4a" metalness={0.2} roughness={0.08} envMapIntensity={1.6} />
        </mesh>

        <instancedMesh ref={blocksRef} args={[undefined, mats.facade, data.walls.length]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
        </instancedMesh>
        <instancedMesh ref={pariserRef} args={[undefined, mats.facadeFixed, data.pariser.length]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
        </instancedMesh>
        {data.windows.sills.length > 0 && (
          <>
            <instancedMesh ref={sillsRef} args={[undefined, mats.trim, data.windows.sills.length]} castShadow receiveShadow>
              <boxGeometry args={[1, 1, 1]} />
            </instancedMesh>
            <instancedMesh ref={hoodsRef} args={[undefined, mats.trim, data.windows.hoods.length]} castShadow receiveShadow>
              <boxGeometry args={[1, 1, 1]} />
            </instancedMesh>
          </>
        )}
        <instancedMesh ref={roofsRef} args={[mats.roof, undefined, data.roofs.length]} castShadow receiveShadow>
          <meshStandardMaterial roughness={0.72} metalness={0.25} />
        </instancedMesh>
        {high && (
          <instancedMesh ref={chimneysRef} args={[undefined, undefined, data.chimneys.length]} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#8a7a6c" roughness={0.9} />
          </instancedMesh>
        )}
        <instancedMesh ref={trunksRef} args={[undefined, undefined, data.trees.length]} castShadow={high}>
          <cylinderGeometry args={[0.55, 1, 1, 7]} />
          <meshStandardMaterial color="#3f352c" roughness={0.97} />
        </instancedMesh>
        <instancedMesh ref={branchesRef} args={[mats.branch, undefined, data.trees.length * 3]}>
          <meshStandardMaterial color="#43382e" roughness={0.97} />
        </instancedMesh>
        <instancedMesh ref={treesRef} args={[mats.canopy, mats.foliage, data.trees.length]} castShadow={high} receiveShadow />
        <instancedMesh ref={stelaeRef} args={[undefined, mats.stelae, data.stelae.length]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
        </instancedMesh>
        {mats.cars.map((geo, v) =>
          data.perVariant[v] > 0 ? (
            <group key={v}>
              <instancedMesh
                ref={(m) => {
                  carParts.current[v][0] = m;
                }}
                args={[geo.body, undefined, data.perVariant[v]]}
                castShadow
              >
                <meshPhysicalMaterial roughness={0.3} metalness={0.55} clearcoat={1} clearcoatRoughness={0.12} />
              </instancedMesh>
              <instancedMesh
                ref={(m) => {
                  carParts.current[v][1] = m;
                }}
                args={[geo.glass, undefined, data.perVariant[v]]}
              >
                <meshStandardMaterial color="#10161d" roughness={0.05} metalness={0.3} envMapIntensity={1.4} />
              </instancedMesh>
              <instancedMesh
                ref={(m) => {
                  carParts.current[v][2] = m;
                }}
                args={[geo.wheels, undefined, data.perVariant[v]]}
              >
                <meshStandardMaterial vertexColors roughness={0.6} metalness={0.4} />
              </instancedMesh>
              <instancedMesh
                ref={(m) => {
                  carParts.current[v][3] = m;
                }}
                args={[geo.lights, undefined, data.perVariant[v]]}
              >
                <meshBasicMaterial vertexColors toneMapped={false} />
              </instancedMesh>
            </group>
          ) : null,
        )}

        <StreetLife detail={detail} animated={animated} />

        {/* government quarter north of the Reichstag */}
        <mesh material={mats.glass} position={[80, 12.5, -445]} castShadow receiveShadow>
          <boxGeometry args={[320, 25, 42]} />
        </mesh>
        <mesh material={mats.glass} position={[-480, 18, -330]} castShadow receiveShadow>
          <boxGeometry args={[60, 36, 60]} />
        </mesh>
        {/* Alexanderplatz hotel slab */}
        <mesh material={mats.concrete} position={[940, 62.5, -60]} castShadow receiveShadow>
          <boxGeometry args={[44, 125, 20]} />
        </mesh>

        <group position={BERLIN_LANDMARKS.gate} {...landmarkProps("gate")}>
          <BrandenburgGate />
        </group>
        <group position={BERLIN_LANDMARKS.reichstag} {...landmarkProps("reichstag")}>
          <Reichstag showFlags={high} />
        </group>
        <group position={BERLIN_LANDMARKS.tower} {...landmarkProps("tower")}>
          <Fernsehturm />
        </group>
        <group position={BERLIN_LANDMARKS.dom}>
          <BerlinerDom />
        </group>
        <group position={BERLIN_LANDMARKS.column}>
          <Siegessaeule />
        </group>
      </group>
    </CitySpaceContext.Provider>
  );
}
