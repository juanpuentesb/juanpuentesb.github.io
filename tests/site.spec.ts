import { expect, test } from "@playwright/test";
import { PNG } from "pngjs";
import { isTranslationKey } from "../src/translations";

const screens = [
  { name: "small-laptop", width: 1280, height: 720 },
  { name: "laptop", width: 1366, height: 768 },
  { name: "large-laptop", width: 1440, height: 900 },
  { name: "scaled-laptop", width: 1536, height: 864, scale: 1.25 },
  { name: "desktop", width: 1920, height: 1080 },
  { name: "wide", width: 2560, height: 1300 },
  { name: "devtools", width: 1194, height: 720, scale: 2 },
  { name: "zoomed-laptop", width: 1093, height: 614 },
  { name: "breakpoint-below", width: 1239, height: 720 },
  { name: "breakpoint-above", width: 1240, height: 720 },
  { name: "globe-threshold", width: 981, height: 700 },
  { name: "tablet", width: 979, height: 700 },
  { name: "phone", width: 390, height: 844 },
  { name: "small-phone", width: 360, height: 740 },
];

function pixelChanges(first: Buffer, second: Buffer, globeOnly = false): number {
  const a = PNG.sync.read(first);
  const b = PNG.sync.read(second);
  expect([a.width, a.height]).toEqual([b.width, b.height]);
  let changed = 0;
  // At DPR 1 this area contains the globe, above the graph and clear of the portrait.
  const width = globeOnly ? Math.min(a.width, 260) : a.width;
  const height = globeOnly ? Math.min(a.height, 220) : a.height;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = (y * a.width + x) * 4;
      if ([0, 1, 2].some((c) => Math.abs(a.data[offset + c]! - b.data[offset + c]!) > 2)) changed++;
    }
  }
  return changed;
}

for (const screen of screens) {
  test(`layout and rendered scene: ${screen.name}`, async ({ browser }, testInfo) => {
    const context = await browser.newContext({
      viewport: { width: screen.width, height: screen.height },
      deviceScaleFactor: screen.scale || 1,
      colorScheme: "dark",
    });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.url().startsWith(testInfo.project.use.baseURL!) && response.status() >= 400) {
        errors.push(`${response.status()}: ${response.url()}`);
      }
    });
    await page.goto(testInfo.project.use.baseURL!);
    await expect(page.locator("[data-hero-scene]")).toHaveAttribute("data-renderer", "ready");
    await expect(page.locator('[data-profile="lastUpdated"]')).not.toHaveText("May 2026");
    const layout = await page.evaluate(() => {
      const copy = document.querySelector(".hero-copy")!.getBoundingClientRect();
      const profile = document.querySelector(".profile-panel")!.getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        overlap: copy.left < profile.right && copy.right > profile.left &&
          copy.top < profile.bottom && copy.bottom > profile.top,
      };
    });
    await expect(page.locator(".profile-portrait")).toBeVisible();
    expect(layout.overflow).toBe(false);
    expect(layout.overlap).toBe(false);
    await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
    for (const image of await page.locator("img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((element) =>
        element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0),
      ).toBe(true);
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: testInfo.outputPath("page.png"), fullPage: true });
    await expect.poll(() => page.locator("img").evaluateAll((images) =>
      images.every((image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0),
    )).toBe(true);
    await page.evaluate(() => scrollTo(0, 0));
    await page.addStyleTag({ content: ".hero-inner, .hero-chart-detail, .site-header { visibility: hidden !important; }" });
    await page.waitForTimeout(250);
    const canvas = page.locator(".hero-scene-canvas");
    const first = await canvas.screenshot({ scale: "css", path: testInfo.outputPath("scene-a.png") });
    await page.waitForTimeout(1500);
    const second = await canvas.screenshot({ scale: "css", path: testInfo.outputPath("scene-b.png") });
    const pixels = PNG.sync.read(first);
    const colors = new Set<number>();
    for (let i = 0; i < pixels.data.length; i += 16) {
      colors.add((pixels.data[i]! << 16) | (pixels.data[i + 1]! << 8) | pixels.data[i + 2]!);
    }
    expect(colors.size).toBeGreaterThan(30);
    if (screen.width >= 981) expect(pixelChanges(first, second, true)).toBeGreaterThan(10);
    if (screen.width <= 720) expect(pixelChanges(first, second)).toBe(0);
    expect(errors).toEqual([]);
    await context.close();
  });
}

