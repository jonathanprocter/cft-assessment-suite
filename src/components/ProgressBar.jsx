import { COLORS } from "../config";

export default function ProgressBar({ current, total, sections }) {
  const pct = (current / (total - 1)) * 100;
  return (
    <div style={{ padding: "20px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        {sections.map((s, i) => (
          <span key={i} style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 11,
            fontWeight: i === current ? 600 : 400,
            color: i < current ? COLORS.soothing : i === current ? COLORS.text : COLORS.textLight,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            transition: "all 0.3s ease",
          }}>{s}</span>
        ))}
      </div>
      <div style={{ height: 4, background: COLORS.border, borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${COLORS.soothing}, ${COLORS.accent})`,
          borderRadius: 2,
          transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }} />
      </div>
    </div>
  );
}
