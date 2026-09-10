import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import {
  compileChapter,
  finalizePhase1,
  initPhase1,
  Phase1Error,
  preflightPhase1,
  resumePhase1,
  reviewChapter,
  reviewGlobal,
  statusPhase1,
} from "../courseplay-phase1.mjs";

const sourceRoot = path.resolve(".");
const episodeId = "episode-07";
const sha256 = (content) => createHash("sha256").update(content).digest("hex");

async function fixture({ outline = "legacy" } = {}) {
  const fixtureRoot = path.join(sourceRoot, ".tmp", "tool-tests");
  await mkdir(fixtureRoot, { recursive: true });
  const root = await mkdtemp(path.join(fixtureRoot, "courseplay-phase1-"));
  const episodeDir = path.join(root, "episodes", episodeId);
  await mkdir(episodeDir, { recursive: true });
  await cp(path.join(sourceRoot, "episodes", episodeId, "project.json"), path.join(episodeDir, "project.json"));
  await cp(path.join(sourceRoot, "episodes", episodeId, "inputs"), path.join(episodeDir, "inputs"), { recursive: true });
  await mkdir(path.join(root, "templates", "episode"), { recursive: true });
  const template = await readFile(path.join(sourceRoot, "templates", "episode", "outline.md"), "utf8");
  await writeFile(path.join(root, "templates", "episode", "outline.md"), template);
  if (outline === "legacy") await writeFile(path.join(episodeDir, "outline.md"), template);
  if (outline === "conflict") await writeFile(path.join(episodeDir, "outline.md"), "# Hand-authored outline\n");
  const aPage = JSON.parse(await readFile(path.join(episodeDir, "inputs", `${episodeId}-a-page.json`), "utf8"));
  const candidateDir = path.join(root, "candidates");
  await mkdir(candidateDir, { recursive: true });
  return {
    root,
    episodeDir,
    aPage,
    candidateDir,
    cleanup: () => rm(root, { recursive: true, force: true }),
  };
}

function scriptCandidate(page, beats = 1) {
  const nx = page.nx.trim();
  if (beats === 1) return `## ${page.a_id} · test\n\n${nx}\n`;
  const cut = Math.floor(nx.length / 2);
  return `## ${page.a_id} · test\n\n${nx.slice(0, cut)}\n\n---\n\n${nx.slice(cut)}\n`;
}

function outlineCandidate(page, index, steps = 1) {
  const screenId = page.screen.title.screen_item_id;
  const rows = Array.from({ length: steps }, (_, row) => `| ${row + 1} | narration | \`S-${page.a_id} · complete\` (~10s) | show: ${screenId} |`).join("\n");
  return `## ${index}. ${page.a_id.toLowerCase()} — 测试（${steps} steps · ~${steps * 10}s）

**A-page / Chapter**：\`${page.a_id}\`

**基础场景**：\`test-scene\`

**强调页**：\`none\`

**额外复杂场景**：\`none\`

| Step | Narration Focus | Scene State | Instruction |
|---:|---|---|---|
${rows}
`;
}

async function writeCandidate(ctx, name, content) {
  const file = path.join(ctx.candidateDir, name);
  await writeFile(file, content);
  return file;
}

async function compileAll(ctx) {
  await initPhase1({ root: ctx.root, episodeId });
  for (let index = 0; index < ctx.aPage.pages.length; index += 1) {
    const page = ctx.aPage.pages[index];
    const script = await writeCandidate(ctx, `${page.a_id}-script.md`, scriptCandidate(page));
    await compileChapter({ root: ctx.root, episodeId, aPageId: page.a_id, script });
    await reviewChapter({ root: ctx.root, episodeId, aPageId: page.a_id, stage: "script", verdict: "PASS" });
    const outline = await writeCandidate(ctx, `${page.a_id}-outline.md`, outlineCandidate(page, index + 1));
    await compileChapter({ root: ctx.root, episodeId, aPageId: page.a_id, outline });
    await reviewChapter({ root: ctx.root, episodeId, aPageId: page.a_id, stage: "outline", verdict: "PASS" });
  }
}

async function finalize(ctx) {
  const schedule = await writeCandidate(ctx, "schedule.md", [
    "| A-page | Base scene |",
    "|---|---|",
    ...ctx.aPage.pages.map((page) => `| ${page.a_id} | test-scene |`),
  ].join("\n"));
  const materials = await writeCandidate(ctx, "materials.md", "### A001\n\nM001\n\n### A006\n\nM002\n\n### A007\n\nM003\n");
  return finalizePhase1({ root: ctx.root, episodeId, schedule, materials });
}

async function expectCode(action, code) {
  await assert.rejects(action, (error) => error instanceof Phase1Error && error.detail.code === code);
}

test("episode-07 formal v6/v4 inputs pass strict preflight", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  const result = await preflightPhase1({ root: ctx.root, episodeId });
  assert.equal(result.pages.length, 7);
  assert.equal(result.aPage.schema_version, "courseplay-a-page/v6");
});

