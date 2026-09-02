"""Courseplay A-page v4/v5/v6 semantic contract helpers and validators."""

from __future__ import annotations

import math
import json
import re
import copy
from dataclasses import dataclass, field
from typing import Any


SCHEMA_VERSION = "courseplay-a-page/v4"
SCHEMA_VERSION_V4 = SCHEMA_VERSION
SCHEMA_VERSION_V5 = "courseplay-a-page/v5"
SCHEMA_VERSION_V6 = "courseplay-a-page/v6"
TIMING_MODEL: dict[str, Any] = {
    "han_weight": 1,
    "fullwidth_punctuation_weight": 0,
    "other_non_whitespace_weight": 0.5,
    "chars_per_minute": {"minimum": 220, "target": 230, "maximum": 240},
}
TOP_LEVEL_FIELDS = {
    "schema_version",
    "document_kind",
    "episode_id",
    "approved_text",
    "timing_model",
    "evidence_catalog",
    "pages",
}
PAGE_FIELDS = {
    "a_id",
    "callback_a_ids",
    "nx",
    "teaching_purpose",
    "single_message",
    "must_visible",
    "protected_relations",
    "entry_condition",
    "exit_condition",
    "timing",
}
PAGE_FIELDS_V5 = {
    "a_id",
    "callback_a_ids",
    "nx",
    "teaching_purpose",
    "single_message",
    "screen",
    "protected_relations",
    "silent_constraints",
    "entry_condition",
    "exit_condition",
    "timing",
}
MUST_VISIBLE_FIELDS = {"semantic_item_id", "meaning", "evidence_refs"}
SCREEN_FIELDS = {"title", "groups"}
SCREEN_ITEM_FIELDS = {"screen_item_id", "source_text", "edit_policy", "evidence_refs"}
SCREEN_GUIDANCE_ITEM_FIELDS = {"screen_item_id", "guidance_text", "usage_policy", "evidence_refs"}
SCREEN_GROUP_FIELDS = {"group_id", "items"}
SILENT_CONSTRAINT_FIELDS = {"constraint_id", "instruction", "evidence_refs"}
RELATION_FIELDS = {"relation_id", "from", "relation", "to", "direction"}
TIMING_FIELDS = {
    "char_equivalent",
    "min_seconds",
    "target_seconds",
    "max_seconds",
    "short_page_reason",
}
EVIDENCE_FIELDS = {
    "evidence_id",
    "claim_or_asset",
    "source_locator",
    "verification_status",
    "allowed_use",
}
TRACE_FIELDS = {
    "schema_version",
    "episode_id",
    "source_task_package",
    "page_document",
    "coverage",
    "unresolved",
}
TRACE_COVERAGE_FIELDS = {
    "source_b_id",
    "resolved_a_ids",
    "responsibilities_resolved",
    "evidence_resolved",
}
TRACE_COVERAGE_FIELDS_V5 = TRACE_COVERAGE_FIELDS | {"visible_source_units"}
TRACE_VISIBLE_UNIT_BASE_FIELDS = {"source_unit", "status"}
TRACE_VISIBLE_UNIT_COVERED_FIELDS = TRACE_VISIBLE_UNIT_BASE_FIELDS | {
    "resolved_a_id",
    "resolved_screen_item_ids",
}
TRACE_VISIBLE_UNIT_OMITTED_FIELDS = TRACE_VISIBLE_UNIT_BASE_FIELDS | {"reason"}

FULLWIDTH_PUNCTUATION = frozenset(
    "，。！？；：、‘’“”（）《》〈〉【】〔〕［］｛｝—…·～"
)


@dataclass
class TaskPackageSource:
    b_ids: list[str] = field(default_factory=list)
    evidence_catalog: list[dict[str, Any]] = field(default_factory=list)

    def as_mapping(self) -> dict[str, Any]:
        return {
            "b_ids": list(self.b_ids),
            "evidence_catalog": list(self.evidence_catalog),
        }


def _split_markdown_row(line: str) -> list[str]:
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def _strip_code(text: str) -> str:
    return text.replace("`", "").strip()


def parse_task_package(text: str) -> TaskPackageSource:
    b_ids: list[str] = []
    evidence_catalog: list[dict[str, Any]] = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line.startswith("|"):
            continue
        cells = _split_markdown_row(line)
        if not cells:
            continue
        identifier = cells[0]
        if re.fullmatch(r"B\d{2,3}", identifier):
            b_ids.append(identifier)
        elif re.fullmatch(r"E\d{2,3}", identifier) and len(cells) >= 8:
            evidence_catalog.append(
                {
                    "evidence_id": identifier,
                    "claim_or_asset": cells[2],
                    "source_locator": _strip_code(cells[4]),
                    "verification_status": _strip_code(cells[5]),
                    "allowed_use": cells[6],
                }
            )
    return TaskPackageSource(
        b_ids=b_ids,
        evidence_catalog=evidence_catalog,
    )


def _is_han(character: str) -> bool:
    codepoint = ord(character)
    return (
        0x3400 <= codepoint <= 0x4DBF
        or 0x4E00 <= codepoint <= 0x9FFF
        or 0x20000 <= codepoint <= 0x3134F
    )


