import { useState, useEffect, useRef, useCallback } from "react";
import { COLORS, FONTS, ECR_RS_ITEMS, FOCS_ITEMS, CEAS_SC_ITEMS, SCALE_DEFS } from "./config";
import { scoreAll } from "./scoring";
import ProgressBar from "./components/ProgressBar";
import QuestionCard from "./components/QuestionCard";
import SectionIntro from "./components/SectionIntro";
import Button from "./components/Button";
import ResultsView from "./components/ResultsView";

// ─── SECTION CONFIG ──────────────────────────────────────────────────

const SECTIONS = [
  {
    key: "ecr",
    navLabel: "ECR-RS",
    icon: "🔗",
    title: "Attachment & Relationships",
    description: "These questions explore how you feel about close relationships in general. Rate each statement from strongly disagree to strongly agree.",
    items: ECR_RS_ITEMS,
    scaleDef: SCALE_DEFS.ecr,
    color: COLORS.drive,
    prev: "welcome",
    next: "focs",
  },
  {
    key: "focs",
    navLabel: "FOCS",
    icon: "🛡️",
    title: "Fears of Compassion",
    description: "These questions explore how you feel about giving compassion, receiving it, and directing it toward yourself. There are no right or wrong answers — these responses help us understand what might feel difficult about compassion.",
    items: FOCS_ITEMS,
    scaleDef: SCALE_DEFS.focs,
    color: COLORS.threat,
    prev: "ecr",
    next: "ceas",
  },
  {
    key: "ceas",
    navLabel: "CEAS-SC",
    icon: "💚",
    title: "Self-Compassion in Action",
    description: "When you're distressed or upset, how do you tend to relate to yourself? These questions explore both your awareness of distress and the actions you take in response.",
    items: CEAS_SC_ITEMS,
    scaleDef: SCALE_DEFS.ceas,
    color: COLORS.soothing,
    prev: "focs",
    next: "results",
  },
];

const PROGRESS_LABELS = ["Welcome", ...SECTIONS.map((s) => s.navLabel), "Results"];
const SCREEN_TO_IDX = { welcome: 0, ecr: 1, focs: 2, ceas: 3, results: 4 };

// ─── MAIN COMPONENT ─────────────────────────────────────────────────

