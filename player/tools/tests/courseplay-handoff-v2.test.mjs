import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  buildCourseplayHandoffV2Packet,
  generateCourseplayHandoff,
  parseOutlineV2,
} from "../courseplay-handoff.mjs";

const workspaceRoot = path.resolve(import.meta.dirname, "../..");
const fixtureRoot = path.join(workspaceRoot, "tools", "tests", "fixtures", "courseplay-handoff-v2", "episode-09");

const sha256 = (value) => createHash("sha256").update(value).digest("hex");

function assertStateSimulation(packet) {
  const screenIds = [
    packet.screen_source.title.screen_item_id,
    ...packet.screen_source.groups.flatMap((group) => [
      group.group_id,
      ...group.items.map((item) => item.screen_item_id),
    ]),
  ];
  const mediaIds = packet.presentation.media.map((item) => item.media_id);
  const relationIds = [
    ...packet.screen_source.protected_relations.map((item) => item.relation_id),
    ...packet.presentation.relation_carriers.map((item) => item.relation_id),
  ];
  const known = new Set([...screenIds, ...mediaIds, ...relationIds]);
  const visible = new Set(packet.presentation.slot_bindings
    .map((binding) => binding.match(/<-[ ]+([SGM]\d{3})$/u)?.[1])
    .filter(Boolean));
  packet.steps.forEach((step, index) => {
    assert.equal(index + 1, step.index);
    for (const ref of [...step.show_refs, ...step.keep_refs, ...step.focus_refs]) {
      assert.ok(known.has(ref), `${packet.chapter.a_page_id} step ${step.index} has unknown ref ${ref}`);
    }
    for (const ref of step.keep_refs.filter((item) => /^[SGM]\d{3}$/u.test(item))) {
      assert.ok(visible.has(ref), `${packet.chapter.a_page_id} step ${step.index} keeps hidden ref ${ref}`);
    }
    for (const ref of step.show_refs.filter((item) => /^[SGM]\d{3}$/u.test(item))) visible.add(ref);
    assert.doesNotMatch(step.instruction, /C\d{3}|silent_constraints/u);
  });
}

