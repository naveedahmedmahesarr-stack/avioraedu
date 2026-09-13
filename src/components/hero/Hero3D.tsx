"use client";
/* eslint-disable react-hooks/immutability -- imperative Three.js scene/camera mutation inside R3F hooks is the intended pattern */

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, N8AO, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode, type DepthOfFieldEffect } from "postprocessing";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EuropeGlobe } from "./EuropeGlobe";
import { FlightRoutes } from "./FlightRoute";
import { worldAt } from "./space";
import { Airplane3D } from "./Airplane3D";
import { BERLIN_SCALE, CAMPUS_OFFSET, GermanyExperience3D } from "./GermanyExperience3D";
import { Logo3D } from "./Logo3D";
import { Atmosphere } from "./Atmosphere";
import { band, damp, smoothstep, type ProgressRef } from "./anim";
import { BERLIN_LANDMARKS, type LandmarkKey } from "./berlin/BerlinCity";
import { REAL_LANDMARKS, berlinSource } from "./berlin/landmarkSpace";
import { chaseCamera, flightPose, flightProgress } from "./flights";
import { flightOrigins } from "./geo";

const G = worldAt("berlin");

// Camera keyframes along the story (position, look-at). Berlin shots are framed around the Brandenburger Tor.
const CAM: [number[], number[]][] = [
  [[4, 26, 20], [3, 0, 1]], // 0.00 dark, far
  [[1.0, 9.5, 8.5], [0.8, 0, 0.9]], // Europe appears
  [[5.2, 7.2, 9.2], [3.6, 0, 1.4]], // source markets → Germany
  [[0.9, 2.4, 2.6], [0.35, 0, -0.1]], // Germany
  [[G.x - 0.2, 0.16, G.z + 0.01], [G.x + 0.25, 0.04, G.z - 0.07]], // Berlin: Gate in front, Reichstag left, Fernsehturm beyond
  [[G.x - 0.2, 0.3, G.z + 0.98], [G.x + CAMPUS_OFFSET.x, 0.12, G.z + CAMPUS_OFFSET.z]], // campus
  [[G.x - 0.6, 0.62, G.z + 1.15], [G.x + 0.05, 0.3, G.z - 0.05]], // brand reveal
];

function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.55;
    return () => {
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

/** Click-to-focus shots on the detailed landmarks (world units; landmark metres × BERLIN_SCALE from the Gate). */
const at = (m: THREE.Vector3, dx: number, dy: number, dz: number) =>
  new THREE.Vector3(G.x + (m.x + dx) * BERLIN_SCALE, 0.1 + dy * BERLIN_SCALE, G.z + (m.z + dz) * BERLIN_SCALE);
type Shots = Record<LandmarkKey, { pos: THREE.Vector3; look: THREE.Vector3 }>;
const buildShots = (L: Record<LandmarkKey, THREE.Vector3>): Shots => ({
  gate: { pos: at(L.gate, -62, 34, 48), look: at(L.gate, 0, 15, 0) },
  reichstag: { pos: at(L.reichstag, -210, 95, 170), look: at(L.reichstag, 0, 28, 0) },
  tower: { pos: at(L.tower, -300, 230, 360), look: at(L.tower, 0, 190, 0) },
});
// Procedural Berlin compresses east–west distances; real 3D tiles use true geography.
const SHOTS: Record<"procedural" | "tiles", Shots> = {
  procedural: buildShots(BERLIN_LANDMARKS),
  tiles: buildShots(REAL_LANDMARKS),
};

export type FocusRef = { current: { key: LandmarkKey | null; last: LandmarkKey | null; p: number } };

function CameraRig({ progress, parallax, reduced, focus }: { progress: ProgressRef; parallax: boolean; reduced: boolean; focus: FocusRef }) {
  const focusW = useRef(0);
  const { camera, size } = useThree();
  const posCurve = useMemo(() => new THREE.CatmullRomCurve3(CAM.map(([p]) => new THREE.Vector3(...p)), false, "centripetal"), []);
  const lookCurve = useMemo(() => new THREE.CatmullRomCurve3(CAM.map(([, l]) => new THREE.Vector3(...l)), false, "centripetal"), []);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const chasePos = useMemo(() => new THREE.Vector3(), []);
  const chaseLook = useMemo(() => new THREE.Vector3(), []);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = size.width < size.height ? 58 : 40;
    cam.updateProjectionMatrix();
  }, [camera, size]);

  useFrame(({ pointer, clock }, dt) => {
    const p = progress.current;
    posCurve.getPoint(p, pos);
    lookCurve.getPoint(p, look);
    // Journey chapter: follow each aircraft in turn, then release back to the story path.
    const chase = reduced ? 0 : band(0.2, 0.42, p, 0.07);
    if (chase > 0.001) {
      chaseCamera(clock.elapsedTime, chasePos, chaseLook);
      pos.lerp(chasePos, chase);
      look.lerp(chaseLook, chase);
    }
    // Landmark focus: smooth cinematic move to the clicked landmark; scrolling releases it.
    const f = focus.current;
    if (f.key && Math.abs(p - f.p) > 0.02) f.key = null;
    focusW.current = damp(focusW.current, f.key ? 1 : 0, reduced ? 20 : 2.4, dt);
    if (focusW.current > 0.001 && f.last) {
      const shot = SHOTS[berlinSource.current][f.last];
      pos.lerp(shot.pos, focusW.current);
      look.lerp(shot.look, focusW.current);
    }
    if (parallax) {
      mouse.current.x += (pointer.x - mouse.current.x) * Math.min(1, dt * 2);
      mouse.current.y += (pointer.y - mouse.current.y) * Math.min(1, dt * 2);
      const k = pos.distanceTo(look) * 0.035;
      pos.x += mouse.current.x * k;
      pos.y += mouse.current.y * k * 0.5;
    }
    camera.position.copy(pos);
    camera.lookAt(look);
  });
  return null;
}

