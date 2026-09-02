import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

export function validateSegment(segment, index) {
  if (!segment || typeof segment.chapter !== "string" || !segment.chapter || !Number.isInteger(segment.step) || segment.step < 1 || typeof segment.text !== "string") {
    throw new Error(`invalid segment at index ${index}`);
  }
}

export async function synthesizeSegments({
  segments,
  episodeDir,
  provider,
  voice = "",
  force = false,
  log = console.log,
  error = console.error,
}) {
  if (!Array.isArray(segments)) throw new Error("audio-segments.json must be an array");
  let synthesized = 0;
  let skipped = 0;
  let failed = 0;
  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    validateSegment(segment, index);
    const relative = `${segment.chapter}/${segment.step}.mp3`;
    const outPath = path.join(episodeDir, "media", "audio", relative);
    if (!force) {
      try {
        const existing = await stat(outPath);
        if (existing.size > 0) {
          skipped += 1;
          log(`[${String(index + 1).padStart(3)}/${segments.length}] ${relative.padEnd(24)} skip (exists)`);
          continue;
        }
      } catch { /* synthesize missing file */ }
    }
    await mkdir(path.dirname(outPath), { recursive: true });
    const started = Date.now();
    try {
      await provider.synthesize({
        text: segment.text,
        outPath,
        voice: voice || provider.defaultVoice || "",
      });
      synthesized += 1;
      log(`[${String(index + 1).padStart(3)}/${segments.length}] ${relative.padEnd(24)} ✓ ${((Date.now() - started) / 1000).toFixed(1)}s`);
    } catch (reason) {
      failed += 1;
      error(`[${String(index + 1).padStart(3)}/${segments.length}] ${relative.padEnd(24)} FAILED: ${reason.message ?? reason}`);
    }
  }
  return { synthesized, skipped, failed };
}
