import { useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
} from "recharts";
import { COLORS, SCALE_DEFS } from "../config";
import { getPercentage, getLevel } from "../scoring";
import ThreeCircles from "./ThreeCircles";
import ScoreCard from "./ScoreCard";
import Button from "./Button";

// ─── Clinical prompt builder ─────────────────────────────────────────

const CLINICIAN = "Jonathan Procter, Ph.D., LMHC, CRC, NCC, ACS";

function buildClinicalPrompt(allScores, clientName, assessmentType, previousData) {
  const s = allScores;
  const ecrDefs = SCALE_DEFS.ecr.subscales;
  const focsDefs = SCALE_DEFS.focs.subscales;
  const ceasDefs = SCALE_DEFS.ceas.subscales;

  const pctStr = (score, min, max) => {
    const p = getPercentage(score, min, max);
    return `${p}th percentile of range — ${getLevel(p)}`;
  };

  let prompt = `You are a clinical psychologist specializing in Compassion-Focused Therapy (CFT), writing a comprehensive clinical assessment report. Write in a professional yet warm clinical voice. This report must be both a rigorous clinical document AND a practical treatment-planning tool with specific, actionable interventions.

CLINICIAN: ${CLINICIAN}
CLIENT: ${clientName}
ASSESSMENT TYPE: ${assessmentType.toUpperCase()}
DATE: ${new Date().toLocaleDateString()}

═══ ECR-RS (Experiences in Close Relationships - Revised Short Form) ═══
Attachment Avoidance: ${s.ecr.avoidance.score}/${ecrDefs.avoidance.max} (${pctStr(s.ecr.avoidance.score, ecrDefs.avoidance.min, ecrDefs.avoidance.max)})
Attachment Anxiety: ${s.ecr.anxiety.score}/${ecrDefs.anxiety.max} (${pctStr(s.ecr.anxiety.score, ecrDefs.anxiety.min, ecrDefs.anxiety.max)})
Range note: Avoidance ${ecrDefs.avoidance.min}-${ecrDefs.avoidance.max} (higher = more avoidance), Anxiety ${ecrDefs.anxiety.min}-${ecrDefs.anxiety.max} (higher = more anxiety)

═══ FOCS (Fears of Compassion Scale - abbreviated) ═══
Fears of Extending Compassion: ${s.focs.extending.score}/${focsDefs.extending.max} (${pctStr(s.focs.extending.score, focsDefs.extending.min, focsDefs.extending.max)})
Fears of Receiving Compassion: ${s.focs.receiving.score}/${focsDefs.receiving.max} (${pctStr(s.focs.receiving.score, focsDefs.receiving.min, focsDefs.receiving.max)})
Fears of Self-Compassion: ${s.focs.selfCompassion.score}/${focsDefs.selfCompassion.max} (${pctStr(s.focs.selfCompassion.score, focsDefs.selfCompassion.min, focsDefs.selfCompassion.max)})
Range note: Each ${focsDefs.extending.min}-${focsDefs.extending.max} (higher = more fear)

═══ CEAS-SC (Compassionate Engagement and Action Scale - Self-Compassion) ═══
Compassionate Engagement: ${s.ceas.engagement.score}/${ceasDefs.engagement.max} (${pctStr(s.ceas.engagement.score, ceasDefs.engagement.min, ceasDefs.engagement.max)})
Compassionate Action: ${s.ceas.action.score}/${ceasDefs.action.max} (${pctStr(s.ceas.action.score, ceasDefs.action.min, ceasDefs.action.max)})
Range note: Engagement ${ceasDefs.engagement.min}-${ceasDefs.engagement.max}, Action ${ceasDefs.action.min}-${ceasDefs.action.max} (higher = more compassionate engagement/action)`;

  if (previousData) {
    const ps = previousData.scores;
    prompt += `

═══ PRETEST COMPARISON DATA ═══
Previous assessment date: ${new Date(previousData.date).toLocaleDateString()}
Previous Attachment Avoidance: ${ps.ecr.avoidance.score}/${ecrDefs.avoidance.max}
Previous Attachment Anxiety: ${ps.ecr.anxiety.score}/${ecrDefs.anxiety.max}
Previous Fears of Extending: ${ps.focs.extending.score}/${focsDefs.extending.max}
Previous Fears of Receiving: ${ps.focs.receiving.score}/${focsDefs.receiving.max}
Previous Fears of Self-Compassion: ${ps.focs.selfCompassion.score}/${focsDefs.selfCompassion.max}
Previous Compassionate Engagement: ${ps.ceas.engagement.score}/${ceasDefs.engagement.max}
Previous Compassionate Action: ${ps.ceas.action.score}/${ceasDefs.action.max}`;
  }

  prompt += `

Generate a clinical report with the following sections. Use markdown headers (## for sections). Mix flowing paragraphs with structured lists where appropriate — prioritize clinical utility over prose style.

## Clinical Assessment Summary
Clinician: ${CLINICIAN}
Client: ${clientName}
Date and assessment type. Brief 2-3 sentence overview of the overall clinical picture.

## Attachment Profile
Interpret the ECR-RS pattern. Name the attachment style. Describe how it likely manifests in: (a) the therapeutic relationship, (b) close personal relationships, and (c) self-regulation under stress.

## Compassion Flow Analysis
Analyze all three FOCS subscales. Identify which direction of compassion flow is most blocked. Explain what these fears may protect against psychologically. Note discrepancies between extending, receiving, and self-compassion fears — what story do the gaps tell?

## Self-Compassion Capacity
Interpret CEAS-SC engagement vs. action. Identify whether the gap is in awareness (noticing distress) or in response (taking compassionate action). What does this mean for intervention sequencing?

## Three Systems Formulation
Map onto the CFT three-circle model (Threat, Drive, Soothing). Identify: which system is overactive, which is underdeveloped, and how the systems interact in this client's specific pattern. Be concrete about how this shows up in daily life.

## Treatment Plan & Therapeutic Targets
This is the most important section. For each target, provide:

**Target 1: [Name]**
- Clinical rationale (why this target, based on scores)
- Specific CFT interventions (name the actual exercises/techniques)
- Session structure recommendation (e.g., "Introduce in session 3-4, practice for 2-3 sessions")
- Between-session practice assignment

**Target 2: [Name]**
(same structure)

**Target 3: [Name]**
(same structure)

**Target 4: [Name]** (if warranted)
(same structure)

Include specific CFT exercises such as: soothing rhythm breathing, compassionate image work, compassion-focused chair work, compassionate letter writing, fears of compassion exploration, threat system psychoeducation, multiple selves work, compassionate mind training, body-based soothing practices, or other evidence-based CFT interventions. Be specific — name the exercise, describe what it targets, and how to implement it.

## Therapeutic Relationship Considerations
Based on the attachment profile: what should the clinician watch for in the therapeutic alliance? What rupture patterns might emerge? How should the clinician adapt their relational stance?

## Between-Session Practices
List 3-5 specific homework/practice assignments the client can begin, ranked by priority. For each: name it, describe it in 1-2 sentences, specify frequency (daily, 3x/week, etc.), and note what it targets.

## Reflective Questions for the Client
4-5 open-ended questions tailored to this client's specific pattern that could guide self-exploration between sessions.

${previousData ? `## Pre/Post Change Analysis
Compare pretest and posttest scores. For each scale: direction of change, clinical significance, what it suggests about therapeutic progress. Identify what has improved, what remains stuck, and what may need a shift in intervention approach.` : ""}

## Summary & Next Steps
2-3 sentence synthesis. Recommended reassessment timeline. Any flags for the clinician.

Write approximately 1500-2500 words. Be clinically specific — avoid generic advice. Every recommendation should connect back to this client's actual scores.`;

  return prompt;
}

