"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";
import { worldAt } from "./FlightRoute";
import { smoothstep, type ProgressRef } from "./anim";

function cloudTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(0.45, "rgba(235,238,245,0.35)");
  g.addColorStop(1, "rgba(235,238,245,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function Atmosphere({ progress, compact }: { progress: ProgressRef; compact: boolean }) {
  const group = useRef<THREE.Group>(null);
  const tex = useMemo(() => (typeof document === "undefined" ? null : cloudTexture()), []);
  const berlin = useMemo(() => worldAt("berlin"), []);
  const clouds = useMemo(() => {
    const n = compact ? 10 : 22;
    return Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + i;
      const near = i % 3 === 0;
      const r = near ? 0.6 + (i % 5) * 0.15 : 2 + (i % 7) * 0.8;
      return {
        pos: new THREE.Vector3(berlin.x + Math.cos(a) * r * 1.6, near ? 0.55 + (i % 4) * 0.12 : 1.2 + (i % 5) * 0.4, berlin.z + Math.sin(a) * r),
        scale: near ? 0.5 + (i % 3) * 0.2 : 1.6 + (i % 4) * 0.7,
        speed: 0.02 + (i % 5) * 0.008,
      };
    });
  }, [berlin, compact]);

  const mats = useRef<THREE.SpriteMaterial[]>([]);

  useFrame((_, dt) => {
    const p = progress.current;
    const o = 0.05 + smoothstep(0.05, 0.3, p) * 0.15;
    mats.current.forEach((m) => (m.opacity = o));
    group.current?.children.forEach((c, i) => {
      c.position.x += clouds[i].speed * dt;
      if (c.position.x > berlin.x + 8) c.position.x = berlin.x - 8;
    });
  });

  return (
    <>
      <Stars radius={60} depth={30} count={compact ? 800 : 2000} factor={2.2} saturation={0} fade speed={0.4} />
      <group ref={group}>
        {tex &&
          clouds.map((c, i) => (
            <sprite key={i} position={c.pos} scale={[c.scale * 1.8, c.scale, 1]}>
              <spriteMaterial
                ref={(m) => {
                  if (m) mats.current[i] = m;
                }}
                map={tex}
                transparent
                depthWrite={false}
                opacity={0.2}
                color="#dfe6f2"
              />
            </sprite>
          ))}
      </group>
      <Sparkles
        count={compact ? 40 : 90}
        scale={[2.4, 1.2, 1.8]}
        position={[berlin.x, 0.5, berlin.z]}
        size={2.2}
        speed={0.25}
        color="#e7cf9b"
        opacity={0.7}
      />
    </>
  );
}
