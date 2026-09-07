from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "sync_finished_narration.py"


class SyncFinishedNarrationTests(unittest.TestCase):
    def _run(self, *args: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, "-X", "utf8", "-B", str(SCRIPT), *args],
            check=False,
            capture_output=True,
            text=True,
            encoding="utf-8",
        )

    def test_write_repairs_timing_and_approved_text_then_check_passes(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            a_page = root / "episode-99-a-page.json"
            approved = root / "approved-spoken-text.txt"
            payload = {
                "schema_version": "courseplay-a-page/v4",
                "document_kind": "production",
                "episode_id": "episode-99",
                "approved_text": approved.name,
                "pages": [
                    {
                        "a_id": "A001",
                        "nx": "第一句话。\n\n",
                        "timing": {
                            "char_equivalent": 999,
                            "min_seconds": 999,
                            "target_seconds": 999,
                            "max_seconds": 999,
                            "short_page_reason": "短页用于测试",
                        },
                    },
                    {
                        "a_id": "A002",
                        "nx": "第二句话。",
                        "timing": {
                            "char_equivalent": 999,
                            "min_seconds": 999,
                            "target_seconds": 999,
                            "max_seconds": 999,
                            "short_page_reason": None,
                        },
                    },
                ],
            }
            a_page.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
            approved.write_text("旧稿", encoding="utf-8")

            before = self._run(
                "--a-page", str(a_page), "--approved-text", str(approved), "--check"
            )
            self.assertEqual(1, before.returncode)
            self.assertIn("APPROVED_TEXT_MISMATCH", before.stdout)
            self.assertIn("index=0:a_id=A001", before.stdout)
            self.assertIn("TIMING_MISMATCH:A001", before.stdout)

            written = self._run(
                "--a-page", str(a_page), "--approved-text", str(approved), "--write"
            )
            self.assertEqual(0, written.returncode, written.stdout + written.stderr)
            self.assertEqual("第一句话。\n\n第二句话。", approved.read_text(encoding="utf-8"))

            updated = json.loads(a_page.read_text(encoding="utf-8"))
            self.assertEqual("短页用于测试", updated["pages"][0]["timing"]["short_page_reason"])
            self.assertNotEqual(999, updated["pages"][0]["timing"]["target_seconds"])

            after = self._run(
                "--a-page", str(a_page), "--approved-text", str(approved), "--check"
            )
            self.assertEqual(0, after.returncode, after.stdout + after.stderr)
            self.assertIn("PASS", after.stdout)

    def test_rejects_mismatched_approved_text_reference(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            a_page = root / "episode-99-a-page.json"
            approved = root / "different-name.txt"
            payload = {
                "schema_version": "courseplay-a-page/v4",
                "document_kind": "production",
                "approved_text": "approved-spoken-text.txt",
                "pages": [
                    {"a_id": "A001", "nx": "测试。", "timing": {}},
                ],
            }
            a_page.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")

            result = self._run(
                "--a-page", str(a_page), "--approved-text", str(approved), "--check"
            )
            self.assertEqual(2, result.returncode)
            self.assertIn("APPROVED_TEXT_REFERENCE_MISMATCH", result.stdout)


if __name__ == "__main__":
    unittest.main()


