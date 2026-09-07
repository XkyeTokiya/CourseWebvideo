"""Current-only Courseplay A-page v6 contract and compile-trace validation."""

from __future__ import annotations

import math
import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

SCHEMA_VERSION = "courseplay-a-page/v6"
SCHEMA_VERSION_V6 = SCHEMA_VERSION
TIMING_MODEL = {"han_weight": 1, "fullwidth_punctuation_weight": 0, "other_non_whitespace_weight": 0.5, "chars_per_minute": {"minimum": 220, "target": 230, "maximum": 240}}
TOP = {"schema_version", "document_kind", "episode_id", "approved_text", "timing_model", "evidence_catalog", "pages"}
PAGE = {"a_id", "callback_a_ids", "nx", "teaching_purpose", "single_message", "screen", "protected_relations", "silent_constraints", "entry_condition", "exit_condition", "timing"}
ITEM = {"screen_item_id", "guidance_text", "usage_policy", "evidence_refs"}
GROUP = {"group_id", "items"}; SCREEN = {"title", "groups"}
RELATION = {"relation_id", "from", "relation", "to", "direction"}
CONSTRAINT = {"constraint_id", "instruction", "evidence_refs"}
TIMING = {"char_equivalent", "min_seconds", "target_seconds", "max_seconds", "short_page_reason"}
EVIDENCE = {"evidence_id", "claim_or_asset", "source_locator", "verification_status", "allowed_use"}
FULLWIDTH = frozenset("，。！？；：、‘’“”（）《》〈〉【】〔〕［］｛｝—…·～")
ERROR_CATALOG_PATH = Path(__file__).resolve().parents[1] / "references" / "error-catalog.json"


def load_error_catalog() -> dict[str, dict[str, str]]:
    payload = json.loads(ERROR_CATALOG_PATH.read_text(encoding="utf-8"))
    return {item["code"]: item for item in payload["errors"]}


def structured_errors(failures: list[str], *, trace: bool = False) -> list[dict[str, Any]]:
    catalog = load_error_catalog()
    fallback = "TRACE_TOOL_DEFECT" if trace else "A_PAGE_TOOL_DEFECT"
    result = []
    for failure in sorted(set(failures)):
        raw_code, _, detail = failure.partition(":")
        code = raw_code if raw_code in catalog else fallback
        definition = catalog[code]
        result.append({
            "code": code,
            "path": detail or "$",
            "expected": f"公开契约的 {definition['contractSection']} 规则",
            "actual": detail or None,
            "message": definition["message"],
            "hint": definition["hint"],
            "contractSection": definition["contractSection"],
        })
    return result


def canonicalize_approved_text(text: str) -> str:
    normalized = text.replace("\r\n", "\n").replace("\r", "\n").lstrip("\ufeff")
    lines = normalized.split("\n")
    while lines and not lines[0].strip(): lines.pop(0)
    while lines and not lines[-1].strip(): lines.pop()
    return "\n".join(lines)


@dataclass
class TaskPackageSource:
    b_ids: list[str] = field(default_factory=list)
    evidence_catalog: list[dict[str, Any]] = field(default_factory=list)

    def as_mapping(self) -> dict[str, Any]: return {"b_ids": list(self.b_ids), "evidence_catalog": list(self.evidence_catalog)}


def parse_task_package(text: str) -> TaskPackageSource:
    b_ids = []
    evidence = []
    for line in text.splitlines():
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")] if line.strip().startswith("|") else []
        if cells and re.fullmatch(r"B\d{2,3}", cells[0]): b_ids.append(cells[0])
        elif cells and re.fullmatch(r"E\d{2,3}", cells[0]) and len(cells) >= 8:
            evidence.append({"evidence_id": cells[0], "claim_or_asset": cells[2], "source_locator": cells[4].replace("`", ""), "verification_status": cells[5].replace("`", ""), "allowed_use": cells[6]})
    return TaskPackageSource(b_ids, evidence)


def _han(character: str) -> bool:
    point = ord(character); return 0x3400 <= point <= 0x4DBF or 0x4E00 <= point <= 0x9FFF or 0x20000 <= point <= 0x3134F


def compute_char_equivalent(text: str) -> float:
    return sum(0 if c.isspace() or c in FULLWIDTH else 1 if _han(c) else 0.5 for c in text)


def compute_timing(text: str) -> dict[str, Any]:
    value = compute_char_equivalent(text); minimum = math.ceil(value * 60 / 240); maximum = math.ceil(value * 60 / 220)
    target = max(minimum, min(math.floor(value * 60 / 230 + 0.5), maximum))
    return {"char_equivalent": value, "min_seconds": minimum, "target_seconds": target, "max_seconds": maximum, "short_page_reason": None}


