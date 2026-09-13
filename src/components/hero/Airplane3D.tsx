"use client";

import { forwardRef, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Procedural twin-engine wide-body airliner (original geometry, no external model).
 * Built along +Z (nose forward), wings on X, fin on +Y. Length ≈ 1 unit before scaling.
 * Shown in cruise, so the landing gear is retracted.
 */
export const Airplane3D = forwardRef<THREE.Group, { scale?: number }>(function Airplane3D({ scale = 1 }, ref) {
  const windowsRef = useRef<THREE.InstancedMesh>(null);

  const { fuselage, wing, hStab, fin, winglet, fairing, materials, windowCount } = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const L = 1;
    const R = 0.052;
    for (let i = 0; i <= 48; i++) {
      const t = i / 48;
      let r: number;
      if (t < 0.1) r = R * Math.sqrt(1 - Math.pow(1 - t / 0.1, 2));
      else if (t < 0.72) r = R;
      else r = R * (1 - Math.pow((t - 0.72) / 0.28, 1.6) * 0.82);
      pts.push(new THREE.Vector2(Math.max(r, 0.004), t * L));
    }
    const fuselage = new THREE.LatheGeometry(pts, 40);
    fuselage.rotateX(Math.PI / 2);
    fuselage.translate(0, 0, -L / 2);
    fuselage.rotateY(Math.PI);

    const extrudeWing = (shape: THREE.Shape, depth: number) => {
      const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: depth * 0.4, bevelSize: 0.004, bevelSegments: 3 });
      g.rotateX(Math.PI / 2);
      return g;
    };

    const w = new THREE.Shape();
    w.moveTo(0.03, -0.1);
    w.lineTo(0.5, 0.12);
    w.lineTo(0.5, 0.165);
    w.lineTo(0.03, 0.13);
    w.closePath();
    const wing = extrudeWing(w, 0.012);

    const hs = new THREE.Shape();
    hs.moveTo(0.02, 0);
    hs.lineTo(0.19, 0.08);
    hs.lineTo(0.19, 0.11);
    hs.lineTo(0.02, 0.09);
    hs.closePath();
    const hStab = extrudeWing(hs, 0.007);

    const f = new THREE.Shape();
    f.moveTo(0, 0);
    f.lineTo(0.15, 0.2);
    f.lineTo(0.2, 0.2);
    f.lineTo(0.15, 0);
    f.closePath();
    const fin = new THREE.ExtrudeGeometry(f, { depth: 0.008, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 2 });
    fin.rotateY(-Math.PI / 2);
    fin.translate(0.004, 0, 0);

    const wl = new THREE.Shape();
    wl.moveTo(0, 0);
    wl.lineTo(0.02, 0.05);
    wl.lineTo(0.035, 0.05);
    wl.lineTo(0.045, 0);
    wl.closePath();
    const winglet = new THREE.ExtrudeGeometry(wl, { depth: 0.004, bevelEnabled: false });
    winglet.rotateY(-Math.PI / 2);

    const fairing = new THREE.SphereGeometry(1, 24, 12);

    const materials = {
      body: new THREE.MeshPhysicalMaterial({ color: "#f4f1ea", metalness: 0.35, roughness: 0.26, clearcoat: 0.9, clearcoatRoughness: 0.15 }),
      wing: new THREE.MeshStandardMaterial({ color: "#c4c8ce", metalness: 0.65, roughness: 0.32 }),
      navy: new THREE.MeshStandardMaterial({ color: "#10244a", metalness: 0.4, roughness: 0.3 }),
      gold: new THREE.MeshStandardMaterial({ color: "#d8b674", metalness: 0.9, roughness: 0.25, emissive: "#3a2a0c", emissiveIntensity: 0.3 }),
      glass: new THREE.MeshStandardMaterial({ color: "#0b1426", metalness: 0.85, roughness: 0.08 }),
      cabin: new THREE.MeshStandardMaterial({ color: "#131a26", metalness: 0.6, roughness: 0.15, emissive: "#ffcf8a", emissiveIntensity: 0.12 }),
      engine: new THREE.MeshStandardMaterial({ color: "#dfe2e7", metalness: 0.55, roughness: 0.3 }),
      intake: new THREE.MeshStandardMaterial({ color: "#1b1f27", metalness: 0.7, roughness: 0.5, side: THREE.DoubleSide }),
      metal: new THREE.MeshStandardMaterial({ color: "#8d939b", metalness: 1, roughness: 0.25 }),
    };
    return { fuselage, wing, hStab, fin, winglet, fairing, materials, windowCount: 88 };
  }, []);

  // Cabin window rows on both sides of the fuselage.
  useLayoutEffect(() => {
    const mesh = windowsRef.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3(0.0016, 0.0062, 0.0045);
    let i = 0;
    for (const side of [-1, 1]) {
      for (let k = 0; k < windowCount / 2; k++) {
        const z = 0.34 - k * 0.0148;
        if (Math.abs(z - 0.18) < 0.012 || Math.abs(z + 0.2) < 0.012) {
          // door gaps
          m.compose(new THREE.Vector3(0, -10, 0), q, s);
        } else {
          m.compose(new THREE.Vector3(side * 0.0518, 0.019, z), q, s);
        }
        mesh.setMatrixAt(i++, m);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [windowCount]);

  const Engine = ({ x }: { x: number }) => (
    <group position={[x, -0.055, 0.1]}>
      <mesh material={materials.engine} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.032, 0.025, 0.13, 32, 1, true]} />
      </mesh>
      <mesh material={materials.intake} position={[0, 0, 0.058]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.03, 32]} />
      </mesh>
      {/* fan blades + spinner */}
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={i} material={materials.metal} position={[0, 0, 0.056]} rotation={[0, 0, (i / 14) * Math.PI * 2]}>
          <boxGeometry args={[0.0035, 0.052, 0.001]} />
        </mesh>
      ))}
      <mesh material={materials.metal} position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.009, 0.014, 16]} />
      </mesh>
      <mesh material={materials.gold} position={[0, 0, 0.065]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.031, 0.0028, 8, 32]} />
      </mesh>
      <mesh material={materials.metal} position={[0, 0, -0.078]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.014, 0.035, 16]} />
      </mesh>
      <mesh material={materials.wing} position={[0, 0.03, -0.01]}>
        <boxGeometry args={[0.008, 0.03, 0.09]} />
      </mesh>
    </group>
  );

  return (
    <group ref={ref} scale={scale}>
      <mesh geometry={fuselage} material={materials.body} castShadow />
      {/* cockpit windscreen panels */}
      {[-0.017, -0.006, 0.006, 0.017].map((x) => (
        <mesh key={x} material={materials.glass} position={[x, 0.029, 0.438]} rotation={[-0.62, x * 12, 0]}>
          <boxGeometry args={[0.0095, 0.007, 0.002]} />
        </mesh>
      ))}
      <instancedMesh ref={windowsRef} args={[undefined, undefined, windowCount]} material={materials.cabin} />
      <mesh material={materials.gold} position={[0, 0.004, 0.02]}>
        <boxGeometry args={[0.1046, 0.0028, 0.62]} />
      </mesh>
      <mesh material={materials.navy} position={[0, -0.038, 0.02]}>
        <boxGeometry args={[0.066, 0.026, 0.56]} />
      </mesh>
      {/* wing-to-body fairing */}
      <mesh geometry={fairing} material={materials.body} position={[0, -0.04, 0.05]} scale={[0.05, 0.022, 0.15]} />
      {[1, -1].map((s) => (
        <group key={s} position={[0, -0.03, 0.06]} rotation={[0, 0, s * 0.06]} scale={[s, 1, 1]}>
          <mesh geometry={wing} material={materials.wing} castShadow />
          <mesh geometry={winglet} material={materials.navy} position={[0.5, 0, 0.12]} />
          {/* flap-track fairings */}
          {[0.14, 0.26, 0.38].map((x) => (
            <mesh key={x} material={materials.wing} position={[x, -0.01, -0.1 - x * 0.46]}>
              <boxGeometry args={[0.008, 0.008, 0.05]} />
            </mesh>
          ))}
        </group>
      ))}
      <Engine x={0.17} />
      <Engine x={-0.17} />
      <group position={[0, 0.02, -0.4]}>
        <mesh geometry={hStab} material={materials.wing} castShadow />
        <mesh geometry={hStab} material={materials.wing} scale={[-1, 1, 1]} castShadow />
      </group>
      <group position={[0, 0.035, -0.28]} rotation={[0, Math.PI, 0]}>
        <mesh geometry={fin} material={materials.navy} castShadow />
      </group>
      <mesh material={materials.gold} position={[0, 0.16, -0.4]} rotation={[0.75, 0, 0]}>
        <boxGeometry args={[0.012, 0.09, 0.012]} />
      </mesh>
      {/* APU exhaust */}
      <mesh material={materials.metal} position={[0, 0.006, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.004, 0.006, 0.012, 10]} />
      </mesh>
      {/* nav and beacon lights */}
      <mesh position={[0.5, -0.03, 0.2]}>
        <sphereGeometry args={[0.006, 8, 8]} />
        <meshBasicMaterial color="#39ff9a" toneMapped={false} />
      </mesh>
      <mesh position={[-0.5, -0.03, 0.2]}>
        <sphereGeometry args={[0.006, 8, 8]} />
        <meshBasicMaterial color="#ff3b3b" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.056, 0.05]}>
        <sphereGeometry args={[0.004, 8, 8]} />
        <meshBasicMaterial color="#ff5040" toneMapped={false} />
      </mesh>
    </group>
  );
});
