import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { buildCourseplayHandoffV4Packet, generateCourseplayHandoff, HANDOFF_ERROR_CATALOG, HandoffContractError, parseVisualRoughV4 } from "../courseplay-handoff.mjs";

const example = path.resolve("docs/examples/courseplay-handoff-v4");
const aPageExample = path.resolve("../narration-pipeline/.agents/skills/rewrite-course-narration/references/examples/a-page-v6/canonical-contract-example-a-page.json");
const visualExample = path.resolve("../narration-pipeline/.agents/skills/design-course-visual-rough/references/examples/visual-rough-v4/canonical-contract-example-visual-rough.md");
async function inputs() {
  const read = (name) => readFile(path.join(example, name), "utf8");
  return {
    root: path.resolve("."), episodeId: "canonical-contract-example", aPageId: "A002",
    generation: { reason: "explicit-request", consumer: "test-consumer", lifecycle: "delete-after-test" },
    files: { episodeDir: example, project: path.join(example, "project.json"), aPage: aPageExample, visualRough: visualExample, script: path.join(example, "script.md"), outline: path.join(example, "outline.md") },
    projectText: await read("project.json"), aPageText: await readFile(aPageExample, "utf8"), visualRoughText: await readFile(visualExample, "utf8"), scriptText: await read("script.md"), outlineText: await read("outline.md"),
  };
}

test("handoff v4 emits U presentation and preserves runtime step equality", async () => {
  const { packet } = await buildCourseplayHandoffV4Packet(await inputs());
  assert.equal(packet.schema_version, "web-video-courseplay-chapter-handoff/v4");
  assert.deepEqual(packet.generation, { reason: "explicit-request", consumer: "test-consumer", lifecycle: "delete-after-test" });
  assert.deepEqual(packet.presentation.content_units[0], { unit_id: "U003", source_group_ids: ["G003"] });
  assert.equal(packet.narration.beats.length, packet.steps.length);
  assert.equal(packet.steps.length, packet.chapter.step_count);
  assert.equal(packet.runtime_contract, "script beat = outline step");
  assert.equal(packet.chapter.title, "职责页");
  assert.match(packet.materials_markdown, /M001/);
  assert.ok(!JSON.stringify(packet.presentation).includes("必须逐字显示的标题"));
});

test("handoff v4 accepts cross-agent and evidenced context-budget triggers", async () => {
  const crossAgent = await inputs();
  crossAgent.generation = { reason: "cross-agent", consumer: "chapter-agent-A002", lifecycle: "delete-after-consumption" };
  assert.equal((await buildCourseplayHandoffV4Packet(crossAgent)).packet.generation.reason, "cross-agent");

  const oversized = await inputs();
  oversized.generation = { reason: "context-budget-exceeded", consumer: "chapter-agent-A002", lifecycle: "delete-after-consumption", contextBytes: 120001, contextBudget: 120000 };
  assert.deepEqual((await buildCourseplayHandoffV4Packet(oversized)).packet.generation, {
    reason: "context-budget-exceeded", consumer: "chapter-agent-A002", lifecycle: "delete-after-consumption", context_bytes: 120001, context_budget: 120000,
  });
});

test("handoff v4 rejects missing trigger metadata and unproven budget overflow", async () => {
  const missing = await inputs(); delete missing.generation;
  await assert.rejects(() => buildCourseplayHandoffV4Packet(missing), (error) => error.detail.code === "HV4_TRIGGER_POLICY");
  const notOversized = await inputs();
  notOversized.generation = { reason: "context-budget-exceeded", consumer: "agent", lifecycle: "delete-after-consumption", contextBytes: 100, contextBudget: 100 };
  await assert.rejects(() => buildCourseplayHandoffV4Packet(notOversized), (error) => error.detail.code === "HV4_TRIGGER_POLICY");
});

test("explicit generation writes only the requested A-page with consumer evidence", async (t) => {
  const fixtureRoot = path.resolve(".tmp/tool-tests");
  await mkdir(fixtureRoot, { recursive: true });
  const root = await mkdtemp(path.join(fixtureRoot, "handoff-v4-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const episodeDir = path.join(root, "episodes", "episode-07");
  await mkdir(episodeDir, { recursive: true });
  for (const name of ["project.json", "script.md", "outline.md"]) await cp(path.resolve("episodes/episode-07", name), path.join(episodeDir, name));
  await cp(path.resolve("episodes/episode-07/inputs"), path.join(episodeDir, "inputs"), { recursive: true });
  await generateCourseplayHandoff({ root, episodeId: "episode-07", aPageId: "A001", reason: "explicit-request", consumer: "chapter-agent-A001", lifecycle: "delete-after-consumption" });
  assert.deepEqual(await readdir(path.join(episodeDir, ".handoffs")), ["A001.json"]);
  const packet = JSON.parse(await readFile(path.join(episodeDir, ".handoffs", "A001.json"), "utf8"));
  assert.equal(packet.chapter.a_page_id, "A001");
  assert.equal(packet.generation.consumer, "chapter-agent-A001");
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
