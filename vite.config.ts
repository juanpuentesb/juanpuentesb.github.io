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
      this.emitFile({
        type: "asset",
        fileName: "third-party-licenses.txt",
        source: ["three/LICENSE", "vite/LICENSE.md"].map((path) =>
          path + "\n\n" + readFileSync(new URL(`node_modules/${path}`, import.meta.url), "utf8"),
        ).join("\n\n"),
      });
    },
  }],
});
