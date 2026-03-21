import { COLORS, SCALE_DEFS } from "../config";
import { getPercentage } from "../scoring";

function CircleSystem({ cx, cy, label, sublabel, pct, color }) {
  const r = 30 + (pct / 100) * 50;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color + "20"} stroke={color} strokeWidth={2.5} />
      <text x={cx} y={cy - 10} textAnchor="middle" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, fill: color }}>
        {label}
      </text>
      <text x={cx} y={cy + 6} textAnchor="middle" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fill: COLORS.textMuted }}>
        {sublabel}
      </text>
      <text x={cx} y={cy + 22} textAnchor="middle" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, fill: color }}>
        {pct}%
      </text>
    </g>
  );
}

export default function ThreeCircles({ ecrScores, focsScores, ceasScores }) {
  const ecrDefs = SCALE_DEFS.ecr.subscales;
  const focsDefs = SCALE_DEFS.focs.subscales;
  const ceasDefs = SCALE_DEFS.ceas.subscales;

  const avPct = getPercentage(ecrScores.avoidance.score, ecrDefs.avoidance.min, ecrDefs.avoidance.max);
  const axPct = getPercentage(ecrScores.anxiety.score, ecrDefs.anxiety.min, ecrDefs.anxiety.max);
  const fExtPct = getPercentage(focsScores.extending.score, focsDefs.extending.min, focsDefs.extending.max);
  const fRecPct = getPercentage(focsScores.receiving.score, focsDefs.receiving.min, focsDefs.receiving.max);
  const fSelfPct = getPercentage(focsScores.selfCompassion.score, focsDefs.selfCompassion.min, focsDefs.selfCompassion.max);
  const engPct = getPercentage(ceasScores.engagement.score, ceasDefs.engagement.min, ceasDefs.engagement.max);
  const actPct = getPercentage(ceasScores.action.score, ceasDefs.action.min, ceasDefs.action.max);

  const threatActivation = Math.round((axPct * 0.4) + (fRecPct * 0.3) + (fSelfPct * 0.3));
  const driveActivation = Math.round((avPct * 0.3) + (fExtPct * 0.3) + ((100 - engPct) * 0.4));
  const soothingActivation = Math.round((engPct * 0.3) + (actPct * 0.3) + ((100 - fSelfPct) * 0.2) + ((100 - avPct) * 0.2));

  return (
    <div style={{ background: COLORS.white, borderRadius: 16, padding: "32px 24px", border: `1px solid ${COLORS.border}` }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, textAlign: "center", margin: "0 0 8px", color: COLORS.text }}>
        Three Emotion Regulation Systems
      </h3>
      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: COLORS.textMuted, textAlign: "center", margin: "0 0 24px" }}>
        Circle size reflects estimated system activation based on assessment scores
      </p>
      <svg viewBox="0 0 500 320" style={{ width: "100%", maxWidth: 500, display: "block", margin: "0 auto" }}>
        <CircleSystem cx={120} cy={150} label="DRIVE" sublabel="Incentive / Resource" pct={driveActivation} color={COLORS.driveDark} />
        <CircleSystem cx={380} cy={150} label="SOOTHING" sublabel="Safeness / Affiliation" pct={soothingActivation} color={COLORS.soothingDark} />
        <CircleSystem cx={250} cy={260} label="THREAT" sublabel="Protection / Safety" pct={threatActivation} color={COLORS.threatDark} />
        <defs>
          <marker id="arrowR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill={COLORS.textLight} /></marker>
          <marker id="arrowL" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto"><path d="M8,0 L0,3 L8,6" fill={COLORS.textLight} /></marker>
        </defs>
        <line x1={195} y1={135} x2={305} y2={135} stroke={COLORS.textLight} strokeWidth={1.5} markerEnd="url(#arrowR)" />
        <line x1={305} y1={155} x2={195} y2={155} stroke={COLORS.textLight} strokeWidth={1.5} markerEnd="url(#arrowL)" />
        <line x1={160} y1={205} x2={220} y2={240} stroke={COLORS.textLight} strokeWidth={1.5} markerEnd="url(#arrowR)" />
        <line x1={340} y1={205} x2={280} y2={240} stroke={COLORS.textLight} strokeWidth={1.5} markerEnd="url(#arrowL)" />
      </svg>
    </div>
  );
}
