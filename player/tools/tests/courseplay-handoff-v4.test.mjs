import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { buildCourseplayHandoffV4Packet, HANDOFF_ERROR_CATALOG, HandoffContractError } from "../courseplay-handoff.mjs";

const fixture = path.resolve("tools/tests/fixtures/courseplay-handoff-v4/sources");
async function inputs() {
  const read = (name) => readFile(path.join(fixture, name), "utf8");
  const narrationSource = await readFile(path.resolve("tools/tests/fixtures/courseplay-handoff-v4/src/chapters/01-merge-and-reuse/narrations.ts"), "utf8");
  return {
    root: path.resolve("."), episodeId: "episode-fixture-v4", aPageId: "A001",
    files: { episodeDir: fixture, project: path.join(fixture, "project.json"), aPage: path.join(fixture, "episode-fixture-v4-a-page.json"), visualRough: path.join(fixture, "episode-fixture-v4-visual-rough.md"), script: path.join(fixture, "script.md"), outline: path.join(fixture, "outline.md") },
    projectText: await read("project.json"), aPageText: await read("episode-fixture-v4-a-page.json"), visualRoughText: await read("episode-fixture-v4-visual-rough.md"), scriptText: await read("script.md"), outlineText: await read("outline.md"), narrationSteps: [...narrationSource.matchAll(/^\s*"(.+)",?$/gmu)].map((item) => item[1]),
  };
}

test("handoff v4 emits U presentation and preserves runtime step equality", async () => {
  const { packet } = await buildCourseplayHandoffV4Packet(await inputs());
  assert.equal(packet.schema_version, "web-video-courseplay-chapter-handoff/v4");
  assert.deepEqual(packet.presentation.content_units[0], { unit_id: "U001", source_group_ids: ["G001", "G002"] });
  assert.equal(packet.narration.beats.length, packet.steps.length);
  assert.equal(packet.steps.length, packet.chapter.step_count);
  assert.equal(packet.runtime_contract, "script beat = outline step = narrations.ts step");
  assert.ok(!JSON.stringify(packet.presentation).includes("必须逐字显示的标题"));
});

test("handoff v4 rejects every older version pair with structured diagnostics", async () => {
  const value = await inputs();
  value.aPageText = value.aPageText.replace("courseplay-a-page/v6", "courseplay-a-page/v5");
  await assert.rejects(() => buildCourseplayHandoffV4Packet(value), (error) => error instanceof HandoffContractError && error.detail.code === "HV4_VERSION_PAIR" && Object.keys(error.detail).length === 7);
});

test("handoff v4 checks narrations.ts step cardinality", async () => {
  const value = await inputs(); value.narrationSteps = ["one"];
  await assert.rejects(() => buildCourseplayHandoffV4Packet(value), (error) => error.detail.code === "HV4_BEAT_STEP_MISMATCH");
});

test("handoff error codes match the public catalog", async () => {
  const catalog = JSON.parse(await readFile(path.resolve("docs/handoff-v4-error-catalog.json"), "utf8"));
  const failures = JSON.parse(await readFile(path.resolve("tools/tests/fixtures/courseplay-handoff-v4/failure-cases.json"), "utf8"));
  assert.deepEqual(new Set(catalog.errors.map((item) => item.code)), new Set(Object.keys(HANDOFF_ERROR_CATALOG)));
  assert.deepEqual(new Set(failures.cases.map((item) => item.code)), new Set(Object.keys(HANDOFF_ERROR_CATALOG)));
  for (const item of catalog.errors) assert.deepEqual(HANDOFF_ERROR_CATALOG[item.code], [item.message, item.hint, item.contractSection]);
});
