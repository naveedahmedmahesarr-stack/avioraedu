import { ImageResponse } from "next/og";

/** PNG version of src/app/icon.svg for clients that request fixed icon paths (favicon.ico, apple-touch-icon.png). */
export function brandIconResponse(px: number) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a1830" }}>
        <svg width={px * 0.75} height={px * 0.75} viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22.6" stroke="#d8b674" strokeWidth="1.4" />
          <path d="M13.6 34.6 23.2 11.6h1.9L15 34.6z" fill="#d8b674" />
          <path d="M23.2 11.6h2.4l9.6 23h-4.1z" fill="#d8b674" />
          <path d="M11.4 34.6h6.1M29 34.6h8.2" stroke="#d8b674" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M16.8 27.4c5.4-2.3 11.6-2.9 18.6-1.6" stroke="#d8b674" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { width: px, height: px, headers: { "Cache-Control": "public, max-age=86400, immutable" } },
  );
}
