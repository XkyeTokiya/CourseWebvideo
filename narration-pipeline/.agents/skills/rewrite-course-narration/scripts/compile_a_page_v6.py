"""Normalize an authored A-page draft into deterministic courseplay-a-page/v6 JSON."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from a_page_contract import SCHEMA_VERSION, TIMING_MODEL, compute_timing


def normalize(payload: dict, *, episode_id: str) -> dict:
    payload["schema_version"] = SCHEMA_VERSION
    payload["document_kind"] = "production"
    payload["episode_id"] = episode_id
    payload["approved_text"] = "approved-spoken-text.txt"
    payload["timing_model"] = TIMING_MODEL
    counters = {"S": 0, "G": 0, "R": 0, "C": 0}
    for page_index, page in enumerate(payload.get("pages", []), 1):
        page["a_id"] = f"A{page_index:03d}"
        for item in [page.get("screen", {}).get("title")]:
            if isinstance(item, dict): counters["S"] += 1; item["screen_item_id"] = f"S{counters['S']:03d}"
        for group in page.get("screen", {}).get("groups", []):
            counters["G"] += 1; group["group_id"] = f"G{counters['G']:03d}"
            for item in group.get("items", []): counters["S"] += 1; item["screen_item_id"] = f"S{counters['S']:03d}"
        for relation in page.get("protected_relations", []): counters["R"] += 1; relation["relation_id"] = f"R{counters['R']:03d}"
        for constraint in page.get("silent_constraints", []): counters["C"] += 1; constraint["constraint_id"] = f"C{counters['C']:03d}"
        reason = page.get("timing", {}).get("short_page_reason")
        page["timing"] = compute_timing(page.get("nx", ""))
        if page["timing"]["target_seconds"] < 8: page["timing"]["short_page_reason"] = reason or "短页由作者确认"
    return payload


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, required=True); parser.add_argument("--output", type=Path, required=True); parser.add_argument("--episode", required=True)
    args = parser.parse_args(); payload = normalize(json.loads(args.input.read_text(encoding="utf-8")), episode_id=args.episode)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__": raise SystemExit(main())