def contains_b_reference(value: Any) -> bool:
    if isinstance(value, str): return bool(re.search(r"(?<![A-Za-z0-9])B\d{2,3}(?!\d)", value))
    if isinstance(value, list): return any(contains_b_reference(item) for item in value)
    if isinstance(value, dict): return any(key == "source_b_ids" or contains_b_reference(item) for key, item in value.items())
    return False


def _shape(value: Any, fields: set[str], path: str, failures: list[str]) -> bool:
    if not isinstance(value, dict): failures.append(f"OBJECT_REQUIRED:{path}"); return False
    for name in sorted(fields - set(value)): failures.append(f"FIELD_REQUIRED:{path}:{name}")
    for name in sorted(set(value) - fields): failures.append(f"UNKNOWN_FIELD:{path}:{name}")
    return True


def _refs(refs: Any, evidence_ids: set[str], path: str, failures: list[str]) -> None:
    if not isinstance(refs, list) or not refs or not all(isinstance(ref, str) for ref in refs): failures.append(f"EVIDENCE_REFS_TYPE_INVALID:{path}"); return
    for ref in refs:
        if ref not in evidence_ids: failures.append(f"EVIDENCE_UNKNOWN:{path}:{ref}")


def validate_a_page_v6(*, approved_text: str, payload: dict[str, Any]) -> dict[str, Any]:
    approved_text = canonicalize_approved_text(approved_text)
    failures: list[str] = []
    _shape(payload, TOP, "document", failures)
    if payload.get("schema_version") != SCHEMA_VERSION: failures.append("SCHEMA_VERSION_INVALID")
    if payload.get("document_kind") != "production": failures.append("DOCUMENT_KIND_INVALID")
    if payload.get("approved_text") != "approved-spoken-text.txt": failures.append("APPROVED_TEXT_REFERENCE_INVALID")
    if payload.get("timing_model") != TIMING_MODEL: failures.append("TIMING_MODEL_INVALID")
    if contains_b_reference(payload): failures.append("B_REFERENCE_FORBIDDEN")
    evidence_ids: set[str] = set()
    evidence = payload.get("evidence_catalog")
    if not isinstance(evidence, list): failures.append("EVIDENCE_CATALOG_TYPE_INVALID"); evidence = []
    for index, item in enumerate(evidence):
        path = f"evidence_catalog[{index}]"
        if not _shape(item, EVIDENCE, path, failures): continue
        eid = item.get("evidence_id")
        if not isinstance(eid, str) or not re.fullmatch(r"E\d{3}", eid): failures.append(f"EVIDENCE_ID_INVALID:{path}")
        elif eid in evidence_ids: failures.append(f"EVIDENCE_ID_DUPLICATE:{eid}")
        else: evidence_ids.add(eid)
    pages = payload.get("pages")
    if not isinstance(pages, list) or not pages: failures.append("PAGES_REQUIRED"); pages = []
    expected_a = [f"A{i:03d}" for i in range(1, len(pages) + 1)]; actual_a = [p.get("a_id") for p in pages if isinstance(p, dict)]
    if actual_a != expected_a: failures.append("A_ID_SEQUENCE_INVALID")
    s_ids: list[str] = []; g_ids: list[str] = []; r_ids: list[str] = []; c_ids: list[str] = []; nx_parts = []; total_seconds = 0; short = []
    for page_index, page in enumerate(pages):
        aid = page.get("a_id", "?") if isinstance(page, dict) else "?"
        if not _shape(page, PAGE, aid, failures): continue
        callbacks = page.get("callback_a_ids")
        if not isinstance(callbacks, list): failures.append(f"CALLBACK_TYPE_INVALID:{aid}")
        else:
            for callback in callbacks:
                if callback not in expected_a or expected_a.index(callback) >= page_index: failures.append(f"CALLBACK_INVALID:{aid}:{callback}")
        screen = page.get("screen")
        if not _shape(screen, SCREEN, f"{aid}.screen", failures): screen = {}
        items: list[tuple[Any, str]] = [(screen.get("title"), f"{aid}.screen.title")]
        groups = screen.get("groups")
        if not isinstance(groups, list) or not groups: failures.append(f"SCREEN_GROUPS_REQUIRED:{aid}"); groups = []
        for gi, group in enumerate(groups):
            group_path = f"{aid}.screen.groups[{gi}]"
            if not _shape(group, GROUP, group_path, failures): continue
            gid = group.get("group_id")
            if not isinstance(gid, str) or not re.fullmatch(r"G\d{3}", gid): failures.append(f"SCREEN_GROUP_ID_INVALID:{group_path}")
            elif gid in g_ids: failures.append(f"SCREEN_GROUP_ID_DUPLICATE:{gid}")
            else: g_ids.append(gid)
            group_items = group.get("items")
            if not isinstance(group_items, list) or not group_items: failures.append(f"SCREEN_GROUP_ITEMS_REQUIRED:{group_path}"); group_items = []
            items.extend((item, f"{group_path}.items[{ii}]") for ii, item in enumerate(group_items))
        guidance_texts = []
        for item, item_path in items:
            if not _shape(item, ITEM, item_path, failures): continue
            sid = item.get("screen_item_id")
            if not isinstance(sid, str) or not re.fullmatch(r"S\d{3}", sid): failures.append(f"SCREEN_ITEM_ID_INVALID:{item_path}")
            elif sid in s_ids: failures.append(f"SCREEN_ITEM_ID_DUPLICATE:{sid}")
            else: s_ids.append(sid)
            if not isinstance(item.get("guidance_text"), str) or not item["guidance_text"].strip(): failures.append(f"FIELD_TYPE:{item_path}:guidance_text")
            else: guidance_texts.append(item["guidance_text"])
            if item.get("usage_policy") not in {"reference", "exact"}: failures.append(f"SCREEN_USAGE_POLICY_INVALID:{item_path}")
            _refs(item.get("evidence_refs"), evidence_ids, item_path, failures)
        relations = page.get("protected_relations")
        if not isinstance(relations, list): failures.append(f"RELATIONS_TYPE_INVALID:{aid}"); relations = []
        for ri, relation in enumerate(relations):
            relation_path = f"{aid}.protected_relations[{ri}]"
            if not _shape(relation, RELATION, relation_path, failures): continue
            rid = relation.get("relation_id")
            if not isinstance(rid, str) or not re.fullmatch(r"R\d{3}", rid): failures.append(f"RELATION_ID_INVALID:{relation_path}")
            elif rid in r_ids: failures.append(f"RELATION_ID_DUPLICATE:{rid}")
            else: r_ids.append(rid)
        constraints = page.get("silent_constraints")
        if not isinstance(constraints, list): failures.append(f"SILENT_CONSTRAINTS_TYPE_INVALID:{aid}"); constraints = []
        for ci, constraint in enumerate(constraints):
            constraint_path = f"{aid}.silent_constraints[{ci}]"
            if not _shape(constraint, CONSTRAINT, constraint_path, failures): continue
            cid = constraint.get("constraint_id"); instruction = constraint.get("instruction")
            if not isinstance(cid, str) or not re.fullmatch(r"C\d{3}", cid): failures.append(f"SILENT_CONSTRAINT_ID_INVALID:{constraint_path}")
            elif cid in c_ids: failures.append(f"SILENT_CONSTRAINT_ID_DUPLICATE:{cid}")
            else: c_ids.append(cid)
            _refs(constraint.get("evidence_refs"), evidence_ids, constraint_path, failures)
            if isinstance(instruction, str) and instruction in str(page.get("nx", "")): failures.append(f"SILENT_CONSTRAINT_LEAKED_IN_NX:{aid}:{cid}")
            if isinstance(instruction, str) and any(instruction in text for text in guidance_texts): failures.append(f"SILENT_CONSTRAINT_LEAKED_IN_SCREEN:{aid}:{cid}")
        nx = page.get("nx")
        if not isinstance(nx, str) or not nx: failures.append(f"NX_REQUIRED:{aid}"); nx = ""
        nx_parts.append(nx); timing = page.get("timing"); expected_timing = compute_timing(nx)
        if not _shape(timing, TIMING, f"{aid}.timing", failures): timing = {}
        if any(timing.get(key) != expected_timing[key] for key in ("char_equivalent", "min_seconds", "target_seconds", "max_seconds")): failures.append(f"TIMING_MISMATCH:{aid}")
        if isinstance(timing.get("target_seconds"), int):
            total_seconds += timing["target_seconds"]
            if timing["target_seconds"] < 8:
                if isinstance(timing.get("short_page_reason"), str) and timing["short_page_reason"].strip(): short.append(aid)
                else: failures.append(f"SHORT_PAGE_REASON_REQUIRED:{aid}")
    if s_ids != [f"S{i:03d}" for i in range(1, len(s_ids) + 1)]: failures.append("SCREEN_ITEM_ID_SEQUENCE_INVALID")
    if g_ids != [f"G{i:03d}" for i in range(1, len(g_ids) + 1)]: failures.append("SCREEN_GROUP_ID_SEQUENCE_INVALID")
    if r_ids != [f"R{i:03d}" for i in range(1, len(r_ids) + 1)]: failures.append("RELATION_ID_SEQUENCE_INVALID")
    if c_ids != [f"C{i:03d}" for i in range(1, len(c_ids) + 1)]: failures.append("SILENT_CONSTRAINT_ID_SEQUENCE_INVALID")
    if "".join(nx_parts) != approved_text: failures.append("NX_NOT_LOSSLESS")
    failures = sorted(set(failures))
    return {"episode_id": payload.get("episode_id"), "validation_profile": "a-page-v6", "schema_version": payload.get("schema_version"), "document_kind": payload.get("document_kind"), "production_status": "production", "screen_guidance": {"item_count": len(s_ids), "group_count": len(g_ids), "silent_constraint_count": len(c_ids)}, "a_pages": {"count": len(pages), "total_target_seconds": total_seconds, "short_page_exceptions": short}, "failures": failures, "errors": structured_errors(failures)}