// ─── Clinical profile bar data builder ───────────────────────────────

function buildProfileData(allScores) {
  const ecrDefs = SCALE_DEFS.ecr.subscales;
  const focsDefs = SCALE_DEFS.focs.subscales;
  const ceasDefs = SCALE_DEFS.ceas.subscales;

  return [
    { name: "Avoidance", value: getPercentage(allScores.ecr.avoidance.score, ecrDefs.avoidance.min, ecrDefs.avoidance.max), fill: COLORS.driveDark, system: "Attachment" },
    { name: "Anxiety", value: getPercentage(allScores.ecr.anxiety.score, ecrDefs.anxiety.min, ecrDefs.anxiety.max), fill: COLORS.threatDark, system: "Attachment" },
    { name: "Fear: Extending", value: getPercentage(allScores.focs.extending.score, focsDefs.extending.min, focsDefs.extending.max), fill: COLORS.drive, system: "Compassion Fears" },
    { name: "Fear: Receiving", value: getPercentage(allScores.focs.receiving.score, focsDefs.receiving.min, focsDefs.receiving.max), fill: COLORS.threat, system: "Compassion Fears" },
    { name: "Fear: Self", value: getPercentage(allScores.focs.selfCompassion.score, focsDefs.selfCompassion.min, focsDefs.selfCompassion.max), fill: COLORS.accent, system: "Compassion Fears" },
    { name: "Engagement", value: getPercentage(allScores.ceas.engagement.score, ceasDefs.engagement.min, ceasDefs.engagement.max), fill: COLORS.soothing, system: "Self-Compassion" },
    { name: "Action", value: getPercentage(allScores.ceas.action.score, ceasDefs.action.min, ceasDefs.action.max), fill: COLORS.soothingDark, system: "Self-Compassion" },
  ];
}

