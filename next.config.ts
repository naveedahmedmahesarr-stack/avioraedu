import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Content Security Policy. 'unsafe-inline' scripts are required by Next.js hydration without
// a nonce setup; everything else is locked to this origin. Dev adds eval + websockets for HMR.
const csp = [
  "default-src 'self'",
  // 'wasm-unsafe-eval' lets the locally served Draco decoder (3D tiles) compile WebAssembly.
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "font-src 'self' data:",
  // tile.googleapis.com: Google Photorealistic 3D Tiles for the Berlin scene.
  // blob:/data: — GLTFLoader extracts the tiles' embedded photo textures as blob URLs and fetches them.
  `connect-src 'self' blob: data: https://tile.googleapis.com${isDev ? " ws: wss:" : ""}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    // German-language shortcuts people commonly type for the legal pages.
    return [
      { source: "/impressum", destination: "/legal/imprint", permanent: true },
      { source: "/datenschutz", destination: "/legal/privacy-policy", permanent: true },
      { source: "/privacy", destination: "/legal/privacy-policy", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Cache-Control", value: "no-store" }] },
    ];
  },
};

export default nextConfig;