test("languages, theme persistence, profile bio, contact draft and referral links", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("");
  await expect(page.locator("[data-hero-scene]")).toHaveAttribute("data-renderer", "ready");
  const keys = await page.locator("[data-i18n], [data-i18n-alt], [data-i18n-placeholder]").evaluateAll((elements) =>
    elements.flatMap((element) => ["data-i18n", "data-i18n-alt", "data-i18n-placeholder"]
      .map((attribute) => element.getAttribute(attribute)).filter((key) => key !== null)),
  );
  expect(keys.filter((key) => !isTranslationKey(key))).toEqual([]);
  await page.locator('[data-language="es"]').click();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator('[data-profile="etoroFullBio"]')).toContainText("colombiano");
  await page.locator(".theme-toggle").click();
  const theme = await page.locator("html").getAttribute("data-theme");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme!);
  await page.locator('[data-language="en"]').click();
  await page.locator("[data-bio-toggle]").click();
  await expect(page.locator(".full-bio-card")).toHaveClass(/is-expanded/);
  await page.locator("[data-copy-message]").click();
  await expect(page.locator("[data-contact-origin]")).toBeFocused();
  await page.locator("[data-contact-origin]").fill("Bogota, Colombia");
  await page.locator("[data-contact-location]").fill("Sydney, Australia");
  await expect(page.locator("[data-contact-message]")).toHaveValue(/Bogota, Colombia/);
  await page.locator("[data-contact-message]").fill("My own introduction");
  await page.locator("[data-contact-location]").fill("Melbourne, Australia");
  await expect(page.locator("[data-contact-message]")).toHaveValue("My own introduction");
  await page.locator("[data-copy-message]").click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("My own introduction");
  await page.locator("[data-contact-next]").click();
  await expect(page.locator("[data-contact-action]")).toHaveAttribute("href", /tiktok.com/);
  await page.locator("[data-contact-next]").click();
  await expect(page.locator("[data-contact-action]")).toHaveAttribute("href", /calendly.com.*utm_content=contact_section/);
  await expect(page.locator(".hero-actions a").first()).toHaveAttribute("href", /calendly.com.*utm_content=hero/);
  await expect(page.locator("[data-contact-next]")).toBeHidden();
  await page.locator("[data-contact-previous]").click();
  await expect(page.locator("[data-contact-action]")).toHaveAttribute("href", /tiktok.com/);
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.locator('a[href*="med.etoro.com"]')).toHaveCount(2);
});

test("reduced motion keeps the scene still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
  await page.goto("");
  await expect(page.locator("[data-hero-scene]")).toHaveAttribute("data-renderer", "ready");
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; } .hero-inner, .hero-chart-detail, .site-header { visibility: hidden !important; }" });
  await page.waitForTimeout(250);
  const canvas = page.locator(".hero-scene-canvas");
  const before = await canvas.screenshot();
  await page.waitForTimeout(1200);
  expect(pixelChanges(before, await canvas.screenshot())).toBe(0);
});

test("profile failure and unavailable WebGL keep contact controls usable", async ({ page }) => {
  await page.route("**/data/profile.json?*", (route) => route.fulfill({ status: 503, body: "" }));
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof getContext>) {
      if (String(args[0]).startsWith("webgl")) return null;
      return getContext.apply(this, args);
    } as typeof getContext;
  });
  await page.goto("");
  await expect(page.locator("[data-hero-scene]")).toHaveAttribute("data-renderer", "unavailable");
  await page.locator('[data-language="es"]').click();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await page.locator("[data-contact-next]").click();
  await page.locator("[data-contact-next]").click();
  await expect(page.locator("[data-contact-action]")).toHaveAttribute("href", /calendly.com/);
});

test("live resize keeps the globe available through laptop breakpoints", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("");
  await expect(page.locator("[data-hero-scene]")).toHaveAttribute("data-renderer", "ready");
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; } .hero-inner, .hero-chart-detail, .site-header { visibility: hidden !important; }" });
  for (const width of [1920, 1194, 981, 390, 1366]) {
    await page.setViewportSize({ width, height: 768 });
    await page.waitForTimeout(150);
    const canvas = page.locator(".hero-scene-canvas");
    const before = await canvas.screenshot({ scale: "css" });
    await page.waitForTimeout(1200);
    const after = await canvas.screenshot({ scale: "css" });
    if (width >= 981) expect(pixelChanges(before, after, true)).toBeGreaterThan(10);
  }
});