def validate_a_page(*, approved_text: str, payload: dict[str, Any]) -> dict[str, Any]:
    return validate_a_page_v6(approved_text=approved_text, payload=payload)


def validate_compile_trace(*, page_payload: dict[str, Any], trace: dict[str, Any], task_package: Any) -> dict[str, Any]:
    failures: list[str] = []; b_ids = list(task_package.get("b_ids", [])) if isinstance(task_package, dict) else list(getattr(task_package, "b_ids", []))
    pages = [p for p in page_payload.get("pages", []) if isinstance(p, dict)]; a_ids = [p.get("a_id") for p in pages]
    screen_by_a = {p["a_id"]: {item.get("screen_item_id") for item in [p.get("screen", {}).get("title"), *[i for g in p.get("screen", {}).get("groups", []) for i in g.get("items", [])]] if isinstance(item, dict)} for p in pages if isinstance(p.get("a_id"), str)}
    if trace.get("schema_version") != "courseplay-b-to-a-trace/v2": failures.append("TRACE_SCHEMA_VERSION_INVALID")
    if trace.get("episode_id") != page_payload.get("episode_id"): failures.append("TRACE_EPISODE_MISMATCH")
    if trace.get("unresolved") != []: failures.append("TRACE_UNRESOLVED")
    coverage = trace.get("coverage") if isinstance(trace.get("coverage"), list) else []
    if [item.get("source_b_id") for item in coverage if isinstance(item, dict)] != b_ids: failures.append("TRACE_B_SEQUENCE_INVALID")
    for index, item in enumerate(coverage):
        path = f"coverage[{index}]"; resolved = item.get("resolved_a_ids") if isinstance(item, dict) else None
        if not isinstance(resolved, list) or not resolved or any(aid not in a_ids for aid in resolved): failures.append(f"TRACE_A_REQUIRED:{path}")
        if not isinstance(item, dict) or item.get("responsibilities_resolved") is not True or item.get("evidence_resolved") is not True: failures.append(f"TRACE_RESOLUTION_INCOMPLETE:{path}")
        units = item.get("visible_source_units") if isinstance(item, dict) else None
        if not isinstance(units, list) or not units: failures.append(f"TRACE_RESOLUTION_INCOMPLETE:{path}:visible_source_units"); continue
        for ui, unit in enumerate(units):
            unit_path = f"{path}.visible_source_units[{ui}]"
            if unit.get("status") == "covered":
                aid = unit.get("resolved_a_id"); refs = unit.get("resolved_screen_item_ids")
                if aid not in resolved or not isinstance(refs, list) or not refs or any(ref not in screen_by_a.get(aid, set()) for ref in refs): failures.append(f"TRACE_RESOLUTION_INCOMPLETE:{unit_path}")
            elif unit.get("status") == "omitted":
                if not isinstance(unit.get("reason"), str) or not unit["reason"].strip(): failures.append(f"TRACE_RESOLUTION_INCOMPLETE:{unit_path}")
            else: failures.append(f"TRACE_RESOLUTION_INCOMPLETE:{unit_path}")
    failures = sorted(set(failures))
    return {"coverage_passed": not failures, "failures": failures, "errors": structured_errors(failures, trace=True)}
