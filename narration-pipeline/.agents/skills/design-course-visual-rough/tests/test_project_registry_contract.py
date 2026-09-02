from __future__ import annotations

import json
import unittest
from pathlib import Path


REPOSITORY_ROOT = Path(__file__).resolve().parents[5]


class ProjectRegistryContractTests(unittest.TestCase):
    def test_registry_viewer_can_render_v6_guidance_without_changing_v5_fields(self) -> None:
        viewer = (REPOSITORY_ROOT / ".tmp" / "narration-pipeline" / "project-registry" / "viewer.html").read_text(
            encoding="utf-8"
        )
        self.assertIn("courseplay-a-page/v6", viewer)
        self.assertIn("item.guidance_text", viewer)
        self.assertIn("item.usage_policy", viewer)
        self.assertIn("item.source_text", viewer)

    def test_first_four_visual_rough_states_and_paths_are_consistent(self) -> None:
        payload = json.loads(
            (REPOSITORY_ROOT / ".tmp" / "narration-pipeline" / "project-registry" / "episode-progress.json").read_text(
                encoding="utf-8"
            )
        )
        episodes = {item["episode_id"]: item for item in payload["episodes"]}
        self.assertEqual("approved", episodes["04"]["stages"]["visual_rough"])
        for episode_id in ("01", "02", "03"):
            episode = episodes[episode_id]
            self.assertEqual("draft", episode["stages"]["visual_rough"])
            self.assertTrue(episode["artifacts"]["visual_rough"].startswith("../.tmp/narration-pipeline/"))
            self.assertTrue(
                (REPOSITORY_ROOT / episode["artifacts"]["visual_rough"]).is_file()
            )
            report = json.loads(
                (REPOSITORY_ROOT / episode["artifacts"]["visual_rough_validation"]).read_text(
                    encoding="utf-8"
                )
            )
            self.assertEqual("draft", report["status"])
            self.assertEqual([], report["failures"])
        self.assertTrue(episodes["04"]["artifacts"]["visual_rough"].startswith("output/"))






