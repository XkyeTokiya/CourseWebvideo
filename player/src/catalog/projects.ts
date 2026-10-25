import type { EpisodeCatalogEntry, EpisodeModule, EpisodeProject } from "../runtime/types";
import { isThemeId } from "../runtime/theme";

const projectModules = import.meta.glob<EpisodeProject>(
  "../../episodes/episode-*/project.json",
  { eager: true, query: "?raw", import: "default" },
);

const entryModules = import.meta.glob<EpisodeModule>(
  "../../episodes/episode-*/src/entry.tsx",
);

const loadedEpisodes = new Map<string, EpisodeModule>();
const pendingEpisodes = new Map<string, Promise<EpisodeModule>>();

export function getLoadedEpisode(id: string): EpisodeModule | null {
  return loadedEpisodes.get(id) ?? null;
}

function loadEpisode(id: string, loader: () => Promise<EpisodeModule>): Promise<EpisodeModule> {
  const loaded = loadedEpisodes.get(id);
  if (loaded) return Promise.resolve(loaded);
  const pending = pendingEpisodes.get(id);
  if (pending) return pending;
  const request = loader().then((module) => {
    loadedEpisodes.set(id, module);
    return module;
  }).finally(() => pendingEpisodes.delete(id));
  pendingEpisodes.set(id, request);
  return request;
}

function parseProject(raw: unknown, source: string): EpisodeProject {
  let project: unknown = raw;
  if (typeof raw === "string") {
    try {
      project = JSON.parse(raw);
    } catch {
      throw new Error(`Invalid project.json: ${source}`);
    }
  }
  if (!project || typeof project !== "object") {
    throw new Error(`Invalid project.json: ${source}`);
  }
  const value = project as Partial<EpisodeProject>;
  if (
    typeof value.id !== "string" ||
    typeof value.title !== "string" ||
    typeof value.status !== "string" ||
    typeof value.theme !== "string" ||
    !value.progress ||
    typeof value.progress !== "object" ||
    typeof value.updatedAt !== "string"
  ) {
    throw new Error(`Missing project fields: ${source}`);
  }
  if (!isThemeId(value.theme)) {
    throw new Error(`Unknown theme '${value.theme}': ${source}`);
  }
  return value as EpisodeProject;
}

function entryPath(id: string): string {
  return `../../episodes/${id}/src/entry.tsx`;
}

export const EPISODES: EpisodeCatalogEntry[] = Object.entries(projectModules)
  .map(([source, raw]) => {
    const project = parseProject(raw, source);
    const loader = entryModules[entryPath(project.id)];
    return {
      project,
      load: loader
        ? () => loadEpisode(project.id, loader)
        : async () => {
            throw new Error(`实例 ${project.id} 尚未提供 src/entry.tsx`);
          },
    };
  })
  .sort((a, b) => a.project.id.localeCompare(b.project.id));

export function findEpisode(id: string): EpisodeCatalogEntry | undefined {
  return EPISODES.find((entry) => entry.project.id === id);
}

export function preloadEpisode(id: string): void {
  const entry = findEpisode(id);
  if (entry && entry.project.status !== "planned") {
    // Preloading is opportunistic; a failed request can retry when opened.
    void entry.load().catch(() => {});
  }
}
