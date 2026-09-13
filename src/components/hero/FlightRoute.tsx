"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { destinationMarkers, flightOrigins } from "./geo";
import { band, smoothstep, type ProgressRef } from "./anim";
import { arcCurve, worldAt } from "./space";
import { flightCurves } from "./flights";
import { Flag } from "@/components/ui/Flag";

export { arcCurve, worldAt };

type LineHandle = { material: { dashOffset: number; opacity: number } };

function Route({
  curve,
  color,
  width,
  progress,
  visible,
  speed,
  glow = false,
}: {
  curve: THREE.Curve<THREE.Vector3>;
  color: string;
  width: number;
  progress: ProgressRef;
  visible: (p: number) => number;
  speed: number;
  glow?: boolean;
}) {
  const ref = useRef<LineHandle>(null);
  const glowRef = useRef<LineHandle>(null);
  const points = useMemo(() => curve.getPoints(96), [curve]);
  useFrame((_, dt) => {
    const o = visible(progress.current);
    const m = ref.current?.material;
    if (m) {
      m.dashOffset -= dt * speed;
      m.opacity = o;
    }
    if (glowRef.current) glowRef.current.material.opacity = o * 0.16;
  });
  return (
    <>
      {glow && (
        <Line ref={glowRef as never} points={points} color={color} lineWidth={width * 5} transparent opacity={0} depthWrite={false} toneMapped={false} />
      )}
      <Line
        ref={ref as never}
        points={points}
        color={color}
        lineWidth={width}
        dashed
        dashSize={0.12}
        gapSize={0.06}
        transparent
        opacity={0}
        depthWrite={false}
        toneMapped={false}
      />
    </>
  );
}

function Label({ progress, visible, children, tone }: { progress: ProgressRef; visible: (p: number) => number; children: React.ReactNode; tone: "gold" | "blue" }) {
  const ref = useRef<HTMLDivElement>(null);
  useFrame(() => {
    if (ref.current) {
      const o = visible(progress.current);
      ref.current.style.opacity = String(o);
      ref.current.style.visibility = o < 0.02 ? "hidden" : "visible";
    }
  });
  return (
    <Html center zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
      <div
        ref={ref}
        className={`flex -translate-y-7 items-center gap-2 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide backdrop-blur-md ${
          tone === "gold" ? "bg-navy-950/70 text-gold-300 ring-1 ring-gold-300/40" : "bg-navy-950/60 text-navy-300 ring-1 ring-navy-300/25"
        }`}
        style={{ opacity: 0 }}
      >
        {children}
      </div>
    </Html>
  );
}

function Marker({ position, primary, progress }: { position: THREE.Vector3; primary: boolean; progress: ProgressRef }) {
  const ring = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const h = primary ? 0.55 : 0.24;
  useFrame(({ clock }) => {
    const p = progress.current;
    // Beams read well from altitude but would dominate the Berlin close-ups, so all fade out before them.
    const s = smoothstep(0.1, 0.24, p) * (1 - smoothstep(primary ? 0.48 : 0.56, primary ? 0.55 : 0.62, p));
    if (group.current) group.current.scale.setScalar(Math.max(s, 0.0001));
    if (ring.current) {
      const t = (clock.elapsedTime * 0.6) % 1;
      ring.current.scale.setScalar(1 + t * 3);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.7;
    }
  });
  return (
    <group ref={group} position={position}>
      <mesh position={[0, h / 2, 0]}>
        <cylinderGeometry args={[0.006, primary ? 0.02 : 0.012, h, 12, 1, true]} />
        <meshBasicMaterial color="#e7cf9b" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh position={[0, h, 0]}>
        <sphereGeometry args={[primary ? 0.035 : 0.022, 20, 20]} />
        <meshStandardMaterial color="#f3e2b8" emissive="#d8b674" emissiveIntensity={1.4} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.11, 0]}>
        <ringGeometry args={[0.05, 0.06, 40]} />
        <meshBasicMaterial color="#e7cf9b" transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function FlightRoutes({ progress, compact }: { progress: ProgressRef; compact: boolean }) {
  const berlin = useMemo(() => worldAt("berlin", 0.12), []);
  const sources = useMemo(() => flightOrigins.map((s, i) => ({ ...s, pos: worldAt(s.key, 0.04), curve: flightCurves[i] })), []);
  const dests = useMemo(
    () =>
      destinationMarkers
        .filter((d) => !d.primary)
        .map((d) => ({ ...d, pos: worldAt(d.key, 0.05), curve: arcCurve(berlin, worldAt(d.key, 0.05), 0.22) })),
    [berlin],
  );

  const srcVisible = (p: number) => band(0.16, 0.56, p, 0.06) * 0.95;
  const destVisible = (p: number) => band(0.14, 0.52, p, 0.08) * 0.7;
  const labelSrc = (p: number) => band(0.2, 0.5, p, 0.05);
  const labelDest = (p: number) => band(0.18, 0.52, p, 0.05);
  const labelDE = (p: number) => band(0.18, 0.6, p, 0.05);

  return (
    <group>
      {sources.map((s, i) => (
        <group key={s.key}>
          <Route curve={s.curve} color="#9fb8dc" width={compact ? 1.2 : 1.6} progress={progress} visible={srcVisible} speed={0.28 + i * 0.03} glow={!compact} />
          <mesh position={s.pos}>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshBasicMaterial color="#cfe0ff" toneMapped={false} />
          </mesh>
          {!compact && (
            <group position={[s.pos.x, s.pos.y + s.dy, s.pos.z]}>
              <Label progress={progress} visible={labelSrc} tone="blue">
                <Flag code={s.flag} className="h-2.5 w-4" decorative />
                {s.label}
              </Label>
            </group>
          )}
        </group>
      ))}
      {dests.map((d) => (
        <group key={d.key}>
          <Route curve={d.curve} color="#e7cf9b" width={1.1} progress={progress} visible={destVisible} speed={0.25} />
          <Marker position={d.pos} primary={false} progress={progress} />
          <group position={[d.pos.x, 0.32, d.pos.z]}>
            <Label progress={progress} visible={labelDest} tone="gold">
              <Flag code={d.flag} className="h-2.5 w-4" decorative />
              {d.label}
            </Label>
          </group>
        </group>
      ))}
      <Marker position={worldAt("berlin", 0.1)} primary progress={progress} />
      <group position={[berlin.x, 0.72, berlin.z]}>
        <Label progress={progress} visible={labelDE} tone="gold">
          <Flag code="DE" className="h-3 w-[18px]" decorative />
          Germany · Primary destination
        </Label>
      </group>
    </group>
  );
}
