from __future__ import annotations

import copy
import json
import sys
import unittest
from pathlib import Path

SKILL = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SKILL / "scripts"))
from a_page_contract import compute_timing, validate_a_page, validate_compile_trace  # noqa: E402
from compile_a_page_v6 import normalize  # noqa: E402


class APageV6ContractTests(unittest.TestCase):
    def setUp(self) -> None:
        self.payload = json.loads((SKILL / "references/examples/a-page-v6/canonical-contract-example-a-page.json").read_text(encoding="utf-8"))
        self.approved = (SKILL / "references/examples/a-page-v6/approved-spoken-text.txt").read_text(encoding="utf-8")

    def test_canonical_example_passes_current_validator(self) -> None:
        self.assertEqual([], validate_a_page(approved_text=self.approved, payload=self.payload)["failures"])

    def test_v5_fields_and_unknown_policy_are_rejected(self) -> None:
        payload = copy.deepcopy(self.payload); title = payload["pages"][0]["screen"]["title"]
        title["source_text"] = title.pop("guidance_text")
        failures = validate_a_page(approved_text=self.approved, payload=payload)["failures"]
        self.assertIn("FIELD_REQUIRED:A001.screen.title:guidance_text", failures)
        self.assertIn("UNKNOWN_FIELD:A001.screen.title:source_text", failures)
        payload = copy.deepcopy(self.payload); payload["pages"][0]["screen"]["title"]["usage_policy"] = "adaptable"
        self.assertIn("SCREEN_USAGE_POLICY_INVALID:A001.screen.title", validate_a_page(approved_text=self.approved, payload=payload)["failures"])

    def test_silent_constraint_cannot_enter_guidance(self) -> None:
        payload = copy.deepcopy(self.payload); page = payload["pages"][0]
        page["silent_constraints"] = [{"constraint_id":"C001","instruction":"审核时保持静默","evidence_refs":["E001"]}]
        page["screen"]["title"]["guidance_text"] = "审核时保持静默"
        self.assertIn("SILENT_CONSTRAINT_LEAKED_IN_SCREEN:A001:C001", validate_a_page(approved_text=self.approved, payload=payload)["failures"])

    def test_compiler_sets_fixed_metadata_ids_and_timing(self) -> None:
        payload = copy.deepcopy(self.payload); page = payload["pages"][0]; page["a_id"] = "bad"; page["timing"] = {}; page["screen"]["title"]["screen_item_id"] = "bad"
        result = normalize(payload, episode_id="canonical-contract-example")
        self.assertEqual("courseplay-a-page/v6", result["schema_version"])
        self.assertEqual("A001", page["a_id"]); self.assertEqual("S001", page["screen"]["title"]["screen_item_id"])
        self.assertEqual(compute_timing(page["nx"])["target_seconds"], page["timing"]["target_seconds"])

    def test_normalizer_updates_cross_page_and_relation_references(self) -> None:
        payload = copy.deepcopy(self.payload)
        payload["pages"][1]["callback_a_ids"] = ["A001"]
        payload["pages"][0]["protected_relations"][0]["from"] = "G001"
        payload["pages"][0]["protected_relations"][0]["to"] = "G002"
        for page in payload["pages"]:
            page["a_id"] = f"old-{page['a_id']}"
        payload["pages"][1]["callback_a_ids"] = ["old-A001"]
        normalize(payload, episode_id="canonical-contract-example")
        self.assertEqual(["A001"], payload["pages"][1]["callback_a_ids"])
        self.assertEqual("G001", payload["pages"][0]["protected_relations"][0]["from"])
        self.assertEqual("G002", payload["pages"][0]["protected_relations"][0]["to"])

    def test_trace_maps_source_atoms_to_guidance(self) -> None:
        trace = {"schema_version":"courseplay-b-to-a-trace/v2","episode_id":"canonical-contract-example","source_task_package":"task.md","page_document":"page.json","coverage":[{"source_b_id":"B01","resolved_a_ids":["A001"],"responsibilities_resolved":True,"evidence_resolved":True,"visible_source_units":[{"source_unit":"atom","status":"covered","resolved_a_id":"A001","resolved_screen_item_ids":["S002"]}]}],"unresolved":[]}
        self.assertEqual([], validate_compile_trace(page_payload=self.payload, trace=trace, task_package={"b_ids":["B01"]})["failures"])

    def test_failures_include_public_structured_diagnostics(self) -> None:
        payload = copy.deepcopy(self.payload)
        payload["pages"][0]["callback_a_ids"] = ["A002"]
        report = validate_a_page(approved_text=self.approved, payload=payload)
        self.assertTrue(any(failure.startswith("CALLBACK_INVALID:") for failure in report["failures"]))
        self.assertEqual({"code", "path", "expected", "actual", "message", "hint", "contractSection"}, set(report["errors"][0]))


if __name__ == "__main__": unittest.main()
