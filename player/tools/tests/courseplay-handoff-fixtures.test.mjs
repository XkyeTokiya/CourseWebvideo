import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const workspaceRoot = path.resolve(import.meta.dirname, "../..");
const v1Root = path.join(workspaceRoot, "tools/tests/fixtures/courseplay-handoff-v1");
const v2Root = path.join(workspaceRoot, "tools/tests/fixtures/courseplay-handoff-v2");

async function read(relativePath) {
  return readFile(path.join(workspaceRoot, relativePath), "utf8");
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function countOccurrences(source, needle) {
  let count = 0;
  let offset = 0;
  while (true) {
    const index = source.indexOf(needle, offset);
    if (index < 0) return count;
    count += 1;
    offset = index + needle.length;
  }
}

function screenItems(packet) {
  return [
    ...(packet.screen_source.title ? [packet.screen_source.title] : []),
    ...packet.screen_source.groups.flatMap((group) => group.items),
  ];
}

test("freezes only the legacy v1 raw-byte baseline", async () => {
  const manifest = JSON.parse(await read("tools/tests/fixtures/courseplay-handoff-v2/raw-byte-manifest.json"));
  assert.equal(manifest.encoding, "UTF-8");
  assert.equal(manifest.normalization, "raw bytes; no newline or whitespace normalization");

  const legacyEntries = manifest.entries.filter((entry) => entry.path.includes("courseplay-handoff-v1/"));
  assert.ok(legacyEntries.length > 0);
  for (const entry of legacyEntries) {
    const bytes = await readFile(path.join(workspaceRoot, entry.path));
    assert.equal(bytes.byteLength, entry.bytes, `${entry.path} byte count changed`);
    assert.equal(sha256(bytes), entry.sha256, `${entry.path} SHA-256 changed`);
  }
});

test("v2 candidate packets are compact, source-complete, and do not embed source documents", async () => {
  const baseline = JSON.parse(await read("tools/tests/fixtures/courseplay-handoff-v2/baseline.json"));
  assert.equal(baseline.repository.working_tree.dirty, true);
  assert.ok(baseline.repository.head);
  assert.equal(baseline.generator.path, "tools/courseplay-handoff.mjs");
  assert.equal(baseline.fixed_consumer_context.delta_bytes, 0);
  assert.equal(
    baseline.fixed_consumer_context.candidate_total_bytes,
    baseline.fixed_consumer_context.current_total_bytes,
  );

  for (const comparison of baseline.candidate_v2.packets) {
    const v1 = baseline.legacy_v1.packets.find((entry) => entry.a_page_id === comparison.a_page_id);
    assert.ok(v1, `${comparison.a_page_id} is missing from the v1 baseline`);
    assert.ok(comparison.bytes <= v1.bytes, `${comparison.a_page_id} v2 packet grew`);

    const relativePath = `tools/tests/fixtures/courseplay-handoff-v2/episode-09/${comparison.a_page_id}.json`;
    const source = await read(relativePath);
    const packet = JSON.parse(source);
    assert.equal(packet.schema_version, "web-video-courseplay-chapter-handoff/v2");
    assert.equal(packet.chapter.a_page_id, comparison.a_page_id);
    assert.equal(packet.chapter.step_count, packet.narration.beats.length);
    assert.ok(packet.screen_source.groups.length > 0);
    assert.equal(Object.hasOwn(packet, "a_page"), false);
    assert.equal(Object.hasOwn(packet, "outline"), false);
    assert.equal(Object.hasOwn(packet, "visual_rough_markdown"), false);
    assert.equal(source.includes("\"must_visible\""), false);
    assert.equal(source.includes("## 1. after-scan"), false);
    assert.equal(source.includes("## A001｜"), false);

    const items = screenItems(packet);
    assert.ok(items.length > 0);
    for (const item of items) {
      assert.ok(item.source_text.trim(), `${comparison.a_page_id} has empty screen source`);
      assert.equal(countOccurrences(source, item.source_text), 1, `${item.screen_item_id} is not projected once`);
      assert.ok(["adaptable", "exact"].includes(item.edit_policy));
      assert.ok(item.evidence_refs.length > 0);
    }

    assert.deepEqual(
      packet.sources,
      {
        a_page: {
          path: "tools/tests/fixtures/courseplay-handoff-v2/episode-09/episode-09-a-page-v5-slice.json",
          sha256: "2f5e113535347efd2a24b0523bc5586cbaf8bfd3fe95989c50133cea1e4840fc",
        },
        visual_rough: {
          path: "tools/tests/fixtures/courseplay-handoff-v2/episode-09/episode-09-visual-rough-v2-slice.md",
          sha256: "e6ca0a746c84281a9afbc3659e3e69a5c31e3e3bdab243a6a60fa151fb1e0e0a",
        },
        outline: {
          path: "tools/tests/fixtures/courseplay-handoff-v2/episode-09/outline-screen-source-slice.md",
          sha256: "db2e09797ef2ac4065ee3c44ca8b157a6273651cfad298372bd42158dca3fc69",
        },
      },
    );
  }
});

test("keeps A009 explicitly candidate-only while retaining the case and three quantities", async () => {
  const packet = JSON.parse(await read("tools/tests/fixtures/courseplay-handoff-v2/episode-09/A009.json"));
  assert.match(packet.fixture_status, /candidate-only/);
  assert.equal(packet.narration.authority, "candidate_a_page.nx");
  assert.equal(packet.narration.beats.length, 3);
  assert.match(packet.narration.beats[0], /某集团发动机质量追溯案例/);
  assert.match(packet.narration.beats[0], /百分之四十/);
  assert.match(packet.narration.beats[1], /百分之十五以上/);
  assert.match(packet.narration.beats[2], /百分之十五以上/);
  assert.deepEqual(
    packet.silent_constraints.map((constraint) => constraint.constraint_id),
    ["C020", "C021", "C022"],
  );
  assert.equal(packet.presentation.slot_bindings.includes("inference-boundary <- none"), true);
});

test("reports the three fixed consumer references without a candidate byte ceiling", async () => {
  const baseline = JSON.parse(await read("tools/tests/fixtures/courseplay-handoff-v2/baseline.json"));
  const total = baseline.fixed_consumer_context.current_required_files.reduce(
    (sum, file) => sum + file.bytes,
    0,
  );
  assert.equal(total, baseline.fixed_consumer_context.current_total_bytes);
  assert.equal(baseline.fixed_consumer_context.current_required_files.length, 3);
  assert.equal(baseline.fixed_consumer_context.candidate_total_bytes <= total, true);
  const actualTotal = await Promise.all(
    baseline.fixed_consumer_context.current_required_files.map(({ path: relativePath }) =>
      stat(path.join(workspaceRoot, relativePath)).then((file) => file.size)),
  ).then((sizes) => sizes.reduce((sum, size) => sum + size, 0));
  assert.ok(actualTotal > 0);
  assert.equal(await stat(path.join(v1Root, "episode-09/outline.md")).then((file) => file.size), 38811);
  assert.equal(await stat(path.join(v2Root, "template.json")).then((file) => file.size), 1316);
});
