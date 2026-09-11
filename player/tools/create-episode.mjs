import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { assertThemeExists } from "./theme-registry.mjs";

const root = path.resolve(process.env.PLAYER_ROOT ?? process.cwd());
const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const value = process.argv[index];
  if (value === "--") continue;
  if (!value?.startsWith("--")) continue;
  const [key, inline] = value.slice(2).split("=", 2);
  args.set(key, inline ?? process.argv[++index] ?? "");
}

const id = args.get("id");
const title = args.get("title") || "未命名视频实例";
const theme = args.get("theme") || "industrial-clarity";
if (!id || !/^episode-[a-z0-9-]+$/.test(id)) {
  console.error("用法：pnpm episode:new -- --id episode-xx [--title 标题] [--theme 主题]");
  process.exit(1);
}
try { await assertThemeExists(theme, root); }
catch (error) {
  console.error(error.message ?? error);
  process.exit(1);
}

const target = path.join(root, "episodes", id);
const template = path.join(root, "templates", "episode");
try {
  await readFile(path.join(target, "project.json"));
  console.error(`实例已存在：${path.relative(root, target)}`);
  process.exit(1);
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

await mkdir(target, { recursive: true });
await cp(template, target, { recursive: true, force: false });
const projectPath = path.join(target, "project.json");
const project = JSON.parse(await readFile(projectPath, "utf8"));
project.id = id;
project.title = title;
project.theme = theme;
project.updatedAt = new Date().toISOString().slice(0, 10);
await writeFile(projectPath, `${JSON.stringify(project, null, 2)}\n`);
console.log(`已创建 ${path.relative(root, target)}`);
console.log("状态：planned。完成入口和首章后，将 project.json 改为 in-progress 即可预览。");