export default function CFTAssessmentSuite() {
  const [screen, setScreen] = useState("welcome");
  const [responses, setResponses] = useState({});
  const [clientName, setClientName] = useState("");
  const [assessmentType, setAssessmentType] = useState("pretest");
  const [previousData, setPreviousData] = useState(null);
  const [animateIn, setAnimateIn] = useState(true);
  const scrollRef = useRef(null);

  // Load previous pretest data
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get("cft_pretest");
        if (result) setPreviousData(JSON.parse(result.value));
      } catch (e) { /* no previous data */ }
    })();
  }, []);

  const navigate = useCallback((target) => {
    setAnimateIn(false);
    setTimeout(() => {
      setScreen(target);
      setAnimateIn(true);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }, 200);
  }, []);

  const setResponse = useCallback((key, value) => {
    setResponses((prev) => ({ ...prev, [key]: value }));
  }, []);

  const sectionComplete = (prefix, count) => {
    for (let i = 1; i <= count; i++) {
      if (responses[`${prefix}_${i}`] == null) return false;
    }
    return true;
  };

  // Score when on results screen
  const allScores = screen === "results" ? scoreAll(responses) : null;

  // Save results to storage
  useEffect(() => {
    if (screen !== "results" || !allScores) return;
    const data = {
      responses,
      scores: allScores,
      clientName,
      type: assessmentType,
      date: new Date().toISOString(),
    };
    (async () => {
      try {
        await window.storage.set(`cft_${assessmentType}`, JSON.stringify(data));
        if (assessmentType === "posttest") {
          try {
            const pre = await window.storage.get("cft_pretest");
            if (pre) setPreviousData(JSON.parse(pre.value));
          } catch (e) {}
        }
      } catch (e) { console.error("Storage error:", e); }
    })();
  }, [screen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReset = useCallback(() => {
    setResponses({});
    navigate("welcome");
  }, [navigate]);

  // ─── RENDER ──────────────────────────────────────────────────────

  const currentIdx = SCREEN_TO_IDX[screen] ?? 0;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Outfit', sans-serif" }}>
      <style>{FONTS}</style>
      <div
        ref={scrollRef}
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "20px 24px 60px",
          opacity: animateIn ? 1 : 0,
          transform: animateIn ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.3s ease",
        }}
      >
        {screen !== "welcome" && (
          <ProgressBar current={currentIdx} total={PROGRESS_LABELS.length} sections={PROGRESS_LABELS} />
        )}

        {/* ─── WELCOME ─── */}
        {screen === "welcome" && (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.soothingLight}, ${COLORS.driveLight})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 28px", fontSize: 36,
              border: `2px solid ${COLORS.soothing}30`,
            }}>🌿</div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 42,
              fontWeight: 600,
              color: COLORS.text,
              margin: "0 0 12px",
              lineHeight: 1.2,
            }}>Compassion-Focused<br />Assessment Suite</h1>
            <p style={{
              fontSize: 16,
              color: COLORS.textMuted,
              maxWidth: 480,
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}>
              This guided assessment explores your patterns of relating — to yourself, to others, and to the experience of compassion itself. There are no right or wrong answers.
            </p>
            <div style={{
              background: COLORS.white,
              borderRadius: 16,
              padding: "28px 32px",
              border: `1px solid ${COLORS.border}`,
              textAlign: "left",
              marginBottom: 32,
            }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
                Your Name (optional)
              </label>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter your name"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 10,
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 16,
                  color: COLORS.text,
                  background: COLORS.bg,
                  outline: "none",
                  boxSizing: "border-box",
                  marginBottom: 20,
                }}
              />
              <label style={{ fontSize: 12, fontWeight: 500, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 12 }}>
                Assessment Type
              </label>
              <div style={{ display: "flex", gap: 12 }}>
                {["pretest", "posttest"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setAssessmentType(t)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: 10,
                      border: `2px solid ${assessmentType === t ? COLORS.soothing : COLORS.border}`,
                      background: assessmentType === t ? COLORS.soothingLight : "transparent",
                      color: assessmentType === t ? COLORS.soothingDark : COLORS.textMuted,
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: "pointer",
                      textTransform: "capitalize",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {t}
                    {t === "posttest" && previousData && (
                      <span style={{ display: "block", fontSize: 11, marginTop: 4, color: COLORS.soothing }}>
                        Previous data found
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={() => navigate("ecr")}>Begin Assessment →</Button>
          </div>
        )}

        {/* ─── ASSESSMENT SECTIONS (ECR / FOCS / CEAS) ─── */}
        {SECTIONS.map((section) =>
          screen === section.key ? (
            <div key={section.key}>
              <SectionIntro
                icon={section.icon}
                title={section.title}
                description={section.description}
                color={section.color}
              />
              {section.items.map((item) => (
                <QuestionCard
                  key={item.id}
                  number={item.id}
                  text={item.text}
                  value={responses[`${section.scaleDef.prefix}_${item.id}`]}
                  onChange={(v) => setResponse(`${section.scaleDef.prefix}_${item.id}`, v)}
                  scaleMin={section.scaleDef.scaleMin}
                  scaleMax={section.scaleDef.scaleMax}
                  scaleLabels={section.scaleDef.scaleLabels}
                  color={section.color}
                />
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 20 }}>
                <Button variant="secondary" onClick={() => navigate(section.prev)}>← Back</Button>
                <Button
                  onClick={() => navigate(section.next)}
                  disabled={!sectionComplete(section.scaleDef.prefix, section.items.length)}
                >
                  {section.next === "results" ? "View Results →" : "Continue →"}
                </Button>
              </div>
            </div>
          ) : null
        )}

        {/* ─── RESULTS ─── */}
        {screen === "results" && allScores && (
          <ResultsView
            allScores={allScores}
            clientName={clientName}
            assessmentType={assessmentType}
            previousData={previousData}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
