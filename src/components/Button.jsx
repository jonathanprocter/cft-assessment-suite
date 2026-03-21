import { COLORS } from "../config";

const VARIANT_STYLES = {
  primary: {
    background: `linear-gradient(135deg, ${COLORS.soothing}, ${COLORS.soothingDark})`,
    color: "#fff",
    border: "none",
  },
  secondary: {
    background: "transparent",
    color: COLORS.text,
    border: `2px solid ${COLORS.border}`,
  },
  accent: {
    background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.threatDark})`,
    color: "#fff",
    border: "none",
  },
};

export default function Button({ children, onClick, variant = "primary", disabled = false, style: extraStyle = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...VARIANT_STYLES[variant],
        fontFamily: "'Outfit', sans-serif",
        fontSize: 15,
        fontWeight: 500,
        padding: "14px 32px",
        borderRadius: 12,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s ease",
        letterSpacing: "0.02em",
        ...extraStyle,
      }}
    >{children}</button>
  );
}
