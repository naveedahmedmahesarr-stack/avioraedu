import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Shared "city space" transform. Every procedural material maps its pattern in real
 * metres relative to the Berlin root, so windows, stone joints and weathering keep the
 * correct physical size whether the city is rendered at 1:1 (Germany Experience) or
 * miniaturised on the hero map. Updated each frame by <BerlinCity />.
 */
export type CitySpace = { value: THREE.Matrix4 };
export const createCitySpace = (): CitySpace => ({ value: new THREE.Matrix4() });

const NOISE_GLSL = /* glsl */ `
float fHash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float fNoise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(fHash(i), fHash(i + vec2(1.0, 0.0)), f.x), mix(fHash(i + vec2(0.0, 1.0)), fHash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fFbm(vec2 p) { float v = 0.0; float a = 0.5; for (int k = 0; k < 4; k++) { v += a * fNoise(p); p *= 2.03; a *= 0.5; } return v; }
`;

export type FacadeOptions = {
  key: string;
  base: string;
  roof?: string;
  glass?: string;
  windows?: boolean;
  bay?: number; // metres between window centres
  floor?: number; // storey height in metres
  lit?: number; // strength of warm lit windows
  roughness?: number;
  stone?: boolean; // ashlar joints + heavier weathering (landmarks)
  variety?: boolean; // per-building variation of bays, storeys, tint and frames
};

/**
 * Physically based architectural material: plaster/stone with fbm colour variation,
 * rain streaks and ground grime; recessed windows with frames, mullions and sills;
 * shopfronts, doors and balconies; roofs. Detail fades to an averaged facade tone when
 * a window bay becomes smaller than a few pixels, avoiding moiré at distance.
 */