def compute_char_equivalent(text: str) -> float:
    total = 0.0
    for character in text:
        if character.isspace() or character in FULLWIDTH_PUNCTUATION:
            continue
        total += 1.0 if _is_han(character) else 0.5
    return total


def compute_timing(text: str) -> dict[str, Any]:
    equivalent = compute_char_equivalent(text)
    minimum = math.ceil(equivalent * 60 / 240)
    target = math.floor(equivalent * 60 / 230 + 0.5)
    maximum = math.ceil(equivalent * 60 / 220)
    target = max(minimum, min(target, maximum))
    return {
        "char_equivalent": equivalent,
        "min_seconds": minimum,
        "target_seconds": target,
        "max_seconds": maximum,
        "short_page_reason": None,
    }


def _is_nonempty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def _require_fields(
    value: dict[str, Any],
    required: set[str],
    path: str,
    failures: list[str],
) -> None:
    for field_name in sorted(required - set(value)):
        failures.append(f"FIELD_REQUIRED:{path}:{field_name}")


def _reject_unknown_fields(
    value: dict[str, Any],
    allowed: set[str],
    path: str,
    failures: list[str],
) -> None:
    for field_name in sorted(set(value) - allowed):
        failures.append(f"UNKNOWN_FIELD:{path}:{field_name}")


def _validate_nonempty_strings(
    value: dict[str, Any],
    fields: tuple[str, ...],
    path: str,
    failures: list[str],
) -> None:
    for field_name in fields:
        if field_name in value and not _is_nonempty_string(value[field_name]):
            failures.append(f"FIELD_TYPE:{path}:{field_name}")


