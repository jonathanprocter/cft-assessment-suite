import { COLORS } from "../config";

export default function SectionIntro({ icon, title, description, color }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px 30px" }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: color + "15",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px",
        fontSize: 28,
      }}>{icon}</div>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 32,
        fontWeight: 600,
        color: COLORS.text,
        margin: "0 0 12px",
      }}>{title}</h2>
      <p style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: 15,
        lineHeight: 1.7,
        color: COLORS.textMuted,
        maxWidth: 540,
        margin: "0 auto",
      }}>{description}</p>
    </div>
  );
}
