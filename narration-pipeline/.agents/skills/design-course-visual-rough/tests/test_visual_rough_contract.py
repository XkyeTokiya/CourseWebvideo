from __future__ import annotations

import hashlib
import json
import copy
import re
import sys
import unittest
from pathlib import Path


SKILL_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SKILL_ROOT / "scripts"))

from visual_rough_contract import parse_visual_rough, validate_visual_rough  # noqa: E402
from recipe_library import load_recipe_directory  # noqa: E402


def source_document(page_count: int = 1) -> dict:
    pages = []
    for number in range(1, page_count + 1):
        pages.append(
            {
                "a_id": f"A{number:03d}",
                "must_visible": [
                    {
                        "semantic_item_id": f"V{number:03d}",
                        "meaning": f"页面 {number} 的必要语义",
                        "evidence_refs": ["E001"],
                    }
                ],
                "protected_relations": [],
            }
        )
    return {
        "schema_version": "courseplay-a-page/v4",
        "document_kind": "production",
        "episode_id": "episode-04",
        "evidence_catalog": [
            {
                "evidence_id": "E001",
                "claim_or_asset": "教材图原始资产",
                "source_locator": "教材图 1-3",
                "verification_status": "not applicable",
                "allowed_use": "只允许使用教材原图",
            }
        ],
        "pages": pages,
    }


def source_document_with_relation() -> dict:
    payload = source_document()
    payload["pages"][0]["protected_relations"] = [
        {
            "relation_id": "R001",
            "from": "页面前提",
            "relation": "形成",
            "to": "页面结果",
            "direction": "forward",
        }
    ]
    return payload


