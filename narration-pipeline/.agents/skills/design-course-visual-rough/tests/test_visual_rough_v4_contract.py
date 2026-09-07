from __future__ import annotations

import hashlib
import importlib.util
import json
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]
SKILL = Path(__file__).resolve().parents[1]
FIXTURE = ROOT / "player/tools/tests/fixtures/courseplay-handoff-v4/sources"
spec = importlib.util.spec_from_file_location("visual_rough_v4", SKILL / "scripts/visual_rough_contract.py")
assert spec and spec.loader
contract = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = contract
spec.loader.exec_module(contract)
sys.path.insert(0, str(SKILL / "scripts"))
from recipe_library import load_recipe_directory  # noqa: E402
from normalize_visual_rough_v4 import normalize  # noqa: E402


class VisualRoughV4Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source_bytes = (FIXTURE / "episode-fixture-v4-a-page.json").read_bytes()
        cls.source = json.loads(cls.source_bytes)
        cls.rough = (FIXTURE / "episode-fixture-v4-visual-rough.md").read_text(encoding="utf-8")
        cls.registry, failures, _ = load_recipe_directory(SKILL / "references/page-recipes")
        assert not failures, failures

    def validate(self, rough: str | None = None, source: dict | None = None):
        return contract.validate_visual_rough(source_payload=source or self.source, source_sha256=hashlib.sha256(self.source_bytes).hexdigest(), rough_text=rough or self.rough, registry=self.registry)

    def test_synthetic_end_to_end_contract_passes(self) -> None:
        report = self.validate()
        self.assertEqual([], report["errors"])
        parsed = contract.parse_visual_rough_v4(self.rough)
        self.assertEqual(["G001", "G002"], parsed.pages[0].units[0].group_ids)
        self.assertEqual(["G004"], parsed.pages[1].units[0].group_ids)
        self.assertEqual(["G004"], parsed.pages[1].units[1].group_ids)
        self.assertIn("U003", dict(parsed.pages[0].slot_bindings).values())
        self.assertEqual(["S001", "S002", "S003", "S004"], report["preflight"]["pages"][0]["source"]["S"])
        self.assertEqual([], report["preflight"]["pages"][0]["content_units"]["uncovered_groups"])

    def test_normalizer_generates_hash_and_continuous_u_m_ids(self) -> None:
        draft = self.rough.replace(hashlib.sha256(self.source_bytes).hexdigest(), "pending").replace("U001", "U901").replace("U002", "U902").replace("M001", "M901")
        output = normalize(draft, a_page_name="episode-fixture-v4-a-page.json", a_page_bytes=self.source_bytes)
        self.assertIn(hashlib.sha256(self.source_bytes).hexdigest(), output)
        self.assertIn("U001 <-", output); self.assertIn("U002 <-", output); self.assertIn("M001 /", output)

    def test_unknown_and_uncovered_groups_are_structured(self) -> None:
        rough = self.rough.replace("U002 <- G003", "U002 <- G999").replace("U003 <- G001 + G003", "U003 <- G001")
        errors = self.validate(rough)["errors"]
        codes = {error["code"] for error in errors}
        self.assertIn("VR4_GROUP_REFERENCE_UNKNOWN", codes)
        self.assertIn("VR4_GROUP_UNCOVERED", codes)
        for error in errors:
            self.assertEqual({"code", "path", "expected", "actual", "message", "hint", "contractSection"}, set(error))
            self.assertIn("不得修改", error["hint"] if error["code"].startswith("VR4_GROUP") else error["hint"] + "不得修改")

    def test_recipe_switch_does_not_require_a_page_group_changes(self) -> None:
        rough = self.rough.replace("`central-question`", "`split-compare-with-pivot`")
        self.assertEqual([], self.validate(rough)["errors"])

    def test_relation_exact_silent_and_guidance_rules(self) -> None:
        duplicate = self.rough.replace("- `[R001]`：由 body 内的对照排列承载", "- `[R001]`：载体一\n- `[R001]`：载体二")
        self.assertIn("VR4_RELATION_CARRIER", self.validate(duplicate)["failures"])
        leaked = self.rough.replace("- `body <- U001`", "- `body <- U001`\n- `audit <- C001`")
        self.assertIn("VR4_SLOT_BINDING", self.validate(leaked)["failures"])
        copied = self.rough + "\n必须逐字显示的标题\n"
        self.assertIn("VR4_GUIDANCE_COPIED", self.validate(copied)["failures"])

    def test_error_catalog_docs_and_failure_fixtures_match_emitted_codes(self) -> None:
        catalog = json.loads((SKILL / "references/error-catalog.json").read_text(encoding="utf-8"))
        fixtures = json.loads((SKILL / "tests/fixtures/v4-failure-cases.json").read_text(encoding="utf-8"))
        catalog_codes = {item["code"] for item in catalog["errors"]}
        fixture_codes = {item["code"] for item in fixtures["cases"]}
        source = (SKILL / "scripts/visual_rough_contract.py").read_text(encoding="utf-8")
        emitted = set(re.findall(r'(?:_error\(catalog,|add\()\s*"(VR4_[A-Z_]+)"', source))
        self.assertEqual(catalog_codes, fixture_codes)
        self.assertEqual(catalog_codes, emitted)


if __name__ == "__main__":
    unittest.main()
