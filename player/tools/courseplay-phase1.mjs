import { createHash } from "node:crypto";
import { access, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  A_PAGE_SCHEMA,
  buildCourseplayHandoffV4Packet,
  parseVisualRoughV4,
  VISUAL_ROUGH_SCHEMA,
} from "./courseplay-handoff.mjs";

export const PHASE1_STATE_SCHEMA = "web-video-courseplay-phase1-state/v1";

const ERROR_MESSAGES = {
  PHASE1_INPUT_MISSING: "必需输入不存在或无法解析。",
  PHASE1_VERSION_PAIR: "Phase 1 只接受 A-page v6 与 visual rough v4。",
  PHASE1_SOURCE_INTEGRITY: "正式输入或 validation 摘要不匹配。",
  PHASE1_INPUT_NOT_APPROVED: "正式输入尚未通过 production/approved validation。",
  PHASE1_PAGE_SEQUENCE: "A-page 与 visual rough 页面集合或顺序不一致。",
  PHASE1_NX_MISMATCH: "script Beat 拼接或 approved_text 与 A-page nx 不一致。",
  PHASE1_OUTLINE_CONFLICT: "现有 outline 既不是原始模板，也不是可恢复的新格式。",
  PHASE1_STATE: "命令不符合当前 Phase 1 状态。",
  PHASE1_BEAT_STEP_MISMATCH: "冻结 script Beat 与 outline step 不一致。",
  PHASE1_REVIEW: "审查结论或回修目标无效。",
  PHASE1_TOOL_DEFECT: "Phase 1 runner 出现未登记异常。",
};

export class Phase1Error extends Error {
  constructor(code, pathName, expected, actual) {
    const safeCode = ERROR_MESSAGES[code] ? code : "PHASE1_TOOL_DEFECT";
    super(ERROR_MESSAGES[safeCode]);
    this.detail = {
      code: safeCode,
      path: pathName,
      expected,
      actual: safeCode === code ? actual : { unregistered_code: code, value: actual },
      message: ERROR_MESSAGES[safeCode],
    };
  }
}

function fail(code, pathName, expected, actual) {
  throw new Phase1Error(code, pathName, expected, actual);
}

const sha256 = (content) => createHash("sha256").update(content).digest("hex");
const normalized = (text) => text.replace(/\s+/gu, "");
const normalizedMarkdown = (text) => text.replace(/\r\n/gu, "\n").replace(/\r/gu, "\n").replace(/^\uFEFF/u, "");
const relative = (root, file) => path.relative(root, file).split(path.sep).join("/");

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function required(file, label) {
  try {
    return await readFile(file, "utf8");
  } catch {
    fail("PHASE1_INPUT_MISSING", label, relative(process.cwd(), file), null);
  }
}

function json(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    fail("PHASE1_INPUT_MISSING", label, "valid JSON", "invalid JSON");
  }
}

function frontmatter(text) {
  const match = normalizedMarkdown(text).match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/u);
  if (!match) fail("PHASE1_VERSION_PAIR", "visual_rough.frontmatter", VISUAL_ROUGH_SCHEMA, "missing");
  return Object.fromEntries(match[1].split("\n").filter(Boolean).map((line) => {
    const index = line.search(/[:：]/u);
    return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
  }));
}

function standardPaths(root, episodeId) {
  const episodeDir = path.join(root, "episodes", episodeId);
  const inputsDir = path.join(episodeDir, "inputs");
  const workDir = path.join(root, ".tmp", "player-phase1", episodeId);
  return {
    root,
    episodeId,
    episodeDir,
    inputsDir,
    project: path.join(episodeDir, "project.json"),
    aPage: path.join(inputsDir, `${episodeId}-a-page.json`),
    aPageValidation: path.join(inputsDir, `${episodeId}-a-page-validation.json`),
    visualRough: path.join(inputsDir, `${episodeId}-visual-rough.md`),
    visualRoughValidation: path.join(inputsDir, `${episodeId}-visual-rough-validation.json`),
    outline: path.join(episodeDir, "outline.md"),
    script: path.join(episodeDir, "script.md"),
    templateOutline: path.join(root, "templates", "episode", "outline.md"),
    workDir,
    state: path.join(workDir, "state.json"),
    scriptDir: path.join(workDir, "script"),
    reviewDir: path.join(workDir, "reviews"),
  };
}

function validationPass(report, expected) {
  const failures = Array.isArray(report.failures) ? report.failures : [];
  const errors = Array.isArray(report.errors) ? report.errors : [];
  if (report.episode_id !== expected.episodeId || failures.length || errors.length) {
    fail("PHASE1_INPUT_NOT_APPROVED", expected.label, {
      episode_id: expected.episodeId,
      failures: [],
      errors: [],
    }, {
      episode_id: report.episode_id,
      failures,
      errors,
    });
  }
}

