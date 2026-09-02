import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const workspaceRoot = path.resolve(import.meta.dirname, "../..");

async function read(relativePath) {
  return readFile(path.join(workspaceRoot, relativePath), "utf8");
}

test("publishes the Courseplay handoff command and ignores generated packets", async () => {
  const packageJson = JSON.parse(await read("package.json"));
  const gitignore = await read(".gitignore");

  assert.equal(
    packageJson.scripts["courseplay:handoff"],
    "node tools/courseplay-handoff.mjs",
  );
  assert.match(gitignore, /^episodes\/\*\/\.handoffs\/$/m);
});

test("documents the standard inputs and optional compact handoff", async () => {
  const authoritativeDocs = await Promise.all(
    [
      "CLAUDE.md",
      ".agents/skills/web-video-presentation/SKILL.md",
      ".agents/skills/web-video-presentation/references/COURSEPLAY-BOUND-MODE.md",
      ".agents/skills/web-video-presentation/references/OUTLINE-FORMAT.md",
      "docs/episode-contract.md",
    ].map(read),
  );

  const [claude, skill, boundMode, outlineFormat, episodeContract] =
    authoritativeDocs;
  const combinedContract = [claude, skill, boundMode, outlineFormat, episodeContract].join(
    "\n",
  );

  assert.match(combinedContract, /pnpm courseplay:handoff -- --episode/);
  assert.match(combinedContract, /紧凑输入|隔离.*上下文/u);
  assert.match(combinedContract, /## Axxx · <页面标题>/);
  assert.match(combinedContract, /approved-spoken-text\.txt/);
  assert.match(combinedContract, /<episode-id>-a-page\.json/);
  assert.match(combinedContract, /<episode-id>-visual-rough\.md/);
  assert.match(combinedContract, /显式调用 handoff/u);
  assert.match(combinedContract, /不升级为全局制作门禁|不把错误扩展成全局制作停止条件/u);
});

test("keeps handoff and the cover library optional across the production docs", async () => {
  const [claude, skill, boundMode, outlineFormat, craft, episodeContract] = await Promise.all([
    read("CLAUDE.md"),
    read(".agents/skills/web-video-presentation/SKILL.md"),
    read(".agents/skills/web-video-presentation/references/COURSEPLAY-BOUND-MODE.md"),
    read(".agents/skills/web-video-presentation/references/OUTLINE-FORMAT.md"),
    read(".agents/skills/web-video-presentation/references/CHAPTER-CRAFT.md"),
    read("docs/episode-contract.md"),
  ]);
  const productionDocs = [claude, skill, boundMode, outlineFormat, craft, episodeContract].join("\n");

  assert.match(boundMode, /handoff.*可选/u);
  assert.match(outlineFormat, /handoff.*可选/u);
  assert.match(productionDocs, /等价的当前章节输入/u);
  assert.match(productionDocs, /封面内容库.*可选/u);
  assert.doesNotMatch(productionDocs, /每章开工或返工前执行/u);
  assert.doesNotMatch(productionDocs, /每章开工、返工或交给并行 Agent 前执行/u);
  assert.doesNotMatch(productionDocs, /内容输入唯一入口/u);
  assert.doesNotMatch(productionDocs, /只有两个合法来源/u);
  assert.doesNotMatch(productionDocs, /必须复制当前仓库\s*`output\/covers/u);
  assert.doesNotMatch(productionDocs, /对应文件缺失时\s*立即停止/u);
  assert.doesNotMatch(productionDocs, /使用 Courseplay 交接包时，包内.*不完整/u);
});

test("routes v3 to three-source authoring without a new downstream content IR", async () => {
  const [skill, craft, boundMode, outline, generator] = await Promise.all([
    read(".agents/skills/web-video-presentation/SKILL.md"),
    read(".agents/skills/web-video-presentation/references/CHAPTER-CRAFT.md"),
    read(".agents/skills/web-video-presentation/references/COURSEPLAY-BOUND-MODE.md"),
    read(".agents/skills/web-video-presentation/references/OUTLINE-FORMAT.md"),
    read("tools/courseplay-handoff.mjs"),
  ]);
  assert.match(skill, /courseplay-a-page\/v6/);
  assert.match(skill, /courseplay-visual-rough\/v3/);
  assert.match(craft, /Courseplay v3：三源创作（唯一详细规则）/);
  assert.match(craft, /不建立 S→step/);
  assert.match(boundMode, /三源创作详细规则\s*唯一存放/);
  assert.match(outline, /不保存最终文案权威/);
  assert.match(skill, /普通项目[^\n]*双源/u);
  assert.match(skill, /Courseplay v3[^\n]*guidance[^\n]*beats[^\n]*presentation/u);
  assert.doesNotMatch(skill, /□ 双源原则：屏幕画面有没有"口播没念但 article 能挂"的细节/u);
  assert.doesNotMatch(skill, /\| 10 \| 双源原则 \| script 定节拍，\*\*article 定画面密度\*\*/u);
  assert.doesNotMatch(generator, /CourseplayScreenContent|typescript-estree|@typescript-eslint\/parser/u);
});
