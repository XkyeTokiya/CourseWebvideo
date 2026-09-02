import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const fixturePath = path.resolve(
  import.meta.dirname,
  "fixtures/courseplay-screen-guidance-v3/review-cases.json",
);

test("v3 semantic review fixtures carry fixed reports without claiming automated judgment", async () => {
  const fixture = JSON.parse(await readFile(fixturePath, "utf8"));
  assert.equal(fixture.schema_version, "courseplay-screen-guidance-review-fixtures/v1");
  assert.match(fixture.fixture_scope, /不作为自动/u);
  assert.equal(fixture.cases.length, 8);
  const caseIds = new Set(fixture.cases.map((item) => item.case_id));
  assert.equal(caseIds.size, fixture.cases.length);
  for (const item of fixture.cases) {
    assert.match(item.a_page_id, /^A\d{3}$/u);
    assert.ok(item.rendered_summary.trim());
    const report = item.expected_report;
    assert.equal(report.schemaVersion, "web-video-chapter-review-attempt/v1");
    assert.equal(report.aPageId, item.a_page_id);
    assert.match(report.reviewId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u);
    assert.ok(["contract", "visual"].includes(report.lane));
    assert.ok(["passed", "must-fix"].includes(report.decision));
    assert.ok(Array.isArray(report.mustFix));
    assert.ok(Array.isArray(report.shouldFix));
    assert.equal(report.decision === "passed", report.mustFix.length === 0);
    assert.equal(Number.isNaN(Date.parse(report.recordedAt)), false);
    assert.equal(report.recordedBy, "self");
    assert.ok(Object.keys(report.sourceHashes).length > 0);
  }
});

test("v3 handoff template contains guidance, structure, relations, constraints, and freshness sources", async () => {
  const template = JSON.parse(await readFile(
    path.join(path.dirname(fixturePath), "handoff-template.json"),
    "utf8",
  ));
  assert.equal(template.schema_version, "web-video-courseplay-chapter-handoff/v3");
  assert.ok(template.screen_guidance.title.guidance_text);
  assert.equal(Object.hasOwn(template, "screen_source"), false);
  assert.ok(Array.isArray(template.presentation.slot_bindings));
  assert.ok(Array.isArray(template.steps));
  assert.ok(Array.isArray(template.protected_relations));
  assert.ok(Array.isArray(template.silent_constraints));
  assert.deepEqual(Object.keys(template.sources), ["project", "a_page", "visual_rough", "outline", "script"]);
});
