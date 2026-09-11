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

const ERROR_MESSAGES = {
  PHASE1_INPUT_MISSING: "必需输入不存在或无法解析。",
  PHASE1_VERSION_PAIR: "Phase 1 只接受 A-page v6 与 visual rough v4。",
  PHASE1_SOURCE_INTEGRITY: "正式输入的 episode、来源或批准口播不一致。",
  PHASE1_INPUT_NOT_APPROVED: "正式输入尚未达到 production/approved。",
  PHASE1_PAGE_SEQUENCE: "A-page、visual rough 或正式文件的章节集合/顺序不一致。",
  PHASE1_NX_MISMATCH: "script Beat 拼接与当前 A-page nx 不一致。",
  PHASE1_ARTIFACT_CONFLICT: "现有 script/outline 既不是原始模板，也不是可恢复的模块化格式。",
  PHASE1_BEAT_STEP_MISMATCH: "script Beat 与 outline step 不一致。",
  PHASE1_REFERENCE_UNKNOWN: "outline 丢失必要关系或引用了当前章节未知的稳定 ID。",
  PHASE1_INCOMPLETE: "仍有章节未完整提交，不能 finalize。",
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
const markdown = (text) => text.replace(/\r\n/gu, "\n").replace(/\r/gu, "\n").replace(/^\uFEFF/u, "");
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
    fail("PHASE1_INPUT_MISSING", label, file, null);
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    fail("PHASE1_INPUT_MISSING", label, "valid JSON", "invalid JSON");
  }
}

function frontmatter(text) {
  const match = markdown(text).match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/u);
  if (!match) fail("PHASE1_VERSION_PAIR", "visual_rough.frontmatter", VISUAL_ROUGH_SCHEMA, "missing");
  return Object.fromEntries(match[1].split("\n").filter(Boolean).map((line) => {
    const index = line.search(/[:：]/u);
    return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
  }));
}

function standardPaths(root, episodeId) {
  const episodeDir = path.join(root, "episodes", episodeId);
  const inputsDir = path.join(episodeDir, "inputs");
  return {
    root,
    episodeId,
    episodeDir,
    inputsDir,
    project: path.join(episodeDir, "project.json"),
    aPage: path.join(inputsDir, `${episodeId}-a-page.json`),
    visualRough: path.join(inputsDir, `${episodeId}-visual-rough.md`),
    outline: path.join(episodeDir, "outline.md"),
    script: path.join(episodeDir, "script.md"),
    templateOutline: path.join(root, "templates", "episode", "outline.md"),
    templateScript: path.join(root, "templates", "episode", "script.md"),
  };
}

