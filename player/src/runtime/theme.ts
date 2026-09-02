const rawThemeModules = import.meta.glob<string>(
  "../../.agents/skills/web-video-presentation/themes/*/tokens.css",
  { eager: true, query: "?raw", import: "default" },
);

function themeIdFromPath(source: string): string | null {
  return source.match(/\/themes\/([^/]+)\/tokens\.css$/)?.[1] ?? null;
}

export const THEME_TOKENS: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(
    Object.entries(rawThemeModules).flatMap(([source, css]) => {
      const id = themeIdFromPath(source);
      return id ? [[id, css]] : [];
    }),
  ),
);

export type ThemeId = string;

export function isThemeId(value: string): boolean {
  return Object.hasOwn(THEME_TOKENS, value);
}

export function getThemeTokens(themeId: string): string {
  const css = THEME_TOKENS[themeId];
  if (!css) {
    const available = Object.keys(THEME_TOKENS).sort().join(", ");
    throw new Error(`Unknown theme '${themeId}'. Available themes: ${available}`);
  }
  return css;
}

export function listThemeIds(): string[] {
  return Object.keys(THEME_TOKENS).sort();
}