def validate_a_page_v4(*, approved_text: str, payload: dict[str, Any]) -> dict[str, Any]:
    failures: list[str] = []
    _require_fields(payload, TOP_LEVEL_FIELDS, "document", failures)
    _reject_unknown_fields(payload, TOP_LEVEL_FIELDS, "document", failures)
    if contains_b_reference(payload):
        failures.append("B_REFERENCE_FORBIDDEN")
    pages = payload.get("pages")
    if payload.get("schema_version") != SCHEMA_VERSION:
        failures.append("SCHEMA_VERSION_INVALID")
    if payload.get("document_kind") != "production":
        failures.append("DOCUMENT_KIND_INVALID")
    if not _is_nonempty_string(payload.get("episode_id")):
        failures.append("EPISODE_ID_INVALID")
    if payload.get("approved_text") != "approved-spoken-text.txt":
        failures.append("APPROVED_TEXT_REFERENCE_INVALID")
    if payload.get("timing_model") != TIMING_MODEL:
        failures.append("TIMING_MODEL_INVALID")
    if not isinstance(pages, list) or not pages:
        failures.append("PAGES_REQUIRED")
        pages = []

    evidence_catalog = payload.get("evidence_catalog")
    if not isinstance(evidence_catalog, list):
        failures.append("EVIDENCE_CATALOG_TYPE_INVALID")
        evidence_catalog = []

    evidence_ids: set[str] = set()
    for index, item in enumerate(evidence_catalog):
        path = f"evidence_catalog[{index}]"
        if not isinstance(item, dict):
            failures.append(f"OBJECT_REQUIRED:{path}")
            continue
        _require_fields(item, EVIDENCE_FIELDS, path, failures)
        _reject_unknown_fields(item, EVIDENCE_FIELDS, path, failures)
        _validate_nonempty_strings(
            item,
            ("claim_or_asset", "source_locator", "verification_status", "allowed_use"),
            path,
            failures,
        )
        evidence_id = item.get("evidence_id")
        if not isinstance(evidence_id, str) or not re.fullmatch(r"E\d{3}", evidence_id):
            failures.append(f"EVIDENCE_ID_INVALID:{path}")
        elif evidence_id in evidence_ids:
            failures.append(f"EVIDENCE_ID_DUPLICATE:{evidence_id}")
        else:
            evidence_ids.add(evidence_id)

    nx_parts: list[str] = []
    total_target_seconds = 0
    short_page_exceptions: list[str] = []
    expected_ids = [f"A{i:03d}" for i in range(1, len(pages) + 1)]
    actual_ids = [page.get("a_id") for page in pages if isinstance(page, dict)]
    if actual_ids != expected_ids:
        failures.append("A_ID_SEQUENCE_INVALID")

    known_a_ids = set(expected_ids)
    for page_index, page in enumerate(pages):
        if not isinstance(page, dict):
            failures.append("PAGE_NOT_OBJECT")
            continue
        a_id = page.get("a_id", "?")
        _require_fields(page, PAGE_FIELDS, str(a_id), failures)
        _reject_unknown_fields(page, PAGE_FIELDS, str(a_id), failures)
        _validate_nonempty_strings(
            page,
            (
                "nx",
                "teaching_purpose",
                "single_message",
                "entry_condition",
                "exit_condition",
            ),
            str(a_id),
            failures,
        )
        callbacks = page.get("callback_a_ids")
        if not isinstance(callbacks, list) or not all(isinstance(item, str) for item in callbacks):
            failures.append(f"CALLBACK_TYPE_INVALID:{a_id}")
        else:
            for callback in callbacks:
                if callback == a_id:
                    failures.append(f"CALLBACK_SELF:{a_id}")
                elif callback not in known_a_ids:
                    failures.append(f"CALLBACK_UNKNOWN:{a_id}:{callback}")
                elif expected_ids.index(callback) >= page_index:
                    failures.append(f"CALLBACK_FUTURE:{a_id}:{callback}")
        must_visible_items = page.get("must_visible")
        if not isinstance(must_visible_items, list) or not must_visible_items:
            failures.append(f"MUST_VISIBLE_REQUIRED:{a_id}")
            must_visible_items = []
        for must_visible_index, must_visible in enumerate(must_visible_items):
            if not isinstance(must_visible, dict):
                failures.append(f"OBJECT_REQUIRED:{a_id}.must_visible[{must_visible_index}]")
                continue
            path = f"{a_id}.must_visible[{must_visible_index}]"
            _require_fields(must_visible, MUST_VISIBLE_FIELDS, path, failures)
            _reject_unknown_fields(must_visible, MUST_VISIBLE_FIELDS, path, failures)
            _validate_nonempty_strings(must_visible, ("meaning",), path, failures)
            semantic_item_id = must_visible.get("semantic_item_id")
            if not isinstance(semantic_item_id, str) or not re.fullmatch(r"V\d{3}", semantic_item_id):
                failures.append(f"SEMANTIC_ITEM_ID_INVALID:{path}")
            refs = must_visible.get("evidence_refs")
            if not isinstance(refs, list) or not refs or not all(isinstance(ref, str) for ref in refs):
                failures.append(f"EVIDENCE_REFS_TYPE_INVALID:{path}")
                refs = []
            for evidence_id in refs:
                if evidence_id not in evidence_ids:
                    failures.append(f"EVIDENCE_UNKNOWN:{a_id}:{evidence_id}")
        relations = page.get("protected_relations")
        if not isinstance(relations, list):
            failures.append(f"RELATIONS_TYPE_INVALID:{a_id}")
            relations = []
        for relation_index, relation in enumerate(relations):
            path = f"{a_id}.protected_relations[{relation_index}]"
            if not isinstance(relation, dict):
                failures.append(f"OBJECT_REQUIRED:{path}")
                continue
            _require_fields(relation, RELATION_FIELDS, path, failures)
            _reject_unknown_fields(relation, RELATION_FIELDS, path, failures)
            _validate_nonempty_strings(relation, ("from", "relation", "to", "direction"), path, failures)
            relation_id = relation.get("relation_id")
            if not isinstance(relation_id, str) or not re.fullmatch(r"R\d{3}", relation_id):
                failures.append(f"RELATION_ID_INVALID:{path}")
        nx = page.get("nx")
        if not isinstance(nx, str) or not nx:
            failures.append(f"NX_REQUIRED:{a_id}")
            continue
        nx_parts.append(nx)
        timing = page.get("timing")
        if isinstance(timing, dict):
            _require_fields(timing, TIMING_FIELDS, f"{a_id}.timing", failures)
            _reject_unknown_fields(timing, TIMING_FIELDS, f"{a_id}.timing", failures)
            short_reason = timing.get("short_page_reason")
            if short_reason is not None and not isinstance(short_reason, str):
                failures.append(f"SHORT_PAGE_REASON_TYPE_INVALID:{a_id}")
        else:
            failures.append(f"TIMING_OBJECT_REQUIRED:{a_id}")
        expected_timing = compute_timing(nx)
        if not isinstance(timing, dict) or any(
            timing.get(field_name) != expected_timing[field_name]
            for field_name in ("char_equivalent", "min_seconds", "target_seconds", "max_seconds")
        ):
            failures.append(f"TIMING_MISMATCH:{a_id}")
        if isinstance(timing, dict) and isinstance(timing.get("target_seconds"), int):
            total_target_seconds += timing["target_seconds"]
            if timing["target_seconds"] < 8:
                reason = timing.get("short_page_reason")
                if isinstance(reason, str) and reason.strip():
                    short_page_exceptions.append(a_id)
                else:
                    failures.append(f"SHORT_PAGE_REASON_REQUIRED:{a_id}")

    if "".join(nx_parts) != approved_text:
        failures.append("NX_NOT_LOSSLESS")
    return {
        "episode_id": payload.get("episode_id"),
        "validation_profile": "a-page-v4",
        "schema_version": payload.get("schema_version"),
        "document_kind": payload.get("document_kind"),
        "production_status": "production",
        "a_pages": {
            "count": len(pages),
            "total_target_seconds": total_target_seconds,
            "short_page_exceptions": short_page_exceptions,
        },
        "failures": sorted(set(failures)),
    }


