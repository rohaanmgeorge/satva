import { ImageResponse } from "next/og";

export const alt = "SATVA — Code for future";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#05060a",
          backgroundImage: "radial-gradient(60% 60% at 70% 30%, rgba(139,92,246,.45), transparent 70%)",
          color: "#eef1f7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, color: "#8a90a2" }}>SOFT ALLIANCE FOR TECHNOLOGY, VISION &amp; AI</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 200, fontWeight: 900, letterSpacing: -8, lineHeight: 1 }}>SATVA</div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              backgroundImage: "linear-gradient(100deg, #22d3ee, #8b5cf6, #a3e635)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Code for future
          </div>
        </div>
      </div>
    ),
    size,
  );
}
