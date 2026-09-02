import { access, readdir } from "node:fs/promises";
import path from "node:path";

export async function listThemeIds(root = path.resolve(process.env.PLAYER_ROOT ?? process.cwd())) {
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

export async function assertThemeExists(themeId, root = path.resolve(process.env.PLAYER_ROOT ?? process.cwd())) {
  const ids = await listThemeIds(root);
  if (!ids.includes(themeId)) {
    throw new Error(`主题不存在：${themeId}。可用主题：${ids.join(", ")}`);
  }
  return themeId;
}
