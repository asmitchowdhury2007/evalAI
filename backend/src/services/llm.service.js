import { env } from "../config/env.js";

function headers() {
  const h = { "Content-Type": "application/json" };
  if (env.OLLAMA_API_KEY) h.Authorization = `Bearer ${env.OLLAMA_API_KEY}`;
  return h;
}

export async function askLLM(prompt, { json = false, maxTokens=300 } = {}) {
  const res = await fetch(`${env.OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      model: env.LLM_MODEL,
      prompt,
      stream: false,
      format: json ? "json" : undefined,
      keep_alive : "30m",
      options: { temperature: 0.2, num_predict: maxTokens },
    }),
    signal: AbortSignal.timeout(env.LLM_TIMEOUT_MS), 
  });
  if (!res.ok) throw new Error(`LLM error ${res.status}`);
  const data = await res.json();
  return data.response;
}

export async function llmHealth() {
  const res = await fetch(`${env.OLLAMA_URL}/api/tags`, {
    headers: headers(),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`LLM error ${res.status}`);
  return true;
}