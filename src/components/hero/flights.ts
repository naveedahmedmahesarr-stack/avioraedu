import * as THREE from "three";
import { flightOrigins } from "./geo";
import { arcCurve, worldAt } from "./space";
import { smoothstep } from "./anim";

/**
 * Deterministic multi-aircraft schedule shared by the aircraft and the chase camera,
 * so the camera never lags the plane it follows.
 *
 * Each origin departs in its own 4.5 s slot (Pakistan → India → UAE → Dubai → Saudi Arabia →
 * Bangladesh), followed by a wide "convergence" slot where every journey is en route to Germany.
 */
export const CHASE_SLOT = 4.5;
export const SHOT_COUNT = flightOrigins.length + 1; // + convergence shot
export const CHASE_CYCLE = CHASE_SLOT * SHOT_COUNT;
export const FLIGHT_DURATION = 30;
const CLOCK_OFFSET = 4.2; // first departure roughly when the intro reaches the routes

export const ROUTE_LIFT = 0.16;
export const flightCurves = flightOrigins.map((o) => arcCurve(worldAt(o.key, 0.04), worldAt("berlin", 0.12), ROUTE_LIFT));

export const CONVERGE_SHOT = { pos: new THREE.Vector3(5.2, 7.2, 9.2), look: new THREE.Vector3(3.6, 0, 1.4) };

const UP = new THREE.Vector3(0, 1, 0);
const tmpDir = new THREE.Vector3();
const tmpSide = new THREE.Vector3();

export function cycleTime(elapsed: number) {
  return (((elapsed - CLOCK_OFFSET) % CHASE_CYCLE) + CHASE_CYCLE) % CHASE_CYCLE;
}

/** Progress of aircraft i along its route; values > 1 mean it has landed (hidden until next departure). */
export function flightProgress(i: number, elapsed: number) {
  const local = (((cycleTime(elapsed) - i * CHASE_SLOT) % CHASE_CYCLE) + CHASE_CYCLE) % CHASE_CYCLE;
  return local / FLIGHT_DURATION;
}

/** Aircraft position/direction at route progress u (flies slightly above the drawn route). */
export function flightPose(i: number, u: number, pos: THREE.Vector3, dir: THREE.Vector3) {
  const c = flightCurves[i];
  const t = Math.min(Math.max(u, 0), 1);
  c.getPoint(t, pos);
  c.getTangent(Math.min(t, 0.999), dir).normalize();
  pos.y += 0.07 * Math.sin(Math.PI * Math.min(1, t * 1.2 + 0.15)) + 0.02;
  return pos;
}

function shot(k: number, t: number, pos: THREE.Vector3, look: THREE.Vector3) {
  if (k >= flightOrigins.length) {
    pos.copy(CONVERGE_SHOT.pos);
    look.copy(CONVERGE_SHOT.look);
    return;
  }
  // During its own slot, aircraft k is early in its journey.
  const u = Math.max(0, t - k * CHASE_SLOT) / FLIGHT_DURATION;
  flightPose(k, u, pos, tmpDir);
  tmpSide.crossVectors(tmpDir, UP).normalize();
  const orbit = Math.sin((t - k * CHASE_SLOT) * 0.35) * 0.25;
  look.copy(pos).addScaledVector(tmpDir, 0.45);
  pos.addScaledVector(tmpDir, -1.0).addScaledVector(UP, 0.36).addScaledVector(tmpSide, 0.55 + orbit);
}

const nextPos = new THREE.Vector3();
const nextLook = new THREE.Vector3();

/** Documentary-style chase camera: follow each departure, then swoop to the next shot. */
export function chaseCamera(elapsed: number, pos: THREE.Vector3, look: THREE.Vector3) {
  const t = cycleTime(elapsed);
  const slot = Math.floor(t / CHASE_SLOT);
  const s = t - slot * CHASE_SLOT;
  shot(slot, t, pos, look);
  const blendStart = CHASE_SLOT - 1.2;
  if (s > blendStart) {
    const next = (slot + 1) % SHOT_COUNT;
    // For the wrap-around, evaluate the next shot at its slot start.
    shot(next, next === 0 ? 0 : t, nextPos, nextLook);
    const k = smoothstep(blendStart, CHASE_SLOT, s);
    pos.lerp(nextPos, k);
    look.lerp(nextLook, k);
  }
}
