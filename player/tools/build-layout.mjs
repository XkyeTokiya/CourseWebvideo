import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const MEDIA_EXTENSIONS = new Set([
  ".aac", ".avif", ".flac", ".gif", ".jpeg", ".jpg", ".m4a", ".mp3",
  ".mp4", ".ogg", ".png", ".svg", ".wav", ".webm", ".webp",
]);
const FONT_EXTENSIONS = new Set([".eot", ".otf", ".ttf", ".woff", ".woff2"]);

function normalize(value) {
  return value.replaceAll("\\", "/").split("?", 1)[0];
}

function sourcePaths(info) {
  const values = [
    ...(Array.isArray(info.originalFileNames) ? info.originalFileNames : []),
    info.originalFileName,
    info.name,
  ];
  return values.filter((value) => typeof value === "string").map(normalize);
}

function episodeSource(source) {
  const marker = source.match(/(?:^|\/)episodes\/(episode-[a-z0-9-]+)\/(.+)$/u);
  if (!marker) return null;
  const [, episodeId, relative] = marker;

  const audio = relative.match(/^media\/audio\/(.+)\/[^/]+$/u);
  if (audio) return { episodeId, kind: "audio", semanticPath: audio[1] };

  const chapterAsset = relative.match(/^src\/chapters\/([^/]+)\/assets\/(?:.+\/)?[^/]+$/u);
  if (chapterAsset) return { episodeId, kind: "images", semanticPath: chapterAsset[1] };

  const media = relative.match(/^media\/([^/]+)\/(.+)$/u);
  if (media) {
    const parent = path.posix.dirname(media[2]);
    return {
      episodeId,
      kind: media[1].replace(/[^a-z0-9-]/giu, "-").toLowerCase(),
      semanticPath: parent === "." ? "" : parent,
    };
  }

  return null;
}

function episodeIdFromPath(source) {
  return normalize(source).match(/(?:^|\/)episodes\/(episode-[a-z0-9-]+)(?:\/|$)/u)?.[1] ?? null;
}

function safeSegments(value) {
  if (!value) return [];
  const segments = normalize(value).split("/").filter(Boolean);
  if (segments.some((segment) => segment === "." || segment === "..")) {
    throw new Error(`Unsafe build asset path: ${value}`);
  }
  return segments.map((segment) => segment.replace(/[^a-z0-9._-]/giu, "-").toLowerCase());
}

export function episodeIdFromSources(sources) {
  const ids = new Set(sources.map(episodeIdFromPath).filter(Boolean));
  return ids.size === 1 ? [...ids][0] : null;
}

export function discoverSharedEpisodeMedia(root) {
  const episodesRoot = path.join(root, "episodes");
  const byDigest = new Map();

  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(absolute);
        continue;
      }
      const source = normalize(path.relative(root, absolute));
      const episode = episodeSource(source);
      if (!episode) continue;
      const digest = createHash("sha256").update(readFileSync(absolute)).digest("hex");
      const group = byDigest.get(digest) ?? [];
      group.push({ source, episodeId: episode.episodeId });
      byDigest.set(digest, group);
    }
  }

  visit(episodesRoot);
  return new Set(
    [...byDigest.values()]
      .filter((group) => new Set(group.map((item) => item.episodeId)).size > 1)
      .flatMap((group) => group.map((item) => item.source)),
  );
}

export function createAssetFileName(sharedSources = new Set()) {
  return function routeAsset(info) {
  const sources = sourcePaths(info);
  const episodeAssets = sources.map(episodeSource).filter(Boolean);
  const episodeIds = new Set(episodeAssets.map((item) => item.episodeId));
  const isKnownShared = sources.some((source) =>
    [...sharedSources].some((shared) => source === shared || source.endsWith(`/${shared}`)),
  );
  if (episodeIds.size > 1 || isKnownShared) {
    const kinds = new Set(episodeAssets.map((item) => item.kind));
    const kind = kinds.size === 1 ? [...kinds][0] : "media";
    return `media/shared/${kind}/[name]-[hash][extname]`;
  }

  const episode = episodeAssets[0];
  if (episode) {
    const semantic = safeSegments(episode.semanticPath).join("/");
    const prefix = `media/episodes/${episode.episodeId}/${episode.kind}`;
    return `${prefix}${semantic ? `/${semantic}` : ""}/[name]-[hash][extname]`;
  }

  const extension = path.posix.extname(normalize(info.name ?? "")).toLowerCase();
  if (extension === ".css") return "assets/styles/[name]-[hash][extname]";
  if (FONT_EXTENSIONS.has(extension)) return "assets/fonts/[name]-[hash][extname]";
  if (MEDIA_EXTENSIONS.has(extension)) return "assets/media/[name]-[hash][extname]";
  return "assets/misc/[name]-[hash][extname]";
  };
}

export const assetFileName = createAssetFileName();

export function chunkFileName(info) {
  const sources = [info.facadeModuleId, ...(info.moduleIds ?? [])]
    .filter((value) => typeof value === "string")
    .map(normalize);
  const episodeId = episodeIdFromSources(sources);
  return episodeId
    ? `assets/episodes/${episodeId}/scripts/[name]-[hash].js`
    : "assets/scripts/[name]-[hash].js";
}

function bytesOf(output) {
  if (output.type === "chunk") return Buffer.byteLength(output.code, "utf8");
  return typeof output.source === "string"
    ? Buffer.byteLength(output.source, "utf8")
    : output.source.byteLength;
}

