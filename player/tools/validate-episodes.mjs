import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { listThemeIds } from "./theme-registry.mjs";

const root = path.resolve(process.env.PLAYER_ROOT ?? process.cwd());
const episodeFlag = process.argv.indexOf("--episode");
const requested = episodeFlag >= 0 ? process.argv[episodeFlag + 1] : null;
const episodesRoot = path.join(root, "episodes");
const statusValues = new Set(["planned", "in-progress", "ready"]);
const errors = [];
const warnings = [];
const themeIds = new Set(await listThemeIds(root));

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}
async function readJson(file) {
  try { return JSON.parse(await readFile(file, "utf8")); }
  catch { errors.push(`${path.relative(root, file)}: 无法读取有效 JSON`); return null; }
}
async function checkEpisode(id) {
  const dir = path.join(episodesRoot, id);
  const file = path.join(dir, "project.json");
  const project = await readJson(file);
  if (!project) return;
  const label = `episodes/${id}`;
  if (project.id !== id) errors.push(`${label}: project.id 必须与目录名一致`);
  if (typeof project.title !== "string" || !project.title.trim()) errors.push(`${label}: title 不能为空`);
  if (!statusValues.has(project.status)) errors.push(`${label}: status 必须是 planned/in-progress/ready`);
  if (typeof project.theme !== "string" || !themeIds.has(project.theme)) errors.push(`${label}: theme 不存在：${project.theme}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(project.updatedAt ?? "")) errors.push(`${label}: updatedAt 必须是 YYYY-MM-DD`);
  const progress = project.progress;
  if (!progress || !Number.isInteger(progress.completed) || !Number.isInteger(progress.total) || progress.completed < 0 || progress.total < 0 || progress.completed > progress.total) errors.push(`${label}: progress 必须是有效的 completed/total`);
  if (progress?.current !== null && typeof progress?.current !== "string") errors.push(`${label}: progress.current 必须是字符串或 null`);

  const entry = path.join(dir, "src", "entry.tsx");
  if (project.status !== "planned" && !(await exists(entry))) errors.push(`${label}: ${project.status} 实例必须存在 src/entry.tsx`);
  if (project.status === "planned" && !(await exists(entry))) warnings.push(`${label}: planned 实例尚未创建可播放入口`);
  if (progress?.current) {
    const chaptersDir = path.join(dir, "src", "chapters");
    const chapterDirs = await readdir(chaptersDir, { withFileTypes: true }).catch(() => []);
    const found = chapterDirs.some((entry) => entry.isDirectory() && (entry.name === progress.current || entry.name.endsWith(`-${progress.current}`)));
    if (!found) warnings.push(`${label}: 当前章节目录不存在：${progress.current}`);
  }
  if (project.status === "ready" && progress?.completed !== progress?.total) warnings.push(`${label}: ready 实例的 completed 与 total 尚未对齐`);
}

if (!(await exists(episodesRoot))) {
  console.error("找不到 episodes/ 目录");
  process.exit(1);
}
const ids = requested
  ? [requested]
  : (await readdir(episodesRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && /^episode-[a-z0-9-]+$/u.test(entry.name))
    .map((entry) => entry.name);
for (const id of ids) await checkEpisode(id);
for (const warning of warnings) console.warn(`WARN  ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`ERROR ${error}`);
  process.exit(1);
}
console.log(`episode:check 通过：${ids.length} 个实例，${warnings.length} 个警告`);
