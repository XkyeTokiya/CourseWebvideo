"""Independent parser, preflight, and validator for Courseplay visual rough v4."""

from __future__ import annotations

import json
import math
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

SCHEMA_VERSION = "courseplay-visual-rough/v4"
A_PAGE_SCHEMA_VERSION = "courseplay-a-page/v6"
MEDIA_TYPES = {"photorealistic_ai", "textbook_original"}
REQUIRED_FRONTMATTER = {"schema_version", "document_kind", "episode_id", "source_a_page", "source_a_page_sha256", "status", "image_required_page_fraction", "logic_diagram_page_limit"}
PAGE_LABELS = {"内容角色": "content_role", "页面配方": "recipe_id", "论点标题": "claim_headline", "辅助句": "supporting_line", "媒体需求": "media_requirement", "媒体作用": "media_purpose", "教材证据": "textbook_evidence", "逻辑图": "logic_diagram", "逻辑图理由": "logic_reason"}


@dataclass
class Unit:
    unit_id: str
    group_ids: list[str]


@dataclass
class Page:
    a_id: str
    title: str
    fields: dict[str, str] = field(default_factory=dict)
    units: list[Unit] = field(default_factory=list)
    slot_bindings: list[tuple[str, str]] = field(default_factory=list)
    relation_carriers: list[tuple[str, str]] = field(default_factory=list)
    visible_text: str = ""


@dataclass
class ParsedRough:
    frontmatter: dict[str, str]
    pages: list[Page]
    errors: list[dict[str, Any]]


def load_error_catalog(path: Path | None = None) -> dict[str, dict[str, str]]:
    catalog_path = path or Path(__file__).resolve().parents[1] / "references" / "error-catalog.json"
    payload = json.loads(catalog_path.read_text(encoding="utf-8"))
    return {item["code"]: item for item in payload["errors"]}


def _error(catalog: dict[str, dict[str, str]], code: str, path: str, expected: Any, actual: Any) -> dict[str, Any]:
    definition = catalog.get(code)
    if definition is None:
        raise RuntimeError(f"unregistered validator error code: {code}")
    return {"code": code, "path": path, "expected": expected, "actual": actual, "message": definition["message"], "hint": definition["hint"], "contractSection": definition["contractSection"]}


def _frontmatter(text: str, catalog: dict[str, dict[str, str]]) -> tuple[dict[str, str], str, list[dict[str, Any]]]:
    normalized = text.replace("\r\n", "\n").replace("\r", "\n")
    if not normalized.startswith("---\n") or "\n---\n" not in normalized[4:]:
        return {}, normalized, [_error(catalog, "VR4_FRONTMATTER_INVALID", "$", "delimited YAML frontmatter", "missing or unterminated")]
    end = normalized.find("\n---\n", 4)
    values: dict[str, str] = {}
    errors: list[dict[str, Any]] = []
    for number, line in enumerate(normalized[4:end].splitlines(), 1):
        if ":" not in line:
            errors.append(_error(catalog, "VR4_FRONTMATTER_INVALID", f"frontmatter[{number}]", "key: value", line))
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        if key in values:
            errors.append(_error(catalog, "VR4_FRONTMATTER_INVALID", f"frontmatter.{key}", "unique field", "duplicate"))
        values[key] = value.strip()
    return values, normalized[end + 5:], errors


def _section(section: str, heading: str, next_heading: str | None = None) -> str | None:
    end = rf"(?=^### {re.escape(next_heading)}\s*$)" if next_heading else r"(?=^## |\Z)"
    match = re.search(rf"(?ms)^### {re.escape(heading)}\s*\n(.*?){end}", section)
    return match.group(1) if match else None


