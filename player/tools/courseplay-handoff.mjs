import { createHash } from "node:crypto";
import { access, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

export const COURSEPLAY_HANDOFF_SCHEMA = "web-video-courseplay-chapter-handoff/v4";
export const A_PAGE_SCHEMA = "courseplay-a-page/v6";
export const VISUAL_ROUGH_SCHEMA = "courseplay-visual-rough/v4";

const ERROR_CATALOG_PATH = fileURLToPath(new URL("../docs/handoff-v4-error-catalog.json", import.meta.url));
const ERROR_CATALOG = JSON.parse(readFileSync(ERROR_CATALOG_PATH, "utf8"));
export const HANDOFF_ERROR_CATALOG = Object.fromEntries(
  ERROR_CATALOG.errors.map((item) => [item.code, [item.message, item.hint, item.contractSection]]),
);

export class HandoffContractError extends Error {
  constructor(code, pathName, expected, actual) {
    const registeredCode = HANDOFF_ERROR_CATALOG[code] ? code : "HV4_TOOL_DEFECT";
    const [message, hint, contractSection] = HANDOFF_ERROR_CATALOG[registeredCode];
    super(message);
    this.detail = { code: registeredCode, path: pathName, expected, actual: registeredCode === code ? actual : { unregistered_code: code, value: actual }, message, hint, contractSection };
  }
}

function fail(code, pathName, expected, actual) { throw new HandoffContractError(code, pathName, expected, actual); }
const sha256 = (content) => createHash("sha256").update(content).digest("hex");
const normalized = (text) => text.replace(/\s+/gu, "");
const normalizedMarkdown = (text) => text.replace(/\r\n/gu, "\n").replace(/\r/gu, "\n").replace(/^\uFEFF/u, "");
const relative = (root, file) => path.relative(root, file).split(path.sep).join("/");
async function exists(file) { try { await access(file); return true; } catch { return false; } }
async function required(file, label) { try { return await readFile(file, "utf8"); } catch { fail("HV4_INPUT_MISSING", label, file, null); } }
function json(text, label) { try { return JSON.parse(text); } catch { fail("HV4_INPUT_MISSING", label, "valid JSON", "invalid JSON"); } }

function frontmatter(text) {
  text = normalizedMarkdown(text);
  const match = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/u);
  if (!match) fail("HV4_VERSION_PAIR", "visual_rough.frontmatter", VISUAL_ROUGH_SCHEMA, "missing");
  return Object.fromEntries(match[1].split(/\r?\n/u).filter(Boolean).map((line) => {
    const index = line.search(/[:：]/u); return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
  }));
}

function sections(text, pattern) {
  const matches = [...text.matchAll(pattern)];
  return matches.map((match, index) => ({ match, markdown: text.slice(match.index, matches[index + 1]?.index ?? text.length).trim() }));
}

