import hashlib
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from helpers import SAMPLE_NARRATION, SKILL_ROOT
from narration_core import discover_episode_paths
from validate_narration import FORBIDDEN_META_TERMS, validate_batch, validate_episode, validate_inputs


class ValidateNarrationTests(unittest.TestCase):
    @staticmethod
    def module_for_episode(episode):
        if episode <= 13:
            return "module-1-system-cognition"
        if episode <= 20:
            return "module-2-identifier-coding"
        if episode <= 32:
            return "module-3-data-and-resolution"
        if episode <= 42:
            return "module-4-identifier-carrier"
        return "module-5-node-construction-operation"

    def task_path(self, episode):
        module = self.module_for_episode(episode)
        return self.repo / "episodes" / module / f"episode-{episode:02d}-sample-task-package.md"

    def original_path(self, episode):
        module = self.module_for_episode(episode)
        return (
            self.repo
            / "outputs"
            / "narration-scripts"
            / module
            / f"episode-{episode:02d}-sample-narration.md"
        )

    def polished_path(self, episode):
        module = self.module_for_episode(episode)
        return (
            self.repo
            / "outputs"
            / "narration-scripts-polished"
            / module
            / f"episode-{episode:02d}-sample-narration.md"
        )

    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.repo = Path(self.temp_dir.name)
        self.snapshot = self.repo / "work" / "baseline-sha256.json"
        for episode in (1, 2):
            self.task = self.task_path(episode)
            self.original = self.original_path(episode)
            self.polished = self.polished_path(episode)
            self.task.parent.mkdir(parents=True, exist_ok=True)
            self.original.parent.mkdir(parents=True, exist_ok=True)
            self.polished.parent.mkdir(parents=True, exist_ok=True)
            self.task.write_text(f"task {episode}\n", encoding="utf-8")
            self.original.write_text(SAMPLE_NARRATION, encoding="utf-8")
            self.polished.write_text(SAMPLE_NARRATION, encoding="utf-8")

        self.snapshot.parent.mkdir(parents=True, exist_ok=True)
        inputs = []
        for path in sorted(self.repo.glob("episodes/*/*.md")) + sorted(
            self.repo.glob("outputs/narration-scripts/*/*.md")
        ):
            inputs.append(
                {
                    "path": path.relative_to(self.repo).as_posix(),
                    "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
                }
            )
        self.snapshot.write_text(
            json.dumps({"schema_version": 1, "inputs": inputs}), encoding="utf-8"
        )
        self.pair = discover_episode_paths(self.repo, expected_count=2)[0]
        self.task = self.pair.task_package
        self.polished = self.pair.polished_narration

    def tearDown(self):
        self.temp_dir.cleanup()

    def add_episodes_through(self, expected_count):
        for episode in range(3, expected_count + 1):
            task = self.task_path(episode)
            original = self.original_path(episode)
            polished = self.polished_path(episode)
            task.parent.mkdir(parents=True, exist_ok=True)
            original.parent.mkdir(parents=True, exist_ok=True)
            polished.parent.mkdir(parents=True, exist_ok=True)
            task.write_text(f"task {episode}\n", encoding="utf-8")
            original.write_text(SAMPLE_NARRATION, encoding="utf-8")
            polished.write_text(SAMPLE_NARRATION, encoding="utf-8")

    def test_episode_passes_for_identical_copy(self):
        self.assertEqual(validate_episode(self.pair), ())

    def test_episode_rejects_changed_n_sequence(self):
        self.polished.write_text(
            self.polished.read_text(encoding="utf-8").replace("[N002]", "[N003]"),
            encoding="utf-8",
        )
        self.assertIn("N_SEQUENCE", validate_episode(self.pair))

    def test_episode_rejects_prefix_suffix_and_number_changes(self):
        text = self.polished.read_text(encoding="utf-8").replace("2021", "2022")
        self.polished.write_text("changed\n" + text, encoding="utf-8")
        findings = validate_episode(self.pair)
        self.assertIn("OUTSIDE_N_CHANGED", findings)
        self.assertIn("NUMBERS_CHANGED:N001", findings)

    def test_episode_rejects_empty_segments_and_forbidden_meta_terms(self):
        text = self.polished.read_text(encoding="utf-8")
        text = text.replace("第二段。", "教材")
        text = text.replace("第一段含 2021 年和 2–3 名。", "")
        self.polished.write_text(text, encoding="utf-8")
        findings = validate_episode(self.pair)
        self.assertIn("EMPTY_SEGMENT:N001", findings)
        self.assertIn("FORBIDDEN_META_TERM:教材", findings)

    def test_episode_rejects_each_forbidden_meta_term(self):
        for term in FORBIDDEN_META_TERMS:
            with self.subTest(term=term):
                self.polished.write_text(
                    SAMPLE_NARRATION.replace("第二段。", term), encoding="utf-8"
                )
                self.assertEqual(
                    validate_episode(self.pair),
                    (f"FORBIDDEN_META_TERM:{term}",),
                )

    def test_episode_returns_multiple_findings_in_stable_order(self):
        text = self.polished.read_text(encoding="utf-8").replace("2021", "2022")
        self.polished.write_text("changed\n" + text.replace("第二段。", "教材"), encoding="utf-8")
        self.assertEqual(
            validate_episode(self.pair),
            (
                "OUTSIDE_N_CHANGED",
                "NUMBERS_CHANGED:N001",
                "FORBIDDEN_META_TERM:教材",
            ),
        )

    def test_inputs_reject_changed_task_package(self):
        self.task.write_text(self.task.read_text(encoding="utf-8") + "changed", encoding="utf-8")
        self.assertIn("INPUT_CHANGED", validate_inputs(self.repo, self.snapshot))

    def test_batch_rejects_missing_and_extra_polished_files(self):
        self.polished.unlink()
        (self.polished.parent.parent / "extra.md").write_text("extra", encoding="utf-8")
        findings = validate_batch(self.repo, self.snapshot, expected_count=2)
        self.assertIn("POLISHED_PATH_SET", findings)

    def test_batch_returns_input_finding_before_discovery_when_input_is_missing(self):
        self.task.unlink()
        self.assertEqual(
            validate_batch(self.repo, self.snapshot, expected_count=2),
            ("INPUT_CHANGED",),
        )

    def test_batch_rejects_wrong_module_topology_for_full_course(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            repo = Path(temp_dir)
            for episode in range(1, 52):
                task = repo / "episodes" / "module-a" / f"episode-{episode:02d}-sample-task-package.md"
                original = (
                    repo
                    / "outputs"
                    / "narration-scripts"
                    / "module-a"
                    / f"episode-{episode:02d}-sample-narration.md"
                )
                task.parent.mkdir(parents=True, exist_ok=True)
                original.parent.mkdir(parents=True, exist_ok=True)
                task.write_text("task", encoding="utf-8")
                original.write_text(SAMPLE_NARRATION, encoding="utf-8")
            snapshot = repo / "baseline-sha256.json"
            snapshot.write_text(
                json.dumps({"schema_version": 1, "inputs": []}),
                encoding="utf-8",
            )

            with self.assertRaisesRegex(ValueError, "five-module topology"):
                validate_batch(repo, snapshot)

    def test_cli_emits_utf8_finding(self):
        self.add_episodes_through(51)
        self.polished.write_text(
            self.polished.read_text(encoding="utf-8").replace("第二段。", "教材"),
            encoding="utf-8",
        )
        result = subprocess.run(
            [
                sys.executable,
                str(SKILL_ROOT / "scripts" / "validate_narration.py"),
                "--repo-root",
                str(self.repo),
                "--snapshot",
                str(self.snapshot),
                "--episode",
                "1",
            ],
            capture_output=True,
            check=False,
        )
        self.assertEqual(result.returncode, 1)
        self.assertEqual(result.stdout.decode("utf-8").splitlines(), ["FORBIDDEN_META_TERM:教材"])

    def test_cli_stops_after_input_changed_without_discovery(self):
        self.task.unlink()
        result = subprocess.run(
            [
                sys.executable,
                str(SKILL_ROOT / "scripts" / "validate_narration.py"),
                "--repo-root",
                str(self.repo),
                "--snapshot",
                str(self.snapshot),
                "--episode",
                "1",
            ],
            capture_output=True,
            check=False,
        )
        self.assertEqual(result.returncode, 1)
        self.assertEqual(result.stderr, b"")
        self.assertEqual(result.stdout.decode("utf-8").splitlines(), ["INPUT_CHANGED"])

    def test_all_cli_reports_findings_without_traceback(self):
        self.add_episodes_through(51)
        self.polished.write_text(
            self.polished.read_text(encoding="utf-8").replace("第二段。", "教材"),
            encoding="utf-8",
        )
        last_polished = self.polished_path(51)
        last_polished.write_text(
            last_polished.read_text(encoding="utf-8").replace("第二段。", "审核通过"),
            encoding="utf-8",
        )
        result = subprocess.run(
            [
                sys.executable,
                str(SKILL_ROOT / "scripts" / "validate_narration.py"),
                "--repo-root",
                str(self.repo),
                "--snapshot",
                str(self.snapshot),
                "--all",
            ],
            capture_output=True,
            check=False,
        )
        self.assertEqual(result.returncode, 1)
        self.assertEqual(result.stderr, b"")
        self.assertEqual(
            result.stdout.decode("utf-8").splitlines(),
            ["FORBIDDEN_META_TERM:教材", "FORBIDDEN_META_TERM:审核通过"],
        )