function roughSections(text) {
  text = markdown(text);
  const matches = [...text.matchAll(/^##\s+(A\d{3})\s*(?:[｜|])\s*(.*?)\s*$/gmu)];
  return matches.map((match, index) => ({
    a_id: match[1],
    title: match[2],
    markdown: text.slice(match.index, matches[index + 1]?.index ?? text.length).trim(),
  }));
}

function validateCoreInputs({ files, aPage, roughText }) {
  const roughMeta = frontmatter(roughText);
  if (aPage.schema_version !== A_PAGE_SCHEMA || roughMeta.schema_version !== VISUAL_ROUGH_SCHEMA) {
    fail("PHASE1_VERSION_PAIR", "schema_version", [A_PAGE_SCHEMA, VISUAL_ROUGH_SCHEMA], [aPage.schema_version, roughMeta.schema_version]);
  }
  if (aPage.document_kind !== "production" || roughMeta.document_kind !== "production" || roughMeta.status !== "approved") {
    fail("PHASE1_INPUT_NOT_APPROVED", "document_status", "A-page production and visual rough production/approved", {
      a_page: aPage.document_kind,
      visual_rough: `${roughMeta.document_kind}/${roughMeta.status}`,
    });
  }
  if (aPage.episode_id !== files.episodeId || roughMeta.episode_id !== files.episodeId) {
    fail("PHASE1_SOURCE_INTEGRITY", "episode_id", files.episodeId, {
      a_page: aPage.episode_id,
      visual_rough: roughMeta.episode_id,
    });
  }
  const pages = Array.isArray(aPage.pages) ? aPage.pages : [];
  const pageIds = pages.map((page) => page.a_id);
  if (!pages.length || pageIds.some((id) => !/^A\d{3}$/u.test(id)) || new Set(pageIds).size !== pageIds.length
      || pages.some((page) => typeof page.nx !== "string" || !page.nx.trim())) {
    fail("PHASE1_PAGE_SEQUENCE", "a_page.pages", "unique Axxx pages with non-empty nx", pageIds);
  }
  const sections = roughSections(roughText);
  const roughIds = sections.map((section) => section.a_id);
  if (JSON.stringify(pageIds) !== JSON.stringify(roughIds)) {
    fail("PHASE1_PAGE_SEQUENCE", "visual_rough.pages", pageIds, roughIds);
  }
  let roughById;
  try {
    roughById = parseVisualRoughV4(roughText, pages);
  } catch (error) {
    fail("PHASE1_SOURCE_INTEGRITY", "visual_rough.structure", "valid visual rough v4", error.detail ?? error.message);
  }
  return { pages, sections, roughById, roughMeta };
}

async function loadChapterInputs({ root, episodeId }) {
  const files = standardPaths(path.resolve(root), episodeId);
  const [aPageText, roughText] = await Promise.all([
    required(files.aPage, "a-page"),
    required(files.visualRough, "visual-rough"),
  ]);
  const aPage = parseJson(aPageText, "a-page");
  return { files, aPage, aPageText, roughText, ...validateCoreInputs({ files, aPage, roughText }) };
}

export async function preflightPhase1({ root = process.cwd(), episodeId }) {
  const files = standardPaths(path.resolve(root), episodeId);
  const [projectText, aPageText, roughText] = await Promise.all([
    required(files.project, "project.json"),
    required(files.aPage, "a-page"),
    required(files.visualRough, "visual-rough"),
  ]);
  const project = parseJson(projectText, "project.json");
  const aPage = parseJson(aPageText, "a-page");
  if (project.id !== episodeId) fail("PHASE1_SOURCE_INTEGRITY", "project.id", episodeId, project.id);
  const core = validateCoreInputs({ files, aPage, roughText });
  const aPageDigest = sha256(aPageText);
  if (core.roughMeta.source_a_page !== `${episodeId}-a-page.json`
      || core.roughMeta.source_a_page_sha256?.toLowerCase() !== aPageDigest) {
    fail("PHASE1_SOURCE_INTEGRITY", "visual_rough.source_a_page", {
      file: `${episodeId}-a-page.json`, digest: aPageDigest,
    }, {
      file: core.roughMeta.source_a_page, digest: core.roughMeta.source_a_page_sha256,
    });
  }
  let approvedText = null;
  if (aPage.approved_text) {
    approvedText = await required(path.join(files.inputsDir, aPage.approved_text), "approved_text");
    if (normalized(core.pages.map((page) => page.nx).join("")) !== normalized(approvedText)) {
      fail("PHASE1_SOURCE_INTEGRITY", "approved_text", "ordered pages[].nx", aPage.approved_text);
    }
  }
  return { files, project, projectText, aPage, aPageText, roughText, approvedText, ...core };
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

const chapterBegin = (aPageId, transaction = "pending") => `<!-- CHAPTER:${aPageId}:BEGIN tx=${transaction} -->`;
const chapterEnd = (aPageId) => `<!-- CHAPTER:${aPageId}:END -->`;
const globalBegin = (region) => `<!-- GLOBAL:${region}:BEGIN -->`;
const globalEnd = (region) => `<!-- GLOBAL:${region}:END -->`;

function scriptShell(pages) {
  const sections = pages.map((page) => `${chapterBegin(page.a_id)}\n## ${page.a_id} · pending\n\n<!-- CHAPTER-CONTENT: pending -->\n${chapterEnd(page.a_id)}`).join("\n\n");
  return `# Video Script\n\n${sections}\n`;
}

function outlineShell(pages) {
  const sections = pages.map((page, index) => `${chapterBegin(page.a_id)}\n## ${index + 1}. ${page.a_id.toLowerCase()} — pending（0 steps · ~0s）\n\n**A-page / Chapter**：\`${page.a_id}\`\n\n<!-- CHAPTER-CONTENT: pending -->\n${chapterEnd(page.a_id)}`).join("\n\n");
  return `# Video Outline\n\n${globalBegin("metadata")}\n> **编译状态**：in-progress\n> **主题**：pending（Checkpoint Plan 待选）\n> **章节**：${pages.length}\n${globalEnd("metadata")}\n\n## 整集视觉调度\n\n${globalBegin("schedule")}\n<!-- GLOBAL-CONTENT: pending -->\n${globalEnd("schedule")}\n\n## 0. cover — 封面（1 silent step · fixed 15s）\n\n${sections}\n\n## 素材清单\n\n${globalBegin("materials")}\n<!-- GLOBAL-CONTENT: pending -->\n${globalEnd("materials")}\n`;
}

function chapterRange(text, aPageId) {
  const startPattern = new RegExp(`<!-- CHAPTER:${aPageId}:BEGIN tx=([^ ]+) -->`, "u");
  const start = startPattern.exec(text);
  const endMarker = chapterEnd(aPageId);
  const end = start ? text.indexOf(endMarker, start.index + start[0].length) : -1;
  if (!start || end < 0) fail("PHASE1_ARTIFACT_CONFLICT", aPageId, "chapter boundary markers", null);
  return {
    start: start.index,
    end: end + endMarker.length,
    contentStart: start.index + start[0].length,
    contentEnd: end,
    transaction: start[1],
  };
}

function globalRange(text, region) {
  const begin = globalBegin(region);
  const endMarker = globalEnd(region);
  const start = text.indexOf(begin);
  const end = start < 0 ? -1 : text.indexOf(endMarker, start + begin.length);
  if (start < 0 || end < 0) fail("PHASE1_ARTIFACT_CONFLICT", `global.${region}`, "global boundary markers", null);
  return { start, end: end + endMarker.length, contentStart: start + begin.length, contentEnd: end };
}

function markerIds(text) {
  return [...text.matchAll(/<!-- CHAPTER:(A\d{3}):BEGIN tx=[^ ]+ -->/gu)].map((match) => match[1]);
}

function assertArtifactOrder(text, pages, label) {
  const expected = pages.map((page) => page.a_id);
  const actual = markerIds(text);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) fail("PHASE1_PAGE_SEQUENCE", label, expected, actual);
  for (const aPageId of expected) chapterRange(text, aPageId);
}

function replaceChapter(text, aPageId, transaction, content) {
  const range = chapterRange(text, aPageId);
  return `${text.slice(0, range.start)}${chapterBegin(aPageId, transaction)}\n${content.trim()}\n${chapterEnd(aPageId)}${text.slice(range.end)}`;
}

function replaceGlobal(text, region, content) {
  const range = globalRange(text, region);
  return `${text.slice(0, range.start)}${globalBegin(region)}\n${content.trim()}\n${globalEnd(region)}${text.slice(range.end)}`;
}

function resetGlobals(outline, pageCount) {
  outline = replaceGlobal(outline, "metadata", `> **编译状态**：in-progress\n> **主题**：pending（Checkpoint Plan 待选）\n> **章节**：${pageCount}`);
  outline = replaceGlobal(outline, "schedule", "<!-- GLOBAL-CONTENT: pending -->");
  return replaceGlobal(outline, "materials", "<!-- GLOBAL-CONTENT: pending -->");
}

function parseScriptBlock(text, aPageId, nx) {
  text = markdown(text).trim();
  if (/<!--\s*(?:CHAPTER|GLOBAL)/u.test(text)) fail("PHASE1_ARTIFACT_CONFLICT", `script.${aPageId}`, "candidate without runner markers", "marker found");
  const header = text.match(/^##\s+(A\d{3})\s*(?:·|｜|\|)\s+(.+?)\s*$/mu);
  if (!header || header[1] !== aPageId) fail("PHASE1_PAGE_SEQUENCE", `script.${aPageId}.header`, aPageId, header?.[1] ?? null);
  const body = text.slice((header.index ?? 0) + header[0].length).trim();
  const beats = body.split(/^\s*---\s*$/gmu).map((beat) => beat.trim()).filter(Boolean);
  if (!beats.length || normalized(beats.join("")) !== normalized(nx)) fail("PHASE1_NX_MISMATCH", `script.${aPageId}`, nx, beats.join(""));
  return { text: `${text}\n`, title: header[2].trim(), beats };
}

function parseOutlineSection(text, aPageId, expectedIndex, expectedSteps) {
  text = markdown(text).trim();
  if (/<!--\s*(?:CHAPTER|GLOBAL)/u.test(text)) fail("PHASE1_ARTIFACT_CONFLICT", `outline.${aPageId}`, "candidate without runner markers", "marker found");
  const heading = text.match(/^##\s+(\d+)\.\s+([a-z0-9-]+)\s*(?:—|–|-)\s+(.+?)\s*[（(](\d+)\s+steps?\s+·\s*~?(\d+)s[）)]\s*$/mu);
  const declaredPage = text.match(/^\s*\*\*A-page\s+\/\s+Chapter\*\*\s*[：:]\s*`?(A\d{3})`?\s*$/mu)?.[1];
  if (!heading || Number(heading[1]) !== expectedIndex || declaredPage !== aPageId) {
    fail("PHASE1_PAGE_SEQUENCE", `outline.${aPageId}`, { index: expectedIndex, a_id: aPageId }, {
      index: heading?.[1] ?? null, a_id: declaredPage ?? null,
    });
  }
  const rows = [...text.matchAll(/^\s*\|\s*(\d+)\s*\|[^\n]*\|\s*$/gmu)].map((match) => Number(match[1]));
  const expectedRows = Array.from({ length: expectedSteps }, (_, index) => index + 1);
  if (Number(heading[4]) !== expectedSteps || JSON.stringify(rows) !== JSON.stringify(expectedRows)) {
    fail("PHASE1_BEAT_STEP_MISMATCH", `outline.${aPageId}`, { heading: expectedSteps, rows: expectedRows }, {
      heading: Number(heading?.[4]), rows,
    });
  }
  const custom = text.match(/^\*\*额外复杂场景\*\*[：:]\s*(.+?)\s*$/mu)?.[1] ?? "none";
  if (!/^`?none`?$/u.test(custom) && !/proposed/u.test(custom)) {
    fail("PHASE1_REFERENCE_UNKNOWN", `outline.${aPageId}.custom_scene`, "none or proposed", custom);
  }
  return {
    text: `${text}\n`, id: heading[2], title: heading[3].trim(), steps: expectedSteps,
    seconds: Number(heading[5]),
    baseScene: text.match(/^\*\*基础场景\*\*[：:]\s*`?(.+?)`?\s*$/mu)?.[1]?.replace(/`/gu, "") ?? "unspecified",
    recipe: text.match(/^\*\*页面配方\*\*[：:]\s*`?(.+?)`?\s*$/mu)?.[1]?.replace(/`/gu, "") ?? "unspecified",
    custom,
  };
}

function knownReferences(page, rough) {
  return new Set([
    page.screen?.title?.screen_item_id,
    ...(page.screen?.groups ?? []).flatMap((group) => (group.items ?? []).map((item) => item.screen_item_id)),
    ...(page.protected_relations ?? []).map((relation) => relation.relation_id),
    ...(rough?.content_units ?? []).map((unit) => unit.unit_id),
    ...(rough?.media ?? []).map((item) => item.media_id),
  ].filter(Boolean));
}

function validateOutlineReferences(text, page, rough) {
  const references = [...new Set([...text.matchAll(/(?<![A-Za-z0-9-])([SURM]\d{3})(?!\d)/gu)].map((match) => match[1]))];
  const known = knownReferences(page, rough);
  const unknown = references.filter((reference) => !known.has(reference));
  const requiredRelations = (page.protected_relations ?? []).map((relation) => relation.relation_id);
  const missingRelations = requiredRelations.filter((relation) => !references.includes(relation));
  if (unknown.length || missingRelations.length) {
    fail("PHASE1_REFERENCE_UNKNOWN", `outline.${page.a_id}.references`, {
      known: [...known], required_relations: requiredRelations,
    }, { unknown, missing_relations: missingRelations });
  }
}

async function ensureArtifact({ file, template, shell, pages, label, faultAt, testFault }) {
  const current = await exists(file) ? await required(file, label) : null;
  const legacy = await required(template, `${label}-template`);
  if (current === null || markdown(current) === markdown(legacy)) {
    await atomicWrite(file, shell, faultAt, { testFault });
    return "initialized";
  }
  if (markerIds(current).length) {
    assertArtifactOrder(current, pages, label);
    return "existing";
  }
  fail("PHASE1_ARTIFACT_CONFLICT", relative(path.dirname(path.dirname(file)), file), "pristine template or modular artifact", "existing content");
}

function readChapterContent(text, aPageId) {
  const range = chapterRange(text, aPageId);
  return { transaction: range.transaction, content: text.slice(range.contentStart, range.contentEnd).trim() };
}

async function inspectArtifacts(files, pages) {
  const [scriptText, outlineText] = await Promise.all([required(files.script, "script"), required(files.outline, "outline")]);
  assertArtifactOrder(scriptText, pages, "script.pages");
  assertArtifactOrder(outlineText, pages, "outline.pages");
  const chapters = pages.map((page, index) => {
    const script = readChapterContent(scriptText, page.a_id);
    const outline = readChapterContent(outlineText, page.a_id);
    if (script.transaction === "pending" && outline.transaction === "pending") return { a_id: page.a_id, status: "pending" };
    if (script.transaction !== outline.transaction || script.transaction === "pending") {
      return { a_id: page.a_id, status: "incomplete", diagnostic: "chapter transaction mismatch" };
    }
    try {
      const parsedScript = parseScriptBlock(script.content, page.a_id, page.nx);
      parseOutlineSection(outline.content, page.a_id, index + 1, parsedScript.beats.length);
      return { a_id: page.a_id, status: "committed", transaction: script.transaction };
    } catch (error) {
      return { a_id: page.a_id, status: "invalid", diagnostic: error.detail ?? error.message };
    }
  });
  const incomplete = chapters.find((chapter) => chapter.status !== "committed");
  const metadataRange = globalRange(outlineText, "metadata");
  const metadata = outlineText.slice(metadataRange.contentStart, metadataRange.contentEnd);
  const finalized = /\*\*编译状态\*\*[：:]\s*awaiting-checkpoint-plan/u.test(metadata);
  return {
    episode_id: files.episodeId,
    phase: incomplete ? "compiling" : finalized ? "awaiting-checkpoint-plan" : "ready-to-finalize",
    chapters,
    next: incomplete ? `commit-chapter --a-page ${incomplete.a_id} --script <path> --outline <path>`
      : finalized ? "awaiting Checkpoint Plan" : "finalize",
  };
}

export async function initPhase1({ root = process.cwd(), episodeId, testFault }) {
  const input = await preflightPhase1({ root, episodeId });
  const outline = await ensureArtifact({
    file: input.files.outline, template: input.files.templateOutline, shell: outlineShell(input.pages), pages: input.pages,
    label: "outline", faultAt: "after-outline-init", testFault,
  });
  const script = await ensureArtifact({
    file: input.files.script, template: input.files.templateScript, shell: scriptShell(input.pages), pages: input.pages,
    label: "script", faultAt: "after-script-init", testFault,
  });
  return { ...(await inspectArtifacts(input.files, input.pages)), initialized: { outline, script } };
}

export async function commitChapter({ root = process.cwd(), episodeId, aPageId, script, outline, testFault }) {
  const input = await loadChapterInputs({ root, episodeId });
  aPageId = aPageId?.toUpperCase();
  const index = input.pages.findIndex((page) => page.a_id === aPageId);
  if (index < 0) fail("PHASE1_PAGE_SEQUENCE", "a_page_id", input.pages.map((page) => page.a_id), aPageId);
  if (!script || !outline) fail("PHASE1_INPUT_MISSING", "commit-chapter.arguments", "--script and --outline", { script, outline });
  const [scriptText, outlineText, scriptCandidate, outlineCandidate] = await Promise.all([
    required(input.files.script, "script"), required(input.files.outline, "outline"),
    required(path.resolve(script), "script-candidate"), required(path.resolve(outline), "outline-candidate"),
  ]);
  assertArtifactOrder(scriptText, input.pages, "script.pages");
  assertArtifactOrder(outlineText, input.pages, "outline.pages");
  const page = input.pages[index];
  const parsedScript = parseScriptBlock(scriptCandidate, aPageId, page.nx);
  const parsedOutline = parseOutlineSection(outlineCandidate, aPageId, index + 1, parsedScript.beats.length);
  validateOutlineReferences(parsedOutline.text, page, input.roughById.get(aPageId));
  const transaction = sha256(`${parsedScript.text}\n${parsedOutline.text}`).slice(0, 16);
  let nextOutline = replaceChapter(outlineText, aPageId, transaction, parsedOutline.text);
  nextOutline = resetGlobals(nextOutline, input.pages.length);
  const nextScript = replaceChapter(scriptText, aPageId, transaction, parsedScript.text);
  await atomicWrite(input.files.outline, nextOutline, "after-outline-commit", { testFault });
  await atomicWrite(input.files.script, nextScript, "after-script-commit", { testFault });
  return inspectArtifacts(input.files, input.pages);
}

function materialSummary(roughById, pages) {
  const sections = [];
  for (const page of pages) {
    const media = roughById.get(page.a_id)?.media ?? [];
    if (!media.length) continue;
    sections.push(`### ${page.a_id}\n\n${media.map((item) => `- \`${item.media_id}\`：${item.media_type}${item.role ? ` — ${item.role}` : ""}`).join("\n")}`);
  }
  return sections.length ? sections.join("\n\n") : "<!-- no external media -->";
}

export async function finalizePhase1({ root = process.cwd(), episodeId, testFault }) {
  const input = await preflightPhase1({ root, episodeId });
  const [scriptText, outlineText] = await Promise.all([required(input.files.script, "script"), required(input.files.outline, "outline")]);
  assertArtifactOrder(scriptText, input.pages, "script.pages");
  assertArtifactOrder(outlineText, input.pages, "outline.pages");
  const chapters = input.pages.map((page, index) => {
    const script = readChapterContent(scriptText, page.a_id);
    const outline = readChapterContent(outlineText, page.a_id);
    if (script.transaction === "pending" || script.transaction !== outline.transaction) {
      fail("PHASE1_INCOMPLETE", `chapters.${page.a_id}`, "matching committed transaction", {
        script: script.transaction, outline: outline.transaction,
      });
    }
    const parsedScript = parseScriptBlock(script.content, page.a_id, page.nx);
    const parsedOutline = parseOutlineSection(outline.content, page.a_id, index + 1, parsedScript.beats.length);
    validateOutlineReferences(parsedOutline.text, page, input.roughById.get(page.a_id));
    return { page, script: parsedScript, outline: parsedOutline, rawOutline: outline.content };
  });
  const totalSteps = chapters.reduce((sum, chapter) => sum + chapter.outline.steps, 0);
  const totalSeconds = chapters.reduce((sum, chapter) => sum + chapter.outline.seconds, 0);
  const accentCount = chapters.reduce((sum, chapter) => sum + (chapter.rawOutline.match(/K-A\d{3}-\d{2}/gu)?.length ?? 0), 0);
  const customCount = chapters.filter((chapter) => !/^`?none`?$/u.test(chapter.outline.custom)).length;
  const metadata = `> **编译状态**：awaiting-checkpoint-plan\n> **主题**：pending（Checkpoint Plan 待选）\n> **正文时长**：约 ${Math.floor(totalSeconds / 60)} 分 ${totalSeconds % 60} 秒\n> **章节**：${chapters.length}\n> **Base scenes**：${chapters.length}\n> **Accent frames**：${accentCount}\n> **Custom scene candidates**：${customCount}\n> **Narration beats**：${totalSteps}`;
  const schedule = [
    "| A-page | Base scene | Recipe | Steps | Duration |", "|---|---|---|---:|---:|",
    ...chapters.map((chapter) => `| ${chapter.page.a_id} | ${chapter.outline.baseScene} | ${chapter.outline.recipe} | ${chapter.outline.steps} | ~${chapter.outline.seconds}s |`),
  ].join("\n");
  let finalOutline = replaceGlobal(outlineText, "metadata", metadata);
  finalOutline = replaceGlobal(finalOutline, "schedule", schedule);
  finalOutline = replaceGlobal(finalOutline, "materials", materialSummary(input.roughById, input.pages));
  for (const page of input.pages) {
    await buildCourseplayHandoffV4Packet({
      root: input.files.root, episodeId, aPageId: page.a_id, files: input.files,
      projectText: input.projectText, aPageText: input.aPageText, visualRoughText: input.roughText,
      scriptText, outlineText: finalOutline,
    });
  }
  await atomicWrite(input.files.outline, finalOutline, "after-finalize", { testFault });
  return inspectArtifacts(input.files, input.pages);
}

async function statusPages(root, episodeId) {
  const files = standardPaths(path.resolve(root), episodeId);
  const aPage = parseJson(await required(files.aPage, "a-page"), "a-page");
  const pages = Array.isArray(aPage.pages) ? aPage.pages : [];
  if (!pages.length) fail("PHASE1_PAGE_SEQUENCE", "a_page.pages", "non-empty pages", pages);
  return { files, pages };
}

export async function statusPhase1({ root = process.cwd(), episodeId }) {
  const input = await statusPages(root, episodeId);
  return inspectArtifacts(input.files, input.pages);
}

export async function resumePhase1({ root = process.cwd(), episodeId }) {
  const input = await preflightPhase1({ root, episodeId });
  return inspectArtifacts(input.files, input.pages);
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
  if (args.command === "commit-chapter") return commitChapter({ ...common, aPageId: args.aPage, script: args.script, outline: args.outline });
  if (args.command === "finalize") return finalizePhase1(common);
  if (args.command === "status") return statusPhase1(common);
  if (args.command === "resume") return resumePhase1(common);
  fail("PHASE1_INPUT_MISSING", "command", "preflight|init|commit-chapter|finalize|status|resume", args.command);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`Courseplay Phase 1 runner

Usage:
  pnpm courseplay:phase1 -- <command> --episode <episode-id> [options]

Normal path:
  init
  commit-chapter --a-page <Axxx> --script <path> --outline <path>
  finalize

Diagnostics:
  preflight
  status
  resume`);
    process.exit(0);
  }
  try {
    const result = await runPhase1(parseArgs(process.argv.slice(2)));
    const output = result.files ? { episode_id: result.files.episodeId, pages: result.pages.length, status: "preflight-passed" } : result;
    console.log(JSON.stringify(output, null, 2));
  } catch (error) {
    const detail = error.detail ?? new Phase1Error("PHASE1_TOOL_DEFECT", "tool", "registered diagnostic", error.message).detail;
    console.error(JSON.stringify(detail));
    process.exitCode = 1;
  }
}
