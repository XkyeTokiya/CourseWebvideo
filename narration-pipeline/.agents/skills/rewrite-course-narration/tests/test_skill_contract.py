from __future__ import annotations

import re
import json
import unittest
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parents[1]
SKILL_MD = SKILL_ROOT / "SKILL.md"
SCHEMA = SKILL_ROOT / "references" / "courseplay-a-page.schema.json"
STAGE2 = SKILL_ROOT / "templates" / "stage2-a-page-compiler.md"
WORKFLOW = SKILL_ROOT / "references" / "workflow.md"
ACCEPTANCE = SKILL_ROOT / "references" / "acceptance-checklist.md"


class SkillContractTests(unittest.TestCase):
    def test_frontmatter_starts_at_first_byte_with_name_and_description(self) -> None:
        raw = SKILL_MD.read_bytes()
        self.assertTrue(raw.startswith(b"---\n"), "SKILL.md must start with --- at first byte")
        text = raw.decode("utf-8")
        self.assertIn("name:", text)
        self.assertIn("description:", text)

    def test_name_and_description_trigger_contract(self) -> None:
        text = SKILL_MD.read_text(encoding="utf-8")
        self.assertRegex(
            text,
            re.compile(r"^name:\s*rewrite-course-narration\s*$", re.MULTILINE),
        )
        description = re.search(r"^description:\s*(.+)$", text, re.MULTILINE)
        assert description is not None
        self.assertTrue(
            description.group(1).strip().startswith("Use when"),
            "description must start with 'Use when' and describe only the trigger",
        )

    def test_retired_polish_pipeline_is_absent_from_active_skill_tree(self) -> None:
        retired_identifiers = (
            "polish-course-" + "narration",
            "outputs/narration-" + "scripts-polished/",
        )
        text_suffixes = {".json", ".md", ".py", ".txt", ".yaml", ".yml"}
        violations: list[str] = []

        for path in SKILL_ROOT.rglob("*"):
            if not path.is_file() or path.suffix.lower() not in text_suffixes:
                continue
            text = path.read_text(encoding="utf-8")
            for identifier in retired_identifiers:
                if identifier in text:
                    violations.append(f"{path.relative_to(SKILL_ROOT)}: {identifier}")

        self.assertEqual([], violations, "retired pipeline residue must not remain")

    def test_five_step_workflow_is_present_in_order(self) -> None:
        text = SKILL_MD.read_text(encoding="utf-8")
        body = text.split("## Workflow", 1)[1]
        workflow = body.split("## A-page Contract", 1)[0]
        markers = (
            "1. **提炼 Brief**",
            "2. **隔离生成连续稿**",
            "3. **人工批准**",
            "4. **A 页面编译**",
            "5. **验收并正式发布**",
        )
        for marker in markers:
            self.assertIn(marker, workflow, f"workflow must mention {marker}")
        self.assertEqual(sorted(workflow.index(marker) for marker in markers), [workflow.index(marker) for marker in markers])

    def test_stage1_input_isolation_and_approval_gate(self) -> None:
        text = SKILL_MD.read_text(encoding="utf-8")
        self.assertIn("narration-brief.json", text)
        self.assertIn("approved-spoken-text.txt", text)
        self.assertIn("批准", text)
        # 批准前禁止 A 页面编译：正文必须出现明确的禁止语义
        self.assertTrue(
            "不" in text and "A 页面" in text,
            "SKILL.md must state that A-page compilation is forbidden before explicit approval",
        )

    def test_a_is_page_and_b_is_compile_time_only(self) -> None:
        text = SKILL_MD.read_text(encoding="utf-8")
        self.assertIn("一条 A 严格对应一页", text)
        self.assertIn("B 是编译期", text)
        self.assertIn("不进入正式 JSON", text)
        self.assertIn("A-page 不再提前做任何视觉或媒体决定", text)

    def test_v6_screen_guidance_uses_task_package_atoms_without_per_item_display_duty(self) -> None:
        skill = SKILL_MD.read_text(encoding="utf-8")
        stage2 = STAGE2.read_text(encoding="utf-8")
        workflow = WORKFLOW.read_text(encoding="utf-8")
        acceptance = ACCEPTANCE.read_text(encoding="utf-8")

        self.assertIn("screen guidance", skill)
        self.assertIn("不产生逐 S 落屏义务", skill)
        self.assertIn("guidance_text", skill)
        self.assertIn("usage_policy", skill)
        self.assertNotIn("`source_text` 是下游唯一屏幕文案来源", skill)
        self.assertIn("必须可见的信息", stage2)
        self.assertIn("语义原子", stage2)
        self.assertIn("方向、重点、事实边界和 exact 义务", stage2)
        self.assertIn("当前 A beats", stage2)
        self.assertIn("presentation", stage2)
        self.assertIn("不产生逐 S 落屏义务", stage2)
        self.assertNotIn("screen source", stage2)
        self.assertNotIn("JSON 是下游必须处理的屏幕内容基线", stage2)
        self.assertNotIn("不得遗漏 JSON 基线", stage2)
        self.assertIn("visible_source_units", workflow)
        self.assertIn("A → S", acceptance)

    def test_v4_is_semantic_only_and_routes_visual_work_later(self) -> None:
        text = SKILL_MD.read_text(encoding="utf-8")
        self.assertIn("courseplay-a-page/v4", text)
        self.assertIn("design-course-visual-rough", text)
        self.assertIn("禁止 `visual_form`", text)
        self.assertIn("media_catalog", text)
        self.assertIn("旧 Media Plan", text)

    def test_prohibitions_are_stated(self) -> None:
        text = SKILL_MD.read_text(encoding="utf-8")
        self.assertIn("冻结任务包", text)
        self.assertIn("只读", text)
        self.assertIn("subagent", text)
        self.assertTrue(
            "校验" in text or "验证" in text,
            "SKILL.md must mention verification/校验",
        )

    def test_all_referenced_assets_exist(self) -> None:
        text = SKILL_MD.read_text(encoding="utf-8")
        refs = re.findall(r"(?:references|templates|scripts)/[\w.-]+", text)
        self.assertTrue(refs, "SKILL.md must reference at least one asset under references/templates/scripts")
        for ref in refs:
            self.assertTrue(
                (SKILL_ROOT / ref).is_file(),
                f"referenced asset missing: {ref}",
            )

    def test_schema_exposes_only_the_v4_semantic_contract(self) -> None:
        schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
        self.assertEqual("courseplay-a-page-v4", schema["$id"])
        self.assertEqual("courseplay-a-page/v4", schema["properties"]["schema_version"]["const"])
        self.assertNotIn("image_policy", schema["required"])
        self.assertNotIn("media", schema["definitions"])
        page_properties = schema["definitions"]["page"]["properties"]
        for field_name in ("visual_form", "visual_priority", "media_refs"):
            self.assertNotIn(field_name, page_properties)


if __name__ == "__main__":
    unittest.main()


