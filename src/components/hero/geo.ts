// Shared map projection for the 3D hero and the SVG fallback (Mercator, centred on Germany).
export const MAP_SCALE = 0.12; // world units per degree of longitude
const CENTER = { lon: 10.4, lat: 51.2 };

const mercY = (lat: number) => (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI;
const CY = mercY(CENTER.lat);

/** Returns [x, y] in map-plane units (y = north). */
export function project(lon: number, lat: number): [number, number] {
  return [(lon - CENTER.lon) * MAP_SCALE, (mercY(lat) - CY) * MAP_SCALE];
}

export type GeoCountry = { id: string; name: string; role: "primary" | "destination" | "source" | "other"; rings: [number, number][][] };

export const places = {
  berlin: { name: "Berlin", lon: 13.405, lat: 52.52 },
  munich: { name: "Munich", lon: 11.58, lat: 48.14 },
  rome: { name: "Rome", lon: 12.5, lat: 41.9 },
  warsaw: { name: "Warsaw", lon: 21.01, lat: 52.23 },
  lisbon: { name: "Lisbon", lon: -9.14, lat: 38.72 },
  vienna: { name: "Vienna", lon: 16.37, lat: 48.21 },
  karachi: { name: "Pakistan", lon: 67.0, lat: 24.86 },
  lahore: { name: "Lahore", lon: 74.34, lat: 31.55 },
  delhi: { name: "India", lon: 77.2, lat: 28.61 },
  dubai: { name: "UAE / Dubai", lon: 55.27, lat: 25.2 },
  abudhabi: { name: "Abu Dhabi", lon: 54.37, lat: 24.45 },
  riyadh: { name: "Saudi Arabia", lon: 46.68, lat: 24.71 },
  dhaka: { name: "Bangladesh", lon: 90.41, lat: 23.81 },
} as const;

export const destinationMarkers = [
  { key: "berlin", flag: "DE", label: "Germany", primary: true },
  { key: "rome", flag: "IT", label: "Italy", primary: false },
  { key: "warsaw", flag: "PL", label: "Poland", primary: false },
  { key: "lisbon", flag: "PT", label: "Portugal", primary: false },
  { key: "vienna", flag: "AT", label: "Austria", primary: false },
] as const;

export const sourceMarkets = [
  { key: "lahore", flag: "PK", label: "Pakistan" },
  { key: "delhi", flag: "IN", label: "India" },
  { key: "dubai", flag: "AE", label: "UAE / Dubai" },
  { key: "riyadh", flag: "SA", label: "Saudi Arabia" },
  { key: "dhaka", flag: "BD", label: "Bangladesh" },
] as const;

/**
 * 3D flight origins — one aircraft each. UAE (Abu Dhabi) and Dubai are separate
 * departure points in the visual; `dy` lifts a label so the two do not overlap.
 */
export const flightOrigins = [
  { key: "lahore", flag: "PK", label: "Pakistan", dy: 0 },
  { key: "delhi", flag: "IN", label: "India", dy: 0 },
  { key: "abudhabi", flag: "AE", label: "UAE · Abu Dhabi", dy: -0.02 },
  { key: "dubai", flag: "AE", label: "Dubai", dy: 0.2 },
  { key: "riyadh", flag: "SA", label: "Saudi Arabia", dy: 0 },
  { key: "dhaka", flag: "BD", label: "Bangladesh", dy: 0 },
] as const;
