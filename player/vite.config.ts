import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as buildLayout from "./tools/build-layout.mjs";

export default defineConfig(({ command }) => {
  const sharedMediaSources = command === "build"
    ? buildLayout.discoverSharedEpisodeMedia(import.meta.dirname)
    : new Set<string>();

  return {
    plugins: [react(), buildLayout.buildLayoutPlugin()],
    build: {
      manifest: true,
      rolldownOptions: {
        output: {
          entryFileNames: "assets/scripts/[name]-[hash].js",
          chunkFileNames: buildLayout.chunkFileName,
          assetFileNames: buildLayout.createAssetFileName(sharedMediaSources),
        },
      },
    },
    server: {
      port: 5174,
      fs: { allow: ["."] },
      watch: {
        ignored: ["**/.pnpm-store/**", "**/.archive/**", "**/.tmp/**", "**/node_modules/**", "**/dist/**"],
      },
    },
    preview: {
      watch: {
        ignored: ["**/.pnpm-store/**", "**/.archive/**", "**/.tmp/**", "**/node_modules/**", "**/dist/**"],
      },
    },
  };
});
