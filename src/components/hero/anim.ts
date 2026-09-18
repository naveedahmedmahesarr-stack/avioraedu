export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
/** 1 inside [a,b] with soft edges of width `f`. */
export const band = (a: number, b: number, v: number, f = 0.04) => smoothstep(a - f, a, v) * (1 - smoothstep(b, b + f, v));
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));

export type ProgressRef = { current: number };

/** Story chapters, in progress units — shared by the 3D rig and the HTML overlay. */
export const CHAPTERS = [
  { id: "intro", label: "Europe", start: 0 },
  { id: "routes", label: "Journey", start: 0.4 },
  { id: "germany", label: "Germany", start: 0.5 },
  { id: "berlin", label: "Berlin", start: 0.62 },
  { id: "campus", label: "Campus", start: 0.78 },
  { id: "brand", label: "AVIORA EDU", start: 0.9 },
] as const;
export const INTRO_END = 0.34;