function Lights({ progress, shadows }: { progress: ProgressRef; shadows: boolean }) {
  const key = useRef<THREE.DirectionalLight>(null);
  const sun = useRef<THREE.DirectionalLight>(null);
  const amb = useRef<THREE.HemisphereLight>(null);
  const target = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(G.x + 0.15, 0.1, G.z);
    return o;
  }, []);
  useEffect(() => {
    const s = sun.current;
    if (!s) return;
    s.target = target;
    const cam = s.shadow.camera;
    cam.left = -1.1;
    cam.right = 1.1;
    cam.top = 1.1;
    cam.bottom = -1.1;
    cam.near = 0.1;
    cam.far = 6;
    cam.updateProjectionMatrix();
  }, [target]);
  useFrame(() => {
    const p = progress.current;
    const on = smoothstep(0, 0.14, p);
    if (key.current) key.current.intensity = 2.6 * on;
    if (amb.current) amb.current.intensity = 0.15 + 0.55 * on;
    if (sun.current) sun.current.intensity = 2.2 * smoothstep(0.46, 0.62, p);
  });
  return (
    <>
      <hemisphereLight ref={amb} args={["#9fb1cc", "#050d1c", 0.2]} />
      <directionalLight ref={key} position={[-6, 8, 4]} color="#ffe2b0" intensity={0} />
      <primitive object={target} />
      <directionalLight
        ref={sun}
        position={[G.x - 1.3, 1.5, G.z + 1.0]}
        color="#ffd9a6"
        intensity={0}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.004}
      />
      <pointLight position={[0.4, 1.2, 0.2]} color="#e7cf9b" intensity={1.2} distance={4} />
    </>
  );
}

/** One independent aircraft per source market (see flights.ts for the schedule). */
function Flights({ progress, reduced }: { progress: ProgressRef; reduced: boolean }) {
  const planes = useRef<(THREE.Group | null)[]>([]);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const ahead = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const p = progress.current;
    const appear = smoothstep(0.08, 0.2, p) * (1 - smoothstep(0.44, 0.5, p));
    planes.current.forEach((g, i) => {
      if (!g) return;
      const u = reduced ? 0.3 + i * 0.1 : flightProgress(i, clock.elapsedTime);
      if (u > 1 || appear < 0.001) {
        g.visible = false;
        return;
      }
      g.visible = true;
      flightPose(i, u, pos, dir);
      g.position.copy(pos);
      g.lookAt(ahead.copy(pos).add(dir));
      g.rotateZ(Math.sin(clock.elapsedTime * 0.4 + i * 1.7) * 0.06 + (i % 2 ? 0.05 : -0.05));
      const edge = reduced ? 1 : Math.min(smoothstep(0, 0.05, u), 1 - smoothstep(0.95, 1, u));
      g.scale.setScalar(0.42 * appear * edge + 0.0001);
    });
  });

  return (
    <>
      {flightOrigins.map((o, i) => (
        <Airplane3D
          key={o.key}
          ref={(g) => {
            planes.current[i] = g;
          }}
        />
      ))}
    </>
  );
}

