import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import {
  commitChapter,
  finalizePhase1,
  initPhase1,
  Phase1Error,
  preflightPhase1,
  resumePhase1,
  statusPhase1,
} from "../courseplay-phase1.mjs";

const sourceRoot = path.resolve(".");
const episodeId = "episode-07";

async function fixture({ script = "legacy", outline = "legacy" } = {}) {
  const fixtureRoot = path.join(sourceRoot, ".tmp", "tool-tests");
  await mkdir(fixtureRoot, { recursive: true });
  const root = await mkdtemp(path.join(fixtureRoot, "courseplay-phase1-min-"));
  const episodeDir = path.join(root, "episodes", episodeId);
  await mkdir(episodeDir, { recursive: true });
  await cp(path.join(sourceRoot, "episodes", episodeId, "project.json"), path.join(episodeDir, "project.json"));
  await cp(path.join(sourceRoot, "episodes", episodeId, "inputs"), path.join(episodeDir, "inputs"), { recursive: true });
  await mkdir(path.join(root, "templates", "episode"), { recursive: true });
  for (const name of ["script.md", "outline.md"]) {
    const template = await readFile(path.join(sourceRoot, "templates", "episode", name), "utf8");
    await writeFile(path.join(root, "templates", "episode", name), template);
    if ((name === "script.md" ? script : outline) === "legacy") await writeFile(path.join(episodeDir, name), template);
  }
  if (script === "conflict") await writeFile(path.join(episodeDir, "script.md"), "# Hand-authored script\n");
  if (outline === "conflict") await writeFile(path.join(episodeDir, "outline.md"), "# Hand-authored outline\n");
  const aPage = JSON.parse(await readFile(path.join(episodeDir, "inputs", `${episodeId}-a-page.json`), "utf8"));
  const candidates = path.join(root, "candidates");
  await mkdir(candidates, { recursive: true });
  return { root, episodeDir, aPage, candidates, cleanup: () => rm(root, { recursive: true, force: true }) };
}

function scriptCandidate(page, beats = 1) {
  const nx = page.nx.trim();
  if (beats === 1) return `## ${page.a_id} · test\n\n${nx}\n`;
  const cut = Math.floor(nx.length / 2);
  return `## ${page.a_id} · test\n\n${nx.slice(0, cut)}\n\n---\n\n${nx.slice(cut)}\n`;
}

function outlineCandidate(page, index, steps = 1, { omitRelations = false, unknownReference = false } = {}) {
  const screenId = unknownReference ? "S999" : page.screen.title.screen_item_id;
  const relations = omitRelations ? [] : (page.protected_relations ?? []).map((item) => item.relation_id);
  const relationLine = relations.length ? `\n**语义关系**：${relations.map((id) => `\`${id}\``).join("、")}\n` : "";
  const rows = Array.from({ length: steps }, (_, row) => `| ${row + 1} | narration | \`S-${page.a_id} · complete\` (~10s) | show: ${screenId} |`).join("\n");
  return `## ${index}. ${page.a_id.toLowerCase()} — 测试（${steps} steps · ~${steps * 10}s）

**A-page / Chapter**：\`${page.a_id}\`

**基础场景**：\`S-${page.a_id}\`

**页面配方**：\`test-recipe\`
${relationLine}
**强调页**：\`none\`

**额外复杂场景**：\`none\`

| Step | Narration Focus | Scene State | Instruction |
|---:|---|---|---|
${rows}
`;
}

async function candidate(ctx, name, content) {
  const file = path.join(ctx.candidates, name);
  await writeFile(file, content);
  return file;
}

async function submit(ctx, index, options = {}) {
  const page = ctx.aPage.pages[index];
  const script = await candidate(ctx, `${page.a_id}-script.md`, scriptCandidate(page, options.beats ?? 1));
  const outline = await candidate(ctx, `${page.a_id}-outline.md`, outlineCandidate(page, index + 1, options.steps ?? options.beats ?? 1, options));
  return commitChapter({ root: ctx.root, episodeId, aPageId: page.a_id, script, outline, testFault: options.testFault });
}

