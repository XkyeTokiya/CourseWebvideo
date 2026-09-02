import hashlib
import json
import os
import tempfile
import unittest
from pathlib import Path

from helpers import SKILL_ROOT


import sys

sys.path.insert(0, str(SKILL_ROOT / "scripts"))

from initialize_polished import initialize


class InitializePolishedTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.repo = Path(self.temp_dir.name)
        self.snapshot = self.repo / "work" / "baseline-sha256.json"
        for episode in (1, 2):
            self.original(episode).parent.mkdir(parents=True, exist_ok=True)
            self.task_package(episode).parent.mkdir(parents=True, exist_ok=True)
            self.original(episode).write_text(f"original {episode}\n", encoding="utf-8")
            self.task_package(episode).write_text(f"task {episode}\n", encoding="utf-8")

    def tearDown(self):
        self.temp_dir.cleanup()

    def original(self, episode):
        return self.repo / "outputs" / "narration-scripts" / "module-a" / f"episode-{episode:02d}-sample-narration.md"

    def polished(self, episode):
        return self.repo / "outputs" / "narration-scripts-polished" / "module-a" / f"episode-{episode:02d}-sample-narration.md"

    def task_package(self, episode):
        return self.repo / "episodes" / "module-a" / f"episode-{episode:02d}-sample-task-package.md"

    def test_initializes_complete_byte_identical_tree(self):
        result = initialize(self.repo, self.snapshot, expected_count=2)
        self.assertEqual(result["copied"], 2)
        self.assertEqual(self.original(1).read_bytes(), self.polished(1).read_bytes())
        inputs = json.loads(self.snapshot.read_text(encoding="utf-8"))["inputs"]
        expected_paths = [
            "episodes/module-a/episode-01-sample-task-package.md",
            "episodes/module-a/episode-02-sample-task-package.md",
            "outputs/narration-scripts/module-a/episode-01-sample-narration.md",
            "outputs/narration-scripts/module-a/episode-02-sample-narration.md",
        ]
        self.assertEqual([item["path"] for item in inputs], expected_paths)
        self.assertEqual(
            [item["sha256"] for item in inputs],
            [
                hashlib.sha256(path.read_bytes()).hexdigest()
                for path in (
                    self.task_package(1),
                    self.task_package(2),
                    self.original(1),
                    self.original(2),
                )
            ],
        )
        self.assertTrue(all(set(item) == {"path", "sha256"} for item in inputs))
        self.assertEqual({item["path"].split("/", 1)[0] for item in inputs}, {"episodes", "outputs"})

    def test_refuses_existing_output_without_resume(self):
        self.polished(1).parent.mkdir(parents=True)
        self.polished(1).write_text("existing", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "already exists"):
            initialize(self.repo, self.snapshot, expected_count=2)

    def test_resume_only_fills_missing_byte_identical_files(self):
        initialize(self.repo, self.snapshot, expected_count=2)
        existing_copy = self.polished(1).read_bytes()
        self.polished(2).unlink()
        result = initialize(self.repo, self.snapshot, expected_count=2, resume=True)
        self.assertEqual(result["copied"], 1)
        self.assertEqual(self.polished(2).read_bytes(), self.original(2).read_bytes())
        self.assertEqual(self.polished(1).read_bytes(), existing_copy)

    def test_resume_refuses_changed_existing_copy(self):
        initialize(self.repo, self.snapshot, expected_count=2)
        self.polished(1).write_text("edited", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "not byte-identical"):
            initialize(self.repo, self.snapshot, expected_count=2, resume=True)

    def test_relative_snapshot_is_anchored_to_absolute_repo_root_from_other_cwd(self):
        relative_snapshot = Path("work") / "nested" / "baseline-sha256.json"
        original_cwd = Path.cwd()
        with tempfile.TemporaryDirectory() as other_cwd:
            try:
                os.chdir(other_cwd)
                initialize(self.repo.resolve(), relative_snapshot, expected_count=2)
            finally:
                os.chdir(original_cwd)

        self.assertTrue((self.repo / relative_snapshot).is_file())


