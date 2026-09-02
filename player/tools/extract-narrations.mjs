import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = path.resolve(process.env.PLAYER_ROOT ?? process.cwd());
const flag = process.argv.indexOf("--episode");
const requested = flag >= 0 ? process.argv[flag + 1] : null;
const episodesRoot = path.join(root, "episodes");

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}
async function episodeIds() {
  if (requested) return [requested];
  return (await readdir(episodesRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}
async function chapterIds(episodeDir) {
  const chapters = path.join(episodeDir, "src", "chapters");
  const dirs = await readdir(chapters, { withFileTypes: true });
  return dirs.filter((entry) => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name));
}
async function extract(id) {
  const episodeDir = path.join(episodesRoot, id);
  const projectPath = path.join(episodeDir, "project.json");
  const project = JSON.parse(await readFile(projectPath, "utf8"));
  if (project.status === "planned") {
    console.log(`${id}: skipped planned instance`);
    return;
  }
  const segments = [];
  let silent = 0;
  for (const folder of await chapterIds(episodeDir)) {
    const file = path.join(episodeDir, "src", "chapters", folder.name, "narrations.ts");
    if (!(await exists(file))) continue;
    const source = await readFile(file, "utf8");
    const match = source.match(/narrations\s*=\s*(\[[\s\S]*?\]);/);
    if (!match) throw new Error(`${path.relative(root, file)}: 未找到 narrations 数组`);
    let narrations;
    try { narrations = Function(`"use strict"; return (${match[1]});`)(); }
    catch { throw new Error(`${path.relative(root, file)}: narrations 必须是静态字符串数组`); }
    if (!Array.isArray(narrations) || narrations.some((text) => typeof text !== "string")) throw new Error(`${path.relative(root, file)}: narrations 必须全部是字符串`);
    const chapter = folder.name.replace(/^\d+-/, "");
    narrations.forEach((text, index) => {
      if (!text.trim()) { silent += 1; return; }
      segments.push({ chapter, step: index + 1, text, audio: `${chapter}/${index + 1}.mp3` });
    });
  }
  const output = path.join(episodeDir, "audio-segments.json");
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(segments, null, 2)}\n`);
  console.log(`${id}: extracted ${segments.length} segments, skipped ${silent} silent steps`);
}

if (!(await exists(episodesRoot))) {
  console.error("找不到 episodes/ 目录");
  process.exit(1);
}
for (const id of await episodeIds()) await extract(id);
