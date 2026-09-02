import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  buildCourseplayHandoffPacket,
  buildCourseplayHandoffV3Packet,
  generateCourseplayHandoff,
} from "../courseplay-handoff.mjs";

const workspaceRoot = path.resolve(import.meta.dirname, "../..");
const fixtureRoot = path.join(workspaceRoot, "tools/tests/fixtures/courseplay-handoff-v2/episode-09");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

function splitBeats(text) {
  const normalized = text.trim();
  const boundaries = [0, 1, 2, 3].map((index) => Math.floor(index * normalized.length / 3));
  return [0, 1, 2].map((index) => normalized.slice(boundaries[index], boundaries[index + 1])).filter(Boolean);
}

async function v3Inputs() {
  const aPage = JSON.parse(await readFile(path.join(fixtureRoot, "episode-09-a-page-v5-slice.json"), "utf8"));
  aPage.schema_version = "courseplay-a-page/v6";
  for (const page of aPage.pages) {
    const items = [page.screen.title, ...page.screen.groups.flatMap((group) => group.items)];
    for (const item of items) {
      item.guidance_text = item.source_text;
      item.usage_policy = item.edit_policy === "exact" ? "exact" : "reference";
      delete item.source_text;
      delete item.edit_policy;
    }
  }
  const aPageText = `${JSON.stringify(aPage, null, 2)}\n`;
  let visualRoughText = await readFile(path.join(fixtureRoot, "episode-09-visual-rough-v2-slice.md"), "utf8");
  visualRoughText = visualRoughText
    .replace("courseplay-visual-rough/v2", "courseplay-visual-rough/v3")
    .replace(/^(source_a_page:\s*).+$/mu, "$1episode-09-a-page.json")
    .replace(/^(source_a_page_sha256:\s*)[a-f0-9]{64}$/mu, `$1${sha256(aPageText)}`)
    .replace(/^.*<- S\d{3}`\s*$/gmu, "");
  const outlineText = await readFile(path.join(fixtureRoot, "outline-screen-source-slice.md"), "utf8");
  const scriptText = [
    "# Script",
    ...aPage.pages.map((page) => `\n## ${page.a_id} · ${page.a_id}\n\n${splitBeats(page.nx).join("\n\n---\n\n")}\n`),
  ].join("\n");
  return { aPage, aPageText, visualRoughText, outlineText, scriptText, projectText: JSON.stringify({ id: "episode-09" }) };
}

function filesFor(root) {
  const episodeDir = path.join(root, "episodes", "episode-09");
  return {
    episodeDir,
    project: path.join(episodeDir, "project.json"),
    aPage: path.join(episodeDir, "inputs", "episode-09-a-page.json"),
    visualRough: path.join(episodeDir, "inputs", "episode-09-visual-rough.md"),
    outline: path.join(episodeDir, "outline.md"),
    script: path.join(episodeDir, "script.md"),
  };
}

