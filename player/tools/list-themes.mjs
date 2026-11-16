import { listSelectableThemes } from "./theme-registry.mjs";

const args = process.argv.slice(2).filter((arg) => arg !== "--");
if (args.some((arg) => arg !== "--json" && arg !== "--help")) {
  console.error("用法：pnpm themes:list -- [--json|--help]");
  process.exit(1);
}
if (args.includes("--help")) {
  console.log("用法：pnpm themes:list -- [--json]");
  console.log("列出当前可选主题及推荐场景；--json 输出机器可读元数据。");
  process.exit(0);
}

const themes = await listSelectableThemes();
if (args.includes("--json")) {
  console.log(JSON.stringify(themes, null, 2));
} else {
  console.log(`可选主题：${themes.length} 个`);
  for (const theme of themes) {
    const bestFor = Array.isArray(theme.bestFor) ? theme.bestFor.join("、") : "未提供";
    const mood = Array.isArray(theme.mood) ? theme.mood.join("、") : "未提供";
    const preview = theme.preview && typeof theme.preview === "object"
      ? ["shell", "surface", "text", "accent"].map((key) => `${key}: ${theme.preview[key] ?? "未提供"}`).join(" / ")
      : "未提供";
    console.log(`\n${theme.nameZh || theme.name || theme.id} (${theme.id})`);
    console.log(`  简介：${theme.descriptionZh || theme.description || "未提供"}`);
    console.log(`  适合：${bestFor}`);
    console.log(`  气质：${mood}`);
    console.log(`  预览色：${preview}`);
  }
}
