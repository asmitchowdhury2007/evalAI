import { env } from "../config/env.js";

export async function askLLM(prompt, { json = false } = {}) {
  const res = await fetch(`${env.OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: env.LLM_MODEL,
      prompt,
      stream: false,
      format: json ? "json" : undefined,
      options: { temperature: 0.2 },
    }),
    signal: AbortSignal.timeout(60000), // give up after 60 s
  });
  if (!res.ok) throw new Error(`LLM error ${res.status}`);
  const data = await res.json();
  return data.response;
}