import { commandAvailable, runCommand, writeAtomically } from "./shared.mjs";

export const id = "minimax";
export const defaultVoice = "";

export async function check() {
  if (!(await commandAvailable("mmx"))) {
    throw new Error(
      "mmx CLI not found in PATH. Install: npm install -g mmx-cli; login: mmx auth login --api-key sk-xxxxx",
    );
  }
  try { await runCommand("mmx", ["auth", "status"]); }
  catch {
    throw new Error("mmx is not authenticated. Run: mmx auth login --api-key sk-xxxxx");
  }
}

export async function synthesize({ text, outPath, voice }) {
  const args = ["speech", "synthesize"];
  if (voice) args.push("--voice", voice);
  args.push("--text", text, "--out");
  await writeAtomically(outPath, async (temp) => {
    await runCommand("mmx", [...args, temp]);
  });
}
