import { COLORS, SCALE_DEFS } from "../config";
import { getPercentage, getLevel } from "../scoring";

function CircleSystem({ cx, cy, label, sublabel, pct, color, description }) {
  const r = 36 + (pct / 100) * 44;
  const level = getLevel(pct);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color + "15"} stroke={color} strokeWidth={2.5} />
      <text x={cx} y={cy - 14} textAnchor="middle" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 700, fill: color, letterSpacing: "0.08em" }}>
        {label}
      </text>
      <text x={cx} y={cy + 2} textAnchor="middle" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fill: COLORS.textMuted }}>
        {sublabel}
      </text>
      <text x={cx} y={cy + 20} textAnchor="middle" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, fill: color }}>
        {pct}%
      </text>
      <text x={cx} y={cy + 34} textAnchor="middle" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, fontWeight: 500, fill: color, opacity: 0.8 }}>
        {level}
      </text>
    </g>
  );
}

function SystemDetail({ label, items, color }) {
  return (
    <div style={{ flex: "1 1 180px", minWidth: 160 }}>
      <div style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, color,
        textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8,
        paddingBottom: 4, borderBottom: `2px solid ${color}30`,
      }}>{label}</div>
      {items.map(({ name, pct, desc }) => (
        <div key={name} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: COLORS.text }}>{name}</span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, color }}>{pct}%</span>
          </div>
          <div style={{ height: 5, background: COLORS.bgAlt, borderRadius: 3, overflow: "hidden", marginBottom: 2 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 1s ease" }} />
          </div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: COLORS.textMuted, lineHeight: 1.3 }}>{desc}</div>
        </div>
      ))}
    </div>
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

  const systems = [
    { name: "Threat", pct: threatActivation, color: COLORS.threatDark },
    { name: "Drive", pct: driveActivation, color: COLORS.driveDark },
    { name: "Soothing", pct: soothingActivation, color: COLORS.soothingDark },
  ];
  const dominant = systems.reduce((a, b) => a.pct > b.pct ? a : b);
  const weakest = systems.reduce((a, b) => a.pct < b.pct ? a : b);

  return (
    <div style={{ background: COLORS.white, borderRadius: 16, padding: "32px 24px", border: `1px solid ${COLORS.border}` }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, textAlign: "center", margin: "0 0 6px", color: COLORS.text }}>
        Three Emotion Regulation Systems
      </h3>
      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: COLORS.textMuted, textAlign: "center", margin: "0 0 6px", lineHeight: 1.5 }}>
        CFT maps emotional experience onto three evolved systems that interact to regulate affect.
        <br />Circle size reflects estimated activation level derived from assessment scores.
      </p>

      {/* Summary callout */}
      <div style={{
        background: COLORS.bgAlt, borderRadius: 10, padding: "12px 16px", margin: "12px auto 20px",
        maxWidth: 480, textAlign: "center",
        fontFamily: "'Outfit', sans-serif", fontSize: 13, color: COLORS.text, lineHeight: 1.5,
      }}>
        <strong style={{ color: dominant.color }}>{dominant.name}</strong> system appears most active ({dominant.pct}%) &nbsp;·&nbsp;
        <strong style={{ color: weakest.color }}>{weakest.name}</strong> system may need strengthening ({weakest.pct}%)
      </div>

      {/* SVG diagram */}
      <svg viewBox="0 0 500 340" style={{ width: "100%", maxWidth: 500, display: "block", margin: "0 auto" }}>
        <defs>
          <marker id="arrowR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill={COLORS.textLight} /></marker>
          <marker id="arrowL" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto"><path d="M8,0 L0,3 L8,6" fill={COLORS.textLight} /></marker>
        </defs>

        {/* Arrows between systems */}
        <line x1={195} y1={130} x2={305} y2={130} stroke={COLORS.textLight} strokeWidth={1.5} markerEnd="url(#arrowR)" />
        <line x1={305} y1={150} x2={195} y2={150} stroke={COLORS.textLight} strokeWidth={1.5} markerEnd="url(#arrowL)" />
        <line x1={155} y1={205} x2={215} y2={245} stroke={COLORS.textLight} strokeWidth={1.5} markerEnd="url(#arrowR)" />
        <line x1={345} y1={205} x2={285} y2={245} stroke={COLORS.textLight} strokeWidth={1.5} markerEnd="url(#arrowL)" />

        <CircleSystem cx={120} cy={145} label="DRIVE" sublabel="Incentive · Resource" pct={driveActivation} color={COLORS.driveDark} />
        <CircleSystem cx={380} cy={145} label="SOOTHING" sublabel="Safeness · Affiliation" pct={soothingActivation} color={COLORS.soothingDark} />
        <CircleSystem cx={250} cy={270} label="THREAT" sublabel="Protection · Safety" pct={threatActivation} color={COLORS.threatDark} />
      </svg>

      {/* Score breakdown by system */}
      <div style={{
        display: "flex", gap: 24, flexWrap: "wrap", marginTop: 16,
        padding: "20px 16px 8px", borderTop: `1px solid ${COLORS.border}`,
      }}>
        <SystemDetail label="Threat System" color={COLORS.threatDark} items={[
          { name: "Attachment Anxiety", pct: axPct, desc: "Fear of abandonment / rejection" },
          { name: "Fear: Receiving", pct: fRecPct, desc: "Blocks to accepting compassion" },
          { name: "Fear: Self-Compassion", pct: fSelfPct, desc: "Resistance to self-directed care" },
        ]} />
        <SystemDetail label="Drive System" color={COLORS.driveDark} items={[
          { name: "Attachment Avoidance", pct: avPct, desc: "Self-reliance / emotional distance" },
          { name: "Fear: Extending", pct: fExtPct, desc: "Hesitancy giving compassion" },
        ]} />
        <SystemDetail label="Soothing System" color={COLORS.soothingDark} items={[
          { name: "Engagement", pct: engPct, desc: "Noticing and tolerating distress" },
          { name: "Action", pct: actPct, desc: "Taking compassionate action for self" },
        ]} />
      </div>

      {/* How to read this */}
      <div style={{
        marginTop: 16, padding: "12px 16px", background: COLORS.bgAlt, borderRadius: 8,
        fontFamily: "'Outfit', sans-serif", fontSize: 11, color: COLORS.textMuted, lineHeight: 1.6,
      }}>
        <strong style={{ color: COLORS.text }}>How to read this:</strong> In CFT, the <strong style={{ color: COLORS.threatDark }}>Threat</strong> system
        drives anxiety, self-criticism, and fear responses. The <strong style={{ color: COLORS.driveDark }}>Drive</strong> system
        motivates achievement, status-seeking, and avoidance of vulnerability. The <strong style={{ color: COLORS.soothingDark }}>Soothing</strong> system
        enables feelings of safety, connection, and compassion. Therapeutic work typically aims to strengthen the Soothing system
        while developing a healthier relationship with Threat and Drive activation. Higher percentages in Threat/Drive suggest overactivation;
        lower percentages in Soothing suggest an underdeveloped capacity for self-compassion and felt safety.
      </div>
    </div>
  );
}
