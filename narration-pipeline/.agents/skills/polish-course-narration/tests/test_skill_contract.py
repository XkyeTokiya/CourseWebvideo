import unittest

from helpers import SKILL_ROOT


class SkillContractTests(unittest.TestCase):
    def test_documents_canonical_commands_and_preserves_exact_workflow_sentence(self):
        text = (SKILL_ROOT / "SKILL.md").read_text(encoding="utf-8")

        self.assertIn("5. Run `validate_narration.py --episode XX`.", text)
        self.assertIn("## Canonical commands", text)
        self.assertIn(
            "python '.agents\\skills\\polish-course-narration\\scripts\\initialize_polished.py' "
            "--repo-root . --snapshot work\\narration-polish-v1\\baseline-sha256.json",
            text,
        )
        self.assertIn(
            "python '.agents\\skills\\polish-course-narration\\scripts\\validate_narration.py' "
            "--repo-root . --snapshot work\\narration-polish-v1\\baseline-sha256.json --episode XX",
            text,
        )
        self.assertIn(
            "python '.agents\\skills\\polish-course-narration\\scripts\\validate_narration.py' "
            "--repo-root . --snapshot work\\narration-polish-v1\\baseline-sha256.json --all",
            text,
        )
        self.assertIn("--resume", text)


if __name__ == "__main__":
    unittest.main()


