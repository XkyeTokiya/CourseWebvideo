import { createHash } from "node:crypto";
import { access, mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const PACKET_SCHEMA = "web-video-courseplay-chapter-handoff/v1";
const PACKET_SCHEMA_V2 = "web-video-courseplay-chapter-handoff/v2";
const PACKET_SCHEMA_V3 = "web-video-courseplay-chapter-handoff/v3";
const A_PAGE_SCHEMA = "courseplay-a-page/v4";
const A_PAGE_SCHEMA_V5 = "courseplay-a-page/v5";
const A_PAGE_SCHEMA_V6 = "courseplay-a-page/v6";
const VISUAL_ROUGH_SCHEMA = "courseplay-visual-rough/v1";
const VISUAL_ROUGH_SCHEMA_V2 = "courseplay-visual-rough/v2";
const VISUAL_ROUGH_SCHEMA_V3 = "courseplay-visual-rough/v3";

export const COURSEPLAY_HANDOFF_V2_SCHEMA = PACKET_SCHEMA_V2;
export const COURSEPLAY_HANDOFF_V3_SCHEMA = PACKET_SCHEMA_V3;

function fail(message) {
  throw new Error(message);
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

function normalizeSpoken(text) {
  return text.replace(/\s+/gu, "");
}

function relative(root, file) {
  return path.relative(root, file).split(path.sep).join("/");
}

async function readRequired(file, label) {
  try {
    return await readFile(file, "utf8");
  } catch {
    fail(`${label} 不存在或无法读取：${file}`);
  }
}

function parseJson(source, label) {
  try {
    return JSON.parse(source);
  } catch {
    fail(`${label} 不是有效 JSON`);
  }
}

function parseFrontmatter(source, label) {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  if (!match) fail(`${label} 缺少 YAML frontmatter`);
  const values = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([a-zA-Z0-9_-]+):\s*(.*?)\s*$/);
    if (field) values[field[1]] = field[2].replace(/^['"]|['"]$/g, "");
  }
  return values;
}

function collectSections(source, pattern) {
  const matches = [...source.matchAll(pattern)];
  return matches.map((match, index) => ({
    match,
    markdown: source.slice(match.index, matches[index + 1]?.index ?? source.length).trim(),
  }));
}

function parseScript(source, pages) {
  const secondaryHeadings = [...source.matchAll(/^##\s+(.+?)\s*$/gmu)];
  const invalidHeading = secondaryHeadings.find(
    (heading) => !/^A\d{3}\s+·\s+\S/u.test(heading[1]),
  );
  if (invalidHeading) fail(`script.md 包含非标准二级标题：${invalidHeading[1]}`);
  const sections = collectSections(
    source,
    /^##\s+(A\d{3})\s+·\s+(.+?)\s*$/gmu,
  );
  if (!sections.length) {
    fail("script.md 必须使用 `## Axxx · 标题` 标准章节格式");
  }
  const expectedIds = pages.map((page) => page.a_id);
  const actualIds = sections.map(({ match }) => match[1]);
  if (new Set(actualIds).size !== actualIds.length) fail("script.md 包含重复 A-page 标题");
  if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) {
    fail(`script.md A-page 标题必须与 pages[] 同序且完整：期望 ${expectedIds.join(", ")}，实际 ${actualIds.join(", ")}`);
  }

  const result = new Map();
  for (let index = 0; index < sections.length; index += 1) {
    const { match, markdown } = sections[index];
    const headingEnd = markdown.indexOf("\n");
    const body = headingEnd >= 0 ? markdown.slice(headingEnd + 1).trim() : "";
    const beats = body.split(/^\s*---\s*$/gmu).map((beat) => beat.trim()).filter(Boolean);
    if (!beats.length) fail(`script.md ${match[1]} 没有 narration Beat`);
    if (beats.some((beat) => /^##\s+/mu.test(beat))) fail(`script.md ${match[1]} 含有无法识别的二级标题`);
    const page = pages[index];
    if (normalizeSpoken(beats.join("")) !== normalizeSpoken(page.nx)) {
      fail(`script.md ${match[1]} 的 Beat 拼接与 pages[].nx 不一致`);
    }
    result.set(match[1], { title: match[2].trim(), beats });
  }
  return result;
}

function parseOutline(source, pages) {
  // Markdown is frequently authored with Chinese full-width punctuation. Keep
  // the structural contract strict, but do not make a harmless typography
  // choice (ASCII vs full-width parentheses) block a handoff.
  const chapterPattern = /^##\s+(\d+)\.\s+([a-z0-9-]+)\s+—\s+(.+?)[（(](\d+)\s+steps\s+·[^\r\n（）()]*[）)]\s*$/gmu;
  const sections = collectSections(source, chapterPattern);
  const chapters = sections.filter(({ match }) => Number(match[1]) > 0).map(({ match, markdown }) => {
    const headingEnd = markdown.indexOf("\n");
    const body = markdown.slice(headingEnd + 1);
    const nextSecondaryHeading = body.search(/^##\s+/mu);
    const chapterMarkdown = nextSecondaryHeading >= 0
      ? markdown.slice(0, headingEnd + 1 + nextSecondaryHeading).trim()
      : markdown;
    // Keep the A-page id as the only semantic value from this line. Existing
    // outlines may put a human note such as `（callback：A001）` after it;
    // that note must not turn a valid mapping into a "missing mapping" error.
    const mappings = [...chapterMarkdown.matchAll(/^\*\*A-page\s+\/\s+Chapter\*\*\s*[:：]\s*`(A\d{3})`(?:\s*[（(][^\r\n（）()]*[）)])?\s*$/gmu)];
    if (mappings.length !== 1) fail(`outline 章节 ${match[2]} 必须包含唯一 A-page / Chapter 映射`);
    return {
      index: Number(match[1]),
      id: match[2],
      title: match[3].trim(),
      stepCount: Number(match[4]),
      aPageId: mappings[0][1],
      markdown: chapterMarkdown,
    };
  });
  const expectedIds = pages.map((page) => page.a_id);
  const actualIds = chapters.map((chapter) => chapter.aPageId);
  if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) {
    fail(`outline A-page 映射必须与 pages[] 同序且完整：期望 ${expectedIds.join(", ")}，实际 ${actualIds.join(", ")}`);
  }
  if (new Set(chapters.map((chapter) => chapter.id)).size !== chapters.length) fail("outline 包含重复 chapter id");

  const scheduleStart = source.search(/^##\s+整集视觉调度\s*$/mu);
  if (scheduleStart < 0) fail("outline 缺少整集视觉调度表");
  const afterScheduleHeading = source.indexOf("\n", scheduleStart);
  const scheduleEndMatch = source.slice(afterScheduleHeading + 1).match(/^##\s+/mu);
  const scheduleEnd = scheduleEndMatch ? afterScheduleHeading + 1 + scheduleEndMatch.index : source.length;
  const scheduleBlock = source.slice(afterScheduleHeading + 1, scheduleEnd);
  const scheduleRows = scheduleBlock.split(/\r?\n/).filter((line) => /^\|\s*A\d{3}\s*\|/u.test(line));
  const scheduleIds = scheduleRows.map((row) => row.match(/^\|\s*(A\d{3})\s*\|/u)?.[1]);
  if (JSON.stringify(scheduleIds) !== JSON.stringify(expectedIds)) {
    fail(`整集视觉调度表必须与 pages[] 同序且完整：期望 ${expectedIds.join(", ")}，实际 ${scheduleIds.join(", ")}`);
  }

  const materialMap = new Map();
  const materialsStart = source.search(/^##\s+素材清单\s*$/mu);
  if (materialsStart >= 0) {
    const materialSource = source.slice(materialsStart);
    for (const { match, markdown } of collectSections(materialSource, /^###\s+(A\d{3})\s*$/gmu)) {
      if (materialMap.has(match[1])) fail(`素材清单包含重复章节：${match[1]}`);
      materialMap.set(match[1], markdown);
    }
  }

  return { chapters, scheduleRows, materialMap };
}

function parseVisualRough(source, pages) {
  const sections = collectSections(source, /^##\s+(A\d{3})[｜|]\s*(.*?)\s*$/gmu);
  const expectedIds = pages.map((page) => page.a_id);
  const actualIds = sections.map(({ match }) => match[1]);
  if (new Set(actualIds).size !== actualIds.length) fail("visual rough 包含重复 A-page 页面");
  if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) {
    fail(`visual rough 页面必须与 pages[] 同序且完整：期望 ${expectedIds.join(", ")}，实际 ${actualIds.join(", ")}`);
  }
  return new Map(sections.map(({ match, markdown }) => [match[1], markdown]));
}

function extractStableRefs(value) {
  return [...new Set((value.match(/(?<![A-Za-z0-9])[SGMR]\d{3}(?!\d)/gu) ?? []))];
}

function parseSlotBindings(markdown, aPageId) {
  const skeleton = markdown.match(/### 页面骨架\s*\r?\n([\s\S]*?)(?=### 关系保真|$)/u)?.[1] ?? "";
  const lines = skeleton.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  const bindings = [];
  for (const line of lines) {
    const match = line.match(/^-\s+`?([A-Za-z0-9_-]+)`?\s*<-\s*`?((?:S|G|M)\d{3}|none)`?\s*$/u);
    if (!match) fail(`visual rough ${aPageId} 的页面骨架必须使用 slot <- S/G/M/none：${line}`);
    bindings.push({ slot: match[1], source_id: match[2] });
  }
  if (!bindings.length) fail(`visual rough ${aPageId} 的页面骨架不能为空`);
  return bindings;
}

export function parseVisualRoughV2(source, pages) {
  const sections = collectSections(source, /^##\s+(A\d{3})[｜|]\s*(.*?)\s*$/gmu);
  const expectedIds = pages.map((page) => page.a_id);
  const actualIds = sections.map(({ match }) => match[1]);
  if (new Set(actualIds).size !== actualIds.length) fail("visual rough v2 包含重复 A-page 页面");
  if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) {
    fail(`visual rough v2 页面必须与 pages[] 同序且完整：期望 ${expectedIds.join(", ")}，实际 ${actualIds.join(", ")}`);
  }
  const result = new Map();
  for (const { match, markdown } of sections) {
    const groupSection = markdown.match(/### 上屏内容组\s*\r?\n([\s\S]*?)(?=### 页面骨架|$)/u)?.[1] ?? "";
    const groupIds = [...groupSection.matchAll(/^\s*\d+\.\s+`?(G\d{3})`?\s*$/gmu)].map((item) => item[1]);
    if (!groupIds.length) fail(`visual rough v2 ${match[1]} 缺少 G 组绑定`);
    const headline = markdown.match(/^-\s+\*\*论点标题\*\*：\s*`?(S\d{3})`?\s*$/mu)?.[1] ?? null;
    if (!headline) fail(`visual rough v2 ${match[1]} 缺少 S 标题绑定`);
    const auxiliary = markdown.match(/^-\s+\*\*辅助句\*\*：\s*`?([^`\r\n]+?)`?\s*$/mu)?.[1]?.trim() ?? "none";
    const recipeId = markdown.match(/^-\s+\*\*页面配方\*\*：\s*`([^`]+)`\s*$/mu)?.[1] ?? null;
    if (!recipeId) fail(`visual rough v2 ${match[1]} 缺少页面配方`);
    const mediaRequirementValue = mediaRequirement(markdown, match[1]);
    const mediaRole = markdown.match(/^-\s+\*\*媒体作用\*\*：\s*(.+?)\s*$/mu)?.[1]?.replace(/`/g, "").trim() ?? "none";
    const media = mediaRequirementValue.toLowerCase() === "none"
      ? []
      : (() => {
        const mediaMatch = mediaRequirementValue.match(/^(M\d{3})\s*\/\s*([a-z_]+)$/u);
        if (!mediaMatch) fail(`visual rough v2 ${match[1]} 媒体需求格式无效`);
        return [{ media_id: mediaMatch[1], media_type: mediaMatch[2] }];
      })();
    const sourcePage = pages.find((page) => page.a_id === match[1]);
    const sourceScreen = sourcePage?.screen ?? {};
    const sourceTitleId = sourceScreen.title?.screen_item_id;
    const sourceGroupIds = Array.isArray(sourceScreen.groups)
      ? sourceScreen.groups.map((group) => group.group_id)
      : [];
    if (headline !== sourceTitleId) fail(`visual rough v2 ${match[1]} 标题槽必须绑定 ${sourceTitleId}`);
    if (JSON.stringify(groupIds) !== JSON.stringify(sourceGroupIds)) fail(`visual rough v2 ${match[1]} G 组绑定必须与 A-page 一致`);
    const sourceItems = [
      sourceScreen.title,
      ...(Array.isArray(sourceScreen.groups) ? sourceScreen.groups.flatMap((group) => group.items ?? []) : []),
    ];
    for (const item of sourceItems) {
      if (typeof item?.source_text === "string" && markdown.includes(item.source_text)) {
        fail(`visual rough v2 ${match[1]} 不得复制 screen source_text：${item.screen_item_id}`);
      }
    }
    if (auxiliary !== "none" && !sourceItems.some((item) => item?.screen_item_id === auxiliary)) {
      fail(`visual rough v2 ${match[1]} 辅助句必须绑定已知 S ID 或 none`);
    }
    const relationBlock = markdown.match(/### 关系保真\s*\r?\n([\s\S]*?)(?=^##\s+|$)/mu)?.[1] ?? "";
    const relationCarriers = [...relationBlock.matchAll(/^\s*-\s+`?\[(R\d{3})\]`?：\s*(.+?)\s*$/gmu)]
      .map((item) => ({ relation_id: item[1], carrier: item[2].trim() }));
    if (!relationCarriers.length && !/\bnone\b/u.test(relationBlock)) fail(`visual rough v2 ${match[1]} 缺少关系载体`);
    const allowedSlotIds = new Set([sourceTitleId, ...sourceGroupIds, ...media.map((item) => item.media_id)]);
    for (const binding of parseSlotBindings(markdown, match[1])) {
      if (binding.source_id !== "none" && !allowedSlotIds.has(binding.source_id)) {
        fail(`visual rough v2 ${match[1]} 槽位绑定未知来源：${binding.source_id}`);
      }
    }
    result.set(match[1], {
      markdown,
      recipe_id: recipeId,
      title_id: headline,
      auxiliary_id: auxiliary,
      group_ids: groupIds,
      slot_bindings: parseSlotBindings(markdown, match[1]),
      media,
      media_role: mediaRole,
      relation_carriers: relationCarriers,
    });
  }
  return result;
}

export function parseVisualRoughV3(source, pages) {
  const projectedPages = pages.map((page) => {
    const projected = structuredClone(page);
    const screen = projected.screen ?? {};
    const items = [
      screen.title,
      ...(Array.isArray(screen.groups) ? screen.groups.flatMap((group) => group.items ?? []) : []),
    ];
    for (const item of items) {
      if (!item || typeof item !== "object") continue;
      item.source_text = item.guidance_text;
      item.edit_policy = item.usage_policy === "exact" ? "exact" : "adaptable";
      delete item.guidance_text;
      delete item.usage_policy;
    }
    return projected;
  });
  const result = parseVisualRoughV2(source, projectedPages);
  for (const page of pages) {
    const rough = result.get(page.a_id);
    if (!rough) fail(`visual rough v3 不存在 A-page：${page.a_id}`);
    rough.relation_carriers = [...rough.markdown.matchAll(
      /^[ \t]*-[ \t]+`?\[(R\d{3})\]`?：[ \t]*(\S.*?)\s*$/gmu,
    )].map((item) => ({ relation_id: item[1], carrier: item[2].trim() }));
    const sourceGroups = Array.isArray(page.screen?.groups) ? page.screen.groups : [];
    const sourceGroupIds = sourceGroups.map((group) => group.group_id);
    const sourceItems = [
      page.screen?.title,
      ...sourceGroups.flatMap((group) => group.items ?? []),
    ];
    const allowedIds = new Set([
      ...sourceItems.map((item) => item?.screen_item_id).filter(Boolean),
      ...sourceGroupIds,
      ...rough.media.map((item) => item.media_id),
    ]);
    const boundIds = new Set(rough.slot_bindings.map((binding) => binding.source_id));
    for (const groupId of sourceGroupIds) {
      if (!boundIds.has(groupId)) fail(`visual rough v3 ${page.a_id} 未在页面骨架考虑 G：${groupId}`);
    }
    for (const media of rough.media) {
      if (!boundIds.has(media.media_id)) fail(`visual rough v3 ${page.a_id} 缺少媒体槽位：${media.media_id}`);
    }
    for (const binding of rough.slot_bindings) {
      if (binding.source_id !== "none" && !allowedIds.has(binding.source_id)) {
        fail(`visual rough v3 ${page.a_id} 槽位绑定未知来源：${binding.source_id}`);
      }
    }
    const expectedRelations = (Array.isArray(page.protected_relations) ? page.protected_relations : [])
      .map((relation) => relation.relation_id);
    const actualRelations = rough.relation_carriers.map((relation) => relation.relation_id);
    const duplicateRelation = actualRelations.find(
      (relationId, index) => actualRelations.indexOf(relationId) !== index,
    );
    if (duplicateRelation) {
      fail(`visual rough v3 ${page.a_id} 关系载体重复：${duplicateRelation}`);
    }
    const expectedRelationSet = new Set(expectedRelations);
    const actualRelationSet = new Set(actualRelations);
    if (
      expectedRelationSet.size !== actualRelationSet.size
      || [...expectedRelationSet].some((relationId) => !actualRelationSet.has(relationId))
    ) {
      fail(`visual rough v3 ${page.a_id} 关系载体必须与 protected_relations 完整一致`);
    }
  }
  return result;
}

function parseExplicitRefs(instruction, key) {
  const match = instruction.match(new RegExp(`${key}\\s*[:=]\\s*([^;]+)`, "iu"));
  return match ? extractStableRefs(match[1]) : null;
}

export function parseOutlineV2(chapter) {
  // Accept both `(~10s)` and `（~10s）`. The duration is display metadata;
  // the step identity remains the numbered row and the semantic state cell.
  const rows = [...chapter.markdown.matchAll(/^\|\s*(\d+)\s*\|\s*(.*?)\s*\|\s*`([^`]+)`(?:\s*[（(][^|\r\n（）()]*[）)])?\s*\|\s*(.*?)\s*\|\s*$/gmu)];
  if (rows.length !== chapter.stepCount) fail(`outline ${chapter.aPageId} 的结构化 step 数量不匹配：期望 ${chapter.stepCount}，实际 ${rows.length}`);
  return rows.map((row) => {
    const instruction = row[4].trim();
    const sceneState = row[3].trim();
    const refs = extractStableRefs(instruction);
    const showRefs = parseExplicitRefs(instruction, "show") ?? (/建立|补齐|出现|切换|展示|呈现/u.test(instruction) ? refs : []);
    const keepRefs = parseExplicitRefs(instruction, "keep") ?? (/保持|持续|恒定/u.test(instruction) ? refs : []);
    const focusRefs = parseExplicitRefs(instruction, "focus") ?? (/聚焦|焦点|收束|回扣/u.test(instruction) ? refs : []);
    return {
      index: Number(row[1]),
      narration_focus: row[2].trim(),
      scene_state: sceneState,
      show_refs: showRefs,
      keep_refs: keepRefs,
      focus_refs: focusRefs,
      instruction,
    };
  });
}

function mediaRequirement(markdown, aPageId) {
  const match = markdown.match(/^-\s+\*\*媒体需求\*\*：\s*(.+?)\s*$/mu);
  if (!match) fail(`visual rough ${aPageId} 缺少媒体需求字段`);
  return match[1].replace(/`/g, "").trim();
}

async function standardInputs(root, episodeId) {
  if (!/^episode-[a-z0-9-]+$/u.test(episodeId)) fail(`episode id 不合法：${episodeId}`);
  const episodeDir = path.join(root, "episodes", episodeId);
  const inputsDir = path.join(episodeDir, "inputs");
  const expected = {
    project: path.join(episodeDir, "project.json"),
    aPage: path.join(inputsDir, `${episodeId}-a-page.json`),
    visualRough: path.join(inputsDir, `${episodeId}-visual-rough.md`),
    script: path.join(episodeDir, "script.md"),
    outline: path.join(episodeDir, "outline.md"),
  };
  if (await exists(path.join(inputsDir, "approved-spoken-text.txt"))) {
    expected.approved = path.join(inputsDir, "approved-spoken-text.txt");
  }
  const inputEntries = await readdir(inputsDir, { withFileTypes: true }).catch(() => []);
  const missing = [];
  for (const [label, file] of Object.entries(expected)) {
    if (!(await exists(file))) missing.push(`${label}: ${relative(root, file)}`);
  }
  if (missing.length) {
    fail(`缺少标准 Courseplay 输入：${missing.join("；")}`);
  }
  return { episodeDir, ...expected };
}

function compactScreenSource(page, aPageId) {
  if (!page.screen || typeof page.screen !== "object") fail(`${aPageId} v5 screen 必须是对象`);
  if (!page.screen.title || !Array.isArray(page.screen.groups) || !page.screen.groups.length) {
    fail(`${aPageId} v5 screen 必须包含 title 和非空 groups`);
  }
  return {
    title: page.screen.title,
    groups: page.screen.groups,
    protected_relations: Array.isArray(page.protected_relations) ? page.protected_relations : [],
  };
}

function compactScreenGuidance(page, aPageId) {
  if (!page.screen || typeof page.screen !== "object") fail(`${aPageId} v6 screen 必须是对象`);
  if (!page.screen.title || !Array.isArray(page.screen.groups) || !page.screen.groups.length) {
    fail(`${aPageId} v6 screen 必须包含 title 和非空 groups`);
  }
  const items = [page.screen.title, ...page.screen.groups.flatMap((group) => group.items ?? [])];
  for (const item of items) {
    if (typeof item?.guidance_text !== "string" || !item.guidance_text.trim()) {
      fail(`${aPageId} screen guidance item 缺少 guidance_text`);
    }
    if (!["reference", "exact"].includes(item.usage_policy)) {
      fail(`${aPageId} screen guidance item usage_policy 必须是 reference 或 exact`);
    }
  }
  return { title: page.screen.title, groups: page.screen.groups };
}

function assertV3Steps({ steps, page, rough, aPageId }) {
  const groups = Array.isArray(page.screen?.groups) ? page.screen.groups : [];
  const knownRefs = new Set([
    page.screen?.title?.screen_item_id,
    ...groups.map((group) => group.group_id),
    ...groups.flatMap((group) => (group.items ?? []).map((item) => item.screen_item_id)),
    ...(Array.isArray(page.protected_relations) ? page.protected_relations : [])
      .map((relation) => relation.relation_id),
    ...rough.media.map((item) => item.media_id),
  ].filter(Boolean));
  const actualIndexes = steps.map((step) => step.index);
  const expectedIndexes = steps.map((_, index) => index + 1);
  if (JSON.stringify(actualIndexes) !== JSON.stringify(expectedIndexes)) {
    fail(`${aPageId} steps.index 必须从 1 连续编号`);
  }
  for (const step of steps) {
    for (const ref of [...step.show_refs, ...step.keep_refs, ...step.focus_refs]) {
      if (!knownRefs.has(ref)) fail(`${aPageId} step ${step.index} 引用未知对象：${ref}`);
    }
  }
}

function assertScreenSourceSingleOccurrence(packet) {
  const serialized = JSON.stringify(packet);
  const sourceItems = [
    packet.screen_source?.title,
    ...(packet.screen_source?.groups ?? []).flatMap((group) => group.items ?? []),
  ];
  for (const item of sourceItems) {
    if (typeof item?.source_text !== "string" || !item.source_text.trim()) fail("screen source item 缺少 source_text");
    if (serialized.split(item.source_text).length - 1 !== 1) {
      fail(`screen source_text 必须在 compact handoff 中恰好出现一次：${item.screen_item_id}`);
    }
  }
}

export async function buildCourseplayHandoffV2Packet({
  root = process.cwd(),
  episodeId,
  aPageId,
  files,
  projectText,
  aPageText,
  visualRoughText,
  scriptText,
  outlineText,
}) {
  const project = parseJson(projectText, "project.json");
  const aPageDoc = parseJson(aPageText, "A-page");
  const roughFrontmatter = parseFrontmatter(visualRoughText, "visual rough");
  if (project.id !== episodeId) fail(`project.id 与 episode 目录不一致：${project.id}`);
  if (aPageDoc.schema_version !== A_PAGE_SCHEMA_V5) fail(`A-page schema 必须是 ${A_PAGE_SCHEMA_V5}`);
  if (aPageDoc.episode_id !== episodeId) fail(`A-page episode_id 与目录不一致：${aPageDoc.episode_id}`);
  if (!Array.isArray(aPageDoc.pages) || !aPageDoc.pages.length) fail("A-page pages[] 不能为空");
  const pageIds = aPageDoc.pages.map((page) => page.a_id);
  if (new Set(pageIds).size !== pageIds.length) fail("A-page pages[] 包含重复 a_id");
  const page = aPageDoc.pages.find((candidate) => candidate.a_id === aPageId);
  if (!page) fail(`A-page 不存在：${aPageId}`);
  if (roughFrontmatter.schema_version !== VISUAL_ROUGH_SCHEMA_V2) fail(`visual rough schema 必须是 ${VISUAL_ROUGH_SCHEMA_V2}`);
  if (roughFrontmatter.episode_id !== episodeId) fail(`visual rough episode_id 与目录不一致：${roughFrontmatter.episode_id}`);
  if (roughFrontmatter.source_a_page !== `${episodeId}-a-page.json`) fail("visual rough source_a_page 必须指向标准 inputs A-page 文件名");
  if (roughFrontmatter.source_a_page_sha256?.toLowerCase() !== sha256(aPageText)) fail("visual rough source_a_page_sha256 与 A-page 文件不一致");

  const scripts = parseScript(scriptText, aPageDoc.pages);
  const outline = parseOutline(outlineText, aPageDoc.pages);
  const roughPages = parseVisualRoughV2(visualRoughText, aPageDoc.pages);
  const chapterIndex = outline.chapters.findIndex((chapter) => chapter.aPageId === aPageId);
  if (chapterIndex < 0) fail(`outline 不存在 A-page：${aPageId}`);
  const chapter = outline.chapters[chapterIndex];
  const script = scripts.get(aPageId);
  const steps = parseOutlineV2(chapter);
  if (script.beats.length !== chapter.stepCount) {
    fail(`${aPageId} Beat 数 ${script.beats.length} 与 outline step 数 ${chapter.stepCount} 不一致`);
  }
  if (steps.length !== script.beats.length) fail(`${aPageId} 结构化 steps 必须与 narration beats 一一对应`);
  const rough = roughPages.get(aPageId);
  const materialsMarkdown = outline.materialMap.get(aPageId) ?? null;
  if (rough.media.length && !materialsMarkdown) fail(`${aPageId} visual rough 要求媒体，但 outline 素材清单缺少对应章节`);
  const screenSource = compactScreenSource(page, aPageId);
  const packet = {
    schema_version: PACKET_SCHEMA_V2,
    episode_id: episodeId,
    ...(typeof aPageDoc.fixture_status === "string" ? { fixture_status: aPageDoc.fixture_status } : {}),
    chapter: {
      index: chapter.index,
      id: chapter.id,
      title: chapter.title,
      a_page_id: aPageId,
      step_count: chapter.stepCount,
    },
    narration: {
      authority: aPageDoc.document_kind === "candidate" || aPageDoc.fixture_status ? "candidate_a_page.nx" : "a_page.nx",
      beats: script.beats,
    },
    screen_source: screenSource,
    presentation: {
      recipe_id: rough.recipe_id,
      slot_bindings: rough.slot_bindings.map(({ slot, source_id }) => `${slot} <- ${source_id}`),
      media: rough.media.map((item) => ({ ...item, role: rough.media_role ?? null })),
      relation_carriers: rough.relation_carriers,
    },
    steps,
    silent_constraints: Array.isArray(page.silent_constraints) ? page.silent_constraints : [],
    materials_markdown: materialsMarkdown,
    sources: {
      a_page: { path: relative(root, files.aPage), sha256: sha256(aPageText) },
      visual_rough: { path: relative(root, files.visualRough), sha256: sha256(visualRoughText) },
      outline: { path: relative(root, files.outline), sha256: sha256(outlineText) },
    },
  };
  assertScreenSourceSingleOccurrence(packet);
  return { packet, episodeDir: files.episodeDir };
}

export async function buildCourseplayHandoffV3Packet({
  root = process.cwd(),
  episodeId,
  aPageId,
  files,
  projectText,
  aPageText,
  visualRoughText,
  scriptText,
  outlineText,
}) {
  const project = parseJson(projectText, "project.json");
  const aPageDoc = parseJson(aPageText, "A-page");
  const roughFrontmatter = parseFrontmatter(visualRoughText, "visual rough");
  if (project.id !== episodeId) fail(`project.id 与 episode 目录不一致：${project.id}`);
  if (aPageDoc.schema_version !== A_PAGE_SCHEMA_V6) fail(`A-page schema 必须是 ${A_PAGE_SCHEMA_V6}`);
  if (aPageDoc.episode_id !== episodeId) fail(`A-page episode_id 与目录不一致：${aPageDoc.episode_id}`);
  if (!Array.isArray(aPageDoc.pages) || !aPageDoc.pages.length) fail("A-page pages[] 不能为空");
  const pageIds = aPageDoc.pages.map((page) => page.a_id);
  if (new Set(pageIds).size !== pageIds.length) fail("A-page pages[] 包含重复 a_id");
  const page = aPageDoc.pages.find((candidate) => candidate.a_id === aPageId);
  if (!page) fail(`A-page 不存在：${aPageId}`);
  if (roughFrontmatter.schema_version !== VISUAL_ROUGH_SCHEMA_V3) fail(`visual rough schema 必须是 ${VISUAL_ROUGH_SCHEMA_V3}`);
  if (roughFrontmatter.episode_id !== episodeId) fail(`visual rough episode_id 与目录不一致：${roughFrontmatter.episode_id}`);
  if (roughFrontmatter.source_a_page !== `${episodeId}-a-page.json`) fail("visual rough source_a_page 必须指向标准 inputs A-page 文件名");
  if (roughFrontmatter.source_a_page_sha256?.toLowerCase() !== sha256(aPageText)) fail("visual rough source_a_page_sha256 与 A-page 文件不一致");

  const scripts = parseScript(scriptText, aPageDoc.pages);
  const outline = parseOutline(outlineText, aPageDoc.pages);
  const roughPages = parseVisualRoughV3(visualRoughText, aPageDoc.pages);
  const chapterIndex = outline.chapters.findIndex((chapter) => chapter.aPageId === aPageId);
  if (chapterIndex < 0) fail(`outline 不存在 A-page：${aPageId}`);
  const chapter = outline.chapters[chapterIndex];
  const script = scripts.get(aPageId);
  const steps = parseOutlineV2(chapter);
  if (script.beats.length !== chapter.stepCount) {
    fail(`${aPageId} Beat 数 ${script.beats.length} 与 outline step 数 ${chapter.stepCount} 不一致`);
  }
  if (steps.length !== script.beats.length) fail(`${aPageId} 结构化 steps 必须与 narration beats 一一对应`);
  const rough = roughPages.get(aPageId);
  assertV3Steps({ steps, page, rough, aPageId });
  const materialsMarkdown = outline.materialMap.get(aPageId) ?? null;
  if (rough.media.length && !materialsMarkdown) fail(`${aPageId} visual rough 要求媒体，但 outline 素材清单缺少对应章节`);
  const packet = {
    schema_version: PACKET_SCHEMA_V3,
    episode_id: episodeId,
    ...(typeof aPageDoc.fixture_status === "string" ? { fixture_status: aPageDoc.fixture_status } : {}),
    chapter: {
      index: chapter.index,
      id: chapter.id,
      title: chapter.title,
      a_page_id: aPageId,
      step_count: chapter.stepCount,
    },
    narration: {
      authority: aPageDoc.document_kind === "candidate" || aPageDoc.fixture_status ? "candidate_a_page.nx" : "a_page.nx",
      beats: script.beats,
    },
    screen_guidance: compactScreenGuidance(page, aPageId),
    presentation: {
      recipe_id: rough.recipe_id,
      slot_bindings: rough.slot_bindings.map(({ slot, source_id }) => `${slot} <- ${source_id}`),
      media: rough.media.map((item) => ({ ...item, role: rough.media_role ?? null })),
      relation_carriers: rough.relation_carriers,
    },
    steps,
    protected_relations: Array.isArray(page.protected_relations) ? page.protected_relations : [],
    silent_constraints: Array.isArray(page.silent_constraints) ? page.silent_constraints : [],
    materials_markdown: materialsMarkdown,
    sources: {
      project: { path: relative(root, files.project), sha256: sha256(projectText) },
      a_page: { path: relative(root, files.aPage), sha256: sha256(aPageText) },
      visual_rough: { path: relative(root, files.visualRough), sha256: sha256(visualRoughText) },
      outline: { path: relative(root, files.outline), sha256: sha256(outlineText) },
      script: { path: relative(root, files.script), sha256: sha256(scriptText) },
    },
  };
  return { packet, episodeDir: files.episodeDir };
}

export async function buildCourseplayHandoffPacket({ root = path.resolve(process.env.PLAYER_ROOT ?? process.cwd()), episodeId, aPageId }) {
  if (typeof aPageId === "string") aPageId = aPageId.toUpperCase();
  if (!/^A\d{3}$/u.test(aPageId)) fail(`A-page id 不合法：${aPageId}`);
  const files = await standardInputs(root, episodeId);
  const [projectText, aPageText, visualRoughText, scriptText, outlineText] = await Promise.all([
    readRequired(files.project, "project.json"),
    readRequired(files.aPage, "A-page"),
    readRequired(files.visualRough, "visual rough"),
    readRequired(files.script, "script.md"),
    readRequired(files.outline, "outline.md"),
  ]);
  const project = parseJson(projectText, "project.json");
  const aPageDoc = parseJson(aPageText, "A-page");
  const roughFrontmatter = parseFrontmatter(visualRoughText, "visual rough");
  if (aPageDoc.schema_version === A_PAGE_SCHEMA_V6 && roughFrontmatter.schema_version === VISUAL_ROUGH_SCHEMA_V3) {
    return buildCourseplayHandoffV3Packet({
      root,
      episodeId,
      aPageId,
      files,
      projectText,
      aPageText,
      visualRoughText,
      scriptText,
      outlineText,
    });
  }
  if (aPageDoc.schema_version === A_PAGE_SCHEMA_V5 && roughFrontmatter.schema_version === VISUAL_ROUGH_SCHEMA_V2) {
    return buildCourseplayHandoffV2Packet({
      root,
      episodeId,
      aPageId,
      files,
      projectText,
      aPageText,
      visualRoughText,
      scriptText,
      outlineText,
    });
  }
  if (aPageDoc.schema_version !== A_PAGE_SCHEMA || roughFrontmatter.schema_version !== VISUAL_ROUGH_SCHEMA) {
    fail(`不支持的 Courseplay 版本组合：${aPageDoc.schema_version} + ${roughFrontmatter.schema_version}`);
  }
  if (project.id !== episodeId) fail(`project.id 与 episode 目录不一致：${project.id}`);
  if (aPageDoc.schema_version !== A_PAGE_SCHEMA) fail(`A-page schema 必须是 ${A_PAGE_SCHEMA}`);
  if (aPageDoc.episode_id !== episodeId) fail(`A-page episode_id 与目录不一致：${aPageDoc.episode_id}`);
  if (!Array.isArray(aPageDoc.pages) || !aPageDoc.pages.length) fail("A-page pages[] 不能为空");
  const pageIds = aPageDoc.pages.map((page) => page.a_id);
  if (new Set(pageIds).size !== pageIds.length) fail("A-page pages[] 包含重复 a_id");
  for (const page of aPageDoc.pages) {
    if (!/^A\d{3}$/u.test(page.a_id ?? "")) fail("A-page pages[].a_id 不合法");
    if (typeof page.nx !== "string" || !page.nx.trim()) fail(`A-page ${page.a_id} 缺少非空 nx`);
  }
  const page = aPageDoc.pages.find((candidate) => candidate.a_id === aPageId);
  if (!page) fail(`A-page 不存在：${aPageId}`);

  if (roughFrontmatter.schema_version !== VISUAL_ROUGH_SCHEMA) fail(`visual rough schema 必须是 ${VISUAL_ROUGH_SCHEMA}`);
  if (roughFrontmatter.episode_id !== episodeId) fail(`visual rough episode_id 与目录不一致：${roughFrontmatter.episode_id}`);
  if (roughFrontmatter.source_a_page !== `${episodeId}-a-page.json`) fail("visual rough source_a_page 必须指向标准 inputs A-page 文件名");
  if (roughFrontmatter.source_a_page_sha256?.toLowerCase() !== sha256(aPageText)) fail("visual rough source_a_page_sha256 与 A-page 文件不一致");

  let approvedText = null;
  let approvedFile = null;
  if (aPageDoc.approved_text !== undefined && aPageDoc.approved_text !== null) {
    if (aPageDoc.approved_text !== "approved-spoken-text.txt") fail("approved_text 必须指向 inputs/approved-spoken-text.txt");
    approvedFile = path.join(files.episodeDir, "inputs", "approved-spoken-text.txt");
    approvedText = await readRequired(approvedFile, "approved-spoken-text.txt");
    const joinedNx = aPageDoc.pages.map((item) => item.nx).join("");
    if (normalizeSpoken(approvedText) !== normalizeSpoken(joinedNx)) {
      fail("approved-spoken-text.txt 与全部 pages[].nx 不一致");
    }
  }

  const themeId = project.theme;
  if (typeof themeId !== "string" || !themeId) fail("project.json.theme 不能为空");
  const themeDir = path.join(root, ".agents", "skills", "web-video-presentation", "themes", themeId);
  const themeFile = path.join(themeDir, "theme.json");
  const tokensFile = path.join(themeDir, "tokens.css");
  if (!(await exists(themeFile)) || !(await exists(tokensFile))) fail(`主题不存在或不完整：${themeId}`);
  const themeText = await readRequired(themeFile, "theme.json");
  const theme = parseJson(themeText, "theme.json");
  if (theme.id !== themeId) fail(`theme.json id 与 project.theme 不一致：${theme.id}`);
  for (const field of ["nameZh", "descriptionZh"]) {
    if (typeof theme[field] !== "string" || !theme[field].trim()) {
      fail(`theme.json 缺少交接字段：${field}`);
    }
  }
  for (const field of ["mood", "bestFor"]) {
    if (!Array.isArray(theme[field])) fail(`theme.json 缺少交接字段：${field}`);
  }

  const scripts = parseScript(scriptText, aPageDoc.pages);
  const outline = parseOutline(outlineText, aPageDoc.pages);
  const roughPages = parseVisualRough(visualRoughText, aPageDoc.pages);
  const chapterIndex = outline.chapters.findIndex((chapter) => chapter.aPageId === aPageId);
  const chapter = outline.chapters[chapterIndex];
  const script = scripts.get(aPageId);
  if (script.beats.length !== chapter.stepCount) {
    fail(`${aPageId} Beat 数 ${script.beats.length} 与 outline step 数 ${chapter.stepCount} 不一致`);
  }
  const roughMarkdown = roughPages.get(aPageId);
  const materialsMarkdown = outline.materialMap.get(aPageId) ?? null;
  const requirement = mediaRequirement(roughMarkdown, aPageId);
  if (requirement.toLowerCase() !== "none" && !materialsMarkdown) {
    fail(`${aPageId} visual rough 要求媒体 ${requirement}，但 outline 素材清单缺少对应章节`);
  }

  const packet = {
    schema_version: PACKET_SCHEMA,
    episode_id: episodeId,
    chapter: {
      index: chapter.index,
      id: chapter.id,
      title: chapter.title,
      a_page_id: aPageId,
      step_count: chapter.stepCount,
    },
    theme: {
      id: theme.id,
      nameZh: theme.nameZh,
      descriptionZh: theme.descriptionZh,
      mood: theme.mood,
      bestFor: theme.bestFor,
    },
    a_page: page,
    narration: {
      authority: "a_page.nx",
      beats: script.beats,
    },
    outline: {
      chapter_markdown: chapter.markdown,
      schedule: {
        previous: outline.scheduleRows[chapterIndex - 1] ?? null,
        current: outline.scheduleRows[chapterIndex],
        next: outline.scheduleRows[chapterIndex + 1] ?? null,
      },
      materials_markdown: materialsMarkdown,
    },
    visual_rough_markdown: roughMarkdown,
    sources: {
      a_page: { path: relative(root, files.aPage), sha256: sha256(aPageText) },
      visual_rough: { path: relative(root, files.visualRough), sha256: sha256(visualRoughText) },
      outline: { path: relative(root, files.outline), sha256: sha256(outlineText) },
      script: { path: relative(root, files.script), sha256: sha256(scriptText) },
      approved_text: approvedFile ? { path: relative(root, approvedFile), sha256: sha256(approvedText) } : null,
      theme: { path: relative(root, themeFile), sha256: sha256(themeText) },
    },
  };
  return { packet, episodeDir: files.episodeDir };
}

export async function generateCourseplayHandoff({ root = path.resolve(process.env.PLAYER_ROOT ?? process.cwd()), episodeId, aPageId, check = false }) {
  if (typeof aPageId === "string") aPageId = aPageId.toUpperCase();
  const { packet, episodeDir } = await buildCourseplayHandoffPacket({ root, episodeId, aPageId });
  const content = `${JSON.stringify(packet, null, 2)}\n`;
  const output = path.join(episodeDir, ".handoffs", `${aPageId}.json`);
  if (check) {
    const current = await readRequired(output, "交接包");
    const parsed = parseJson(current, "交接包");
    if (parsed.schema_version !== packet.schema_version) fail(`交接包 schema 必须是 ${packet.schema_version}`);
    for (const [sourceName, source] of Object.entries(packet.sources ?? {})) {
      if (parsed.sources?.[sourceName]?.sha256 !== source?.sha256) {
        fail(`交接包已过期或内容不完整：${relative(root, output)}（源哈希已变化：${sourceName}）`);
      }
    }
    if (current !== content) fail(`交接包已过期或内容不完整：${relative(root, output)}`);
    return { output, bytes: Buffer.byteLength(current), checked: true };
  }

  await mkdir(path.dirname(output), { recursive: true });
  const temp = path.join(path.dirname(output), `.${aPageId}.${process.pid}.tmp`);
  try {
    await writeFile(temp, content);
    await rename(temp, output);
  } finally {
    await rm(temp, { force: true }).catch(() => {});
  }
  return { output, bytes: Buffer.byteLength(content), checked: false };
}

function parseArgs(argv) {
  const options = { episodeId: null, aPageId: null, check: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") continue;
    if (arg === "--check") {
      options.check = true;
      continue;
    }
    if (arg === "--episode") options.episodeId = argv[++index] ?? null;
    else if (arg === "--a-page") options.aPageId = argv[++index] ?? null;
    else fail(`未知参数：${arg}`);
  }
  if (!options.episodeId || !options.aPageId) {
    fail("用法：pnpm courseplay:handoff -- --episode <episode-id> --a-page <Axxx> [--check]");
  }
  return options;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const result = await generateCourseplayHandoff(options);
    console.log(`${result.checked ? "checked" : "generated"} ${relative(process.cwd(), result.output)} (${result.bytes} bytes)`);
  } catch (error) {
    console.error(`courseplay:handoff 失败：${error.message}`);
    process.exitCode = 1;
  }
}

