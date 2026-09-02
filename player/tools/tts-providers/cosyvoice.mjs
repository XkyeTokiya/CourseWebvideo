import { writeFile } from "node:fs/promises";
import { writeAtomically } from "./shared.mjs";

export const id = "cosyvoice";
export const defaultVoice = "longanhuan";

const DEFAULT_ENDPOINT =
  "https://dashscope.aliyuncs.com/api/v1/services/audio/tts/SpeechSynthesizer";

function numberFromEnv(name, fallback, { min, max, integer = false, allowed = null }) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  if (allowed && !allowed.includes(value)) {
    throw new Error(`${name} must be one of: ${allowed.join(", ")}`);
  }
  if (!Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) {
    throw new Error(`${name} must be ${integer ? "an integer" : "a number"} between ${min} and ${max}`);
  }
  return value;
}

function endpoint() {
  return process.env.DASHSCOPE_TTS_ENDPOINT || DEFAULT_ENDPOINT;
}

export function buildRequest({ text, voice }) {
  const input = {
    text,
    voice: voice || defaultVoice,
    format: "mp3",
    sample_rate: numberFromEnv("DASHSCOPE_TTS_SAMPLE_RATE", 24000, {
      min: 8000,
      max: 48000,
      integer: true,
      allowed: [8000, 16000, 22050, 24000, 44100, 48000],
    }),
    volume: numberFromEnv("DASHSCOPE_TTS_VOLUME", 50, { min: 0, max: 100, integer: true }),
    rate: numberFromEnv("DASHSCOPE_TTS_RATE", 1, { min: 0.5, max: 2 }),
    pitch: numberFromEnv("DASHSCOPE_TTS_PITCH", 1, { min: 0.5, max: 2 }),
  };
  if (process.env.DASHSCOPE_TTS_LANGUAGE) {
    input.language_hints = [process.env.DASHSCOPE_TTS_LANGUAGE];
  }
  if (process.env.DASHSCOPE_TTS_INSTRUCTION) {
    input.instruction = process.env.DASHSCOPE_TTS_INSTRUCTION;
  }
  if (process.env.DASHSCOPE_TTS_ENABLE_SSML === "1") input.enable_ssml = true;
  return {
    model: process.env.DASHSCOPE_TTS_MODEL || "cosyvoice-v3-flash",
    input,
  };
}

export async function check() {
  if (!process.env.DASHSCOPE_API_KEY) {
    throw new Error("DASHSCOPE_API_KEY is not set");
  }
  if (typeof fetch !== "function") {
    throw new Error("This Node runtime does not provide fetch; Node 18+ is required");
  }
  try {
    new URL(endpoint());
  } catch {
    throw new Error("DASHSCOPE_TTS_ENDPOINT must be a valid URL");
  }
  buildRequest({ text: "configuration check", voice: defaultVoice });
}

async function responseDetail(response) {
  const detail = (await response.text()).slice(0, 800);
  return detail || response.statusText || "empty response";
}

export async function synthesize({ text, outPath, voice }) {
  const response = await fetch(endpoint(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DASHSCOPE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildRequest({ text, voice })),
  });
  if (!response.ok) {
    throw new Error(`DashScope CosyVoice HTTP ${response.status}: ${await responseDetail(response)}`);
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error("DashScope CosyVoice returned invalid JSON");
  }
  const audioUrl = result?.output?.audio?.url;
  if (typeof audioUrl !== "string" || !audioUrl) {
    const message = result?.message || result?.code || result?.request_id || "audio URL missing";
    throw new Error(`DashScope CosyVoice synthesis failed: ${message}`);
  }

  await writeAtomically(outPath, async (temp) => {
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      throw new Error(`DashScope audio download HTTP ${audioResponse.status}: ${await responseDetail(audioResponse)}`);
    }
    await writeFile(temp, Buffer.from(await audioResponse.arrayBuffer()));
  });
}
