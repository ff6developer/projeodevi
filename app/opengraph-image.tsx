import { ImageResponse } from "next/og";
import { SITE_NAME, BRAND } from "./site-config";

export const alt = `${SITE_NAME} — ${BRAND.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Marka paletiyle üretilen statik OG görseli (build sırasında).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#17140f",
          color: "#f2ede3",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 30,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#d98a5c",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              background: "#d98a5c",
            }}
          />
          {SITE_NAME}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 84, lineHeight: 1.05, maxWidth: 900 }}>
            {BRAND.tagline}
          </div>
          <div style={{ fontSize: 32, color: "#b3aa9b", maxWidth: 820 }}>
            Menüden hazır seç ya da kendi kahveni tasarla.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
