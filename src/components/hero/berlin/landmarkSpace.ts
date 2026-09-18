import * as THREE from "three";
import type { LandmarkKey } from "./BerlinCity";

/**
 * Real-world landmark positions in metres relative to the Brandenburger Tor
 * (+X east, +Z south), derived from WGS84 coordinates:
 *   Brandenburger Tor 52.51627, 13.37770 · Reichstag 52.51862, 13.37618 · Fernsehturm 52.52082, 13.40940
 * Used when the Google Photorealistic 3D Tiles (true geography) are active.
 */
export const REAL_LANDMARKS: Record<LandmarkKey, THREE.Vector3> = {
  gate: new THREE.Vector3(0, 0, 0),
  reichstag: new THREE.Vector3(-103, 0, -261),
  tower: new THREE.Vector3(2146, 0, -506),
};

/** Brandenburger Tor ground point; height is ellipsoidal (≈34 m above sea level + ≈40 m geoid). */
export const BERLIN_ORIGIN = { lat: 52.51627, lon: 13.3777, height: 74 };

/** Which Berlin is currently rendered — read by the camera rig for click-to-focus shots. */
export const berlinSource: { current: "procedural" | "tiles" } = { current: "procedural" };