export function createFacadeMaterial(o: FacadeOptions, space?: CitySpace) {
  const m = new THREE.MeshStandardMaterial({ color: o.base, roughness: o.roughness ?? 0.9, metalness: 0.02 });
  const uniforms = {
    uCityInv: space ?? { value: new THREE.Matrix4() },
    uRoof: { value: new THREE.Color(o.roof ?? "#5b5f64") },
    uGlass: { value: new THREE.Color(o.glass ?? "#1d2833") },
    uLit: { value: new THREE.Color("#ffc47a") },
    uWin: { value: o.windows === false ? 0 : 1 },
    uBay: { value: o.bay ?? 4.2 },
    uFloor: { value: o.floor ?? 3.6 },
    uLitStrength: { value: o.lit ?? 0.35 },
    uStone: { value: o.stone ? 1 : 0 },
    uVariety: { value: o.variety ? 1 : 0 },
  };
  m.userData.uniforms = uniforms;
  m.customProgramCacheKey = () => "facade-v3";
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nuniform mat4 uCityInv;\nvarying vec3 vLP;\nvarying vec3 vLN;")
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
vec4 aLP = vec4(position, 1.0);
vec3 aLN = normal;
#ifdef USE_INSTANCING
aLP = instanceMatrix * aLP;
aLN = mat3(instanceMatrix) * aLN;
#endif
mat4 toCity = uCityInv * modelMatrix;
aLP = toCity * aLP;
aLN = mat3(toCity) * aLN;
vLP = aLP.xyz;
vLN = normalize(aLN);`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
varying vec3 vLP;
varying vec3 vLN;
uniform vec3 uRoof; uniform vec3 uGlass; uniform vec3 uLit;
uniform float uWin; uniform float uBay; uniform float uFloor; uniform float uLitStrength; uniform float uStone; uniform float uVariety;
${NOISE_GLSL}`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
float isRoof = step(0.6, vLN.y);
float wall = 1.0 - isRoof;
vec2 fc = abs(vLN.x) > 0.5 ? vec2(vLP.z, vLP.y) : vec2(vLP.x, vLP.y);
vec2 bid = floor(vLP.xz / 38.0);
float bh = fHash(bid * 1.7 + 3.1);
float bayW = uBay * mix(1.0, mix(0.82, 1.3, fHash(bid + 9.2)), uVariety);
float floorH = uFloor * mix(1.0, mix(0.92, 1.14, fHash(bid + 4.4)), uVariety);
vec2 cell = fc / vec2(bayW, floorH);
vec2 fcell = fract(cell);
vec2 cid = floor(cell);
float detail = clamp(1.8 - length(fwidth(cell)) * 4.0, 0.0, 1.0);

// window opening, frame, mullion + transom, sill and lintel shadow
float wx = smoothstep(0.215, 0.235, fcell.x) * (1.0 - smoothstep(0.765, 0.785, fcell.x));
float wy = smoothstep(0.255, 0.275, fcell.y) * (1.0 - smoothstep(0.815, 0.835, fcell.y));
float opening = wx * wy;
float inner = step(0.255, fcell.x) * step(fcell.x, 0.745) * step(0.295, fcell.y) * step(fcell.y, 0.795);
float frame = opening * (1.0 - inner);
float mull = inner * max(1.0 - step(0.014, abs(fcell.x - 0.5)), 1.0 - step(0.012, abs(fcell.y - 0.66)));
float glassA = inner * (1.0 - mull);
float upper = uWin * wall * step(1.0, cid.y) * detail;
float sill = wall * step(0.2, fcell.x) * step(fcell.x, 0.8) * step(0.235, fcell.y) * step(fcell.y, 0.262);
float reveal = inner * smoothstep(0.795, 0.74, fcell.y) * 0.0 + inner * (1.0 - smoothstep(0.745, 0.7, fcell.y)) * 0.35;
float hasBalc = step(0.74, bh) * uVariety;
float balcony = hasBalc * wall * step(2.0, cid.y) * step(0.16, fcell.x) * step(fcell.x, 0.84) * step(0.16, fcell.y) * step(fcell.y, 0.25) * step(0.5, mod(cid.x, 2.0));
float shop = uWin * wall * (1.0 - step(1.0, cid.y)) * step(0.1, fcell.y) * step(fcell.y, 0.8) * step(0.07, fcell.x) * step(fcell.x, 0.93) * detail;
float door = shop * step(0.82, fHash(cid + bid * 3.0));
float cornice = wall * step(0.945, fcell.y) * step(1.0, cid.y);

// plaster / stone body with weathering
float n1 = fFbm(fc * 0.32 + bid * 13.0);
float n2 = fFbm(vec2(fc.x * 1.7, fc.y * 0.07) + bid * 5.0);
float grime = (1.0 - smoothstep(0.0, 3.5, vLP.y)) * 0.22 * wall;
float streak = smoothstep(0.52, 0.86, n2) * mix(0.1, 0.2, uStone) * wall;
float soot = smoothstep(0.62, 0.9, fFbm(fc * 0.08 + 7.0)) * 0.12 * uStone;
vec3 tint = mix(vec3(1.0), mix(vec3(1.02, 0.98, 0.93), vec3(0.93, 0.96, 1.02), bh), uVariety) * mix(1.0, mix(0.9, 1.07, fHash(bid + 1.3)), uVariety);
diffuseColor.rgb *= tint * (0.85 + 0.26 * n1);
diffuseColor.rgb *= 1.0 - grime - streak - soot;
vec2 bc = vec2(fc.x / 1.9 + step(1.0, mod(floor(fc.y / 0.62), 2.0)) * 0.5, fc.y / 0.62);
vec2 bf = fract(bc);
float joint = clamp((1.0 - step(0.035, bf.y)) + (1.0 - step(0.018, bf.x)), 0.0, 1.0) * clamp(1.6 - length(fwidth(bc)) * 3.0, 0.0, 1.0);
diffuseColor.rgb *= 1.0 - joint * 0.2 * uStone * wall;
diffuseColor.rgb *= 1.0 - 0.16 * cornice;

// windows
float rnd = fHash(cid + bid * 7.0);
vec3 frameCol = mix(vec3(0.84, 0.83, 0.79), vec3(0.16, 0.17, 0.18), step(0.55, fHash(bid + 7.7)));
vec3 glassCol = uGlass * (0.6 + 0.6 * rnd);
diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 1.1 + 0.02, sill * upper);
diffuseColor.rgb *= 1.0 - frame * upper * 0.0;
diffuseColor.rgb = mix(diffuseColor.rgb, frameCol, (frame + mull) * upper);
diffuseColor.rgb = mix(diffuseColor.rgb, glassCol * (1.0 - reveal), glassA * upper);
// distant: averaged facade tone instead of aliasing window grid
diffuseColor.rgb = mix(diffuseColor.rgb, mix(diffuseColor.rgb, uGlass, 0.3), uWin * wall * step(1.0, cid.y) * (1.0 - detail));
diffuseColor.rgb = mix(diffuseColor.rgb, uGlass * 0.85, shop * 0.85);
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.1, 0.085, 0.075), door * 0.9);
diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 0.5, balcony);

