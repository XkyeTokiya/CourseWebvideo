"""Synchronize a finished A-page's Nx text, timing, and approved text mirror."""

from __future__ import annotations

import argparse
import importlib.util
import json
import os
import sys
import tempfile
from pathlib import Path
from typing import Any, Callable


MECHANICAL_TIMING_FIELDS = (
    "char_equivalent",
    "min_seconds",
    "target_seconds",
    "max_seconds",
)


def _load_compute_timing() -> Callable[[str], dict[str, Any]]:
    workspace_root = Path(__file__).resolve().parents[4]
    contract_path = (
        workspace_root
        / ".agents"
        / "skills"
        / "rewrite-course-narration"
        / "scripts"
        / "a_page_contract.py"
    )
    if not contract_path.is_file():
        raise RuntimeError(f"CANONICAL_TIMING_CONTRACT_NOT_FOUND:{contract_path}")
    spec = importlib.util.spec_from_file_location("courseplay_a_page_contract", contract_path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"CANONICAL_TIMING_CONTRACT_UNAVAILABLE:{contract_path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module.compute_timing


def _read_payload(path: Path) -> dict[str, Any]:
    try:
        payload = json.loads(path.read_text(encoding="utf-8-sig"))
    except (OSError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"A_PAGE_READ_FAILED:{exc}") from exc
    if not isinstance(payload, dict):
        raise RuntimeError("A_PAGE_OBJECT_REQUIRED")
    return payload


def _validate_inputs(payload: dict[str, Any], approved_text_path: Path) -> list[dict[str, Any]]:
    if payload.get("schema_version") != "courseplay-a-page/v4":
        raise RuntimeError("SCHEMA_VERSION_INVALID")
    if payload.get("document_kind") != "production":
        raise RuntimeError("DOCUMENT_KIND_INVALID")
    if payload.get("approved_text") != approved_text_path.name:
        raise RuntimeError(
            "APPROVED_TEXT_REFERENCE_MISMATCH:"
            f"json={payload.get('approved_text')!r}:path={approved_text_path.name!r}"
        )
    pages = payload.get("pages")
    if not isinstance(pages, list) or not pages:
        raise RuntimeError("PAGES_REQUIRED")
    seen_ids: set[str] = set()
    for index, page in enumerate(pages):
        if not isinstance(page, dict):
            raise RuntimeError(f"PAGE_OBJECT_REQUIRED:index={index}")
        a_id = page.get("a_id")
        if not isinstance(a_id, str) or not a_id:
            raise RuntimeError(f"A_ID_REQUIRED:index={index}")
        if a_id in seen_ids:
            raise RuntimeError(f"A_ID_DUPLICATE:{a_id}")
        seen_ids.add(a_id)
        nx = page.get("nx")
        if not isinstance(nx, str) or not nx:
            raise RuntimeError(f"NX_REQUIRED:{a_id}")
        timing = page.get("timing")
        if not isinstance(timing, dict):
            raise RuntimeError(f"TIMING_OBJECT_REQUIRED:{a_id}")
    return pages


def _json_number(value: Any) -> Any:
    if isinstance(value, float) and value.is_integer():
        return int(value)
    return value


def _atomic_write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp_name: str | None = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            newline="\n",
            dir=path.parent,
            prefix=f".{path.name}.",
            suffix=".tmp",
            delete=False,
        ) as handle:
            handle.write(text)
            temp_name = handle.name
        os.replace(temp_name, path)
    finally:
        if temp_name is not None:
            temp_path = Path(temp_name)
            if temp_path.exists():
                temp_path.unlink()


def _approved_text_drift(
    *,
    expected: str,
    actual: str | None,
    pages: list[dict[str, Any]],
) -> str:
    actual_text = "" if actual is None else actual
    shared_length = min(len(expected), len(actual_text))
    difference_index = next(
        (
            index
            for index in range(shared_length)
            if expected[index] != actual_text[index]
        ),
        shared_length,
    )
    cumulative = 0
    affected_a_id = pages[-1]["a_id"]
    for page in pages:
        cumulative += len(page["nx"])
        if difference_index < cumulative:
            affected_a_id = page["a_id"]
            break
    expected_fragment = expected[difference_index : difference_index + 12]
    actual_fragment = actual_text[difference_index : difference_index + 12]
    return (
        "APPROVED_TEXT_MISMATCH:"
        f"index={difference_index}:a_id={affected_a_id}:"
        f"expected={expected_fragment!r}:actual={actual_fragment!r}"
    )


def synchronize(
    *,
    a_page_path: Path,
    approved_text_path: Path,
    write: bool,
) -> tuple[list[str], list[str]]:
    payload = _read_payload(a_page_path)
    pages = _validate_inputs(payload, approved_text_path)
    compute_timing = _load_compute_timing()

    drift: list[str] = []
    timing_pages: list[str] = []
    for page in pages:
        a_id = page["a_id"]
        timing = page["timing"]
        expected = compute_timing(page["nx"])
        mismatched = [
            field
            for field in MECHANICAL_TIMING_FIELDS
            if timing.get(field) != expected[field]
        ]
        if mismatched:
            drift.append(f"TIMING_MISMATCH:{a_id}:{','.join(mismatched)}")
            timing_pages.append(a_id)
            if write:
                for field in MECHANICAL_TIMING_FIELDS:
                    timing[field] = _json_number(expected[field])

    approved_expected = "".join(page["nx"] for page in pages)
    try:
        approved_actual = approved_text_path.read_text(encoding="utf-8-sig")
    except FileNotFoundError:
        approved_actual = None
    except OSError as exc:
        raise RuntimeError(f"APPROVED_TEXT_READ_FAILED:{exc}") from exc
    if approved_actual != approved_expected:
        drift.append(
            _approved_text_drift(
                expected=approved_expected,
                actual=approved_actual,
                pages=pages,
            )
        )

    if write:
        if timing_pages:
            serialized = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
            _atomic_write_text(a_page_path, serialized)
        if approved_actual != approved_expected:
            _atomic_write_text(approved_text_path, approved_expected)
    return drift, timing_pages


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Synchronize courseplay-a-page/v4 Nx timing and approved spoken text."
    )
    parser.add_argument("--a-page", type=Path, required=True)
    parser.add_argument("--approved-text", type=Path, required=True)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--check", action="store_true", help="Report drift without writing files.")
    mode.add_argument("--write", action="store_true", help="Repair timing and approved text from Nx.")
    args = parser.parse_args()

    try:
        drift, timing_pages = synchronize(
            a_page_path=args.a_page,
            approved_text_path=args.approved_text,
            write=args.write,
        )
    except RuntimeError as exc:
        print(f"FAIL {exc}")
        return 2

    if args.check:
        if drift:
            for item in drift:
                print(f"FAIL {item}")
            return 1
        print("PASS Nx concatenation and mechanical timing are synchronized")
        return 0

    changed_artifacts: list[str] = []
    if timing_pages:
        changed_artifacts.append(f"timing={','.join(timing_pages)}")
    if any(item.startswith("APPROVED_TEXT_MISMATCH:") for item in drift):
        changed_artifacts.append("approved_text")
    if changed_artifacts:
        print(f"UPDATED {'; '.join(changed_artifacts)}")
    else:
        print("UNCHANGED Nx concatenation and mechanical timing were already synchronized")
    return 0


if __name__ == "__main__":
    sys.exit(main())
