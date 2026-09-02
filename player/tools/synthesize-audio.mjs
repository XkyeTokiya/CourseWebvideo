import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { loadEnvFile } from "./load-env.mjs";
import { synthesizeSegments, validateSegment } from "./tts-runner.mjs";

const root = path.resolve(process.env.PLAYER_ROOT ?? process.cwd());
await loadEnvFile(path.join(root, ".env"));
const args = process.argv.slice(2).filter((arg) => arg !== "--");
const options = {
  episode: null,
  provider: process.env.PRESENTATION_TTS || "minimax",
  voice: process.env.PRESENTATION_TTS_VOICE || "",
  force: false,
  checkOnly: false,
  listProviders: false,
  dryRun: false,
  limit: 0,
};
for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  const [key, inline] = arg.split("=", 2);
  const nextValue = () => inline ?? args[++index] ?? "";
  if (key === "--episode") options.episode = nextValue();
  else if (key === "--provider") options.provider = nextValue();
  else if (key === "--voice") options.voice = nextValue();
  else if (arg === "--force") options.force = true;
  else if (arg === "--check") options.checkOnly = true;
  else if (arg === "--dry-run") options.dryRun = true;
  else if (key === "--limit") {
    options.limit = Number(nextValue());
    if (!Number.isInteger(options.limit) || options.limit < 1) {
      throw new Error("--limit must be a positive integer");
    }
  }
  else if (arg === "--list-providers") options.listProviders = true;
  else if (arg === "-h" || arg === "--help") {
    console.log("pnpm audio:synthesize -- --episode <id> [--provider <id>] [--voice <id>] [--limit <n>] [--dry-run] [--force] [--check]");
    process.exit(0);
  } else throw new Error(`unknown argument: ${arg}`);
}

const providersDir = path.join(root, "tools", "tts-providers");
const providerFiles = (await readdir(providersDir, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith(".mjs") && entry.name !== "shared.mjs")
  .map((entry) => entry.name.replace(/\.mjs$/, ""))
  .sort();
if (options.listProviders) {
  console.log(providerFiles.join("\n"));
  process.exit(0);
}
if (!options.episode) throw new Error("--episode is required");
if (!providerFiles.includes(options.provider)) {
  throw new Error(`TTS provider '${options.provider}' not found. Available: ${providerFiles.join(", ")}`);
}

const episodeDir = path.join(root, "episodes", options.episode);
const segmentsPath = path.join(episodeDir, "audio-segments.json");
try { await access(segmentsPath); }
catch { throw new Error(`${path.relative(root, segmentsPath)} not found. Run: pnpm audio:extract -- --episode ${options.episode}`); }
const segments = JSON.parse(await readFile(segmentsPath, "utf8"));
if (!Array.isArray(segments)) throw new Error("audio-segments.json must be an array");
const selectedSegments = options.limit ? segments.slice(0, options.limit) : segments;
if (options.dryRun) {
  selectedSegments.forEach((segment, index) => validateSegment(segment, index));
  console.log(`provider=${options.provider}${options.voice ? ` voice=${options.voice}` : ""}`);
  console.log(`dry run — ${selectedSegments.length}/${segments.length} segment(s)`);
  selectedSegments.forEach((segment, index) => {
    const relative = `${segment.chapter}/${segment.step}.mp3`;
    console.log(`[${String(index + 1).padStart(3)}/${selectedSegments.length}] ${relative}`);
  });
  process.exit(0);
}
const provider = await import(pathToFileURL(path.join(providersDir, `${options.provider}.mjs`)).href);
if (typeof provider.check !== "function" || typeof provider.synthesize !== "function") {
  throw new Error(`provider '${options.provider}' must export check() and synthesize()`);
}
await provider.check();
console.log(`provider=${options.provider}${options.voice ? ` voice=${options.voice}` : ""}`);
if (options.checkOnly) {
  console.log("provider check passed");
  process.exit(0);
}

const summary = await synthesizeSegments({
  segments: selectedSegments,
  episodeDir,
  provider,
  voice: options.voice,
  force: options.force,
});
console.log(`done — synthesized ${summary.synthesized}, skipped ${summary.skipped}, failed ${summary.failed}`);
if (summary.failed) process.exit(2);