// roofs: zinc / slate with patchy ageing
float rn = fFbm(vLP.xz * 0.22);
diffuseColor.rgb = mix(diffuseColor.rgb, uRoof * (0.72 + 0.38 * rn), isRoof);
float isGlass = glassA * upper + shop * 0.85;
float facadeLit = glassA * upper * step(0.74, rnd) + shop * 0.55;`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        "#include <roughnessmap_fragment>\nroughnessFactor = clamp(roughnessFactor * (0.82 + 0.32 * n1), 0.0, 1.0);\nroughnessFactor = mix(roughnessFactor, 0.05, isGlass);\nroughnessFactor = mix(roughnessFactor, 0.6, isRoof * 0.6);",
      )
      .replace("#include <metalnessmap_fragment>", "#include <metalnessmap_fragment>\nmetalnessFactor = mix(metalnessFactor, 0.22, isGlass);")
      .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\ntotalEmissiveRadiance += uLit * facadeLit * uLitStrength;");
  };
  return m;
}

/** Ground surfaces in plane-local metres: asphalt, stone paving, lawn, gravel. */
export function createGroundMaterial(kind: "asphalt" | "paving" | "grass" | "gravel", color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  const k = { asphalt: 0, paving: 1, grass: 2, gravel: 3 }[kind];
  const m = new THREE.MeshStandardMaterial({ color, roughness: kind === "paving" ? 0.82 : 0.95, metalness: 0, ...extra });
  m.customProgramCacheKey = () => "ground-v1";
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uKind = { value: k };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec2 vGP;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvGP = position.xy;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\nvarying vec2 vGP;\nuniform float uKind;\n${NOISE_GLSL}`)
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
float gn = fFbm(vGP * 0.035);
float gf = fNoise(vGP * 1.9);
float gm = fFbm(vGP * 0.3);
float gRough = 0.0;
if (uKind < 0.5) {
  diffuseColor.rgb *= 0.74 + 0.3 * gn + 0.1 * gf;
  float patchA = step(0.78, fHash(floor(vGP / vec2(11.0, 6.0)) * 1.3));
  diffuseColor.rgb *= 1.0 - 0.1 * patchA;
  float crack = (1.0 - smoothstep(0.0, 0.015, abs(fNoise(vGP * 0.09) - 0.5))) * 0.3;
  diffuseColor.rgb *= 1.0 - crack;
  gRough = -0.08 * patchA;
} else if (uKind < 1.5) {
  vec2 sc = vGP / 1.6; vec2 sf = fract(sc); vec2 sid = floor(sc);
  float aa = clamp(1.5 - length(fwidth(sc)) * 3.0, 0.0, 1.0);
  float j = clamp((1.0 - step(0.045, sf.x)) + (1.0 - step(0.045, sf.y)), 0.0, 1.0);
  diffuseColor.rgb *= (0.88 + 0.16 * fHash(sid)) * (0.88 + 0.2 * gm);
  diffuseColor.rgb *= 1.0 - j * 0.22 * aa;
} else if (uKind < 2.5) {
  diffuseColor.rgb *= 0.68 + 0.45 * gn + 0.22 * gm;
  diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(1.18, 1.06, 0.72), smoothstep(0.58, 0.8, gm) * 0.45);
} else {
  diffuseColor.rgb *= 0.84 + 0.3 * gf * gm;
}`,
      )
      .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor = clamp(roughnessFactor + gRough, 0.0, 1.0);");
  };
  return m;
}

/** Leaf-clump colour variation, darker self-shadowed undersides, per-tree tone shift. */
export function createFoliageMaterial() {
  const m = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.92, metalness: 0 });
  m.customProgramCacheKey = () => "foliage-v1";
  m.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vFol;\nvarying float vFolN;\nvarying vec2 vSeed;")
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
vFol = position;
vFolN = normal.y;
vSeed = vec2(0.0);
#ifdef USE_INSTANCING
vSeed = instanceMatrix[3].xz;
#endif`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\nvarying vec3 vFol;\nvarying float vFolN;\nvarying vec2 vSeed;\n${NOISE_GLSL}`)
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
float leaf = fFbm(vFol.xz * 3.1 + vFol.y * 2.3 + vSeed * 0.07);
float clump = fNoise(vFol.xy * 7.0 + vSeed.yx * 0.11);
diffuseColor.rgb *= 0.58 + 0.55 * leaf + 0.12 * clump;
diffuseColor.rgb *= mix(0.45, 1.05, smoothstep(-0.7, 0.85, vFolN));
diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(1.12, 1.04, 0.78), smoothstep(0.62, 0.9, fHash(floor(vSeed * 0.05))) * 0.35);`,
      );
  };
  return m;
}

