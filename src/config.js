// ─── COLORS ──────────────────────────────────────────────────────────

export const COLORS = {
  bg: "#FAF7F2",
  bgAlt: "#F3EDE4",
  text: "#2D2A26",
  textMuted: "#7A756D",
  textLight: "#A39E95",
  soothing: "#5B9E8F",
  soothingLight: "#E8F4F0",
  soothingDark: "#3D7A6D",
  threat: "#D4856A",
  threatLight: "#FAE8E0",
  threatDark: "#B86B52",
  drive: "#6B6FAD",
  driveLight: "#EDEEF7",
  driveDark: "#4E5290",
  accent: "#C4956A",
  accentLight: "#F7EDE3",
  white: "#FFFFFF",
  border: "#E5DFD6",
  success: "#5B9E8F",
  warning: "#D4856A",
};

// ─── FONTS ───────────────────────────────────────────────────────────

export const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap');
`;

// ─── ITEM ARRAYS ─────────────────────────────────────────────────────
// Item text matches the published instruments exactly (Kolts, Bell,
// Bennett-Levy & Irons, 2018 — Guilford Press workbook).
//
// ECR-RS reverse flag: The PDF form prints items 1-4 with a reversed
// number line (7 on left, 1 on right) so the circled number can be
// summed directly. Our UI uses a uniform 1-7 scale for all items, so
// we must reverse items 1-4 in code (8 - raw) to match.

export const ECR_RS_ITEMS = [
  { id: 1, text: "It helps to turn to people in times of need.", subscale: "avoidance", reverse: true },
  { id: 2, text: "I usually discuss my problems and concerns with others.", subscale: "avoidance", reverse: true },
  { id: 3, text: "I usually talk things over with people.", subscale: "avoidance", reverse: true },
  { id: 4, text: "I find it easy to depend on others.", subscale: "avoidance", reverse: true },
  { id: 5, text: "I don't feel comfortable opening up to others.", subscale: "avoidance", reverse: false },
  { id: 6, text: "I prefer not to show others how I feel deep down.", subscale: "avoidance", reverse: false },
  { id: 7, text: "I often worry that others do not really care about me.", subscale: "anxiety", reverse: false },
  { id: 8, text: "I'm afraid that other people may abandon me.", subscale: "anxiety", reverse: false },
  { id: 9, text: "I worry that others won't care about me as much as I care about them.", subscale: "anxiety", reverse: false },
];

export const FOCS_ITEMS = [
  { id: 1, text: "Being too compassionate makes people soft and easy to take advantage of.", subscale: "extending" },
  { id: 2, text: "I fear that being too compassionate makes people an easy target.", subscale: "extending" },
  { id: 3, text: "I fear that if I am compassionate, some people will become dependent upon me.", subscale: "extending" },
  { id: 4, text: "I find myself holding back from feeling and expressing compassion toward others.", subscale: "extending" },
  { id: 5, text: "I try to keep my distance from others even if I know they are kind.", subscale: "receiving" },
  { id: 6, text: "Feelings of kindness from others are somehow frightening.", subscale: "receiving" },
  { id: 7, text: 'When people are kind and compassionate toward me, I "put up a barrier."', subscale: "receiving" },
  { id: 8, text: "I have a hard time accepting kindness and caring from others.", subscale: "receiving" },
  { id: 9, text: "I worry that if I start to develop compassion for myself, I will become dependent upon it.", subscale: "selfCompassion" },
  { id: 10, text: "I fear that if I become too compassionate toward myself, I will lose my self-criticism and my flaws will show.", subscale: "selfCompassion" },
  { id: 11, text: "I fear that if I am more self-compassionate, I will become a weak person or my standards will drop.", subscale: "selfCompassion" },
  { id: 12, text: "I struggle with relating kindly and compassionately toward myself.", subscale: "selfCompassion" },
];

export const CEAS_SC_ITEMS = [
  { id: 1, text: "I am motivated to engage and work with my distress when it arises.", subscale: "engagement" },
  { id: 2, text: "I notice and am sensitive to my distressed feelings when they arise in me.", subscale: "engagement" },
  { id: 3, text: "I am emotionally moved by my distressed feelings or situations.", subscale: "engagement" },
  { id: 4, text: "I tolerate the various feelings that are part of my distress.", subscale: "engagement" },
  { id: 5, text: "I reflect on and make sense of my feelings of distress.", subscale: "engagement" },
  { id: 6, text: "I am accepting, noncritical, and non-judgmental of my feelings of distress.", subscale: "engagement" },
  { id: 7, text: "I direct my attention to what is likely to be helpful to me.", subscale: "action" },
  { id: 8, text: "I think about and come up with helpful ways to cope with my distress.", subscale: "action" },
  { id: 9, text: "I take the actions and do the things that will be helpful to me.", subscale: "action" },
  { id: 10, text: "I create inner feelings of support, helpfulness, and encouragement.", subscale: "action" },
];

// ─── SCALE DEFINITIONS (single source of truth for ranges) ──────────

export const SCALE_DEFS = {
  ecr: {
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: ["Strongly\nDisagree", "Strongly\nAgree"],
    prefix: "ecr",
    color: null, // set at render time from COLORS
    subscales: {
      avoidance: { min: 6, max: 42, label: "Attachment Avoidance" },
      anxiety: { min: 3, max: 21, label: "Attachment Anxiety" },
    },
  },
  focs: {
    scaleMin: 0,
    scaleMax: 4,
    scaleLabels: ["Do Not\nAgree", "Completely\nAgree"],
    prefix: "focs",
    color: null,
    subscales: {
      extending: { min: 0, max: 16, label: "Fears of Extending Compassion" },
      receiving: { min: 0, max: 16, label: "Fears of Receiving Compassion" },
      selfCompassion: { min: 0, max: 16, label: "Fears of Self-Compassion" },
    },
  },
  ceas: {
    scaleMin: 1,
    scaleMax: 10,
    scaleLabels: ["Never", "Always"],
    prefix: "ceas",
    color: null,
    subscales: {
      engagement: { min: 6, max: 60, label: "Compassionate Engagement" },
      action: { min: 4, max: 40, label: "Compassionate Action" },
    },
  },
};
