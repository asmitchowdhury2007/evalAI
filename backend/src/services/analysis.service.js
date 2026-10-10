import { ruleScore, riskFromScores, summarize } from "../nlp/scorer.js";
import { askLLM } from "./llm.service.js";
import { env } from "../config/env.js";

const KEYS = ["stress", "anxiety", "frustration", "disengagement", "overload"];

async function llmScore(text) {
  const prompt = `You analyze student feedback for signs of stress. Handle negation and sarcasm carefully.
Return JSON only, each value an integer 0-100:
{"stress":0,"anxiety":0,"frustration":0,"disengagement":0,"overload":0}

Feedback: "${text.slice(0, 3000)}"`;
  try {
    const parsed = JSON.parse(await askLLM(prompt, { json: true }));
    const out = {};
    for (const k of KEYS) {
      const v = Number(parsed[k]);
      if (!Number.isFinite(v)) return null;
      out[k] = Math.max(0, Math.min(100, Math.round(v)));
    }
    return out;
  } catch {
    return null; // model slow or bad JSON, so fall back to rules
  }
}

export async function analyzeText(text) {
  const rules = ruleScore(text);
  let scores = rules;

  if (env.USE_LLM === "true") {
    const llm = await llmScore(text);
    if (llm) {
      scores = {};
      for (const k of KEYS) scores[k] = Math.round((rules[k] + llm[k]) / 2);
    }
  }

  return { ...scores, risk: riskFromScores(scores), summary: summarize(scores) };
}