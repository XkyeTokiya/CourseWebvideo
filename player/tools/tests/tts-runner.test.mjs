import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { synthesizeSegments } from "../tts-runner.mjs";

test("runner synthesizes serially and then skips existing audio", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "webvideo-runner-"));
  const calls = [];
  const provider = {
    defaultVoice: "default-test-voice",
    async synthesize({ text, outPath, voice }) {
      calls.push({ text, voice });
      await mkdir(path.dirname(outPath), { recursive: true });
      await writeFile(outPath, `ID3:${text}`);
    },
  };
  const segments = [
    { chapter: "hook", step: 1, text: "第一段" },
    { chapter: "hook", step: 2, text: "第二段" },
  ];
  try {
    const first = await synthesizeSegments({ segments, episodeDir: dir, provider, log() {}, error() {} });
    assert.deepEqual(first, { synthesized: 2, skipped: 0, failed: 0 });
    assert.deepEqual(calls, [
      { text: "第一段", voice: "default-test-voice" },
      { text: "第二段", voice: "default-test-voice" },
    ]);
    assert.equal((await readFile(path.join(dir, "media", "audio", "hook", "1.mp3"))).toString(), "ID3:第一段");
    const second = await synthesizeSegments({ segments, episodeDir: dir, provider, log() {}, error() {} });
    assert.deepEqual(second, { synthesized: 0, skipped: 2, failed: 0 });
    assert.equal(calls.length, 2);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("runner reports provider failures without stopping later segments", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "webvideo-runner-fail-"));
  let count = 0;
  const provider = {
    async synthesize({ outPath }) {
      count += 1;
      if (count === 1) throw new Error("expected failure");
      await mkdir(path.dirname(outPath), { recursive: true });
      await writeFile(outPath, "ID3:ok");
    },
  };
  try {
    const result = await synthesizeSegments({
      segments: [
        { chapter: "a", step: 1, text: "fail" },
        { chapter: "a", step: 2, text: "ok" },
      ],
      episodeDir: dir,
      provider,
      log() {},
      error() {},
    });
    assert.deepEqual(result, { synthesized: 1, skipped: 0, failed: 1 });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
