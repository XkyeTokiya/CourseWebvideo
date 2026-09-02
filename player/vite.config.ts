import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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
});
