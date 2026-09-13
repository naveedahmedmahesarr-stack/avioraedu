"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { smoothstep, type ProgressRef } from "./anim";

/**
 * 3D version of the TEMPORARY AVIORA EDU monogram (see components/brand/Logo.tsx).
 * Replace the shapes below when the official logo is available.
 */
export function Logo3D({ progress, position }: { progress: ProgressRef; position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);

  const { aShape, swoosh, ring } = useMemo(() => {
    // Chevron "A": outer triangle minus inner triangle, drawn as one closed outline.
    const s = new THREE.Shape();
    s.moveTo(-0.5, -0.55);
    s.lineTo(0, 0.6);
    s.lineTo(0.5, -0.55);
    s.lineTo(0.36, -0.55);
    s.lineTo(0, 0.28);
    s.lineTo(-0.36, -0.55);
    s.closePath();
    const aShape = new THREE.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevelSegments: 4 });
    aShape.center();

    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-0.42, -0.2, 0.1),
      new THREE.Vector3(-0.1, -0.02, 0.14),
      new THREE.Vector3(0.3, -0.05, 0.12),
      new THREE.Vector3(0.66, 0.02, 0.1),
    );
    const swoosh = new THREE.TubeGeometry(curve, 48, 0.025, 12, false);
    const ring = new THREE.TorusGeometry(0.92, 0.012, 12, 96);
    return { aShape, swoosh, ring };
  }, []);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const r = smoothstep(0.86, 0.98, progress.current);
    g.visible = r > 0.001;
    g.scale.setScalar(0.16 * (0.6 + 0.4 * r) * r);
    g.rotation.y = (1 - r) * Math.PI * 1.2 + Math.sin(clock.elapsedTime * 0.5) * 0.18;
    g.position.y = position[1] + Math.sin(clock.elapsedTime * 0.9) * 0.012;
  });

  return (
    <group ref={group} position={position} visible={false}>
      <mesh geometry={aShape}>
        <meshPhysicalMaterial color="#d8b674" metalness={1} roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      <mesh geometry={swoosh}>
        <meshPhysicalMaterial color="#f3e2b8" metalness={1} roughness={0.15} emissive="#8a6a2c" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0.66, 0.02, 0.1]}>
        <sphereGeometry args={[0.05, 24, 24]} />
        <meshStandardMaterial color="#fff4d6" emissive="#e7cf9b" emissiveIntensity={1.5} />
      </mesh>
      <mesh geometry={ring}>
        <meshStandardMaterial color="#c29a52" metalness={1} roughness={0.3} />
      </mesh>
    </group>
  );
}
