import { ImageResponse } from "next/og"

export const alt = "JSON Forge - Developer utilities for JSON workflows"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

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
          background: "linear-gradient(135deg, #0b1120 0%, #111827 55%, #1e293b 100%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background: "#f8fafc",
              color: "#0b1120",
              fontSize: "38px",
              fontWeight: 700,
            }}
          >
            {"{ }"}
          </div>
          <div style={{ fontSize: "36px", fontWeight: 600, letterSpacing: "-0.02em" }}>JSON Forge</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ fontSize: "76px", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            Developer utilities for JSON workflows
          </div>
          <div style={{ fontSize: "32px", color: "#94a3b8" }}>
            Compare · Merge · Validate · Format · Convert · Schema
          </div>
        </div>

        <div style={{ display: "flex", fontSize: "26px", color: "#64748b" }}>jsonforge.com</div>
      </div>
    ),
    size,
  )
}
