from __future__ import annotations

import importlib.util
import copy
import sys
import unittest
from pathlib import Path


SKILL_ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = SKILL_ROOT / "scripts" / "a_page_contract.py"


def _load_module():
    spec = importlib.util.spec_from_file_location("a_page_contract_v4", MODULE_PATH)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


class APageV4ContractTests(unittest.TestCase):
    def _valid_document(self):
        contract = _load_module()
        nx = "测" * 31
        return contract, nx, {
            "schema_version": "courseplay-a-page/v4",
            "document_kind": "production",
            "episode_id": "episode-99",
            "approved_text": "approved-spoken-text.txt",
            "timing_model": contract.TIMING_MODEL,
            "evidence_catalog": [{
                "evidence_id": "E001", "claim_or_asset": "测试证据",
                "source_locator": "test:1", "verification_status": "verified",
                "allowed_use": "测试页面",
            }],
            "pages": [{
                "a_id": "A001", "callback_a_ids": [], "nx": nx,
                "teaching_purpose": "建立测试页面", "single_message": "测试页面只冻结语义。",
                "must_visible": [{
                    "semantic_item_id": "V001", "meaning": "测试证据",
                    "evidence_refs": ["E001"],
                }],
                "protected_relations": [], "entry_condition": "尚未显示测试证据",
                "exit_condition": "测试证据已经建立", "timing": contract.compute_timing(nx),
            }],
        }

    def test_valid_semantic_v4_document_passes_without_visual_or_media_fields(self) -> None:
        contract = _load_module()
        nx = "测" * 31
        payload = {
            "schema_version": "courseplay-a-page/v4",
            "document_kind": "production",
            "episode_id": "episode-99",
            "approved_text": "approved-spoken-text.txt",
            "timing_model": contract.TIMING_MODEL,
            "evidence_catalog": [{
                "evidence_id": "E001",
                "claim_or_asset": "测试证据",
                "source_locator": "test:1",
                "verification_status": "verified",
                "allowed_use": "测试页面",
            }],
            "pages": [{
                "a_id": "A001",
                "callback_a_ids": [],
                "nx": nx,
                "teaching_purpose": "建立测试页面",
                "single_message": "测试页面只冻结语义。",
                "must_visible": [{
                    "semantic_item_id": "V001",
                    "meaning": "测试证据",
                    "evidence_refs": ["E001"],
                }],
                "protected_relations": [],
                "entry_condition": "尚未显示测试证据",
                "exit_condition": "测试证据已经建立",
                "timing": contract.compute_timing(nx),
            }],
        }

        report = contract.validate_a_page(approved_text=nx, payload=payload)

        self.assertEqual([], report["failures"])
        self.assertEqual("a-page-v4", report["validation_profile"])
        self.assertNotIn("image_allocation", report)

    def test_all_visual_and_media_fields_are_rejected(self) -> None:
        contract, nx, valid = self._valid_document()
        top_fields = ("image_policy", "media_catalog", "visual_strategy")
        page_fields = (
            "visual_priority", "visual_form", "dominant_visual", "display_mode",
            "media_refs", "media_usage",
        )
        for field_name in top_fields:
            payload = copy.deepcopy(valid)
            payload[field_name] = {}
            self.assertIn(
                f"UNKNOWN_FIELD:document:{field_name}",
                contract.validate_a_page(approved_text=nx, payload=payload)["failures"],
            )
        for field_name in page_fields:
            payload = copy.deepcopy(valid)
            payload["pages"][0][field_name] = "forbidden"
            self.assertIn(
                f"UNKNOWN_FIELD:A001:{field_name}",
                contract.validate_a_page(approved_text=nx, payload=payload)["failures"],
            )

    def test_timing_callbacks_evidence_and_trace_remain_strict(self) -> None:
        contract, nx, valid = self._valid_document()
        payload = copy.deepcopy(valid)
        payload["pages"][0]["timing"]["target_seconds"] += 1
        payload["pages"][0]["callback_a_ids"] = ["A001"]
        payload["pages"][0]["must_visible"][0]["evidence_refs"] = ["E999"]
        failures = contract.validate_a_page(approved_text=nx, payload=payload)["failures"]
        self.assertIn("TIMING_MISMATCH:A001", failures)
        self.assertIn("CALLBACK_SELF:A001", failures)
        self.assertIn("EVIDENCE_UNKNOWN:A001:E999", failures)

        trace = {
            "schema_version": "courseplay-b-to-a-trace/v2",
            "episode_id": "episode-99", "source_task_package": "episode.md",
            "page_document": "episode-99-a-page.json",
            "coverage": [{
                "source_b_id": "B01", "resolved_a_ids": ["A001"],
                "responsibilities_resolved": True, "evidence_resolved": True,
            }],
            "unresolved": [],
        }
        trace_report = contract.validate_compile_trace(
            page_payload=valid, trace=trace, task_package={"b_ids": ["B01"]},
        )
        self.assertEqual([], trace_report["failures"])
        trace["coverage"][0]["media_resolved"] = True
        self.assertIn(
            "UNKNOWN_FIELD:coverage[0]:media_resolved",
            contract.validate_compile_trace(
                page_payload=valid, trace=trace, task_package={"b_ids": ["B01"]},
            )["failures"],
        )

    def test_b_references_and_non_lossless_nx_are_rejected(self) -> None:
        contract, nx, valid = self._valid_document()
        payload = copy.deepcopy(valid)
        payload["pages"][0]["single_message"] = "继承 B01"
        failures = contract.validate_a_page(approved_text=nx + "漏字", payload=payload)["failures"]
        self.assertIn("B_REFERENCE_FORBIDDEN", failures)
        self.assertIn("NX_NOT_LOSSLESS", failures)


if __name__ == "__main__":
    unittest.main()