function orderedRoughSections(text) {
  return [...normalizedMarkdown(text).matchAll(/^##\s+(A\d{3})\s*(?:[｜|])\s*(.*?)\s*$/gmu)]
    .map((match, index, matches) => ({
      a_id: match[1],
      title: match[2],
      markdown: normalizedMarkdown(text).slice(match.index, matches[index + 1]?.index ?? text.length).trim(),
    }));
}

export async function preflightPhase1({ root = process.cwd(), episodeId }) {
  const files = standardPaths(path.resolve(root), episodeId);
  const [projectText, aPageText, aValidationText, roughText, roughValidationText] = await Promise.all([
    required(files.project, "project.json"),
    required(files.aPage, "a-page"),
    required(files.aPageValidation, "a-page-validation"),
    required(files.visualRough, "visual-rough"),
    required(files.visualRoughValidation, "visual-rough-validation"),
  ]);
  const project = json(projectText, "project.json");
  const aPage = json(aPageText, "a-page");
  const aValidation = json(aValidationText, "a-page-validation");
  const roughValidation = json(roughValidationText, "visual-rough-validation");
  const roughMeta = frontmatter(roughText);

  if (project.id !== episodeId || aPage.episode_id !== episodeId || roughMeta.episode_id !== episodeId) {
    fail("PHASE1_SOURCE_INTEGRITY", "episode_id", episodeId, {
      project: project.id,
      a_page: aPage.episode_id,
      visual_rough: roughMeta.episode_id,
    });
  }
  if (aPage.schema_version !== A_PAGE_SCHEMA || roughMeta.schema_version !== VISUAL_ROUGH_SCHEMA) {
    fail("PHASE1_VERSION_PAIR", "schema_version", [A_PAGE_SCHEMA, VISUAL_ROUGH_SCHEMA], [aPage.schema_version, roughMeta.schema_version]);
  }
  if (aPage.document_kind !== "production" || roughMeta.document_kind !== "production" || roughMeta.status !== "approved") {
    fail("PHASE1_INPUT_NOT_APPROVED", "document_status", {
      a_page: "production",
      visual_rough: "production/approved",
    }, {
      a_page: aPage.document_kind,
      visual_rough: `${roughMeta.document_kind}/${roughMeta.status}`,
    });
  }

  validationPass(aValidation, { episodeId, label: "a-page-validation" });
  validationPass(roughValidation, { episodeId, label: "visual-rough-validation" });
  if (aValidation.validation_profile !== "a-page-v6" || aValidation.schema_version !== A_PAGE_SCHEMA
      || aValidation.production_status !== "production") {
    fail("PHASE1_INPUT_NOT_APPROVED", "a-page-validation.profile", "a-page-v6/production", {
      profile: aValidation.validation_profile,
      schema: aValidation.schema_version,
      status: aValidation.production_status,
    });
  }
  if (roughValidation.validation_profile !== "visual-rough-v4" || roughValidation.schema_version !== VISUAL_ROUGH_SCHEMA
      || roughValidation.status !== "approved") {
    fail("PHASE1_INPUT_NOT_APPROVED", "visual-rough-validation.profile", "visual-rough-v4/approved", {
      profile: roughValidation.validation_profile,
      schema: roughValidation.schema_version,
      status: roughValidation.status,
    });
  }

  const pages = Array.isArray(aPage.pages) ? aPage.pages : [];
  const pageIds = pages.map((page) => page.a_id);
  if (!pages.length || pageIds.some((id) => !/^A\d{3}$/u.test(id)) || new Set(pageIds).size !== pageIds.length
      || pages.some((page) => typeof page.nx !== "string" || !page.nx.trim())) {
    fail("PHASE1_PAGE_SEQUENCE", "a_page.pages", "unique Axxx pages with non-empty nx", pageIds);
  }
  const roughSections = orderedRoughSections(roughText);
  const roughIds = roughSections.map((section) => section.a_id);
  if (JSON.stringify(pageIds) !== JSON.stringify(roughIds)) {
    fail("PHASE1_PAGE_SEQUENCE", "visual_rough.pages", pageIds, roughIds);
  }
  try {
    parseVisualRoughV4(roughText, pages);
  } catch (error) {
    fail("PHASE1_PAGE_SEQUENCE", "visual_rough.structure", "valid v4 page structure", error.detail ?? error.message);
  }

  const aPageDigest = sha256(aPageText);
  const roughDigest = sha256(roughText);
  if (roughMeta.source_a_page !== `${episodeId}-a-page.json`
      || roughMeta.source_a_page_sha256?.toLowerCase() !== aPageDigest
      || aValidation.input_integrity?.a_page_sha256?.toLowerCase() !== aPageDigest
      || roughValidation.input_integrity?.a_page_sha256?.toLowerCase() !== aPageDigest
      || roughValidation.input_integrity?.visual_rough_sha256?.toLowerCase() !== roughDigest) {
    fail("PHASE1_SOURCE_INTEGRITY", "input_digests", "validation digests match current files", {
      rough_source: roughMeta.source_a_page_sha256,
      a_validation: aValidation.input_integrity,
      rough_validation: roughValidation.input_integrity,
    });
  }

  let approvedText = null;
  let approvedPath = null;
  if (aPage.approved_text) {
    approvedPath = path.join(files.inputsDir, aPage.approved_text);
    approvedText = await required(approvedPath, "approved_text");
    if (normalized(pages.map((page) => page.nx).join("")) !== normalized(approvedText)) {
      fail("PHASE1_NX_MISMATCH", "approved_text", "ordered pages[].nx", aPage.approved_text);
    }
    if (aValidation.input_integrity?.approved_text_sha256?.toLowerCase() !== sha256(approvedText)) {
      fail("PHASE1_SOURCE_INTEGRITY", "approved_text.digest", aValidation.input_integrity?.approved_text_sha256, sha256(approvedText));
    }
  }

  const roughById = new Map(roughSections.map((section) => [section.a_id, section]));
  const chapters = pages.map((page) => ({
    a_id: page.a_id,
    input_fingerprint: sha256(`${JSON.stringify(page)}\n${roughById.get(page.a_id)?.markdown ?? ""}`),
  }));
  return {
    files,
    project,
    aPage,
    pages,
    roughText,
    roughSections,
    approvedPath,
    input_fingerprint: sha256(`${aPageDigest}\n${roughDigest}\n${approvedText ? sha256(approvedText) : "none"}`),
    chapters,
  };
}

async function atomicWrite(file, content, faultAt, options = {}) {
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = path.join(path.dirname(file), `.${path.basename(file)}.${process.pid}.tmp`);
  try {
    await writeFile(temporary, content);
    await rename(temporary, file);
    if (options.testFault === faultAt) throw new Error(`TEST_FAULT:${faultAt}`);
  } finally {
    await rm(temporary, { force: true }).catch(() => {});
  }
}

function initialState(preflight) {
  return {
    schema_version: PHASE1_STATE_SCHEMA,
    episode_id: preflight.files.episodeId,
    phase: "initialized",
    input_fingerprint: preflight.input_fingerprint,
    chapters: preflight.chapters.map((chapter) => ({
      ...chapter,
      script: { status: "pending", review: null },
      outline: { status: "pending", review: null },
    })),
    global: {
      metadata: "pending",
      schedule: "pending",
      materials: "pending",
      review: null,
    },
    last_successful_transition: "init",
  };
}

function outlineShell(pages) {
  const sections = pages.map((page, index) => `## ${index + 1}. ${page.a_id} — pending\n\n<!-- PHASE1-BLOCK: ${page.a_id} · pending-script -->\n<!-- CHAPTER-CONTENT: pending -->`).join("\n\n");
  return `# Video Outline\n\n> **编译状态**：in-progress\n> **主题**：pending（Checkpoint Plan 待选）\n> **章节**：${pages.length}\n\n<!-- GLOBAL-DERIVED: metadata · pending -->\n\n## 整集视觉调度\n\n<!-- GLOBAL-DERIVED: schedule · pending -->\n\n## 0. cover — 封面（1 silent step · fixed 15s）\n\n${sections}\n\n## 素材清单\n\n<!-- GLOBAL-DERIVED: materials · pending -->\n`;
}

function markerState(outline, aPageId) {
  return outline.match(new RegExp(`<!-- PHASE1-BLOCK: ${aPageId} · ([a-z-]+) -->`, "u"))?.[1] ?? null;
}

function globalState(outline, region) {
  return outline.match(new RegExp(`<!-- GLOBAL-DERIVED: ${region} · ([a-z-]+) -->`, "u"))?.[1] ?? null;
}

function replaceMarker(outline, aPageId, status) {
  const pattern = new RegExp(`<!-- PHASE1-BLOCK: ${aPageId} · [a-z-]+ -->`, "u");
  if (!pattern.test(outline)) fail("PHASE1_STATE", `outline.${aPageId}.marker`, "existing marker", null);
  return outline.replace(pattern, `<!-- PHASE1-BLOCK: ${aPageId} · ${status} -->`);
}

function chapterRange(outline, aPageId) {
  const marker = new RegExp(`<!-- PHASE1-BLOCK: ${aPageId} · [a-z-]+ -->`, "u").exec(outline);
  if (!marker) fail("PHASE1_STATE", `outline.${aPageId}.marker`, "existing marker", null);
  const before = outline.slice(0, marker.index);
  const start = before.lastIndexOf("\n## ") + 1;
  const next = outline.indexOf("\n## ", marker.index + marker[0].length);
  return { start, end: next < 0 ? outline.length : next + 1 };
}

function parseScriptBlock(text, aPageId, nx) {
  text = normalizedMarkdown(text).trim();
  const header = text.match(/^##\s+(A\d{3})\s*(?:·|｜|\|)\s+(.+?)\s*$/mu);
  if (!header || header[1] !== aPageId) fail("PHASE1_PAGE_SEQUENCE", `script.${aPageId}.header`, aPageId, header?.[1] ?? null);
  const body = text.slice((header.index ?? 0) + header[0].length).trim();
  const beats = body.split(/^\s*---\s*$/gmu).map((beat) => beat.trim()).filter(Boolean);
  if (!beats.length || normalized(beats.join("")) !== normalized(nx)) {
    fail("PHASE1_NX_MISMATCH", `script.${aPageId}`, nx, beats.join(""));
  }
  return { text: `${text}\n`, title: header[2].trim(), beats };
}

function parseOutlineSection(text, aPageId, expectedIndex, expectedSteps) {
  text = normalizedMarkdown(text).trim();
  const heading = text.match(/^##\s+(\d+)\.\s+([a-z0-9-]+)\s*(?:—|–|-)\s+(.+?)\s*[（(](\d+)\s+steps?\s+·\s*~?(\d+)s[）)]\s*$/mu);
  const declaredPage = text.match(/^\s*\*\*A-page\s+\/\s+Chapter\*\*\s*[：:]\s*`?(A\d{3})`?\s*$/mu)?.[1];
  if (!heading || Number(heading[1]) !== expectedIndex || declaredPage !== aPageId) {
    fail("PHASE1_PAGE_SEQUENCE", `outline.${aPageId}`, { index: expectedIndex, a_id: aPageId }, {
      index: heading?.[1] ?? null,
      a_id: declaredPage ?? null,
    });
  }
  const rows = [...text.matchAll(/^\s*\|\s*(\d+)\s*\|[^\n]*\|\s*$/gmu)]
    .map((match) => Number(match[1]));
  const expectedRows = Array.from({ length: expectedSteps }, (_, index) => index + 1);
  if (Number(heading[4]) !== expectedSteps || JSON.stringify(rows) !== JSON.stringify(expectedRows)) {
    fail("PHASE1_BEAT_STEP_MISMATCH", `outline.${aPageId}`, {
      heading: expectedSteps,
      rows: expectedRows,
    }, {
      heading: Number(heading?.[4]),
      rows,
    });
  }
  const custom = text.match(/^\*\*额外复杂场景\*\*[：:]\s*(.+?)\s*$/mu)?.[1] ?? "none";
  if (!/^`?none`?$/u.test(custom) && !/proposed/u.test(custom)) {
    fail("PHASE1_REVIEW", `outline.${aPageId}.custom_scene`, "none or proposed", custom);
  }
  return {
    text: `${text}\n`,
    index: Number(heading[1]),
    id: heading[2],
    title: heading[3].trim(),
    steps: expectedSteps,
    seconds: Number(heading[5]),
  };
}

async function readState(files) {
  if (!(await exists(files.state))) fail("PHASE1_STATE", "state", "run init first", null);
  const state = json(await required(files.state, "state"), "state");
  if (state.schema_version !== PHASE1_STATE_SCHEMA || state.episode_id !== files.episodeId) {
    fail("PHASE1_STATE", "state.schema", PHASE1_STATE_SCHEMA, state.schema_version);
  }
  return state;
}

async function writeState(files, state, transition, options) {
  state.last_successful_transition = transition;
  await atomicWrite(files.state, `${JSON.stringify(state, null, 2)}\n`, "after-state-write", options);
}

function chapterById(state, aPageId) {
  const chapter = state.chapters.find((item) => item.a_id === aPageId);
  if (!chapter) fail("PHASE1_PAGE_SEQUENCE", "a_page_id", state.chapters.map((item) => item.a_id), aPageId);
  return chapter;
}

function markGlobalStale(state, regions) {
  for (const region of regions) if (state.global[region] === "ready") state.global[region] = "stale";
  state.global.review = null;
  if (state.phase === "awaiting-checkpoint-plan") state.phase = "compiling";
}

function syncGlobalMarkers(outline, state) {
  for (const region of ["metadata", "schedule", "materials"]) {
    outline = outline.replace(
      new RegExp(`<!-- GLOBAL-DERIVED: ${region} · [a-z-]+ -->`, "u"),
      `<!-- GLOBAL-DERIVED: ${region} · ${state.global[region]} -->`,
    );
  }
  return outline;
}

function nextAction(state) {
  for (const chapter of state.chapters) {
    if (["pending", "stale"].includes(chapter.script.status)) return `compile-chapter --a-page ${chapter.a_id} --script <path>`;
    if (chapter.script.status === "draft") return `review-chapter --a-page ${chapter.a_id} --stage script --verdict PASS|REVISE`;
    if (["pending", "stale"].includes(chapter.outline.status)) return `compile-chapter --a-page ${chapter.a_id} --outline <path>`;
    if (chapter.outline.status === "draft") return `review-chapter --a-page ${chapter.a_id} --stage outline --verdict PASS|REVISE`;
  }
  if (["metadata", "schedule", "materials"].some((region) => state.global[region] !== "ready")) {
    return "finalize --schedule <path> --materials <path>";
  }
  if (state.global.review !== "PASS") return "review-global --verdict PASS|REVISE";
  return "awaiting Checkpoint Plan";
}

export async function initPhase1({ root = process.cwd(), episodeId, testFault }) {
  const preflight = await preflightPhase1({ root, episodeId });
  const { files } = preflight;
  const shell = outlineShell(preflight.pages);
  const current = await exists(files.outline) ? await required(files.outline, "outline") : null;
  if (current !== null) {
    const legacy = await required(files.templateOutline, "template-outline");
    const isNew = /<!-- PHASE1-BLOCK: A\d{3} · [a-z-]+ -->/u.test(current);
    if (!isNew && normalizedMarkdown(current) !== normalizedMarkdown(legacy)) {
      fail("PHASE1_OUTLINE_CONFLICT", relative(files.root, files.outline), "pristine legacy template or Phase 1 markers", "existing content");
    }
    if (isNew) {
      if (await exists(files.state)) {
        const state = await readState(files);
        return { state, next: nextAction(state), resumed: true };
      }
      const state = initialState(preflight);
      await writeState(files, state, "recover-init", { testFault });
      return { state, next: nextAction(state), resumed: true };
    }
  }
  await atomicWrite(files.outline, shell, "after-outline-init", { testFault });
  const state = initialState(preflight);
  await writeState(files, state, "init", { testFault });
  return { state, next: nextAction(state), resumed: false };
}

export async function compileChapter({ root = process.cwd(), episodeId, aPageId, script, outline, testFault }) {
  const preflight = await preflightPhase1({ root, episodeId });
  const { files } = preflight;
  const state = await readState(files);
  aPageId = aPageId?.toUpperCase();
  const chapter = chapterById(state, aPageId);
  const pageIndex = preflight.pages.findIndex((page) => page.a_id === aPageId);
  const page = preflight.pages[pageIndex];
  if (Boolean(script) === Boolean(outline)) {
    fail("PHASE1_STATE", "compile-chapter.arguments", "exactly one of --script or --outline", { script, outline });
  }
  if (script) {
    const incompletePrevious = state.chapters.slice(0, pageIndex)
      .find((item) => item.script.status !== "frozen" || item.outline.status !== "frozen");
    if (incompletePrevious) {
      fail("PHASE1_STATE", `chapters.${aPageId}.order`, "all previous chapters frozen", incompletePrevious.a_id);
    }
    if (!["pending", "stale"].includes(chapter.script.status)) {
      fail("PHASE1_STATE", `chapters.${aPageId}.script`, "pending or stale", chapter.script.status);
    }
    const parsed = parseScriptBlock(await required(path.resolve(script), "script-candidate"), aPageId, page.nx);
    const output = path.join(files.scriptDir, `${aPageId}.md`);
    await atomicWrite(output, parsed.text, "after-script-write", { testFault });
    markGlobalStale(state, ["metadata", "schedule"]);
    let outlineText = await required(files.outline, "outline");
    outlineText = replaceMarker(outlineText, aPageId, "script-draft");
    outlineText = syncGlobalMarkers(outlineText, state);
    await atomicWrite(files.outline, outlineText, "after-script-marker", { testFault });
    chapter.script = { status: "draft", review: null, beats: parsed.beats.length, path: relative(files.root, output) };
    chapter.outline = { status: chapter.outline.status === "pending" ? "pending" : "stale", review: null };
    state.phase = "compiling";
    await writeState(files, state, `compile-script:${aPageId}`, { testFault });
    return { state, next: nextAction(state) };
  }
  if (chapter.script.status !== "frozen") {
    fail("PHASE1_STATE", `chapters.${aPageId}.script`, "frozen", chapter.script.status);
  }
  if (!["pending", "stale"].includes(chapter.outline.status)) {
    fail("PHASE1_STATE", `chapters.${aPageId}.outline`, "pending or stale", chapter.outline.status);
  }
  const parsed = parseOutlineSection(await required(path.resolve(outline), "outline-candidate"), aPageId, pageIndex + 1, chapter.script.beats);
  markGlobalStale(state, ["metadata", "schedule", "materials"]);
  let outlineText = await required(files.outline, "outline");
  const range = chapterRange(outlineText, aPageId);
  const withMarker = parsed.text.replace(/^([^\n]+\n)/u, `$1\n<!-- PHASE1-BLOCK: ${aPageId} · outline-draft -->\n`);
  outlineText = `${outlineText.slice(0, range.start)}${withMarker}\n${outlineText.slice(range.end)}`;
  outlineText = syncGlobalMarkers(outlineText, state);
  await atomicWrite(files.outline, outlineText, "after-outline-section", { testFault });
  chapter.outline = { status: "draft", review: null, id: parsed.id, title: parsed.title, steps: parsed.steps, seconds: parsed.seconds };
  state.phase = "compiling";
  await writeState(files, state, `compile-outline:${aPageId}`, { testFault });
  return { state, next: nextAction(state) };
}

export async function reviewChapter({ root = process.cwd(), episodeId, aPageId, stage, verdict, report, testFault }) {
  const preflight = await preflightPhase1({ root, episodeId });
  const { files } = preflight;
  const state = await readState(files);
  aPageId = aPageId?.toUpperCase();
  verdict = verdict?.toUpperCase();
  if (!new Set(["script", "outline"]).has(stage) || !new Set(["PASS", "REVISE"]).has(verdict)) {
    fail("PHASE1_REVIEW", "review-chapter.arguments", "stage script|outline and verdict PASS|REVISE", { stage, verdict });
  }
  const chapter = chapterById(state, aPageId);
  if (chapter[stage].status !== "draft") {
    fail("PHASE1_STATE", `chapters.${aPageId}.${stage}`, "draft", chapter[stage].status);
  }
  const reportText = report ? await required(path.resolve(report), "review-report") : null;
  const record = { a_page_id: aPageId, stage, verdict, report: reportText };
  const reviewPath = path.join(files.reviewDir, `${aPageId}-${stage}.json`);
  await atomicWrite(reviewPath, `${JSON.stringify(record, null, 2)}\n`, "after-review-write", { testFault });
  let outlineText = await required(files.outline, "outline");
  if (verdict === "PASS") {
    chapter[stage].status = "frozen";
    chapter[stage].review = "PASS";
    outlineText = replaceMarker(outlineText, aPageId, stage === "script" ? "script-frozen" : "outline-frozen");
  } else {
    chapter[stage].status = "stale";
    chapter[stage].review = "REVISE";
    outlineText = replaceMarker(outlineText, aPageId, stage === "script" ? "script-stale" : "outline-stale");
    if (stage === "script") {
      chapter.outline = { status: chapter.outline.status === "pending" ? "pending" : "stale", review: null };
      markGlobalStale(state, ["metadata", "schedule"]);
    } else {
      markGlobalStale(state, ["metadata", "schedule", "materials"]);
    }
  }
  state.input_fingerprint = preflight.input_fingerprint;
  outlineText = syncGlobalMarkers(outlineText, state);
  await atomicWrite(files.outline, outlineText, "after-review-marker", { testFault });
  await writeState(files, state, `review-${stage}:${aPageId}:${verdict}`, { testFault });
  return { state, next: nextAction(state) };
}

function allChapterSections(outline, pageIds) {
  return pageIds.map((aPageId) => {
    const range = chapterRange(outline, aPageId);
    return outline.slice(range.start, range.end).trim();
  });
}

function replaceGlobalRegion(outline, region, content) {
  const marker = new RegExp(`<!-- GLOBAL-DERIVED: ${region} · [a-z-]+ -->`, "u").exec(outline);
  if (!marker) fail("PHASE1_STATE", `global.${region}`, "existing marker", null);
  if (region === "metadata") {
    const h1End = outline.indexOf("\n", outline.indexOf("# Video Outline"));
    return `${outline.slice(0, h1End + 1)}\n${content.trim()}\n\n<!-- GLOBAL-DERIVED: metadata · ready -->${outline.slice(marker.index + marker[0].length)}`;
  }
  const nextHeading = outline.indexOf("\n## ", marker.index + marker[0].length);
  const end = nextHeading < 0 ? outline.length : nextHeading;
  return `${outline.slice(0, marker.index)}<!-- GLOBAL-DERIVED: ${region} · ready -->\n\n${content.trim()}\n${outline.slice(end)}`;
}

function validateSchedule(text, pageIds) {
  const ids = [...text.matchAll(/^\s*\|\s*(A\d{3})\s*\|/gmu)].map((match) => match[1]);
  if (JSON.stringify(ids) !== JSON.stringify(pageIds)) {
    fail("PHASE1_PAGE_SEQUENCE", "global.schedule", pageIds, ids);
  }
}

function roughMediaIds(roughText) {
  return [...new Set([...roughText.matchAll(/^\s*-\s+\*\*媒体需求\*\*\s*[：:]\s*`?(M\d{3})\s*\//gmu)].map((match) => match[1]))];
}

function validateMaterials(text, mediaIds) {
  const missing = mediaIds.filter((id) => !new RegExp(`(?<![A-Za-z0-9])${id}(?!\\d)`, "u").test(text));
  if (missing.length) fail("PHASE1_SOURCE_INTEGRITY", "global.materials", mediaIds, { missing });
}

export async function finalizePhase1({ root = process.cwd(), episodeId, schedule, materials, testFault }) {
  const preflight = await preflightPhase1({ root, episodeId });
  const { files } = preflight;
  const state = await readState(files);
  const incomplete = state.chapters.filter((chapter) => chapter.script.status !== "frozen" || chapter.outline.status !== "frozen");
  if (incomplete.length) fail("PHASE1_STATE", "chapters", "all script and outline reviews PASS", incomplete.map((item) => item.a_id));
  if (!schedule || !materials) fail("PHASE1_STATE", "finalize.arguments", "--schedule and --materials", { schedule, materials });
  const scheduleText = await required(path.resolve(schedule), "schedule");
  const materialsText = await required(path.resolve(materials), "materials");
  const pageIds = preflight.pages.map((page) => page.a_id);
  validateSchedule(scheduleText, pageIds);
  validateMaterials(materialsText, roughMediaIds(preflight.roughText));

  const blocks = await Promise.all(pageIds.map((aPageId) => required(path.join(files.scriptDir, `${aPageId}.md`), `script.${aPageId}`)));
  for (let index = 0; index < blocks.length; index += 1) parseScriptBlock(blocks[index], pageIds[index], preflight.pages[index].nx);
  const scriptText = `# Video Script\n\n${blocks.map((block) => block.trim()).join("\n\n")}\n`;
  await atomicWrite(files.script, scriptText, "after-script-finalize", { testFault });

  let outlineText = await required(files.outline, "outline");
  const sections = allChapterSections(outlineText, pageIds);
  const parsed = sections.map((section, index) => parseOutlineSection(section.replace(/^([^\n]+\n)\n<!-- PHASE1-BLOCK:[^\n]+-->\n/u, "$1"), pageIds[index], index + 1, state.chapters[index].script.beats));
  const totalSteps = parsed.reduce((sum, chapter) => sum + chapter.steps, 0);
  const totalSeconds = parsed.reduce((sum, chapter) => sum + chapter.seconds, 0);
  const accentCount = sections.reduce((sum, section) => sum + (section.match(/^\*\*强调页\*\*[：:]\s*(.+)$/mu)?.[1]?.match(/K-A\d{3}-\d{2}/gu)?.length ?? 0), 0);
  const customCount = sections.filter((section) => {
    const value = section.match(/^\*\*额外复杂场景\*\*[：:]\s*(.+)$/mu)?.[1] ?? "none";
    return !/^`?none`?$/u.test(value);
  }).length;
  const metadata = `> **编译状态**：global-review-pending\n> **主题**：pending（Checkpoint Plan 待选）\n> **正文时长**：约 ${Math.floor(totalSeconds / 60)} 分 ${totalSeconds % 60} 秒\n> **章节**：${pageIds.length}\n> **Base scenes**：${pageIds.length}\n> **Accent frames**：${accentCount}\n> **Custom scene candidates**：${customCount}\n> **Narration beats**：${totalSteps}`;
  const metadataOutline = replaceGlobalRegion(outlineText, "metadata", metadata);
  const scheduleOutline = replaceGlobalRegion(metadataOutline, "schedule", scheduleText);
  const finalOutline = replaceGlobalRegion(scheduleOutline, "materials", materialsText);
  const [projectText, aPageText] = await Promise.all([
    required(files.project, "project.json"),
    required(files.aPage, "a-page"),
  ]);
  for (const aPageId of pageIds) {
    await buildCourseplayHandoffV4Packet({
      root: files.root,
      episodeId,
      aPageId,
      files,
      projectText,
      aPageText,
      visualRoughText: preflight.roughText,
      scriptText,
      outlineText: finalOutline,
    });
  }

  outlineText = metadataOutline;
  await atomicWrite(files.outline, outlineText, "after-metadata-finalize", { testFault });
  outlineText = scheduleOutline;
  await atomicWrite(files.outline, outlineText, "after-schedule-finalize", { testFault });
  outlineText = finalOutline;
  await atomicWrite(files.outline, outlineText, "after-materials-finalize", { testFault });
  state.global.metadata = "ready";
  state.global.schedule = "ready";
  state.global.materials = "ready";
  state.global.review = null;
  state.phase = "global-review";
  await writeState(files, state, "finalize", { testFault });
  return { state, next: nextAction(state), script: relative(files.root, files.script), outline: relative(files.root, files.outline) };
}

export async function reviewGlobal({ root = process.cwd(), episodeId, verdict, report, targets = "", testFault }) {
  const preflight = await preflightPhase1({ root, episodeId });
  const { files } = preflight;
  const state = await readState(files);
  verdict = verdict?.toUpperCase();
  if (!new Set(["PASS", "REVISE"]).has(verdict)) fail("PHASE1_REVIEW", "review-global.verdict", "PASS or REVISE", verdict);
  if (["metadata", "schedule", "materials"].some((region) => state.global[region] !== "ready")) {
    fail("PHASE1_STATE", "global", "all regions ready", state.global);
  }
  const incomplete = state.chapters.filter((chapter) => chapter.script.status !== "frozen" || chapter.outline.status !== "frozen");
  if (incomplete.length) {
    fail("PHASE1_STATE", "chapters", "all chapters frozen", incomplete.map((chapter) => chapter.a_id));
  }
  const reportText = report ? await required(path.resolve(report), "global-review-report") : null;
  const targetList = targets.split(",").map((item) => item.trim()).filter(Boolean);
  if (verdict === "REVISE" && !targetList.length) fail("PHASE1_REVIEW", "review-global.targets", "one or more explicit targets", []);
  const allowed = new Set(["metadata", "schedule", "materials", ...state.chapters.map((chapter) => `chapter:${chapter.a_id}`)]);
  if (targetList.some((target) => !allowed.has(target))) fail("PHASE1_REVIEW", "review-global.targets", [...allowed], targetList);
  const record = { verdict, targets: targetList, report: reportText };
  await atomicWrite(path.join(files.reviewDir, "global.json"), `${JSON.stringify(record, null, 2)}\n`, "after-global-review-write", { testFault });
  if (verdict === "PASS") {
    const outlineText = (await required(files.outline, "outline"))
      .replace("> **编译状态**：global-review-pending", "> **编译状态**：global-reviewed");
    await atomicWrite(files.outline, outlineText, "after-global-pass", { testFault });
    state.global.review = "PASS";
    state.phase = "awaiting-checkpoint-plan";
  } else {
    state.global.review = "REVISE";
    let outlineText = await required(files.outline, "outline");
    for (const target of targetList) {
      if (target.startsWith("chapter:")) {
        const aPageId = target.slice("chapter:".length);
        chapterById(state, aPageId).outline.status = "stale";
        outlineText = replaceMarker(outlineText, aPageId, "outline-stale");
      } else {
        state.global[target] = "stale";
        outlineText = outlineText.replace(
          new RegExp(`<!-- GLOBAL-DERIVED: ${target} · [a-z-]+ -->`, "u"),
          `<!-- GLOBAL-DERIVED: ${target} · stale -->`,
        );
      }
    }
    await atomicWrite(files.outline, outlineText, "after-global-stale-markers", { testFault });
    state.phase = "compiling";
  }
  await writeState(files, state, `review-global:${verdict}`, { testFault });
  return { state, next: nextAction(state) };
}

export async function statusPhase1({ root = process.cwd(), episodeId }) {
  const preflight = await preflightPhase1({ root, episodeId });
  const state = await readState(preflight.files);
  const changes = preflight.chapters.filter((current) => chapterById(state, current.a_id).input_fingerprint !== current.input_fingerprint)
    .map((item) => item.a_id);
  return { state, input_changes: changes, next: changes.length ? "resume to mark changed chapters stale" : nextAction(state) };
}

export async function resumePhase1({ root = process.cwd(), episodeId }) {
  const preflight = await preflightPhase1({ root, episodeId });
  const { files } = preflight;
  const state = await readState(files);
  let outlineText = await required(files.outline, "outline");
  for (const current of preflight.chapters) {
    const chapter = chapterById(state, current.a_id);
    if (chapter.input_fingerprint !== current.input_fingerprint) {
      chapter.input_fingerprint = current.input_fingerprint;
      chapter.script = { status: "stale", review: null };
      chapter.outline = { status: "stale", review: null };
      markGlobalStale(state, ["metadata", "schedule", "materials"]);
      outlineText = replaceMarker(outlineText, current.a_id, "script-stale");
      continue;
    }
    const marker = markerState(outlineText, current.a_id);
    if (marker === "script-draft") chapter.script.status = "draft";
    if (marker === "script-frozen") chapter.script.status = "frozen";
    if (marker === "script-stale") chapter.script.status = "stale";
    if (marker === "outline-draft") chapter.outline.status = "draft";
    if (marker === "outline-frozen") chapter.outline.status = "frozen";
    if (marker === "outline-stale") chapter.outline.status = "stale";
    const block = path.join(files.scriptDir, `${current.a_id}.md`);
    if (chapter.script.status === "pending" && await exists(block)) {
      const parsed = parseScriptBlock(await required(block, `script.${current.a_id}`), current.a_id, preflight.pages.find((page) => page.a_id === current.a_id).nx);
      chapter.script = { status: "draft", review: null, beats: parsed.beats.length, path: relative(files.root, block) };
    }
  }
  for (const region of ["metadata", "schedule", "materials"]) {
    const marker = globalState(outlineText, region);
    if (marker === "ready" && state.global[region] !== "stale") state.global[region] = "ready";
    if (marker === "stale") state.global[region] = "stale";
  }
  outlineText = syncGlobalMarkers(outlineText, state);
  await atomicWrite(files.outline, outlineText, "resume-outline", {});
  await writeState(files, state, "resume", {});
  return { state, next: nextAction(state) };
}

function parseArgs(argv) {
  if (argv[0] === "--") argv = argv.slice(1);
  const command = argv[0];
  const values = { command };
  for (let index = 1; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith("--")) continue;
    const [key, inline] = value.slice(2).split("=", 2);
    values[key.replace(/-([a-z])/gu, (_, letter) => letter.toUpperCase())] = inline ?? argv[++index] ?? "";
  }
  if (!command || !values.episode) fail("PHASE1_INPUT_MISSING", "arguments", "command and --episode", argv);
  return values;
}

export async function runPhase1(args) {
  const common = { root: args.root ?? path.resolve(process.env.PLAYER_ROOT ?? process.cwd()), episodeId: args.episode };
  if (args.command === "preflight") return preflightPhase1(common);
  if (args.command === "init") return initPhase1(common);
  if (args.command === "compile-chapter") return compileChapter({ ...common, aPageId: args.aPage, script: args.script, outline: args.outline });
  if (args.command === "review-chapter") return reviewChapter({ ...common, aPageId: args.aPage, stage: args.stage, verdict: args.verdict, report: args.report });
  if (args.command === "finalize") return finalizePhase1({ ...common, schedule: args.schedule, materials: args.materials });
  if (args.command === "review-global") return reviewGlobal({ ...common, verdict: args.verdict, report: args.report, targets: args.targets });
  if (args.command === "status") return statusPhase1(common);
  if (args.command === "resume") return resumePhase1(common);
  fail("PHASE1_INPUT_MISSING", "command", "preflight|init|compile-chapter|review-chapter|finalize|review-global|status|resume", args.command);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`Courseplay Phase 1 runner

Usage:
  pnpm courseplay:phase1 -- <command> --episode <episode-id> [options]

Commands:
  preflight
  init
  compile-chapter --a-page <Axxx> (--script <path> | --outline <path>)
  review-chapter --a-page <Axxx> --stage <script|outline> --verdict <PASS|REVISE> [--report <path>]
  finalize --schedule <path> --materials <path>
  review-global --verdict <PASS|REVISE> [--targets <chapter:Axxx|metadata|schedule|materials,...>] [--report <path>]
  status
  resume`);
    process.exit(0);
  }
  try {
    const result = await runPhase1(parseArgs(process.argv.slice(2)));
    const output = result.files ? {
      episode_id: result.files.episodeId,
      pages: result.pages.length,
      input_fingerprint: result.input_fingerprint,
      status: "preflight-passed",
    } : {
      episode_id: result.state.episode_id,
      phase: result.state.phase,
      next: result.next,
      input_changes: result.input_changes ?? [],
    };
    console.log(JSON.stringify(output, null, 2));
  } catch (error) {
    const detail = error.detail ?? new Phase1Error("PHASE1_TOOL_DEFECT", "tool", "registered diagnostic", error.message).detail;
    console.error(JSON.stringify(detail));
    process.exitCode = 1;
  }
}
