import { ImageResponse } from "next/og";

export const alt = "AVIORA EDU — Study in Germany & Europe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social share card: navy field, gold monogram, wordmark and positioning line. No claims or statistics. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 70% 20%, #1a3357 0%, #0a1830 45%, #050d1c 100%)",
          color: "#f7f3ea",
          fontFamily: "serif",
        }}
      >
        <svg width="150" height="150" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22.6" stroke="#d8b674" strokeWidth="1" />
          <circle cx="24" cy="24" r="20.4" stroke="#d8b674" strokeWidth="0.45" opacity="0.55" />
          <path d="M13.6 34.6 23.2 11.6h1.9L15 34.6z" fill="#d8b674" />
          <path d="M23.2 11.6h2.4l9.6 23h-4.1z" fill="#d8b674" />
          <path d="M11.4 34.6h6.1M29 34.6h8.2" stroke="#d8b674" strokeWidth="0.9" strokeLinecap="round" />
          <path d="M16.8 27.4c5.4-2.3 11.6-2.9 18.6-1.6" stroke="#d8b674" strokeWidth="1.05" strokeLinecap="round" />
          <path d="M37.9 25.6 38.5 24.3 39.1 25.6 40.4 26.2 39.1 26.8 38.5 28.1 37.9 26.8 36.6 26.2z" fill="#f1e2bb" />
        </svg>
        <div style={{ marginTop: 36, fontSize: 76, letterSpacing: 18, display: "flex" }}>AVIORA</div>
        <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 18, color: "#d8b674", fontSize: 24, letterSpacing: 12 }}>
          <div style={{ width: 90, height: 1, background: "#d8b674", opacity: 0.6 }} />
          EDU
          <div style={{ width: 90, height: 1, background: "#d8b674", opacity: 0.6 }} />
        </div>
        <div style={{ marginTop: 44, fontSize: 30, color: "#9fb1cc", display: "flex" }}>Study in Germany and selected European destinations</div>
      </div>
    ),
    size,
  );
}
