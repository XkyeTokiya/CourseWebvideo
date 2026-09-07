from __future__ import annotations

import json
import sys
import unittest
from pathlib import Path

SKILL = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SKILL / "scripts"))
from recipe_library import load_recipe_directory  # noqa: E402


class RecipeV2AndSkillTests(unittest.TestCase):
    def test_recipe_v2_registry_is_valid_and_has_no_broad_logic_recipe(self) -> None:
        registry, failures, digest = load_recipe_directory(SKILL / "references/page-recipes")
        self.assertEqual([], failures)
        self.assertEqual("courseplay-page-recipe-registry/v3", registry["schema_version"])
        self.assertEqual(64, len(digest))
        self.assertNotIn("logic-diagram", {recipe["recipe_id"] for recipe in registry["recipes"]})
        for recipe in registry["recipes"]:
            self.assertIn("content_unit_min", recipe)
            self.assertIn("content_unit_max", recipe)
            self.assertNotIn("content_group_min", recipe)

    def test_active_skill_exposes_only_current_contract(self) -> None:
        skill = (SKILL / "SKILL.md").read_text(encoding="utf-8")
        contract = (SKILL / "references/visual-rough-contract.md").read_text(encoding="utf-8")
        template = SKILL / "templates/visual-rough-v4-template.md"
        self.assertTrue(template.is_file())
        for text in (skill, contract, template.read_text(encoding="utf-8")):
            self.assertIn("courseplay-visual-rough/v4", text)
            self.assertNotIn("courseplay-visual-rough/v3", text)
        catalog = json.loads((SKILL / "references/error-catalog.json").read_text(encoding="utf-8"))
        self.assertTrue(catalog["errors"])


if __name__ == "__main__":
    unittest.main()