def _validate_screen_item(
    item: Any,
    *,
    path: str,
    evidence_ids: set[str],
    failures: list[str],
    screen_item_ids: set[str],
) -> str | None:
    if not isinstance(item, dict):
        failures.append(f"OBJECT_REQUIRED:{path}")
        return None
    _require_fields(item, SCREEN_ITEM_FIELDS, path, failures)
    _reject_unknown_fields(item, SCREEN_ITEM_FIELDS, path, failures)
    _validate_nonempty_strings(item, ("source_text",), path, failures)
    screen_item_id = item.get("screen_item_id")
    if not isinstance(screen_item_id, str) or not re.fullmatch(r"S\d{3}", screen_item_id):
        failures.append(f"SCREEN_ITEM_ID_INVALID:{path}")
    elif screen_item_id in screen_item_ids:
        failures.append(f"SCREEN_ITEM_ID_DUPLICATE:{screen_item_id}")
    else:
        screen_item_ids.add(screen_item_id)
    if item.get("edit_policy") not in {"adaptable", "exact"}:
        failures.append(f"SCREEN_EDIT_POLICY_INVALID:{path}")
    refs = item.get("evidence_refs")
    if not isinstance(refs, list) or not refs or not all(isinstance(ref, str) for ref in refs):
        failures.append(f"SCREEN_EVIDENCE_REFS_INVALID:{path}")
        refs = []
    for evidence_id in refs:
        if evidence_id not in evidence_ids:
            failures.append(f"EVIDENCE_UNKNOWN:{path}:{evidence_id}")
    return screen_item_id if isinstance(screen_item_id, str) else None