export function parseVisualRoughV4(text, pages) {
  text = normalizedMarkdown(text);
  const result = new Map();
  const pageSections = sections(text, /^##\s+(A\d{3})\s*(?:[｜|])\s*(.*?)\s*$/gmu);
  const expected = pages.map((page) => page.a_id); const actual = pageSections.map(({ match }) => match[1]);
  if (JSON.stringify(expected) !== JSON.stringify(actual)) fail("HV4_PAGE_SEQUENCE", "visual_rough.pages", expected, actual);
  const allUnitIds = [];
  for (const { match, markdown } of pageSections) {
    const aPageId = match[1];
    const recipeId = markdown.match(/^\s*-\s+\*\*页面配方\*\*\s*[：:]\s*`([^`]+)`\s*$/mu)?.[1];
    const mediaValue = markdown.match(/^\s*-\s+\*\*媒体需求\*\*\s*[：:]\s*`?(.+?)`?\s*$/mu)?.[1]?.replace(/`/gu, "").trim();
    const unitsBlock = markdown.match(/### 视觉内容单元\s*\r?\n([\s\S]*?)(?=### 页面骨架)/u)?.[1] ?? "";
    const contentUnits = [...unitsBlock.matchAll(/^\s*\d+\.\s+`?(U\d{3})\s*<-\s*((?:G\d{3})(?:\s*\+\s*G\d{3})*)`?\s*$/gmu)].map((item) => ({ unit_id: item[1], source_group_ids: item[2].match(/G\d{3}/gu) }));
    allUnitIds.push(...contentUnits.map((unit) => unit.unit_id));
    const skeleton = markdown.match(/### 页面骨架\s*\r?\n([\s\S]*?)(?=### 关系保真)/u)?.[1] ?? "";
    const slotBindings = [...skeleton.matchAll(/^-\s+`?([A-Za-z0-9_-]+)\s*<-\s*((?:S|U|M)\d{3}|none)`?\s*$/gmu)].map((item) => ({ slot: item[1], source_id: item[2] }));
    const relationBlock = markdown.match(/### 关系保真\s*\r?\n([\s\S]*)/u)?.[1] ?? "";
    const relationCarriers = [...relationBlock.matchAll(/^\s*-\s+`?\[(R\d{3})\]`?\s*[：:]\s*(\S.*?)\s*$/gmu)].map((item) => ({ relation_id: item[1], carrier: item[2] }));
    const mediaMatch = mediaValue?.match(/^(M\d{3})\s*\/\s*([a-z_]+)$/u);
    result.set(aPageId, { recipe_id: recipeId, content_units: contentUnits, slot_bindings: slotBindings, media: mediaMatch ? [{ media_id: mediaMatch[1], media_type: mediaMatch[2], role: markdown.match(/^\s*-\s+\*\*媒体作用\*\*\s*[：:]\s*(.+?)\s*$/mu)?.[1]?.replace(/`/gu, "") ?? null }] : [], relation_carriers: relationCarriers });
  }
  const expectedUnits = allUnitIds.map((_, index) => `U${String(index + 1).padStart(3, "0")}`);
  if (JSON.stringify(allUnitIds) !== JSON.stringify(expectedUnits)) fail("HV4_REFERENCE_UNKNOWN", "visual_rough.content_units", expectedUnits, allUnitIds);
  return result;
}

function parseScript(text, pages) {
  text = normalizedMarkdown(text);
  const found = sections(text, /^##\s+(A\d{3})\s*(?:·|｜|\|)\s+(.+?)\s*$/gmu);
  const expected = pages.map((page) => page.a_id); const actual = found.map(({ match }) => match[1]);
  if (JSON.stringify(expected) !== JSON.stringify(actual)) fail("HV4_PAGE_SEQUENCE", "script.pages", expected, actual);
  return new Map(found.map(({ match, markdown }) => {
    const body = markdown.slice(markdown.indexOf("\n") + 1).trim();
    const beats = body.split(/^\s*---\s*$/gmu).map((beat) => beat.trim()).filter(Boolean);
    const page = pages.find((candidate) => candidate.a_id === match[1]);
    if (normalized(beats.join("")) !== normalized(page.nx)) fail("HV4_NX_MISMATCH", `script.${match[1]}`, page.nx, beats.join(""));
    return [match[1], { title: match[2], beats }];
  }));
}

function parseOutline(text, pages) {
  text = normalizedMarkdown(text);
  const found = sections(text, /^##\s+(\d+)\.\s+([a-z0-9-]+)\s*(?:—|–|-)\s+(.+?)\s*[（(](\d+)\s+steps?\s+·[^\r\n（）()]*[）)]\s*$/gmu);
  const chapters = found.filter(({ match }) => Number(match[1]) > 0).map(({ match, markdown }) => {
    const aPageId = markdown.match(/^\s*\*\*A-page\s+\/\s+Chapter\*\*\s*[：:]\s*`?(A\d{3})`?/mu)?.[1];
    const rows = [...markdown.matchAll(/^\s*\|\s*(\d+)\s*\|\s*(.*?)\s*\|\s*`?([^`|\r\n]+?)`?(?:\s*[（(][^|\r\n（）()]*[）)])?\s*\|\s*(.*?)\s*\|\s*$/gmu)].map((row) => ({ index: Number(row[1]), narration_focus: row[2].trim(), scene_state: row[3].trim(), instruction: row[4].trim(), show_refs: [...row[4].matchAll(/(?<![A-Za-z0-9])([A-Z]\d{3})(?!\d)/gu)].map((ref) => ref[1]), keep_refs: [], focus_refs: [] }));
    if (Number(match[4]) !== rows.length) fail("HV4_BEAT_STEP_MISMATCH", `outline.${aPageId ?? match[2]}`, "header step count equals table rows", { header: Number(match[4]), rows: rows.length });
    return { index: Number(match[1]), id: match[2], title: match[3].trim(), stepCount: Number(match[4]), aPageId, markdown, steps: rows };
  });
  const expected = pages.map((page) => page.a_id); const actual = chapters.map((chapter) => chapter.aPageId);
  if (JSON.stringify(expected) !== JSON.stringify(actual)) fail("HV4_PAGE_SEQUENCE", "outline.pages", expected, actual);
  const materials = new Map(); const materialStart = text.search(/^##\s+素材清单\s*$/mu);
  if (materialStart >= 0) for (const item of sections(text.slice(materialStart), /^###\s+(A\d{3})\s*$/gmu)) materials.set(item.match[1], item.markdown);
  return { chapters, materials };
}

export function assertBeatStepContract({ aPageId, beats, steps }) {
  const counts = { script_beats: beats.length, outline_steps: steps.length };
  if (new Set(Object.values(counts)).size !== 1 || steps.some((step, index) => step.index !== index + 1)) fail("HV4_BEAT_STEP_MISMATCH", aPageId, "equal counts and continuous steps", counts);
}

export async function buildCourseplayHandoffV4Packet({ root = process.cwd(), episodeId, aPageId, files, projectText, aPageText, visualRoughText, scriptText, outlineText }) {
  const project = json(projectText, "project.json"); const aPage = json(aPageText, "A-page"); const roughMeta = frontmatter(visualRoughText);
  if (project.id !== episodeId) fail("HV4_SOURCE_INTEGRITY", "project.id", episodeId, project.id);
  if (aPage.schema_version !== A_PAGE_SCHEMA || roughMeta.schema_version !== VISUAL_ROUGH_SCHEMA) fail("HV4_VERSION_PAIR", "schema_version", [A_PAGE_SCHEMA, VISUAL_ROUGH_SCHEMA], [aPage.schema_version, roughMeta.schema_version]);
  if (aPage.episode_id !== episodeId || roughMeta.episode_id !== episodeId || roughMeta.source_a_page !== `${episodeId}-a-page.json` || roughMeta.source_a_page_sha256?.toLowerCase() !== sha256(aPageText)) fail("HV4_SOURCE_INTEGRITY", "sources", { episodeId, aPageSha256: sha256(aPageText) }, roughMeta);
  const page = aPage.pages?.find((candidate) => candidate.a_id === aPageId); if (!page) fail("HV4_PAGE_SEQUENCE", "a_page_id", aPage.pages?.map((p) => p.a_id), aPageId);
  const scripts = parseScript(scriptText, aPage.pages); const outline = parseOutline(outlineText, aPage.pages); const roughs = parseVisualRoughV4(visualRoughText, aPage.pages);
  const chapter = outline.chapters.find((item) => item.aPageId === aPageId); const script = scripts.get(aPageId); const rough = roughs.get(aPageId);
  if (!chapter || !script || !rough) fail("HV4_PAGE_SEQUENCE", aPageId, "script, outline, and rough section", "missing section");
  assertBeatStepContract({ aPageId, beats: script.beats, steps: chapter.steps });
  if (rough.media.length && !outline.materials.has(aPageId)) fail("HV4_MEDIA_MATERIAL", `outline.materials.${aPageId}`, "material section", null);
  const knownRefs = new Set([page.screen?.title?.screen_item_id, ...(page.screen?.groups ?? []).flatMap((g) => (g.items ?? []).map((i) => i.screen_item_id)), ...(page.protected_relations ?? []).map((r) => r.relation_id), ...rough.content_units.map((u) => u.unit_id), ...rough.media.map((m) => m.media_id)].filter(Boolean));
  for (const step of chapter.steps) for (const ref of step.show_refs) if (!knownRefs.has(ref)) fail("HV4_REFERENCE_UNKNOWN", `${aPageId}.steps[${step.index}]`, [...knownRefs], ref);
  const expectedRelations = (page.protected_relations ?? []).map((r) => r.relation_id); const actualRelations = rough.relation_carriers.map((r) => r.relation_id);
  if (JSON.stringify([...expectedRelations].sort()) !== JSON.stringify([...actualRelations].sort()) || new Set(actualRelations).size !== actualRelations.length) fail("HV4_RELATION_CARRIER", `${aPageId}.presentation.relation_carriers`, expectedRelations, actualRelations);
  return { packet: { schema_version: COURSEPLAY_HANDOFF_SCHEMA, episode_id: episodeId, chapter: { index: chapter.index, id: chapter.id, title: chapter.title, a_page_id: aPageId, step_count: chapter.stepCount }, narration: { authority: "a_page.nx", beats: script.beats }, screen_guidance: page.screen, presentation: rough, steps: chapter.steps, protected_relations: page.protected_relations ?? [], silent_constraints: page.silent_constraints ?? [], materials_markdown: outline.materials.get(aPageId) ?? null, runtime_contract: "script beat = outline step", sources: { project: { path: relative(root, files.project), sha256: sha256(projectText) }, a_page: { path: relative(root, files.aPage), sha256: sha256(aPageText) }, visual_rough: { path: relative(root, files.visualRough), sha256: sha256(visualRoughText) }, outline: { path: relative(root, files.outline), sha256: sha256(outlineText) }, script: { path: relative(root, files.script), sha256: sha256(scriptText) } } }, episodeDir: files.episodeDir };
}

async function standardInputs(root, episodeId) {
  const episodeDir = path.join(root, "episodes", episodeId); const inputs = path.join(episodeDir, "inputs");
  const files = { episodeDir, project: path.join(episodeDir, "project.json"), aPage: path.join(inputs, `${episodeId}-a-page.json`), visualRough: path.join(inputs, `${episodeId}-visual-rough.md`), script: path.join(episodeDir, "script.md"), outline: path.join(episodeDir, "outline.md") };
  for (const [label, file] of Object.entries(files)) if (label !== "episodeDir" && !(await exists(file))) fail("HV4_INPUT_MISSING", label, file, null);
  return files;
}

export async function buildCourseplayHandoffPacket({ root = path.resolve(process.env.PLAYER_ROOT ?? process.cwd()), episodeId, aPageId }) {
  aPageId = aPageId?.toUpperCase(); const files = await standardInputs(root, episodeId);
  const [projectText, aPageText, visualRoughText, scriptText, outlineText] = await Promise.all([required(files.project, "project"), required(files.aPage, "a-page"), required(files.visualRough, "visual-rough"), required(files.script, "script"), required(files.outline, "outline")]);
  return buildCourseplayHandoffV4Packet({ root, episodeId, aPageId, files, projectText, aPageText, visualRoughText, scriptText, outlineText });
}

export async function generateCourseplayHandoff({ root = path.resolve(process.env.PLAYER_ROOT ?? process.cwd()), episodeId, aPageId, check = false }) {
  aPageId = aPageId.toUpperCase(); const { packet, episodeDir } = await buildCourseplayHandoffPacket({ root, episodeId, aPageId }); const content = `${JSON.stringify(packet, null, 2)}\n`; const output = path.join(episodeDir, ".handoffs", `${aPageId}.json`);
  if (check) { const current = await required(output, "handoff"); if (current !== content) fail("HV4_SOURCE_INTEGRITY", relative(root, output), "current deterministic packet", "stale packet"); return { output, bytes: Buffer.byteLength(current), checked: true }; }
  await mkdir(path.dirname(output), { recursive: true }); const temp = path.join(path.dirname(output), `.${aPageId}.${process.pid}.tmp`);
  try { await writeFile(temp, content); await rename(temp, output); } finally { await rm(temp, { force: true }).catch(() => {}); }
  return { output, bytes: Buffer.byteLength(content), checked: false };
}

function args(argv) { const out = { episodeId: null, aPageId: null, check: false }; for (let i = 0; i < argv.length; i += 1) { if (argv[i] === "--check") out.check = true; else if (argv[i] === "--episode") out.episodeId = argv[++i]; else if (argv[i] === "--a-page") out.aPageId = argv[++i]; } if (!out.episodeId || !out.aPageId) fail("HV4_INPUT_MISSING", "arguments", "--episode and --a-page", argv); return out; }
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) try { const result = await generateCourseplayHandoff(args(process.argv.slice(2))); console.log(`${result.checked ? "checked" : "generated"} ${relative(process.cwd(), result.output)} (${result.bytes} bytes)`); } catch (error) {
  const detail = error.detail ?? new HandoffContractError("HV4_TOOL_DEFECT", "tool", "registered diagnostic", error.message).detail;
  console.error(JSON.stringify(detail));
  process.exitCode = 1;
}
