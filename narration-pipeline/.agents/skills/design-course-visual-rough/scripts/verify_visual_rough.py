from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

from recipe_library import load_recipe_directory
from visual_rough_contract import load_error_catalog, validate_visual_rough


def _cli_failure(code: str, path: str, actual) -> None:
    catalog = load_error_catalog()
    definition = catalog["VR4_TOOL_DEFECT"] if code not in catalog else catalog[code]
    print(json.dumps({"failures": [code if code in catalog else "VR4_TOOL_DEFECT"], "errors": [{"code": code if code in catalog else "VR4_TOOL_DEFECT", "path": path, "expected": "公开 visual rough 输入", "actual": actual, "message": definition["message"], "hint": definition["hint"], "contractSection": definition["contractSection"]}]}, ensure_ascii=False))


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate Courseplay visual rough.")
    parser.add_argument("--a-page", type=Path, required=True)
    parser.add_argument("--visual-rough", type=Path, required=True)
    parser.add_argument("--recipes-dir", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--summary-output", "--preflight-output", dest="summary_output", type=Path, help="Optional validation summary output; the legacy spelling is accepted for compatibility.")
    args = parser.parse_args()
    try:
        source_bytes = args.a_page.read_bytes()
        source_payload = json.loads(source_bytes.decode("utf-8"))
        rough_bytes = args.visual_rough.read_bytes()
        rough_text = rough_bytes.decode("utf-8")
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        _cli_failure("VR4_TOOL_DEFECT", "inputs", str(exc))
        return 2
    registry, recipe_failures, registry_sha256 = load_recipe_directory(args.recipes_dir)
    report = validate_visual_rough(
        source_payload=source_payload,
        source_sha256=hashlib.sha256(source_bytes).hexdigest(),
        rough_text=rough_text,
        registry=registry,
        catalog=load_error_catalog(),
    )
    if recipe_failures:
        catalog = load_error_catalog()
        definition = catalog["VR4_TOOL_DEFECT"]
        report["errors"].append({
            "code": "VR4_TOOL_DEFECT",
            "path": "recipe_registry",
            "expected": "valid recipe registry",
            "actual": recipe_failures,
            "message": definition["message"],
            "hint": definition["hint"],
            "contractSection": definition["contractSection"],
        })
    report["failures"] = sorted(set(report["failures"] + (["VR4_TOOL_DEFECT"] if recipe_failures else [])))
    report["input_integrity"] = {
        "a_page_sha256": hashlib.sha256(source_bytes).hexdigest(),
        "visual_rough_sha256": hashlib.sha256(rough_bytes).hexdigest(),
        "recipe_registry_sha256": registry_sha256,
    }
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if args.summary_output:
        args.summary_output.write_text(json.dumps(report["validation_summary"], ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if report["failures"]:
        print(json.dumps({"failures": report["failures"], "errors": report["errors"]}, ensure_ascii=False))
        return 1
    print(f"PASS {report['validation_profile']}: U coverage, recipes, slots, media, and relation carriers are valid")
    return 0


if __name__ == "__main__":
    sys.exit(main())
