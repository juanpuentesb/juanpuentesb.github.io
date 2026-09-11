import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  publicDir: false,
  plugins: [{
    name: "site-static-files",
    generateBundle() {
      // Keep the existing profile-refresh path and emit only explicit site files.
      for (const fileName of ["data/profile.json", ".nojekyll", "robots.txt", "sitemap.xml"]) {
        this.emitFile({
          type: "asset",
          fileName,
          source: readFileSync(new URL(fileName, import.meta.url)),
        });
      }
    },
  }],
});
