import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  workers: 2,
  timeout: 45_000,
  reporter: "list",
  use: {
    baseURL: process.env.SITE_TEST_URL || "http://127.0.0.1:4175/dev/",
    browserName: "chromium",
    channel: process.env.CI ? undefined : "chrome",
    launchOptions: { args: ["--enable-webgl", "--ignore-gpu-blocklist", "--use-angle=swiftshader"] },
    trace: "retain-on-failure",
  },
  webServer: process.env.SITE_TEST_URL ? undefined : {
    command: "node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4175 --strictPort --base /dev/",
    url: "http://127.0.0.1:4175/dev/",
    reuseExistingServer: false,
  },
});
