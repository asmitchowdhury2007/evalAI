import { askLLM } from "./llm.service.js";
import { env } from "../config/env.js";

function parseTemplate(text) {
  const blocks = text.split(/(?:^|\n)\s*Name\s*[:\-]\s*/i).slice(1);
  const records = [];
  for (const block of blocks) {
    const name = block.split("\n")[0].trim();
    const match = block.match(/Feedback\s*[:\-]\s*([\s\S]*)/i);
    const feedback = match ? match[1].trim() : "";
    if (name && feedback) records.push({ name, feedback });
  }
  return records;
}

async function parseWithLLM(text) {
  const prompt = `Extract each student's name and feedback from the text.
Return JSON only: {"students":[{"name":"...","feedback":"..."}]}

Text:
${text.slice(0, 12000)}`;
  try {
    const raw = await askLLM(prompt, { json: true });
    const list = JSON.parse(raw).students;
    return Array.isArray(list)
      ? list.filter((s) => s?.name && s?.feedback).map((s) => ({ name: String(s.name), feedback: String(s.feedback) }))
      : [];
  } catch {
    return [];
  }
}

export async function extractStudents(text) {
  const records = parseTemplate(text);
  if (records.length > 0) return records;
  return env.USE_LLM === "true" ? parseWithLLM(text) : [];
}