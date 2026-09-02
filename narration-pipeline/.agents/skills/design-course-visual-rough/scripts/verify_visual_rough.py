from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

from recipe_library import load_recipe_directory
from visual_rough_contract import validate_visual_rough


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate Courseplay visual rough.")
    parser.add_argument("--a-page", type=Path, required=True)
    parser.add_argument("--visual-rough", type=Path, required=True)
    parser.add_argument("--recipes-dir", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    try:
        source_bytes = args.a_page.read_bytes()
        source_payload = json.loads(source_bytes.decode("utf-8"))
        rough_bytes = args.visual_rough.read_bytes()
        rough_text = rough_bytes.decode("utf-8")
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        print(f"FAIL READ_FAILED:{exc}")
        return 2
    registry, recipe_failures, registry_sha256 = load_recipe_directory(args.recipes_dir)
    report = validate_visual_rough(
        source_payload=source_payload,
        source_sha256=hashlib.sha256(source_bytes).hexdigest(),
        rough_text=rough_text,
        registry=registry,
    )
    report["failures"] = sorted(
        set(report["failures"] + [f"RECIPE_LIBRARY_INVALID:{item}" for item in recipe_failures])
    )
    report["input_integrity"] = {
        "a_page_sha256": hashlib.sha256(source_bytes).hexdigest(),
        "visual_rough_sha256": hashlib.sha256(rough_bytes).hexdigest(),
        "recipe_registry_sha256": registry_sha256,
    }
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if report["failures"]:
        for failure in report["failures"]:
            print(f"FAIL {failure}")
        return 1
    print(f"PASS {report['validation_profile']}: source binding, recipes, screen slots, images, and logic limits are valid")
    return 0


if __name__ == "__main__":
    sys.exit(main())
