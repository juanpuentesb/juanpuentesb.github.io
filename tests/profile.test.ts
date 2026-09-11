import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { parseProfileData } from "../src/profile.ts";

test("accepts the refreshed profile used by the existing site", () => {
  const original = JSON.parse(readFileSync(new URL("../data/profile.json", import.meta.url), "utf8"));
  const result = parseProfileData(original);
  assert.equal(result?.etoro?.fullBio, original.etoro.fullBio);
  assert.equal(result?.etoro?.fullBioTranslations?.es, original.etoro.fullBioTranslations.es);
  assert.equal(result?.etoro?.avatarUrl, original.etoro.avatarUrl);
  assert.equal(result?.instagram?.aumDisplay, original.instagram.aumDisplay);
  assert.equal(result?.lastUpdated, original.lastUpdated);
});

test("rejects invalid top-level payloads", () => {
  for (const value of [null, [], 42, "profile"]) {
    assert.equal(parseProfileData(value), null);
  }
});

test("ignores malformed optional fields so handwritten content can remain", () => {
  const profile = parseProfileData({
    etoro: { investingSince: {}, fullBio: 42, fullBioTranslations: { es: [] } },
    instagram: { aumDisplay: "$910k+ AUM", summary: null },
    tiktok: [],
  });
  assert.equal(profile?.etoro?.investingSince, undefined);
  assert.equal(profile?.etoro?.fullBio, undefined);
  assert.equal(profile?.etoro?.fullBioTranslations?.es, undefined);
  assert.equal(profile?.instagram?.aumDisplay, "$910k+ AUM");
  assert.equal(profile?.tiktok, undefined);
});

test("accepts only HTTPS avatar URLs", () => {
  for (const avatarUrl of ["javascript:alert(1)", "http://example.com/avatar.jpg", "/avatar.jpg"]) {
    assert.equal(parseProfileData({ etoro: { avatarUrl } })?.etoro?.avatarUrl, undefined);
  }
  assert.equal(
    parseProfileData({ etoro: { avatarUrl: "https://example.com/avatar.jpg" } })?.etoro?.avatarUrl,
    "https://example.com/avatar.jpg",
  );
});
