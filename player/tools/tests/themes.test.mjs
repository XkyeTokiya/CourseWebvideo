import assert from "node:assert/strict";
import test from "node:test";
import { assertThemeExists, listThemeIds } from "../theme-registry.mjs";

test("theme registry exposes every complete theme", async () => {
  const ids = await listThemeIds();
  assert.ok(ids.length >= 20, `expected at least 20 themes, got ${ids.length}`);
  assert.ok(ids.includes("active-identification-note"));
  assert.ok(ids.includes("industrial-clarity"));
  assert.equal(new Set(ids).size, ids.length);
});

test("theme registry rejects an unknown theme", async () => {
  await assert.rejects(assertThemeExists("missing-theme-for-test"), /主题不存在/);
});