test("projects a v5/v2 fixture into a compact structured handoff", async () => {
  const aPageText = await readFile(path.join(fixtureRoot, "episode-09-a-page-v5-slice.json"), "utf8");
  const aPage = JSON.parse(aPageText);
  const roughText = (await readFile(path.join(fixtureRoot, "episode-09-visual-rough-v2-slice.md"), "utf8"))
    .replace(/^(source_a_page:\s*).+$/mu, "$1episode-09-a-page.json")
    .replace(/^(source_a_page_sha256:\s*)[a-f0-9]{64}$/mu, `$1${sha256(aPageText)}`);
  const outlineText = await readFile(path.join(fixtureRoot, "outline-screen-source-slice.md"), "utf8");
  const splitBeats = (text) => {
    const normalized = text.trim();
    const boundaries = [0, 1, 2, 3].map((index) => Math.floor(index * normalized.length / 3));
    return [0, 1, 2].map((index) => normalized.slice(boundaries[index], boundaries[index + 1])).filter(Boolean);
  };
  const scriptText = [
    "# Script",
    ...aPage.pages.map((page) => `\n## ${page.a_id} · ${page.a_id}\n\n${splitBeats(page.nx).join("\n\n---\n\n")}\n`),
  ].join("\n");
  const projectText = JSON.stringify({ id: "episode-09" });
  const root = await mkdtemp(path.join(tmpdir(), "courseplay-handoff-v2-"));
  const episodeDir = path.join(root, "episodes", "episode-09");
  const files = {
    episodeDir,
    aPage: path.join(episodeDir, "inputs", "episode-09-a-page.json"),
    visualRough: path.join(episodeDir, "inputs", "episode-09-visual-rough.md"),
    outline: path.join(episodeDir, "outline.md"),
  };
  try {
    const chapterMarkdown = outlineText.match(/^##\s+1\.[\s\S]*?(?=^##\s+8\.|^##\s+9\.)/mu)?.[0];
    assert.ok(chapterMarkdown);
    const chapter = {
      index: 1,
      id: "after-scan",
      title: "认出发动机之后",
      stepCount: 3,
      aPageId: "A001",
      markdown: chapterMarkdown,
    };
    const steps = parseOutlineV2(chapter);
    assert.equal(3, steps.length);
    assert.equal("S-A001 · scene-and-first-questions", steps[0].scene_state);

    const result = await buildCourseplayHandoffV2Packet({
      root,
      episodeId: "episode-09",
      aPageId: "A001",
      files,
      projectText,
      aPageText,
      visualRoughText: roughText,
      scriptText,
      outlineText,
    });
    const packet = result.packet;
    assert.equal("web-video-courseplay-chapter-handoff/v2", packet.schema_version);
    assert.equal("candidate_a_page.nx", packet.narration.authority);
    assert.equal("issue-cards-with-image", packet.presentation.recipe_id);
    assert.equal(3, packet.steps.length);
    assert.equal("S001", packet.screen_source.title.screen_item_id);
    assert.equal("G001", packet.screen_source.groups[0].group_id);
    assert.equal("M001", packet.presentation.media[0].media_id);
    assert.equal(undefined, packet.a_page);
    assert.equal(undefined, packet.outline);
    assert.equal(undefined, packet.visual_rough_markdown);
    assert.equal(undefined, packet.theme);
    assert.equal(undefined, packet.screen_source.title.meaning);
    assert.equal(1, JSON.stringify(packet).split("扫描认出发动机，追溯才刚刚开始").length - 1);
    assertStateSimulation(packet);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("generates and checks fixture-only v2 packets for the three representative A-pages", async () => {
  const aPageText = await readFile(path.join(fixtureRoot, "episode-09-a-page-v5-slice.json"), "utf8");
  const aPage = JSON.parse(aPageText);
  const roughText = (await readFile(path.join(fixtureRoot, "episode-09-visual-rough-v2-slice.md"), "utf8"))
    .replace(/^(source_a_page:\s*).+$/mu, "$1episode-09-a-page.json")
    .replace(/^(source_a_page_sha256:\s*)[a-f0-9]{64}$/mu, `$1${sha256(aPageText)}`);
  const outlineText = await readFile(path.join(fixtureRoot, "outline-screen-source-slice.md"), "utf8");
  const splitBeats = (text) => {
    const normalized = text.trim();
    const boundaries = [0, 1, 2, 3].map((index) => Math.floor(index * normalized.length / 3));
    return [0, 1, 2].map((index) => normalized.slice(boundaries[index], boundaries[index + 1])).filter(Boolean);
  };
  const scriptText = [
    "# Script",
    ...aPage.pages.map((page) => `\n## ${page.a_id} · ${page.a_id}\n\n${splitBeats(page.nx).join("\n\n---\n\n")}\n`),
  ].join("\n");
  const root = await mkdtemp(path.join(tmpdir(), "courseplay-handoff-v2-generated-"));
  const episodeDir = path.join(root, "episodes", "episode-09");
  try {
    await mkdir(path.join(episodeDir, "inputs"), { recursive: true });
    await Promise.all([
      writeFile(path.join(episodeDir, "project.json"), JSON.stringify({ id: "episode-09" })),
      writeFile(path.join(episodeDir, "inputs", "episode-09-a-page.json"), aPageText),
      writeFile(path.join(episodeDir, "inputs", "episode-09-visual-rough.md"), roughText),
      writeFile(path.join(episodeDir, "script.md"), scriptText),
      writeFile(path.join(episodeDir, "outline.md"), outlineText),
    ]);

    for (const aPageId of ["A001", "A008", "A009"]) {
      const generated = await generateCourseplayHandoff({ root, episodeId: "episode-09", aPageId });
      const packet = JSON.parse(await readFile(generated.output, "utf8"));
      assert.equal("web-video-courseplay-chapter-handoff/v2", packet.schema_version);
      assert.equal(aPageId, packet.chapter.a_page_id);
      assert.equal(false, generated.checked);
      assertStateSimulation(packet);
      const checked = await generateCourseplayHandoff({ root, episodeId: "episode-09", aPageId, check: true });
      assert.equal(true, checked.checked);
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("accepts full-width duration parentheses in structured outline steps", () => {
  const steps = parseOutlineV2({
    aPageId: "A001",
    stepCount: 1,
    markdown: [
      "| Step | Narration focus | Scene · Semantic state | 本步场景指令 |",
      "|---|---|---|---|",
      "| 1 | 测试焦点 | `S-A001 · stable` （~10s） | 建立并保持主构图 |",
    ].join("\n"),
  });

  assert.equal(steps.length, 1);
  assert.equal(steps[0].scene_state, "S-A001 · stable");
});

