import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cp, mkdir, mkdtemp, readFile, rename, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const toolsDir = path.dirname(fileURLToPath(new URL("../courseplay-handoff.mjs", import.meta.url)));
const toolPath = path.join(toolsDir, "courseplay-handoff.mjs");

function sha256(text) {
  return createHash("sha256").update(text).digest("hex");
}

async function write(file, content) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
}

async function createFixture() {
  const root = await mkdtemp(path.join(tmpdir(), "courseplay-handoff-"));
  const episodeId = "episode-test";
  const episodeDir = path.join(root, "episodes", episodeId);
  const themeDir = path.join(root, ".agents", "skills", "web-video-presentation", "themes", "test-theme");
  const approved = "第一拍。第二拍。";
  const aPage = {
    schema_version: "courseplay-a-page/v4",
    document_kind: "production",
    episode_id: episodeId,
    approved_text: "approved-spoken-text.txt",
    timing_model: { chars_per_minute: 230 },
    evidence_catalog: [],
    pages: [
      {
        a_id: "A001",
        nx: approved,
        teaching_purpose: "测试",
        single_message: "测试",
        must_visible: [],
        protected_relations: [],
        entry_condition: "进入",
        exit_condition: "退出",
        timing: { target_seconds: 10 },
      },
    ],
  };
  const aPageText = `${JSON.stringify(aPage, null, 2)}\n`;
  const visualRough = `---
schema_version: courseplay-visual-rough/v1
document_kind: production
episode_id: ${episodeId}
source_a_page: ${episodeId}-a-page.json
source_a_page_sha256: ${sha256(aPageText)}
---

# Visual Rough

## A001｜测试页面

- **媒体需求**：\`none\`

### 上屏内容组

1. [V001] 第一拍
2. [V002] 第二拍

### 页面骨架

- 固定双区。
`;
  const outline = `# Video Outline

> **主题**：\`test-theme\`

## 整集视觉调度

| A-page | 页面配方 | 语义关系 | 关系机制 | 主构图 | 强调方式 | 媒体 | 与相邻页的主要差异 |
|---|---|---|---|---|---|---|---|
| A001 | \`two-zone\` | 并列 | \`equal\` | 固定双区 | none | none | 首章 |

## 0. cover — 封面（1 silent step · fixed 15s）

## 1. alpha — 测试章节（2 steps · ~10s）

**A-page / Chapter**：\`A001\`
**基础场景**：\`S-A001\` — 固定双区
**页面配方**：\`two-zone\`
**核心判断**：测试判断
**结构指纹**：\`left | right\`
**语义关系**：并列
**关系机制**：\`equal\` — 等权
**持续元素**：左右区
**内容槽位**：\`left\` / \`right\`
**强调页**：\`none\`
**额外复杂场景**：\`none\`

| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 第一拍 | \`S-A001 · first\` (~5s) | 建立左区 |
| 2 | 第二拍 | \`S-A001 · complete\` (~5s) | 保持左区并补充右区 |

## 素材清单
`;
  const script = `# Script

> 标准 Courseplay script

## A001 · 测试页面

第一拍。

---

第二拍。
`;
  const project = {
    id: episodeId,
    title: "测试",
    status: "in-progress",
    theme: "test-theme",
    progress: { completed: 0, total: 1, current: null },
    updatedAt: "2026-08-30",
  };
  const theme = {
    id: "test-theme",
    name: "Test Theme",
    nameZh: "测试主题",
    description: "Test",
    descriptionZh: "测试",
    mood: ["technical"],
    bestFor: ["测试"],
  };

  const files = {
    project: path.join(episodeDir, "project.json"),
    aPage: path.join(episodeDir, "inputs", `${episodeId}-a-page.json`),
    visualRough: path.join(episodeDir, "inputs", `${episodeId}-visual-rough.md`),
    approved: path.join(episodeDir, "inputs", "approved-spoken-text.txt"),
    script: path.join(episodeDir, "script.md"),
    outline: path.join(episodeDir, "outline.md"),
  };
  await write(files.project, `${JSON.stringify(project, null, 2)}\n`);
  await write(files.aPage, aPageText);
  await write(files.visualRough, visualRough);
  await write(files.approved, approved);
  await write(files.script, script);
  await write(files.outline, outline);
  await write(path.join(themeDir, "theme.json"), `${JSON.stringify(theme, null, 2)}\n`);
  await write(path.join(themeDir, "tokens.css"), ":root {}\n");
  return { root, episodeId, episodeDir, files, themeDir };
}

