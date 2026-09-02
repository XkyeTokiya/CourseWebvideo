from __future__ import annotations

import copy
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SKILL_ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = SKILL_ROOT / "scripts" / "a_page_contract.py"
V5_FIXTURE = (
    SKILL_ROOT.parents[3]
    / ".tmp"
        / "narration-pipeline"
    / "2026-08-31-courseplay-screen-text-lightweight-flow"
    / "fixtures"
    / "episode-09-a-page-v5-slice.json"
)


def _load_module():
    spec = importlib.util.spec_from_file_location("a_page_contract_v6", MODULE_PATH)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def _as_v6_document():
    contract = _load_module()
    payload = json.loads(V5_FIXTURE.read_text(encoding="utf-8"))
    for key in ("$schema", "fixture_status", "fixture_notes"):
        payload.pop(key, None)
    payload["schema_version"] = contract.SCHEMA_VERSION_V6
    payload["document_kind"] = "production"
    payload["approved_text"] = "approved-spoken-text.txt"
    payload["pages"] = [payload["pages"][0]]
    page = payload["pages"][0]
    page["callback_a_ids"] = []
    page["timing"] = contract.compute_timing(page["nx"])
    screen_items = [page["screen"]["title"]]
    for group in page["screen"]["groups"]:
        screen_items.extend(group["items"])
    for item in screen_items:
        item["guidance_text"] = item.pop("source_text")
        item["usage_policy"] = "exact" if item.pop("edit_policy") == "exact" else "reference"
    return contract, payload, page["nx"]


class APageV6ContractTests(unittest.TestCase):
    def test_v6_cli_accepts_guidance_and_work_only_trace(self) -> None:
        _, payload, approved = _as_v6_document()
        trace = {
            "schema_version": "courseplay-b-to-a-trace/v2",
            "episode_id": payload["episode_id"],
            "source_task_package": "task-package.md",
            "page_document": "a-page.json",
            "coverage": [{
                "source_b_id": "B01",
                "resolved_a_ids": ["A001"],
                "responsibilities_resolved": True,
                "evidence_resolved": True,
                "visible_source_units": [{
                    "source_unit": "当前指导池原子",
                    "status": "covered",
                    "resolved_a_id": "A001",
                    "resolved_screen_item_ids": ["S002"],
                }],
            }],
            "unresolved": [],
        }
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            files = {
                "task": root / "task-package.md",
                "approved": root / "approved-spoken-text.txt",
                "page": root / "a-page.json",
                "trace": root / "trace.json",
                "report": root / "report.json",
            }
            files["task"].write_text("| B01 | 当前职责 |\n", encoding="utf-8")
            files["approved"].write_text(approved, encoding="utf-8")
            files["page"].write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
            files["trace"].write_text(json.dumps(trace, ensure_ascii=False), encoding="utf-8")
            result = subprocess.run(
                [
                    sys.executable,
                    "-B",
                    str(SKILL_ROOT / "scripts" / "verify_compilation.py"),
                    "--validation-profile", "a-page-v6",
                    "--task-package", str(files["task"]),
                    "--compile-trace", str(files["trace"]),
                    "--approved-text", str(files["approved"]),
                    "--compiled-json", str(files["page"]),
                    "--output", str(files["report"]),
                ],
                capture_output=True,
                text=True,
                check=False,
            )
            self.assertEqual(0, result.returncode, result.stdout + result.stderr)
            report = json.loads(files["report"].read_text(encoding="utf-8"))
            self.assertEqual("a-page-v6", report["validation_profile"])
            self.assertTrue(report["compile_coverage"]["coverage_passed"])

    def test_v6_schema_and_template_expose_only_reference_or_exact_guidance(self) -> None:
        contract = _load_module()
        schema = json.loads((SKILL_ROOT / "references" / "courseplay-a-page-v6.schema.json").read_text(encoding="utf-8"))
        item = schema["$defs"]["screenGuidanceItem"]
        self.assertEqual(["reference", "exact"], item["properties"]["usage_policy"]["enum"])
        self.assertFalse(item["additionalProperties"])
        template = json.loads((SKILL_ROOT / "templates" / "courseplay-a-page-v6-template.json").read_text(encoding="utf-8"))
        approved = "".join(page["nx"] for page in template["pages"])
        self.assertEqual([], contract.validate_a_page(approved_text=approved, payload=template)["failures"])

    def test_v6_guidance_contract_passes_without_single_occurrence_semantics(self) -> None:
        contract, payload, approved = _as_v6_document()
        payload["pages"][0]["screen"]["groups"][0]["items"][0]["guidance_text"] = (
            payload["pages"][0]["screen"]["title"]["guidance_text"]
        )

        report = contract.validate_a_page(approved_text=approved, payload=payload)

        self.assertEqual([], report["failures"])
        self.assertEqual("a-page-v6", report["validation_profile"])
        self.assertIn("screen_guidance", report)
        self.assertNotIn("screen_source", report)

    def test_v6_rejects_v5_item_fields_and_unknown_usage_policy(self) -> None:
        contract, payload, approved = _as_v6_document()
        title = payload["pages"][0]["screen"]["title"]
        title["source_text"] = title.pop("guidance_text")
        title["edit_policy"] = title.pop("usage_policy")
        failures = contract.validate_a_page(approved_text=approved, payload=payload)["failures"]
        self.assertIn("FIELD_REQUIRED:A001.screen.title:guidance_text", failures)
        self.assertIn("UNKNOWN_FIELD:A001.screen.title:source_text", failures)

        _, payload, approved = _as_v6_document()
        payload["pages"][0]["screen"]["title"]["usage_policy"] = "adaptable"
        failures = contract.validate_a_page(approved_text=approved, payload=payload)["failures"]
        self.assertIn("SCREEN_USAGE_POLICY_INVALID:A001.screen.title", failures)

    def test_v6_silent_constraint_cannot_enter_guidance(self) -> None:
        contract, payload, approved = _as_v6_document()
        page = payload["pages"][0]
        instruction = page["silent_constraints"][0]["instruction"]
        page["screen"]["title"]["guidance_text"] = instruction
        failures = contract.validate_a_page(approved_text=approved, payload=payload)["failures"]
        self.assertIn("SILENT_CONSTRAINT_LEAKED_IN_SCREEN:A001:C001", failures)

    def test_v6_trace_keeps_work_only_atom_to_guidance_mapping(self) -> None:
        contract, payload, _ = _as_v6_document()
        trace = {
            "schema_version": "courseplay-b-to-a-trace/v2",
            "episode_id": payload["episode_id"],
            "source_task_package": "episode.md",
            "page_document": "episode-a-page.json",
            "coverage": [{
                "source_b_id": "B01",
                "resolved_a_ids": ["A001"],
                "responsibilities_resolved": True,
                "evidence_resolved": True,
                "visible_source_units": [{
                    "source_unit": "订单、装配与质量记录",
                    "status": "covered",
                    "resolved_a_id": "A001",
                    "resolved_screen_item_ids": ["S002", "S003"],
                }],
            }],
            "unresolved": [],
        }
        report = contract.validate_compile_trace(
            page_payload=payload,
            trace=trace,
            task_package={"b_ids": ["B01"]},
        )
        self.assertEqual([], report["failures"])


if __name__ == "__main__":
    unittest.main()