test("happy path migrates the legacy template and reaches Checkpoint Plan", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  await compileAll(ctx);
  const assembled = await finalize(ctx);
  assert.equal(assembled.state.phase, "global-review");
  const reviewed = await reviewGlobal({ root: ctx.root, episodeId, verdict: "PASS" });
  assert.equal(reviewed.state.phase, "awaiting-checkpoint-plan");
  assert.equal(reviewed.next, "awaiting Checkpoint Plan");
  const outline = await readFile(path.join(ctx.episodeDir, "outline.md"), "utf8");
  assert.match(outline, /\*\*主题\*\*：pending（Checkpoint Plan 待选）/u);
  assert.match(outline, /\*\*编译状态\*\*：global-reviewed/u);
  assert.doesNotMatch(outline, /input_fingerprint/u);
});

test("preflight fails fast when a required formal input is missing", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  await rm(path.join(ctx.episodeDir, "inputs", `${episodeId}-visual-rough-validation.json`));
  await expectCode(() => preflightPhase1({ root: ctx.root, episodeId }), "PHASE1_INPUT_MISSING");
});

test("preflight rejects visual rough page-order drift", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  const roughPath = path.join(ctx.episodeDir, "inputs", `${episodeId}-visual-rough.md`);
  const rough = (await readFile(roughPath, "utf8")).replace("## A002｜", "## A999｜");
  await writeFile(roughPath, rough);
  await expectCode(() => preflightPhase1({ root: ctx.root, episodeId }), "PHASE1_PAGE_SEQUENCE");
});

test("init refuses a non-template pre-existing outline", async (t) => {
  const ctx = await fixture({ outline: "conflict" }); t.after(ctx.cleanup);
  await expectCode(() => initPhase1({ root: ctx.root, episodeId }), "PHASE1_OUTLINE_CONFLICT");
});

test("compile rejects nx drift and out-of-order chapters", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  await initPhase1({ root: ctx.root, episodeId });
  const bad = await writeCandidate(ctx, "bad-script.md", "## A001 · bad\n\nchanged narration\n");
  await expectCode(() => compileChapter({ root: ctx.root, episodeId, aPageId: "A001", script: bad }), "PHASE1_NX_MISMATCH");
  const later = await writeCandidate(ctx, "A002-script.md", scriptCandidate(ctx.aPage.pages[1]));
  await expectCode(() => compileChapter({ root: ctx.root, episodeId, aPageId: "A002", script: later }), "PHASE1_STATE");
});

test("outline step count must equal the frozen script Beat count", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  await initPhase1({ root: ctx.root, episodeId });
  const page = ctx.aPage.pages[0];
  const script = await writeCandidate(ctx, "A001-script.md", scriptCandidate(page, 2));
  await compileChapter({ root: ctx.root, episodeId, aPageId: page.a_id, script });
  await reviewChapter({ root: ctx.root, episodeId, aPageId: page.a_id, stage: "script", verdict: "PASS" });
  const outline = await writeCandidate(ctx, "A001-outline.md", outlineCandidate(page, 1, 1));
  await expectCode(() => compileChapter({ root: ctx.root, episodeId, aPageId: page.a_id, outline }), "PHASE1_BEAT_STEP_MISMATCH");
});

test("REVISE invalidates only the reviewed local block", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  await initPhase1({ root: ctx.root, episodeId });
  const page = ctx.aPage.pages[0];
  const script = await writeCandidate(ctx, "A001-script.md", scriptCandidate(page));
  await compileChapter({ root: ctx.root, episodeId, aPageId: page.a_id, script });
  const result = await reviewChapter({ root: ctx.root, episodeId, aPageId: page.a_id, stage: "script", verdict: "REVISE" });
  assert.equal(result.state.chapters[0].script.status, "stale");
  assert.equal(result.state.chapters[1].script.status, "pending");
  assert.match(result.next, /A001/u);
});

test("resume recovers an init interrupted after atomic outline write", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  await assert.rejects(() => initPhase1({ root: ctx.root, episodeId, testFault: "after-outline-init" }), /TEST_FAULT/u);
  const recovered = await initPhase1({ root: ctx.root, episodeId });
  assert.equal(recovered.resumed, true);
  assert.equal(recovered.state.last_successful_transition, "recover-init");
});

test("resume recovers a script block written before state transition", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  await initPhase1({ root: ctx.root, episodeId });
  const page = ctx.aPage.pages[0];
  const script = await writeCandidate(ctx, "A001-script.md", scriptCandidate(page));
  await assert.rejects(() => compileChapter({ root: ctx.root, episodeId, aPageId: page.a_id, script, testFault: "after-script-write" }), /TEST_FAULT/u);
  const recovered = await resumePhase1({ root: ctx.root, episodeId });
  assert.equal(recovered.state.chapters[0].script.status, "draft");
  assert.match(recovered.next, /review-chapter.*A001.*script/u);
});

