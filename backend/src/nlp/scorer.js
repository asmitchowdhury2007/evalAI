import { LEXICON, NEGATIONS, INTENSITY } from "./lexicon.js";

const BASE = 30; // points per detected phrase

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const words = (s) => s.split(/[^a-z']+/).filter(Boolean);

export function ruleScore(text) {
  const clean = text.toLowerCase().replace(/[’‘]/g, "'");
  const sentences = clean.split(/[.!?\n]+/).filter((s) => s.trim());

  const scores = { stress: 0, anxiety: 0, frustration: 0, disengagement: 0, overload: 0 };

  for (const sentence of sentences) {
    for (const [category, phrases] of Object.entries(LEXICON)) {
      for (const phrase of phrases) {
        const re = new RegExp(`(?<![a-z'])${escapeRegex(phrase)}(?![a-z'])`, "g");
        let m;
        while ((m = re.exec(sentence)) !== null) {
          const before = words(sentence.slice(0, m.index));
          const negated = before.slice(-3).some((w) => NEGATIONS.includes(w));
          if (negated) continue; // "not stressed" scores nothing

          const multiplier = before
            .slice(-2)
            .reduce((acc, w) => (INTENSITY[w] ? Math.max(acc, INTENSITY[w]) : acc), 1);

          scores[category] += BASE * multiplier;
        }
      }
    }
  }

  for (const k of Object.keys(scores)) scores[k] = Math.min(100, Math.round(scores[k]));
  return scores;
}

export function riskFromScores(scores) {
  const top = Math.max(...Object.values(scores));
  if (top >= 70) return "HIGH";
  if (top >= 40) return "MEDIUM";
  return "LOW";
}

export function summarize(scores) {
  const top = Object.entries(scores)
    .filter(([, v]) => v >= 30)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);
  return top.length
    ? `Indicators of ${top.join(", ")} detected.`
    : "No strong indicators of stress detected.";
}