// ─── Custom bar with per-bar color ──────────────────────────────────

function ProfileBar(props) {
  const { x, y, width, height, payload } = props;
  return <rect x={x} y={y} width={width} height={height} rx={4} fill={payload.fill} />;
}

// ─── Clinical zone reference lines ──────────────────────────────────

function ClinicalZones() {
  return (
    <>
      <defs>
        <pattern id="zone-low" x="0" y="0" width="100%" height="100%">
          <rect width="100%" height="100%" fill={COLORS.soothingLight} opacity="0.3" />
        </pattern>
        <pattern id="zone-high" x="0" y="0" width="100%" height="100%">
          <rect width="100%" height="100%" fill={COLORS.threatLight} opacity="0.3" />
        </pattern>
      </defs>
    </>
  );
}

// ─── Pre/post comparison data builder ────────────────────────────────

function buildComparisonData(allScores, previousData) {
  const ecrDefs = SCALE_DEFS.ecr.subscales;
  const focsDefs = SCALE_DEFS.focs.subscales;
  const ceasDefs = SCALE_DEFS.ceas.subscales;
  const ps = previousData.scores;

  return [
    { name: "Avoidance", pre: getPercentage(ps.ecr.avoidance.score, ecrDefs.avoidance.min, ecrDefs.avoidance.max), post: getPercentage(allScores.ecr.avoidance.score, ecrDefs.avoidance.min, ecrDefs.avoidance.max) },
    { name: "Anxiety", pre: getPercentage(ps.ecr.anxiety.score, ecrDefs.anxiety.min, ecrDefs.anxiety.max), post: getPercentage(allScores.ecr.anxiety.score, ecrDefs.anxiety.min, ecrDefs.anxiety.max) },
    { name: "Fear: Ext.", pre: getPercentage(ps.focs.extending.score, focsDefs.extending.min, focsDefs.extending.max), post: getPercentage(allScores.focs.extending.score, focsDefs.extending.min, focsDefs.extending.max) },
    { name: "Fear: Rec.", pre: getPercentage(ps.focs.receiving.score, focsDefs.receiving.min, focsDefs.receiving.max), post: getPercentage(allScores.focs.receiving.score, focsDefs.receiving.min, focsDefs.receiving.max) },
    { name: "Fear: Self", pre: getPercentage(ps.focs.selfCompassion.score, focsDefs.selfCompassion.min, focsDefs.selfCompassion.max), post: getPercentage(allScores.focs.selfCompassion.score, focsDefs.selfCompassion.min, focsDefs.selfCompassion.max) },
    { name: "Engage.", pre: getPercentage(ps.ceas.engagement.score, ceasDefs.engagement.min, ceasDefs.engagement.max), post: getPercentage(allScores.ceas.engagement.score, ceasDefs.engagement.min, ceasDefs.engagement.max) },
    { name: "Action", pre: getPercentage(ps.ceas.action.score, ceasDefs.action.min, ceasDefs.action.max), post: getPercentage(allScores.ceas.action.score, ceasDefs.action.min, ceasDefs.action.max) },
  ];
}

