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
      {(() => {
        const driveR = 36 + (driveActivation / 100) * 44;
        const soothR = 36 + (soothingActivation / 100) * 44;
        const threatR = 36 + (threatActivation / 100) * 44;
        const driveCx = 120, driveCy = 145;
        const soothCx = 380, soothCy = 145;
        const threatCx = 250, threatCy = 280;
        const gap = 12;

        // Drive ↔ Soothing (horizontal)
        const dsX1 = driveCx + driveR + gap;
        const dsX2 = soothCx - soothR - gap;
        const dsY1 = driveCy - 6;
        const dsY2 = driveCy + 6;

        // Drive ↔ Threat (diagonal)
        const dtAngle = Math.atan2(threatCy - driveCy, threatCx - driveCx);
        const dtX1 = driveCx + Math.cos(dtAngle) * (driveR + gap);
        const dtY1 = driveCy + Math.sin(dtAngle) * (driveR + gap);
        const dtX2 = threatCx - Math.cos(dtAngle) * (threatR + gap);
        const dtY2 = threatCy - Math.sin(dtAngle) * (threatR + gap);

        // Soothing ↔ Threat (diagonal)
        const stAngle = Math.atan2(threatCy - soothCy, threatCx - soothCx);
        const stX1 = soothCx + Math.cos(stAngle) * (soothR + gap);
        const stY1 = soothCy + Math.sin(stAngle) * (soothR + gap);
        const stX2 = threatCx - Math.cos(stAngle) * (threatR + gap);
        const stY2 = threatCy - Math.sin(stAngle) * (threatR + gap);

        // Offset for parallel arrows (perpendicular to line direction)
        const dtPerpX = Math.sin(dtAngle) * 5;
        const dtPerpY = -Math.cos(dtAngle) * 5;
        const stPerpX = Math.sin(stAngle) * 5;
        const stPerpY = -Math.cos(stAngle) * 5;

        return (
          <svg viewBox="0 0 500 360" style={{ width: "100%", maxWidth: 500, display: "block", margin: "0 auto" }}>
            <defs>
              <marker id="arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <path d="M0,0.5 L7,3 L0,5.5" fill="none" stroke={COLORS.textLight} strokeWidth={1.2} />
              </marker>
            </defs>

            {/* Drive → Soothing */}
            <line x1={dsX1} y1={dsY1} x2={dsX2} y2={dsY1} stroke={COLORS.textLight} strokeWidth={1.5} markerEnd="url(#arr)" />
            {/* Soothing → Drive */}
            <line x1={dsX2} y1={dsY2} x2={dsX1} y2={dsY2} stroke={COLORS.textLight} strokeWidth={1.5} markerEnd="url(#arr)" />

            {/* Drive → Threat */}
            <line x1={dtX1 + dtPerpX} y1={dtY1 + dtPerpY} x2={dtX2 + dtPerpX} y2={dtY2 + dtPerpY}
              stroke={COLORS.textLight} strokeWidth={1.5} markerEnd="url(#arr)" />
            {/* Threat → Drive */}
            <line x1={dtX2 - dtPerpX} y1={dtY2 - dtPerpY} x2={dtX1 - dtPerpX} y2={dtY1 - dtPerpY}
              stroke={COLORS.textLight} strokeWidth={1.5} markerEnd="url(#arr)" />

            {/* Soothing → Threat */}
            <line x1={stX1 - stPerpX} y1={stY1 - stPerpY} x2={stX2 - stPerpX} y2={stY2 - stPerpY}
              stroke={COLORS.textLight} strokeWidth={1.5} markerEnd="url(#arr)" />
            {/* Threat → Soothing */}
            <line x1={stX2 + stPerpX} y1={stY2 + stPerpY} x2={stX1 + stPerpX} y2={stY1 + stPerpY}
              stroke={COLORS.textLight} strokeWidth={1.5} markerEnd="url(#arr)" />

            <CircleSystem cx={driveCx} cy={driveCy} label="DRIVE" sublabel="Incentive · Resource" pct={driveActivation} color={COLORS.driveDark} />
            <CircleSystem cx={soothCx} cy={soothCy} label="SOOTHING" sublabel="Safeness · Affiliation" pct={soothingActivation} color={COLORS.soothingDark} />
            <CircleSystem cx={threatCx} cy={threatCy} label="THREAT" sublabel="Protection · Safety" pct={threatActivation} color={COLORS.threatDark} />
          </svg>
        );
      })()}

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
