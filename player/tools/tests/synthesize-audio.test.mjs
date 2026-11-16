import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import test from "node:test";

const execFileAsync = promisify(execFile);
const script = fileURLToPath(new URL("../synthesize-audio.mjs", import.meta.url));

test("synthesis accepts unregistered chapters, different audio paths, and editorial text", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "webvideo-synthesize-"));
  const episode = path.join(root, "episodes", "episode-99");
  const providers = path.join(root, "tools", "tts-providers");
  const checked = path.join(root, "provider-checked");
  try {
    await mkdir(path.join(episode, "src"), { recursive: true });
    await mkdir(providers, { recursive: true });
    await writeFile(path.join(episode, "src", "entry.tsx"), "export const CHAPTERS = buildChapters();\n");
    await writeFile(path.join(providers, "fake.mjs"), `import { writeFile } from "node:fs/promises";\nexport async function check() { await writeFile(${JSON.stringify(checked)}, "checked"); }\nexport async function synthesize({ text, outPath }) { await writeFile(outPath, text); }\n`);
    await writeFile(path.join(episode, "audio-segments.json"), JSON.stringify([
      { chapter: "chapter.with.dot", step: 1, text: "【正文讲解】原文", audio: "different/path.mp3" },
    ]));
    const args = [script, "--episode", "episode-99", "--provider", "fake"];
    const options = { env: { ...process.env, PLAYER_ROOT: root } };

    await execFileAsync(process.execPath, [...args, "--dry-run"], options);
    await assert.rejects(access(checked));
    await execFileAsync(process.execPath, [...args, "--check"], options);
    assert.equal(await readFile(checked, "utf8"), "checked");
    await execFileAsync(process.execPath, [...args, "--force"], options);
    assert.equal(await readFile(path.join(episode, "media", "audio", "chapter.with.dot", "1.mp3"), "utf8"), "【正文讲解】原文");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
