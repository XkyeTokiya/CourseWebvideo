import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const cli = path.resolve("tools/list-themes.mjs");

test("theme list discovers current metadata and excludes hidden or incomplete themes", async (t) => {
  const testDir = path.resolve("../.tmp/tests/theme-list");
  await mkdir(testDir, { recursive: true });
  const root = await mkdtemp(path.join(testDir, "fixture-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const themesDir = path.join(root, ".agents/skills/web-video-presentation/themes");
  async function addTheme(id, metadata, tokens = true) {
    const dir = path.join(themesDir, id);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "theme.json"), typeof metadata === "string" ? metadata : JSON.stringify(metadata));
    if (tokens) await writeFile(path.join(dir, "tokens.css"), ":root {}\n");
  }
  const metadata = {
    id: "different-metadata-id", nameZh: "工程主题", descriptionZh: "用于教学",
    bestFor: ["设备原理"], mood: ["technical"],
    preview: { shell: "#111111", surface: "#ffffff", text: "#222222", accent: "#333333" },
  };
  await addTheme("engineering", metadata);
  await addTheme("legacy", { id: "legacy", selectable: false });
  await addTheme("incomplete", { id: "incomplete" }, false);
  await addTheme("invalid", "{");
  const run = (...args) => execFileAsync(process.execPath, [cli, ...args], {
    env: { ...process.env, PLAYER_ROOT: root },
  });

  const json = JSON.parse((await run("--json")).stdout);
  assert.equal(json.length, 1);
  assert.equal(json[0].id, "engineering");
  assert.deepEqual(json[0].bestFor, ["设备原理"]);
  const human = (await run()).stdout;
  assert.match(human, /工程主题 \(engineering\)/u);
  assert.match(human, /设备原理/u);
  assert.match(human, /accent: #333333/u);
  assert.doesNotMatch(human, /legacy|incomplete|invalid/u);

  await addTheme("new-theme", { id: "new-theme", nameZh: "新主题" });
  assert.deepEqual(JSON.parse((await run("--json")).stdout).map((theme) => theme.id), ["engineering", "new-theme"]);
  await assert.rejects(run("--unknown"), /用法/u);
});
