from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SKILL_ROOT = Path(__file__).resolve().parents[1]
CLI_PATH = SKILL_ROOT / "scripts" / "manage_recipes.py"
sys.path.insert(0, str(SKILL_ROOT / "scripts"))

from recipe_library import load_recipe_directory  # noqa: E402


VALID_RECIPE = """---
schema_version: courseplay-page-recipe/v1
recipe_id: two-panel-case-review
status: experimental
content_group_min: 2
content_group_max: 3
media_mode: forbidden
is_logic_diagram: false
slot_contract: headline | left-panel | right-panel | takeaway
downstream_layouts: two-column
definition_sha256: pending
---

# 用途

两栏分别承载情境与判断。

# 正例

两栏各自完整表达，底部给出共同判断。

# 反例

不得增加跨栏逻辑连线或中转节点。
"""


class RecipeDirectoryTests(unittest.TestCase):
    def test_manually_added_markdown_is_discovered(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            recipes_dir = Path(temporary_directory)
            (recipes_dir / "two-panel-case-review.md").write_text(
                VALID_RECIPE, encoding="utf-8"
            )

            registry, failures, _ = load_recipe_directory(recipes_dir)

            self.assertEqual([], failures)
            self.assertEqual(
                ["two-panel-case-review"],
                [recipe["recipe_id"] for recipe in registry["recipes"]],
            )

    def test_normalized_registry_is_sorted_and_hash_is_deterministic(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            recipes_dir = Path(temporary_directory)
            second = VALID_RECIPE.replace(
                "two-panel-case-review", "alpha-case-review"
            )
            (recipes_dir / "two-panel-case-review.md").write_text(
                VALID_RECIPE, encoding="utf-8"
            )
            (recipes_dir / "alpha-case-review.md").write_text(second, encoding="utf-8")
            first_registry, first_failures, first_hash = load_recipe_directory(recipes_dir)
            second_registry, second_failures, second_hash = load_recipe_directory(recipes_dir)
            self.assertEqual([], first_failures)
            self.assertEqual([], second_failures)
            self.assertEqual(first_registry, second_registry)
            self.assertEqual(first_hash, second_hash)
            self.assertEqual(
                ["alpha-case-review", "two-panel-case-review"],
                [item["recipe_id"] for item in first_registry["recipes"]],
            )


class RecipeManagerCliTests(unittest.TestCase):
    def _run(self, recipes_dir: Path, *arguments: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [
                sys.executable,
                "-B",
                str(CLI_PATH),
                "--recipes-dir",
                str(recipes_dir),
                *arguments,
            ],
            capture_output=True,
            text=True,
            encoding="utf-8",
        )

    def test_new_scaffolds_experimental_markdown(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            recipes_dir = Path(temporary_directory) / "page-recipes"
            result = self._run(
                recipes_dir, "new", "--recipe-id", "two-panel-case-review"
            )
            self.assertEqual(0, result.returncode, result.stdout + result.stderr)
            text = (recipes_dir / "two-panel-case-review.md").read_text(encoding="utf-8")
            self.assertIn("status: experimental", text)
            self.assertIn("definition_sha256: pending", text)

    def test_activation_writes_hash_and_structural_edit_is_detected(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            recipes_dir = Path(temporary_directory) / "page-recipes"
            recipes_dir.mkdir()
            path = recipes_dir / "two-panel-case-review.md"
            path.write_text(VALID_RECIPE, encoding="utf-8")
            activated = self._run(
                recipes_dir,
                "set-status",
                "--recipe-id",
                "two-panel-case-review",
                "--status",
                "active",
            )
            self.assertEqual(0, activated.returncode, activated.stdout + activated.stderr)
            activated_text = path.read_text(encoding="utf-8")
            self.assertNotIn("definition_sha256: pending", activated_text)
            path.write_text(
                activated_text.replace("content_group_max: 3", "content_group_max: 4"),
                encoding="utf-8",
            )
            _, failures, _ = load_recipe_directory(recipes_dir)
            self.assertTrue(
                any("RECIPE_DEFINITION_HASH_DRIFT" in failure for failure in failures)
            )

    def test_clone_creates_new_experimental_id(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            recipes_dir = Path(temporary_directory) / "page-recipes"
            recipes_dir.mkdir()
            (recipes_dir / "two-panel-case-review.md").write_text(
                VALID_RECIPE, encoding="utf-8"
            )
            result = self._run(
                recipes_dir,
                "clone",
                "--recipe-id",
                "two-panel-case-review",
                "--new-recipe-id",
                "two-panel-case-review-v2",
            )
            self.assertEqual(0, result.returncode, result.stdout + result.stderr)
            cloned = (recipes_dir / "two-panel-case-review-v2.md").read_text(
                encoding="utf-8"
            )
            self.assertIn("recipe_id: two-panel-case-review-v2", cloned)
            self.assertIn("status: experimental", cloned)

    def test_specific_logic_recipe_can_only_activate_as_restricted(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            recipes_dir = Path(temporary_directory) / "page-recipes"
            recipes_dir.mkdir()
            logic_text = VALID_RECIPE.replace(
                "two-panel-case-review", "branch-merge-topology"
            ).replace("is_logic_diagram: false", "is_logic_diagram: true").replace(
                "downstream_layouts: two-column", "downstream_layouts: flow-diagram"
            )
            (recipes_dir / "branch-merge-topology.md").write_text(
                logic_text, encoding="utf-8"
            )
            active = self._run(
                recipes_dir,
                "set-status",
                "--recipe-id",
                "branch-merge-topology",
                "--status",
                "active",
            )
            self.assertEqual(1, active.returncode)
            self.assertIn("LOGIC_RECIPE_REQUIRES_RESTRICTED", active.stderr)
            restricted = self._run(
                recipes_dir,
                "set-status",
                "--recipe-id",
                "branch-merge-topology",
                "--status",
                "restricted",
            )
            self.assertEqual(0, restricted.returncode, restricted.stdout + restricted.stderr)
            self.assertIn(
                "branch-merge-topology\trestricted", self._run(recipes_dir, "list").stdout
            )

    def test_referenced_experimental_and_active_recipe_cannot_be_removed(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            recipes_dir = root / "page-recipes"
            recipes_dir.mkdir()
            path = recipes_dir / "two-panel-case-review.md"
            path.write_text(VALID_RECIPE, encoding="utf-8")
            (root / "rough.md").write_text(
                "- **页面配方**：`two-panel-case-review`\n", encoding="utf-8"
            )
            referenced = self._run(
                recipes_dir, "remove", "--recipe-id", "two-panel-case-review"
            )
            self.assertEqual(1, referenced.returncode)
            self.assertIn("RECIPE_REMOVE_REFERENCED", referenced.stderr)
            (root / "rough.md").unlink()
            self.assertEqual(
                0,
                self._run(
                    recipes_dir,
                    "set-status",
                    "--recipe-id",
                    "two-panel-case-review",
                    "--status",
                    "active",
                ).returncode,
            )
            active = self._run(
                recipes_dir, "remove", "--recipe-id", "two-panel-case-review"
            )
            self.assertEqual(1, active.returncode)
            self.assertIn("RECIPE_REMOVE_REQUIRES_EXPERIMENTAL", active.stderr)
            deprecated = self._run(
                recipes_dir,
                "set-status",
                "--recipe-id",
                "two-panel-case-review",
                "--status",
                "deprecated",
            )
            self.assertEqual(0, deprecated.returncode, deprecated.stdout + deprecated.stderr)
            self.assertIn(
                "two-panel-case-review\tdeprecated", self._run(recipes_dir, "list").stdout
            )

    def test_unreferenced_pending_experimental_recipe_can_be_removed(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            recipes_dir = Path(temporary_directory) / "page-recipes"
            recipes_dir.mkdir()
            (recipes_dir / "two-panel-case-review.md").write_text(
                VALID_RECIPE, encoding="utf-8"
            )
            result = self._run(
                recipes_dir, "remove", "--recipe-id", "two-panel-case-review"
            )
            self.assertEqual(0, result.returncode, result.stdout + result.stderr)
            self.assertFalse((recipes_dir / "two-panel-case-review.md").exists())

    def test_validate_and_list_expose_directory_state(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            recipes_dir = Path(temporary_directory) / "page-recipes"
            recipes_dir.mkdir()
            (recipes_dir / "two-panel-case-review.md").write_text(
                VALID_RECIPE, encoding="utf-8"
            )
            validated = self._run(recipes_dir, "validate")
            self.assertEqual(0, validated.returncode, validated.stdout + validated.stderr)
            self.assertIn("PASS recipes=1 sha256=", validated.stdout)
            listed = self._run(recipes_dir, "list")
            self.assertEqual(0, listed.returncode, listed.stdout + listed.stderr)
            self.assertIn("two-panel-case-review\texperimental", listed.stdout)


class RecipeValidationTests(unittest.TestCase):
    def _failures_for(self, filename: str, text: str) -> list[str]:
        with tempfile.TemporaryDirectory() as temporary_directory:
            recipes_dir = Path(temporary_directory)
            (recipes_dir / filename).write_text(text, encoding="utf-8")
            _, failures, _ = load_recipe_directory(recipes_dir)
            return failures

    def test_filename_and_id_must_match(self) -> None:
        failures = self._failures_for("wrong-name.md", VALID_RECIPE)
        self.assertTrue(any("RECIPE_FILENAME_ID_MISMATCH" in item for item in failures))

    def test_missing_field_illegal_status_and_illegal_list_fail(self) -> None:
        missing = self._failures_for(
            "two-panel-case-review.md",
            VALID_RECIPE.replace("media_mode: forbidden\n", ""),
        )
        self.assertTrue(any("RECIPE_FIELD_REQUIRED:media_mode" in item for item in missing))
        bad_status = self._failures_for(
            "two-panel-case-review.md",
            VALID_RECIPE.replace("status: experimental", "status: invented"),
        )
        self.assertTrue(any("RECIPE_STATUS_INVALID" in item for item in bad_status))
        bad_list = self._failures_for(
            "two-panel-case-review.md",
            VALID_RECIPE.replace(
                "slot_contract: headline | left-panel | right-panel | takeaway",
                "slot_contract: headline | | takeaway",
            ),
        )
        self.assertTrue(any("RECIPE_LIST_INVALID:slot_contract" in item for item in bad_list))

    def test_duplicate_id_and_non_logic_diagram_layout_fail(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            recipes_dir = Path(temporary_directory)
            (recipes_dir / "two-panel-case-review.md").write_text(
                VALID_RECIPE, encoding="utf-8"
            )
            (recipes_dir / "alias.md").write_text(VALID_RECIPE, encoding="utf-8")
            _, failures, _ = load_recipe_directory(recipes_dir)
            self.assertIn("RECIPE_ID_DUPLICATE:two-panel-case-review", failures)
        bad_layout = self._failures_for(
            "two-panel-case-review.md",
            VALID_RECIPE.replace(
                "downstream_layouts: two-column",
                "downstream_layouts: two-column | flow-diagram",
            ),
        )
        self.assertTrue(
            any("NON_LOGIC_DIAGRAM_LAYOUT_FORBIDDEN" in item for item in bad_layout)
        )

    def test_broad_logic_recipe_cannot_be_unblocked(self) -> None:
        broad = VALID_RECIPE.replace(
            "recipe_id: two-panel-case-review", "recipe_id: logic-diagram"
        ).replace("status: experimental", "status: restricted").replace(
            "is_logic_diagram: false", "is_logic_diagram: true"
        ).replace(
            "downstream_layouts: two-column", "downstream_layouts: flow-diagram"
        )
        failures = self._failures_for("logic-diagram.md", broad)
        self.assertTrue(any("BROAD_LOGIC_RECIPE_BLOCKED" in item for item in failures))


if __name__ == "__main__":
    unittest.main()


