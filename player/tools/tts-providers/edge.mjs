import { commandAvailable, runCommand, writeAtomically } from "./shared.mjs";

export const id = "edge";
export const defaultVoice = "zh-CN-XiaoxiaoNeural";

function command() {
  return process.env.EDGE_TTS_COMMAND || "edge-tts";
}

export function buildArgs({ text, outPath, voice }) {
  const args = [
    "--text", text,
    "--voice", voice || defaultVoice,
    "--rate", process.env.EDGE_TTS_RATE || "+5%",
  ];
  if (process.env.EDGE_TTS_VOLUME) args.push("--volume", process.env.EDGE_TTS_VOLUME);
  if (process.env.EDGE_TTS_PITCH) args.push("--pitch", process.env.EDGE_TTS_PITCH);
  if (process.env.EDGE_TTS_PROXY) args.push("--proxy", process.env.EDGE_TTS_PROXY);
  args.push("--write-media", outPath);
  return args;
}

export async function check() {
  if (!(await commandAvailable(command(), ["--help"]))) {
    throw new Error(
      "edge-tts is not available. Install it with: python -m pip install edge-tts",
    );
  }
}

export async function synthesize({ text, outPath, voice }) {
  await writeAtomically(outPath, async (temp) => {
    await runCommand(command(), buildArgs({ text, outPath: temp, voice }));
  });
}