def parse_visual_rough_v4(text: str, *, catalog: dict[str, dict[str, str]] | None = None) -> ParsedRough:
    catalog = catalog or load_error_catalog()
    frontmatter, body, errors = _frontmatter(text, catalog)
    matches = list(re.finditer(r"(?m)^## (A\d{3})[｜|]([^\n]+)\s*$", body))
    pages: list[Page] = []
    if not matches:
        errors.append(_error(catalog, "VR4_PAGE_SEQUENCE", "pages", "one or more Axxx pages", []))
    for index, match in enumerate(matches):
        section = body[match.end(): matches[index + 1].start() if index + 1 < len(matches) else len(body)]
        page = Page(match.group(1), match.group(2).strip())
        for label, key in PAGE_LABELS.items():
            values = re.findall(rf"(?m)^- \*\*{re.escape(label)}\*\*：\s*(.+?)\s*$", section)
            if len(values) != 1:
                errors.append(_error(catalog, "VR4_PAGE_FIELD", f"{page.a_id}.{key}", "exactly one non-empty field", len(values)))
            else:
                page.fields[key] = values[0].replace("`", "").strip()
        unit_body = _section(section, "视觉内容单元", "页面骨架")
        if unit_body is None:
            errors.append(_error(catalog, "VR4_UNIT_SYNTAX", f"{page.a_id}.content_units", "numbered Uxxx <- Gxxx [+ Gxxx]", "section missing"))
        else:
            for line_index, line in enumerate([x.strip() for x in unit_body.splitlines() if x.strip()], 1):
                unit_match = re.fullmatch(r"\d+\.\s+`?(U\d{3})\s*<-\s*((?:G\d{3})(?:\s*\+\s*G\d{3})*)`?", line)
                if not unit_match:
                    errors.append(_error(catalog, "VR4_UNIT_SYNTAX", f"{page.a_id}.content_units[{line_index}]", "Uxxx <- Gxxx [+ Gxxx]", line))
                else:
                    page.units.append(Unit(unit_match.group(1), re.findall(r"G\d{3}", unit_match.group(2))))
        skeleton = _section(section, "页面骨架", "关系保真")
        if skeleton is None:
            errors.append(_error(catalog, "VR4_SLOT_BINDING", f"{page.a_id}.slot_bindings", "slot <- S/U/M/none", "section missing"))
        else:
            page.visible_text = (unit_body or "") + skeleton
            for line_index, line in enumerate([x.strip() for x in skeleton.splitlines() if x.strip()], 1):
                binding = re.fullmatch(r"-\s+`?([A-Za-z0-9_-]+)\s*<-\s*((?:S|U|M)\d{3}|none)`?", line)
                if not binding:
                    errors.append(_error(catalog, "VR4_SLOT_BINDING", f"{page.a_id}.slot_bindings[{line_index}]", "slot <- S/U/M/none", line))
                else:
                    page.slot_bindings.append((binding.group(1), binding.group(2)))
        relations = _section(section, "关系保真")
        if relations is None:
            errors.append(_error(catalog, "VR4_RELATION_CARRIER", f"{page.a_id}.relation_carriers", "one carrier per R or none", "section missing"))
        else:
            page.relation_carriers = re.findall(r"(?m)^-\s+`?\[(R\d{3})\]`?：\s*(\S.*?)\s*$", relations)
        pages.append(page)
    return ParsedRough(frontmatter, pages, errors)


def _media(value: str) -> tuple[str | None, str | None]:
    if value == "none": return None, None
    match = re.fullmatch(r"(M\d{3})\s*/\s*([a-z_]+)", value)
    return (match.group(1), match.group(2)) if match else ("invalid", "invalid")


def _source_details(page: dict[str, Any]) -> tuple[str | None, list[str], list[dict[str, Any]]]:
    screen = page.get("screen") if isinstance(page.get("screen"), dict) else {}
    title = screen.get("title") if isinstance(screen.get("title"), dict) else {}
    groups = screen.get("groups") if isinstance(screen.get("groups"), list) else []
    return title.get("screen_item_id"), [g.get("group_id") for g in groups if isinstance(g, dict)], groups