def source_hash(payload: dict) -> str:
    return hashlib.sha256(
        (json.dumps(payload, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    ).hexdigest()


def v6_guidance_fixture() -> tuple[dict, str]:
    fixture_root = (
        SKILL_ROOT.parents[3]
        / ".tmp"
        / "narration-pipeline"
        / "2026-08-31-courseplay-screen-text-lightweight-flow"
        / "fixtures"
    )
    source = json.loads((fixture_root / "episode-09-a-page-v5-slice.json").read_text(encoding="utf-8"))
    source["schema_version"] = "courseplay-a-page/v6"
    for page in source["pages"]:
        items = [page["screen"]["title"]]
        for group in page["screen"]["groups"]:
            items.extend(group["items"])
        for item in items:
            item["guidance_text"] = item.pop("source_text")
            item["usage_policy"] = "exact" if item.pop("edit_policy") == "exact" else "reference"
    rough = (fixture_root / "episode-09-visual-rough-v2-slice.md").read_text(encoding="utf-8")
    digest = source_hash(source)
    rough = rough.replace("courseplay-visual-rough/v2", "courseplay-visual-rough/v3", 1)
    rough = re.sub(r"(?m)^source_a_page_sha256: .+$", f"source_a_page_sha256: {digest}", rough)
    rough = rough.replace("- `headline <- S001`\n", "")
    rough = rough.replace("- `thesis <- S017`", "- `compare <- G017`\n- `compare <- G018`")
    rough = rough.replace("- `headline <- S022`\n", "")
    return source, rough


def one_page_rough(digest: str) -> str:
    return f"""---
schema_version: courseplay-visual-rough/v1
document_kind: production
episode_id: episode-04
source_a_page: episode-04-a-page.json
source_a_page_sha256: {digest}
status: approved
image_required_page_fraction: 1/3
logic_diagram_page_limit: 2
---

# EP04 视觉粗设

## 1. 单集视觉策略

- **默认载体**：结构化文字与实景图片。
- **逻辑图策略**：默认不用，仅在拓扑不可替代时申请。

## 2. 逐页视觉粗设

## A001｜问题场景

- **内容角色**：问题场景
- **页面配方**：`issue-cards-with-image`
- **论点标题**：系统已部署，问题仍然存在
- **辅助句**：用一个工业现场建立注意力。
- **媒体需求**：`M001` / `photorealistic_ai`
- **媒体作用**：建立真实工业现场的场景感
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 上屏内容组

1. [V001] **已部署**：页面 1 的必要语义
2. [V001] **仍有问题**：业务结果仍需判断
3. [V001] **现场感**：图片只负责建立情境

### 页面骨架

- 左侧问题卡，右侧图片区域，底部一句判断。

### 关系保真

- none
"""


def title_v_relation_groups_rough(digest: str, *, explain_relation: bool = True) -> str:
    rough = one_page_rough(digest)
    rough = rough.replace(
        "- **论点标题**：系统已部署，问题仍然存在",
        "- **论点标题**：[V001] 系统已部署，问题仍然存在",
    )
    rough = rough.replace("[V001] **", "[R001] **")
    if explain_relation:
        rough = rough.replace(
            "### 关系保真\n\n- none",
            "### 关系保真\n\n- [R001] 通过三张问题卡的共同阅读保留关系。",
        )
    return rough


class VisualRoughContractTests(unittest.TestCase):
    def setUp(self) -> None:
        self.source = source_document()
        self.registry, failures, _ = load_recipe_directory(
            SKILL_ROOT / "references" / "page-recipes"
        )
        self.assertEqual([], failures)

    def test_minimal_approved_document_passes(self) -> None:
        report = validate_visual_rough(
            source_payload=self.source,
            source_sha256=source_hash(self.source),
            rough_text=one_page_rough(source_hash(self.source)),
            registry=self.registry,
        )

        self.assertEqual([], report["failures"])
        self.assertEqual("visual-rough-v1", report["validation_profile"])
        self.assertEqual(1, report["image_allocation"]["required_page_count"])
        self.assertEqual(0, report["logic_diagrams"]["assigned_page_count"])

    def test_hash_and_semantic_coverage_are_enforced(self) -> None:
        rough = one_page_rough("0" * 64).replace("[V001]", "[V999]")
        report = validate_visual_rough(
            source_payload=self.source,
            source_sha256=source_hash(self.source),
            rough_text=rough,
            registry=self.registry,
        )

        self.assertIn("SOURCE_HASH_MISMATCH", report["failures"])
        self.assertIn("SEMANTIC_ITEM_UNKNOWN:A001:V999", report["failures"])
        self.assertIn("SEMANTIC_ITEM_MISSING:A001:V001", report["failures"])

    def test_supporting_line_none_passes(self) -> None:
        digest = source_hash(self.source)
        rough = one_page_rough(digest).replace(
            "- **辅助句**：用一个工业现场建立注意力。",
            "- **辅助句**：`none`",
        )

        report = validate_visual_rough(
            source_payload=self.source,
            source_sha256=digest,
            rough_text=rough,
            registry=self.registry,
        )

        self.assertEqual([], report["failures"])

    def test_headline_can_supply_semantic_coverage(self) -> None:
        source = source_document_with_relation()
        digest = source_hash(source)
        rough = title_v_relation_groups_rough(digest)

        report = validate_visual_rough(
            source_payload=source,
            source_sha256=digest,
            rough_text=rough,
            registry=self.registry,
        )

        self.assertEqual([], report["failures"])

    def test_unknown_headline_semantic_is_rejected(self) -> None:
        digest = source_hash(self.source)
        rough = one_page_rough(digest).replace(
            "- **论点标题**：系统已部署，问题仍然存在",
            "- **论点标题**：[V999] 系统已部署，问题仍然存在",
        )

        report = validate_visual_rough(
            source_payload=self.source,
            source_sha256=digest,
            rough_text=rough,
            registry=self.registry,
        )

        self.assertIn("SEMANTIC_ITEM_UNKNOWN:A001:V999", report["failures"])

    def test_content_group_requires_visible_source(self) -> None:
        digest = source_hash(self.source)
        rough = one_page_rough(digest).replace(
            "1. [V001] **已部署**",
            "1. **已部署**",
        )

        report = validate_visual_rough(
            source_payload=self.source,
            source_sha256=digest,
            rough_text=rough,
            registry=self.registry,
        )

        self.assertIn("CONTENT_GROUP_SOURCE_REQUIRED:A001:1", report["failures"])

    def test_unknown_visible_relation_is_rejected(self) -> None:
        digest = source_hash(self.source)
        rough = one_page_rough(digest).replace(
            "1. [V001] **已部署**",
            "1. [V001] [R999] **已部署**",
        )

        report = validate_visual_rough(
            source_payload=self.source,
            source_sha256=digest,
            rough_text=rough,
            registry=self.registry,
        )

        self.assertIn("VISIBLE_RELATION_UNKNOWN:A001:R999", report["failures"])

    def test_visible_relation_does_not_replace_relation_explanation(self) -> None:
        source = source_document_with_relation()
        digest = source_hash(source)
        rough = title_v_relation_groups_rough(digest, explain_relation=False)

        report = validate_visual_rough(
            source_payload=source,
            source_sha256=digest,
            rough_text=rough,
            registry=self.registry,
        )

        self.assertIn("RELATION_MISSING:A001:R001", report["failures"])

    def test_supporting_line_does_not_supply_semantic_coverage(self) -> None:
        source = source_document_with_relation()
        digest = source_hash(source)
        rough = title_v_relation_groups_rough(digest).replace(
            "- **论点标题**：[V001] 系统已部署，问题仍然存在",
            "- **论点标题**：系统已部署，问题仍然存在",
        ).replace(
            "- **辅助句**：用一个工业现场建立注意力。",
            "- **辅助句**：[V001] 用一个工业现场建立注意力。",
        )

        report = validate_visual_rough(
            source_payload=source,
            source_sha256=digest,
            rough_text=rough,
            registry=self.registry,
        )

        self.assertIn("SEMANTIC_ITEM_MISSING:A001:V001", report["failures"])

    def test_structural_takeaway_does_not_change_group_count_or_require_new_semantics(self) -> None:
        digest = source_hash(self.source)
        rough = one_page_rough(digest).replace(
            "- 左侧问题卡，右侧图片区域，底部一句判断。",
            "- 左侧问题卡，右侧图片区域。\n- 结构性 takeaway 综合 [V001]：系统已经部署，但仍需判断结果。",
        )

        parsed = parse_visual_rough(rough)
        report = validate_visual_rough(
            source_payload=self.source,
            source_sha256=digest,
            rough_text=rough,
            registry=self.registry,
        )

        self.assertEqual(3, parsed.pages[0].content_group_count)
        self.assertEqual([], report["failures"])

    def test_recipe_lifecycle_depends_on_rough_status(self) -> None:
        digest = source_hash(self.source)
        rough = one_page_rough(digest)
        experimental = copy.deepcopy(self.registry)
        next(
            item
            for item in experimental["recipes"]
            if item["recipe_id"] == "issue-cards-with-image"
        )["status"] = "experimental"
        report = validate_visual_rough(
            source_payload=self.source,
            source_sha256=digest,
            rough_text=rough,
            registry=experimental,
        )
        self.assertIn("EXPERIMENTAL_RECIPE_IN_APPROVED:A001", report["failures"])

        deprecated = copy.deepcopy(self.registry)
        next(
            item
            for item in deprecated["recipes"]
            if item["recipe_id"] == "issue-cards-with-image"
        )["status"] = "deprecated"
        approved_report = validate_visual_rough(
            source_payload=self.source,
            source_sha256=digest,
            rough_text=rough,
            registry=deprecated,
        )
        self.assertNotIn(
            "DEPRECATED_RECIPE_IN_NEW_DRAFT:A001", approved_report["failures"]
        )
        draft_report = validate_visual_rough(
            source_payload=self.source,
            source_sha256=digest,
            rough_text=rough.replace("status: approved", "status: draft"),
            registry=deprecated,
        )
        self.assertIn(
            "DEPRECATED_RECIPE_IN_NEW_DRAFT:A001", draft_report["failures"]
        )
        blocked = copy.deepcopy(self.registry)
        next(
            item
            for item in blocked["recipes"]
            if item["recipe_id"] == "issue-cards-with-image"
        )["status"] = "blocked"
        blocked_report = validate_visual_rough(
            source_payload=self.source,
            source_sha256=digest,
            rough_text=rough,
            registry=blocked,
        )
        self.assertIn(
            "RECIPE_STATUS_FORBIDDEN:A001:blocked", blocked_report["failures"]
        )

    def test_logic_diagram_is_restricted_and_capped(self) -> None:
        source = source_document(3)
        digest = source_hash(source)
        pages = []
        for number in range(1, 4):
            pages.append(
                f"""## A{number:03d}｜拓扑 {number}

- **内容角色**：关系解释
- **页面配方**：`logic-diagram`
- **论点标题**：只有拓扑可以保留含义
- **辅助句**：本页申请受控逻辑图。
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`yes`
- **逻辑图理由**：存在不可由卡片、对照、步骤或文字带保存的分支与汇聚拓扑关系

### 上屏内容组

1. [V{number:03d}] **节点一**：必要语义
2. [V{number:03d}] **节点二**：必要语义

### 页面骨架

- 单一拓扑，有限节点，无交叉连线。

### 关系保真

- none
"""
            )
        rough = f"""---
schema_version: courseplay-visual-rough/v1
document_kind: production
episode_id: episode-04
source_a_page: episode-04-a-page.json
source_a_page_sha256: {digest}
status: approved
image_required_page_fraction: 1/3
logic_diagram_page_limit: 2
---

# EP04 视觉粗设

## 1. 单集视觉策略

- **逻辑图策略**：只在必要时使用。

## 2. 逐页视觉粗设

{"".join(pages)}
"""
        report = validate_visual_rough(
            source_payload=source,
            source_sha256=digest,
            rough_text=rough,
            registry=self.registry,
        )

        self.assertIn("LOGIC_DIAGRAM_LIMIT_EXCEEDED:3:2", report["failures"])
        self.assertIn("RECIPE_STATUS_FORBIDDEN:A001:blocked", report["failures"])

    def test_v2_fixture_binds_screen_ids_without_copying_screen_source(self) -> None:
        fixture_root = (
            SKILL_ROOT.parents[3]
            / ".tmp"
        / "narration-pipeline"
            / "2026-08-31-courseplay-screen-text-lightweight-flow"
            / "fixtures"
        )
        source_path = fixture_root / "episode-09-a-page-v5-slice.json"
        rough_path = fixture_root / "episode-09-visual-rough-v2-slice.md"
        source_bytes = source_path.read_bytes()
        source = json.loads(source_bytes.decode("utf-8"))
        report = validate_visual_rough(
            source_payload=source,
            source_sha256=hashlib.sha256(source_bytes).hexdigest(),
            rough_text=rough_path.read_text(encoding="utf-8"),
            registry=self.registry,
        )

        self.assertEqual([], report["failures"])
        self.assertEqual("visual-rough-v2", report["validation_profile"])
        self.assertFalse(report["screen_source"]["source_text_copied"])

    def test_v2_rejects_screen_copy_and_silent_constraint_slot_binding(self) -> None:
        fixture_root = (
            SKILL_ROOT.parents[3]
            / ".tmp"
        / "narration-pipeline"
            / "2026-08-31-courseplay-screen-text-lightweight-flow"
            / "fixtures"
        )
        source_path = fixture_root / "episode-09-a-page-v5-slice.json"
        rough = (fixture_root / "episode-09-visual-rough-v2-slice.md").read_text(encoding="utf-8")
        source_bytes = source_path.read_bytes()
        source = json.loads(source_bytes.decode("utf-8"))
        rough = rough.replace("- `headline <- S001`", "- `headline <- C001`")
        rough = rough.replace("# EP09 视觉粗设 v2 候选切片", "# EP09 视觉粗设 v2 候选切片\n\n扫描认出发动机，追溯才刚刚开始")
        report = validate_visual_rough(
            source_payload=source,
            source_sha256=hashlib.sha256(source_bytes).hexdigest(),
            rough_text=rough,
            registry=self.registry,
        )

        self.assertIn("SILENT_CONSTRAINT_VISIBLE_SLOT:A001:skeleton", report["failures"])
        self.assertIn("SOURCE_TEXT_DUPLICATED:A001:S001", report["failures"])

    def test_v3_treats_title_as_direction_and_allows_multiple_groups_in_one_slot(self) -> None:
        source, rough = v6_guidance_fixture()
        report = validate_visual_rough(
            source_payload=source,
            source_sha256=source_hash(source),
            rough_text=rough,
            registry=self.registry,
        )

        self.assertEqual([], report["failures"])
        self.assertEqual("visual-rough-v3", report["validation_profile"])
        self.assertTrue(report["screen_guidance"]["groups_considered_in_rough_only"])
        self.assertNotIn("screen_source", report)

    def test_v3_requires_each_group_in_rough_but_not_a_title_slot(self) -> None:
        source, rough = v6_guidance_fixture()
        rough = rough.replace("- `after <- G018`\n", "").replace("- `compare <- G018`\n", "")
        failures = validate_visual_rough(
            source_payload=source,
            source_sha256=source_hash(source),
            rough_text=rough,
            registry=self.registry,
        )["failures"]
        self.assertIn("SLOT_BINDING_MISSING:A008:G018", failures)
        self.assertFalse(any(item == "SLOT_BINDING_MISSING:A008:S017" for item in failures))

    def test_v3_relation_carriers_are_a_complete_unordered_unique_set(self) -> None:
        source, rough = v6_guidance_fixture()
        r001 = next(line for line in rough.splitlines() if "[R001]" in line and line.startswith("-"))
        r002 = next(line for line in rough.splitlines() if "[R002]" in line and line.startswith("-"))
        reordered = rough.replace(f"{r001}\n{r002}", f"{r002}\n{r001}", 1)
        reordered_failures = validate_visual_rough(
            source_payload=source,
            source_sha256=source_hash(source),
            rough_text=reordered,
            registry=self.registry,
        )["failures"]
        self.assertEqual([], reordered_failures)

        duplicated = rough.replace(r001, f"{r001}\n{r001}", 1)
        duplicated_failures = validate_visual_rough(
            source_payload=source,
            source_sha256=source_hash(source),
            rough_text=duplicated,
            registry=self.registry,
        )["failures"]
        self.assertIn("RELATION_CARRIER_DUPLICATE:A001:R001", duplicated_failures)

    def test_v3_rejects_v5_source_and_copied_guidance(self) -> None:
        source, rough = v6_guidance_fixture()
        guidance = source["pages"][0]["screen"]["title"]["guidance_text"]
        copied = rough.replace("# EP09 视觉粗设 v2 候选切片", f"# EP09 视觉粗设 v2 候选切片\n\n{guidance}")
        source["schema_version"] = "courseplay-a-page/v5"
        failures = validate_visual_rough(
            source_payload=source,
            source_sha256=source_hash(source),
            rough_text=copied,
            registry=self.registry,
        )["failures"]
        self.assertIn("SOURCE_SCHEMA_VERSION_INVALID", failures)
        self.assertIn("SOURCE_TEXT_DUPLICATED:A001:S001", failures)


if __name__ == "__main__":
    unittest.main()