/** Irregular multi-lobe canopy (unit size) so trees read as foliage rather than spheres. */
export function canopyGeometry() {
  const lobes: [number, number, number, number][] = [
    [0, 0, 0, 1],
    [0.58, -0.18, 0.2, 0.68],
    [-0.5, -0.12, -0.32, 0.72],
    [0.12, 0.42, -0.28, 0.6],
    [-0.22, -0.28, 0.52, 0.62],
    [0.3, 0.22, 0.45, 0.5],
  ];
  const parts = lobes.map(([x, y, z, r], li) => {
    const g = new THREE.IcosahedronGeometry(r, 2);
    const p = g.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const k = 1 + 0.1 * Math.sin(v.x * 3.5 + li) * Math.cos(v.z * 3 - li) + 0.05 * Math.sin(v.y * 5);
      v.multiplyScalar(k);
      p.setXYZ(i, v.x + x, v.y * 0.9 + y, v.z + z);
    }
    return g;
  });
  const merged = mergeGeometries(parts, false)!;
  merged.computeVertexNormals();
  return merged;
}

/** European compact car in metres (length 4.5 m), origin at the traffic lane's matrix. */
export function carGeometries() {
  const lift = -0.8; // traffic code positions cars at y = 1 m over a 0.2 m ground
  const profile = new THREE.Shape(
    [
      [-2.25, 0.34],
      [-2.28, 0.82],
      [-1.95, 0.95],
      [-1.2, 1.0],
      [-0.9, 1.44],
      [0.35, 1.48],
      [0.98, 1.02],
      [2.12, 0.86],
      [2.26, 0.62],
      [2.22, 0.34],
    ].map(([x, y]) => new THREE.Vector2(x, y)),
  );
  const body = new THREE.ExtrudeGeometry(profile, { depth: 1.72, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 3 });
  body.translate(0, lift, -0.86);
  const greenhouse = new THREE.Shape(
    [
      [-1.05, 1.03],
      [-0.84, 1.4],
      [0.33, 1.43],
      [0.9, 1.03],
    ].map(([x, y]) => new THREE.Vector2(x, y)),
  );
  const glass = new THREE.ExtrudeGeometry(greenhouse, { depth: 1.82, bevelEnabled: false });
  glass.translate(0, lift, -0.91);
  const wheelParts = [
    [1.42, 0.82],
    [1.42, -0.82],
    [-1.42, 0.82],
    [-1.42, -0.82],
  ].map(([x, z]) => {
    const w = new THREE.CylinderGeometry(0.34, 0.34, 0.24, 18);
    w.rotateX(Math.PI / 2);
    w.translate(x, 0.34 + lift, z);
    return w;
  });
  const wheels = mergeGeometries(wheelParts, false)!;
  const lightParts = [
    [2.27, 0.72, 0.6, [1, 0.97, 0.88]],
    [2.27, 0.72, -0.6, [1, 0.97, 0.88]],
    [-2.3, 0.8, 0.62, [0.75, 0.04, 0.03]],
    [-2.3, 0.8, -0.62, [0.75, 0.04, 0.03]],
  ].map(([x, y, z, c]) => {
    const b = new THREE.BoxGeometry(0.06, 0.12, 0.34);
    b.translate(x as number, (y as number) + lift, z as number);
    const col = new Float32Array(b.attributes.position.count * 3);
    for (let i = 0; i < col.length; i += 3) col.set(c as number[], i);
    b.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return b;
  });
  const lights = mergeGeometries(lightParts, false)!;
  return { body, glass, wheels, lights };
}

function withColor(g: THREE.BufferGeometry, rgb: [number, number, number]) {
  const ng = g.index ? g.toNonIndexed() : g;
  const c = new Float32Array(ng.attributes.position.count * 3);
  for (let i = 0; i < c.length; i += 3) c.set(rgb, i);
  ng.setAttribute("color", new THREE.BufferAttribute(c, 3));
  return ng;
}

type VehicleSpec = {
  profile: number[][];
  glass: number[][];
  width: number;
  wheelR: number;
  axle: number;
  front: [number, number];
  rear: [number, number];
};

