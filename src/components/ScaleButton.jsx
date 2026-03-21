import { COLORS } from "../config";

export default function ScaleButton({ value, selected, onClick, color = COLORS.soothing }) {
  const isSelected = selected === value;
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      aria-label={`Rate ${value}`}
      role="radio"
      aria-checked={isSelected}
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: `2px solid ${isSelected ? color : COLORS.border}`,
        background: isSelected ? color : "transparent",
        color: isSelected ? "#fff" : COLORS.textMuted,
        fontFamily: "'Outfit', sans-serif",
        fontSize: 15,
        fontWeight: isSelected ? 600 : 400,
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {value}
    </button>
  );
}
