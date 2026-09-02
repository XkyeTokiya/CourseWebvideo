import assert from "node:assert/strict";
import test from "node:test";

import { validateScreenAdaptation } from "../screen-adaptation-contract.mjs";

function source() {
  return {
    title: {
      screen_item_id: "S001",
      source_text: "产品质量精度提升 40%",
      edit_policy: "adaptable",
      evidence_refs: ["E008"],
    },
    groups: [{
      group_id: "G001",
      items: [{
        screen_item_id: "S002",
        source_text: "质量追溯与质量分析人力成本降低 15% 以上",
        edit_policy: "exact",
        evidence_refs: ["E008"],
      }],
    }],
    protected_relations: [{ relation_id: "R001" }],
  };
}

function validFinal() {
  return [
    { screen_item_id: "S001", text: "产品质量改善 40%", evidence_refs: ["E008"], protected_relation_ids: ["R001"] },
    { screen_item_id: "S002", text: "质量追溯与质量分析人力成本降低 15% 以上", evidence_refs: ["E008"] },
  ];
}

test("accepts adaptable wording while preserving evidence and protected relations", () => {
  const result = validateScreenAdaptation({ screenSource: source(), finalVisibleItems: validFinal() });
  assert.equal(result.passed, true);
  assert.deepEqual(result.failures, []);
});

test("accepts additional visible text derived from the current A narration beats", () => {
  const result = validateScreenAdaptation({
    screenSource: source(),
    narrationBeats: [
      "设备已经接入网络，生产、计划、质量和供应链系统已经存在。",
      "现场数据仍靠人工汇总，异常仍靠电话协调。",
    ],
    finalVisibleItems: [
      ...validFinal(),
      {
        source_kind: "narration",
        narration_beat_indexes: [1, 2],
        text: "生产、计划、质量、供应链系统｜人工汇总｜电话协调",
      },
    ],
  });

  assert.equal(result.passed, true);
  assert.deepEqual(result.failures, []);
});

test("rejects narration text with invalid beats, new claims, evidence, or silent constraints", () => {
  const narrationBeats = ["产品质量精度提升 40%，不涉及企业品牌。"];
  const invalid = validateScreenAdaptation({
    screenSource: source(),
    narrationBeats,
    finalVisibleItems: [
      ...validFinal(),
      { source_kind: "narration", narration_beat_indexes: [2], text: "产品质量精度提升 40%" },
      { source_kind: "narration", narration_beat_indexes: [1], text: "产品质量精度提升 50%" },
      { source_kind: "narration", narration_beat_indexes: [1], text: "产品质量精度提升 40%，新增企业品牌" },
      { source_kind: "narration", narration_beat_indexes: [1], text: "产品质量精度提升 40%", evidence_refs: ["E999"] },
      { source_kind: "narration", narration_beat_indexes: [1], text: "产品质量精度提升 40%，C001", constraint_ids: ["C001"] },
    ],
    silentConstraints: [{ constraint_id: "C001", instruction: "不得显示企业品牌" }],
  });

  assert.ok(invalid.failures.includes("UNSUPPORTED_SCREEN_ITEM:narration[2]"));
  assert.ok(invalid.failures.includes("UNSUPPORTED_CLAIM:narration[3]"));
  assert.ok(invalid.failures.includes("UNSUPPORTED_CLAIM:narration[4]"));
  assert.ok(invalid.failures.includes("UNSUPPORTED_CLAIM:narration[5]"));
  assert.ok(invalid.failures.includes("SILENT_CONSTRAINT_LEAKAGE:narration[6]"));

  const missingBaseline = validateScreenAdaptation({
    screenSource: source(),
    narrationBeats,
    finalVisibleItems: [validFinal()[0], {
      source_kind: "narration",
      narration_beat_indexes: [1],
      text: "产品质量精度提升 40%",
    }],
  });
  assert.ok(missingBaseline.failures.includes("SCREEN_ITEM_MISSING:S002"));
});

test("requires exact source text and rejects changed quantities", () => {
  const exact = validFinal();
  exact[1].text = "质量追溯与质量分析人力成本降低 20% 以上";
  const result = validateScreenAdaptation({ screenSource: source(), finalVisibleItems: exact });
  assert.ok(result.failures.includes("EXACT_TEXT_CHANGED:S002"));

  const adaptable = validFinal();
  adaptable[0].text = "产品质量改善 50%";
  const quantityResult = validateScreenAdaptation({ screenSource: source(), finalVisibleItems: adaptable });
  assert.ok(quantityResult.failures.includes("SEMANTIC_QUANTITY_DRIFT:S001"));
});

test("rejects unsupported evidence, relation changes, and silent-constraint leakage", () => {
  const finalItems = validFinal();
  finalItems[0].evidence_refs = ["E999"];
  finalItems[0].silent_constraint_ids = ["C001"];
  finalItems[0].text = "产品质量改善 40%，C001";
  const result = validateScreenAdaptation({
    screenSource: source(),
    finalVisibleItems: finalItems,
    silentConstraints: [{ constraint_id: "C001", instruction: "不得外推为行业平均值" }],
    finalProtectedRelationIds: [],
  });
  assert.ok(result.failures.includes("UNSUPPORTED_EVIDENCE:S001:E999"));
  assert.ok(result.failures.includes("SILENT_CONSTRAINT_LEAKAGE:S001"));
  assert.ok(result.failures.includes("PROTECTED_RELATION_CHANGE"));
});