def validate_visual_rough_v4(*, source_payload: dict[str, Any], source_sha256: str, rough_text: str, registry: dict[str, Any], catalog: dict[str, dict[str, str]] | None = None) -> dict[str, Any]:
    catalog = catalog or load_error_catalog()
    parsed = parse_visual_rough_v4(rough_text, catalog=catalog)
    errors = list(parsed.errors)
    def add(code: str, path: str, expected: Any, actual: Any) -> None: errors.append(_error(catalog, code, path, expected, actual))
    front = parsed.frontmatter
    if set(front) != REQUIRED_FRONTMATTER or front.get("schema_version") != SCHEMA_VERSION:
        add("VR4_FRONTMATTER_INVALID", "frontmatter", {"fields": sorted(REQUIRED_FRONTMATTER), "schema": SCHEMA_VERSION}, front)
    if source_payload.get("schema_version") != A_PAGE_SCHEMA_VERSION:
        add("VR4_SOURCE_SCHEMA", "source.schema_version", A_PAGE_SCHEMA_VERSION, source_payload.get("schema_version"))
    if front.get("episode_id") != source_payload.get("episode_id") or front.get("source_a_page_sha256", "").lower() != source_sha256.lower():
        add("VR4_SOURCE_INTEGRITY", "frontmatter.source", {"episode_id": source_payload.get("episode_id"), "sha256": source_sha256}, {"episode_id": front.get("episode_id"), "sha256": front.get("source_a_page_sha256")})
    if front.get("status") not in {"draft", "approved"} or front.get("document_kind") not in {"candidate", "production"}:
        add("VR4_FRONTMATTER_INVALID", "frontmatter.status", "draft/approved and candidate/production", {"status": front.get("status"), "document_kind": front.get("document_kind")})
    source_pages = [p for p in source_payload.get("pages", []) if isinstance(p, dict)]
    expected_a = [p.get("a_id") for p in source_pages]
    actual_a = [p.a_id for p in parsed.pages]
    if expected_a != actual_a or len(actual_a) != len(set(actual_a)): add("VR4_PAGE_SEQUENCE", "pages", expected_a, actual_a)
    source_by_a = {p.get("a_id"): p for p in source_pages}
    recipes = {r.get("recipe_id"): r for r in registry.get("recipes", []) if isinstance(r, dict)}
    evidence_ids = {e.get("evidence_id") for e in source_payload.get("evidence_catalog", []) if isinstance(e, dict)}
    all_units: list[str] = []; media_ids: list[str] = []; recipe_ids: list[str] = []
    ai_count = logic_count = 0; preflight_pages = []
    for page in parsed.pages:
        source = source_by_a.get(page.a_id, {})
        title_id, group_ids, groups = _source_details(source)
        known_s = {title_id}; guidance_texts: list[str] = []
        title = source.get("screen", {}).get("title", {}) if isinstance(source.get("screen"), dict) else {}
        if isinstance(title, dict) and isinstance(title.get("guidance_text"), str): guidance_texts.append(title["guidance_text"])
        for group in groups:
            for item in group.get("items", []) if isinstance(group.get("items"), list) else []:
                if isinstance(item, dict):
                    known_s.add(item.get("screen_item_id"))
                    if isinstance(item.get("guidance_text"), str): guidance_texts.append(item["guidance_text"])
        for text in guidance_texts:
            if text and text in rough_text: add("VR4_GUIDANCE_COPIED", page.a_id, "no guidance_text copied", text)
        for constraint in source.get("silent_constraints", []) if isinstance(source.get("silent_constraints"), list) else []:
            cid = constraint.get("constraint_id") if isinstance(constraint, dict) else None
            instruction = constraint.get("instruction") if isinstance(constraint, dict) else None
            if (cid and cid in page.visible_text) or (instruction and instruction in page.visible_text): add("VR4_SILENT_CONSTRAINT_VISIBLE", page.a_id, "absent from visible structure", cid or instruction)
        for unit in page.units:
            all_units.append(unit.unit_id)
            unknown = [gid for gid in unit.group_ids if gid not in group_ids]
            if unknown: add("VR4_GROUP_REFERENCE_UNKNOWN", f"{page.a_id}.{unit.unit_id}", group_ids, unknown)
        covered = {gid for unit in page.units for gid in unit.group_ids}
        missing_groups = [gid for gid in group_ids if gid not in covered]
        if missing_groups: add("VR4_GROUP_UNCOVERED", f"{page.a_id}.content_units", group_ids, sorted(covered))
        media_id, media_type = _media(page.fields.get("media_requirement", ""))
        if media_id == "invalid" or media_type not in MEDIA_TYPES | {None}:
            add("VR4_MEDIA_INVALID", f"{page.a_id}.media_requirement", "none or Mxxx / allowed type", page.fields.get("media_requirement")); media_id = None
        if media_id:
            media_ids.append(media_id); ai_count += int(media_type == "photorealistic_ai")
            evidence = page.fields.get("textbook_evidence")
            if media_type == "textbook_original" and evidence not in evidence_ids: add("VR4_MEDIA_EVIDENCE", f"{page.a_id}.textbook_evidence", sorted(evidence_ids), evidence)
            if media_type == "photorealistic_ai" and evidence != "none": add("VR4_MEDIA_EVIDENCE", f"{page.a_id}.textbook_evidence", "none", evidence)
        unit_ids = {u.unit_id for u in page.units}
        known_slots = {sid for sid in known_s if sid} | unit_ids | ({media_id} if media_id else set())
        for slot, source_id in page.slot_bindings:
            if source_id != "none" and source_id not in known_slots: add("VR4_SLOT_REFERENCE_UNKNOWN", f"{page.a_id}.slot_bindings.{slot}", sorted(known_slots), source_id)
        if media_id and media_id not in {source_id for _, source_id in page.slot_bindings}: add("VR4_MEDIA_SLOT_MISSING", f"{page.a_id}.slot_bindings", media_id, [source_id for _, source_id in page.slot_bindings])
        expected_relations = [r.get("relation_id") for r in source.get("protected_relations", []) if isinstance(r, dict)]
        actual_relations = [rid for rid, _ in page.relation_carriers]
        if sorted(expected_relations) != sorted(actual_relations) or len(actual_relations) != len(set(actual_relations)): add("VR4_RELATION_CARRIER", f"{page.a_id}.relation_carriers", expected_relations, actual_relations)
        recipe_id = page.fields.get("recipe_id", ""); recipe_ids.append(recipe_id); recipe = recipes.get(recipe_id)
        if not recipe or recipe.get("status") in {"blocked", "deprecated"} or (front.get("status") == "approved" and recipe.get("status") == "experimental"):
            add("VR4_RECIPE_INVALID", f"{page.a_id}.recipe_id", "eligible registered recipe", recipe_id); recipe = {}
        minimum, maximum = recipe.get("content_unit_min"), recipe.get("content_unit_max")
        if isinstance(minimum, int) and isinstance(maximum, int) and not minimum <= len(page.units) <= maximum: add("VR4_UNIT_COUNT", f"{page.a_id}.content_units", f"{minimum}-{maximum}", len(page.units))
        has_media = bool(media_id)
        if (recipe.get("media_mode") == "required" and not has_media) or (recipe.get("media_mode") == "forbidden" and has_media): add("VR4_RECIPE_MEDIA", f"{page.a_id}.media_requirement", recipe.get("media_mode"), has_media)
        logic = page.fields.get("logic_diagram") == "yes"; logic_count += int(logic)
        if logic and not (recipe.get("status") == "restricted" and recipe.get("is_logic_diagram") is True): add("VR4_LOGIC_RECIPE", f"{page.a_id}.logic_diagram", "specific restricted logic recipe", recipe_id)
        if not logic and recipe.get("is_logic_diagram"): add("VR4_LOGIC_RECIPE", f"{page.a_id}.logic_diagram", "yes", page.fields.get("logic_diagram"))
        preflight_pages.append({"a_id": page.a_id, "source": {"S": sorted(x for x in known_s if x), "G": group_ids, "R": expected_relations}, "recipe": {"requested": recipe_id, "eligible": bool(recipe), "content_unit_range": [minimum, maximum]}, "content_units": {"count": len(page.units), "uncovered_groups": missing_groups}, "media": {"required_by_recipe": recipe.get("media_mode") == "required", "binding": media_id}})
    expected_units = [f"U{i:03d}" for i in range(1, len(all_units) + 1)]
    if all_units != expected_units: add("VR4_UNIT_SEQUENCE", "content_units", expected_units, all_units)
    required_images = math.ceil(len(source_pages) / 3); expected_media = [f"M{i:03d}" for i in range(1, required_images + 1)]
    if media_ids != expected_media: add("VR4_MEDIA_QUOTA", "media", expected_media, media_ids)
    if required_images and ai_count <= required_images / 2: add("VR4_AI_MAJORITY", "media.photorealistic_ai", f"> {required_images / 2}", ai_count)
    for previous, current, page in zip(recipe_ids, recipe_ids[1:], parsed.pages[1:]):
        if previous == current: add("VR4_ADJACENT_RECIPE", f"{page.a_id}.recipe_id", "different from previous page", current)
    maximum_logic = 2 if any(r.get("status") == "restricted" and r.get("is_logic_diagram") for r in recipes.values()) else 0
    if logic_count > maximum_logic: add("VR4_LOGIC_LIMIT", "logic_diagrams", maximum_logic, logic_count)
    if len(source_pages) >= 10 and len(set(recipe_ids)) < 4: add("VR4_RECIPE_DIVERSITY", "pages.recipe_id", ">= 4 distinct recipes", len(set(recipe_ids)))
    return {"episode_id": source_payload.get("episode_id"), "validation_profile": "visual-rough-v4", "schema_version": front.get("schema_version"), "status": front.get("status"), "preflight": {"pages": preflight_pages}, "image_allocation": {"required_page_count": required_images, "assigned_page_count": len(media_ids)}, "logic_diagrams": {"page_limit": maximum_logic, "assigned_page_count": logic_count}, "errors": errors, "failures": [error["code"] for error in errors]}


def validate_visual_rough(**kwargs: Any) -> dict[str, Any]:
    """Public current-version entry point; no legacy dispatch or projection."""
    return validate_visual_rough_v4(**kwargs)