/** One vehicle silhouette: body (+mirrors), glazing, tyres with rims (vertex-coloured), lights (vertex-coloured). */
function vehicle(o: VehicleSpec) {
  const lift = -0.8; // traffic code positions cars at y = 1 m over a 0.2 m ground
  const body = new THREE.ExtrudeGeometry(new THREE.Shape(o.profile.map(([x, y]) => new THREE.Vector2(x, y))), {
    depth: o.width,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.06,
    bevelSegments: 3,
  });
  body.translate(0, lift, -o.width / 2);
  const [gx, gy] = o.glass[o.glass.length - 1];
  const mirrors = [-1, 1].map((s) => {
    const m = new THREE.BoxGeometry(0.12, 0.13, 0.24);
    m.translate(gx - 0.12, gy + 0.06 + lift, s * (o.width / 2 + 0.16));
    return m.toNonIndexed();
  });
  // bumpers: darker lower bands front and rear
  const bumpers = [o.front[0] - 0.02, o.rear[0] + 0.02].map((x) => {
    const b = new THREE.BoxGeometry(0.12, 0.2, o.width + 0.04);
    b.translate(x, 0.42 + lift, 0);
    return b.toNonIndexed();
  });
  const bodyAll = mergeGeometries([body, ...mirrors, ...bumpers], false)!;
  const glass = new THREE.ExtrudeGeometry(new THREE.Shape(o.glass.map(([x, y]) => new THREE.Vector2(x, y))), { depth: o.width + 0.1, bevelEnabled: false });
  glass.translate(0, lift, -(o.width + 0.1) / 2);
  const wz = o.width / 2 - 0.06;
  const wheelParts: THREE.BufferGeometry[] = [];
  for (const x of [o.axle, -o.axle]) {
    for (const z of [wz, -wz]) {
      const tyre = new THREE.CylinderGeometry(o.wheelR, o.wheelR, 0.24, 20);
      tyre.rotateX(Math.PI / 2);
      tyre.translate(x, o.wheelR + lift, z);
      wheelParts.push(withColor(tyre, [0.06, 0.06, 0.065]));
      const rim = new THREE.CylinderGeometry(o.wheelR * 0.62, o.wheelR * 0.62, 0.26, 14);
      rim.rotateX(Math.PI / 2);
      rim.translate(x, o.wheelR + lift, z);
      wheelParts.push(withColor(rim, [0.62, 0.64, 0.67]));
    }
  }
  const lightParts = (
    [
      [o.front[0], o.front[1], 0.58, [1, 0.96, 0.86]],
      [o.front[0], o.front[1], -0.58, [1, 0.96, 0.86]],
      [o.rear[0], o.rear[1], 0.6, [0.7, 0.03, 0.02]],
      [o.rear[0], o.rear[1], -0.6, [0.7, 0.03, 0.02]],
    ] as [number, number, number, [number, number, number]][]
  ).map(([x, y, z, c]) => {
    const b = new THREE.BoxGeometry(0.06, 0.12, 0.36);
    b.translate(x, y + lift, z * (o.width / 1.8));
    return withColor(b, c);
  });
  return { body: bodyAll, glass, wheels: mergeGeometries(wheelParts, false)!, lights: mergeGeometries(lightParts, false)! };
}

/** Three distinct silhouettes so traffic is not a row of clones: saloon, hatchback, SUV. */
export function carVariants() {
  return [
    vehicle({
      profile: [[-2.25, 0.34], [-2.28, 0.82], [-1.95, 0.95], [-1.2, 1.0], [-0.9, 1.44], [0.35, 1.48], [0.98, 1.02], [2.12, 0.86], [2.26, 0.62], [2.22, 0.34]],
      glass: [[-1.05, 1.03], [-0.84, 1.4], [0.33, 1.43], [0.9, 1.03]],
      width: 1.8,
      wheelR: 0.33,
      axle: 1.42,
      front: [2.27, 0.72],
      rear: [-2.3, 0.82],
    }),
    vehicle({
      profile: [[-1.95, 0.34], [-2.0, 0.92], [-1.86, 1.38], [0.3, 1.46], [0.95, 1.0], [1.95, 0.84], [2.05, 0.6], [2.0, 0.34]],
      glass: [[-1.78, 1.02], [-1.7, 1.35], [0.28, 1.41], [0.86, 1.03]],
      width: 1.74,
      wheelR: 0.31,
      axle: 1.28,
      front: [2.04, 0.7],
      rear: [-2.02, 0.9],
    }),
    vehicle({
      profile: [[-2.3, 0.46], [-2.35, 1.1], [-2.22, 1.22], [-2.1, 1.78], [0.45, 1.83], [1.15, 1.22], [2.25, 1.03], [2.35, 0.72], [2.3, 0.46]],
      glass: [[-2.04, 1.26], [-1.99, 1.72], [0.42, 1.76], [1.07, 1.26]],
      width: 1.92,
      wheelR: 0.38,
      axle: 1.46,
      front: [2.36, 0.92],
      rear: [-2.37, 1.05],
    }),
  ];
}

