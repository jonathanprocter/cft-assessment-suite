import { ECR_RS_ITEMS, FOCS_ITEMS, CEAS_SC_ITEMS, SCALE_DEFS } from "./config";

// ─── UTILITIES ───────────────────────────────────────────────────────

export function getPercentage(score, min, max) {
  const range = max - min;
  if (!Number.isFinite(score) || !Number.isFinite(range) || range <= 0) return 0;
  const raw = ((score - min) / range) * 100;
  return Math.round(Math.min(100, Math.max(0, raw)));
}

export function getLevel(pct) {
  if (pct <= 25) return "Low";
  if (pct <= 50) return "Low-Moderate";
  if (pct <= 75) return "Moderate-High";
  return "High";
}

// ─── ECR-RS ──────────────────────────────────────────────────────────
// UI presents a uniform 1 (Strongly Disagree) → 7 (Strongly Agree)
// scale for every item. Items 1-4 are positively worded (agreeing =
// LOW avoidance), so we reverse them (8 - raw) to make higher = more
// avoidant. Items 5-6 are negatively worded (agreeing = HIGH
// avoidance) and items 7-9 measure anxiety directly — no reversal.

export function scoreECR(responses) {
  const defs = SCALE_DEFS.ecr.subscales;
  let avoidance = 0;
  let anxiety = 0;

  ECR_RS_ITEMS.forEach((item) => {
    const raw = responses[`ecr_${item.id}`];
    if (raw == null) return;
    const scored = item.reverse ? 8 - raw : raw;
    if (item.subscale === "avoidance") avoidance += scored;
    else anxiety += scored;
  });

  return {
    avoidance: { score: avoidance, ...defs.avoidance },
    anxiety: { score: anxiety, ...defs.anxiety },
  };
}

// ─── FOCS ────────────────────────────────────────────────────────────

export function scoreFOCS(responses) {
  const defs = SCALE_DEFS.focs.subscales;
  const subs = { extending: 0, receiving: 0, selfCompassion: 0 };

  FOCS_ITEMS.forEach((item) => {
    const raw = responses[`focs_${item.id}`];
    if (raw != null) subs[item.subscale] += raw;
  });

  return {
    extending: { score: subs.extending, ...defs.extending },
    receiving: { score: subs.receiving, ...defs.receiving },
    selfCompassion: { score: subs.selfCompassion, ...defs.selfCompassion },
  };
}

// ─── CEAS-SC ─────────────────────────────────────────────────────────

export function scoreCEAS(responses) {
  const defs = SCALE_DEFS.ceas.subscales;
  const subs = { engagement: 0, action: 0 };

  CEAS_SC_ITEMS.forEach((item) => {
    const raw = responses[`ceas_${item.id}`];
    if (raw != null) subs[item.subscale] += raw;
  });

  return {
    engagement: { score: subs.engagement, ...defs.engagement },
    action: { score: subs.action, ...defs.action },
  };
}

// ─── COMBINED ────────────────────────────────────────────────────────

export function scoreAll(responses) {
  return {
    ecr: scoreECR(responses),
    focs: scoreFOCS(responses),
    ceas: scoreCEAS(responses),
  };
}