def validate_a_page_v5(*, approved_text: str, payload: dict[str, Any]) -> dict[str, Any]:
    """Validate the v5 semantic page with learner-usable screen source text.

    v5 deliberately keeps layout, media, and renderer details out of the A-page.
    ``screen`` owns only stable learner-facing source strings; ``silent_constraints``
    remains reviewer-only and must not leak into either narration or screen source.
    """
    failures: list[str] = []
    _require_fields(payload, TOP_LEVEL_FIELDS, "document", failures)
    _reject_unknown_fields(payload, TOP_LEVEL_FIELDS, "document", failures)
    if contains_b_reference(payload):
        failures.append("B_REFERENCE_FORBIDDEN")
    pages = payload.get("pages")
    if payload.get("schema_version") != SCHEMA_VERSION_V5:
        failures.append("SCHEMA_VERSION_INVALID")
    if payload.get("document_kind") != "production":
        failures.append("DOCUMENT_KIND_INVALID")
    if not _is_nonempty_string(payload.get("episode_id")):
        failures.append("EPISODE_ID_INVALID")
    if payload.get("approved_text") != "approved-spoken-text.txt":
        failures.append("APPROVED_TEXT_REFERENCE_INVALID")
    if payload.get("timing_model") != TIMING_MODEL:
        failures.append("TIMING_MODEL_INVALID")
    if not isinstance(pages, list) or not pages:
        failures.append("PAGES_REQUIRED")
        pages = []

    evidence_catalog = payload.get("evidence_catalog")
    if not isinstance(evidence_catalog, list):
        failures.append("EVIDENCE_CATALOG_TYPE_INVALID")
        evidence_catalog = []
    evidence_ids: set[str] = set()
    for index, item in enumerate(evidence_catalog):
        path = f"evidence_catalog[{index}]"
        if not isinstance(item, dict):
            failures.append(f"OBJECT_REQUIRED:{path}")
            continue
        _require_fields(item, EVIDENCE_FIELDS, path, failures)
        _reject_unknown_fields(item, EVIDENCE_FIELDS, path, failures)
        _validate_nonempty_strings(
            item,
            ("claim_or_asset", "source_locator", "verification_status", "allowed_use"),
            path,
            failures,
        )
        evidence_id = item.get("evidence_id")
        if not isinstance(evidence_id, str) or not re.fullmatch(r"E\d{3}", evidence_id):
            failures.append(f"EVIDENCE_ID_INVALID:{path}")
        elif evidence_id in evidence_ids:
            failures.append(f"EVIDENCE_ID_DUPLICATE:{evidence_id}")
        else:
            evidence_ids.add(evidence_id)

    nx_parts: list[str] = []
    total_target_seconds = 0
    short_page_exceptions: list[str] = []
    expected_ids = [f"A{i:03d}" for i in range(1, len(pages) + 1)]
    actual_ids = [page.get("a_id") for page in pages if isinstance(page, dict)]
    if actual_ids != expected_ids:
        failures.append("A_ID_SEQUENCE_INVALID")
    known_a_ids = set(expected_ids)
    screen_item_ids: set[str] = set()
    group_ids: set[str] = set()
    relation_ids: set[str] = set()
    constraint_ids: set[str] = set()
    all_screen_source_text: list[str] = []

    for page_index, page in enumerate(pages):
        if not isinstance(page, dict):
            failures.append("PAGE_NOT_OBJECT")
            continue
        a_id = page.get("a_id", "?")
        _require_fields(page, PAGE_FIELDS_V5, str(a_id), failures)
        _reject_unknown_fields(page, PAGE_FIELDS_V5, str(a_id), failures)
        _validate_nonempty_strings(
            page,
            ("nx", "teaching_purpose", "single_message", "entry_condition", "exit_condition"),
            str(a_id),
            failures,
        )
        callbacks = page.get("callback_a_ids")
        if not isinstance(callbacks, list) or not all(isinstance(item, str) for item in callbacks):
            failures.append(f"CALLBACK_TYPE_INVALID:{a_id}")
        else:
            for callback in callbacks:
                if callback == a_id:
                    failures.append(f"CALLBACK_SELF:{a_id}")
                elif callback not in known_a_ids:
                    failures.append(f"CALLBACK_UNKNOWN:{a_id}:{callback}")
                elif expected_ids.index(callback) >= page_index:
                    failures.append(f"CALLBACK_FUTURE:{a_id}:{callback}")

        screen = page.get("screen")
        if not isinstance(screen, dict):
            failures.append(f"SCREEN_OBJECT_REQUIRED:{a_id}")
            screen = {}
        else:
            _require_fields(screen, SCREEN_FIELDS, f"{a_id}.screen", failures)
            _reject_unknown_fields(screen, SCREEN_FIELDS, f"{a_id}.screen", failures)
        title = screen.get("title")
        title_id = _validate_screen_item(
            title,
            path=f"{a_id}.screen.title",
            evidence_ids=evidence_ids,
            failures=failures,
            screen_item_ids=screen_item_ids,
        )
        if isinstance(title, dict) and isinstance(title.get("source_text"), str):
            all_screen_source_text.append(title["source_text"])
        groups = screen.get("groups")
        if not isinstance(groups, list) or not groups:
            failures.append(f"SCREEN_GROUPS_REQUIRED:{a_id}")
            groups = []
        for group_index, group in enumerate(groups):
            group_path = f"{a_id}.screen.groups[{group_index}]"
            if not isinstance(group, dict):
                failures.append(f"OBJECT_REQUIRED:{group_path}")
                continue
            _require_fields(group, SCREEN_GROUP_FIELDS, group_path, failures)
            _reject_unknown_fields(group, SCREEN_GROUP_FIELDS, group_path, failures)
            group_id = group.get("group_id")
            if not isinstance(group_id, str) or not re.fullmatch(r"G\d{3}", group_id):
                failures.append(f"SCREEN_GROUP_ID_INVALID:{group_path}")
            elif group_id in group_ids:
                failures.append(f"SCREEN_GROUP_ID_DUPLICATE:{group_id}")
            else:
                group_ids.add(group_id)
            items = group.get("items")
            if not isinstance(items, list) or not items:
                failures.append(f"SCREEN_GROUP_ITEMS_REQUIRED:{group_path}")
                items = []
            for item_index, item in enumerate(items):
                item_path = f"{group_path}.items[{item_index}]"
                _validate_screen_item(
                    item,
                    path=item_path,
                    evidence_ids=evidence_ids,
                    failures=failures,
                    screen_item_ids=screen_item_ids,
                )
                if isinstance(item, dict) and isinstance(item.get("source_text"), str):
                    all_screen_source_text.append(item["source_text"])

        relations = page.get("protected_relations")
        if not isinstance(relations, list):
            failures.append(f"RELATIONS_TYPE_INVALID:{a_id}")
            relations = []
        for relation_index, relation in enumerate(relations):
            path = f"{a_id}.protected_relations[{relation_index}]"
            if not isinstance(relation, dict):
                failures.append(f"OBJECT_REQUIRED:{path}")
                continue
            _require_fields(relation, RELATION_FIELDS, path, failures)
            _reject_unknown_fields(relation, RELATION_FIELDS, path, failures)
            _validate_nonempty_strings(relation, ("from", "relation", "to", "direction"), path, failures)
            relation_id = relation.get("relation_id")
            if not isinstance(relation_id, str) or not re.fullmatch(r"R\d{3}", relation_id):
                failures.append(f"RELATION_ID_INVALID:{path}")
            elif relation_id in relation_ids:
                failures.append(f"RELATION_ID_DUPLICATE:{relation_id}")
            else:
                relation_ids.add(relation_id)

        constraints = page.get("silent_constraints")
        if not isinstance(constraints, list):
            failures.append(f"SILENT_CONSTRAINTS_TYPE_INVALID:{a_id}")
            constraints = []
        for constraint_index, constraint in enumerate(constraints):
            path = f"{a_id}.silent_constraints[{constraint_index}]"
            if not isinstance(constraint, dict):
                failures.append(f"OBJECT_REQUIRED:{path}")
                continue
            _require_fields(constraint, SILENT_CONSTRAINT_FIELDS, path, failures)
            _reject_unknown_fields(constraint, SILENT_CONSTRAINT_FIELDS, path, failures)
            _validate_nonempty_strings(constraint, ("instruction",), path, failures)
            constraint_id = constraint.get("constraint_id")
            if not isinstance(constraint_id, str) or not re.fullmatch(r"C\d{3}", constraint_id):
                failures.append(f"SILENT_CONSTRAINT_ID_INVALID:{path}")
            elif constraint_id in constraint_ids:
                failures.append(f"SILENT_CONSTRAINT_ID_DUPLICATE:{constraint_id}")
            else:
                constraint_ids.add(constraint_id)
            refs = constraint.get("evidence_refs")
            if not isinstance(refs, list) or not refs or not all(isinstance(ref, str) for ref in refs):
                failures.append(f"SILENT_EVIDENCE_REFS_INVALID:{path}")
                refs = []
            for evidence_id in refs:
                if evidence_id not in evidence_ids:
                    failures.append(f"EVIDENCE_UNKNOWN:{path}:{evidence_id}")
            instruction = constraint.get("instruction")
            if isinstance(instruction, str):
                if instruction in str(page.get("nx", "")):
                    failures.append(f"SILENT_CONSTRAINT_LEAKED_IN_NX:{a_id}:{constraint_id}")
                for source_text in all_screen_source_text:
                    if instruction in source_text:
                        failures.append(f"SILENT_CONSTRAINT_LEAKED_IN_SCREEN:{a_id}:{constraint_id}")

        nx = page.get("nx")
        if not isinstance(nx, str) or not nx:
            failures.append(f"NX_REQUIRED:{a_id}")
            continue
        nx_parts.append(nx)
        timing = page.get("timing")
        if isinstance(timing, dict):
            _require_fields(timing, TIMING_FIELDS, f"{a_id}.timing", failures)
            _reject_unknown_fields(timing, TIMING_FIELDS, f"{a_id}.timing", failures)
            short_reason = timing.get("short_page_reason")
            if short_reason is not None and not isinstance(short_reason, str):
                failures.append(f"SHORT_PAGE_REASON_TYPE_INVALID:{a_id}")
        else:
            failures.append(f"TIMING_OBJECT_REQUIRED:{a_id}")
        expected_timing = compute_timing(nx)
        if not isinstance(timing, dict) or any(
            timing.get(field_name) != expected_timing[field_name]
            for field_name in ("char_equivalent", "min_seconds", "target_seconds", "max_seconds")
        ):
            failures.append(f"TIMING_MISMATCH:{a_id}")
        if isinstance(timing, dict) and isinstance(timing.get("target_seconds"), int):
            total_target_seconds += timing["target_seconds"]
            if timing["target_seconds"] < 8:
                reason = timing.get("short_page_reason")
                if isinstance(reason, str) and reason.strip():
                    short_page_exceptions.append(a_id)
                else:
                    failures.append(f"SHORT_PAGE_REASON_REQUIRED:{a_id}")

    payload_json = json.dumps(payload, ensure_ascii=False)
    for source_text in all_screen_source_text:
        if payload_json.count(source_text) != 1:
            failures.append(f"SCREEN_SOURCE_OCCURRENCE_INVALID:{source_text}")
    for page in pages:
        if not isinstance(page, dict):
            continue
        for constraint in page.get("silent_constraints", []):
            if not isinstance(constraint, dict) or not isinstance(constraint.get("instruction"), str):
                continue
            instruction = constraint["instruction"]
            for source_text in all_screen_source_text:
                if instruction in source_text:
                    failures.append(f"SILENT_CONSTRAINT_LEAKED_IN_SCREEN:{page.get('a_id')}:{constraint.get('constraint_id')}")

    if "".join(nx_parts) != approved_text:
        failures.append("NX_NOT_LOSSLESS")
    return {
        "episode_id": payload.get("episode_id"),
        "validation_profile": "a-page-v5",
        "schema_version": payload.get("schema_version"),
        "document_kind": payload.get("document_kind"),
        "production_status": "production",
        "screen_source": {
            "item_count": len(screen_item_ids),
            "group_count": len(group_ids),
            "silent_constraint_count": len(constraint_ids),
            "source_texts_are_single_occurrence": not any(
                f.startswith("SCREEN_SOURCE_OCCURRENCE_INVALID:") for f in failures
            ),
        },
        "a_pages": {
            "count": len(pages),
            "total_target_seconds": total_target_seconds,
            "short_page_exceptions": short_page_exceptions,
        },
        "failures": sorted(set(failures)),
    }


