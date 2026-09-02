from __future__ import annotations

import importlib.util
import sys
import unittest
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parents[1]
VERIFY_PATH = SKILL_ROOT / "scripts" / "verify_compilation.py"

spec = importlib.util.spec_from_file_location("verify_compilation", VERIFY_PATH)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)


class CanonicalizeStage1OutputTests(unittest.TestCase):
    def test_extracts_only_spoken_text_and_normalizes_newlines(self) -> None:
        stage1 = (
            "【视频标题】\r\n标题\r\n\r\n"
            "【开场导入】\r\n甲提出问题。\r\n\r\n"
            "【正文讲解】\r\n乙解释机制。\r\n\r\n丙完成小结。\r\n"
        )
        canonical = module.canonicalize_stage1_output(stage1)
        self.assertEqual("甲提出问题。\n\n乙解释机制。\n\n丙完成小结。", canonical)

    def test_rejects_step_separator(self) -> None:
        stage1 = (
            "【视频标题】\n标题\n\n【开场导入】\n甲。\n\n"
            "【正文讲解】\n乙。\n\n---\n\n丙。\n"
        )
        with self.assertRaisesRegex(ValueError, "STEP_SEPARATOR_FORBIDDEN"):
            module.canonicalize_stage1_output(stage1)
if __name__ == "__main__":
    unittest.main()


