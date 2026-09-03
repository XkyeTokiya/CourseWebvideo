import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = path.resolve(process.env.PLAYER_ROOT ?? process.cwd());
const dist = path.join(root, "dist");
const manifestPath = path.join(dist, "manifests", "assets.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const errors = [];

async function listFiles(directory, prefix = "") {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...await listFiles(path.join(directory, entry.name), relative));
    else files.push(relative.replaceAll("\\", "/"));
  }
  return files;
}

for (const file of manifest.files) {
  const absolute = path.resolve(dist, file.path);
  if (!absolute.startsWith(`${dist}${path.sep}`)) {
    errors.push(`${file.path}: path escapes dist`);
    continue;
  }
  try {
    const content = await readFile(absolute);
    const digest = createHash("sha256").update(content).digest("hex");
    if (content.byteLength !== file.bytes) errors.push(`${file.path}: byte size changed`);
    if (digest !== file.sha256) errors.push(`${file.path}: SHA-256 changed`);
  } catch {
    errors.push(`${file.path}: missing output file`);
  }
}

const flatAssets = (await readdir(path.join(dist, "assets"), { withFileTypes: true }).catch(() => []))
  .filter((entry) => entry.isFile() && /\.(?:aac|avif|flac|gif|jpe?g|m4a|mp3|mp4|ogg|png|svg|wav|webm|webp)$/iu.test(entry.name))
  .map((entry) => entry.name);
if (flatAssets.length) errors.push(`assets/ contains flat media: ${flatAssets.join(", ")}`);

const expectedPaths = new Set(manifest.files.map((file) => file.path));
const unexpectedPaths = (await listFiles(dist))
  .filter((file) => file !== "manifests/assets.json" && !expectedPaths.has(file));
if (unexpectedPaths.length) errors.push(`untracked output files: ${unexpectedPaths.join(", ")}`);

if (errors.length) {
  for (const error of errors) console.error(`ERROR ${error}`);
  process.exit(1);
}

const media = manifest.files.filter((file) => file.path.startsWith("media/episodes/"));
const shared = manifest.files.filter((file) => file.path.startsWith("media/shared/"));
const episodeIds = new Set(manifest.files.flatMap((file) => file.episodeIds ?? []));
console.log(`build:inspect passed: ${manifest.totals.files} files, ${media.length} isolated media assets, ${shared.length} shared media assets, ${episodeIds.size} episodes`);
