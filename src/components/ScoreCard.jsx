import { COLORS } from "../config";
import { getPercentage, getLevel } from "../scoring";

export default function ScoreCard({ label, score, min, max, color, description }) {
  const pct = getPercentage(score, min, max);
  const level = getLevel(pct);

  return (
    <div style={{
      background: COLORS.white,
      borderRadius: 16,
      padding: 24,
      border: `1px solid ${COLORS.border}`,
      flex: "1 1 220px",
      minWidth: 220,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 500, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 28,
          fontWeight: 700,
          color: color,
        }}>{score}</span>
      </div>
      <div style={{ height: 6, background: COLORS.bgAlt, borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 1s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500, color: color }}>{level}</span>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: COLORS.textLight }}>{min}–{max} range</span>
      </div>
      {description && (
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: COLORS.textMuted, marginTop: 10, lineHeight: 1.5 }}>{description}</p>
      )}
    </div>
  );
}
