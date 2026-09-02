from __future__ import annotations

import copy
import importlib.util
import json
import sys
import unittest
from pathlib import Path


SKILL_ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = SKILL_ROOT / "scripts" / "a_page_contract.py"
FIXTURE = (
    SKILL_ROOT.parents[3]
    / ".tmp"
        / "narration-pipeline"
    / "2026-08-31-courseplay-screen-text-lightweight-flow"
    / "fixtures"
    / "episode-09-a-page-v5-slice.json"
)
EP04_CANDIDATE_ROOT = (
    SKILL_ROOT.parents[3]
    / ".tmp"
        / "narration-pipeline"
    / "2026-08-31-ep04-task-package-screen-source"
    / "episode-04"
)


def _load_module():
    spec = importlib.util.spec_from_file_location("a_page_contract_v5", MODULE_PATH)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


class APageV5ContractTests(unittest.TestCase):
    def _valid_document(self):
        payload = json.loads(FIXTURE.read_text(encoding="utf-8"))
        payload.pop("$schema", None)
        payload.pop("fixture_status", None)
        payload.pop("fixture_notes", None)
        payload["document_kind"] = "production"
        payload["approved_text"] = "approved-spoken-text.txt"
        payload["pages"] = [payload["pages"][0]]
        payload["pages"][0]["callback_a_ids"] = []
        payload["pages"][0]["timing"] = _load_module().compute_timing(payload["pages"][0]["nx"])
        approved = "".join(page["nx"] for page in payload["pages"])
        return _load_module(), payload, approved

    def test_candidate_slice_has_a_usable_screen_source_layer(self) -> None:
        contract, payload, approved = self._valid_document()
        report = contract.validate_a_page(approved_text=approved, payload=payload)

        self.assertEqual([], report["failures"])
        self.assertEqual("a-page-v5", report["validation_profile"])
        self.assertEqual(5, report["screen_source"]["item_count"])
        self.assertEqual(1, report["screen_source"]["group_count"])
        self.assertTrue(report["screen_source"]["source_texts_are_single_occurrence"])

    def test_duplicate_screen_source_and_silent_constraint_leak_are_rejected(self) -> None:
        contract, payload, approved = self._valid_document()
        payload = copy.deepcopy(payload)
        first = payload["pages"][0]
        first["screen"]["title"]["source_text"] = first["screen"]["groups"][0]["items"][0]["source_text"]
        first["silent_constraints"][0]["instruction"] = first["nx"]
        failures = contract.validate_a_page(approved_text=approved, payload=payload)["failures"]

        self.assertTrue(any(item.startswith("SCREEN_SOURCE_OCCURRENCE_INVALID:") for item in failures))
        self.assertIn("SILENT_CONSTRAINT_LEAKED_IN_NX:A001:C001", failures)

    def test_v5_trace_accepts_visible_units_mapped_to_one_or_more_screen_items(self) -> None:
        contract, payload, _ = self._valid_document()
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
                "visible_source_units": [
                    {
                        "source_unit": "订单、装配与质量记录",
                        "status": "covered",
                        "resolved_a_id": "A001",
                        "resolved_screen_item_ids": ["S002", "S003", "S004"],
                    },
                    {
                        "source_unit": "已从批准口播删除的旧内容",
                        "status": "omitted",
                        "reason": "当前批准 nx 不再包含该职责",
                    },
                ],
            }],
            "unresolved": [],
        }

        report = contract.validate_compile_trace(
            page_payload=payload,
            trace=trace,
            task_package={"b_ids": ["B01"]},
        )

        self.assertEqual([], report["failures"])

    def test_v5_trace_rejects_missing_units_unknown_screen_items_and_unexplained_omissions(self) -> None:
        contract, payload, _ = self._valid_document()
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
                    "source_unit": "不存在的屏幕映射",
                    "status": "covered",
                    "resolved_a_id": "A001",
                    "resolved_screen_item_ids": ["S999"],
                }],
            }],
            "unresolved": [],
        }

        unknown_screen = contract.validate_compile_trace(
            page_payload=payload, trace=trace, task_package={"b_ids": ["B01"]},
        )["failures"]
        self.assertIn(
            "TRACE_RESOLUTION_INCOMPLETE:coverage[0].visible_source_units[0]:responsibilities_resolved",
            unknown_screen,
        )

        trace["coverage"][0]["visible_source_units"] = [{
            "source_unit": "没有说明原因的删除项",
            "status": "omitted",
        }]
        unexplained = contract.validate_compile_trace(
            page_payload=payload, trace=trace, task_package={"b_ids": ["B01"]},
        )["failures"]
        self.assertIn("FIELD_REQUIRED:coverage[0].visible_source_units[0]:reason", unexplained)

        del trace["coverage"][0]["visible_source_units"]
        missing = contract.validate_compile_trace(
            page_payload=payload, trace=trace, task_package={"b_ids": ["B01"]},
        )["failures"]
        self.assertIn("FIELD_REQUIRED:coverage[0]:visible_source_units", missing)

    def test_ep04_candidate_maps_every_b03_visible_atom_to_a003_screen_items(self) -> None:
        contract = _load_module()
        payload = json.loads(
            (EP04_CANDIDATE_ROOT / "episode-04-a-page-screen-source-candidate.json").read_text(encoding="utf-8")
        )
        trace = json.loads(
            (EP04_CANDIDATE_ROOT / "episode-04-b-to-a-compile-trace.json").read_text(encoding="utf-8")
        )
        b03 = next(item for item in trace["coverage"] if item["source_b_id"] == "B03")
        mapped = {item["source_unit"]: item["resolved_screen_item_ids"] for item in b03["visible_source_units"]}

        self.assertEqual({
            "设备、系统、流程、人员": ["S012"],
            "状态与业务信息": ["S014"],
            "传感器、执行器": ["S013"],
            "采集、传递": ["S015"],
            "孤立日志、质量、库存、计划": ["S016"],
        }, mapped)
        self.assertEqual([], contract.validate_compile_trace(
            page_payload=payload,
            trace=trace,
            task_package={"b_ids": [f"B{i:02d}" for i in range(1, 9)]},
        )["failures"])


if __name__ == "__main__":
    unittest.main()








