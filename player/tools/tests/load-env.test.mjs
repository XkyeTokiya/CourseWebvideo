import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { loadEnvFile } from "../load-env.mjs";

test("loads a local env file without overriding the process environment", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "webvideo-env-"));
  const file = path.join(dir, ".env");
  const names = ["WEBVIDEO_ENV_EMPTY", "WEBVIDEO_ENV_QUOTED", "WEBVIDEO_ENV_EXISTING"];
  const previous = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  delete process.env.WEBVIDEO_ENV_EMPTY;
  delete process.env.WEBVIDEO_ENV_QUOTED;
  process.env.WEBVIDEO_ENV_EXISTING = "from-process";
  await writeFile(file, [
    "WEBVIDEO_ENV_EMPTY=",
    'WEBVIDEO_ENV_QUOTED="line\\nvalue"',
    "WEBVIDEO_ENV_EXISTING=from-file",
  ].join("\n"));
  try {
    assert.equal(await loadEnvFile(file), true);
    assert.equal(process.env.WEBVIDEO_ENV_EMPTY, "");
    assert.equal(process.env.WEBVIDEO_ENV_QUOTED, "line\nvalue");
    assert.equal(process.env.WEBVIDEO_ENV_EXISTING, "from-process");
  } finally {
    await rm(dir, { recursive: true, force: true });
    names.forEach((name) => {
      if (previous[name] === undefined) delete process.env[name];
      else process.env[name] = previous[name];
    });
  }
});

test("missing env files are optional", async () => {
  assert.equal(await loadEnvFile(path.join(tmpdir(), "webvideo-missing-env", ".env")), false);
});
