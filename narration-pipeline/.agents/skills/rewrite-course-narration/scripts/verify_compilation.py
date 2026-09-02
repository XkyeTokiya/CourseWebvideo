from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

try:
    from a_page_contract import SCHEMA_VERSION, SCHEMA_VERSION_V5, SCHEMA_VERSION_V6, parse_task_package, validate_a_page, validate_compile_trace
except ImportError:  # pragma: no cover - CLI 与脚本同目录，正常执行不会进入此分支
    SCHEMA_VERSION = "courseplay-a-page/v4"  # type: ignore[assignment]
    SCHEMA_VERSION_V5 = "courseplay-a-page/v5"  # type: ignore[assignment]
    SCHEMA_VERSION_V6 = "courseplay-a-page/v6"  # type: ignore[assignment]
    parse_task_package = None  # type: ignore[assignment]
    validate_a_page = None  # type: ignore[assignment]
    validate_compile_trace = None  # type: ignore[assignment]


def _trim_blank_edge_lines(text: str) -> str:
    lines = text.split("\n")
    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()
    return "\n".join(lines)


def canonicalize_stage1_output(text: str) -> str:
    """把 Stage 1 输出规范化为批准母版：剥离三节标题、统一 LF、去首尾空行、保留内部文本。"""
    normalized = text.replace("\r\n", "\n").replace("\r", "\n")
    if any(line.strip() == "---" for line in normalized.split("\n")):
        raise ValueError("STEP_SEPARATOR_FORBIDDEN")

    headings = ("【视频标题】", "【开场导入】", "【正文讲解】")
    positions: list[int] = []
    for heading in headings:
        if normalized.count(heading) != 1:
            raise ValueError(f"HEADING_COUNT_INVALID:{heading}")
        positions.append(normalized.index(heading))
    if positions != sorted(positions):
        raise ValueError("HEADING_ORDER_INVALID")

    opening_start = positions[1] + len(headings[1])
    body_start = positions[2] + len(headings[2])
    opening = _trim_blank_edge_lines(normalized[opening_start : positions[2]])
    body = _trim_blank_edge_lines(normalized[body_start:])
    if not opening or not body:
        raise ValueError("SPOKEN_SECTION_EMPTY")
    return f"{opening}\n\n{body}"


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _sanitize_public_report(value):
    if isinstance(value, str):
        return re.sub(r"(?<![A-Za-z0-9])B\d{2,3}(?!\d)", "redacted-compile-id", value)
    if isinstance(value, list):
        return [_sanitize_public_report(item) for item in value]
    if isinstance(value, dict):
        return {key: _sanitize_public_report(item) for key, item in value.items()}
    return value


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify the canonical Courseplay A-page semantic handoff.")
    parser.add_argument("--approved-text", type=Path, required=True, help="Approved spoken text (canonicalized).")
    parser.add_argument("--compiled-json", type=Path, required=True, help="Courseplay A-page production JSON.")
    parser.add_argument(
        "--validation-profile",
        choices=["a-page-v4", "a-page-v5", "a-page-v6"],
        default="a-page-v6",
        help="Canonical validation profile.",
    )
    parser.add_argument("--task-package", type=Path, required=True, help="Frozen compile-time task package.")
    parser.add_argument("--compile-trace", type=Path, required=True, help="Work-only B-to-A compile trace.")
    parser.add_argument("--output", type=Path, required=True, help="Write the B-free production validation report.")
    args = parser.parse_args()

    if validate_a_page is None or validate_compile_trace is None or parse_task_package is None:
        print("FAIL VALIDATOR_UNAVAILABLE")
        return 2
    try:
        approved = args.approved_text.read_text(encoding="utf-8")
        payload = json.loads(args.compiled_json.read_text(encoding="utf-8"))
        trace = json.loads(args.compile_trace.read_text(encoding="utf-8"))
        task_package = parse_task_package(args.task_package.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError, AttributeError) as exc:
        print(f"FAIL READ_FAILED:{exc}")
        return 2
    if not isinstance(payload, dict) or not isinstance(trace, dict):
        print("FAIL JSON_OBJECT_REQUIRED")
        return 1
    expected_schema = {
        "a-page-v4": SCHEMA_VERSION,
        "a-page-v5": SCHEMA_VERSION_V5,
        "a-page-v6": SCHEMA_VERSION_V6,
    }[args.validation_profile]
    if payload.get("schema_version") != expected_schema:
        print(f"FAIL VALIDATION_PROFILE_SCHEMA_MISMATCH:{args.validation_profile}:{payload.get('schema_version')}")
        return 1

    report = validate_a_page(approved_text=approved, payload=payload)
    coverage = validate_compile_trace(
        page_payload=payload,
        trace=trace,
        task_package=task_package,
    )
    report["compile_coverage"] = {
        "coverage_passed": coverage["coverage_passed"],
        "trace_sha256": _sha256(args.compile_trace),
    }
    report["input_integrity"] = {
        "task_package_sha256": _sha256(args.task_package),
        "approved_text_sha256": _sha256(args.approved_text),
        "a_page_sha256": _sha256(args.compiled_json),
    }
    report["failures"] = sorted(set(report["failures"] + coverage["failures"]))
    report = _sanitize_public_report(report)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if report["failures"]:
        for error in report["failures"]:
            print(f"FAIL {error}")
        return 1
    print(f"PASS {args.validation_profile}: A-page semantics, screen contract, Nx, timing, and compile coverage are valid")
    return 0


if __name__ == "__main__":
    sys.exit(main())
