from __future__ import annotations

import re
import sys
import unittest
from pathlib import Path


SKILL_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SKILL_ROOT / "scripts"))

from recipe_library import load_recipe_directory  # noqa: E402


class SkillContractTests(unittest.TestCase):
    def test_referenced_skill_assets_exist(self) -> None:
        for relative_path in (
            "references/page-recipes",
            "references/page-recipe-contract.md",
            "references/visual-rough-contract.md",
            "references/forbidden-visual-patterns.md",
            "templates/visual-rough-template.md",
            "templates/visual-rough-v3-template.md",
            "templates/page-recipe-template.md",
            "scripts/manage_recipes.py",
            "scripts/verify_visual_rough.py",
        ):
            self.assertTrue((SKILL_ROOT / relative_path).exists(), relative_path)

    def test_skill_declares_v4_input_v1_output_and_manual_registry(self) -> None:
        text = (SKILL_ROOT / "SKILL.md").read_text(encoding="utf-8")
        self.assertTrue(text.startswith("---\n"))
        self.assertRegex(text, re.compile(r"^name: design-course-visual-rough$", re.MULTILINE))
        self.assertIn("courseplay-a-page/v4", text)
        self.assertIn("courseplay-visual-rough/v1", text)
        self.assertIn("manage_recipes.py", text)
        self.assertIn("experimental", text)
        self.assertIn("页面配方缺口", text)
        self.assertIn("全篇绝对上限为两页", text)
        self.assertIn("page-recipes/*.md", text)
        self.assertIn("完整读取每份候选配方", text)
        self.assertIn("Agent 不得新增、编辑或激活配方", text)
        self.assertNotIn("page-recipe-registry.json", text)

    def test_parallel_json_registry_is_retired(self) -> None:
        self.assertFalse(
            (SKILL_ROOT / "references" / "page-recipe-registry.json").exists()
        )

    def test_v3_guidance_groups_are_rough_planning_not_downstream_sections(self) -> None:
        skill_text = (SKILL_ROOT / "SKILL.md").read_text(encoding="utf-8")
        contract_text = (SKILL_ROOT / "references" / "visual-rough-contract.md").read_text(encoding="utf-8")
        self.assertIn("courseplay-a-page/v6", skill_text)
        self.assertIn("courseplay-visual-rough/v3", skill_text)
        self.assertIn("不产生下游逐 G", skill_text)
        self.assertIn("不要求独立标题区", contract_text)
        self.assertIn("组内普通 S 不要求独立绑定", contract_text)

    def test_skill_declares_visible_mapping_and_structural_conclusions(self) -> None:
        skill_text = (SKILL_ROOT / "SKILL.md").read_text(encoding="utf-8")
        contract_text = (
            SKILL_ROOT / "references" / "visual-rough-contract.md"
        ).read_text(encoding="utf-8")
        template_text = (
            SKILL_ROOT / "templates" / "visual-rough-template.md"
        ).read_text(encoding="utf-8")

        for text in (skill_text, contract_text):
            self.assertIn("single_message", text)
            self.assertIn("exit_condition", text)
            self.assertIn("结构性结论槽", text)
            self.assertNotIn("唯一可见载体", text)
            self.assertNotIn("尚未承载", text)
        self.assertIn("辅助句默认写 `none`", skill_text)
        self.assertIn("V 覆盖取论点标题与上屏内容组的并集", contract_text)
        self.assertIn("不参与 V/R 覆盖", contract_text)
        self.assertIn("- **辅助句**：`none`", template_text)
        self.assertIn("不计入内容组数量或 V/R 覆盖", template_text)

    def test_recipe_directory_is_valid_and_broad_logic_recipe_is_blocked(self) -> None:
        registry, failures, _ = load_recipe_directory(
            SKILL_ROOT / "references" / "page-recipes"
        )
        self.assertEqual([], failures)
        recipes = {item["recipe_id"]: item for item in registry["recipes"]}
        self.assertGreaterEqual(len(recipes), 8)
        self.assertEqual("blocked", recipes["logic-diagram"]["status"])
        self.assertTrue(recipes["logic-diagram"]["is_logic_diagram"])
        self.assertTrue(all(item["recipe_id"] == key for key, item in recipes.items()))

    def test_integrated_closure_recipes_are_active_frozen_and_have_no_takeaway_slot(self) -> None:
        registry, failures, _ = load_recipe_directory(
            SKILL_ROOT / "references" / "page-recipes"
        )
        self.assertEqual([], failures)
        recipes = {item["recipe_id"]: item for item in registry["recipes"]}
        expected = {
            "split-compare-with-pivot": ["headline", "left", "pivot", "right"],
            "parallel-cards-self-contained": ["headline", "parallel-cards"],
            "linear-steps-to-result": ["headline", "steps", "terminal-result"],
            "image-with-insight-rail": ["headline", "image", "insight-rail"],
        }

        for recipe_id, slot_contract in expected.items():
            recipe = recipes[recipe_id]
            self.assertEqual("active", recipe["status"])
            self.assertNotEqual("pending", recipe["definition_sha256"])
            self.assertEqual(64, len(recipe["definition_sha256"]))
            self.assertEqual(slot_contract, recipe["slot_contract"])
            self.assertFalse(recipe["is_logic_diagram"])
            self.assertTrue(
                {"takeaway", "bottom-thesis", "final-judgment"}.isdisjoint(
                    recipe["slot_contract"]
                )
            )


if __name__ == "__main__":
    unittest.main()


