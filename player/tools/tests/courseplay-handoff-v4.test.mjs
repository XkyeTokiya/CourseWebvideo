import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { buildCourseplayHandoffV4Packet, HANDOFF_ERROR_CATALOG, HandoffContractError, parseVisualRoughV4 } from "../courseplay-handoff.mjs";

const example = path.resolve("docs/examples/courseplay-handoff-v4");
const aPageExample = path.resolve("../narration-pipeline/.agents/skills/rewrite-course-narration/references/examples/a-page-v6/canonical-contract-example-a-page.json");
const visualExample = path.resolve("../narration-pipeline/.agents/skills/design-course-visual-rough/references/examples/visual-rough-v4/canonical-contract-example-visual-rough.md");
async function inputs() {
  const read = (name) => readFile(path.join(example, name), "utf8");
  return {
    root: path.resolve("."), episodeId: "canonical-contract-example", aPageId: "A002",
    files: { episodeDir: example, project: path.join(example, "project.json"), aPage: aPageExample, visualRough: visualExample, script: path.join(example, "script.md"), outline: path.join(example, "outline.md") },
    projectText: await read("project.json"), aPageText: await readFile(aPageExample, "utf8"), visualRoughText: await readFile(visualExample, "utf8"), scriptText: await read("script.md"), outlineText: await read("outline.md"),
  };
}

test("handoff v4 emits U presentation and preserves runtime step equality", async () => {
  const { packet } = await buildCourseplayHandoffV4Packet(await inputs());
  assert.equal(packet.schema_version, "web-video-courseplay-chapter-handoff/v4");
  assert.deepEqual(packet.presentation.content_units[0], { unit_id: "U003", source_group_ids: ["G003"] });
  assert.equal(packet.narration.beats.length, packet.steps.length);
  assert.equal(packet.steps.length, packet.chapter.step_count);
  assert.equal(packet.runtime_contract, "script beat = outline step");
  assert.equal(packet.chapter.title, "职责页");
  assert.match(packet.materials_markdown, /M001/);
  assert.ok(!JSON.stringify(packet.presentation).includes("必须逐字显示的标题"));
});

test("handoff v4 rejects every older version pair with structured diagnostics", async () => {
  const value = await inputs();
  value.aPageText = value.aPageText.replace("courseplay-a-page/v6", "courseplay-a-page/v5");
  await assert.rejects(() => buildCourseplayHandoffV4Packet(value), (error) => error instanceof HandoffContractError && error.detail.code === "HV4_VERSION_PAIR" && Object.keys(error.detail).length === 7);
});

test("handoff v4 checks script beat and outline step cardinality", async () => {
  const value = await inputs(); value.outlineText = value.outlineText.replace("| 2 | 区分主体职责 |", "| 3 | 区分主体职责 |");
  await assert.rejects(() => buildCourseplayHandoffV4Packet(value), (error) => error.detail.code === "HV4_BEAT_STEP_MISMATCH");
});

test("handoff v4 rejects non-presentation stable IDs in show instructions", async () => {
  const value = await inputs(); value.outlineText = value.outlineText.replace("show: S004, U003, M001", "show: G003, U003, M001");
  await assert.rejects(() => buildCourseplayHandoffV4Packet(value), (error) => error.detail.code === "HV4_REFERENCE_UNKNOWN");
});

test("handoff v4 accepts non-semantic punctuation and spacing variants", async () => {
  const value = await inputs();
  value.visualRoughText = `\ufeff${value.visualRoughText.replaceAll("：", ":").replaceAll("｜", " | ").replaceAll("\n", "\r\n")}`;
  value.scriptText = value.scriptText.replace("·", " | ").replaceAll("\n", "\r\n");
  value.outlineText = value.outlineText.replaceAll(" — ", " - ").replaceAll("（", "(").replaceAll("）", ")").replaceAll("：", ":").replaceAll("\n", "\r\n");
  const { packet } = await buildCourseplayHandoffV4Packet(value);
  assert.equal(packet.chapter.a_page_id, "A002");
});

test("handoff error codes match the public catalog", async () => {
  const catalog = JSON.parse(await readFile(path.resolve("docs/handoff-v4-error-catalog.json"), "utf8"));
  const failures = JSON.parse(await readFile(path.resolve("tools/tests/fixtures/courseplay-handoff-v4/failure-cases.json"), "utf8"));
  assert.deepEqual(new Set(catalog.errors.map((item) => item.code)), new Set(Object.keys(HANDOFF_ERROR_CATALOG)));
  assert.deepEqual(new Set(failures.cases.map((item) => item.code)), new Set(Object.keys(HANDOFF_ERROR_CATALOG)));
  for (const item of catalog.errors) assert.deepEqual(HANDOFF_ERROR_CATALOG[item.code], [item.message, item.hint, item.contractSection]);
});

test("visual rough parser preserves multiple relation carriers in one A-page", async () => {
  const aPage = JSON.parse(await readFile(path.resolve("episodes/episode-07/inputs/episode-07-a-page.json"), "utf8"));
  const rough = await readFile(path.resolve("episodes/episode-07/inputs/episode-07-visual-rough.md"), "utf8");
  assert.deepEqual(parseVisualRoughV4(rough, aPage.pages).get("A004").relation_carriers.map((item) => item.relation_id), ["R004", "R005"]);
});