async function submitAll(ctx) {
  await initPhase1({ root: ctx.root, episodeId });
  for (let index = 0; index < ctx.aPage.pages.length; index += 1) await submit(ctx, index);
}

async function expectCode(action, code) {
  await assert.rejects(action, (error) => error instanceof Phase1Error && error.detail.code === code);
}

function chapterRegion(text, aPageId) {
  return text.match(new RegExp(`<!-- CHAPTER:${aPageId}:BEGIN[^>]*-->[\\s\\S]*?<!-- CHAPTER:${aPageId}:END -->`, "u"))?.[0];
}

test("full preflight uses the three content sources, not validation report files", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  await rm(path.join(ctx.episodeDir, "inputs", `${episodeId}-a-page-validation.json`));
  await rm(path.join(ctx.episodeDir, "inputs", `${episodeId}-visual-rough-validation.json`));
  const result = await preflightPhase1({ root: ctx.root, episodeId });
  assert.equal(result.pages.length, 7);
  assert.equal(result.approvedText.trim(), ctx.aPage.pages.map((page) => page.nx).join("").trim());
});

test("init migrates both legacy templates into deterministic formal shells", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  const result = await initPhase1({ root: ctx.root, episodeId });
  assert.equal(result.phase, "compiling");
  assert.equal(result.next.includes("A001"), true);
  assert.match(await readFile(path.join(ctx.episodeDir, "script.md"), "utf8"), /CHAPTER:A007:BEGIN tx=pending/u);
  assert.match(await readFile(path.join(ctx.episodeDir, "outline.md"), "utf8"), /GLOBAL:materials:BEGIN/u);
  await assert.rejects(readFile(path.join(ctx.root, ".tmp", "player-phase1", "state.json")), { code: "ENOENT" });
});

test("seven chapters reach Checkpoint Plan in nine normal runner calls", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  await submitAll(ctx);
  const before = await statusPhase1({ root: ctx.root, episodeId });
  assert.equal(before.phase, "ready-to-finalize");
  const result = await finalizePhase1({ root: ctx.root, episodeId });
  assert.equal(result.phase, "awaiting-checkpoint-plan");
  assert.equal(result.next, "awaiting Checkpoint Plan");
  const outline = await readFile(path.join(ctx.episodeDir, "outline.md"), "utf8");
  assert.equal((outline.match(/^\| A\d{3} \|/gmu) ?? []).length, 7);
  for (const mediaId of ["M001", "M002", "M003"]) assert.match(outline, new RegExp(mediaId, "u"));
});

test("status reads formal artifacts without visual rough or approved text", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  await initPhase1({ root: ctx.root, episodeId });
  await rm(path.join(ctx.episodeDir, "inputs", `${episodeId}-visual-rough.md`));
  await rm(path.join(ctx.episodeDir, "inputs", ctx.aPage.approved_text));
  const status = await statusPhase1({ root: ctx.root, episodeId });
  assert.equal(status.phase, "compiling");
  await expectCode(() => resumePhase1({ root: ctx.root, episodeId }), "PHASE1_INPUT_MISSING");
});

test("init refuses either non-template formal artifact", async (t) => {
  const script = await fixture({ script: "conflict" }); t.after(script.cleanup);
  await expectCode(() => initPhase1({ root: script.root, episodeId }), "PHASE1_ARTIFACT_CONFLICT");
  const outline = await fixture({ outline: "conflict" }); t.after(outline.cleanup);
  await expectCode(() => initPhase1({ root: outline.root, episodeId }), "PHASE1_ARTIFACT_CONFLICT");
});

