import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "publish_handoff.py"
SPEC = importlib.util.spec_from_file_location("publish_handoff", SCRIPT)
PUBLISH = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(PUBLISH)


class PublishHandoffTest(unittest.TestCase):
    def test_publish_copies_editorial_labels_in_spoken_text_and_a_page(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            source = root / "source"
            source.mkdir()
            player = root / "player"
            inputs = player / "episodes" / "episode-99" / "inputs"
            inputs.mkdir(parents=True)
            (inputs.parent / "project.json").write_text("{}", encoding="utf-8")
            text = "【视频标题】标题\n【开场导入】开场\n【正文讲解】正文\n【本期总结】总结"
            spoken = source / "approved-spoken-text.txt"
            spoken.write_text(text, encoding="utf-8")
            a_page = source / "episode-99-a-page.json"
            a_page.write_text(json.dumps({"pages": [{"a_id": "A001", "nx": text}]}, ensure_ascii=False), encoding="utf-8")

            self.assertEqual(len(PUBLISH.publish(source, player, "episode-99", dry_run=True)), 2)
            PUBLISH.publish(source, player, "episode-99")
            self.assertEqual((inputs / spoken.name).read_text(encoding="utf-8"), text)
            self.assertEqual(json.loads((inputs / a_page.name).read_text(encoding="utf-8"))["pages"][0]["nx"], text)


if __name__ == "__main__":
    unittest.main()