def validate_a_page_v6(*, approved_text: str, payload: dict[str, Any]) -> dict[str, Any]:
    """Validate v6 screen guidance without changing the frozen v5 contract.

    v6 keeps the v5 page, evidence, timing, relation, constraint and trace shapes,
    but replaces learner-facing source copy with reference/exact guidance.  The
    stable v5 validator is reused through an internal projection so its behavior
    remains byte-for-byte testable and isolated.
    """
    failures: list[str] = []
    projected = copy.deepcopy(payload)
    projected["schema_version"] = SCHEMA_VERSION_V5

    for page_index, page in enumerate(payload.get("pages", []) if isinstance(payload.get("pages"), list) else []):
        if not isinstance(page, dict):
            continue
        projected_page = projected["pages"][page_index]
        screen = page.get("screen")
        projected_screen = projected_page.get("screen") if isinstance(projected_page, dict) else None
        if not isinstance(screen, dict) or not isinstance(projected_screen, dict):
            continue
        item_pairs: list[tuple[Any, Any, str]] = [
            (screen.get("title"), projected_screen.get("title"), f"{page.get('a_id', '?')}.screen.title")
        ]
        source_groups = screen.get("groups") if isinstance(screen.get("groups"), list) else []
        target_groups = projected_screen.get("groups") if isinstance(projected_screen.get("groups"), list) else []
        for group_index, group in enumerate(source_groups):
            if not isinstance(group, dict) or group_index >= len(target_groups) or not isinstance(target_groups[group_index], dict):
                continue
            source_items = group.get("items") if isinstance(group.get("items"), list) else []
            target_items = target_groups[group_index].get("items") if isinstance(target_groups[group_index].get("items"), list) else []
            for item_index, item in enumerate(source_items):
                target = target_items[item_index] if item_index < len(target_items) else None
                item_pairs.append((item, target, f"{page.get('a_id', '?')}.screen.groups[{group_index}].items[{item_index}]"))

        for item, target, path in item_pairs:
            if not isinstance(item, dict) or not isinstance(target, dict):
                continue
            _require_fields(item, SCREEN_GUIDANCE_ITEM_FIELDS, path, failures)
            _reject_unknown_fields(item, SCREEN_GUIDANCE_ITEM_FIELDS, path, failures)
            _validate_nonempty_strings(item, ("guidance_text",), path, failures)
            usage_policy = item.get("usage_policy")
            if usage_policy not in {"reference", "exact"}:
                failures.append(f"SCREEN_USAGE_POLICY_INVALID:{path}")
            target.pop("guidance_text", None)
            target.pop("usage_policy", None)
            target["source_text"] = item.get("guidance_text")
            target["edit_policy"] = "exact" if usage_policy == "exact" else "adaptable"

    report = validate_a_page_v5(approved_text=approved_text, payload=projected)
    projected_failures = [
        failure
        for failure in report["failures"]
        if not failure.startswith("SCREEN_SOURCE_OCCURRENCE_INVALID:")
    ]
    report.update(
        {
            "validation_profile": "a-page-v6",
            "schema_version": payload.get("schema_version"),
            "screen_guidance": {
                "item_count": report["screen_source"]["item_count"],
                "group_count": report["screen_source"]["group_count"],
                "silent_constraint_count": report["screen_source"]["silent_constraint_count"],
            },
            "failures": sorted(set(projected_failures + failures)),
        }
    )
    report.pop("screen_source", None)
    return report


