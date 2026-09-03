import assert from "node:assert/strict";
import test from "node:test";
import {
  assetFileName,
  chunkFileName,
  createAssetFileName,
  createBuildManifest,
  validateBuildLayout,
} from "../build-layout.mjs";

test("routes episode audio by episode and chapter", () => {
  assert.equal(
    assetFileName({
      name: "1.mp3",
      originalFileNames: ["D:/repo/episodes/episode-03/media/audio/chapter-one/1.mp3"],
    }),
    "media/episodes/episode-03/audio/chapter-one/[name]-[hash][extname]",
  );
});

test("routes chapter images by episode and chapter", () => {
  assert.equal(
    assetFileName({
      name: "m001.png",
      originalFileNames: ["episodes/episode-09/src/chapters/01-after-scan/assets/m001.png"],
    }),
    "media/episodes/episode-09/images/01-after-scan/[name]-[hash][extname]",
  );
});

test("keeps application assets separated by type", () => {
  assert.equal(assetFileName({ name: "index.css" }), "assets/styles/[name]-[hash][extname]");
  assert.equal(assetFileName({ name: "logo.svg" }), "assets/media/[name]-[hash][extname]");
});

test("routes byte-identical cross-episode media to the shared pool", () => {
  const routeAsset = createAssetFileName(new Set([
    "episodes/episode-03/src/chapters/01-intro/assets/m001.png",
    "episodes/episode-04/src/chapters/01-intro/assets/m001.png",
  ]));
  assert.equal(
    routeAsset({
      name: "m001.png",
      originalFileNames: ["episodes/episode-04/src/chapters/01-intro/assets/m001.png"],
    }),
    "media/shared/images/[name]-[hash][extname]",
  );
});

test("routes episode chunks independently from shared chunks", () => {
  assert.equal(
    chunkFileName({ facadeModuleId: "episodes/episode-04/src/entry.tsx", moduleIds: [] }),
    "assets/episodes/episode-04/scripts/[name]-[hash].js",
  );
  assert.equal(
    chunkFileName({ facadeModuleId: "src/main.tsx", moduleIds: ["src/app/App.tsx"] }),
    "assets/scripts/[name]-[hash].js",
  );
});

test("rejects episode media emitted outside its isolated directory", () => {
  const errors = validateBuildLayout({
    "assets/1-hash.mp3": {
      type: "asset",
      name: "1.mp3",
      originalFileNames: ["episodes/episode-01/media/audio/intro/1.mp3"],
      source: new Uint8Array([1, 2, 3]),
    },
  });
  assert.equal(errors.length, 2);
});

test("manifest records integrity and episode ownership", () => {
  const manifest = createBuildManifest({
    "media/episodes/episode-01/audio/intro/1-hash.mp3": {
      type: "asset",
      name: "1.mp3",
      originalFileNames: ["episodes/episode-01/media/audio/intro/1.mp3"],
      source: new Uint8Array([1, 2, 3]),
    },
  });
  assert.equal(manifest.totals.files, 1);
  assert.equal(manifest.totals.episodes, 1);
  assert.equal(manifest.files[0].episodeId, "episode-01");
  assert.deepEqual(manifest.files[0].episodeIds, ["episode-01"]);
  assert.equal(manifest.files[0].bytes, 3);
  assert.equal(manifest.files[0].sha256.length, 64);
});