function run(root, ...args) {
  return spawnSync(process.execPath, [toolPath, ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

test("generates a deterministic handoff for one standard Courseplay chapter", async () => {
  const fixture = await createFixture();
  const result = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "a001");

  assert.equal(result.status, 0, result.stderr);
  const output = path.join(fixture.episodeDir, ".handoffs", "A001.json");
  const first = await readFile(output, "utf8");
  const packet = JSON.parse(first);

  assert.equal(packet.schema_version, "web-video-courseplay-chapter-handoff/v1");
  assert.deepEqual(packet.chapter, {
    index: 1,
    id: "alpha",
    title: "测试章节",
    a_page_id: "A001",
    step_count: 2,
  });
  assert.equal(packet.a_page.nx, "第一拍。第二拍。");
  assert.deepEqual(packet.narration, {
    authority: "a_page.nx",
    beats: ["第一拍。", "第二拍。"],
  });
  assert.equal(packet.outline.schedule.previous, null);
  assert.match(packet.outline.schedule.current, /^\| A001 \|/);
  assert.equal(packet.outline.schedule.next, null);
  assert.equal(packet.outline.materials_markdown, null);
  assert.doesNotMatch(packet.outline.chapter_markdown, /^## 素材清单/m);
  assert.match(packet.visual_rough_markdown, /^## A001｜测试页面/m);

  const secondResult = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "A001");
  assert.equal(secondResult.status, 0, secondResult.stderr);
  assert.equal(await readFile(output, "utf8"), first);
});

test("accepts harmless outline typography and inline callback metadata", async () => {
  const fixture = await createFixture();
  const outline = await readFile(fixture.files.outline, "utf8");
  const compatibleOutline = outline
    .replace("（2 steps · ~10s）", "(2 steps · ~10s)")
    .replace("**A-page / Chapter**：`A001`", "**A-page / Chapter**：`A001`（callback：A001）")
    .replace("`S-A001 · first` (~5s)", "`S-A001 · first` （~5s）")
    .replace("`S-A001 · complete` (~5s)", "`S-A001 · complete` （~5s）");
  await writeFile(fixture.files.outline, compatibleOutline);

  const result = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "A001");
  assert.equal(result.status, 0, result.stderr);
});

test("checks freshness without rewriting and rejects a stale handoff", async () => {
  const fixture = await createFixture();
  const generate = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "A001");
  assert.equal(generate.status, 0, generate.stderr);
  const output = path.join(fixture.episodeDir, ".handoffs", "A001.json");
  const original = await readFile(output, "utf8");

  const check = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "A001", "--check");
  assert.equal(check.status, 0, check.stderr);
  assert.equal(await readFile(output, "utf8"), original);

  await writeFile(fixture.files.outline, `${await readFile(fixture.files.outline, "utf8")}\n`);
  const stale = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "A001", "--check");
  assert.equal(stale.status, 1);
  assert.match(stale.stderr, /已过期或内容不完整/);
  assert.equal(await readFile(output, "utf8"), original);
});

test("accepts Courseplay formal inputs stored under inputs", async () => {
  const fixture = await createFixture();
  const result = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "A001");
  assert.equal(result.status, 0, result.stderr);
});

test("does not require script and outline to be copied into inputs", async () => {
  const fixture = await createFixture();
  const result = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "A001");
  assert.equal(result.status, 0, result.stderr);
});