// ─── Download helper ─────────────────────────────────────────────────

function downloadReport(allScores, clientName, assessmentType, clinicalWriteup) {
  const safeName = (clientName || "Client").replace(/[^a-zA-Z0-9_-]/g, "_");
  const blob = new Blob([
    `CFT ASSESSMENT RESULTS\n${"=".repeat(50)}\n`,
    `Clinician: ${CLINICIAN}\n`,
    `Client: ${clientName || "N/A"}\n`,
    `Type: ${assessmentType}\n`,
    `Date: ${new Date().toLocaleDateString()}\n\n`,
    `SCORES\n${"-".repeat(30)}\n`,
    `Attachment Avoidance: ${allScores.ecr.avoidance.score}/${SCALE_DEFS.ecr.subscales.avoidance.max}\n`,
    `Attachment Anxiety: ${allScores.ecr.anxiety.score}/${SCALE_DEFS.ecr.subscales.anxiety.max}\n`,
    `Fears of Extending: ${allScores.focs.extending.score}/${SCALE_DEFS.focs.subscales.extending.max}\n`,
    `Fears of Receiving: ${allScores.focs.receiving.score}/${SCALE_DEFS.focs.subscales.receiving.max}\n`,
    `Fears of Self-Compassion: ${allScores.focs.selfCompassion.score}/${SCALE_DEFS.focs.subscales.selfCompassion.max}\n`,
    `Compassionate Engagement: ${allScores.ceas.engagement.score}/${SCALE_DEFS.ceas.subscales.engagement.max}\n`,
    `Compassionate Action: ${allScores.ceas.action.score}/${SCALE_DEFS.ceas.subscales.action.max}\n\n`,
    `CLINICAL NARRATIVE\n${"-".repeat(30)}\n`,
    clinicalWriteup,
  ], { type: "text/plain" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `CFT_Assessment_${safeName}_${assessmentType}_${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

// ─── Markdown-ish renderer ───────────────────────────────────────────

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, j) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={j} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function renderWriteup(text) {
  return text.split("\n").map((line, i) => {
    if (!line.trim()) return null;
    if (line.startsWith("## ")) {
      const clean = line.slice(3).trim();
      return (
        <h3 key={i} style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 17,
          fontWeight: 600,
          color: COLORS.soothing,
          margin: "32px 0 10px",
          paddingBottom: 6,
          borderBottom: `2px solid ${COLORS.soothingLight}`,
          letterSpacing: "0.02em",
        }}>{clean}</h3>
      );
    }
    if (line.startsWith("# ")) {
      const clean = line.slice(2).trim();
      return (
        <h2 key={i} style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 22,
          fontWeight: 600,
          color: COLORS.text,
          margin: "28px 0 12px",
        }}>{clean}</h2>
      );
    }
    if (line.match(/^\*\*Target \d|^\*\*[A-Z]/)) {
      const clean = line.replace(/\*\*/g, "").trim();
      return (
        <h4 key={i} style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 15,
          fontWeight: 600,
          color: COLORS.driveDark,
          margin: "20px 0 6px",
        }}>{clean}</h4>
      );
    }
    if (line.match(/^[-•]\s/)) {
      return (
        <div key={i} style={{ display: "flex", gap: 8, margin: "0 0 8px", paddingLeft: 8 }}>
          <span style={{ color: COLORS.soothing, fontWeight: 600, flexShrink: 0 }}>-</span>
          <span>{renderInline(line.replace(/^[-•]\s/, ""))}</span>
        </div>
      );
    }
    if (line.match(/^\d+\.\s/)) {
      return (
        <div key={i} style={{ display: "flex", gap: 8, margin: "0 0 8px", paddingLeft: 8 }}>
          <span style={{ color: COLORS.soothing, fontWeight: 600, flexShrink: 0 }}>{line.match(/^\d+/)[0]}.</span>
          <span>{renderInline(line.replace(/^\d+\.\s/, ""))}</span>
        </div>
      );
    }
    return <p key={i} style={{ margin: "0 0 14px" }}>{renderInline(line)}</p>;
  });
}

// ─── MAIN RESULTS VIEW ──────────────────────────────────────────────

export default function ResultsView({ allScores, clientName, assessmentType, previousData, onReset }) {
  const [clinicalWriteup, setClinicalWriteup] = useState("");
  const [generating, setGenerating] = useState(false);

  const generateClinicalWriteup = async () => {
    const proxyBase = import.meta.env.VITE_PROXY_URL;
    if (!proxyBase) {
      setClinicalWriteup("Missing proxy URL. Set VITE_PROXY_URL to enable write-up generation.");
      return;
    }
    setGenerating(true);
    setClinicalWriteup("");
    const prompt = buildClinicalPrompt(allScores, clientName, assessmentType, previousData);

    try {
      const response = await fetch(`${proxyBase.replace(/\/$/, "")}/v1/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "anthropic/claude-3.5-sonnet",
          max_tokens: 8000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
      }
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content
        || "Unable to generate write-up. Please try again.";
      setClinicalWriteup(text);
    } catch (e) {
      setClinicalWriteup("Error generating clinical write-up. Please check your connection and try again.");
    }
    setGenerating(false);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: "center", padding: "30px 0 20px" }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 36,
          fontWeight: 600,
          color: COLORS.text,
          margin: "0 0 8px",
        }}>
          {clientName ? `${clientName}'s` : "Your"} Assessment Results
        </h1>
        <p style={{ fontSize: 14, color: COLORS.textMuted, margin: "0 0 4px" }}>
          {assessmentType.charAt(0).toUpperCase() + assessmentType.slice(1)} · {new Date().toLocaleDateString()}
        </p>
        <p style={{ fontSize: 13, color: COLORS.textMuted, margin: 0 }}>
          Clinician: {CLINICIAN}
        </p>
      </div>

      {/* Three Circles */}
      <ThreeCircles ecrScores={allScores.ecr} focsScores={allScores.focs} ceasScores={allScores.ceas} />

      {/* ECR-RS Scores */}
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, margin: "32px 0 16px", color: COLORS.text }}>
        Attachment Pattern
      </h3>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <ScoreCard {...allScores.ecr.avoidance} color={COLORS.driveDark}
          description="Discomfort with closeness and dependence on others" />
        <ScoreCard {...allScores.ecr.anxiety} color={COLORS.threatDark}
          description="Worry about being cared for and fear of abandonment" />
      </div>

      {/* FOCS Scores */}
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, margin: "32px 0 16px", color: COLORS.text }}>
        Fears of Compassion
      </h3>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <ScoreCard {...allScores.focs.extending} color={COLORS.drive}
          description="Concerns about giving compassion to others" />
        <ScoreCard {...allScores.focs.receiving} color={COLORS.threat}
          description="Difficulty accepting compassion from others" />
        <ScoreCard {...allScores.focs.selfCompassion} color={COLORS.accent}
          description="Resistance to self-directed compassion" />
      </div>

      {/* CEAS-SC Scores */}
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, margin: "32px 0 16px", color: COLORS.text }}>
        Self-Compassion Capacity
      </h3>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <ScoreCard {...allScores.ceas.engagement} color={COLORS.soothing}
          description="Noticing, tolerating, and reflecting on distress" />
        <ScoreCard {...allScores.ceas.action} color={COLORS.soothingDark}
          description="Taking helpful action and generating inner support" />
      </div>

      {/* Clinical Profile Chart */}
      <div style={{ background: COLORS.white, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.border}`, marginTop: 24 }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, margin: "0 0 4px", textAlign: "center", color: COLORS.text }}>
          Clinical Profile
        </h3>
        <p style={{ fontSize: 12, color: COLORS.textMuted, textAlign: "center", margin: "0 0 8px" }}>
          All scores normalized to percentage of scale range
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "Low (0-25%)", color: COLORS.soothingLight, border: COLORS.soothing },
            { label: "Low-Mod (25-50%)", color: "#f5f5f0", border: COLORS.textLight },
            { label: "Mod-High (50-75%)", color: COLORS.accentLight, border: COLORS.accent },
            { label: "High (75-100%)", color: COLORS.threatLight, border: COLORS.threat },
          ].map(z => (
            <div key={z.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontFamily: "'Outfit', sans-serif", color: COLORS.textMuted }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: z.color, border: `1px solid ${z.border}` }} />
              {z.label}
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={buildProfileData(allScores)} layout="vertical" barSize={24} margin={{ left: 20, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: COLORS.textMuted }} tickFormatter={v => `${v}%`}
              ticks={[0, 25, 50, 75, 100]} />
            <YAxis type="category" dataKey="name" width={110}
              tick={{ fontSize: 12, fontFamily: "'Outfit', sans-serif", fill: COLORS.text }} />
            <Tooltip
              contentStyle={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, borderRadius: 8, border: `1px solid ${COLORS.border}` }}
              formatter={(v) => [`${v}%`, "Score"]}
              labelStyle={{ fontWeight: 600 }}
            />
            {[25, 50, 75].map(v => (
              <CartesianGrid key={v} strokeDasharray="6 4" stroke={v === 50 ? COLORS.textLight : COLORS.border} />
            ))}
            <Bar dataKey="value" shape={<ProfileBar />} radius={[0, 4, 4, 0]}>
              {buildProfileData(allScores).map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pre/Post Comparison */}
      {previousData && assessmentType === "posttest" && (
        <div style={{ background: COLORS.white, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.border}`, marginTop: 24 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, margin: "0 0 4px", textAlign: "center", color: COLORS.text }}>
            Pre / Post Comparison
          </h3>
          <p style={{ fontSize: 12, color: COLORS.textMuted, textAlign: "center", margin: "0 0 20px" }}>
            Pretest: {new Date(previousData.date).toLocaleDateString()} → Posttest: {new Date().toLocaleDateString()}
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={buildComparisonData(allScores, previousData)} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: "'Outfit', sans-serif", fill: COLORS.textMuted }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: COLORS.textMuted }} />
              <Tooltip
                contentStyle={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, borderRadius: 8, border: `1px solid ${COLORS.border}` }}
                formatter={(v) => [`${v}%`]}
              />
              <Legend wrapperStyle={{ fontFamily: "'Outfit', sans-serif", fontSize: 12 }} />
              <Bar dataKey="pre" name="Pretest" fill={COLORS.textLight} radius={[4, 4, 0, 0]} />
              <Bar dataKey="post" name="Posttest" fill={COLORS.soothing} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Clinical Write-up */}
      <div style={{
        background: COLORS.white,
        borderRadius: 16,
        padding: 32,
        border: `1px solid ${COLORS.border}`,
        marginTop: 24,
      }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, margin: "0 0 8px", color: COLORS.text }}>
          Clinical Narrative
        </h3>
        <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "0 0 20px", lineHeight: 1.5 }}>
          Comprehensive clinical report with treatment plan, specific CFT interventions, between-session practices, and therapeutic relationship considerations.
        </p>
        {!clinicalWriteup && !generating && (
          <Button variant="accent" onClick={generateClinicalWriteup}>
            Generate Clinical Write-Up
          </Button>
        )}
        {generating && (
          <div style={{ padding: 24, textAlign: "center" }}>
            <div style={{
              width: 40, height: 40, border: `3px solid ${COLORS.border}`,
              borderTopColor: COLORS.soothing, borderRadius: "50%",
              animation: "cft-spin 1s linear infinite",
              margin: "0 auto 12px",
            }} />
            <style>{`@keyframes cft-spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ fontSize: 14, color: COLORS.textMuted }}>Synthesizing clinical narrative...</p>
          </div>
        )}
        {clinicalWriteup && (
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 17,
            lineHeight: 1.8,
            color: COLORS.text,
            whiteSpace: "pre-wrap",
          }}>
            {renderWriteup(clinicalWriteup)}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", paddingTop: 32, flexWrap: "wrap" }}>
        <Button variant="secondary" onClick={onReset}>Start New Assessment</Button>
        {clinicalWriteup && (
          <Button variant="secondary" onClick={() => downloadReport(allScores, clientName, assessmentType, clinicalWriteup)}>
            Download Report
          </Button>
        )}
      </div>
    </div>
  );
}
