import { useState } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { COLORS, SCALE_DEFS } from "../config";
import { getPercentage, getLevel } from "../scoring";
import ThreeCircles from "./ThreeCircles";
import ScoreCard from "./ScoreCard";
import Button from "./Button";

// ─── Clinical prompt builder ─────────────────────────────────────────

function buildClinicalPrompt(allScores, clientName, assessmentType, previousData) {
  const s = allScores;
  const ecrDefs = SCALE_DEFS.ecr.subscales;
  const focsDefs = SCALE_DEFS.focs.subscales;
  const ceasDefs = SCALE_DEFS.ceas.subscales;

  const pctStr = (score, min, max) => {
    const p = getPercentage(score, min, max);
    return `${p}th percentile of range — ${getLevel(p)}`;
  };

  let prompt = `You are a clinical psychologist specializing in Compassion-Focused Therapy (CFT). Generate a comprehensive clinical write-up based on the following assessment battery results. Write in a professional yet warm clinical voice. This should serve as both a clinical document AND a reflection tool that could guide future therapeutic exploration.

CLIENT: ${clientName || "Client"}
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

Please write a clinical narrative that includes:

1. **Attachment Profile**: Interpret the ECR-RS pattern. What attachment style does this suggest? How might this manifest in therapeutic relationship and daily life?

2. **Compassion Blocks Analysis**: Analyze the three FOCS subscales. Where are the biggest barriers? What might these fears protect against? Note any discrepancies between extending vs. receiving vs. self-compassion fears.

3. **Self-Compassion Capacity**: Interpret the CEAS-SC. Where is engagement vs. action? What might explain any gaps between noticing distress and taking compassionate action?

4. **Three Systems Formulation**: Map the full picture onto the CFT three-circle model (Threat, Drive, Soothing systems). Which system appears overactive? Which is underdeveloped? How do the scores tell a coherent story?

5. **Clinical Implications & Therapeutic Direction**: What are the 3-4 most important therapeutic targets? What CFT interventions would be most indicated? What should the therapist be mindful of in the therapeutic relationship given this profile?

6. **Reflective Questions for the Client**: Offer 3-4 open-ended questions the client could sit with that emerge naturally from their specific pattern.

${previousData ? "7. **Pre/Post Change Analysis**: Compare the pretest and posttest scores. Where has the client grown? What remains sticky? What does the pattern of change suggest about the therapeutic work?" : ""}

Write in flowing paragraphs, not bullet points. Use clinical language that is accessible. Approximately 800-1200 words.`;

  return prompt;
}

// ─── Radar chart data builder ────────────────────────────────────────

function buildRadarData(allScores) {
  const ecrDefs = SCALE_DEFS.ecr.subscales;
  const focsDefs = SCALE_DEFS.focs.subscales;
  const ceasDefs = SCALE_DEFS.ceas.subscales;

  return [
    { dimension: "Avoidance", value: getPercentage(allScores.ecr.avoidance.score, ecrDefs.avoidance.min, ecrDefs.avoidance.max), fullMark: 100 },
    { dimension: "Anxiety", value: getPercentage(allScores.ecr.anxiety.score, ecrDefs.anxiety.min, ecrDefs.anxiety.max), fullMark: 100 },
    { dimension: "Fear: Extending", value: getPercentage(allScores.focs.extending.score, focsDefs.extending.min, focsDefs.extending.max), fullMark: 100 },
    { dimension: "Fear: Receiving", value: getPercentage(allScores.focs.receiving.score, focsDefs.receiving.min, focsDefs.receiving.max), fullMark: 100 },
    { dimension: "Fear: Self", value: getPercentage(allScores.focs.selfCompassion.score, focsDefs.selfCompassion.min, focsDefs.selfCompassion.max), fullMark: 100 },
    { dimension: "Engagement", value: getPercentage(allScores.ceas.engagement.score, ceasDefs.engagement.min, ceasDefs.engagement.max), fullMark: 100 },
    { dimension: "Action", value: getPercentage(allScores.ceas.action.score, ceasDefs.action.min, ceasDefs.action.max), fullMark: 100 },
  ];
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

function renderWriteup(text) {
  return text.split("\n").map((para, i) => {
    if (!para.trim()) return null;
    if (para.startsWith("**") || para.startsWith("# ") || para.startsWith("## ")) {
      const clean = para.replace(/[#*]+/g, "").trim();
      return (
        <h4 key={i} style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 15,
          fontWeight: 600,
          color: COLORS.soothing,
          margin: "24px 0 8px",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}>{clean}</h4>
      );
    }
    return <p key={i} style={{ margin: "0 0 14px" }}>{para.replace(/\*\*/g, "")}</p>;
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
      const response = await fetch(`${proxyBase.replace(/\\/$/, "")}/v1/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "anthropic/claude-3.5-sonnet",
          max_tokens: 4000,
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
        <p style={{ fontSize: 14, color: COLORS.textMuted }}>
          {assessmentType.charAt(0).toUpperCase() + assessmentType.slice(1)} · {new Date().toLocaleDateString()}
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

      {/* Radar Chart */}
      <div style={{ background: COLORS.white, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.border}`, marginTop: 24 }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, margin: "0 0 16px", textAlign: "center", color: COLORS.text }}>
          Comprehensive Profile
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={buildRadarData(allScores)}>
            <PolarGrid stroke={COLORS.border} />
            <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fontFamily: "'Outfit', sans-serif", fill: COLORS.textMuted }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Profile" dataKey="value" stroke={COLORS.soothing} fill={COLORS.soothing} fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
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
          AI-generated clinical write-up integrating all assessment findings through a CFT lens. This narrative maps scores onto the three emotion regulation systems and identifies therapeutic directions.
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
