"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { humanGeometries, rng } from "./materials";

/*
 * Street-level detail in city metres (origin = Brandenburger Tor, +X east, +Z south):
 * lamps, traffic lights, zebra crossings, lane/bike markings, bollards, benches, bins,
 * a tram/bus shelter and pedestrians. Everything is instanced; roads and car lanes are unchanged.
 */

type Inst = { p: [number, number, number]; s?: [number, number, number]; ry?: number; c?: string };

function fill(mesh: THREE.InstancedMesh | null, items: Inst[]) {
  if (!mesh) return;
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const col = new THREE.Color();
  items.forEach((it, i) => {
    q.setFromAxisAngle(up, it.ry ?? 0);
    m.compose(new THREE.Vector3(...it.p), q, new THREE.Vector3(...(it.s ?? [1, 1, 1])));
    mesh.setMatrixAt(i, m);
    if (it.c) mesh.setColorAt(i, col.set(it.c));
  });
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.computeBoundingSphere();
}

/** Classic Berlin "Schinkel"-style lantern: tapered pole, collar, glass lantern and cap (unit geometry, 7 m). */
function lampGeometries() {
  const pole = new THREE.CylinderGeometry(0.07, 0.13, 6.6, 10);
  pole.translate(0, 3.3, 0);
  const collar = new THREE.CylinderGeometry(0.16, 0.16, 0.18, 10);
  collar.translate(0, 6.6, 0);
  const cap = new THREE.ConeGeometry(0.34, 0.4, 8);
  cap.translate(0, 7.55, 0);
  const base = new THREE.CylinderGeometry(0.22, 0.26, 0.5, 10);
  base.translate(0, 0.25, 0);
  const metal = mergeGeometries([pole, collar, cap, base].map((g) => g.toNonIndexed()), false)!;
  const lantern = new THREE.CylinderGeometry(0.26, 0.18, 0.62, 8);
  lantern.translate(0, 7.02, 0);
  return { metal, lantern };
}

function benchGeometry() {
  const seat = new THREE.BoxGeometry(1.8, 0.07, 0.45);
  seat.translate(0, 0.45, 0);
  const back = new THREE.BoxGeometry(1.8, 0.4, 0.06);
  back.translate(0, 0.72, -0.2);
  const legs = [-0.75, 0.75].map((x) => {
    const l = new THREE.BoxGeometry(0.06, 0.45, 0.45);
    l.translate(x, 0.225, 0);
    return l;
  });
  return mergeGeometries([seat, back, ...legs].map((g) => g.toNonIndexed()), false)!;
}

function trafficLightGeometry() {
  const pole = new THREE.CylinderGeometry(0.07, 0.09, 3.2, 8);
  pole.translate(0, 1.6, 0);
  const head = new THREE.BoxGeometry(0.3, 0.95, 0.28);
  head.translate(0, 3.55, 0);
  const visor = new THREE.BoxGeometry(0.34, 0.04, 0.34);
  visor.translate(0, 4.05, 0.02);
  return mergeGeometries([pole, head, visor].map((g) => g.toNonIndexed()), false)!;
}

function shelter() {
  return (
    <group position={[360, 0.8, 34]}>
      {[-1.9, 1.9].map((x) => (
        <mesh key={x} position={[x, 1.3, 0]} castShadow>
          <boxGeometry args={[0.08, 2.6, 0.08]} />
          <meshStandardMaterial color="#3b3f44" metalness={0.8} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[0, 2.65, 0.1]} castShadow>
        <boxGeometry args={[4.2, 0.1, 1.7]} />
        <meshStandardMaterial color="#2f3337" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.35, -0.55]}>
        <boxGeometry args={[3.8, 2.3, 0.03]} />
        <meshPhysicalMaterial color="#cfdde4" roughness={0.05} metalness={0} transparent opacity={0.25} envMapIntensity={1.4} />
      </mesh>
      <mesh position={[1.3, 1.35, -0.5]}>
        <boxGeometry args={[1.1, 1.8, 0.05]} />
        <meshStandardMaterial color="#e9e6dc" emissive="#fff6e0" emissiveIntensity={0.25} roughness={0.6} />
      </mesh>
      <mesh position={[-0.6, 0.45, -0.3]} castShadow>
        <boxGeometry args={[1.6, 0.06, 0.4]} />
        <meshStandardMaterial color="#5d4b39" roughness={0.8} />
      </mesh>
    </group>
  );
}

