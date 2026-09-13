"use client";
/* eslint-disable react-hooks/immutability -- imperative Three.js scene/camera mutation inside R3F hooks */

import { Suspense, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import { DepthOfField, EffectComposer, N8AO, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import { BerlinCity } from "@/components/hero/berlin/BerlinCity";

function useMq(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function makeSkyMaterial() {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      top: { value: new THREE.Color("#5f7fa6") },
      horizon: { value: new THREE.Color("#f2d2a0") },
      ground: { value: new THREE.Color("#8a7a66") },
      sunDir: { value: new THREE.Vector3(-900, 520, 850).normalize() },
    },
    vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
    fragmentShader: `uniform vec3 top; uniform vec3 horizon; uniform vec3 ground; uniform vec3 sunDir; varying vec3 vP;
void main(){
  float h = vP.y;
  vec3 c = h > 0.0 ? mix(horizon, top, pow(smoothstep(0.0, 0.6, h), 0.7)) : mix(horizon, ground, smoothstep(0.0, -0.2, h));
  float s = max(dot(vP, sunDir), 0.0);
  c += vec3(1.0, 0.82, 0.55) * (pow(s, 12.0) * 0.35 + pow(s, 900.0) * 6.0);
  gl_FragColor = vec4(c, 1.0);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`,
  });
}

function Sky() {
  const mat = useMemo(() => makeSkyMaterial(), []);
  return (
    <mesh material={mat}>
      <sphereGeometry args={[4500, 32, 16]} />
    </mesh>
  );
}

/** Outdoor image-based lighting generated from the same sky, so glass and metal reflect a real sky. */
function Setup() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const skyScene = new THREE.Scene();
    const skyMat = makeSkyMaterial();
    const skyGeo = new THREE.SphereGeometry(100, 32, 16);
    skyScene.add(new THREE.Mesh(skyGeo, skyMat));
    const env = pmrem.fromScene(skyScene, 0.02).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.6;
    return () => {
      env.dispose();
      pmrem.dispose();
      skyMat.dispose();
      skyGeo.dispose();
    };
  }, [gl, scene]);
  return null;
}

/** Slow aerial orbit from the south-west: Gate in the foreground, Reichstag left, Fernsehturm beyond. */
function CameraPath({ still }: { still: boolean }) {
  const { camera, size } = useThree();
  const target = useMemo(() => new THREE.Vector3(170, 45, -120), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const mouse = useRef({ x: 0, y: 0 });
  useFrame(({ clock, pointer }, dt) => {
    const t = still ? 0 : clock.elapsedTime;
    const portrait = size.width < size.height * 1.1;
    const a = 2.36 + 0.16 * Math.sin(t * 0.045);
    const r = (portrait ? 900 : 640) - 50 * Math.sin(t * 0.06);
    const h = (portrait ? 330 : 190) + 25 * Math.sin(t * 0.05);
    mouse.current.x += (pointer.x - mouse.current.x) * Math.min(1, dt * 1.5);
    mouse.current.y += (pointer.y - mouse.current.y) * Math.min(1, dt * 1.5);
    camera.position.set(target.x + Math.cos(a) * r + (still ? 0 : mouse.current.x * 40), target.y + h + (still ? 0 : mouse.current.y * 25), target.z + Math.sin(a) * r);
    look.copy(target);
    look.x += Math.sin(t * 0.03) * 20;
    camera.lookAt(look);
  });
  return null;
}

function Sun() {
  const sun = useRef<THREE.DirectionalLight>(null);
  const target = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(150, 0, -100);
    return o;
  }, []);
  useEffect(() => {
    const s = sun.current;
    if (!s) return;
    s.target = target;
    const c = s.shadow.camera;
    c.left = -1000;
    c.right = 1000;
    c.top = 800;
    c.bottom = -800;
    c.near = 10;
    c.far = 4000;
    c.updateProjectionMatrix();
    s.shadow.radius = 3;
  }, [target]);
  return (
    <>
      <primitive object={target} />
      <directionalLight
        ref={sun}
        position={[-900, 520, 850]}
        color="#ffd7a2"
        intensity={3.2}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-bias={-0.0004}
        shadow-normalBias={1.2}
      />
      <hemisphereLight args={["#c3d4e8", "#4a3f33", 0.55]} />
    </>
  );
}

export default function BerlinScene({ active, onReady }: { active: boolean; onReady: () => void }) {
  const reduced = useMq("(prefers-reduced-motion: reduce)");
  const compact = useMq("(max-width: 767px), (pointer: coarse)");
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={compact ? [1, 1.5] : [1, 1.75]}
      shadows
      gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
      camera={{ fov: 32, near: 5, far: 9000, position: [-400, 340, 700] }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.95;
        scene.fog = new THREE.Fog("#d9c3a0", 900, 3400);
        requestAnimationFrame(onReady);
      }}
      aria-label="3D view of central Berlin with the Brandenburg Gate, Reichstag and Berlin TV Tower"
      role="img"
    >
      <AdaptiveDpr pixelated={false} />
      <Setup />
      <Sky />
      <Sun />
      <CameraPath still={reduced} />
      <Suspense fallback={null}>
        <BerlinCity detail={compact ? "low" : "high"} animated={!reduced} lit={0.22} />
      </Suspense>
      <EffectComposer multisampling={compact ? 0 : 4}>
        <N8AO aoRadius={9} distanceFalloff={1} intensity={compact ? 1.6 : 2.4} halfRes={compact} quality={compact ? "performance" : "medium"} />
        <DepthOfField target={[60, 20, -60]} worldFocusRange={650} bokehScale={compact ? 0 : 1.4} height={540} />
        <Vignette offset={0.35} darkness={0.32} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </Canvas>
  );
}
