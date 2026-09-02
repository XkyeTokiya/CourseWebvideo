from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SKILL_ROOT = Path(__file__).resolve().parents[1]
VERIFY_PATH = SKILL_ROOT / "scripts" / "verify_compilation.py"
CONTRACT_PATH = SKILL_ROOT / "scripts" / "a_page_contract.py"


def _contract():
    spec = importlib.util.spec_from_file_location("a_page_contract_cli_v4", CONTRACT_PATH)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


class APageV4CliTests(unittest.TestCase):
    def test_cli_accepts_only_v4_and_writes_semantic_aggregate_report(self) -> None:
        contract = _contract()
        nx = "测" * 31
        payload = {
            "schema_version": contract.SCHEMA_VERSION,
            "document_kind": "production", "episode_id": "episode-99",
            "approved_text": "approved-spoken-text.txt", "timing_model": contract.TIMING_MODEL,
            "evidence_catalog": [{
                "evidence_id": "E001", "claim_or_asset": "测试证据",
                "source_locator": "test:1", "verification_status": "verified", "allowed_use": "测试",
            }],
            "pages": [{
                "a_id": "A001", "callback_a_ids": [], "nx": nx,
                "teaching_purpose": "测试", "single_message": "测试",
                "must_visible": [{"semantic_item_id": "V001", "meaning": "测试", "evidence_refs": ["E001"]}],
                "protected_relations": [], "entry_condition": "测试前", "exit_condition": "测试后",
                "timing": contract.compute_timing(nx),
            }],
        }
        trace = {
            "schema_version": "courseplay-b-to-a-trace/v2", "episode_id": "episode-99",
            "source_task_package": "episode.md", "page_document": "episode-99-a-page.json",
            "coverage": [{"source_b_id": "B01", "resolved_a_ids": ["A001"], "responsibilities_resolved": True, "evidence_resolved": True}],
            "unresolved": [],
        }
        task = "| B01 | test |\n| E001 | primary | 测试证据 | role | test:1 | verified | 测试 | notes |\n"
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            approved = root / "approved-spoken-text.txt"
            compiled = root / "episode-99-a-page.json"
            trace_path = root / "trace.json"
            task_path = root / "task.md"
            report_path = root / "report.json"
            approved.write_text(nx, encoding="utf-8")
            compiled.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
            trace_path.write_text(json.dumps(trace), encoding="utf-8")
            task_path.write_text(task, encoding="utf-8")
            result = subprocess.run([
                sys.executable, "-B", str(VERIFY_PATH), "--validation-profile", "a-page-v4",
                "--approved-text", str(approved), "--compiled-json", str(compiled),
                "--task-package", str(task_path), "--compile-trace", str(trace_path),
                "--output", str(report_path),
            ], capture_output=True, text=True, encoding="utf-8")
            self.assertEqual(0, result.returncode, result.stdout + result.stderr)
            report = json.loads(report_path.read_text(encoding="utf-8"))
            self.assertEqual("a-page-v4", report["validation_profile"])
            self.assertNotIn("image_allocation", report)

    def test_v3_profile_is_rejected(self) -> None:
        result = subprocess.run([
            sys.executable, "-B", str(VERIFY_PATH), "--validation-profile", "a-page-v3",
        ], capture_output=True, text=True, encoding="utf-8")
        self.assertEqual(2, result.returncode)
        self.assertIn("invalid choice", result.stderr)


if __name__ == "__main__":
    unittest.main()