test("projects v6/v3 into a compact three-source handoff v3", async (t) => {
  const input = await v3Inputs();
  const root = await mkdtemp(path.join(tmpdir(), "courseplay-handoff-v3-"));
  try {
    const { packet } = await buildCourseplayHandoffV3Packet({
      root,
      episodeId: "episode-09",
      aPageId: "A001",
      files: filesFor(root),
      ...input,
    });
    assert.equal(packet.schema_version, "web-video-courseplay-chapter-handoff/v3");
    assert.equal(packet.chapter.a_page_id, "A001");
    assert.equal(packet.narration.beats.length, packet.steps.length);
    assert.equal(packet.screen_guidance.title.screen_item_id, "S001");
    assert.equal(packet.screen_guidance.title.usage_policy, "reference");
    assert.deepEqual(packet.protected_relations.map((item) => item.relation_id), ["R001", "R002"]);
    assert.equal(packet.sources.script.sha256, sha256(input.scriptText));
    assert.equal(packet.sources.project.sha256, sha256(input.projectText));
    assert.equal(Object.hasOwn(packet, "screen_source"), false);
    assert.equal(Object.hasOwn(packet, "a_page"), false);
    assert.equal(Object.hasOwn(packet, "outline"), false);
    const packetBytes = Buffer.byteLength(`${JSON.stringify(packet, null, 2)}\n`);
    assert.ok(packetBytes > 0);
    t.diagnostic(`v3 A001 packet bytes (report only, no ceiling): ${packetBytes}`);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("v3 enforces G, media, relation carriers, and Beat/Nx without final-copy scanning", async () => {
  const input = await v3Inputs();
  const root = await mkdtemp(path.join(tmpdir(), "courseplay-handoff-v3-negative-"));
  const build = (overrides = {}) => buildCourseplayHandoffV3Packet({
    root,
    episodeId: "episode-09",
    aPageId: "A001",
    files: filesFor(root),
    ...input,
    ...overrides,
  });
  try {
    const relationLines = input.visualRoughText.match(/^- `\[R00[12]\]`.*$/gmu);
    assert.equal(relationLines?.length, 2);
    const [r001, r002] = relationLines;
    const reorderedRelations = input.visualRoughText
      .replace(r001, "__R001_CARRIER__")
      .replace(r002, r001)
      .replace("__R001_CARRIER__", r002);
    await build({ visualRoughText: reorderedRelations });
    await assert.rejects(
      build({ visualRoughText: input.visualRoughText.replace(r001, `${r001}\n${r001}`) }),
      /关系载体重复：R001/u,
    );
    await assert.rejects(
      build({ visualRoughText: input.visualRoughText.replace(/^.*question-cards <- G001.*\r?\n/mu, "") }),
      /未在页面骨架考虑 G：G001/u,
    );
    await assert.rejects(
      build({ visualRoughText: input.visualRoughText.replace(/^.*media-scene <- M001.*\r?\n/mu, "") }),
      /缺少媒体槽位：M001/u,
    );
    await assert.rejects(
      build({ visualRoughText: input.visualRoughText.replace(/^.*\[R001\].*\r?\n/mu, "") }),
      /关系载体必须与 protected_relations 完整一致/u,
    );
    await assert.rejects(
      build({ scriptText: input.scriptText.replace("发动机", "电动机") }),
      /Beat 拼接与 pages\[\]\.nx 不一致/u,
    );
    await assert.rejects(
      build({ visualRoughText: input.visualRoughText.replace("`issue-cards-with-image`", "none") }),
      /缺少页面配方/u,
    );
    await assert.rejects(
      build({ outlineText: input.outlineText.replace("focus: S001", "focus: S999") }),
      /step 1 引用未知对象：S999/u,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("dispatch accepts only v4/v1, v5/v2, or v6/v3 and v3 check detects stale inputs", async () => {
  const input = await v3Inputs();
  const root = await mkdtemp(path.join(tmpdir(), "courseplay-handoff-v3-dispatch-"));
  const files = filesFor(root);
  try {
    await mkdir(path.join(files.episodeDir, "inputs"), { recursive: true });
    await Promise.all([
      writeFile(path.join(files.episodeDir, "project.json"), input.projectText),
      writeFile(files.aPage, input.aPageText),
      writeFile(files.visualRough, input.visualRoughText),
      writeFile(files.script, input.scriptText),
      writeFile(files.outline, input.outlineText),
    ]);
    const packet = await buildCourseplayHandoffPacket({ root, episodeId: "episode-09", aPageId: "A001" });
    assert.equal(packet.packet.schema_version, "web-video-courseplay-chapter-handoff/v3");
    await generateCourseplayHandoff({ root, episodeId: "episode-09", aPageId: "A001" });
    await generateCourseplayHandoff({ root, episodeId: "episode-09", aPageId: "A001", check: true });
    await writeFile(files.project, JSON.stringify({ id: "episode-09", title: "changed" }));
    await assert.rejects(
      generateCourseplayHandoff({ root, episodeId: "episode-09", aPageId: "A001", check: true }),
      /源哈希已变化：project/u,
    );
    await writeFile(files.project, input.projectText);
    await writeFile(files.outline, `${input.outlineText}\n`);
    await assert.rejects(
      generateCourseplayHandoff({ root, episodeId: "episode-09", aPageId: "A001", check: true }),
      /源哈希已变化：outline/u,
    );

    await writeFile(files.outline, input.outlineText);
    const mismatches = [
      ["courseplay-a-page/v4", "courseplay-visual-rough/v2"],
      ["courseplay-a-page/v4", "courseplay-visual-rough/v3"],
      ["courseplay-a-page/v5", "courseplay-visual-rough/v1"],
      ["courseplay-a-page/v5", "courseplay-visual-rough/v3"],
      ["courseplay-a-page/v6", "courseplay-visual-rough/v1"],
      ["courseplay-a-page/v6", "courseplay-visual-rough/v2"],
    ];
    for (const [aPageSchema, roughSchema] of mismatches) {
      const mismatchedAPage = { ...input.aPage, schema_version: aPageSchema };
      await writeFile(files.aPage, `${JSON.stringify(mismatchedAPage, null, 2)}\n`);
      await writeFile(
        files.visualRough,
        input.visualRoughText.replace("courseplay-visual-rough/v3", roughSchema),
      );
      await assert.rejects(
        buildCourseplayHandoffPacket({ root, episodeId: "episode-09", aPageId: "A001" }),
        /不支持的 Courseplay 版本组合/u,
      );
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});


