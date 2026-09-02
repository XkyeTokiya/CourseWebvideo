import hashlib
import tempfile
import unittest
from pathlib import Path

from helpers import SAMPLE_NARRATION
from narration_core import (
    discover_episode_paths,
    entity_tokens,
    numeric_tokens,
    parse_narration,
    sha256_path,
)


class NarrationCoreTests(unittest.TestCase):
    def test_parse_preserves_regions_and_segments(self):
        doc = parse_narration(SAMPLE_NARRATION)
        self.assertEqual(doc.ids, ("N001", "N002"))
        self.assertEqual(doc.segments["N001"].strip(), "第一段含 2021 年和 2–3 名。")
        self.assertTrue(doc.prefix.startswith("# 示例"))
        self.assertTrue(doc.suffix.startswith("### 6.1 Narration Duration Estimate"))

    def test_rejects_non_contiguous_ids(self):
        with self.assertRaisesRegex(ValueError, "contiguous"):
            parse_narration(SAMPLE_NARRATION.replace("[N002]", "[N003]"))

    def test_extracts_numbers_and_entities(self):
        self.assertEqual(numeric_tokens("AII2022 建议 2–3 名，每月 1 次"), ("2022", "2–3", "1"))
        self.assertIn("AII2022", entity_tokens("依据 AII2022 和《建设导则》"))
        self.assertIn("《建设导则》", entity_tokens("依据 AII2022 和《建设导则》"))

    def test_rejects_duplicate_episode_numbers_across_modules(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            for module in ("module-a", "module-b"):
                task = root / "episodes" / module / "episode-01-sample-task-package.md"
                narration = root / "outputs" / "narration-scripts" / module / "episode-01-sample-narration.md"
                task.parent.mkdir(parents=True, exist_ok=True)
                narration.parent.mkdir(parents=True, exist_ok=True)
                task.write_text("task", encoding="utf-8")
                narration.write_text("narration", encoding="utf-8")

            with self.assertRaisesRegex(ValueError, "episode sequence"):
                discover_episode_paths(root, expected_count=2)

    def test_discovers_paired_episode_paths(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            task = root / "episodes" / "module-a" / "episode-01-sample-task-package.md"
            narration = root / "outputs" / "narration-scripts" / "module-a" / "episode-01-sample-narration.md"
            task.parent.mkdir(parents=True)
            narration.parent.mkdir(parents=True)
            task.write_text("task", encoding="utf-8")
            narration.write_text("narration", encoding="utf-8")

            (pair,) = discover_episode_paths(root, expected_count=1)

            self.assertEqual(pair.episode, 1)
            self.assertEqual(pair.module, "module-a")
            self.assertEqual(pair.task_package, task)
            self.assertEqual(pair.original_narration, narration)
            self.assertEqual(
                pair.polished_narration,
                root / "outputs" / "narration-scripts-polished" / "module-a" / narration.name,
            )

    def test_rejects_wrong_module_topology_for_full_course(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            for episode in range(1, 52):
                task = root / "episodes" / "module-a" / f"episode-{episode:02d}-sample-task-package.md"
                narration = (
                    root
                    / "outputs"
                    / "narration-scripts"
                    / "module-a"
                    / f"episode-{episode:02d}-sample-narration.md"
                )
                task.parent.mkdir(parents=True, exist_ok=True)
                narration.parent.mkdir(parents=True, exist_ok=True)
                task.write_text("task", encoding="utf-8")
                narration.write_text("narration", encoding="utf-8")

            with self.assertRaisesRegex(ValueError, "five-module topology"):
                discover_episode_paths(root)

    def test_hashes_multi_chunk_file(self):
        payload = (b"courseplay" * 131_073) + b"!"
        self.assertGreater(len(payload), 1024 * 1024)
        with tempfile.TemporaryDirectory() as temp_dir:
            path = Path(temp_dir) / "payload.bin"
            path.write_bytes(payload)
            self.assertEqual(sha256_path(path), hashlib.sha256(payload).hexdigest())

    def test_parse_preserves_crlf_regions(self):
        doc = parse_narration(SAMPLE_NARRATION.replace("\n", "\r\n"))
        self.assertEqual(doc.ids, ("N001", "N002"))
        self.assertTrue(doc.prefix.endswith("\r\n\r\n"))
        self.assertTrue(doc.segments["N002"].endswith("\r\n\r\n"))
        self.assertTrue(doc.suffix.startswith("### 6.1 Narration Duration Estimate\r\n"))

    def test_rejects_missing_parser_boundaries(self):
        with self.assertRaisesRegex(ValueError, "missing N001"):
            parse_narration(SAMPLE_NARRATION.replace("[N001]", "[N000]"))

    def test_allows_missing_duration_suffix_after_last_n_segment(self):
        doc = parse_narration(SAMPLE_NARRATION.split("### 6.1")[0])
        self.assertEqual(doc.suffix, "")
        self.assertEqual(doc.ids, ("N001", "N002"))
        self.assertEqual(doc.segments["N002"].strip(), "第二段。")


