import * as THREE from "three";
import { places, project } from "./geo";

/** Map key → world position on the hero map plane (y up, north = -Z). */
export function worldAt(key: keyof typeof places, h = 0): THREE.Vector3 {
  const [x, y] = project(places[key].lon, places[key].lat);
  return new THREE.Vector3(x, h, -y);
}

export function arcCurve(from: THREE.Vector3, to: THREE.Vector3, lift = 0.2) {
  const mid = from.clone().lerp(to, 0.5);
  mid.y += from.distanceTo(to) * lift;
  return new THREE.QuadraticBezierCurve3(from, mid, to);
}
