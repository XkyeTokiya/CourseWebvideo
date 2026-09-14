import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

export async function listInstalledThemeIds(root = path.resolve(process.env.PLAYER_ROOT ?? process.cwd())) {
  const themesDir = path.join(root, ".agents", "skills", "web-video-presentation", "themes");
  const entries = await readdir(themesDir, { withFileTypes: true });
  const ids = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    try {
      await access(path.join(themesDir, entry.name, "tokens.css"));
      await access(path.join(themesDir, entry.name, "theme.json"));
      ids.push(entry.name);
    } catch { /* incomplete theme is not selectable */ }
  }
  return ids.sort();
}

export const listThemeIds = listInstalledThemeIds;

export async function listSelectableThemeIds(root = path.resolve(process.env.PLAYER_ROOT ?? process.cwd())) {
  const ids = await listInstalledThemeIds(root);
  const selectable = [];
  for (const id of ids) {
    try {
      const metadataPath = path.join(root, ".agents", "skills", "web-video-presentation", "themes", id, "theme.json");
      const metadata = JSON.parse(await readFile(metadataPath, "utf8"));
      if (metadata.selectable !== false) selectable.push(id);
    } catch { /* invalid metadata is not selectable */ }
  }
  return selectable;
}

export async function assertThemeExists(themeId, root = path.resolve(process.env.PLAYER_ROOT ?? process.cwd())) {
  const ids = await listInstalledThemeIds(root);
  if (!ids.includes(themeId)) {
    throw new Error(`主题不存在：${themeId}。已安装主题：${ids.join(", ")}`);
  }
  return themeId;
}

export async function assertThemeSelectable(themeId, root = path.resolve(process.env.PLAYER_ROOT ?? process.cwd())) {
  const ids = await listSelectableThemeIds(root);
  if (!ids.includes(themeId)) {
    throw new Error(`主题不可选：${themeId}。可选主题：${ids.join(", ")}`);
  }
  return themeId;
}
