import { writeFile } from "node:fs/promises";
import { writeAtomically } from "./shared.mjs";

export const id = "openai";
export const defaultVoice = "alloy";

export async function check() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set. Get a key at https://platform.openai.com/api-keys");
  }
  if (typeof fetch !== "function") {
    throw new Error("This Node runtime does not provide fetch; Node 18+ is required");
  }
}

export async function synthesize({ text, outPath, voice }) {
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.OPENAI_TTS_MODEL || "tts-1";
  const response = await fetch(`${base}/audio/speech`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: text,
      voice: voice || defaultVoice,
      response_format: "mp3",
    }),
  });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 600);
    throw new Error(`OpenAI TTS HTTP ${response.status}: ${detail}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeAtomically(outPath, async (temp) => writeFile(temp, bytes));
}
