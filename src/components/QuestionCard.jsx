import { COLORS } from "../config";
import ScaleButton from "./ScaleButton";

export default function QuestionCard({ number, text, value, onChange, scaleMin, scaleMax, scaleLabels, color }) {
  const values = [];
  for (let i = scaleMin; i <= scaleMax; i++) values.push(i);

  return (
    <div style={{
      background: COLORS.white,
      borderRadius: 16,
      padding: "28px 32px",
      marginBottom: 16,
      border: `1px solid ${value != null ? color + "40" : COLORS.border}`,
      transition: "all 0.3s ease",
      boxShadow: value != null ? `0 2px 12px ${color}15` : "none",
    }}>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 19,
        lineHeight: 1.5,
        color: COLORS.text,
        fontWeight: 500,
        margin: "0 0 20px 0",
      }}>
        <span style={{ color: COLORS.textLight, fontWeight: 400, marginRight: 8 }}>{number}.</span>
        {text}
      </p>
      <div
        role="radiogroup"
        aria-label={`Rating for question ${number}`}
        style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "space-between" }}
      >
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: COLORS.textLight, textTransform: "uppercase", letterSpacing: "0.05em", width: 70, textAlign: "center", flexShrink: 0 }}>
          {scaleLabels[0]}
        </span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
          {values.map((v) => (
            <ScaleButton key={v} value={v} selected={value} onClick={onChange} color={color} />
          ))}
        </div>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: COLORS.textLight, textTransform: "uppercase", letterSpacing: "0.05em", width: 70, textAlign: "center", flexShrink: 0 }}>
          {scaleLabels[1]}
        </span>
      </div>
    </div>
  );
}