test("resume recovers an outline section written before state transition", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  await initPhase1({ root: ctx.root, episodeId });
  const page = ctx.aPage.pages[0];
  const script = await writeCandidate(ctx, "A001-script.md", scriptCandidate(page));
  await compileChapter({ root: ctx.root, episodeId, aPageId: page.a_id, script });
  await reviewChapter({ root: ctx.root, episodeId, aPageId: page.a_id, stage: "script", verdict: "PASS" });
  const outline = await writeCandidate(ctx, "A001-outline.md", outlineCandidate(page, 1));
  await assert.rejects(() => compileChapter({ root: ctx.root, episodeId, aPageId: page.a_id, outline, testFault: "after-outline-section" }), /TEST_FAULT/u);
  const recovered = await resumePhase1({ root: ctx.root, episodeId });
  assert.equal(recovered.state.chapters[0].outline.status, "draft");
  assert.match(recovered.next, /review-chapter.*A001.*outline/u);
});

test("resume identifies the first unfinished global region", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  await compileAll(ctx);
  const schedule = await writeCandidate(ctx, "schedule.md", [
    "| A-page | Base scene |",
    "|---|---|",
    ...ctx.aPage.pages.map((page) => `| ${page.a_id} | test-scene |`),
  ].join("\n"));
  const materials = await writeCandidate(ctx, "materials.md", "### A001\n\nM001\n\n### A006\n\nM002\n\n### A007\n\nM003\n");
  await assert.rejects(() => finalizePhase1({ root: ctx.root, episodeId, schedule, materials, testFault: "after-schedule-finalize" }), /TEST_FAULT/u);
  const recovered = await resumePhase1({ root: ctx.root, episodeId });
  assert.equal(recovered.state.global.metadata, "ready");
  assert.equal(recovered.state.global.schedule, "ready");
  assert.equal(recovered.state.global.materials, "pending");
  assert.match(recovered.next, /finalize/u);
});

test("global REVISE persists explicit chapter and region stale markers", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  await compileAll(ctx);
  await finalize(ctx);
  const result = await reviewGlobal({ root: ctx.root, episodeId, verdict: "REVISE", targets: "chapter:A003,schedule" });
  assert.equal(result.state.chapters[2].outline.status, "stale");
  assert.equal(result.state.chapters[1].outline.status, "frozen");
  assert.equal(result.state.global.schedule, "stale");
  const outline = await readFile(path.join(ctx.episodeDir, "outline.md"), "utf8");
  assert.match(outline, /PHASE1-BLOCK: A003 · outline-stale/u);
  assert.match(outline, /GLOBAL-DERIVED: schedule · stale/u);
});

test("resume marks only changed input owners stale after valid input refresh", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  await compileAll(ctx);
  const inputs = path.join(ctx.episodeDir, "inputs");
  const aPagePath = path.join(inputs, `${episodeId}-a-page.json`);
  const roughPath = path.join(inputs, `${episodeId}-visual-rough.md`);
  const aValidationPath = path.join(inputs, `${episodeId}-a-page-validation.json`);
  const roughValidationPath = path.join(inputs, `${episodeId}-visual-rough-validation.json`);
  const aPage = JSON.parse(await readFile(aPagePath, "utf8"));
  aPage.pages[0].teaching_purpose += "（修订）";
  const aPageText = `${JSON.stringify(aPage, null, 2)}\n`;
  await writeFile(aPagePath, aPageText);
  const aDigest = sha256(aPageText);
  let roughText = await readFile(roughPath, "utf8");
  roughText = roughText.replace(/source_a_page_sha256:\s*[a-f0-9]+/u, `source_a_page_sha256: ${aDigest}`);
  await writeFile(roughPath, roughText);
  const aValidation = JSON.parse(await readFile(aValidationPath, "utf8"));
  aValidation.input_integrity.a_page_sha256 = aDigest;
  await writeFile(aValidationPath, `${JSON.stringify(aValidation, null, 2)}\n`);
  const roughValidation = JSON.parse(await readFile(roughValidationPath, "utf8"));
  roughValidation.input_integrity.a_page_sha256 = aDigest;
  roughValidation.input_integrity.visual_rough_sha256 = sha256(roughText);
  await writeFile(roughValidationPath, `${JSON.stringify(roughValidation, null, 2)}\n`);
  const before = await statusPhase1({ root: ctx.root, episodeId });
  assert.deepEqual(before.input_changes, ["A001"]);
  const resumed = await resumePhase1({ root: ctx.root, episodeId });
  assert.equal(resumed.state.chapters[0].script.status, "stale");
  assert.equal(resumed.state.chapters[1].script.status, "frozen");
});

test("state commands fail fast instead of silently using a stale chapter order", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  await initPhase1({ root: ctx.root, episodeId });
  const statePath = path.join(ctx.root, ".tmp", "player-phase1", episodeId, "state.json");
  const state = JSON.parse(await readFile(statePath, "utf8"));
  [state.chapters[0], state.chapters[1]] = [state.chapters[1], state.chapters[0]];
  await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`);
  await expectCode(() => statusPhase1({ root: ctx.root, episodeId }), "PHASE1_PAGE_SEQUENCE");
  await expectCode(() => resumePhase1({ root: ctx.root, episodeId }), "PHASE1_PAGE_SEQUENCE");
});
