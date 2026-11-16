import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import test from "node:test";

const execFileAsync = promisify(execFile);
const script = fileURLToPath(new URL("../extract-narrations.mjs", import.meta.url));

test("audio extraction uses available narration directories without inspecting chapter registration", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "webvideo-extract-"));
  const episode = path.join(root, "episodes", "episode-99");
  const chapters = path.join(episode, "src", "chapters");
  try {
    for (const name of ["01-opening", "02-extra", "03-empty"]) {
      await mkdir(path.join(chapters, name), { recursive: true });
    }
    await writeFile(path.join(episode, "project.json"), JSON.stringify({ status: "in-progress" }));
    await writeFile(path.join(episode, "src", "entry.tsx"), "export const CHAPTERS = buildChapters();\n");
    await writeFile(path.join(chapters, "01-opening", "narrations.ts"), 'export const narrations = ["【开场导入】\\n正文"];\n');
    await writeFile(path.join(chapters, "02-extra", "narrations.ts"), 'export const narrations = ["【本期总结】总结"];\n');
    const output = path.join(episode, "audio-segments.json");
    await writeFile(output, "old segments\n");

    await execFileAsync(process.execPath, [script, "--episode", "episode-99"], { env: { ...process.env, PLAYER_ROOT: root } });
    assert.deepEqual(JSON.parse(await readFile(output, "utf8")), [
      { chapter: "opening", step: 1, text: "【开场导入】\n正文", audio: "opening/1.mp3" },
      { chapter: "extra", step: 1, text: "【本期总结】总结", audio: "extra/1.mp3" },
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