/** The aircraft that crosses the Berlin skyline in the close-up chapters. */
function ArrivalFlight({ progress, reduced }: { progress: ProgressRef; reduced: boolean }) {
  const plane = useRef<THREE.Group>(null);
  const route = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(G.x + 2.2, 1.1, G.z + 0.9),
        new THREE.Vector3(G.x + 0.6, 0.72, G.z + 0.25),
        new THREE.Vector3(G.x - 0.5, 0.6, G.z - 0.2),
        new THREE.Vector3(G.x - 2.4, 0.85, G.z - 0.9),
      ]),
    [],
  );
  const a = useMemo(() => new THREE.Vector3(), []);
  const ahead = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ clock }) => {
    const g = plane.current;
    if (!g) return;
    const p = progress.current;
    const on = smoothstep(0.5, 0.56, p);
    g.visible = on > 0.001;
    if (!g.visible) return;
    const t = reduced ? 0.62 : (clock.elapsedTime / 11) % 1;
    route.getPoint(t, a);
    route.getPoint(Math.min(t + 0.01, 1), ahead);
    if (t > 0.99) ahead.copy(a).add(a.clone().sub(route.getPoint(0.98)));
    g.position.copy(a);
    g.lookAt(ahead);
    g.rotateZ(-0.12);
    const edge = reduced ? 1 : Math.min(smoothstep(0, 0.06, t), 1 - smoothstep(0.94, 1, t));
    g.scale.setScalar(0.2 * on * edge + 0.0001);
  });
  return <Airplane3D ref={plane} />;
}

/** Depth of field for the Berlin chapters — focus follows the Gate, then the campus. */
function BerlinDepthOfField({ progress }: { progress: ProgressRef }) {
  const dof = useRef<DepthOfFieldEffect>(null);
  const gate = useMemo(() => new THREE.Vector3(G.x + 0.02, 0.12, G.z), []);
  const campus = useMemo(() => new THREE.Vector3(G.x + CAMPUS_OFFSET.x, 0.12, G.z + CAMPUS_OFFSET.z), []);
  const focus = useMemo(() => gate.clone(), [gate]);
  useFrame(() => {
    const e = dof.current;
    if (!e) return;
    const p = progress.current;
    focus.copy(gate).lerp(campus, smoothstep(0.74, 0.84, p) * (1 - smoothstep(0.9, 0.97, p)));
    if (e.target) e.target.copy(focus);
    else e.target = focus.clone();
    // Gentle depth only — landmarks must stay sharp.
    e.bokehScale = 1.1 * smoothstep(0.55, 0.66, p);
  });
  return (
    <EffectComposer multisampling={4}>
      {/* Ambient occlusion: contact shadows under cars, in courtyards, between columns (radius ≈ 10 m at hero scale). */}
      <N8AO aoRadius={0.008} distanceFalloff={0.6} intensity={2.2} quality="high" />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}

export default function Hero3D({
  progress,
  reducedMotion,
  compact,
  active,
  berlinFocus = false,
  onReady,
}: {
  progress: ProgressRef;
  reducedMotion: boolean;
  compact: boolean;
  active: boolean;
  berlinFocus?: boolean;
  onReady: () => void;
}) {
  const focus = useRef<FocusRef["current"]>({ key: null, last: null, p: 0 });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") focus.current.key = null;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const onLandmark = (key: LandmarkKey) => {
    // Landmarks are only clickable once Berlin has risen (Berlin/campus/brand chapters).
    if (progress.current < 0.58) return;
    const f = focus.current;
    if (f.key === key) {
      f.key = null;
      return;
    }
    f.key = key;
    f.last = key;
    f.p = progress.current;
  };
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      // Native device resolution (no adaptive downscaling, which made the scene soft during movement).
      dpr={compact ? [1, 1.75] : [1, 2]}
      shadows={!compact}
      gl={{ antialias: !compact, powerPreference: "high-performance", alpha: false }}
      camera={{ position: [4, 26, 20], fov: 40, near: 0.02, far: 120 }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.localClippingEnabled = true; // real 3D tiles are clipped to central Berlin
        scene.background = new THREE.Color("#050d1c");
        scene.fog = new THREE.FogExp2("#050d1c", 0.035);
        requestAnimationFrame(onReady);
      }}
      aria-hidden
    >
      <Environment />
      <Lights progress={progress} shadows={!compact} />
      <CameraRig progress={progress} parallax={!reducedMotion && !compact} reduced={reducedMotion} focus={focus} />
      <Suspense fallback={null}>
        <EuropeGlobe progress={progress} />
        <FlightRoutes progress={progress} compact={compact} />
        <GermanyExperience3D progress={progress} compact={compact} onLandmark={onLandmark} />
        <Flights progress={progress} reduced={reducedMotion} />
        <ArrivalFlight progress={progress} reduced={reducedMotion} />
        <Logo3D progress={progress} position={[G.x - 0.18, 0.5, G.z + 0.2]} />
        <Atmosphere progress={progress} compact={compact} />
      </Suspense>
      {berlinFocus && !compact && <BerlinDepthOfField progress={progress} />}
    </Canvas>
  );
}