/** Low-poly but proportioned 1.75 m person: body (vertex-coloured legs/shoes; clothing tinted per instance) and head. */
export function humanGeometries() {
  const parts: THREE.BufferGeometry[] = [];
  const add = (g: THREE.BufferGeometry, x: number, y: number, z: number, rgb: [number, number, number]) => {
    g.translate(x, y, z);
    parts.push(withColor(g, rgb));
  };
  add(new THREE.CapsuleGeometry(0.17, 0.46, 4, 10), 0, 1.22, 0, [1, 1, 1]);
  for (const s of [-1, 1]) {
    add(new THREE.CylinderGeometry(0.075, 0.062, 0.84, 7), 0, 0.44, s * 0.1, [0.2, 0.21, 0.24]);
    add(new THREE.CylinderGeometry(0.048, 0.04, 0.62, 6), 0, 1.13, s * 0.25, [1, 1, 1]);
    add(new THREE.BoxGeometry(0.24, 0.07, 0.1), 0.05, 0.035, s * 0.1, [0.09, 0.09, 0.1]);
  }
  const body = mergeGeometries(parts, false)!;
  const head = new THREE.SphereGeometry(0.105, 12, 10);
  head.scale(1, 1.15, 0.95);
  head.translate(0, 1.64, 0);
  return { body, head };
}

/** Soft elliptical alpha falloff so the city ground blends into the surrounding map. */
export function radialFadeTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 60, 128, 128, 128);
  g.addColorStop(0, "#fff");
  g.addColorStop(0.72, "#fff");
  g.addColorStop(1, "#000");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

export function germanFlagTexture() {
  const c = document.createElement("canvas");
  c.width = 60;
  c.height = 36;
  const ctx = c.getContext("2d")!;
  ["#000000", "#DD0000", "#FFCE00"].forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.fillRect(0, i * 12, 60, 12);
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Brushed stainless panels with seams (Fernsehturm sphere) — pattern in object-local spherical coords. */
export function createPanelledSteelMaterial() {
  const m = new THREE.MeshStandardMaterial({ color: "#b8bcc0", metalness: 0.9, roughness: 0.32 });
  m.customProgramCacheKey = () => "steel-panels-v1";
  m.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vSP;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvSP = normalize(position);");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\nvarying vec3 vSP;\n${NOISE_GLSL}`)
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
float th = atan(vSP.z, vSP.x) / 6.2831853 + 0.5;
float ph = acos(clamp(vSP.y, -1.0, 1.0)) / 3.1415927;
vec2 pc = vec2(th * 56.0, ph * 30.0);
vec2 pf = fract(pc); vec2 pid = floor(pc);
float diag = abs(pf.x - (mod(pid.x + pid.y, 2.0) < 1.0 ? pf.y : 1.0 - pf.y));
float aa = clamp(1.4 - length(fwidth(pc)) * 2.5, 0.0, 1.0);
float seam = clamp((1.0 - smoothstep(0.0, 0.04, min(pf.x, 1.0 - pf.x))) + (1.0 - smoothstep(0.0, 0.05, min(pf.y, 1.0 - pf.y))) + (1.0 - smoothstep(0.0, 0.05, diag)), 0.0, 1.0) * aa;
float tri = step(pf.y, mod(pid.x + pid.y, 2.0) < 1.0 ? pf.x : 1.0 - pf.x);
float panelVar = fHash(pid * 2.0 + tri);
diffuseColor.rgb *= (0.86 + 0.2 * panelVar) * (1.0 - 0.45 * seam);
diffuseColor.rgb *= 1.0 - 0.1 * smoothstep(0.55, 0.9, fFbm(pc * 0.2));`,
      )
      .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor = clamp(0.2 + 0.22 * panelVar + 0.3 * seam, 0.0, 1.0);");
  };
  return m;
}

export function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}