test("rejects a script without standard A-page headings", async () => {
  const fixture = await createFixture();
  await writeFile(fixture.files.script, "# Script\n\n第一拍。\n\n---\n\n第二拍。\n");

  const result = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "A001");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /必须使用 `## Axxx · 标题`/);
});

test("rejects duplicate A-page headings in script", async () => {
  const fixture = await createFixture();
  const script = await readFile(fixture.files.script, "utf8");
  await writeFile(fixture.files.script, `${script}\n## A001 · 重复页面\n\n重复。\n`);

  const result = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "A001");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /重复 A-page 标题/);
});

test("rejects nonstandard secondary headings in script metadata", async () => {
  const fixture = await createFixture();
  const script = await readFile(fixture.files.script, "utf8");
  await writeFile(fixture.files.script, script.replace("> 标准 Courseplay script", "## 说明\n\n不应猜测。"));

  const result = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "A001");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /包含非标准二级标题/);
});

test("rejects narration drift between script beats and A-page nx", async () => {
  const fixture = await createFixture();
  await writeFile(fixture.files.script, "# Script\n\n## A001 · 测试页面\n\n第一拍。\n\n---\n\n被改写的第二拍。\n");

  const result = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "A001");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Beat 拼接与 pages\[\]\.nx 不一致/);
});

test("rejects approved text drift", async () => {
  const fixture = await createFixture();
  await writeFile(fixture.files.approved, "未经批准的整稿");

  const result = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "A001");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /approved-spoken-text\.txt 与全部 pages\[\]\.nx 不一致/);
});

test("rejects a visual rough whose A-page hash is stale", async () => {
  const fixture = await createFixture();
  await writeFile(fixture.files.aPage, `${await readFile(fixture.files.aPage, "utf8")}\n`);

  const result = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "A001");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /source_a_page_sha256/);
});

test("accepts an uppercase visual rough A-page SHA-256", async () => {
  const fixture = await createFixture();
  const rough = await readFile(fixture.files.visualRough, "utf8");
  await writeFile(
    fixture.files.visualRough,
    rough.replace(
      /^(source_a_page_sha256:\s*)([a-f0-9]{64})$/m,
      (_, prefix, hash) => `${prefix}${hash.toUpperCase()}`,
    ),
  );

  const result = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "A001");
  assert.equal(result.status, 0, result.stderr);
});

test("rejects a required media page without an outline material section", async () => {
  const fixture = await createFixture();
  const rough = await readFile(fixture.files.visualRough, "utf8");
  await writeFile(fixture.files.visualRough, rough.replace("**媒体需求**：`none`", "**媒体需求**：`M001` / `photorealistic_ai`"));

  const result = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "A001");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /素材清单缺少对应章节/);
});

test("rejects a Beat count that differs from the outline step count", async () => {
  const fixture = await createFixture();
  const outline = await readFile(fixture.files.outline, "utf8");
  await writeFile(fixture.files.outline, outline.replace("（2 steps · ~10s）", "（1 steps · ~10s）"));

  const result = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "A001");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Beat 数 2 与 outline step 数 1 不一致/);
});

test("rejects a missing schedule row", async () => {
  const fixture = await createFixture();
  const outline = await readFile(fixture.files.outline, "utf8");
  await writeFile(fixture.files.outline, outline.replace(/^\| A001 \|.*\r?\n/m, ""));

  const result = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "A001");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /整集视觉调度表必须与 pages\[\] 同序且完整/);
});

test("rejects a missing visual rough A-page section", async () => {
  const fixture = await createFixture();
  const rough = await readFile(fixture.files.visualRough, "utf8");
  await writeFile(fixture.files.visualRough, rough.replace(/^## A001[\s\S]*$/m, ""));

  const result = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "A001");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /visual rough 页面必须与 pages\[\] 同序且完整/);
});