function digestOf(output) {
  const content = output.type === "chunk" ? output.code : output.source;
  return createHash("sha256").update(content).digest("hex");
}

export function validateBuildLayout(bundle) {
  const errors = [];
  for (const [fileName, output] of Object.entries(bundle)) {
    const normalizedFile = normalize(fileName);
    if (normalizedFile.includes("/../") || normalizedFile.startsWith("../")) {
      errors.push(`${fileName}: output path escapes dist`);
    }
    if (output.type !== "asset") continue;

    const sources = sourcePaths(output);
    const episodeIds = new Set(sources.map(episodeSource).filter(Boolean).map((item) => item.episodeId));
    if (episodeIds.size > 1 && !normalizedFile.startsWith("media/shared/")) {
      errors.push(`${fileName}: cross-episode media must be emitted under media/shared/ (${[...episodeIds].join(", ")})`);
    }
    if (episodeIds.size === 1) {
      const [episodeId] = episodeIds;
      if (!normalizedFile.startsWith(`media/episodes/${episodeId}/`)) {
        errors.push(`${fileName}: media from ${episodeId} is outside its episode directory`);
      }
    }

    const extension = path.posix.extname(normalizedFile).toLowerCase();
    if (MEDIA_EXTENSIONS.has(extension) && /^assets\/[^/]+$/u.test(normalizedFile)) {
      errors.push(`${fileName}: media must not be flat in assets/`);
    }
  }
  return errors;
}

export function createBuildManifest(bundle) {
  const files = Object.entries(bundle)
    .filter(([fileName]) => fileName !== "manifests/assets.json")
    .map(([fileName, output]) => {
      const sources = output.type === "asset"
        ? sourcePaths(output).filter((source) => /(?:^|\/)episodes\//u.test(source))
        : output.moduleIds.map(normalize).filter((source) => /(?:^|\/)episodes\//u.test(source));
      const episodeIds = [...new Set(sources.map(episodeIdFromPath).filter(Boolean))].sort();
      return {
        path: normalize(fileName),
        type: output.type,
        episodeId: episodeIds.length === 1 ? episodeIds[0] : null,
        episodeIds,
        bytes: bytesOf(output),
        sha256: digestOf(output),
        sources: [...new Set(sources)].sort(),
      };
    })
    .sort((left, right) => left.path.localeCompare(right.path));

  return {
    schemaVersion: 1,
    strategy: "episode-isolated-content-hash-v1",
    totals: {
      files: files.length,
      bytes: files.reduce((sum, file) => sum + file.bytes, 0),
      episodes: new Set(files.flatMap((file) => file.episodeIds)).size,
    },
    files,
  };
}

async function listFiles(directory, prefix = "") {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...await listFiles(path.join(directory, entry.name), relative));
    else files.push(relative);
  }
  return files;
}

export async function createWrittenBuildManifest(outDir, bundle) {
  const metadata = new Map(
    Object.entries(bundle).map(([fileName, output]) => {
      const sources = output.type === "asset"
        ? sourcePaths(output).filter((source) => /(?:^|\/)episodes\//u.test(source))
        : output.moduleIds.map(normalize).filter((source) => /(?:^|\/)episodes\//u.test(source));
      return [normalize(fileName), { type: output.type, sources }];
    }),
  );
  const paths = (await listFiles(outDir))
    .map(normalize)
    .filter((fileName) => fileName !== "manifests/assets.json")
    .sort((left, right) => left.localeCompare(right));
  const files = await Promise.all(paths.map(async (fileName) => {
    const content = await readFile(path.join(outDir, ...fileName.split("/")));
    const item = metadata.get(fileName) ?? { type: "asset", sources: [] };
    const episodeIds = [...new Set(item.sources.map(episodeIdFromPath).filter(Boolean))].sort();
    return {
      path: fileName,
      type: item.type,
      episodeId: episodeIds.length === 1 ? episodeIds[0] : null,
      episodeIds,
      bytes: content.byteLength,
      sha256: createHash("sha256").update(content).digest("hex"),
      sources: [...new Set(item.sources)].sort(),
    };
  }));
  return {
    schemaVersion: 1,
    strategy: "episode-isolated-content-hash-v1",
    totals: {
      files: files.length,
      bytes: files.reduce((sum, file) => sum + file.bytes, 0),
      episodes: new Set(files.flatMap((file) => file.episodeIds)).size,
    },
    files,
  };
}

export function buildLayoutPlugin() {
  let outputDirectory = "";
  let generatedBundle = {};
  return {
    name: "courseplay-build-layout",
    apply: "build",
    configResolved(config) {
      outputDirectory = path.resolve(config.root, config.build.outDir);
    },
    generateBundle(_options, bundle) {
      const errors = validateBuildLayout(bundle);
      if (errors.length) this.error(`Invalid production asset layout:\n${errors.join("\n")}`);
      generatedBundle = bundle;
    },
    async closeBundle() {
      const manifest = await createWrittenBuildManifest(outputDirectory, generatedBundle);
      const manifestDirectory = path.join(outputDirectory, "manifests");
      const manifestPath = path.join(manifestDirectory, "assets.json");
      const temporaryPath = `${manifestPath}.tmp`;
      await mkdir(manifestDirectory, { recursive: true });
      await writeFile(
        temporaryPath,
        `${JSON.stringify(manifest, null, 2)}\n`,
      );
      await rename(temporaryPath, manifestPath);
    },
  };
}