const CLOTHES = ["#2b3445", "#6b2f2f", "#d8d2c4", "#3c4b3a", "#1c1c1f", "#8a6d4b", "#4a5f7a", "#b9a17c", "#56595e", "#7d8b99"];
const SKIN = ["#e8c4a4", "#d2a47c", "#a8744f", "#7a5237", "#f0d2b8", "#c69070"];

type Walker = { x0: number; x1: number; z: number; t: number; speed: number; dir: number; ns?: boolean; phase: number };

export function StreetLife({ detail = "high", animated = true }: { detail?: "high" | "low"; animated?: boolean }) {
  const high = detail === "high";
  const lampRef = useRef<THREE.InstancedMesh>(null);
  const lanternRef = useRef<THREE.InstancedMesh>(null);
  const tlRef = useRef<THREE.InstancedMesh>(null);
  const signalRef = useRef<THREE.InstancedMesh>(null);
  const stripesRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.InstancedMesh>(null);
  const bikeRef = useRef<THREE.InstancedMesh>(null);
  const bollardRef = useRef<THREE.InstancedMesh>(null);
  const benchRef = useRef<THREE.InstancedMesh>(null);
  const binRef = useRef<THREE.InstancedMesh>(null);
  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const headRef = useRef<THREE.InstancedMesh>(null);

  const geo = useMemo(() => ({ lamp: lampGeometries(), bench: benchGeometry(), tl: trafficLightGeometry(), human: humanGeometries() }), []);

  const data = useMemo(() => {
    const r = rng(31);
    const lamps: Inst[] = [];
    const step = high ? 32 : 64;
    for (let x = 64; x < 1000; x += step) [-29.5, 29.5].forEach((z) => lamps.push({ p: [x, 0.8, z] }));
    for (let x = -890; x < -40; x += step + 4) [-22.5, 22.5].forEach((z) => lamps.push({ p: [x, 0.6, z] }));
    for (let x = 30; x <= 180; x += 30) [-60, 60].forEach((z) => lamps.push({ p: [x, 0.8, z] }));

    // Traffic lights at the Linden junctions (Wilhelm-, Friedrich-, Charlottenstraße) and on Ebertstraße.
    const tls: Inst[] = [];
    const signals: Inst[] = [];
    const junctions = [200, 520, 700];
    for (const jx of junctions) {
      for (const [dx, dz, ry] of [
        [-16, -29, 0],
        [16, 29, Math.PI],
        [-16, 29, Math.PI],
        [16, -29, 0],
      ] as [number, number, number][]) {
        tls.push({ p: [jx + dx, 0.8, dz], ry });
        const green = (jx + dz) % 2 === 0;
        signals.push({ p: [jx + dx, 0.8 + (green ? 3.25 : 3.85), dz + (ry ? -0.15 : 0.15)], c: green ? "#34d17a" : "#ff3b2f" });
      }
    }
    [
      [-30, 40],
      [10, -40],
    ].forEach(([x, z]) => {
      tls.push({ p: [x, 0.8, z] });
      signals.push({ p: [x, 4.65, z + 0.15], c: "#ff3b2f" });
    });

    // Zebra crossings across the carriageways (stripes run with the traffic).
    const stripes: Inst[] = [];
    for (const jx of junctions) {
      for (let z = -27.5; z <= 27.5; z += 1.1) {
        if (Math.abs(z) < 7.5) continue;
        stripes.push({ p: [jx - 9, 0.93, z], s: [3.6, 1, 0.5] });
      }
    }
    for (let x = -26; x <= 6; x += 1.1) [-44, 44].forEach((z) => stripes.push({ p: [x, 0.93, z], s: [0.5, 1, 3.6] }));

    // Lane edge lines on Unter den Linden, dashed lane lines on Straße des 17. Juni.
    const lines: Inst[] = [];
    [-16.5, 16.5, -27.6, 27.6].forEach((z) => lines.push({ p: [540, 0.92, z], s: [880, 1, 0.16] }));
    for (let x = -890; x < -40; x += 9) [-6, 6].forEach((z) => lines.push({ p: [x, 0.92, z], s: [3, 1, 0.14] }));
    [-18.5, 18.5].forEach((z) => lines.push({ p: [-465, 0.92, z], s: [850, 1, 0.14] }));

    // Red bicycle lanes along Straße des 17. Juni.
    const bike: Inst[] = [-20, 20].map((z) => ({ p: [-465, 0.915, z], s: [850, 1, 2] }));

    // Bollards closing Pariser Platz on its north and south edges.
    const bollards: Inst[] = [];
    for (let x = 22; x <= 182; x += 2.6) [-63, 63].forEach((z) => bollards.push({ p: [x, 0.8, z] }));

    // Benches and bins on the Linden promenade.
    const benches: Inst[] = [];
    const bins: Inst[] = [];
    for (let x = 230; x < 690; x += high ? 38 : 76) {
      [-1, 1].forEach((s) => {
        benches.push({ p: [x, 0.8, s * 5.4], ry: s > 0 ? Math.PI : 0 });
        bins.push({ p: [x + 2.6, 0.8, s * 5.8] });
      });
    }

    // Pedestrians on the Linden sidewalks, the promenade, Pariser Platz and along 17. Juni.
    const walkers: Walker[] = [];
    const count = high ? 190 : 50;
    for (let i = 0; i < count; i++) {
      const k = r();
      const speed = 1.1 + r() * 0.5;
      if (k < 0.45) walkers.push({ x0: 60, x1: 1000, z: (r() < 0.5 ? -1 : 1) * (30 + r() * 3), t: r(), speed, dir: r() < 0.5 ? 1 : -1, phase: r() * 6 });
      else if (k < 0.65) walkers.push({ x0: 210, x1: 690, z: (r() - 0.5) * 9, t: r(), speed, dir: r() < 0.5 ? 1 : -1, phase: r() * 6 });
      else if (k < 0.85) walkers.push({ x0: -50, x1: 50, z: 20 + r() * 160, t: r(), speed: speed * 0.8, dir: r() < 0.5 ? 1 : -1, ns: true, phase: r() * 6 });
      else walkers.push({ x0: -880, x1: -60, z: (r() < 0.5 ? -1 : 1) * (23.5 + r() * 1.5), t: r(), speed, dir: r() < 0.5 ? 1 : -1, phase: r() * 6 });
    }
    // Pariser Platz walkers cross the square north–south; remap their x into the square.
    walkers.forEach((w) => {
      if (w.ns) {
        w.x0 = -55;
        w.x1 = 55;
        w.z = 30 + r() * 150; // used as x position inside the square
      }
    });
    const clothes = walkers.map(() => CLOTHES[Math.floor(r() * CLOTHES.length)]);
    const skins = walkers.map(() => SKIN[Math.floor(r() * SKIN.length)]);
    return { lamps, tls, signals, stripes, lines, bike, bollards, benches, bins, walkers, clothes, skins };
  }, [high]);

  useLayoutEffect(() => {
    fill(lampRef.current, data.lamps);
    fill(lanternRef.current, data.lamps);
    fill(tlRef.current, data.tls);
    fill(signalRef.current, data.signals);
    fill(stripesRef.current, data.stripes);
    fill(linesRef.current, data.lines);
    fill(bikeRef.current, data.bike);
    fill(bollardRef.current, data.bollards);
    fill(benchRef.current, data.benches);
    fill(binRef.current, data.bins);
    const col = new THREE.Color();
    data.walkers.forEach((_, i) => {
      bodyRef.current?.setColorAt(i, col.set(data.clothes[i]));
      headRef.current?.setColorAt(i, col.set(data.skins[i]));
    });
    if (bodyRef.current?.instanceColor) bodyRef.current.instanceColor.needsUpdate = true;
    if (headRef.current?.instanceColor) headRef.current.instanceColor.needsUpdate = true;
  }, [data]);

  const m = useMemo(() => new THREE.Matrix4(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const scl = useMemo(() => new THREE.Vector3(1, 1, 1), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  useFrame(({ clock }, dt) => {
    const body = bodyRef.current;
    const head = headRef.current;
    if (!body || !head) return;
    const t = clock.elapsedTime;
    data.walkers.forEach((w, i) => {
      const len = w.x1 - w.x0;
      if (animated) w.t = (w.t + (dt * w.speed * w.dir) / len + 1) % 1;
      const along = w.x0 + len * w.t;
      const bob = Math.abs(Math.sin(t * 5.2 * w.speed + w.phase)) * 0.035;
      if (w.ns) {
        pos.set(w.z - 150 + 120, 0.8 + bob, along);
        q.setFromAxisAngle(up, w.dir > 0 ? -Math.PI / 2 : Math.PI / 2);
      } else {
        pos.set(along, 0.8 + bob, w.z);
        q.setFromAxisAngle(up, w.dir > 0 ? 0 : Math.PI);
      }
      m.compose(pos, q, scl);
      body.setMatrixAt(i, m);
      head.setMatrixAt(i, m);
    });
    body.instanceMatrix.needsUpdate = true;
    head.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={lampRef} args={[geo.lamp.metal, undefined, data.lamps.length]} castShadow={high}>
        <meshStandardMaterial color="#2c3033" metalness={0.75} roughness={0.42} />
      </instancedMesh>
      <instancedMesh ref={lanternRef} args={[geo.lamp.lantern, undefined, data.lamps.length]}>
        <meshStandardMaterial color="#f3e6c8" emissive="#ffd9a0" emissiveIntensity={0.35} roughness={0.2} transparent opacity={0.9} />
      </instancedMesh>
      <instancedMesh ref={tlRef} args={[geo.tl, undefined, data.tls.length]} castShadow={high}>
        <meshStandardMaterial color="#1e2124" metalness={0.5} roughness={0.5} />
      </instancedMesh>
      <instancedMesh ref={signalRef} args={[undefined, undefined, data.signals.length]}>
        <sphereGeometry args={[0.1, 10, 8]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={stripesRef} args={[undefined, undefined, data.stripes.length]} receiveShadow>
        <boxGeometry args={[1, 0.02, 1]} />
        <meshStandardMaterial color="#e7e4dc" roughness={0.75} />
      </instancedMesh>
      <instancedMesh ref={linesRef} args={[undefined, undefined, data.lines.length]} receiveShadow>
        <boxGeometry args={[1, 0.02, 1]} />
        <meshStandardMaterial color="#dcd8cd" roughness={0.8} />
      </instancedMesh>
      <instancedMesh ref={bikeRef} args={[undefined, undefined, data.bike.length]} receiveShadow>
        <boxGeometry args={[1, 0.015, 1]} />
        <meshStandardMaterial color="#8f3b32" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={bollardRef} args={[undefined, undefined, data.bollards.length]} castShadow={high}>
        <cylinderGeometry args={[0.1, 0.12, 0.9, 10]} />
        <meshStandardMaterial color="#3a3e42" metalness={0.6} roughness={0.45} />
      </instancedMesh>
      <instancedMesh ref={benchRef} args={[geo.bench, undefined, data.benches.length]} castShadow={high}>
        <meshStandardMaterial color="#6a5440" roughness={0.85} />
      </instancedMesh>
      <instancedMesh ref={binRef} args={[undefined, undefined, data.bins.length]} castShadow={high}>
        <cylinderGeometry args={[0.28, 0.25, 0.95, 12]} />
        <meshStandardMaterial color="#d8612a" roughness={0.7} />
      </instancedMesh>
      <instancedMesh ref={bodyRef} args={[geo.human.body, undefined, data.walkers.length]} castShadow={high}>
        <meshStandardMaterial vertexColors roughness={0.85} />
      </instancedMesh>
      <instancedMesh ref={headRef} args={[geo.human.head, undefined, data.walkers.length]}>
        <meshStandardMaterial roughness={0.7} />
      </instancedMesh>
      {high && shelter()}
    </group>
  );
}