test("commit-chapter rejects nx drift and Beat/step drift before writing", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  await initPhase1({ root: ctx.root, episodeId });
  const page = ctx.aPage.pages[0];
  const badScript = await candidate(ctx, "bad-script.md", "## A001 · bad\n\nchanged narration\n");
  const outline = await candidate(ctx, "outline.md", outlineCandidate(page, 1));
  await expectCode(() => commitChapter({ root: ctx.root, episodeId, aPageId: "A001", script: badScript, outline }), "PHASE1_NX_MISMATCH");
  const splitScript = await candidate(ctx, "split-script.md", scriptCandidate(page, 2));
  await expectCode(() => commitChapter({ root: ctx.root, episodeId, aPageId: "A001", script: splitScript, outline }), "PHASE1_BEAT_STEP_MISMATCH");
});

test("commit-chapter rejects missing protected relations and unknown stable IDs", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  await initPhase1({ root: ctx.root, episodeId });
  const page = ctx.aPage.pages.find((item) => item.protected_relations?.length);
  const index = ctx.aPage.pages.indexOf(page);
  const script = await candidate(ctx, "script.md", scriptCandidate(page));
  const missing = await candidate(ctx, "missing.md", outlineCandidate(page, index + 1, 1, { omitRelations: true }));
  await expectCode(() => commitChapter({ root: ctx.root, episodeId, aPageId: page.a_id, script, outline: missing }), "PHASE1_REFERENCE_UNKNOWN");
  const unknown = await candidate(ctx, "unknown.md", outlineCandidate(page, index + 1, 1, { unknownReference: true }));
  await expectCode(() => commitChapter({ root: ctx.root, episodeId, aPageId: page.a_id, script, outline: unknown }), "PHASE1_REFERENCE_UNKNOWN");
});

test("recommitting one chapter preserves every unrelated chapter region", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  await initPhase1({ root: ctx.root, episodeId });
  await submit(ctx, 0);
  await submit(ctx, 1);
  const before = chapterRegion(await readFile(path.join(ctx.episodeDir, "outline.md"), "utf8"), "A002");
  await submit(ctx, 0);
  const after = chapterRegion(await readFile(path.join(ctx.episodeDir, "outline.md"), "utf8"), "A002");
  assert.equal(after, before);
});

test("cross-file interruption is visible as one incomplete chapter and is recoverable", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  await initPhase1({ root: ctx.root, episodeId });
  await assert.rejects(() => submit(ctx, 0, { testFault: "after-outline-commit" }), /TEST_FAULT/u);
  const status = await statusPhase1({ root: ctx.root, episodeId });
  assert.equal(status.chapters[0].status, "incomplete");
  const resumed = await resumePhase1({ root: ctx.root, episodeId });
  assert.match(resumed.next, /commit-chapter.*A001/u);
  const recovered = await submit(ctx, 0);
  assert.equal(recovered.chapters[0].status, "committed");
});

test("finalize fails fast on missing chapters and commits atomically", async (t) => {
  const ctx = await fixture(); t.after(ctx.cleanup);
  await initPhase1({ root: ctx.root, episodeId });
  await submit(ctx, 0);
  await expectCode(() => finalizePhase1({ root: ctx.root, episodeId }), "PHASE1_INCOMPLETE");
  for (let index = 1; index < ctx.aPage.pages.length; index += 1) await submit(ctx, index);
  await assert.rejects(() => finalizePhase1({ root: ctx.root, episodeId, testFault: "after-finalize" }), /TEST_FAULT/u);
  assert.equal((await statusPhase1({ root: ctx.root, episodeId })).phase, "awaiting-checkpoint-plan");
});

test("full preflight rejects source loss and page-order drift", async (t) => {
  const missing = await fixture(); t.after(missing.cleanup);
  await rm(path.join(missing.episodeDir, "inputs", missing.aPage.approved_text));
  await expectCode(() => preflightPhase1({ root: missing.root, episodeId }), "PHASE1_INPUT_MISSING");
  const reordered = await fixture(); t.after(reordered.cleanup);
  const roughPath = path.join(reordered.episodeDir, "inputs", `${episodeId}-visual-rough.md`);
  await writeFile(roughPath, (await readFile(roughPath, "utf8")).replace("## A002｜", "## A999｜"));
  await expectCode(() => preflightPhase1({ root: reordered.root, episodeId }), "PHASE1_PAGE_SEQUENCE");
});