test("rejects an A-page episode id that differs from the directory", async () => {
  const fixture = await createFixture();
  const document = JSON.parse(await readFile(fixture.files.aPage, "utf8"));
  document.episode_id = "episode-other";
  await writeFile(fixture.files.aPage, `${JSON.stringify(document, null, 2)}\n`);

  const result = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "A001");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /A-page episode_id 与目录不一致/);
});

test("rejects an unavailable theme", async () => {
  const fixture = await createFixture();
  const project = JSON.parse(await readFile(fixture.files.project, "utf8"));
  project.theme = "missing-theme";
  await writeFile(fixture.files.project, `${JSON.stringify(project, null, 2)}\n`);

  const result = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "A001");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /主题不存在或不完整/);
});

test("rejects an incomplete theme handoff view", async () => {
  const fixture = await createFixture();
  const themeFile = path.join(fixture.themeDir, "theme.json");
  const theme = JSON.parse(await readFile(themeFile, "utf8"));
  delete theme.descriptionZh;
  await writeFile(themeFile, `${JSON.stringify(theme, null, 2)}\n`);

  const result = run(fixture.root, "--episode", fixture.episodeId, "--a-page", "A001");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /theme\.json 缺少交接字段：descriptionZh/);
});

test("uses formal episodes as integration fixtures without leaking unrelated chapter content", async () => {
  const repositoryRoot = path.resolve(toolsDir, "..");
  for (const episodeId of ["episode-02", "episode-09"]) {
    const root = await mkdtemp(path.join(tmpdir(), `courseplay-${episodeId}-`));
    const sourceEpisode = path.join(repositoryRoot, "episodes", episodeId);
    const targetEpisode = path.join(root, "episodes", episodeId);
    await mkdir(targetEpisode, { recursive: true });
    for (const name of ["project.json", "script.md", "outline.md"]) {
      await cp(path.join(sourceEpisode, name), path.join(targetEpisode, name));
    }
    await cp(path.join(sourceEpisode, "inputs"), path.join(targetEpisode, "inputs"), { recursive: true });
    const project = JSON.parse(await readFile(path.join(targetEpisode, "project.json"), "utf8"));
    const sourceTheme = path.join(repositoryRoot, ".agents", "skills", "web-video-presentation", "themes", project.theme);
    await cp(sourceTheme, path.join(root, ".agents", "skills", "web-video-presentation", "themes", project.theme), { recursive: true });
    const aPage = JSON.parse(await readFile(path.join(targetEpisode, "inputs", `${episodeId}-a-page.json`), "utf8"));

    const firstId = aPage.pages[0].a_id;
    const lastId = aPage.pages.at(-1).a_id;
    assert.equal(run(root, "--episode", episodeId, "--a-page", firstId).status, 0);
    assert.equal(run(root, "--episode", episodeId, "--a-page", lastId).status, 0);
    const first = JSON.parse(await readFile(path.join(targetEpisode, ".handoffs", `${firstId}.json`), "utf8"));
    const last = JSON.parse(await readFile(path.join(targetEpisode, ".handoffs", `${lastId}.json`), "utf8"));

    assert.equal(first.outline.schedule.previous, null);
    assert.match(first.outline.schedule.next, new RegExp(`^\\| ${aPage.pages[1].a_id} \\|`));
    assert.match(last.outline.schedule.previous, new RegExp(`^\\| ${aPage.pages.at(-2).a_id} \\|`));
    assert.equal(last.outline.schedule.next, null);
    assert.doesNotMatch(last.outline.chapter_markdown, /^## 素材清单/m);
    assert.doesNotMatch(first.visual_rough_markdown, new RegExp(`^## ${aPage.pages[1].a_id}`, "m"));
    assert.notEqual(first.a_page.nx, aPage.pages[1].nx);
  }
});

test("reports stale frozen inputs for the formal episode-01 sample", () => {
  const repositoryRoot = path.resolve(toolsDir, "..");
  const result = run(repositoryRoot, "--episode", "episode-01", "--a-page", "A001");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /source_a_page_sha256/);
});