def validate_a_page(*, approved_text: str, payload: dict[str, Any]) -> dict[str, Any]:
    """Dispatch to the frozen v4/v5 or screen-guidance v6 validator."""
    if payload.get("schema_version") == SCHEMA_VERSION_V6:
        return validate_a_page_v6(approved_text=approved_text, payload=payload)
    if payload.get("schema_version") == SCHEMA_VERSION_V5:
        return validate_a_page_v5(approved_text=approved_text, payload=payload)
    return validate_a_page_v4(approved_text=approved_text, payload=payload)


def contains_b_reference(value: Any) -> bool:
    if isinstance(value, str):
        return bool(re.search(r"(?<![A-Za-z0-9])B\d{2,3}(?!\d)", value))
    if isinstance(value, list):
        return any(contains_b_reference(item) for item in value)
    if isinstance(value, dict):
        return any(key == "source_b_ids" or contains_b_reference(item) for key, item in value.items())
    return False


def validate_compile_trace(
    *,
    page_payload: dict[str, Any],
    trace: dict[str, Any],
    task_package: Any,
) -> dict[str, Any]:
    failures: list[str] = []
    b_ids = (
        list(task_package.get("b_ids", []))
        if isinstance(task_package, dict)
        else list(getattr(task_package, "b_ids", []))
    )
    a_ids = [page.get("a_id") for page in page_payload.get("pages", []) if isinstance(page, dict)]
    a_index = {a_id: index for index, a_id in enumerate(a_ids)}
    uses_screen_items = page_payload.get("schema_version") in {SCHEMA_VERSION_V5, SCHEMA_VERSION_V6}
    screen_ids_by_a: dict[str, set[str]] = {}
    if uses_screen_items:
        for page in page_payload.get("pages", []):
            if not isinstance(page, dict) or not isinstance(page.get("a_id"), str):
                continue
            screen = page.get("screen") if isinstance(page.get("screen"), dict) else {}
            items = [screen.get("title")]
            for group in screen.get("groups", []) if isinstance(screen.get("groups"), list) else []:
                if isinstance(group, dict) and isinstance(group.get("items"), list):
                    items.extend(group["items"])
            screen_ids_by_a[page["a_id"]] = {
                item["screen_item_id"]
                for item in items
                if isinstance(item, dict) and isinstance(item.get("screen_item_id"), str)
            }

    _require_fields(trace, TRACE_FIELDS, "trace", failures)
    _reject_unknown_fields(trace, TRACE_FIELDS, "trace", failures)
    if trace.get("schema_version") != "courseplay-b-to-a-trace/v2":
        failures.append("TRACE_SCHEMA_VERSION_INVALID")
    if trace.get("episode_id") != page_payload.get("episode_id"):
        failures.append("TRACE_EPISODE_MISMATCH")
    for field_name in ("source_task_package", "page_document"):
        if not _is_nonempty_string(trace.get(field_name)):
            failures.append(f"TRACE_FIELD_INVALID:{field_name}")
    unresolved = trace.get("unresolved")
    if not isinstance(unresolved, list) or unresolved:
        failures.append("TRACE_UNRESOLVED")

    coverage = trace.get("coverage")
    if not isinstance(coverage, list):
        failures.append("TRACE_COVERAGE_REQUIRED")
        coverage = []
    seen_b_ids: list[str] = []
    previous_a_position = -1
    for coverage_index, item in enumerate(coverage):
        item_path = f"coverage[{coverage_index}]"
        if not isinstance(item, dict):
            failures.append(f"TRACE_COVERAGE_ITEM_INVALID:{item_path}")
            continue
        coverage_fields = TRACE_COVERAGE_FIELDS_V5 if uses_screen_items else TRACE_COVERAGE_FIELDS
        _require_fields(item, coverage_fields, item_path, failures)
        _reject_unknown_fields(item, coverage_fields, item_path, failures)
        source_b_id = item.get("source_b_id")
        if source_b_id in seen_b_ids:
            failures.append(f"TRACE_SOURCE_DUPLICATE:{item_path}")
        seen_b_ids.append(source_b_id)
        if source_b_id not in b_ids:
            failures.append(f"TRACE_SOURCE_UNKNOWN:{item_path}")
        resolved_a_ids = item.get("resolved_a_ids")
        if not isinstance(resolved_a_ids, list) or not resolved_a_ids:
            failures.append(f"TRACE_A_REQUIRED:{item_path}")
            continue
        positions: list[int] = []
        for a_id in resolved_a_ids:
            if a_id not in a_index:
                failures.append(f"TRACE_A_UNKNOWN:{item_path}:{a_id}")
            else:
                positions.append(a_index[a_id])
        if positions:
            if positions != sorted(set(positions)):
                failures.append(f"TRACE_A_SEQUENCE_INVALID:{item_path}")
            if min(positions) < previous_a_position:
                failures.append(f"TRACE_ORDER_INVALID:{item_path}")
            previous_a_position = max(positions)
        for flag in ("responsibilities_resolved", "evidence_resolved"):
            if item.get(flag) is not True:
                failures.append(f"TRACE_RESOLUTION_INCOMPLETE:{item_path}:{flag}")

        if uses_screen_items:
            visible_units = item.get("visible_source_units")
            if not isinstance(visible_units, list) or not visible_units:
                failures.append(f"TRACE_RESOLUTION_INCOMPLETE:{item_path}:responsibilities_resolved")
                continue
            for unit_index, unit in enumerate(visible_units):
                unit_path = f"{item_path}.visible_source_units[{unit_index}]"
                if not isinstance(unit, dict):
                    failures.append(f"TRACE_RESOLUTION_INCOMPLETE:{unit_path}:responsibilities_resolved")
                    continue
                status = unit.get("status")
                allowed_fields = (
                    TRACE_VISIBLE_UNIT_COVERED_FIELDS
                    if status == "covered"
                    else TRACE_VISIBLE_UNIT_OMITTED_FIELDS
                    if status == "omitted"
                    else TRACE_VISIBLE_UNIT_BASE_FIELDS
                )
                _require_fields(unit, allowed_fields, unit_path, failures)
                _reject_unknown_fields(unit, allowed_fields, unit_path, failures)
                if not _is_nonempty_string(unit.get("source_unit")):
                    failures.append(f"TRACE_RESOLUTION_INCOMPLETE:{unit_path}:responsibilities_resolved")
                if status == "covered":
                    resolved_a_id = unit.get("resolved_a_id")
                    if resolved_a_id not in a_index:
                        failures.append(f"TRACE_A_UNKNOWN:{unit_path}:{resolved_a_id}")
                    elif resolved_a_id not in resolved_a_ids:
                        failures.append(f"TRACE_RESOLUTION_INCOMPLETE:{unit_path}:responsibilities_resolved")
                    resolved_screen_ids = unit.get("resolved_screen_item_ids")
                    if (
                        not isinstance(resolved_screen_ids, list)
                        or not resolved_screen_ids
                        or not all(isinstance(screen_id, str) for screen_id in resolved_screen_ids)
                        or len(set(resolved_screen_ids)) != len(resolved_screen_ids)
                        or any(
                            screen_id not in screen_ids_by_a.get(resolved_a_id, set())
                            for screen_id in resolved_screen_ids
                        )
                    ):
                        failures.append(f"TRACE_RESOLUTION_INCOMPLETE:{unit_path}:responsibilities_resolved")
                elif status == "omitted":
                    if not _is_nonempty_string(unit.get("reason")):
                        failures.append(f"TRACE_RESOLUTION_INCOMPLETE:{unit_path}:responsibilities_resolved")
                else:
                    failures.append(f"TRACE_RESOLUTION_INCOMPLETE:{unit_path}:responsibilities_resolved")

    if seen_b_ids != b_ids:
        failures.append("TRACE_B_SEQUENCE_INVALID")
    if any(source_id not in seen_b_ids for source_id in b_ids):
        failures.append("TRACE_SOURCE_COVERAGE_INCOMPLETE")

    return {
        "coverage_passed": not failures,
        "failures": sorted(set(failures)),
    }
