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
    pages = payload.get("pages", [])
    counters = {"S": 0, "G": 0, "R": 0, "C": 0}
    id_maps: dict[str, dict[str, str]] = {kind: {} for kind in ("A", "S", "G", "R", "C")}
    for page_index, page in enumerate(pages, 1):
        old_a_id = page.get("a_id")
        if isinstance(old_a_id, str): id_maps["A"].setdefault(old_a_id, f"A{page_index:03d}")
        screen = page.get("screen", {}) if isinstance(page.get("screen", {}), dict) else {}
        title = screen.get("title")
        if isinstance(title, dict):
            old_id = title.get("screen_item_id")
            if isinstance(old_id, str): id_maps["S"].setdefault(old_id, f"S{counters['S'] + 1:03d}")
            counters["S"] += 1
        for group in screen.get("groups", []) if isinstance(screen.get("groups"), list) else []:
            if not isinstance(group, dict): continue
            old_id = group.get("group_id")
            if isinstance(old_id, str): id_maps["G"].setdefault(old_id, f"G{counters['G'] + 1:03d}")
            counters["G"] += 1
            for item in group.get("items", []) if isinstance(group.get("items"), list) else []:
                if not isinstance(item, dict): continue
                old_id = item.get("screen_item_id")
                if isinstance(old_id, str): id_maps["S"].setdefault(old_id, f"S{counters['S'] + 1:03d}")
                counters["S"] += 1
        for relation in page.get("protected_relations", []) if isinstance(page.get("protected_relations"), list) else []:
            if not isinstance(relation, dict): continue
            old_id = relation.get("relation_id")
            if isinstance(old_id, str): id_maps["R"].setdefault(old_id, f"R{counters['R'] + 1:03d}")
            counters["R"] += 1
        for constraint in page.get("silent_constraints", []) if isinstance(page.get("silent_constraints"), list) else []:
            if not isinstance(constraint, dict): continue
            old_id = constraint.get("constraint_id")
            if isinstance(old_id, str): id_maps["C"].setdefault(old_id, f"C{counters['C'] + 1:03d}")
            counters["C"] += 1

    all_id_map = {old: new for mapping in id_maps.values() for old, new in mapping.items()}
    counters = {"S": 0, "G": 0, "R": 0, "C": 0}
    for page_index, page in enumerate(pages, 1):
        page["a_id"] = f"A{page_index:03d}"
        if isinstance(page.get("callback_a_ids"), list):
            page["callback_a_ids"] = [id_maps["A"].get(callback, callback) for callback in page["callback_a_ids"]]
        screen = page.get("screen", {}) if isinstance(page.get("screen", {}), dict) else {}
        title = screen.get("title")
        if isinstance(title, dict):
            counters["S"] += 1; title["screen_item_id"] = f"S{counters['S']:03d}"
        for group in screen.get("groups", []) if isinstance(screen.get("groups"), list) else []:
            if not isinstance(group, dict): continue
            counters["G"] += 1; group["group_id"] = f"G{counters['G']:03d}"
            for item in group.get("items", []) if isinstance(group.get("items"), list) else []:
                if isinstance(item, dict): counters["S"] += 1; item["screen_item_id"] = f"S{counters['S']:03d}"
        for relation in page.get("protected_relations", []) if isinstance(page.get("protected_relations"), list) else []:
            if isinstance(relation, dict):
                counters["R"] += 1; relation["relation_id"] = f"R{counters['R']:03d}"
                for field in ("from", "to"):
                    if isinstance(relation.get(field), str): relation[field] = all_id_map.get(relation[field], relation[field])
        for constraint in page.get("silent_constraints", []) if isinstance(page.get("silent_constraints"), list) else []:
            if isinstance(constraint, dict): counters["C"] += 1; constraint["constraint_id"] = f"C{counters['C']:03d}"
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
